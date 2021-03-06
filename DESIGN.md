# Programming project - Project Proposal #

Mercylyn Wiemer (10749306)

## The Beatles chart position analysis ##

### data sources ###

#### Albums and Singles data chart UK / US ####

* https://www.theguardian.com/news/datablog/2009/sep/09/beatles-albums-singles-music-rock-band
* https://docs.google.com/spreadsheets/d/1VI7e2yYOWcHnAG-0DaFJfbts-iT6QHU5pOq-Ajd62HE/edit

Taking the following data: date, highest position, title, weeks at no. 1, USA no. 1. (from csv to JSON)

#### Lead Vocals (only albums/singles no 1. UK and US) ####
McCartney, Lennon, Harrison, Ringo, Lennon with McCartney, McCartney with Lennon, Instrumental

https://en.wikipedia.org/wiki/The_Beatles_discography

Albums
* https://en.wikipedia.org/wiki/Please_Please_Me
* https://en.wikipedia.org/wiki/With_the_Beatles
* https://en.wikipedia.org/wiki/A_Hard_Day%27s_Night_(album)
* https://en.wikipedia.org/wiki/Beatles_for_Sale
* https://en.wikipedia.org/wiki/Help!_(album)
* https://en.wikipedia.org/wiki/Rubber_Soul
* https://en.wikipedia.org/wiki/Revolver_(Beatles_album)
* https://en.wikipedia.org/wiki/Sgt._Pepper%27s_Lonely_Hearts_Club_Band
* https://en.wikipedia.org/wiki/Magical_Mystery_Tour
* https://en.wikipedia.org/wiki/The_Beatles_(album)
* https://en.wikipedia.org/wiki/Abbey_Road
* https://en.wikipedia.org/wiki/Let_It_Be
* https://en.wikipedia.org/wiki/The_Beatles_at_the_Hollywood_Bowl
* https://en.wikipedia.org/wiki/Live_at_the_BBC_(Beatles_album)
* https://en.wikipedia.org/wiki/Anthology_2
* https://en.wikipedia.org/wiki/1_(Beatles_album)

Scrape the lead vocals per song and transform to a percentage (csv to JSON).

### technical components ###
1. Stacked bar chart: number of albums/singles in chart per year
* data: album and single date, weeks on chart, title, highest position
* interactive buttons: switch between albums and singles. Link the buttons to the Bubble chart. Show the Albums/Singles that reached no. 1.
* D3 tooltips to hover over the stacked bars


2. Bubble chart: Albums/Singles at no. 1
* data: album and single at chart no. 1 date, title, weeks at no. 1, no. 1 in USA
* D3 tooltip to hover over the bubbles: weeks at no. 1
* dropdown: options UK and US
* link to pie chart: album lead vocals

3. Pie chart: Lead vocals of album selected by user
* data: Albums no. 1 in chart Lead Vocals per song in album, name of singer

### D3 plugins ###
* tooltip
