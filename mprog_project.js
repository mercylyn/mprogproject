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

        var dataChart = {"Albums" : dataAlbums, "Singles" : dataSingles};

        console.log("data chart", dataChart);

        makeBarChart(dataChart);
    };
};

function makeBarChart(data) {
    // http://bl.ocks.org/mstanaland/6100713
    // Set dimensions of canvas
    const margin = {top: 100, bottom: 50, right:30, left: 60},
        width = 470 - margin.left - margin.right,
        height = 470 - margin.top - margin.bottom,
        barHeight = 20,
        originChart = 0;

}
