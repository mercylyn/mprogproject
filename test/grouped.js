const margin = {top: 20, right: 30, bottom: 30, left: 40},
    width = 1280 - margin.left - margin.right,
    height = 500 - margin.top - margin.bottom;

let barPadding = 10;

// set ranges and domain
let x_category = d3.scale.linear()
    .range([0, width]),

    x_defect = d3.scale.ordinal()
    .domain(rangeBands)
    .rangeBands([0, width], .2),

    x_category_domain = x_defect.rangeBand() * rangeBands.length;

x_category.domain([0, x_category_domain]);


let y = d3.scale.linear()
  .range([height, 0]);

y.domain([0, d3.max(data, function(cat) {
    return d3.max(cat.values, function(def) {
        return def.value;
        });
    }) * 2
]);

// Define Y axis
var yAxis = d3.svg.axis()
    .scale(y)
    .orient("left")
    .ticks(14);

// Setup the tool tip
var tip = d3.tip()
    .attr('class', 'd3-tip')
    .offset([-10, 0])
    .html(function(d) {
      return "<strong>Album:</strong> <span style='color:red'>" + d.key +
                "</span> <br> <strong>Weeks in chart:</strong> \
                <span style='color:red'>" + d.value + "</span>";
});

// create SVG element
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

// grouped bar: years
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
----------
// // adding inner groups g elements: albums or singles
// var defect_g = category_g.selectAll(".defect")
//     .data(function(d) {
//         return d.values;
//     })
//     .enter().append("g")
//     .attr("class", function(d) {
//         return 'defect defect-' + d.key;
//     })
//     .attr("transform", function(d, i) {
//         return "translate(" + x_category((i * x_defect.rangeBand())) + ",0)";
//     });

// var rects = defect_g.selectAll('.rect')
//     .data(function(d) {
//         return [d];
//     })
//     .enter().append("rect")
//     .attr("class", "rect")
//     .attr("width", x_category(x_defect.rangeBand() - barPadding))
//     .attr("x", function(d) {
//         return x_category(barPadding);
//     })
//     .attr("y", function(d) {
//         return y(d.value);
//     })
//     .attr("height", function(d) {
//         return height - y(d.value);
//     })
//     .on('mouseover', tip.show)
//     .on('mouseout', tip.hide);


// add labels to g elements: album/single name
// var defect_label = defect_g.selectAll(".defect-label")
//     .data(function(d) {
//       return [d];
//     })
//     .enter().append("text")
//     .attr("class", function(d) {
//         return 'defect-label defect-label-' + d.key;
//     })
//     .text(function(d) {
//         return d.key;
//     })
//     .attr("transform", function(d) {
//         var x_label =  x_category(x_defect.rangeBand() - barPadding);
//         var y_label =  y(d.value) - barPadding / 2;
//         return "translate(" + x_label + "," + y_label + ") rotate(270)";
//
//     })
//     .style('fill', 'black')
//     .attr("font-size", "12px");
