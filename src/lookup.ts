// Address to precinct: parse an address, match it against a county's street ranges, and answer with the precinct.
import type { Feature, FeatureCollection, Polygon } from 'geojson'

export type Range = [low: number, high: number, precinct: string]
export type Streets = Record<string, Range[]>
export type Index = Record<string, { name: string, zipcodes: string[], aliases?: Record<string, string> }>
export type Shapes = FeatureCollection<Polygon>
export interface Source {
  index: () => Promise<Index>
  file: (county: string, zip: string) => Promise<Streets>
  mapIndex: (county: string) => Promise<Record<string, string>>
  maps: (county: string, zip: string) => Promise<Shapes>
}
export interface Found { county: string, number: string, zip: string }
export interface Answer { text: string, found?: Found }
export interface Address { number: number, street: string, zip: string | null }

const STREET_WORDS: Record<string, string> = {
  STREET: 'ST',
  AVENUE: 'AVE',
  AV: 'AVE',
  ROAD: 'RD',
  DRIVE: 'DR',
  LANE: 'LN',
  COURT: 'CT',
  PLACE: 'PL',
  CIRCLE: 'CIR',
  BOULEVARD: 'BLVD',
  TERRACE: 'TER',
  PARKWAY: 'PKWY',
  HIGHWAY: 'HWY',
  TRAIL: 'TRL',
  NORTH: 'N',
  SOUTH: 'S',
  EAST: 'E',
  WEST: 'W',
  FIRST: '1ST',
  SECOND: '2ND',
  THIRD: '3RD',
  FOURTH: '4TH',
  FIFTH: '5TH',
  SIXTH: '6TH',
  SEVENTH: '7TH',
  EIGHTH: '8TH',
  NINTH: '9TH',
  TENTH: '10TH',
  ELEVENTH: '11TH',
  TWELFTH: '12TH'
}

// Street types only as the last word, so HILL RD and PLAZA N keep their names.
const LAST_WORDS: Record<string, string> = {
  ALLEY: 'ALY',
  PLAZA: 'PLZ',
  HILL: 'HL',
  SQUARE: 'SQ',
  CROSSING: 'XING',
  LP: 'LOOP',
  TERR: 'TER',
  // County abbreviations, as Los Angeles writes WY for Way
  WY: 'WAY',
  BL: 'BLVD',
  CI: 'CIR',
  CR: 'CIR',
  CM: 'CMN',
  TL: 'TRL',
  TE: 'TER',
  WK: 'WALK',
  AL: 'ALY',
  GL: 'GLN',
  PY: 'PKWY',
  HY: 'HWY'
}

const UNIT = /\s+(?:(?:APT|UNIT|STE|SUITE|SPC|OFC|BLDG|RM|FL|LOT|TRLR|LOWR|UPPR|REAR|FRNT|BSMT|PH)\b|#).*$/

export function normalizeStreet (street: string): string {
  const words = street.toUpperCase().replace(/[.'’]/g, '').replace(UNIT, '')
    .split(/\s+/).filter(Boolean).map((word) => STREET_WORDS[word] ?? word)
  if (words[0] === 'SAINT') words[0] = 'ST'
  if (words.length > 1) words[words.length - 1] = LAST_WORDS[words[words.length - 1]] ?? words[words.length - 1]
  return words.join(' ').replace(/^COUNTY RD\b/, 'CO RD').replace(/^ALAMEDA DE LAS PULGAS$/, 'ALAMEDA')
}

// One address, never a range: Lassen's 716-498 is 716498, and 651-25 is 651025.
function houseNumber (first: string, after?: string): number {
  return parseInt(after ? first + after.padStart(3, '0') : first, 10)
}

export function parseAddress (text: string): Address | null {
  let rest = text.toUpperCase().replace(/\s+/g, ' ').trim()
  const zipMatch = rest.match(/\b(\d{5})(-\d{4})?$/)
  if (zipMatch) rest = rest.slice(0, zipMatch.index).trim()
  rest = rest.replace(/,?\s*(CA|CALIFORNIA)$/, '').trim()
  // A place name first, as Google Maps copies it ("Modoc Medical Center, 1111 N Nagle St"), is skipped.
  const part = rest.split(',').map((piece) => piece.trim()).find((piece) => /^\d/.test(piece)) ?? ''
  const match = part.match(/^(\d+)(?:-(\d+))?\S*\s+(.+)$/)
  return match && { number: houseNumber(match[1], match[2]), street: normalizeStreet(match[3]), zip: zipMatch && zipMatch[1] }
}

// Exact, or missing its N/S/E/W; then a known street followed by a city; then missing its St/Ave.
function matchingStreets (names: string[], typed: string): string[] {
  // Both spellings of a direction count, as data can hold W CIVIC CENTER DR and CIVIC CENTER DR W side by side.
  const moved = /^[NSEW] /.test(typed) ? `${typed.slice(2)} ${typed[0]}` : typed.replace(/^(.+) ([NSEW])$/, '$2 $1')
  const exact = names.filter((name) => name === typed || name === moved)
  if (!exact.length) exact.push(...names.filter((name) => /^[NSEW] /.test(name) && name.slice(2) === typed))
  if (exact.length) return exact
  const withCity = names.filter((name) => typed.startsWith(`${name} `))
  if (withCity.length) {
    const longest = Math.max(...withCity.map((name) => name.length))
    return withCity.filter((name) => name.length === longest)
  }
  const untyped = names.filter((name) => name.startsWith(`${typed} `))
  return untyped.length ? untyped : otherType(names, typed)
}

// The same street with another type, as Sheriff Cady Ln for the Census's Sheriff Cady Rd.
const TYPES = /^(?:ST|AVE|RD|LN|DR|CT|WAY|PL|BLVD|CIR|TER|PKWY|HWY|TRL|LOOP|ALY|PLZ|SQ|XING|HL|RUN|PATH|ROW|WALK)$/
function otherType (names: string[], typed: string): string[] {
  const base = (name: string): string | null => {
    const words = name.split(' ')
    return words.length > 1 && TYPES.test(words[words.length - 1]) ? words.slice(0, -1).join(' ') : null
  }
  const typedBase = base(typed)
  return typedBase ? names.filter((name) => base(name) === typedBase) : []
}

// A state or US highway by any of its names: Hwy 139, CA-139, State Rte 139. Not Old Hwy 49 or Co Hwy 20.
const HIGHWAY = /^(?:([NSEW]) )?(?:(?:(?:STATE|ST|CA|CALIFORNIA|US) )?(?:HWY|RTE|RT|ROUTE) |(?:STATE|CALIFORNIA) |(?:SR|CA|US)[ -])(\d+[A-Z]?)(?: (?:HWY|RD|ST|AVE))?(?: ([NSEW]))?$/
function sameHighway (names: string[], typed: string): string[] {
  const wanted = typed.match(HIGHWAY)
  if (!wanted) return []
  const side = (match: RegExpMatchArray) => match[1] ?? match[3]
  return names.filter((name) => {
    const highway = name.match(HIGHWAY)
    return highway?.[2] === wanted[2] && (!side(wanted) || !side(highway) || side(highway) === side(wanted))
  })
}

function precinctsIn (streets: Streets, { number, street }: Address): string[] {
  const names = Object.keys(streets)
  const inRange = (name: string) => {
    const range = streets[name].find(([low, high]) => low % 2 === number % 2 && low <= number && number <= high)
    return range ? [range[2]] : []
  }
  const found = matchingStreets(names, street).flatMap(inRange)
  return found.length ? found : sameHighway(names, street).flatMap(inRange)
}

export async function lookup (text: string, source: Source): Promise<Answer> {
  const address = parseAddress(text)
  if (!address) return { text: 'Please enter a street address, starting with the house number.' }
  if (!address.zip) return { text: 'Please include the zip code.' }
  const counties = await source.index()
  // A county-only zipcode (92415, 93009) is read as the one around it.
  const zip = Object.values(counties).map((c) => c.aliases?.[address.zip as string]).find(Boolean) ?? address.zip
  const listed = Object.keys(counties).filter((county) => counties[county].zipcodes.includes(zip))
  if (!listed.length) return { text: 'Invalid address' }
  const files = await Promise.all(listed.map((county) => source.file(county, zip)))
  const found = new Set(files.flatMap((streets) => precinctsIn(streets, address)))
  if (found.size > 1) return { text: "There's more than one match. Please add St, Ave, etc." }
  const [precinct] = found
  if (!precinct) return { text: "Sorry, that address isn't in the street ranges." }
  const county = precinct.slice(0, 2)
  const number = precinct.slice(2).replace(/^0+/, '')
  return { text: `${number}: ${counties[county].name}`, found: { county, number, zip } }
}

export async function lookupLink (county: string, number: string, source: Source): Promise<Answer> {
  const name = (await source.index())[county]?.name
  const zip = (await source.mapIndex(county))[number]
  if (!name || !zip) return { text: `Sorry, there's no map for ${county}-${number}.` }
  return { text: `${number}: ${name}`, found: { county, number, zip } }
}

// The files published at precinct.netpress.com, which allow any site to fetch them.
export const DATA = 'https://precinct.netpress.com/counties/'
const NO_SHAPES: Shapes = { type: 'FeatureCollection', features: [] }

// The published files, or a copy at another address; a file that isn't there reads as empty.
export function remoteSource (base: string = DATA, fetcher: (url: string) => Promise<Response> = (url) => fetch(url)): Source {
  const get = <T>(path: string, none: T): Promise<T> => fetcher(`${base}${path}.json`).then((reply) => reply.ok ? reply.json() : none)
  return {
    index: () => get('index', {}),
    file: (county, zip) => get(`${county}/streets/${zip}`, {}),
    mapIndex: (county) => get(`${county}/shapes/index`, {}),
    maps: (county, zip) => get(`${county}/shapes/${zip}`, NO_SHAPES)
  }
}

// The found precinct's outline, for a map; a county without outlines has none.
export async function outline ({ county, number, zip }: Found, source: Source): Promise<Feature<Polygon> | undefined> {
  return (await source.maps(county, zip)).features.find((feature) => feature.id === number)
}
