export type DisclaimerEnv = Pick<typeof globalThis, 'document' | 'fetch'>

// disclaimer.html#41-44007 shows San Mateo's notice and returns to that precinct; #41 shows the notice alone.
const HASH = /^#(\d\d)(?:-[0-9A-Z]+)?$/i
const HEADING = /^[A-Z][A-Z ]*$/
const URL_TEXT = /(https?:\/\/\S+)/

// A paragraph's text, with each web address as a link.
function paragraph (document: Document, text: string): HTMLParagraphElement {
  const p = document.createElement('p')
  for (const part of text.split(URL_TEXT)) {
    if (!part) continue
    if (URL_TEXT.test(part)) p.append(Object.assign(document.createElement('a'), { href: part, textContent: part }))
    else p.append(part)
  }
  return p
}

// A county's DISCLAIMER.txt, as published, laid out like the privacy page: headings in capitals, paragraphs between blank lines.
export async function showDisclaimer ({ document, fetch }: DisclaimerEnv = globalThis): Promise<void> {
  const { location } = document.defaultView!
  const body = document.getElementById('disclaimer-text')!
  const plain = document.getElementById('plain-text')!
  const back = document.querySelector<HTMLAnchorElement>('#back')!
  const match = location.hash.match(HASH)
  if (!match) {
    body.append(paragraph(document, 'Pick a precinct in the lookup to see its county\'s data notice.'))
    return
  }
  const county = match[1]
  const file = `counties/${county}/DISCLAIMER.txt`
  plain.querySelector('a')!.href = file
  plain.hidden = false
  back.href = `./${location.hash.includes('-') ? location.hash : ''}`
  try {
    const reply = await fetch(file)
    if (!reply.ok) throw new Error(`${reply.status} ${file}`)
    const text = await reply.text()
    for (const block of text.trim().split(/\n\s*\n/)) {
      const words = block.replace(/\s*\n\s*/g, ' ').trim()
      if (HEADING.test(words)) body.append(Object.assign(document.createElement('h2'), { textContent: words[0] + words.slice(1).toLowerCase() }))
      else body.append(paragraph(document, words))
    }
  } catch {
    body.append(paragraph(document, "Sorry, the county's data notice couldn't be loaded. Please try again."))
  }
}
