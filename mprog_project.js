/**
 * Name: Mercylyn Wiemer (10749306)
 * Course: programmeerproject

 **/

// window.onload = function() {
//
//     const test = ""
//
//     d3.queue()
//         .defer(d3.request, test)
//         awaitAll(parseData);
//
//     function parseData(error, response) {
//     if (error) throw error;
//
//     console.log(respons)
//     }
// }

// d3.csv("beatles_chart_albums.csv", function(error, data) {
//     if (error) throw error;
//
//     console.log(data);
// })

var albums_csv = function() {
    var parse = d3.time.format("%m/%d/%Y").parse;
    d3.csv("beatles_chart_albums.csv", function(album_chart) {

        console.log(album_chart)
        data = album_chart.map(function(d) {
            console.log("d", d)
            // date = parse(d.date);
            // highestPosition = +d.highestPosition;
            // weeksChart = +d.weeksChart;
            // award = d.award;
            // title = d.title;
            // labelCatNo = d.labelCatNo;
            // weeksNo1 = +d.weeksNo1;
            // usNo1 = d.usNo1;
            return {"date" : parse(d.date), "highestPosition" : +d.highestPosition,
                    "weeksChart" : +d.weeksChart, "award" : d.award, "title" : d.title,
                    "labelCatNo" : d.labelCatNo, "weeksNo1" : +d.weeksNo1, "usNo1" : +d.usNo1};
        })

        console.log("data", data)
    })
}

albums_csv()
