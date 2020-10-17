var allsidesData;
$.get("https://github.com/favstats/AllSideR/raw/master/data/allsides_data.csv", function(data) {
    allsidesData = processData(data);
    console.log(allsidesData);
});

var allsidesData2;
$.get("https://www.allsides.com/download/allsides_data.json", function(data) {
    //
});

function processData(allText) {
    var allTextLines = allText.split(/\r\n|\n/);
    var headers = allTextLines[0].split(',');
    var lines = [];

    for (var i=1; i<allTextLines.length; i++) {
        var data = allTextLines[i].split(',');
        if (data.length == headers.length) {
            var tarr = [];
            for (var j=0; j<headers.length; j++) {
                tarr.push(headers[j]+":"+data[j]);
            }
            lines.push(tarr);
        }
    }

    return lines;
}

// Returns true if in AllSides data
function isNews(url) {
    // if url contains any host url's from allsides, return true
    return false;
}

// Returns bias of news 1-5
function getBias(url) {
    return 1;
}

// Returns list of news sources with opposite bias, each with name, url, bias
function oppositeBias(bias) {
    return [["name", "url", 1 /*bias*/]];
}