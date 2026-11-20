// @vitest-environment jsdom
import { readFileSync } from 'node:fs'
import { beforeEach, describe, expect, it, vi } from 'vitest'
import { justBeforeEach } from 'penultimate'
import { showDisclaimer } from '../../src/disclaimer.ts'

const NOTICE = `DATA

The data provided through this project is for informational purposes only. While
we strive to maintain accurate and up-to-date information.

SOURCES

Precinct map is a live layer published by San Mateo County.
https://github.com/woodie/street-ranges#sources
`

describe('showDisclaimer', () => {
  let fetchFile: ReturnType<typeof vi.fn>
  let files: Record<string, unknown>

  const reply = (body: unknown) => ({ ok: body !== undefined, status: body === undefined ? 404 : 200, text: async () => body })
  const text = () => document.getElementById('disclaimer-text')!
  const back = () => document.querySelector<HTMLAnchorElement>('#back')!

  beforeEach(() => {
    document.documentElement.innerHTML = readFileSync('public/disclaimer.html', 'utf8')
    files = { 'counties/41/DISCLAIMER.txt': NOTICE }
    fetchFile = vi.fn(async (url: string) => reply(files[url]))
    history.replaceState(null, '', '/disclaimer.html#41-44007')
  })

  justBeforeEach(async () => {
    await showDisclaimer({ document, fetch: fetchFile as unknown as typeof fetch })
  })

  context('from a precinct', () => {
    it('turns the headings in capitals into headings', () => {
      expect([...text().querySelectorAll('h2')].map((h) => h.textContent)).toEqual(['Data', 'Sources'])
    })

    it('joins the wrapped lines into paragraphs', () => {
      expect(text().querySelector('p')!.textContent).toBe(
        'The data provided through this project is for informational purposes only. While we strive to maintain accurate and up-to-date information.')
    })

    it('links web addresses', () => {
      expect(text().querySelector('a')!.getAttribute('href')).toBe('https://github.com/woodie/street-ranges#sources')
      expect(text().querySelectorAll('p')[1].textContent).toBe(
        'Precinct map is a live layer published by San Mateo County. https://github.com/woodie/street-ranges#sources')
    })

    it('returns to the precinct', () => {
      expect(back().getAttribute('href')).toBe('./#41-44007')
    })
  })

  context('from a hyphenated precinct', () => {
    beforeEach(() => { history.replaceState(null, '', '/disclaimer.html#41-10-0512') })

    it('returns to the precinct', () => {
      expect(back().getAttribute('href')).toBe('./#41-10-0512')
    })
  })

  context('from a county alone', () => {
    beforeEach(() => { history.replaceState(null, '', '/disclaimer.html#41') })

    it('returns to the empty lookup', () => {
      expect(back().getAttribute('href')).toBe('./')
    })
  })

  context('when the notice is missing', () => {
    beforeEach(() => { delete files['counties/41/DISCLAIMER.txt'] })

    it('asks to try again', () => {
      expect(text().textContent).toBe("Sorry, the county's data notice couldn't be loaded. Please try again.")
    })
  })

  context('with no county', () => {
    beforeEach(() => { history.replaceState(null, '', '/disclaimer.html') })

    it('points back to the lookup', () => {
      expect(text().textContent).toBe("Pick a precinct in the lookup to see its county's data notice.")
      expect(fetchFile).not.toHaveBeenCalled()
    })
  })
})
