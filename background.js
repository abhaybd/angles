chrome.runtime.onInstalled.addListener(function() {
const url = "http://newsapi.org/v2/everything?bitcoin&domains=cnn.com&sortBy=relevancy&apiKey=4f010001c9f14c2eb9288c298c164b07";
$.get(url, function(data){
    console.log("jquery");
    console.log(data);
});


    chrome.declarativeContent.onPageChanged.removeRules(undefined, function() {
        chrome.declarativeContent.onPageChanged.addRules([{
          conditions: [new chrome.declarativeContent.PageStateMatcher({
            pageUrl: {schemes:['https']},
          })
          ],
              actions: [new chrome.declarativeContent.ShowPageAction()]
        }]);
      });
});


function getRelevantNews(keywords, publisher) {
    const bias = getBias(publisher);
    const publishers = oppositeBias(bias);
    // TODO: invoke news api with publishers and keywords
    return null;
}

chrome.runtime.onMessage.addListener(
    function(request, sender, sendResponse) {
        console.log("From tab: " + sender.tab.url);
        switch (request.reqType) {
            case "isNews":
                sendResponse({publisher: getPublisher(request.url)});
                break;

            case "news":
                const news = getRelevantNews(request.keywords, request.publisher);
                sendResponse({articles: news});
                break;
        }
    }
);
