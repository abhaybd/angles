const apiKey = "edb5995c5150404fbc55e6530b36cddc";

// @param keywords: list of keywords
// @param domains: A comma-seperated string of domains (eg bbc.co.uk, techcrunch.com, engadget.com) to restrict the search to.
async function queryNews(keywords, domains) {
    const sortBy = "relevancy"; // other possible values: "popularity", "publishedAt"
    const language = "en"; // searching for only English articles
    const from = "2020-09-016"; // default start date of articles
    
    var response;
    
    var keywordsQuery = "q=" + keywords[0];
    for (let i = 1; i < keywords.length; i++) {
        keywordsQuery += "OR" + keywords[i];
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