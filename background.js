chrome.runtime.onInstalled.addListener(function() {
    console.log("Installed!");
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