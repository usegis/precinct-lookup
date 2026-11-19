# Sources

Every California county publishes precinct data. This page describes how it is read and transformed into
the street ranges and precinct outlines the lookup uses.

## The approach

The lookup needs two simple, public things from each county: its addresses and its precinct
boundaries. From them come street ranges by zipcode (`[low, high, precinct]` on each side of
a street) and a precinct outline for the map. The
[precinct-lookup](https://www.npmjs.com/package/precinct-lookup) package reads those files, making public precinct
information easier to use, for any purpose; a county could use it to launch its own election lookup.

That design is private by default:

- **No voter data.** The ranges come from public map layers, never from the voter file.
- **The address stays on the device.** The lookup runs in the browser and fetches only the
  files for the typed zipcode; the map's tiles show the area on screen, never the address.
- **No scraping.** Where a county publishes a layer, tools like this one read it as is,
  instead of querying map viewers or geocoders one address at a time.

Every county is built from the best it publishes; where a piece is missing, two statewide
sources stand in for it:

- **TIGER:** the Census Bureau's street map, updated every year. For each side of each street
  segment it gives the range of possible house numbers and the zipcode, but not which numbers
  are real homes, or any precinct.
- **The Statewide Database (SWDB):** California's redistricting database, run at UC Berkeley
  for the Legislature. After each election it publishes every county's precinct boundaries, and
  how many registered voters each precinct has in each Census block.

## Street ranges

[GIS data by county](GIS_DATA.md) lists what each county publishes and which way it's built.

- **Street data:** the most accurate source, each address with the precinct the county itself
  assigns it. Ranges are just runs of house numbers in one precinct, with nothing to guess.
- **Address points:** most counties publish each address with its location, but not its
  precinct. Each point is placed on the precinct map, and neighbors on one side of a street are
  joined into ranges, with TIGER filling the rest of each street. Where points are a few years
  old, newer homes come from parcels or TIGER.
- **Parcels:** some smaller counties publish parcels with a site address, which already go a
  long way. The middle of each parcel stands in for the address, and is placed on the
  precinct map the same way. It's less exact: a parcel has one address however many homes it
  holds, and its middle can sit far from the door on a large lot. Only the site address is
  read, never an owner's mailing address. A public address layer would make each of these as
  exact as the address-point counties.
- **TIGER and SWDB:** where a county hasn't published its addresses yet, ranges come from
  TIGER's address ranges, placed in precincts with SWDB's voters by Census block. That's about
  97% right in a city, less in the country. One public layer changes this: Inyo, a county of
  18,000 people, publishes each address with its precinct, and its ranges are 99.9% right.

## Precinct shapes

- **Live layer or shapefile:** most counties publish their precinct boundaries, as a live map
  layer read at each build, or a shapefile.
- **Table of addresses:** where a county's street data gives each address's precinct, that
  decides the ranges, and the shapes only draw the map.
- **SWDB map:** where a county hasn't published its own, SWDB's map stands in. SWDB builds its
  map after each election from what counties report, so it shows the last election's precincts,
  published months later. A "what's my precinct" lookup is needed before an election, when
  counties have already redrawn or merged precincts for it: June's lines put 0.69% of Contra
  Costa's addresses and 2.1% of Solano's in the wrong precinct for November. One public layer
  of the county's own precincts for the coming election closes that gap.

## Checking the results

For each county, the build measures the share of its own addresses the ranges answer. San
Francisco's street data, ignored and then used as the answer key, measures the methods
themselves; `npm run civic` tries every county's elections office and the largest counties'
courthouses and jails; and [Public precinct data](PUBLIC_PRECINCT_DATA.md) explains why
counties publishing each address's precinct ahead of each election matters most.

## Counties leading the way

- **Each address with its precinct:** San Francisco, Monterey, San Benito and Inyo publish it,
  and El Dorado's can be requested. Nothing to guess: the county's own answer, address by
  address.
- **Current precincts, ready for the next election:** Los Angeles, San Diego, Sacramento,
  Alameda, Solano, Butte and others keep a live precinct layer; Santa Barbara posts each
  election's shapefile, and Placer sent its September map within days of being asked.
- **Every address, kept current:** most counties publish address points as a live layer, and
  San Joaquin's Public Works posts parcels with site addresses, updated this month.

Inyo shows how far a small county can go: its GIS team publishes every address with its
precinct, supervisor and districts, and its ranges are 99.9% right.

## A little more goes a long way

Most counties already publish one of the two pieces. The other is usually a layer the county
keeps anyway:

- **Precincts for the coming election,** as a public layer, as soon as they're set. That's when
  people look up their precinct, and months before SWDB publishes the lines.
- **Addresses with a location,** as address points or parcels with a site address. Adding
  each address's precinct, as Inyo does, makes the county's own answer the lookup's answer.

## No GIS? No problem

Three things any county office can do with what it already has:

1. **Post your street index.** Elections systems keep each street's house-number ranges with
   their precinct, and can export them as a spreadsheet. Posted on the county website, it's all
   a lookup needs.
2. **Share your 9-1-1 address points.** Dispatch keeps every address with its location. A copy
   as a spreadsheet, with latitude and longitude, works as well as any GIS layer.
3. **Put a spreadsheet on a map.** A list with latitude and longitude columns becomes a public
   map layer in a few minutes with a free mapping account, such as ArcGIS Online.

## A lookup your county owns

Once a county keeps a current, public layer on whatever GIS system it already uses (its
precinct boundaries for the coming election, and its addresses, ideally with each one's
precinct, as Inyo publishes), the street ranges here stay as current as the county's own data.
The county can then publish its own tools on top of them, such as a lookup that shows each
address's districts, at no cost and without depending on this project.
[Your own county lookup](COUNTY_LOOKUP.md) shows how to set one up on a free host, such as
GitHub Pages or the county's own website.
