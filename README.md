# Programming Project - Project proposal

Mercylyn Wiemer

## Travel CO2 meter

Observe the air pollution of your vacation travel by car, train and airplane. Also, perceivethe effect of the climate change on the temperature of the country.

## Problem statement ##
The expansion of the airports in the Netherlands is a hot topic. The top executive of KLM states: "If the aiport in Lelystad does not open, Schiphol airport has to expand." (1).

However, the number of flights keeps increasing and the CO2 emission increases steadily.

What is the impact of the current aviation on the environment? Are there alternatives for travelling?
1) https://www.nu.nl/weekend/5137661/klm-topman-als-lelystad-niet-opengaat-moet-schiphol-uitbreiden.html
## Solution ##
Show the emission CO2 of the travel to a country of choice in Europe.
![](https://github.com/mercylyn/mprogproject/blob/master/mprog_sketch.png)

### main features ###
* select country to travel to in Europe
* show: emission CO2 travel by train, car and airplane
* show: temperature change of selected country

## Prerequisities ##

data sources
* https://www.kaggle.com/berkeleyearth/climate-change-earth-surface-temperature-data/data
* https://www.co2emissiefactoren.nl/lijst-emissiefactoren/
* https://www.schiphol.nl/en/developer-center/page/our-flight-api-explored/

external components
* d3-tip
* datamaps

similar visualizations
* https://www.milieucentraal.nl/duurzaam-vervoer/vliegen-of-ander-vakantievervoer/

hardest parts
* scraping data: flights, train travels
* implementing the possibility for users to select a real time travel (like 9292.nl)
