# Programmeerproject - proposal

Mercylyn Wiemer (10749306)

## The Beatles muziekanalyse

De Beatles was een popgroep uit Liverpool, Engeland. De groep was actief van 1960 tot 1970. Zij worden beschouwd al de meest invloedrijke band van de popmuziek. The Beatles muziekanalyse visualiseert de populaire liederen van The Beatles.

Bron: https://nl.wikipedia.org/wiki/The_Beatles

## Problem statement ##
The Beatles hebben meer dan 300 liederen geschreven, maar wat waren de grootste hits? Op welk album staan deze liederen en wie zijn de liedschrijvers.
Is er een populaire onderwerp of thema te zien in de liederen. Om er dieper op in te gaan: toonsoort, bpm, akkoordenschema's.

## Solution ##
Laten zien van de top hits geschreven door The Beatles.

![](https://github.com/mercylyn/mprogproject/blob/master/mprog_sketch.png)

### main features ###
* select country to travel to in Europe
* show: CO2 emission travel by train, car and airplane
* show: temperature change of selected country

The CO2 emission is the minimum viable product (MVP).

## Prerequisities ##

### data sources ###
* https://www.kaggle.com/berkeleyearth/climate-change-earth-surface-temperature-data/data
* https://www.co2emissiefactoren.nl/lijst-emissiefactoren/
* https://www.schiphol.nl/en/developer-center/page/our-flight-api-explored/

### external components ###
* d3-tip
* datamaps

### similar visualizations ###
* https://www.milieucentraal.nl/duurzaam-vervoer/vliegen-of-ander-vakantievervoer/

On the website of milieucentraal the amount of CO2 during the vacation is visualized in a bar graph. It is possible to calculate the CO2 emission for 1, 2 or for persons. This is a nice feature.

### hardest parts ###
* scraping data: flights, train travels
* implementing the possibility for users to select a real time travel (like 9292.nl)
