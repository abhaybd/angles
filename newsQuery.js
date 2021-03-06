const apiKey = "edb5995c5150404fbc55e6530b36cddc";

// @param keywords: list of keywords
// @param domains: A comma-seperated string of domains (eg bbc.co.uk, techcrunch.com, engadget.com) to restrict the search to.
async function queryNews(keywords, domains) {
    const sortBy = "popularity"; // other possible values: "popularity", "publishedAt"
    const language = "en"; // searching for only English articles
    const from = getMonthAgo(); // default start date of articles
    const pageSize = 100;
    
    var keywordsQuery = keywords[0];
    for (let i = 1; i < keywords.length; i++) {
        keywordsQuery += " AND " + keywords[i];
    }
    
    console.log("apiKey " + apiKey);
    
    console.log("keyWordsQuery " + keywordsQuery);
    keywordsQuery = encodeURIComponent(keywordsQuery);
    console.log("keyWordsQuery " + keywordsQuery);
    
    var url = "http://newsapi.org/v2/everything?q=" + keywordsQuery + 
              "&domains=" + domains +
              "&from=" + from +
              "&language=" + language +
              "&sortBy=" + sortBy +
              "&pageSize=" + pageSize +
              "&apiKey=" + apiKey;
    console.log("url " + url);
    
    var request = new Request(url);
    var response = await fetch(request);
    return response.json();
}

// Returns a timestamp in format yyyy-mm-dd of the day exactly one month ago
function getMonthAgo() {
    var today = new Date();
    var year = today.getFullYear();
    var month = today.getMonth()+1;
    var day = today.getDate();
    
    console.log("year " + year);
    console.log("month " + month);
    console.log("day " + day);
    
    if (month == 1) {
        month = 12;
        year--;
    } else {
        month--;
    }
    
    if (day == 31) {
        if (month==2) {
            day = 28;
        } else if ((month <= 7 && month%2 == 0) || (month>=8 && month%2==1)) {
            day = 30;
        }
    }  
    
    var mzeros = "";
    if (month < 10) {
        mzeros = "0";
    }
    
    var dzeros = "";
    if (day < 10) {
        dzeros = "0";
    }
    
    return year + "-" + mzeros + month + "-" + dzeros + day;
}

// Return a timestamp in format yyyy-mm-dd of the day exactly two weeks ago
function getTwoWeeksAgo() {
    var today = new Date();
    var year = today.getYear();
    var month = today.getMonth() + 1;
    var day = today.getDate();
    
    if (day <= 14) {
        day = 1 + mod(day - 15, 30);
        if (month == 1) {
            month = 12;
            year--;
        } else {
            month--;
        }
    } else {
        day -= 14;
    }
    
    var mzeros = "";
    if (month < 10) {
        mzeros = "0";
    }
    
    var dzeros = "";
    if (day < 10) {
        dzeros = "0";
    }
    
    var timestamp = year + "-" + mzeros + month + "-" + dzeros + day;
    console.log('timestamp ' + timestamp);
    return timestamp;
}

function mod(num, x) {
    return (num + x) % x;
}