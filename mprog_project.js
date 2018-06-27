/**
 * Name: Mercylyn Wiemer (10749306)
 * Course: programmeerproject

http://bl.ocks.org/enjalot/1525346
http://bl.ocks.org/mapsam/6090056
http://bl.ocks.org/mstanaland/6100713
http://bl.ocks.org/enjalot/1525346
https://stackoverflow.com/questions/37812922/grouped-category-bar-chart-with-different-groups-in-d3
https://plnkr.co/edit/L0eQwtEMQ413CpoS5nvo?p=preview
https://stackoverflow.com/questions/43903145/d3-position-x-axis-label-within-rectangle-and-rotate-90-degrees?rq=1
 **/

var dataAlbumsBar, dataSinglesBar, dataBubbleAlbums, dataBubbleSingles, dataDonut,
    updateBubble, dataName, updateDonut;

window.onload = function() {

    queue()
        .defer(d3.csv, "data/beatles_chart_albums.csv")
        .defer(d3.csv, "data/beatles_chart_singles.csv")
        .defer(d3.csv, "data/lead_vocals_albums.csv")
        .await(convertData);

    function convertData(error, albums, singles, lead) {
        if (error) throw error;

        var parse = d3.time.format("%m/%d/%Y").parse;

        var dataAlbums = albums.map(function(d) {
            return {"date" : parse(d.date), "highestPosition" : +d.highestPosition,
                    "weeksChart" : +d.weeksChart, "award" : d.award, "title" : d.title,
                    "labelCatNo" : d.labelCatNo, "weeksNo1" : +d.weeksNo1, "usNo1" : +d.usNo1};
        });

        var dataSingles = singles.map(function(d) {
            return {"date" : parse(d.date), "highestPosition" : +d.highestPosition,
                    "weeksChart" : +d.weeksChart, "title" : d.title,
                    "artists" : d.artists, "weeksNo1" : +d.weeksNo1, "usNo1" : +d.usNo1};
        });

        var dataLead = lead.map(function(d) {
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
                    "instrumental" : +d.instrumental};
            });

        var dataChart = {"albums" : dataAlbums, "singles" : dataSingles};

        dataAlbumsBar = dataToJSON(dataAlbums);

        dataSinglesBar = dataToJSON(dataSingles);

        dataBubbleAlbums = convertForBubble(dataAlbums);
        dataBubbleSingles = convertForBubble(dataSingles);

        dataDonut = calculatePercentage(dataLead);

        // makeBarChart(dataArray);
        makeBarChart(dataAlbumsBar);

        // update(dataAlbumsBar)
        makeBubbleChart(dataBubbleAlbums);

        // select first album of the timeline
        makeDonutChart(dataDonut[0].lead, dataDonut[0].title);
    };
};

// percentages in een array en daarover heen lopen
function calculatePercentage(data) {
    convertedData = [];

    for (let i = 0; i < data.length; i++) {
        album = data[i];
        title = album.title
        noTracks = album.noTracks;

        convertedData.push({
            title: title,
            lead: [
                {singer: "McCartney", value: Math.round((album.mcCartney / noTracks) * 100)},
                {singer: "Lennon", value: Math.round((album.lennon / noTracks) * 100)},
                {singer: "Harrison", value: Math.round((album.harrison / noTracks) * 100)},
                {singer: "Starr", value: Math.round((album.starr / noTracks) * 100)},
                {singer: "Lennon & McCartney", value: Math.round((album.lennonMcCartney / noTracks) * 100)},
                {singer: "Lennon & Harrison", value: Math.round((album.lennonHarrison / noTracks) * 100)},
                {singer: "Lennon & McCartney & Harrison", value: Math.round((album.lennonMcCartneyHarrison / noTracks) * 100)},
                {singer: "Lennon & McCartney & Harrison & Starr", value: Math.round((album.lennonMcCartneyHarrisonStarr / noTracks) * 100)},
                {singer: "instrumental", value: Math.round((album.instrumental / noTracks) * 100)}
        ]});
    };

    return convertedData;
};

function convertForBubble(dataset) {
    data = [];

    for (let i = 0; i < dataset.length; i++) {

        if (dataset[i].highestPosition === 1) {
            data.push({
                title: dataset[i].title,
                year: dataset[i].date.getFullYear(),
                weeks: dataset[i].weeksChart,
                usNo: dataset[i].usNo1
            })
        };
    };

    return data;
};

/* Converts data from JSON to an array containing four variables. */
function dataToJSON(dataset) {
    let dataPerAlbum = [];
    let dataPerYear = [];
    let years = [];
    let valuesArray = [];

    for (var key in dataset) {
        dataPerAlbum.push([dataset[key].date.getFullYear(), dataset[key].title, dataset[key].weeksChart]);
    }

    years.push(dataPerAlbum[0][0]);

    for (let i = 0; i < dataPerAlbum.length; i++) {

        var values = {
            key: dataPerAlbum[i][1],
            value: dataPerAlbum[i][2]
        };

        if (years.includes(dataPerAlbum[i][0])) {

            valuesArray.push(values);
        }
        else {
            dataPerYear.push({
                key: years.slice(-1)[0],
                values: valuesArray
            });

            years.push(dataPerAlbum[i][0]);

            valuesArray = [];

            valuesArray.push(values)
        }
    }

    // add last value
    dataPerYear.push({
        key: years.slice(-1)[0],
        values: valuesArray
    });

    return dataPerYear;
};


function makeBarChart(data) {

    // Updates the bar chart album or singles
    function update(data) {
        var rangeBands = [];
        var cummulative = 0;
        data.forEach(function(val, i) {
          val.cummulative = cummulative;
          cummulative += val.values.length;
          val.values.forEach(function(values) {
            values.parentKey = val.key;
            rangeBands.push(i);
          })
        });

        var x_category = d3.scale.linear()
          .range([0, width]);

        var x_defect = d3.scale.ordinal().domain(rangeBands).rangeBands([0, width], .2);

        var x_category_domain = x_defect.rangeBand() * rangeBands.length;

        x_category.domain([0, x_category_domain]);

        var y = d3.scale.linear()
          .range([height, 0]);

        y.domain([0, d3.max(data, function(cat) {
            return d3.max(cat.values, function(def) {
                return def.value;
                });
            }) * 3]);

        var yAxis = d3.svg.axis()
            .scale(y)
            .orient("left")
            .ticks(14);

        svg.selectAll("g.y.axis")
            .transition().duration(500)
            .call(yAxis)

        var category_g = svg.selectAll(".category")
          .data(data)

          category_g.enter().append("g")
          .attr("class", function(d) {
            return 'category category-' + d.key;
          })
          .attr("transform", function(d) {
            return "translate(" + x_category((d.cummulative * x_defect.rangeBand())) + ",0)";
          })
          .attr("fill", function(d, i) {
            return color[i];
          });

          // Update old ones, already have x / width from before
        category_g
            .transition().duration(500)
            .attr("class", function(d) {
              return 'category category-' + d.key;
            })
            .attr("transform", function(d) {
              return "translate(" + x_category((d.cummulative * x_defect.rangeBand())) + ",0)";
            })
            .attr("fill", function(d, i) {
              return color[i];
            });

        // Remove old ones
        category_g.exit().remove();

        var category_label = category_g.selectAll(".category-label")
          .data(function(d) {
            return [d];
          })

          category_label
            .enter().append("text")
            .attr("class", function(d) {
            return 'category-label category-label-' + d.key;
            })
            .attr("transform", function(d) {
            var x_label = x_category((d.values.length * x_defect.rangeBand() + barPadding) / 2);
            var y_label = height + 20;
            return "translate(" + x_label + "," + y_label + ")";
            })
            .text(function(d) {
            return d.key;
            })
            .attr('text-anchor', 'middle');

        category_label
            .transition().duration(500)
            .attr("class", function(d) {
            return 'category-label category-label-' + d.key;
            })
            .attr("transform", function(d) {
            var x_label = x_category((d.values.length * x_defect.rangeBand() + barPadding) / 2);
            var y_label = height + 20;
            return "translate(" + x_label + "," + y_label + ")";
            })
            .text(function(d) {
            return d.key;
            })
            .attr('text-anchor', 'middle');

        category_label.exit().remove();

        // adding inner groups g elements
        var defect_g = category_g.selectAll(".defect")
          .data(function(d) {
            return d.values;
          })

        defect_g
          .enter().append("g")
          .attr("class", function(d) {
            return 'defect defect-' + d.key;
          })
          .attr("transform", function(d, i) {
            return "translate(" + x_category((i * x_defect.rangeBand())) + ",0)";
          });

        defect_g
              .transition().duration(500)
              .attr("class", function(d) {
                return 'defect defect-' + d.key;
              })
              .attr("transform", function(d, i) {
                return "translate(" + x_category((i * x_defect.rangeBand())) + ",0)";
              });

        defect_g.exit().remove();

        var rects = defect_g.selectAll('.rect')
          .data(function(d) {
            return [d];
          })

          rects
          .enter().append("rect")
          .attr("class", "rect")
          .attr("width", x_category(x_defect.rangeBand() - barPadding))
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
            .transition().duration(500)
            .attr("y", function(d) {
                return y(d.value);
            })
            .attr("height", function(d) {
                return height - y(d.value);
            })

        rects.exit().remove();

        // add labels to g elements
        var defect_label = defect_g.selectAll(".defect-label")
            .data(function(d) {
              return [d];
            })

        defect_label
            .enter().append("text")
            .attr("class", function(d) {

              return 'defect-label defect-label-' + d.key;
            })

            .text(function(d) {
                return d.key;
            })
            .attr("transform", function(d) {
                    var x_label =  x_category(x_defect.rangeBand() - barPadding);
                    var y_label =  y(d.value);
                    return "translate(" + x_label + "," + y_label + ") rotate(270)";

            })
            .style('fill', 'black')
            .attr("font-size", "12px");

        defect_label
            .transition().duration(500)
            .attr("class", function(d) {
              return 'defect-label defect-label-' + d.key;
            })
            .text(function(d) {
                return d.key;
            })
            .attr("transform", function(d) {
                    var x_label =  x_category(x_defect.rangeBand() - barPadding);
                    var y_label =  y(d.value) - barPadding / 2;
                    return "translate(" + x_label + "," + y_label + ") rotate(270)";

            });
    };


    const color =[
        "#c95275", "#58ae5d", "#ba5fbe", "#b9b83e", "#543586", "#83aa46",
        "#6678d3", "#d0943a", "#bd8fd7", "#46bc8c", "#b54b8d", "#59c1c2",
        "#c3443a", "#70a3ce", "#bd6633", "#504c76", "#94863a", "#c68fb6",
        "#454d25", "#c65158", "#538f7c", "#783821", "#85a673", "#71334a",
        "#b4a170", "#da896b", "#bf8981"];

    const margin = {top: 20, right: 30, bottom: 30, left: 40},
        width = 1280 - margin.left - margin.right,
        height = 500 - margin.top - margin.bottom;

    var barPadding = 10,
        n = 27;

    var rangeBands = [];
    var cummulative = 0;
    data.forEach(function(val, i) {
      val.cummulative = cummulative;
      cummulative += val.values.length;
      val.values.forEach(function(values) {
        values.parentKey = val.key;
        rangeBands.push(i);
      })
    });

    var x_category = d3.scale.linear()
      .range([0, width]);

    var x_defect = d3.scale.ordinal().domain(rangeBands).rangeBands([0, width], .2);

    var x_category_domain = x_defect.rangeBand() * rangeBands.length;

    x_category.domain([0, x_category_domain]);


    var y = d3.scale.linear()
      .range([height, 0]);

    y.domain([0, d3.max(data, function(cat) {
        return d3.max(cat.values, function(def) {
            return def.value;
            });
        }) * 2
    ]);

    var yAxis = d3.svg.axis()
      .scale(y)
      .orient("left")
      .ticks(14);

    var tip = d3.tip()
        .attr('class', 'd3-tip')
        .offset([-10, 0])
        .html(function(d) {
          return "<strong>Album:</strong> <span style='color:red'>" + d.key +
                    "</span> <br> <strong>Weeks in chart:</strong> <span style='color:red'>" + d.value + "</span>";
    })

    var svg = d3.select("#barChart").append("svg")
      .attr("width", width + margin.left + margin.right)
      .attr("height", height + margin.top + margin.bottom)
      .style('background-color', '#F7F6E2')
      .append("g")
      .attr("transform", "translate(" + margin.left + "," + margin.top + ")");

    svg.call(tip);

    svg.append("g")
        .attr("class", "y axis")
        .call(yAxis)
        .append("text")
        .attr("transform", "rotate(-90)")
        .attr("y", 6)
        .attr("dy", ".71em")
        .style("text-anchor", "end")
        .text("Weeks in chart");

    var category_g = svg.selectAll(".category")
      .data(data)
      .enter().append("g")
      .attr("class", function(d) {
        return 'category category-' + d.key;
      })
      .attr("transform", function(d) {
        return "translate(" + x_category((d.cummulative * x_defect.rangeBand())) + ",0)";
      })
      .attr("fill", function(d, i) {
        return color[i];
      });

    // year
    var category_label = category_g.selectAll(".category-label")
        .data(function(d) {
            return [d];
        })
        .enter().append("text")
        .attr("class", function(d) {
            return 'category-label category-label-' + d.key;
        })
        .attr("transform", function(d) {
            var x_label = x_category((d.values.length * x_defect.rangeBand() + barPadding) / 2);
            var y_label = height + 20;
            return "translate(" + x_label + "," + y_label + ")";
        })
        .text(function(d) {
            return d.key;
        })
        .attr('text-anchor', 'middle');

    // adding inner groups g elements
    var defect_g = category_g.selectAll(".defect")
        .data(function(d) {
            return d.values;
        })
        .enter().append("g")
        .attr("class", function(d) {
            return 'defect defect-' + d.key;
        })
        .attr("transform", function(d, i) {
            return "translate(" + x_category((i * x_defect.rangeBand())) + ",0)";
        });

    var rects = defect_g.selectAll('.rect')
        .data(function(d) {
            return [d];
        })
        .enter().append("rect")
        .attr("class", "rect")
        .attr("width", x_category(x_defect.rangeBand() - barPadding))
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


    // add labels to g elements
    var defect_label = defect_g.selectAll(".defect-label")
        .data(function(d) {
          return [d];
        })
        .enter().append("text")
        .attr("class", function(d) {
          return 'defect-label defect-label-' + d.key;
        })

        .text(function(d) {
            return d.key;
        })
        .attr("transform", function(d) {
            var x_label =  x_category(x_defect.rangeBand() - barPadding);
            var y_label =  y(d.value) - barPadding / 2;
            return "translate(" + x_label + "," + y_label + ") rotate(270)";

        })
        .style('fill', 'black')
        .attr("font-size", "12px");


        var radioButtonChange = function() {
            dataName = d3.select(this).property('value');
                if (dataName == "albums") {
                    update(dataAlbumsBar)
                    updateBubble(dataBubbleAlbums);

                let updateTitle = d3.selectAll(".donutTitle")
                                    .text("* Select an album");

                let updateTitleBubble = d3.selectAll(".bubbleTitle")
                                        .text("UK ALBUMS CHART NUMBER ONES");
                }
                else {
                    update(dataSinglesBar);
                    updateBubble(dataBubbleSingles)

                    // aanpassen
                    let data = [{singer: "no data", value: 0}];

                    updateDonut(data);

                    let updateTitle = d3.selectAll(".donutTitle")
                                        .text("*Only possible for albums");

                    let updateTitleBubble = d3.selectAll(".bubbleTitle")
                                            .text("UK SINGLES CHART NUMBER ONES");
                }
        };

        var radioButtons = d3.selectAll("input")
            .on("change", radioButtonChange);
}

/* Set up SVG and create bubble chart. */
function makeBubbleChart(data) {

    let bubbleTitle = d3.select("#bubbleChart")
                        .append("h3")
                        .attr("class", "bubbleTitle")
                        .text("UK ALBUMS CHART NUMBER ONES")

    updateBubble = updateBubbleChart;

    // define chart parameters
    let diameter = 725,
        color    = d3.scale.category20b();

    let bubble = d3.layout.pack()
        .sort(null)
        .size([diameter, diameter])
        .padding(3.5);

    let svg = d3.select("#bubbleChart")
        .append("svg")
        .attr("width", diameter)
        .attr("height", diameter)
        .attr("class", "bubble");

    let tooltip = d3.select("#bubbleChart")
        .append('div')
        .attr('class', 'tooltip');

    tooltip.append('div')
        .attr('class', 'title');

    tooltip.append('div')
        .attr('class', 'weeks');

    tooltip.append('div')
        .attr('class', 'year');

    updateBubble(data);

    /* Update bubble chart when user switches input: album - singles. */
    function updateBubbleChart(dataset) {

        // transform data to numbers
        var data = dataset.map(function(d){ d.value = +d["weeks"]; return d; });

        // bubbles needs very specific format, convert data to this
        var nodes = bubble.nodes({children:data}).filter(function(d) { return !d.children; });

        var node = svg.selectAll(".node")
            .data(nodes);

        var text = svg.selectAll("text")
            .data(nodes);

        var names = svg.selectAll(".names")
            .data(nodes);

        var nodeEnter = node.enter()
            .append("g")
            .attr("class", "node")
            .attr("transform", "translate(0,0)");

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
                if (dataName == "singles") {

                    let data = [{singer: "no data", value: 0}];

                    updateDonut(data);

                    let updateTitle = d3.selectAll(".donutTitle")
                                        .text("*Only possible for albums");
                }
                else {
                    var title = d.title, lead;

                    for (var album in dataDonut) {
                        if (title === dataDonut[album].title) {
                            lead = dataDonut[album].lead
                        }
                    };

                    if (lead) {
                        updateDonut(lead);
                        let updateTitle = d3.selectAll(".donutTitle")
                                            .text(title);
                    }
                    else {
                        let data = [{singer: "no data", value: 0}];

                        updateDonut(data);

                        let updateTitle = d3.selectAll(".donutTitle")
                                            .text("Sorry, no data available");
                    };
                };
            });

        node.select("circle")
            .attr("r", function(d) { return d.r; })
            .attr("cx", function(d) { return d.x; })
            .attr("cy", function(d) { return d.y; })
            .style("fill", function(d) { return color(d.year); })

        node
            .transition().duration(750)
            .attr("class", "node")
            .attr("transform", "translate(0,0)")

        node.exit().remove();

        text
            .enter().append("text")
            .attr("class", "names")
            .attr("x", function(d){ return d.x; })
            .attr("y", function(d){ return d.y + 5; })
            .attr("text-anchor", "middle")
            .text(function(d){ return d["title"]; })
            .style({
                "fill":"white",
                "font-family":"Helvetica Neue, Helvetica, Arial, san-serif"
            })
            .style("font-size", function(d) { return Math.min(2 * d.radius, (2 * d.radius - 8) / this.getComputedTextLength() * 24) + "px"; })
            .attr("dy", ".35em");

        text
            .transition().duration(750)
            .attr("x", function(d){ return d.x; })
            .attr("y", function(d){ return d.y + 5; })
            .text(function(d){ return d["title"]; });

        text.exit().remove();
    };
}

// http://bl.ocks.org/arpitnarechania/577bd1d188d66dd7dffb69340dc2d9c9
function makeDonutChart(data, albumTitle) {

    let donutTitle = d3.select("#donutChart")
                        .append("h3")
                        .text("% LEAD VOCALS OF ALBUM PER MEMBER:")
                        .append("h3")
                        .attr("class", "donutTitle")
                        .text(albumTitle);

    function mergeWithFirstEqualZero(first, second){

        var secondSet = d3.set();

        second.forEach(function(d) { secondSet.add(d.singer); });

        var onlyFirst = first
            .filter(function(d){ return !secondSet.has(d.singer) })
            .map(function(d) { return {singer: d.singer, value: 0}; });

        var sortedMerge = d3.merge([ second, onlyFirst ])
            .sort(function(a, b) {
                return d3.ascending(a.singer, b.singer);
              });

        return sortedMerge;
    }

    function updateDonutChart(data) {

        var oldData = svg.select(".slices")
          .selectAll("path")
          .data().map(function(d) { return d.data });

        if (oldData.length == 0) oldData = data;

        var was = mergeWithFirstEqualZero(data, oldData),
            is = mergeWithFirstEqualZero(oldData, data);

        var text = arcs.selectAll("text")
            .data(pie(data));

        var slice = svg.select(".slices")
          .selectAll("path")
          .data(pie(was), key);

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
                var interpolate = d3.interpolate(this._current, d);
                var _this = this;
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

        text
            .enter().append("text").transition().delay(500).duration(100)
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
            .transition().delay(500).duration(100)
            .attr("transform", function(d) { return "translate(" + arc.centroid(d) + ")"; })
            .attr("dy", ".35em")
            .text(function(d) {
                if (d.data.value > 0) {
                    return d.data.value + "%";
                }
            });

        text.exit().remove()

        console.log(is);
        var legend = svg.selectAll(".legend")
          .data(pie(is))
          .enter().append("g")
          .attr("transform", function(d, i){
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

        legend.append("text") // add the text
            .text(function(d){
                console.log(d);
                if (d.data.singer != "no data")  {
                    return d.data.singer;
                }
            })
            .style("font-size", 12)
            .style("fill", "white")
            .attr("y", 15)
            .attr("x", 23);

        legend.select("#nodata")
            .remove()
    }

    updateDonut = updateDonutChart;

    var margin = {top: 100, bottom: 50, left: 50, right: 50};
	var width = 500 - margin.left - margin.right,
    	height = 500,
    	radius = Math.min(width, height) / 2;
        		var donutWidth = 100;
        		// var legendRectSize = 18;
        		// var legendSpacing = 4;

    var keys = [
        "McCartney",
        "Lennon",
        "Harrison",
        "Starr",
        "Lennon & McCartney",
        "Lennon & Harrison",
        "Lennon & McCartney & Harrison",
        "Lennon & McCartney & Harrison & Starr",
        "instrumental"
    ];

    var color = d3.scale.category20b();

    var svg = d3.select('#donutChart')
    .append("svg")
        .attr("width", width)
        .attr("height", height + margin.top + margin.bottom)
    .append("g")
        .attr("transform", "translate(" + width / 2 + "," + ((height / 2) - 50) + ")");

    svg.append("g").attr("class", "slices");

    var pie = d3.layout.pie()
        .sort(null)
        .value(function(d) { return d.value; });

    // Declare an arc generator function
    var arc = d3.svg.arc()
        .outerRadius(radius - 20)
        .innerRadius(radius - donutWidth);

    var key = function(d) { return d.data.singer; };

    var tooltip = d3.select("#donutChart")
    	.append('div')
    	.attr('class', 'tooltip');

    tooltip.append('div')
    	.attr('class', 'singer');

    tooltip.append('div')
        .attr('id', 'percent');

    // //Select paths, use arc generator to draw
    var arcs = svg.selectAll(".slice")
        .data(pie(data))
        .enter().append("svg:g")
        .attr("class", "slice");

    updateDonut(data, albumTitle);
}
