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
            case "publisher":
                sendResponse({publisher: getPublisher(request.url)});
                break;

            case "news":
                const news = getRelevantNews(request.keywords, request.publisher);
                sendResponse({articles: news});
                break;

            case "loadFloaterHtml":
                let url = chrome.extension.getURL("popup.html");
                console.log("floater: " + url);
                $.ajax({
                    url: url,
                    dataType: "html",
                    success: function(data) {
                        console.log("data " + data);
                        sendResponse(data);
                    }
                });
                return true; // signals to chrome to keep sendResponse alive
        }
    }
);
