let allsidesData;
$.get("https://github.com/favstats/AllSideR/raw/master/data/allsides_data.csv", function(data) {
    allsidesData = processData(data);
    // console.log(allsidesData);
});

let allsidesData2;
$.get("https://www.allsides.com/download/allsides_data.json", function(data) {
    allsidesData2 = data.filter(news => news["url"].length > 0);
    console.log(allsidesData2);
});

function processData(allText) {
    let allTextLines = allText.split(/\r\n|\n/);
    let headers = allTextLines[0].split(',');
    let lines = [];

    for (let i=1; i<allTextLines.length; i++) {
        let data = allTextLines[i].split(',');
        if (data.length === headers.length && data[2] !== "NA") { // Skip if rating = NA
            let tarr = {};
            for (let j=0; j<headers.length; j++) {
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
    
    let filter1 = allsidesData2.filter(news => URL.includes(splitUrl(news["url"])));
    // check if allsidesData contains object with same news_source
    let filter2 = [];
    if (filter1.length > 0) {
        // console.log(filter1);
        filter2 = allsidesData.filter(news => samePublisher(news["news_source"], filter1[0]["news_source"]));
    }
    // console.log("finished", filter2[0]["news_source"]);
    if (filter2.length === 0) {
        return null;
    }
    return filter2[0]["news_source"];
}

function splitUrl(URL) {
    let splitURL = URL.split(/(\/\/)(www.)*/);
    return splitURL[splitURL.length - 1];
}

// Returns if 2 publishers are the same
function samePublisher(p1, p2) {
    // console.log(p1, p2);
    let smaller = new Set(p1.split(/[^a-zA-Z0-9]/));
    let larger = new Set(p2.split(/[^a-zA-Z0-9]/));
    // console.log(smaller, larger);
    if (p1.size > p2.size) {
        smaller = p2;
        larger = p1;
    }
    for (let s of smaller) {
        if (s.length < 0) {
            continue;
        }
        if (!larger.has(s)) return false;
    }
    return true;
}

// Returns bias of news 1-5
async function getBias(name) {
    while(!allsidesData)
        await new Promise(resolve => setTimeout(resolve, 250));

    let filter = allsidesData.filter(news => news["news_source"] === name);
    // console.log("bias ", filter[0]["rating_num"]);
    return parseInt(filter[0]["rating_num"]);
}

// Returns list of news sources with opposite bias, each with publisher name, url, bias
async function oppositeBias(bias) {
    while(!allsidesData)
        await new Promise(resolve => setTimeout(resolve, 250));
    let filter = allsidesData.filter(news => {
        let rating = parseInt(news["rating_num"]);
        return inAllsidesData2(news["news_source"]) && ((bias < 3 && (rating === 3 || rating === 4))
                || (bias > 3 && (rating === 3 || rating === 2))
                || (bias === 3 && (rating >= 2 && rating <= 4)));
        }
    );
    let sampleSize = Math.min(5, filter.length);
    // console.log(getRandom(filter, sampleSize));
    return getRandom(filter, sampleSize);
}

function inAllsidesData2(publisher) {
    return allsidesData2.filter(news => samePublisher(news["news_source"], publisher)).length > 0;
}

// Returns random subarray of length n
function getRandom(arr, n) {
    let result = new Array(n),
        len = arr.length,
        taken = new Array(len);
    if (n > len)
        throw new RangeError("getRandom: more elements taken than available");
    while (n--) {
        let x = Math.floor(Math.random() * len);
        result[n] = arr[x in taken ? taken[x] : x];
        taken[x] = --len in taken ? taken[len] : len;
    }
    let output = [];
    for (let r of result) {
        let news = {
            publisher: r["news_source"],
            bias: r["rating_num"],
        };
        // Get url
        let filter = allsidesData2.filter(news => samePublisher(news["news_source"], r["news_source"]));
        news.url = splitUrl(filter[0]["url"]);
        output.push(news);
    }
    return output;
}

getPublisher("https://www.cnn.com/2020/10/18/world/mink-fur-farms-coronavirus-scli-intl/index.html").then(function(publisher) {
    console.log("getPublisher ", publisher);
    getBias(publisher).then(function(bias) {
        console.log("getBias ", bias);
        oppositeBias(bias).then(function(arr){
            console.log("oppositeBias ", arr);
        });
    });
});