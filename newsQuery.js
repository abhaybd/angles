// News API Queries

const proxy = "https://cors-anywhere.herokuapp.com/";
const apiKey = "4f010001c9f14c2eb9288c298c164b07"

// @param keywords: list of keywords
// @param domains: A comma-seperated string of domains (eg bbc.co.uk, techcrunch.com, engadget.com) to restrict the search to.
// @param from: timestamp (yyyy-mm-dd)
// @param sortBy: one of "relevancy", "popularity", "publishedAt"
function queryNews(keywords, domains, from, sortBy) {
    const language = "en"; // searching for only English articles
    var response;
    
    var keywordsQuery = "q=" + keywords[0];
    for (let i = 1; i < keywords.length; i++) {
        keywordsQuery += " OR " + keywords[i];
    }
    
    var url = "http://newsapi.org/v2/everything?" +
              keywordsQuery + "&" +
              "domains=" + domains + "&" +
              "from=" + from + "&" +
              "language=" + language + "&" +
              "sortBy=" + sortBy + "&" +
              "apiKey=" + apiKey;
    
    var request = new Request(proxy + url);

    fetch(request)
        .then(response => response.json())
        .then(function(data) {
            response = data;
    });
    
    return response;
}