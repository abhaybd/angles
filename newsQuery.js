const apiKey = "edb5995c5150404fbc55e6530b36cddc";

// @param keywords: list of keywords
// @param domains: A comma-seperated string of domains (eg bbc.co.uk, techcrunch.com, engadget.com) to restrict the search to.
async function queryNews(keywords, domains) {
    const sortBy = "popularity"; // other possible values: "popularity", "publishedAt"
    const language = "en"; // searching for only English articles
    const from = getMonthAgo(); // default start date of articles
    
    var keywordsQuery = "q=" + keywords[0];
    for (let i = 1; i < keywords.length; i++) {
        keywordsQuery += " AND " + keywords[i];
    }
    
    console.log("apiKey " + apiKey);
    
    console.log("keyWordsQuery " + keywordsQuery);
    keywordsQuery = encodeURIComponent(keywordsQuery);
    console.log("keyWordsQuery " + keywordsQuery);
    
    var url = "http://newsapi.org/v2/everything?" + keywordsQuery + 
              "&domains=" + domains +
              "&from=" + from +
              "&language=" + language +
              "&sortBy=" + sortBy +
              "&apiKey=" + apiKey;
    console.log("url " + url);
    
    var request = new Request(url);
    var response = await fetch(request);
    return response.json();
}

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