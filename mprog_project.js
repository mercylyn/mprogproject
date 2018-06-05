/**
 * Name: Mercylyn Wiemer (10749306)
 * Course: programmeerproject

 **/

window.onload = function() {

    const test = ""

    d3.queue()
        .defer(d3.request, test)
        awaitAll(parseData);

    function parseData(error, response) {
    if (error) throw error;

    console.log(respons)
    }
}
