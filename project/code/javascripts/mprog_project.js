/**
 * Name: Mercylyn Wiemer (10749306)
 * Course: programming project
 *
 * Programming Project: The Beatles chart analysis.
 * - Grouped bar chart: albums or singles that were on the chart
 * (The Official Charts Company) with number of weeks on chart
 * - Bubble chart: albums or singles with highest position no. 1
 * - Donut chart: members of the band starring as lead vocals position no. 1 albums only
 *
 * Data chart from The Guardian & lead vocals from Wikipedia: albums of The Beatles
**/

// global variables for grouped bar chart, bubble chart and donut chart
let dataAlbumsBar, dataSinglesBar, dataBubbleAlbums, dataBubbleSingles, dataDonut,
    updateBubble, dataName, updateDonut;

// run code when files are loaded
window.onload = function() {

    // request queries: when fulfilled, continue
    queue()
        .defer(d3.csv, "project/data/beatles_chart_albums.csv")
        .defer(d3.csv, "project/data/beatles_chart_singles.csv")
        .defer(d3.csv, "project/data/lead_vocals_albums.csv")
        .await(convertData);

    // convert data to dictionary
    function convertData(error, albums, singles, lead) {
        if (error) throw error;

        let parse = d3.time.format("%m/%d/%Y").parse;

        // convert data to following type: date, string or number
        let dataAlbums = albums.map(function(d) {
            return {"date" : parse(d.date), "highestPosition" : +d.highestPosition,
                    "weeksChart" : +d.weeksChart, "title" : d.title,
                    "weeksNo1" : +d.weeksNo1, "usNo1" : +d.usNo1};
        });

        let dataSingles = singles.map(function(d) {
            return {"date" : parse(d.date), "highestPosition" : +d.highestPosition,
                    "weeksChart" : +d.weeksChart, "title" : d.title,
                    "weeksNo1" : +d.weeksNo1, "usNo1" : +d.usNo1};
        });

        let dataLead = lead.map(function(d) {
            return {"title" : d.title,
                    "country" : d.country,
                    "released" : parse(d.released),
                    "noTracks" : +d.noTracks,
                    "harrison" : +d.Harrison,
                    "lennon" : +d.Lennon,
                    "mcCartney" : +d.McCartney,
                    "starr" : +d.Starr,
                    "lennonHarrison" : +d.LennonHarrison,
                    "lennonMcCartney" : +d.LennonMcCartney,
                    "lennonMcCartneyHarrison" : +d.LennonMcCartneyHarrison,
                    "lennonMcCartneyHarrisonStarr" : +d.LennonMcCartneyHarrisonStarr,
                    "instrumental" : +d.instrumental };
        });

        // convert data to JSON format
        dataAlbumsBar = convertToDictionary(dataAlbums);
        dataSinglesBar = convertToDictionary(dataSingles);

        // convert data for bubble chart
        dataBubbleAlbums = convertForBubble(dataAlbums);
        dataBubbleSingles = convertForBubble(dataSingles);

        // convert data and calculate percentages for donut chart
        dataDonut = calculatePercentage(dataLead);

        makeBarChart(dataAlbumsBar);

        makeBubbleChart(dataBubbleAlbums);

        // select first album of the timeline
        makeDonutChart(dataDonut[0].lead, dataDonut[0].title);
    };
};

/* Calculates the percentage of songs in which a band member stars as lead vocals. */
function calculatePercentage(data) {
    convertedData = [];

    // determine per album the percentages
    for (let i = 0; i < data.length; i++) {
        album = data[i];
        title = album.title
        noTracks = album.noTracks;

        // per category (member or instrumental) calculate percentage of lead vocals
        convertedData.push({
            title: title,
            lead: [
                {singer: "McCartney", value: Math.round((album.mcCartney / noTracks) * 100)},
                {singer: "Lennon", value: Math.round((album.lennon / noTracks) * 100)},
                {singer: "Harrison", value: Math.round((album.harrison / noTracks) * 100)},
                {singer: "Starr", value: Math.round((album.starr / noTracks) * 100)},
                {singer: "Lennon & McCartney", value:
                    Math.round((album.lennonMcCartney / noTracks) * 100)},
                {singer: "Lennon & Harrison", value:
                    Math.round((album.lennonHarrison / noTracks) * 100)},
                {singer: "Lennon & McCartney & Harrison", value:
                    Math.round((album.lennonMcCartneyHarrison / noTracks) * 100)},
                {singer: "Lennon & McCartney & Harrison & Starr", value:
                    Math.round((album.lennonMcCartneyHarrisonStarr / noTracks) * 100)},
                {singer: "Instrumental", value:
                    Math.round((album.instrumental / noTracks) * 100)}
        ]});
    };

    return convertedData;
};

/* Selects the albums with highest position: 1, and returns a dictionary with
   the following information: title of album, year in which the album
   reached the chart and the number of weeks in the chart. */
function convertForBubble(dataset) {
    data = [];

    // determine which albums reached highest position 1 and convert data
    for (let i = 0; i < dataset.length; i++) {

        if (dataset[i].highestPosition === 1) {
            data.push({
                title: dataset[i].title,
                year: dataset[i].date.getFullYear(),
                weeks: dataset[i].weeksChart,
            })
        };
    };

    return data;
};

/* Converts data to dictionary: sorting albums or singles by year. */
function convertToDictionary(dataset) {
    let dataPerType = [];
    let dataPerYear = [];
    let years = [];
    let valuesArray = [];

    // get data per album or single: year on chart, title and chart position
    for (let key in dataset) {
        dataPerType.push([dataset[key].date.getFullYear(), dataset[key].title,
                          dataset[key].weeksChart, dataset[key].highestPosition]);
    }

    // add year of first album to for sorting the dictionary
    years.push(dataPerType[0][0]);

    // convert data to dictionary based upon year on chart
    for (let i = 0; i < dataPerType.length; i++) {

        let values = {
            key: dataPerType[i][1],
            value: dataPerType[i][2],
            highestPosition: dataPerType[i][3]
        };

        // keep track of years
        if (years.includes(dataPerType[i][0])) {
            valuesArray.push(values);
        }

        // found album/single on chart in a new year
        else {

            // add data of the last occuring year to main array
            dataPerYear.push({
                key: years.slice(-1)[0],
                values: valuesArray
            });

            years.push(dataPerType[i][0]);

            valuesArray = [];

            // add values to new value array
            valuesArray.push(values)
        }
    };

    // add last dictionary
    dataPerYear.push({
        key: years.slice(-1)[0],
        values: valuesArray
    });

    return dataPerYear;
};

/* Create a grouped bar chart of albums/singles of the beatles with categories
   (years) and inner categories (albums/singles) */
function makeBarChart(data) {

    // define colors for bars
    const color =[
        "#c95275", "#58ae5d", "#ba5fbe", "#b9b83e", "#543586", "#83aa46",
        "#6678d3", "#d0943a", "#bd8fd7", "#46bc8c", "#b54b8d", "#59c1c2",
        "#c3443a", "#70a3ce", "#bd6633", "#504c76", "#94863a", "#c68fb6",
        "#454d25", "#c65158", "#538f7c", "#783821", "#85a673", "#71334a",
        "#b4a170", "#da896b", "#bf8981"];

    // set dimensions of svg
    const margin = {top: 20, right: 30, bottom: 50, left: 40},
        width = 1280 - margin.left - margin.right,
        height = 500 - margin.top - margin.bottom;

    let barPadding = 10,
        axisPadding = 10,
        yLabelPosition = 6,
        yTicks = 14,
        offsetTip = -10,
        duration = 500;

    let y = d3.scale.linear()
      .range([height, 0]);

    y.domain([0, d3.max(data, function(cat) {
        return d3.max(cat.values, function(def) {
            return def.value;
            });
        }) * 2
    ]);

    // Define Y axis
    let yAxis = d3.svg.axis()
        .scale(y)
        .orient("left")
        .ticks(yTicks);

    // Set up the tool tip
    let tip = d3.tip()
        .attr('class', 'd3-tip')
        .offset([offsetTip, 0])
        .html(function(d) {
          return "<strong>Album:</strong> <span style='color:red'>" + d.key +
                    "</span> <br> <strong>Weeks on chart:</strong> \
                    <span style='color:red'>" + d.value + "</span> <br> \
                    <strong>Highest chart position:</strong> <span \
                    style='color:red'>" + d.highestPosition + "</span>";
    });

    // create SVG element
    let svg = d3.select("#barChart").append("svg")
      .attr("width", width + margin.left + margin.right)
      .attr("height", height + margin.top + margin.bottom)
      .style('background-color', '#F7F6E2')
      .append("g")
      .attr("transform", "translate(" + margin.left + "," + margin.top + ")");

    svg.call(tip);

    // y-axis label
    svg.append("g")
        .attr("class", "y axis")
        .call(yAxis)
        .append("text")
        .attr("transform", "rotate(-90)")
        .attr("y", yLabelPosition)
        .attr("dy", ".71em")
        .style("font-size", "14px")
        .style("text-anchor", "end")
        .text("Weeks on chart");

        // X axis label
        svg.append("g")
            .append("text")
            .attr("x", width / 2)
            .attr("y", height + margin.bottom - axisPadding)
            .style("font-size", "14px")
            .attr("text-anchor", "middle")
            .text("year music appeared on chart");

        updateBar(data);

        // add button to switch data: album or single data
        let radioButtonChange = function() {
            dataName = d3.select(this).property('value');

            // check user input: albums or singles and update charts
            if (dataName == "albums") {
                updateBar(dataAlbumsBar)
                updateBubble(dataBubbleAlbums);

            let updateTitleDonut = d3.selectAll(".donutTitle")
                                .text("* Select an album");

            let updateTitleBubble = d3.selectAll(".bubbleTitle")
                                    .text("UK ALBUMS CHART NUMBER ONES");
            }

            // update grouped bar chart, bubble chart and donut chart to singles dataset
            else {
                updateBar(dataSinglesBar);
                updateBubble(dataBubbleSingles);

                let data = [{singer: "no data", value: 0}];

                // update donut chart: no data available
                updateDonut(data);

                let updateTitle = d3.selectAll(".donutTitle")
                                    .text("*Only possible for albums");

                let updateTitleBubble = d3.selectAll(".bubbleTitle")
                                        .text("UK SINGLES CHART NUMBER ONES");
            }
        };

        let radioButtons = d3.selectAll("input")
            .on("change", radioButtonChange);

    /* Updates the bar chart based upon user input: album or singles. */
    function updateBar(data) {

        let rangeBands = [];
        let yPadding = 20;

        // cummulative value to position our bars
        let cummulative = 0;

        data.forEach(function(val, i) {
            val.cummulative = cummulative;
            cummulative += val.values.length;
            val.values.forEach(function(values) {
                values.parentKey = val.key;
                rangeBands.push(i);
            })
        });

        // set scale to cover whole svg
        let x_category = d3.scale.linear()
            .range([0, width]),

        // create dummy scale to get rangeBands
            x_inner = d3.scale.ordinal()
            .domain(rangeBands)
            .rangeBands([0, width], .2),

            x_category_domain = x_inner.rangeBand() * rangeBands.length;

        x_category.domain([0, x_category_domain]);

        // set y range
        let y = d3.scale.linear()
          .range([height, 0]);

        // set y domain
        y.domain([0, d3.max(data, function(cat) {
            return d3.max(cat.values, function(def) {
                return def.value;
                });
            }) * 2
        ]);

        // define Y axis
        let yAxis = d3.svg.axis()
            .scale(y)
            .orient("left")
            .ticks(14);

        // update y axis
        svg.selectAll("g.y.axis")
            .transition().duration(duration)
            .call(yAxis)

        // add all category groups: years
        let category_g = svg.selectAll(".category")
            .data(data);

        category_g
            .enter().append("g")
            .attr("class", function(d) {
                return 'category category-' + d.key;
            })
            .attr("transform", function(d) {
                return "translate(" + x_category((d.cummulative * x_inner.rangeBand())) + ",0)";
            })
            .attr("fill", function(d, i) {
                return color[i];
            });

        // update old ones, already have x / width from before
        category_g
            .transition().duration(duration)
            .attr("class", function(d) {
                return 'category category-' + d.key;
            })
            .attr("transform", function(d) {
                return "translate(" + x_category((d.cummulative * x_inner.rangeBand())) + ",0)";
            })
            .attr("fill", function(d, i) {
                return color[i];
            });

        // Remove old ones
        category_g.exit().remove();

        // create and update category labels: years
        let category_label = category_g.selectAll(".category-label")
            .data(function(d) { return [d]; });

        // add all category labels: years
        category_label
            .enter().append("text")
            .attr("class", function(d) {
                return 'category-label category-label-' + d.key;
            })
            .attr("transform", function(d) {
                let x_label = x_category((d.values.length * x_inner.rangeBand() + barPadding) / 2);
                let y_label = height + yPadding;

                return "translate(" + x_label + "," + y_label + ")";
            })
            .text(function(d) {
                return d.key;
            })
            .attr('text-anchor', 'middle');

        // update
        category_label
            .transition().duration(duration)
            .attr("class", function(d) {
                return 'category-label category-label-' + d.key;
            })
            .attr("transform", function(d) {
                let x_label = x_category((d.values.length * x_inner.rangeBand() + barPadding) / 2);
                let y_label = height + 20;

                return "translate(" + x_label + "," + y_label + ")";
            })
            .text(function(d) {
                return d.key;
            })
            .attr('text-anchor', 'middle');

        category_label.exit().remove();

        // adding inner groups g elements
        let inner_g = category_g.selectAll(".inner")
            .data(function(d) {
                return d.values;
          });

        inner_g
            .enter().append("g")
            .attr("class", function(d) {
                return 'inner inner-' + d.key;
            })
            .attr("transform", function(d, i) {
                return "translate(" + x_category((i * x_inner.rangeBand())) + ",0)";
            });

        inner_g
            .transition().duration(duration)
            .attr("class", function(d) {
                return 'inner inner-' + d.key;
            })
            .attr("transform", function(d, i) {
                return "translate(" + x_category((i * x_inner.rangeBand())) + ",0)";
            });

        inner_g.exit().remove();

        // create and update rectangles
        let rects = inner_g.selectAll('.rect')
            .data(function(d) {
                return [d];
          });

        rects
            .enter().append("rect")
            .attr("class", "rect")
            .attr("width", x_category(x_inner.rangeBand() - barPadding))
            .attr("x", function(d) {
                return x_category(barPadding);
          })
            .attr("y", function(d) {
                return y(d.value);
            })
            .attr("height", function(d) {
                return height - y(d.value);
        })
            .on('mouseover', tip.show)
            .on('mouseout', tip.hide);

        rects
            .transition().duration(duration)
            .attr("y", function(d) {
                return y(d.value);
            })
            .attr("height", function(d) {
                return height - y(d.value);
            });

        rects.exit().remove();

        // add labels to g elements
        let inner_label = inner_g.selectAll(".inner-label")
            .data(function(d) {
                return [d];
            });

        inner_label
            .enter().append("text")
            .attr("class", function(d) {
                return 'inner-label inner-label-' + d.key;
            })
            .text(function(d) {
                return d.key;
            })
            .attr("transform", function(d) {
                    let x_label =  x_category(x_inner.rangeBand() - barPadding);
                    let y_label =  y(d.value);

                    return "translate(" + x_label + "," + y_label + ") rotate(270)";
            })
            .style('fill', 'black')
            .attr("font-size", "12px");

        inner_label
            .transition().duration(duration)
            .attr("class", function(d) {
                return 'inner-label inner-label-' + d.key;
            })
            .text(function(d) {
                return d.key;
            })
            .attr("transform", function(d) {
                    let x_label =  x_category(x_inner.rangeBand() - barPadding);
                    let y_label =  y(d.value) - barPadding / 2;

                    return "translate(" + x_label + "," + y_label + ") rotate(270)";
            });
    };
};

/* Set up SVG and create bubble chart. */
function makeBubbleChart(data) {

    let bubbleTitle = d3.select("#bubbleChart")
                        .append("h3")
                        .attr("class", "bubbleTitle")
                        .text("UK ALBUMS CHART NUMBER ONES")

    // information about the color and size of bubble
    let bubbleInfo = d3.select("#bubbleChart")
                        .append("h5")
                        .attr("class", "bubbleInfo")
                        .text("* Colors indicate year, size of bubble indicate number of weeks no. 1 on chart")
    updateBubble = updateBubbleChart;

    // define chart parameters
    let diameter = 715,
        color    = d3.scale.category20b();

    let bubble = d3.layout.pack()
        .sort(null)
        .size([diameter, diameter])
        .padding(3.5);

    // create svg element
    let svg = d3.select("#bubbleChart")
        .append("svg")
        .attr("width", diameter)
        .attr("height", diameter)
        .attr("class", "bubble");

    // set up tooltip
    let tooltip = d3.select("#bubbleChart")
        .append('div')
        .attr('class', 'tooltip');

    tooltip.append('div')
        .attr('class', 'title');

    tooltip.append('div')
        .attr('class', 'weeks');

    tooltip.append('div')
        .attr('class', 'year');

    // create or update bubble chart
    updateBubble(data);

    /* Update bubble chart when user switches input: album - singles above bar chart. */
    function updateBubbleChart(dataset) {

        // transform data to numbers
        let data = dataset.map(function(d) { d.value = +d["weeks"]; return d; });

        // bubbles needs very specific format, convert data to this
        let nodes = bubble.nodes({children:data}).filter(function(d) { return !d.children; });

        let node = svg.selectAll(".node")
            .data(nodes);

        let text = svg.selectAll("text")
            .data(nodes);

        let names = svg.selectAll(".names")
            .data(nodes);

        let nodeEnter = node.enter()
            .append("g")
            .attr("class", "node")
            .attr("transform", "translate(0,0)");

        // add tooltip to bubbles
        nodeEnter
            .append("circle")
            .attr("r", function(d) { return d.r; })
            .attr("cx", function(d) { return d.x; })
            .attr("cy", function(d) { return d.y; })
            .style("fill", function(d, i) { return color(d.year); })
            .on('mouseover', function(d) {

                tooltip.select('.title').html(d.title);
                tooltip.select('.weeks').html(d.weeks + " weeks");
                tooltip.select('.year').html("in " + d.year);

                tooltip.style('display', 'block');
                tooltip.style('opacity',2);

            })
            .on('mousemove', function(d) {
                tooltip.style('top', (d3.event.layerY + 10) + 'px')
                .style('left', (d3.event.layerX - 25) + 'px');
            })

            .on('mouseout', function() {
                tooltip.style('display', 'none');
                tooltip.style('opacity',0);
            })
            .on("click", function(d) {

                // check user input: singles or albums and update donut chart
                if (dataName == "singles") {

                    let data = [{singer: "no data", value: 0}];

                    // no data for singles
                    updateDonut(data);

                    let updateTitleDonut = d3.selectAll(".donutTitle")
                                        .text("*Only possible for albums");
                }

                // user input: albums
                else {
                    let title = d.title, lead;

                    // find dataset (album) of user input and select lead vocals data
                    for (let album in dataDonut) {
                        if (title === dataDonut[album].title) {
                            lead = dataDonut[album].lead
                        }
                    };

                    // check if data is available for lead vocals: donut chart
                    if (lead) {
                        updateDonut(lead);
                        let updateTitleDonut= d3.selectAll(".donutTitle")
                                            .text(title);
                    }

                    // warn user: no data available
                    else {
                        let data = [{singer: "no data", value: 0}];

                        updateDonut(data);

                        let updateTitleDonut = d3.selectAll(".donutTitle")
                                            .text("Sorry, no data available");
                    };
                };
            });

        // selects circules and update
        node.select("circle")
            .attr("r", function(d) { return d.r; })
            .attr("cx", function(d) { return d.x; })
            .attr("cy", function(d) { return d.y; })
            .style("fill", function(d) { return color(d.year); });

        node
            .transition().duration(750)
            .attr("class", "node")
            .attr("transform", "translate(0,0)")

        node.exit().remove();

        // add album or single titles to bubbles
        text
            .enter().append("text")
            .attr("class", "names")
            .attr("x", function(d) { return d.x; })
            .attr("y", function(d) { return d.y + 5; })
            .attr("text-anchor", "middle")
            .text(function(d) { return d["title"]; })
            .style({
                "fill":"white",
                "font-family":"Helvetica Neue, Helvetica, Arial, san-serif",
                "font-size": "11px"
            })
            .attr("dy", ".35em");

        // update album or single titles to bubbles
        text
            .transition().duration(750)
            .attr("x", function(d) { return d.x; })
            .attr("y", function(d) { return d.y + 5; })
            .text(function(d) { return d["title"]; });

        text.exit().remove();
    };
};

/* Create and update donut chart with % starring lead vocals per category: bandmember or
   instrumental. */
function makeDonutChart(data, albumTitle) {
    let donutTitle = d3.select("#donutChart")
                        .append("h3")
                        .text("% LEAD VOCALS OF ALBUM PER MEMBER:")
                        .append("h3")
                        .attr("class", "donutTitle")
                        .text(albumTitle);

    // set update function for donut chart global
    updateDonut = updateDonutChart;

    // set dimensions of canvas
    const margin = {top: 100, bottom: 50, left: 50, right: 50},
	    width = 500 - margin.left - margin.right,
        height = 500,
        radius = Math.min(width, height) / 2,
        donutWidth = 100;

    // builtin range of colors
    const color = d3.scale.category20b();

    // create SVG element
    let svg = d3.select('#donutChart')
        .append("svg")
        .attr("width", width)
        .attr("height", height + margin.top + margin.bottom)
        .append("g")
        .attr("transform", "translate(" + width / 2 + "," + ((height / 2) - 50) + ")");

    svg.append("g").attr("class", "slices");

    // create arc data for given list of values
    let pie = d3.layout.pie()
        .sort(null)
        .value(function(d) { return d.value; });

    // declare an arc generator function
    let arc = d3.svg.arc()
        .outerRadius(radius - 20)
        .innerRadius(radius - donutWidth);

    // set key function
    let key = function(d) { return d.data.singer; };

    // set up tooltip
    let tooltip = d3.select("#donutChart")
    	.append('div')
    	.attr('class', 'tooltip');

    tooltip.append('div')
    	.attr('class', 'singer');

    tooltip.append('div')
        .attr('id', 'percent');

    // select paths, use arc generator to draw
    let arcs = svg.selectAll(".slice")
        .data(pie(data))
        .enter().append("svg:g")
        .attr("class", "slice");

    updateDonut(data, albumTitle);

    /* Returns data sorted by category: singers or instrumental. */
    function mergeWithFirstEqualZero(first, second) {
        let secondSet = d3.set();

        second.forEach(function(d) { secondSet.add(d.singer); });

        let onlyFirst = first
            .filter(function(d) { return !secondSet.has(d.singer) })
            .map(function(d) { return {singer: d.singer, value: 0}; });

        // sort by singer
        let sortedMerge = d3.merge([second, onlyFirst])
            .sort(function(a, b) {
                return d3.ascending(a.singer, b.singer);
            });

        return sortedMerge;
    };

    /* Updates donut chart by user input: album bubble. */
    function updateDonutChart(data) {

        let oldData = svg.select(".slices")
            .selectAll("path")
            .data().map(function(d) { return d.data });

        // check for old data
        if (oldData.length == 0) oldData = data;

        let was = mergeWithFirstEqualZero(data, oldData),
            is = mergeWithFirstEqualZero(oldData, data);

        let text = arcs.selectAll("text")
            .data(pie(data));

        let slice = svg.select(".slices")
            .selectAll("path")
            .data(pie(was), key);

        // create and update slices of donut chart
        slice.enter()
            .insert("path")
            .attr("class", "slice")
            .style("fill", function(d, i) { return color(i); })
            .each(function(d) {
              this._current = d;
            })
            .on('mouseover', function(d) {
              tooltip.select('.singer').html(d.data.singer).style('color','black');
              tooltip.select('#percent').html(d.data.value + "%");

              tooltip.style('display', 'block');
              tooltip.style('opacity',2);
            })
            .on('mousemove', function(d) {
              tooltip.style('top', (d3.event.layerY + 10) + 'px')
              .style('left', (d3.event.layerX - 25) + 'px');
            })
            .on('mouseout', function() {
              tooltip.style('display', 'none');
              tooltip.style('opacity',0);
            });

        slice = svg.select(".slices")
            .selectAll("path")
            .data(pie(is), key);

        slice.transition()
            .duration(750)
            .attrTween("d", function(d) {
                let interpolate = d3.interpolate(this._current, d);
                let _this = this;
                return function(t) {
                    _this._current = interpolate(t);
                    return arc(_this._current);
                };
            });

        slice = svg.select(".slices")
            .selectAll("path")
            .data(pie(data), key);

        slice.exit()
            .transition()
            .delay(750)
            .duration(0)
            .remove();

        // add and update percentage text to donut slices
        text
            .enter().append("text").transition().delay(500).duration(750)
            .attr("class", "percentage")
            .attr("transform", function(d) { return "translate(" + arc.centroid(d) + ")"; })
            .attr("dy", ".35em")
            .attr("text-anchor", "middle")
            .text(function(d) {
                if (d.data.value > 0) {
                    return d.data.value + "%";
                }
            });

        text
            .transition().delay(100).duration(750)
            .attr("transform", function(d) { return "translate(" + arc.centroid(d) + ")"; })
            .attr("dy", ".35em")
            .text(function(d) {
                if (d.data.value > 0) {
                    return d.data.value + "%";
                }
            });

        text.exit().remove()

        // add legend to donut chart
        let legend = svg.selectAll(".legend")
            .data(pie(is))
            .enter().append("g")
            .attr("transform", function(d, i) {
                return "translate(" + (width - 600) + "," + (i * 30 + 125) + ")";
            })
            .attr("class", "legend");

        legend.append("rect")
            .attr("id", function(d) {
                return (d.data.singer).replace(/\s+/g, '');
            })
            .attr("width", 20)
            .attr("height", 20)
            .attr("fill", function(d, i) {
            return color(i);
            });

        legend.append("text")
            .text(function(d) {

                // remove no data text
                if (d.data.singer != "no data") {
                    return d.data.singer;
                }
            })
            .attr("y", 15)
            .attr("x", 23);

        // remove no data rectangle
        legend.select("#nodata")
            .remove();
    };
};
