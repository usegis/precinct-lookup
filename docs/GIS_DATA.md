# GIS data by county

Every California county publishes its precincts directly or indirectly (after each election) through
the Statewide Database (SWDB). Most counties publish current precincts and addresses themselves, nearly all as
live ArcGIS layers or downloadable files. Each county's sources are below, grouped by how its street
ranges are built. [Sources](SOURCES.md) explains the approach.

## Street data

Each address with its precinct. The county publishes the house number, street, zipcode and precinct from its
election or GIS system, so the lookup gives the county's own answer. This is extremely accurate.

| County | Street data | Precinct map |
| --- | --- | --- |
| El Dorado (192K) | Request, 11/26 | Request, 11/26 |
| Inyo (18K) | [Live layer](https://gis.inyo.gov/server/rest/services/AttributedAddresses/FeatureServer/0)† | [Live layer](https://gis.inyo.gov/server/rest/services/Election_Precincts/FeatureServer/1)† |
| Monterey (434K) | [File, 8/26](https://www.countyofmonterey.gov/government/departments-a-h/elections/candidates/voter-data-and-gis-shape-files/) | [File, 8/26](https://www.countyofmonterey.gov/government/departments-a-h/elections/candidates/voter-data-and-gis-shape-files/) |
| San Benito (70K) | [Live layer](https://services2.arcgis.com/NjMFCzThTMQy3AJa/arcgis/rest/services/ArcOnline_Addresses/FeatureServer/0) | [Live layer](https://services2.arcgis.com/NjMFCzThTMQy3AJa/arcgis/rest/services/San_Benito_County_Base_Precincts_2026/FeatureServer/2) |
| San Francisco (826K) | [File, 10/26](https://sfelections.org/tools/election_data/datasets.php) | [File, 12/25](https://sfelections.org/tools/election_data/datasets.php) |
| Tehama (65K) | [Layer, 9/25](https://services2.arcgis.com/3iNbxbY9zhyxPvde/arcgis/rest/services/Tehama_Voter_Registration_Precincts_2025_UMWjJf/FeatureServer/0) | [Layer, 2025](https://services2.arcgis.com/3iNbxbY9zhyxPvde/arcgis/rest/services/Precinct_Blocks_2025_By_Registered_Voters/FeatureServer/0) |

## Address points

Each address with its location, placed on a precinct map. The county publishes the address points and its precinct
map; otherwise a (possibly out-of-date) SWDB map is used. This is very accurate.

| County | Precinct map | Addresses |
| --- | --- | --- |
| Alameda (1.6M) | [Live layer](https://services5.arcgis.com/ROBnTHSNjoZ2Wm1P/ArcGIS/rest/services/Voter_Precincts/FeatureServer/0) | [Live layer](https://services5.arcgis.com/ROBnTHSNjoZ2Wm1P/ArcGIS/rest/services/Address_Points/FeatureServer/0) |
| Amador (42K) | [Live layer](https://services9.arcgis.com/Z65sx307Hunxj6eq/arcgis/rest/services/Elections/FeatureServer/3) | [Live layer](https://services9.arcgis.com/Z65sx307Hunxj6eq/arcgis/rest/services/Address_Points/FeatureServer/0) |
| Butte (209K) | [Live layer](https://services.arcgis.com/3t3QfTXFRFX44zo8/arcgis/rest/services/Election_Precincts_BCD/FeatureServer/0) | [Layer, 2024](https://gisportal.buttecounty.net/arcgis/rest/services/Addresses_with_Supervisor/FeatureServer/0) |
| Calaveras (47K) | [Live layer](https://gisportal.calaverascounty.gov/server/rest/services/Hosted/ELECTIONS_PRECINCTS_PUBLIC/FeatureServer/2) | [Live layer](https://gisportal.calaverascounty.gov/server/rest/services/Hosted/ADDRESSING_POINTS_PUBLIC/FeatureServer/0) |
| Contra Costa (1.2M) | [Live layer](https://services3.arcgis.com/42Dx6OWonqK9LoEE/arcgis/rest/services/Precinct_Boundary/FeatureServer/0) | [File, 10/25](https://gis.cccounty.us/Downloads/General%20County%20Data/CCC_DOIT_AddressData.zip) |
| Fresno (1.0M) | [Live layer](https://services3.arcgis.com/ibgDyuD2DLBge82s/arcgis/rest/services/ELECTIONS_PRECINCT_VW/FeatureServer/15) | [Live layer](https://services3.arcgis.com/ibgDyuD2DLBge82s/arcgis/rest/services/REGIONAL_ADDRESS_VW/FeatureServer/1) |
| Kern (927K) | [Live layer](https://services5.arcgis.com/Y8jwjGUWbRjuqpG5/arcgis/rest/services/Precinct_Boundaries_gdb/FeatureServer/0) | [Several layers](https://gis.bakersfieldcity.us/webmaps/rest/services/General/Addresses/MapServer/0) |
| Kings (154K) | [SWDB, 6/26](https://statewidedatabase.org/) | [Live layer](https://services3.arcgis.com/24gLq1DBBzDfd0cZ/arcgis/rest/services/Elections_Address/FeatureServer/0) |
| Los Angeles (9.7M) | [Live layer](https://services.arcgis.com/RmCCgQtiZLDCtblq/ArcGIS/rest/services/Registrar_Recorder_Precincts/FeatureServer/0) | [Live layer](https://services.arcgis.com/RmCCgQtiZLDCtblq/ArcGIS/rest/services/eGIS_Addressing_ADDRESS_POINTSv2/FeatureServer/0) |
| Madera (168K) | [Live layer](https://gis.maderacounty.com/server/rest/services/Election_Information/Election/FeatureServer/6)† | [Live layer](https://gis.maderacounty.com/server/rest/services/Election_Information/Election/FeatureServer/0)† |
| Marin (254K) | [Live layer](https://services6.arcgis.com/T8eS7sop5hLmgRRH/arcgis/rest/services/Subprecincts/FeatureServer/7) | [Live layer](https://services6.arcgis.com/T8eS7sop5hLmgRRH/arcgis/rest/services/SITUS_ADDRESS_POINT/FeatureServer/0) |
| Mariposa (17K) | [Live layer](https://services2.arcgis.com/wEula7SYiezXcdRv/arcgis/rest/services/Voting_Precincts_2021_public_view/FeatureServer/15) | [Live layer](https://services2.arcgis.com/wEula7SYiezXcdRv/arcgis/rest/services/Mariposa_County_Current_Site_Addresses_and_Entrance_Points_view/FeatureServer/0) |
| Mendocino (88K) | [Live layer](https://services5.arcgis.com/8y4r60VTvWj2wnDH/arcgis/rest/services/Voter_Precincts_2026_view/FeatureServer/0) | Request, 11/26 |
| Merced (297K) | [Live layer](https://gis.countyofmerced.com/server/rest/services/Hosted/Precincts_2026/FeatureServer/0) | [Live layer](https://gis.countyofmerced.com/server/rest/services/Site_Address_Points/FeatureServer/0) |
| Mono (13K) | [Live layer](https://gis.mono.ca.gov/webgis/rest/services/OpenData/Districts/MapServer/22) | [Live layer](https://gis.mono.ca.gov/webgis/rest/services/OpenData/e911/MapServer/2) |
| Napa (133K) | [Live layer](https://gis.napacounty.gov/arcgis/rest/services/Hosted/Precincts_2022/FeatureServer/8) | [Live layer](https://services1.arcgis.com/Ko5rxt00spOfjMqj/arcgis/rest/services/Addresses_Public/FeatureServer/0) |
| Orange (3.1M) | [File, 8/26](https://ocvote.gov/maps) | [Live layer](https://services7.arcgis.com/vhU7TaevMOAtV9Qd/arcgis/rest/services/OC_Addresses_20260811/FeatureServer/0) |
| Placer (442K) | Request, 9/26 | [Live layer](https://services3.arcgis.com/KkgpUIloCxkczPwY/arcgis/rest/services/Placer_County_Address_Points/FeatureServer/0) |
| Plumas (19K) | [SWDB, 6/26](https://statewidedatabase.org/) | [File, 7/26](https://plumascounty.us/DocumentCenter/View/8506) |
| Riverside (2.5M) | [Layer, 6/26](https://services1.arcgis.com/pWmBUdSlVpXStHU6/arcgis/rest/services/Regular_Precincts_from_Feb_2/FeatureServer/0) | [Live layer](https://gis.countyofriverside.us/arcgis_mapping/rest/services/OpenData/General/MapServer/10) |
| Sacramento (1.6M) | [Live layer](https://services1.arcgis.com/5NARefyPVtAeuJPU/ArcGIS/rest/services/VoterRegistrationPrecincts/FeatureServer/2) | [Live layer](https://services1.arcgis.com/5NARefyPVtAeuJPU/ArcGIS/rest/services/Address/FeatureServer/0) |
| San Bernardino (2.2M) | [Live layer](https://services.arcgis.com/aA3snZwJfFkVyDuP/ArcGIS/rest/services/ROV_Precincts/FeatureServer/0) | [Live layer](https://maps.sbcounty.gov/gis/rest/services/AddressDataManagement/SBC_Site_Addresses/FeatureServer/0) |
| San Diego (3.3M) | [Live layer](https://geo.sandag.org/server/rest/services/Hosted/Voter_Home_Precinct_2026_08_03/FeatureServer/0) | [Live layer](https://geo.sandag.org/server/rest/services/Hosted/Address_Points/FeatureServer/0) |
| San Joaquin (824K) | [Live layer](https://services2.arcgis.com/GQhSReJEO6f7tsvy/arcgis/rest/services/Precincts_24G_JV/FeatureServer/16) | [Several layers](https://sjmap.org/server/rest/services/Apps/DistrictViewerSvc/MapServer/1) |
| San Luis Obispo (282K) | [Live layer](https://gis.slocounty.ca.gov/arcgis/rest/services/Public/opendata/MapServer/94)† | [Live layer](https://gis.slocounty.ca.gov/arcgis/rest/services/Public/opendata/MapServer/0)† |
| San Mateo (744K) | [Live layer](https://gis.smcgov.org/maps25/rest/services/ACRE/ACRE_GIS/MapServer/0) | [Live layer](https://gis.smcgov.org/maps25/rest/services/PLANNING/PLN_LAYERS_DMZ/MapServer/33) |
| Santa Barbara (442K) | [File, 10/26](https://www.countyofsb.org/acr-elections-maps) | [Live layer](https://services.arcgis.com/KkJhFbLnXVqahKz2/arcgis/rest/services/Address_Points/FeatureServer/0) |
| Santa Clara (1.9M) | Request, 11/26 | [Layer, 2020 + parcels](https://maps.santaclaracounty.gov/server/rest/services/opendata/SCCGISHUB/MapServer/8)† |
| Santa Cruz (259K) | [Live layer](https://services1.arcgis.com/jJfZghspGKh8J9Jm/arcgis/rest/services/Precincts/FeatureServer/4) | [Live layer](https://services1.arcgis.com/jJfZghspGKh8J9Jm/arcgis/rest/services/Address_Point/FeatureServer/1) |
| Shasta (182K) | [Live layer](https://gis.shastacounty.gov/arcgis/rest/services/Internet/November_2026_General_Election/FeatureServer/8) | [Live layer](https://gis.shastacounty.gov/arcgis/rest/services/OpenData/Address_Points/FeatureServer/1) |
| Siskiyou (42K) | [SWDB, 6/26](https://statewidedatabase.org/) | [Live layer](https://services3.arcgis.com/JmPiYilyU1x5zuxM/arcgis/rest/services/Siskiyou_County_Public_Address_Points/FeatureServer/0) |
| Solano (455K) | [Live layer](https://services8.arcgis.com/yZMpWjUY470LlO5I/arcgis/rest/services/current_election_precincts/FeatureServer/0) | [Live layer](https://services2.arcgis.com/SCn6czzcqKAFwdGU/arcgis/rest/services/Address_Points/FeatureServer/0) |
| Sonoma (486K) | [Live layer](https://socogis.sonomacounty.ca.gov/map/rest/services/rovpublic/Precincts/FeatureServer/0) | [Live layer](https://socogis.sonomacounty.ca.gov/map/rest/services/BASEPublic/Addresses_Public/MapServer/0) |
| Stanislaus (558K) | [SWDB, 6/26](https://statewidedatabase.org/) | [Live layer](https://services.arcgis.com/EeYBJFxLdUojipYa/arcgis/rest/services/Addresses_AGOL/FeatureServer/0) |
| Sutter (99K) | [Live layer](https://services6.arcgis.com/rHMUPKWdiOvdGXkw/arcgis/rest/services/Elections_Precincts/FeatureServer/0) | [Live layer](https://services6.arcgis.com/rHMUPKWdiOvdGXkw/arcgis/rest/services/Address_Points/FeatureServer/0) |
| Trinity (16K) | [SWDB, 6/26](https://statewidedatabase.org/) | [Live layer](https://services2.arcgis.com/32siQkg0O6da8zFF/arcgis/rest/services/Address_Locations/FeatureServer/0) |
| Tulare (485K) | Request, 10/26 | [Live layer](https://services2.arcgis.com/bYBANhmQGwSSLC0l/ArcGIS/rest/services/SiteStructureAddressPoints/FeatureServer/0) |
| Ventura (831K) | [Live layer](https://maps.ventura.org/arcgis/rest/services/DataDownloads/Political/MapServer/1) | [Live layer](https://maps.ventura.org/arcgis/rest/services/DataDownloads/Address/FeatureServer/0) |
| Yolo (224K) | [Live layer](https://gis.yolocounty.gov/ext/rest/services/Public/Elections___Public/FeatureServer/3) | [Live layer](https://gis.yolocounty.gov/ext/rest/services/Public/Addresses/FeatureServer/0) |
| Yuba (89K) | [SWDB, 6/26](https://statewidedatabase.org/) | [Live layer](https://gis.yuba.org/arcgis/rest/services/Addressing/Addressing_public/FeatureServer/0) |

## Parcels

Each parcel with a site address, its middle placed on a precinct map. The county publishes the parcels and its
precinct map; otherwise a (possibly out-of-date) SWDB map is used. A parcel has one address however many homes it
holds, and on a large lot its middle can sit in another precinct. This is mostly accurate.

| County | Precinct map | Addresses |
| --- | --- | --- |
| Alpine (1.0K) | [SWDB, 6/26](https://statewidedatabase.org/) | [Parcels, 2025](https://services1.arcgis.com/9z9tEfqo0TExR9C8/arcgis/rest/services/AlpineCountyParcels_22_23_PublicUpdate/FeatureServer/0) |
| Colusa (22K) | Request, 12/22 | [Parcels, 2026](https://services5.arcgis.com/RHVBVx0fVmUtvfJV/arcgis/rest/services/Colusa_County_Tax_Parcels/FeatureServer/0) |
| Del Norte (26K) | [Live layer](https://services3.arcgis.com/IkUDY1vRIUWiVvcz/arcgis/rest/services/Precincts2021/FeatureServer/0) | [Parcels, 2026](https://services3.arcgis.com/IkUDY1vRIUWiVvcz/arcgis/rest/services/Parcels_20241125/FeatureServer/0) |
| Glenn (28K) | [Live layer](https://services3.arcgis.com/GUHJKBhKMcD5JjTe/arcgis/rest/services/Precincts_2_19_26/FeatureServer/0) | [Parcels, 2023](https://services3.arcgis.com/GUHJKBhKMcD5JjTe/arcgis/rest/services/Zoning_Finder/FeatureServer/0) |
| Humboldt (132K) | [SWDB, 6/26](https://statewidedatabase.org/) | [Parcels, 2026](https://humboldtgov.org/276/GIS-Data-Download) |
| Imperial (181K) | [Live layer](https://services7.arcgis.com/RomaVqqozKczDNgd/arcgis/rest/services/ElectionGeography_public_15dd531d79d148a29be12ba72c150cc2/FeatureServer/1) | [Parcels, 2023](https://services7.arcgis.com/RomaVqqozKczDNgd/arcgis/rest/services/Parcels_Oct_2023/FeatureServer/0) |
| Lake (68K) | [SWDB, 11/24](https://statewidedatabase.org/) | [Parcels, 2026](https://gis.lakecountyca.gov/server/rest/services/Parcels/MapServer/0) |
| Nevada (102K) | [Live layer](https://services1.arcgis.com/UvqJJ6GFv4u5BZQj/arcgis/rest/services/Voter_Precincts_PUBLIC/FeatureServer/0) | [Parcels, 2026](https://maps.nevadacountyca.gov/arcgis/rest/services/web_public/Open_Data_Layers_Nevada_County/FeatureServer/100) |
| Sierra (3.1K) | Request, 1/22 | [Parcels, 2025](https://services2.arcgis.com/2yQutf5QqkjGa5Rs/arcgis/rest/services/SierraParcelAd_ExportFeature/FeatureServer/1)\* |
| Tuolumne (53K) | [SWDB, 6/26](https://statewidedatabase.org/) | [Parcels, 2026](https://services3.arcgis.com/afQpMaliVrwHS7Ud/arcgis/rest/services/Parcels_WithSiteAddress/FeatureServer/2) |

## Census TIGER and SWDB

No public addresses. Census TIGER's ranges of possible house numbers stand in, placed on whatever precinct map is
available. This is often unreliable, especially in rural areas.

| County | Precinct map | Addresses |
| --- | --- | --- |
| Lassen (28K) | [SWDB, 6/26](https://statewidedatabase.org/) | [Census TIGER](https://www.census.gov/geographies/mapping-files/time-series/geo/tiger-line-file.html) |
| Modoc (8.4K) | [Live layer](https://services6.arcgis.com/MIuDOWgDqUpHjCEg/arcgis/rest/services/Voting_Precincts___10_14_25_WFL1/FeatureServer/13) | [Census TIGER](https://www.census.gov/geographies/mapping-files/time-series/geo/tiger-line-file.html) |

\* Published by a third party, not an authoritative source.\
† Public GIS layer may reject web browsers.
