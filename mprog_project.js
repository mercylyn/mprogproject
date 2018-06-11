/**
 * Name: Mercylyn Wiemer (10749306)
 * Course: programmeerproject

http://bl.ocks.org/enjalot/1525346
http://bl.ocks.org/mapsam/6090056
http://bl.ocks.org/enjalot/1525346
 **/

window.onload = function() {

    queue()
        .defer(d3.csv, "data/beatles_chart_albums.csv")
        .defer(d3.csv, "data/beatles_chart_singles.csv")
        .await(convertData);

    function convertData(error, albums, singles) {
        if (error) throw error;

        console.log(albums[0])
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
        })

        var dataChart = {"albums" : dataAlbums, "singles" : dataSingles};
        //
        // for (var key in dataAlbums) {
        //
        //     // console.log(dataAlbums[key])
        //     if (dataAlbums[key].usNo1 == 1) {
        //         console.log(dataAlbums[key])
        //     }
        // }
        console.log(dataAlbums)
        console.log("data chart", dataAlbums[0].date.getFullYear());

        makeBarChart(dataChart);
    };
};

function makeBarChart(data_beatles) {
    // http://bl.ocks.org/mstanaland/6100713
    // Set dimensions of canvas
    // const margin = {top: 100, bottom: 50, right:30, left: 60},
    //     width = 470 - margin.left - margin.right,
    //     height = 470 - margin.top - margin.bottom,
    //     barHeight = 20,
    //     originChart = 0;
    var margin = {top: 20, right: 160, bottom: 35, left: 30};

    var width = 960 - margin.left - margin.right,
        height = 500 - margin.top - margin.bottom;

    var svg = d3.select("#chart")
      .append("svg")
      .attr("width", width + margin.left + margin.right)
      .attr("height", height + margin.top + margin.bottom)
      .append("g")
      .attr("transform", "translate(" + margin.left + "," + margin.top + ")");

      var data = [
        { year: "2006", redDelicious: "70", mcintosh: "51", oranges: "9", pears: "6" },
        { year: "2007", redDelicious: "12", mcintosh: "18", oranges: "9", pears: "4" },
        { year: "2008", redDelicious: "05", mcintosh: "20", oranges: "8", pears: "2" },
        { year: "2009", redDelicious: "01", mcintosh: "15", oranges: "5", pears: "4" },
        { year: "2010", redDelicious: "02", mcintosh: "10", oranges: "4", pears: "2" },
        { year: "2011", redDelicious: "03", mcintosh: "12", oranges: "6", pears: "3" },
        { year: "2012", redDelicious: "04", mcintosh: "15", oranges: "8", pears: "1" },
        { year: "2013", redDelicious: "06", mcintosh: "11", oranges: "9", pears: "4" },
        { year: "2014", redDelicious: "10", mcintosh: "13", oranges: "9", pears: "5" },
        { year: "2015", redDelicious: "16", mcintosh: "19", oranges: "6", pears: "9" },
        { year: "2016", redDelicious: "19", mcintosh: "17", oranges: "5", pears: "7" },
      ];

      var parseTime = d3.time.format("%Y").parse;


      // Transpose the data into layers
      var dataset = d3.layout.stack()(["redDelicious", "mcintosh", "oranges", "pears"].map(function(fruit) {
        return data.map(function(d) {
          return {x: parseTime(d.year), y: +d[fruit]};
        });
      }));


      // Set x, y and colors
      var x = d3.scale.ordinal()
        .domain(dataset[0].map(function(d) { return d.x; }))
        .rangeRoundBands([10, width-10], 0.02);

      var y = d3.scale.linear()
        .domain([0, d3.max(dataset, function(d) {  return d3.max(d, function(d) { return d.y0 + d.y; });  })])
        .range([height, 0]);

      var colors = ["b33040", "#d25c4d", "#f2b447", "#d9d574"];


      // Define and draw axes
      var yAxis = d3.svg.axis()
        .scale(y)
        .orient("left")
        .ticks(5)
        .tickSize(-width, 0, 0)
        .tickFormat( function(d) { return d } );

      var xAxis = d3.svg.axis()
        .scale(x)
        .orient("bottom")
        .tickFormat(d3.time.format("%Y"));

      svg.append("g")
        .attr("class", "y axis")
        .call(yAxis);

      svg.append("g")
        .attr("class", "x axis")
        .attr("transform", "translate(0," + height + ")")
        .call(xAxis);

        console.log(dataset)
      // Create groups for each series, rects for each segment
      var groups = svg.selectAll("g.cost")
        .data(dataset)
        .enter().append("g")
        .attr("class", "cost")
        .style("fill", function(d, i) { return colors[i]; });

      var rect = groups.selectAll("rect")
        .data(function(d) { console.log(d) ;return d; })
        .enter()
        .append("rect")
        .attr("x", function(d) { return x(d.x); })
        .attr("y", function(d) { return y(d.y0 + d.y); })
        .attr("height", function(d) { return y(d.y0) - y(d.y0 + d.y); })
        .attr("width", x.rangeBand())
        .on("mouseover", function() { tooltip.style("display", null); })
        .on("mouseout", function() { tooltip.style("display", "none"); })
        .on("mousemove", function(d) {
          var xPosition = d3.mouse(this)[0] - 15;
          var yPosition = d3.mouse(this)[1] - 25;
          tooltip.attr("transform", "translate(" + xPosition + "," + yPosition + ")");
          tooltip.select("text").text(d.y);
        });


      // Draw legend
      var legend = svg.selectAll(".legend")
        .data(colors)
        .enter().append("g")
        .attr("class", "legend")
        .attr("transform", function(d, i) { return "translate(30," + i * 19 + ")"; });

      legend.append("rect")
        .attr("x", width - 18)
        .attr("width", 18)
        .attr("height", 18)
        .style("fill", function(d, i) {return colors.slice().reverse()[i];});

      legend.append("text")
        .attr("x", width + 5)
        .attr("y", 9)
        .attr("dy", ".35em")
        .style("text-anchor", "start")
        .text(function(d, i) {
          switch (i) {
            case 0: return "Anjou pears";
            case 1: return "Naval oranges";
            case 2: return "McIntosh apples";
            case 3: return "Red Delicious apples";
          }
        });

    // Prep the tooltip bits, initial display is hidden
    var tooltip = svg.append("g")
      .attr("class", "tooltip")
      .style("display", "none");

    tooltip.append("rect")
      .attr("width", 30)
      .attr("height", 20)
      .attr("fill", "white")
      .style("opacity", 0.5);

    tooltip.append("text")
      .attr("x", 15)
      .attr("dy", "1.2em")
      .style("text-anchor", "middle")
      .attr("font-size", "12px")
      .attr("font-weight", "bold");
}
