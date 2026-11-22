#!/usr/bin/env node
/* global process */
import { realpathSync } from 'node:fs'
import { mkdir, readdir, readFile, rm, writeFile } from 'node:fs/promises'
import { join } from 'node:path'
import { fileURLToPath } from 'node:url'

export const DATA = 'https://lookup.usegis.org/counties/'

const USAGE = `Usage: npx precinct-lookup fetch <county>... [--dir counties]

Copies a county's street ranges, precinct outlines and DISCLAIMER.txt from
${DATA} into a local counties/ folder, in the same layout, and
updates them when run again. A county is its two-digit number or its name:
  npx precinct-lookup fetch 41
  npx precinct-lookup fetch "San Mateo" "Santa Clara" --dir public/counties
Then point the lookup at your copy: remoteSource('https://your.site/counties/').`

// A county's number from "41", "San Mateo" or "san-mateo-county".
export function findCounty (index, wanted) {
  const key = (text) => text.toLowerCase().replace(/[^a-z0-9]+/g, ' ').replace(/ county$/, '').trim()
  if (index[wanted.padStart(2, '0')]) return wanted.padStart(2, '0')
  return Object.keys(index).find((county) => key(index[county].name) === key(wanted))
}

// One county per line, as the published index.json is written.
export function writeIndex (index) {
  const lines = Object.keys(index).sort().map((county) => `  ${JSON.stringify(county)}: ${JSON.stringify(index[county])}`)
  return `{\n${lines.join(',\n')}\n}\n`
}

const read = (path) => readFile(path, 'utf8').catch(() => undefined)

async function inBatches (items, size, task) {
  for (let i = 0; i < items.length; i += size) await Promise.all(items.slice(i, i + size).map(task))
}

// Copies one county's files into dir; returns counts of new, updated, unchanged and removed files.
export async function fetchCounty (county, index, { dir, base = DATA, fetcher = fetch }) {
  const counts = { new: 0, updated: 0, unchanged: 0, removed: 0 }
  const kept = new Set(['DISCLAIMER.txt', 'shapes/index.json'])
  const paths = ['DISCLAIMER.txt', 'shapes/index.json']
  for (const zip of index[county].zipcodes) {
    paths.push(`streets/${zip}.json`, `shapes/${zip}.json`)
    kept.add(`streets/${zip}.json`).add(`shapes/${zip}.json`)
  }
  await inBatches(paths, 8, async (path) => {
    const reply = await fetcher(`${base}${county}/${path}`)
    if (!reply.ok) return
    const body = await reply.text()
    const file = join(dir, county, path)
    const old = await read(file)
    if (old === body) return counts.unchanged++
    await mkdir(join(file, '..'), { recursive: true })
    await writeFile(file, body)
    counts[old === undefined ? 'new' : 'updated']++
  })
  for (const folder of ['streets', 'shapes']) {
    const names = await readdir(join(dir, county, folder)).catch(() => [])
    for (const name of names.filter((name) => name.endsWith('.json') && !kept.has(`${folder}/${name}`))) {
      await rm(join(dir, county, folder, name))
      counts.removed++
    }
  }
  return counts
}

export async function main (args, { base = DATA, fetcher = fetch, log = console.log } = {}) {
  const at = args.indexOf('--dir')
  const dir = at >= 0 ? args[at + 1] : 'counties'
  const wanted = args.filter((arg, i) => i > 0 && arg !== '--dir' && i !== at + 1)
  if (args[0] !== 'fetch' || !wanted.length || !dir) {
    log(USAGE)
    return 1
  }
  const reply = await fetcher(`${base}index.json`)
  if (!reply.ok) {
    log(`Couldn't read ${base}index.json (${reply.status}).`)
    return 1
  }
  const index = JSON.parse(await reply.text())
  const counties = wanted.map((name) => [name, findCounty(index, name)])
  const unknown = counties.filter(([, county]) => !county).map(([name]) => name)
  if (unknown.length) {
    log(`No county named ${unknown.join(', ')}. Use a number from 01 to 58 or a county name.`)
    return 1
  }
  for (const [, county] of counties) {
    const c = await fetchCounty(county, index, { dir, base, fetcher })
    log(`${index[county].name} (${county}): ${c.new} new, ${c.updated} updated, ${c.unchanged} unchanged, ${c.removed} removed in ${join(dir, county)}`)
  }
  const local = JSON.parse(await read(join(dir, 'index.json')) ?? '{}')
  for (const [, county] of counties) local[county] = index[county]
  await mkdir(dir, { recursive: true })
  await writeFile(join(dir, 'index.json'), writeIndex(local))
  log('Each county\'s DISCLAIMER.txt names its sources and license; keep it with the files.')
  return 0
}

if (process.argv[1] && fileURLToPath(import.meta.url) === realpathSync(process.argv[1])) {
  process.exitCode = await main(process.argv.slice(2))
}
