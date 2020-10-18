var allsidesData;
$.get("https://github.com/favstats/AllSideR/raw/master/data/allsides_data.csv", function(data) {
    allsidesData = processData(data);
    // console.log(allsidesData);
});

var allsidesData2;
$.get("https://www.allsides.com/download/allsides_data.json", function(data) {
    allsidesData2 = data;
    // console.log(allsidesData2);
});

function processData(allText) {
    var allTextLines = allText.split(/\r\n|\n/);
    var headers = allTextLines[0].split(',');
    var lines = [];

    for (var i=1; i<allTextLines.length; i++) {
        var data = allTextLines[i].split(',');
        if (data.length == headers.length && data[2] != "NA") { // Skip if rating = NA
            var tarr = {};
            for (var j=0; j<headers.length; j++) {
                tarr[headers[j]] = data[j];
            }
            lines.push(tarr);
        }
    }

    return lines;
}

// Returns publisher name if in AllSides data, null otherwise
async function getPublisher(URL) {
    // if URL contains any host url's from allsides, return publisher name
    while(!allsidesData2 || !allsidesData)
        await new Promise(resolve => setTimeout(resolve, 250));
    
    let filter1 = allsidesData2.filter(news => news["url"].length > 0 && URL.includes(news["url"].split("//")[1]));
    // check if allsidesdata contains object with same news_source
    let filter2 = [];
    if (filter1.length > 0) {
        filter2 = allsidesData.filter(news => news["news_source"] == filter1[0]["news_source"]);
    }
    // console.log("finished", filter2[0]["news_source"]);
    if (filter2.length == 0) {
        return null;
    }
    return filter2[0]["news_source"];
}

function samePublisher(p1, p2) {
    console.log(p1, p2);
    p1 = new Set(p1.split("\\P{Alpha}+"));
    p2 = new Set(p2.split("\\P{Alpha}+"));
    console.log(p1, p2);
    let smaller = p1;
    let larger = p2;
    if (p1.size > p2.size) {
        smaller = p2;
        larger = p1;
    }
    for (var s of smaller) if (!larger.has(s)) return false;
    return true;
}

// Returns bias of news 1-5
async function getBias(name) {
    while(!allsidesData)
        await new Promise(resolve => setTimeout(resolve, 250));

    let filter = allsidesData.filter(news => news["news_source"] == name);
    // console.log("bias ", filter[0]["rating_num"]);
    return parseInt(filter[0]["rating_num"]);
}

// Returns list of news sources with opposite bias, each with publisher name, url, bias
async function oppositeBias(bias) {
    while(!allsidesData)
        await new Promise(resolve => setTimeout(resolve, 250));
    let filter = allsidesData.filter(news => (bias < 3 && (parseInt(news["rating_num"]) == 3 || parseInt(news["rating_num"]) == 4))
    || (bias > 3 && (parseInt(news["rating_num"]) == 3 || parseInt(news["rating_num"]) == 2))
    || (bias == 3 && (parseInt(news["rating_num"]) >= 2 && parseInt(news["rating_num"]) <= 4))
    );
    let sampleSize = Math.min(5, filter.length);
    // console.log(getRandom(filter, sampleSize));
    return getRandom(filter, sampleSize);
}

// Returns random subarray of length n
function getRandom(arr, n) {
    var result = new Array(n),
        len = arr.length,
        taken = new Array(len);
    if (n > len)
        throw new RangeError("getRandom: more elements taken than available");
    while (n--) {
        var x = Math.floor(Math.random() * len);
        result[n] = arr[x in taken ? taken[x] : x];
        taken[x] = --len in taken ? taken[len] : len;
    }
    return result;
}

getPublisher("https://www.cnn.com/hahahahaha").then(function(publisher) {
    console.log("getPublisher ", publisher);
    getBias(publisher).then(function(bias) {
        console.log("getBias ", bias);
        oppositeBias(bias).then(function(arr){
            console.log("oppositeBias ", arr);
        });
    });
});

// console.log("Here is an ex@mple".split('/[^a-zA-Z]/'));
// console.log(samePublisher("New York Times - News", "New York Times (Online News)"));
