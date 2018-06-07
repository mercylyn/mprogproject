d3.csv("beatles_chart_albums.csv", function(d) {
    return {
        date : new date(d.date),
        highestPosition : +d.highestPosition,
        weeksChart : +d.weeksChart,
        award : d.award,
        title : d.title,
        labelCatNo : d.labelCatNo,
        weeksNo1 : +d.weeksNo1,
        usNo1 : d.usNo1
    };
}, function(data) {
    console.log(data);
});

data = album_chart.map(function(d) {
    console.log("d", d)
    date = parse(d.date);
    highestPosition = +d.highestPosition;
    weeksChart = +d.weeksChart;
    award = d.award;
    title = d.title;
    labelCatNo = d.labelCatNo;
    weeksNo1 = +d.weeksNo1;
    usNo1 = d.usNo1;
    return {"date" : date, "highestPosition" : highestPosition,
            "weeksChart" : weeksChart, "award" : award, "title" : title,
            "labelCatNo" : labelCatNo, "weeksNo1" : weeksNo1, "usNo1" : usNo1};
})

// d3.csv("beatles_chart_albums.csv", function(error, data) {
//     if (error) throw error;
//
//     console.log(data);
// })

// var dataAlbums, dataSingles;
//
// var chartCsv = function() {
//     var parse = d3.time.format("%m/%d/%Y").parse;
//     d3.csv("beatles_chart_albums.csv", function(albumsChart) {
//
//         dataAlbums = albumsChart.map(function(d) {
//             return {"date" : parse(d.date), "highestPosition" : +d.highestPosition,
//                     "weeksChart" : +d.weeksChart, "award" : d.award, "title" : d.title,
//                     "labelCatNo" : d.labelCatNo, "weeksNo1" : +d.weeksNo1, "usNo1" : +d.usNo1};
//         })
//
//         // console.log("data", dataAlbums)
//     })
//
//     d3.csv("beatles_chart_singles.csv", function(singlesChart) {
//
//         dataSingles = singlesChart.map(function(d) {
//             return {"date" : parse(d.date), "highestPosition" : +d.highestPosition,
//                     "weeksChart" : +d.weeksChart, "title" : d.title,
//                     "artists" : d.artists, "weeksNo1" : +d.weeksNo1, "usNo1" : +d.usNo1};
//         })
//
//         // console.log("data", dataSingles)
//     })
//
//     console.log(dataSingles)
//     dataChart = {"Albums" : dataAlbums, "Singles" : dataSingles}
//
// }
//
// chartCsv()
//
// console.log(dataChart)
