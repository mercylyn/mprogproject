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

function convertDataStackedChart(data) {
    var albumNames = [];
    var stackedChart = []

    for (var key in data) {

        // stackedChart.push(dataAlbums[key].title)
        if (!(albumNames.includes(data[key].title))) {
            albumNames.push(data[key].title)
            stackedChart.push([data[key]])
        }
        else {
            // console.log(albumNames.indexOf(dataAlbums[key].title), dataAlbums[key].title)
            albumPosition = albumNames.indexOf(data[key].title);
            // console.log(stackedChart[albumPosition]);
            stackedChart[albumPosition].push(data[key])
        }
    }

    return stackedChart;
};


function dataToJSON(dataset) {
    let dataPerAlbum = [];
    let dataPerYear = [];
    let years = [];
    let valuesArray = [];

    for (var key in dataset) {
        dataPerAlbum.push([dataset[key].date.getFullYear(), dataset[key].title, dataset[key].weeksChart]);
    }

    console.log(dataPerAlbum)

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
        console.log(dataPerYear)
    }

    // add last value
    dataPerYear.push({
        key: years.slice(-1)[0],
        values: valuesArray
    });
    // console.log(dataPerYear)
    return dataPerYear;
    // return dataPerAlbum;

};
