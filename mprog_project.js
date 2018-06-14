/**
 * Name: Mercylyn Wiemer (10749306)
 * Course: programmeerproject

http://bl.ocks.org/enjalot/1525346
http://bl.ocks.org/mapsam/6090056
http://bl.ocks.org/enjalot/1525346
https://stackoverflow.com/questions/37812922/grouped-category-bar-chart-with-different-groups-in-d3
https://plnkr.co/edit/L0eQwtEMQ413CpoS5nvo?p=preview
https://stackoverflow.com/questions/43903145/d3-position-x-axis-label-within-rectangle-and-rotate-90-degrees?rq=1
 **/

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

        console.log(lead)
        var dataSingles = singles.map(function(d) {
            return {"date" : parse(d.date), "highestPosition" : +d.highestPosition,
                    "weeksChart" : +d.weeksChart, "title" : d.title,
                    "artists" : d.artists, "weeksNo1" : +d.weeksNo1, "usNo1" : +d.usNo1};
        })

        var dataChart = {"albums" : dataAlbums, "singles" : dataSingles};

        var dataArray = dataToJSON(dataAlbums);

        var dataBubble = convertForBubble(dataAlbums)

        console.log(dataBubble)

        // var dataDictionary = convertToDictionary(dataArray)

        console.log(dataArray);
        // console.log("functie stacked data", stackedData)
        // console.log("data chart", dataAlbums[0].date.getFullYear());
        // console.log("stacked chart", stackedChart)
        // console.log("album names", albumNames)
        makeBarChart(dataArray);

        makeBubbleChart(dataBubble);

        makePieChart();
    };
};

function convertForBubble(dataset) {
    data = [];

    for (let i = 0; i < dataset.length; i++) {

        if (dataset[i].highestPosition === 1) {
            data.push( {
                title: dataset[i].title,
                weeks: dataset[i].weeksNo1,
                usNo: dataset[i].usNo1
            })
        };
    };

    return data;
}

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

    console.log(dataPerAlbum)

    for (let i = 0; i < dataPerAlbum.length; i++) {

        var values = {
            key: dataPerAlbum[i][1],
            value: dataPerAlbum[i][2]
        }

        // console.log(values)
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
    console.log(dataPerYear)
    return dataPerYear;
    // return dataPerAlbum;

};


function makeBarChart(data) {
    // http://bl.ocks.org/mstanaland/6100713
    // Set dimensions of canvas
    // const margin = {top: 100, bottom: 50, right:30, left: 60},
    //     width = 470 - margin.left - margin.right,
    //     height = 470 - margin.top - margin.bottom,
    //     barHeight = 20,
    //     originChart = 0;

    var color = {
      1963: '#a6cee3',
      1964: '#1f78b4',
      1965: '#b2df8a',
      1966: '#33a02c',
      1967: '#fb9a99',
      1968: '#e31a1c',
      1969: '#fdbf6f',
      1970: '#ff7f00',
      1971: '#cab2d6',
      1973: '#6a3d9a',
      1976: '#8dd3c7',
      1977: '#b15928',
      1979: '#bebada',
      1980: '#fb8072',
      1982: '#80b1d3',
      1987: '#fdb462',
      1988: '#756bb1',
      1993: '#fccde5',
      1994: '#bc80bd',
      1995: '#ef6548',
      1996: '#6e016b',
      1999: '#a8ddb5',
      2000: '#4eb3d3',
      2003: '#08589e',
      2006: '#fa9fb5', //
      2007: '#ef6548',
      2009: '8c510a'
    };

    // console.log("real date", data)
    var margin = {
        top: 20,
        right: 30,
        bottom: 30,
        left: 40
      },
      width = 1280 - margin.left - margin.right,
      height = 500 - margin.top - margin.bottom;

    var barPadding = 10,
        n = 27 // number of years

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
    // console.log(data);

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
    })]);

    var category_axis = d3.svg.axis()
      .scale(x_category)
      .orient("bottom");


    var yAxis = d3.svg.axis()
      .scale(y)
      .orient("left")
      .ticks(14);

    var tip = d3.tip()
        .attr('class', 'd3-tip')
        .offset([-10, 0])
        .html(function(d) { console.log(d);
          return "<strong>Album:</strong> <span style='color:red'>" + d.key +
                    "</span> <br> <strong>Weeks in chart:</strong> <span style='color:red'>" + d.value + "</span>";
    })

    var svg = d3.select("#barChart").append("svg")
      .attr("width", width + margin.left + margin.right)
      .attr("height", height + margin.top + margin.bottom)
      .style('background-color', 'EFEFEF')
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

    // doesn't work
    // svg.append("g")
    //     .attr("class", "x axis")
    //     .attr("transform", "translate(0," + height + ")")
    //     .call(category_axis);


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
        var y_label = height + 30;
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
          // console.log(d)
          return 'defect-label defect-label-' + d.key;
        })
        // .attr("transform", function(d) {
        //   var x_label = x_category((x_defect.rangeBand() + barPadding) / 2);
        //   var y_label = height + 10;
        //   return "translate(" + x_label + "," + y_label + ");
        // })
        // .attr("x", function(d) {
        //   return x_category(barPadding);
        // })
        // .attr("y", function(d) {
        //   return y(d.value);
        // })

        .text(function(d) {
            return d.key;
        })
        // .attr("width", x_category(x_defect.rangeBand() - barPadding))
        // .attr("transform", function(d, i) {
        // // http://stackoverflow.com/questions/11252753/rotate-x-axis-text-in-d3
        // var yVal = y(d.value);
        // var xVal = x_category(barPadding);
        // return "translate(" + xVal + "," + yVal + ") rotate(270)";
        // })
        .attr("transform", function(d) {
            if (d.value < 114) {
                var x_label =  x_category(x_defect.rangeBand() - barPadding);
                var y_label =  y(d.value);
                return "translate(" + x_label + "," + y_label + ") rotate(270)";
            }
            else {
                var x_label =  x_category(x_defect.rangeBand() - barPadding);
                var y_label =  y(d.value - (margin.left + margin.right));
                return "translate(" + x_label + "," + y_label + ") rotate(270)";
            }
        })
        .style('fill', 'black')
        .attr("font-size", "12px");
}

function makeBubbleChart(data) {
    var diameter = 500, //max size of the bubbles
        color    = d3.scale.category20b(); //color category

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
    data = data.map(function(d){ d.value = +d["weeks"]; return d; });

    // bubbles needs very specific format, convert data to this.
    var nodes = bubble.nodes({children:data}).filter(function(d) { return !d.children; });

    //setup the chart
    var bubbles = svg.append("g")
        .attr("transform", "translate(0,0)")
        .selectAll(".bubble")
        .data(nodes)
        .enter();

    //create the bubbles
    bubbles.append("circle")
        .attr("r", function(d){ return d.r; })
        .attr("cx", function(d){ return d.x; })
        .attr("cy", function(d){ return d.y; })
        .style("fill", function(d) { return color(d.value); });

    //format the text for each bubble
    bubbles.append("text")
        .attr("x", function(d){ return d.x; })
        .attr("y", function(d){ return d.y + 5; })
        .attr("text-anchor", "middle")
        .text(function(d){ return d["title"]; })
        .style({
            "fill":"white",
            "font-family":"Helvetica Neue, Helvetica, Arial, san-serif",
            "font-size": "12px"
        });
}

function makePieChart() {
    var w = 400;
    var h = 400;
    var r = h/2;
    var aColor = [
        'rgb(178, 55, 56)',
        'rgb(213, 69, 70)',
        'rgb(230, 125, 126)',
        'rgb(239, 183, 182)'
    ]

    var data = [
        {"label":"Colorectale levermetastase (n=336)", "value":74},
        {"label": "Primaire maligne levertumor (n=56)", "value":12},
        {"label":"Levensmetatase van andere origine (n=32)", "value":7},
        {"label":"Beningne levertumor (n=34)", "value":7}
    ];


    var vis = d3.select('#pieChart')
    .append("svg").data([data])
    .attr("width", w)
    .attr("height", h)
    .append("svg:g")
    .attr("transform", "translate(" + r + "," + r + ")");

    var pie = d3.layout.pie().value(function(d){return d.value;});

    // Declare an arc generator function
    var arc = d3.svg.arc().outerRadius(r);

    // Select paths, use arc generator to draw
    var arcs = vis.selectAll("g.slice").data(pie).enter().append("svg:g").attr("class", "slice");
    arcs.append("svg:path")
        .attr("fill", function(d, i){return aColor[i];})
        .attr("d", function (d) {return arc(d);})
    ;

    // Add the text
    arcs.append("svg:text")
        .attr("transform", function(d){
            d.innerRadius = 100; /* Distance of label to the center*/
            d.outerRadius = r;
            return "translate(" + arc.centroid(d) + ")";}
        )
        .attr("text-anchor", "middle")
        .text( function(d, i) {return data[i].value + '%';})
    ;

}
