# Developer notes

[README](../README.md)

## Files

Everything in `counties/` is published under `https://lookup.usegis.org/counties/`.

| File | What it holds |
| --- | --- |
| `index.json` | Each county's name and zipcodes |
| `<county>/streets/<zip>.json` | The ranges for one zipcode |
| `<county>/shapes/<zip>.json` | The outline of each precinct in that zipcode, as GeoJSON with the precinct as each feature's `id` |
| `<county>/shapes/index.json` | A zipcode for each precinct |
| `<county>/DISCLAIMER.txt` | The county's own words, its sources and how current they are, and any license |

The county is California's county number, which also starts each precinct number: 01 is
Alameda, 07 is Contra Costa, 38 is San Francisco, 41 is San Mateo, 43 is Santa Clara. A zipcode that crosses a county
line has a file in each county. Which races a precinct votes in is left to whatever app uses these files.

## How the ranges are built

- Where a county publishes its street data, the ranges come straight from it.
- Otherwise real addresses come first: each address point placed on the county's map, with
  runs of house numbers in one precinct on one side of a street becoming ranges.
- The rest of a street comes from Census, around those ranges. A side whose whole
  length falls in one precinct on the county's map gets that precinct.
- Otherwise it gets its block's precinct: the one with at least 90% of the block's voters.
- A side with neither gets no range.
- Neighboring ranges on one side with the same precinct merge, when their numbers
  are within 100 of each other.

| Source | What it gives |
| --- | --- |
| [Census TIGER 2026](https://www.census.gov/geographies/mapping-files/time-series/geo/tiger-line-file.html) `ADDRFEAT` | Address range on each side of each street segment, and the face it borders |
| Census TIGER 2026 `FACES` | Each face's Census block and ZCTA |
| [Statewide Database (SWDB)](https://statewidedatabase.org/) `c<county>_p26_rg_blk_map.csv` | Registered voter counts by precinct and Census block, June 2026 primary |
| County precinct shapes | Each precinct's shape |
| SWDB precinct shapes, where the county publishes none | Each precinct's shape, possibly out of date |
| County address points | Real addresses and where they are |
| County parcels with site addresses, where there are no address points | Each parcel's middle stands in for an address point |
| County street data, where there is one | Each address's precinct, from the county |

This repo publishes the ranges and the page that reads them; the build that makes `counties/` isn't part of it.

## Street ranges for your area

The files here cover California, but the lookup works anywhere: make files in the same layout for
your area, host them anywhere, and pass their address to `remoteSource()`.

- `index.json`: `{"41": {"name": "San Mateo County", "zipcodes": ["94025", ...]}}`, with a
  two-character key for each county, and `aliases` where a county-only zipcode (a government
  center's, like Ventura's 93009) is read as the one around it: `{"93009": "93003"}`.
- `<county>/streets/<zip>.json`: each street with its ranges, `[low, high, precinct]`, where `low`
  and `high` are on one side of the street (both odd or both even) and the precinct number starts
  with the county's key. Run each street name through the package's `normalizeStreet()`, so it
  matches what people type.
- `<county>/shapes/<zip>.json` and `<county>/shapes/index.json`, if you want a map; the lookup
  answers without them.

Build them from the best source you have, as [Sources](SOURCES.md) describes. Using a confidential voter file to
generate street ranges may not be an acceptable use of it; check with your county first. Public GIS layers are the safe
place to start.

## Publishing

The sample app is `public/`, with `public/main.js` built from `src/`. Pushing changes to `public/`
or `counties/` deploys it to GitHub Pages, using `.github/workflows/pages.yml`. The npm package is built from
`src/lookup.ts`; its page on npm shows this repo's README as of each publish.
