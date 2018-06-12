/**
 * Name: Mercylyn Wiemer (10749306)
 * Course: programmeerproject

http://bl.ocks.org/enjalot/1525346
http://bl.ocks.org/mapsam/6090056
http://bl.ocks.org/enjalot/1525346
https://stackoverflow.com/questions/37812922/grouped-category-bar-chart-with-different-groups-in-d3
 **/

window.onload = function() {

    queue()
        .defer(d3.csv, "data/beatles_chart_albums_sample.csv")
        .defer(d3.csv, "data/beatles_chart_singles.csv")
        .await(convertData);

    function convertData(error, albums, singles) {
        if (error) throw error;

        var parse = d3.time.format("%m/%d/%Y").parse;

        var dataAlbums = albums.map(function(d) {
            return {"date" : parse(d.date), "highestPosition" : +d.highestPosition,
                    "weeksChart" : +d.weeksChart, "award" : d.award, "title" : d.title,
                    "labelCatNo" : d.labelCatNo, "weeksNo1" : +d.weeksNo1, "usNo1" : +d.usNo1};
        });

        // }
        console.log(dataAlbums)
        var dataSingles = singles.map(function(d) {
            return {"date" : parse(d.date), "highestPosition" : +d.highestPosition,
                    "weeksChart" : +d.weeksChart, "title" : d.title,
                    "artists" : d.artists, "weeksNo1" : +d.weeksNo1, "usNo1" : +d.usNo1};
        })

        var dataChart = {"albums" : dataAlbums, "singles" : dataSingles};

        var dataArray = dataToJSON(dataAlbums);

        // var dataDictionary = convertToDictionary(dataArray)

        console.log(dataArray);
        // console.log("functie stacked data", stackedData)
        // console.log("data chart", dataAlbums[0].date.getFullYear());
        // console.log("stacked chart", stackedChart)
        // console.log("album names", albumNames)
        makeBarChart(dataArray);
    };
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

    for (let i = 0; i < dataPerAlbum.length; i++) {

        var values = {
            key: dataPerAlbum[i][1],
            value: dataPerAlbum[i][2]
        }

        if (!(years.includes(dataPerAlbum[i][0]))) {

            if (!(years.length == 0)) {
            dataPerYear.push({
                key: years.slice(-1)[0],
                values: valuesArray
            });
        }

            valuesArray = [];
            valuesArray.push(values);
            years.push(dataPerAlbum[i][0]);
        }
        else {
            valuesArray.push(values)
        }
    }

    // add last value
    dataPerYear.push({
        key: years.slice(-1)[0],
        values: [valuesArray]
    });

    return dataPerYear;
    // return dataPerAlbum;
};

// function convertToDictionary(dataset) {
//     let data = [];
//     let dataCountry = {};
//
//     // Fetch data variables, put in JSON format and add to dataList
//     for (let i = 0; i < dataset.length; i++) {
//         data.push({
//             key: dataset[i],
//             lifeExpect: dataset[i][0],
//             waterQuality: dataset[i][1],
//             selfHealth: dataset[i][2],
//             airPolution: dataset[i][3]
//         });
//     };
//
//     // Assign data value to country (ISO) in JSON format
//     for (let i = 0; i < dataset.length; i++) {
//         dataCountry[countryList[i]] = data[i]
//     };
//
//     return {dataCountry};
// };

function makeBarChart(data) {
    // http://bl.ocks.org/mstanaland/6100713
    // Set dimensions of canvas
    // const margin = {top: 100, bottom: 50, right:30, left: 60},
    //     width = 470 - margin.left - margin.right,
    //     height = 470 - margin.top - margin.bottom,
    //     barHeight = 20,
    //     originChart = 0;

    // var color = {
    //   1963: '#4A7B9D',
    //   1964: '#54577C',
    //   1965: '#ED6A5A'
    // };

    var dataExample = [{
      key: 'Mechanical',
      values: [{
        key: 'Gear',
        value: 11
      }, {
        key: 'Bearing',
        value: 8
      }, {
        key: 'Motor',
        value: 3
      }]
    }, {
      key: 'Electrical',
      values: [{
        key: 'Switch',
        value: 19
      }, {
        key: 'Plug',
        value: 12
      }, {
        key: 'Cord',
        value: 11
      }, {
        key: 'Fuse',
        value: 3
      }, {
        key: 'Bulb',
        value: 2
      }]
    }, {
      key: 'Hydraulic',
      values: [{
        key: 'Pump',
        value: 4
      }, {
        key: 'Leak',
        value: 3
      }, {
        key: 'Seals',
        value: 1
      }]
    }];

    console.log("example", dataExample);
    console.log("real date", data)
    var margin = {
        top: 20,
        right: 50,
        bottom: 30,
        left: 30
      },
      width = 960 - margin.left - margin.right,
      height = 500 - margin.top - margin.bottom;

    var barPadding = 5;

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


    var x_defect = d3.scale.ordinal().domain(rangeBands).rangeRoundBands([0, width], .8);
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
      .tickFormat(d3.format(".2s"));

    var svg = d3.select("body").append("svg")
      .attr("width", width + margin.left + margin.right)
      .attr("height", height + margin.top + margin.bottom)
      .style('background-color', 'EFEFEF')
      .append("g")
      .attr("transform", "translate(" + margin.left + "," + margin.top + ")");

    svg.append("g")
      .attr("class", "y axis")
      .call(yAxis)
      .append("text")
      .attr("transform", "rotate(-90)")
      .attr("y", 6)
      .attr("dy", ".71em")
      .style("text-anchor", "end")
      .text("Value");

    var category_g = svg.selectAll(".category")
      .data(data)
      .enter().append("g")
      .attr("class", function(d) {
        return 'category category-' + d.key;
      })
      .attr("transform", function(d) {
        return "translate(" + x_category((d.cummulative * x_defect.rangeBand())) + ",0)";
      })
      // .attr("fill", function(d) {
      //   return color[d.key];
      // });

    var category_label = category_g.selectAll(".category-label")
      .data(function(d) {
        return [d];
      })
      .enter().append("text")
      .attr("class", function(d) {
        // console.log(d)
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

    var defect_label = defect_g.selectAll(".defect-label")
      .data(function(d) {
        return [d];
      })
      .enter().append("text")
      .attr("class", function(d) {
        // console.log(d)
        return 'defect-label defect-label-' + d.key;
      })
      .attr("transform", function(d) {
        var x_label = x_category((x_defect.rangeBand() + barPadding) / 2);
        var y_label = height + 10;
        return "translate(" + x_label + "," + y_label + ")";
      })
      .text(function(d) {
        return d.key;
      })
      .attr('text-anchor', 'middle');


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
      });

}
