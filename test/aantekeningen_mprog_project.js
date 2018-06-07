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
