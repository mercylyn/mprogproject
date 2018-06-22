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

var dataAlbumsBar, dataSinglesBar, dataBubbleAlbums, dataBubbleSingles, dataPie,
    updateBubble, dataName, updatePie;

window.onload = function() {

    queue()
        .defer(d3.csv, "data/beatles_chart_albums.csv")
        .defer(d3.csv, "data/beatles_chart_singles.csv")
        .defer(d3.csv, "data/lead_vocals_albums_clean.csv")
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

        dataPie = calculatePercentage(dataLead);

        // makeBarChart(dataArray);
        makeBarChart(dataAlbumsBar);

        // update(dataAlbumsBar)
        makeBubbleChart(dataBubbleAlbums);

        // select first album of the timeline
        makePieChart(dataPie[0].lead);
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
                {singer: "Lennon & McCartney & Harrison & Starr", value: Math.round((album.lennonMcCartneyHarrisonStarr / noTracks) * 100)}
            // }
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
            }) * 2]);

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
          .attr("fill", function(d) {
            return color[d.key];
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
            // .attr("fill", function(d) {
            //   return color[d.key];
            // });

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
                    var y_label =  y(d.value);
                    return "translate(" + x_label + "," + y_label + ") rotate(270)";

            });
    };

    // var color = {
    //   1963: '#a6cee3', 1964: '#1f78b4', 1965: '#b2df8a', 1966: '#33a02c',
    //   1967: '#fb9a99', 1968: '#e31a1c', 1969: '#fdbf6f', 1970: '#ff7f00',
    //   1971: '#cab2d6', 1973: '#6a3d9a', 1976: '#8dd3c7', 1977: '#b15928',
    //   1979: '#bebada', 1980: '#fb8072', 1982: '#80b1d3', 1987: '#fdb462',
    //   1988: '#756bb1', 1993: '#fccde5', 1994: '#bc80bd', 1995: '#ef6548',
    //   1996: '#6e016b', 1999: '#a8ddb5', 2000: '#4eb3d3', 2003: '#08589e',
    //   2006: '#fa9fb5', 2007: '#ef6548', 2009: '#dd1c77'
    // };

    var color = {
      1963: '#67001f', 1964: '#b2182b', 1965: '#d6604d', 1966: '#f4a582',
      1967: '#fddbc7', 1968: '#f7f7f7', 1969: '#d1e5f0', 1970: '#92c5de',
      1971: '#4393c3', 1973: '#2166ac', 1976: '#053061', 1977: '#b15928',
      1979: '#bebada', 1980: '#fb8072', 1982: '#80b1d3', 1987: '#fdb462',
      1988: '#756bb1', 1993: '#fccde5', 1994: '#bc80bd', 1995: '#ef6548',
      1996: '#6e016b', 1999: '#a8ddb5', 2000: '#4eb3d3', 2003: '#08589e',
      2006: '#fa9fb5', 2007: '#ef6548', 2009: '#dd1c77'
    };

    var margin = {top: 20, right: 30, bottom: 30, left: 40},
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
        }) * 1.75
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
      .attr("fill", function(d) {
        return color[d.key];
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

    //
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
                var y_label =  y(d.value);
                return "translate(" + x_label + "," + y_label + ") rotate(270)";

        })
        .style('fill', 'black')
        .attr("font-size", "12px");


        var radioButtonChange = function() {
            dataName = d3.select(this).property('value');
                if (dataName == "albums") {
                    update(dataAlbumsBar)
                    updateBubble(dataBubbleAlbums);
                }
                else {
                    update(dataSinglesBar);
                    updateBubble(dataBubbleSingles)
                }
        };

        var radioButtons = d3.selectAll("input")
            .on("change", radioButtonChange);
}

function makeBubbleChart(data) {
    function updateBubbleChart(dataset) {

        var data = dataset.map(function(d){ d.value = +d["weeks"]; return d; });

        // bubbles needs very specific format, convert data to this.
        var nodes = bubble.nodes({children:data}).filter(function(d) { return !d.children; });

        var node = svg.selectAll(".node")
            .data(nodes);

        var text = svg.selectAll("text")
            .data(nodes);

            //setup the chart
            var nodeEnter = node.enter()
                .append("g")
                .attr("class", "node")
                .attr("transform", "translate(0,0)");

            nodeEnter
                .append("circle")
                .attr("r", function(d) { return d.r; })
                .attr("cx", function(d) { return d.x; })
                .attr("cy", function(d) { return d.y; })
                .style("fill", function(d) { return color(d.value); })


            text
                .enter().append("text")
                .attr("x", function(d){ return d.x; })
                .attr("y", function(d){ return d.y + 5; })
                .attr("text-anchor", "middle")
                .text(function(d){ return d["title"]; })
                .style({
                    "fill":"white",
                    "font-family":"Helvetica Neue, Helvetica, Arial, san-serif",
                    "font-size": "12px"
                });

            text
                .transition().duration(1000)
                .attr("x", function(d){ return d.x; })
                .attr("y", function(d){ return d.y + 5; })
                .text(function(d){ return d["title"]; });


            node.select("circle")
                .attr("r", function(d) { return d.r; })
                .attr("cx", function(d) { return d.x; })
                .attr("cy", function(d) { return d.y; })
                .style("fill", function(d) { return color(d.value); })
                .on('mouseover', function(d) {
                    tooltip.select('.title').html("Title: " + d.title);
                    tooltip.select('.weeks').html("In Chart: " + d.weeks + " weeks");

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

            node
                .transition().duration(1000)
                .attr("class", "node")
                .attr("transform", "translate(0,0)")

            node.exit().remove();

            text.exit().remove();
    };
    updateBubble = updateBubbleChart;

    var diameter = 800,
        clusterPadding = 6
        color    = d3.scale.category20b();

    var bubble = d3.layout.pack()
        .sort(null)
        .size([diameter, diameter])
        .padding(1.5);

    var svg = d3.select("#bubbleChart")
        .append("svg")
        .attr("width", diameter)
        .attr("height", diameter)
        .attr("class", "bubble");

    // convert numerical values from strings to numbers
    var data = data.map(function(d){ d.value = +d["weeks"]; return d; });

    // bubbles needs very specific format, convert data to this.
    var nodes = bubble.nodes({children:data}).filter(function(d) { return !d.children; });

    //setup the chart
    var node = svg.selectAll(".node")
        .data(nodes)
        .enter().append("g")
        .attr("class", "node")
        .attr("transform", "translate(0,0)");
        // .selectAll(".bubble")

    var tooltip = d3.select("#bubbleChart")
    	.append('div')
    	.attr('class', 'tooltip');


    tooltip.append('div')
                .attr('class', 'title');
    tooltip.append('div')
    	.attr('class', 'weeks');


    //create the bubbles
    node.append("circle")
        .attr("r", function(d) { return d.r; })
        .attr("cx", function(d) { return d.x; })
        .attr("cy", function(d) { return d.y; })
        .style("fill", function(d) { return color(d.value); })
        .on('mouseover', function(d) {

            tooltip.select('.title').html("Title: " + d.title);
            tooltip.select('.weeks').html("In Chart: " + d.weeks + " weeks");

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

                console.log("not an album")
            }
            else {
                // updatePie(dataPie)
                // var album t
                var title = d.title, lead;

                for (var album in dataPie) {
                    if (title === dataPie[album].title) {
                        lead = dataPie[album].lead
                    }
                };

                if (lead) {
                    updatePie(lead);
                }
                else {
                    console.log("no data")
                }

            };
        });

    //format the text for each bubble
    node.append("text")
        .attr("x", function(d){ return d.x; })
        .attr("y", function(d){ return d.y + 10; })
        .attr("text-anchor", "middle")
        .text(function(d){
                return d["title"];
        })
        .style({
            "fill":"white",
            "font-family":"Helvetica Neue, Helvetica, Arial, san-serif",
            "font-size": "12px"
        });
}

// selecteren svg

// http://bl.ocks.org/arpitnarechania/577bd1d188d66dd7dffb69340dc2d9c9
function makePieChart(data) {
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
    function updatePieChart(data) {
        // console.log("update pie")
        // console.log(data)

        var oldData = svg.select(".slices")
          .selectAll("path")
          .data().map(function(d) { console.log(d.data); return d.data });

        if (oldData.length == 0) oldData = data;

        var was = mergeWithFirstEqualZero(data, oldData);
        var is = mergeWithFirstEqualZero(oldData, data);


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
          .duration(500)
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
          .delay(500)
          .duration(0)
          .remove();

        // arcs.select("svg:text")
        //   .attr("transform", function(d) {
        //       d.innerRadius = 100; /* Distance of label to the center*/
        //       d.outerRadius = radius;
        //       return "translate(" + arc.centroid(d) + ")";}
        //   )
        //   .attr("text-anchor", "middle")
        //   // .text( function(d, i) {return data[i].value + '%';})
        //   .text( function(d, i) {
        //       if (data[i].value > 0) {
        //           // console.log("hoi");
        //       return data[i].singer;
        //       }
        //   });
        //
        // arcs.exit()
        // .transition()
        // .delay(500)
        // .duration(0)
        // .remove();
        // svg.data([data]);
        //
        // var arc = d3.svg.arc()
        //     .outerRadius(radius - 20)
        //     .innerRadius(radius - donutWidth);
        //
        // var pie = d3.layout.pie()
            // .sort(null)
            // .value(function(d) {console.log(d.value); return d.value; });

        // arcs.data(pie(data))
        //      .enter()
        //      .append("svg:g")
        //      .attr("class", "slice")
        //      .append("svg:path")
        //      .attr("fill", function(d, i){return colour(i);}).attr("d", arc);

        // arcs = arcs.data(pie(data))

  //       arcs.transition()
  //           .duration(750)
  //           .attrTween('d', function(d) { // 'd' specifies the d attribute that we'll be animating
  //       var interpolate = d3.interpolate(this._current, d); // this = current path element
  //       this._current = interpolate(0); // interpolate between current value and the new value of 'd'
  //       return function(t) {
  //         return arc(interpolate(t));
  //       };
  //     });
  // });
    }

    updatePie = updatePieChart;
    // var pie, arc, arcs;
    // var svg = d3.select('#pieChart').select("svg");
    //
    // if ((svg.empty())) {
        var margin = {top:100, bottom:50, left:50, right:50};
    	var width = 500 - margin.left - margin.right,
    	height = 800,
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


        var color = d3.scale.category20();

        var svg = d3.select('#pieChart')
        .append("svg")
        // .data([data])
            .attr("width", width)
            .attr("height", height + margin.top + margin.bottom)
        .append("g")
            .attr("transform", "translate(" + width / 2 + "," + height / 2 + ")");

        svg.append("g").attr("class", "slices");

        var pie = d3.layout.pie()
            .sort(null)
            .value(function(d) { return d.value; });

        console.log(pie)

        // Declare an arc generator function
        var arc = d3.svg.arc()
            .outerRadius(radius - 20)
            .innerRadius(radius - donutWidth);


        var key = function(d) { return d.data.singer; };

        // var color = d3.scale.ordinal(d3.schemePastel1)
        //     .domain(keys);

        var tooltip = d3.select("#pieChart")
        	.append('div')
        	.attr('class', 'tooltip');

        tooltip.append('div')
        	.attr('class', 'singer');

        tooltip.append('div')
            .attr('id', 'percent');
        //
        // //Select paths, use arc generator to draw
        var arcs = svg.selectAll(".slice")
            .data(pie(data))
            .enter().append("svg:g")
            .attr("class", "slice");

        updatePie(data);

        //
        // arcs.append("svg:path")
        //     .attr("d", arc)
        //     .attr("fill", function(d, i) { return color(i); })
        //       // .each(function(d) { this._current = d; }) // store the initial angles
        //           .on('mouseover', function(d) {
        //               // var total = d3.sum(dataset.map(function(d) {
        //               // 	return (d.enabled) ? d.value : 0;
        //               // }));
        //
        //               // var percent = Math.round(1000 * d.data.value / total) / 10;
        //               tooltip.select('.singer').html(d.data.singer).style('color','black');
        //               tooltip.select('#percent').html(d.data.value + "%");
        //               // tooltip.select('.percent').html(percent + '%');
        //
        //               tooltip.style('display', 'block');
        //               tooltip.style('opacity',2);
        //
        //           })
        //           .on('mousemove', function(d) {
        //               tooltip.style('top', (d3.event.layerY + 10) + 'px')
        //               .style('left', (d3.event.layerX - 25) + 'px');
        //           })
        //           .on('mouseout', function() {
        //               tooltip.style('display', 'none');
        //               tooltip.style('opacity',0);
        //           });
        //
        //     // // Add the text
        //     arcs.append("svg:text")
        //         .attr("transform", function(d) {
        //             d.innerRadius = 100; /* Distance of label to the center*/
        //             d.outerRadius = radius;
        //             return "translate(" + arc.centroid(d) + ")";}
        //         )
        //         .attr("text-anchor", "middle")
        //         // .text( function(d, i) {return data[i].value + '%';})
        //         .text( function(d, i) {
        //             if (data[i].value > 0) {
        //                 // console.log("hoi");
        //             return data[i].singer;
        //             }
        //         });

/////////////////////////////


            // again rebind for legend
        // var legend = svg.selectAll(".legend")
        //   .data(pie(data))
        //   .enter().append("g")
        //   .attr("transform", function(d,i){
        //     return "translate(" + (width - 600) + "," + (i * 30 + 20) + ")"; // place each legend on the right and bump each one down 15 pixels
        //   })
        //   .attr("class", "legend");
        //
        // legend.append("rect") // make a matching color rect
        //   .attr("width", 10)
        //   .attr("height", 10)
        //   .attr("fill", function(d, i) {
        //     return colour(i);
        //   });
        //
        // legend.append("text") // add the text
        //     .text(function(d){
        //     return d.value;
        //     })
        //     .style("font-size", 12)
        //     .attr("y", 10)
        //     .attr("x", 11);


}
