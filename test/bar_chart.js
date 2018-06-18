function makeBarChart(data) {
    // http://bl.ocks.org/mstanaland/6100713
    // Set dimensions of canvas
    // const margin = {top: 100, bottom: 50, right:30, left: 60},
    //     width = 470 - margin.left - margin.right,
    //     height = 470 - margin.top - margin.bottom,
    //     barHeight = 20,
    //     originChart = 0;
    console.log(data);
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
        .html(function(d) {
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
