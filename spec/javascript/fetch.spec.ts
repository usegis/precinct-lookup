import { mkdtempSync, readFileSync, readdirSync, rmSync, writeFileSync, mkdirSync, existsSync } from 'node:fs'
import { tmpdir } from 'node:os'
import { join } from 'node:path'
import { afterEach, beforeEach, describe, expect, it } from 'vitest'
import { justBeforeEach } from 'penultimate'
import { findCounty, main, writeIndex } from '../../bin/precinct-lookup.js'

const BASE = 'https://example.test/counties/'
const INDEX = {
  41: { name: 'San Mateo County', zipcodes: ['94025', '94061'] },
  43: { name: 'Santa Clara County', zipcodes: ['95110'] }
}

describe('npx precinct-lookup fetch', () => {
  let dir: string
  let args: string[]
  let files: Record<string, string>
  let lines: string[]
  let code: number

  const reply = (body?: string) => ({ ok: body !== undefined, status: body === undefined ? 404 : 200, text: async () => body })
  const local = (path: string) => readFileSync(join(dir, path), 'utf8')

  beforeEach(() => {
    dir = mkdtempSync(join(tmpdir(), 'fetch-'))
    lines = []
    files = {
      'index.json': JSON.stringify(INDEX),
      '41/DISCLAIMER.txt': 'San Mateo County\n',
      '41/shapes/index.json': '{"44013":"94025"}',
      '41/streets/94025.json': '{"LAUREL ST":[[701,799,"4144013"]]}',
      '41/shapes/94025.json': '{"type":"FeatureCollection","features":[]}',
      '41/streets/94061.json': '{}'
    }
  })

  afterEach(() => { rmSync(dir, { recursive: true, force: true }) })

  justBeforeEach(async () => {
    const fetcher = async (url: string) => reply(files[url.slice(BASE.length)])
    code = await main(args, { base: BASE, fetcher: fetcher as unknown as typeof fetch, log: (line: string) => lines.push(line) })
  })

  context('with a county number', () => {
    beforeEach(() => { args = ['fetch', '41', '--dir', dir] })

    it('copies its files in the published layout', () => {
      expect(code).toBe(0)
      expect(local('41/streets/94025.json')).toBe(files['41/streets/94025.json'])
      expect(local('41/DISCLAIMER.txt')).toBe('San Mateo County\n')
      expect(readdirSync(join(dir, '41/shapes')).sort()).toEqual(['94025.json', 'index.json'])
    })

    it('writes an index with just that county', () => {
      expect(Object.keys(JSON.parse(local('index.json')))).toEqual(['41'])
    })

    it('counts the new files', () => {
      expect(lines[0]).toBe(`San Mateo County (41): 5 new, 0 updated, 0 unchanged, 0 removed in ${join(dir, '41')}`)
    })
  })

  context('run again after an update', () => {
    beforeEach(() => {
      args = ['fetch', 'san mateo county', '--dir', dir]
      mkdirSync(join(dir, '41/streets'), { recursive: true })
      writeFileSync(join(dir, '41/streets/94025.json'), '{}')
      writeFileSync(join(dir, '41/streets/94401.json'), '{}')
      writeFileSync(join(dir, 'index.json'), writeIndex({ 43: INDEX[43] }))
    })

    it('updates changed files and removes dropped zipcodes', () => {
      expect(local('41/streets/94025.json')).toBe(files['41/streets/94025.json'])
      expect(existsSync(join(dir, '41/streets/94401.json'))).toBe(false)
      expect(lines[0]).toMatch(/: 4 new, 1 updated, 0 unchanged, 1 removed /)
    })

    it('keeps the other counties in the index', () => {
      expect(Object.keys(JSON.parse(local('index.json')))).toEqual(['41', '43'])
    })
  })

  context('with a county that isn\'t there', () => {
    beforeEach(() => { args = ['fetch', 'Nowhere', '--dir', dir] })

    it('says so', () => {
      expect(code).toBe(1)
      expect(lines[0]).toMatch(/^No county named Nowhere/)
    })
  })

  context('without a county', () => {
    beforeEach(() => { args = ['fetch'] })

    it('shows how to use it', () => {
      expect(code).toBe(1)
      expect(lines[0]).toMatch(/^Usage: npx precinct-lookup fetch/)
    })
  })

  context('when the site is down', () => {
    beforeEach(() => {
      args = ['fetch', '41', '--dir', dir]
      delete files['index.json']
    })

    it('says it couldn\'t read the index', () => {
      expect(code).toBe(1)
      expect(lines[0]).toBe(`Couldn't read ${BASE}index.json (404).`)
    })
  })
})

describe('findCounty', () => {
  it('reads a number with or without its zero', () => {
    expect(findCounty({ '01': { name: 'Alameda County' } }, '1')).toBe('01')
  })

  it('reads a hyphenated name', () => {
    expect(findCounty(INDEX, 'santa-clara')).toBe('43')
  })
})
