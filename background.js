chrome.runtime.onInstalled.addListener(function() {
    console.log("Installed!");
});

function isNews(url) {
    // TODO: query allsides data
    return true;
}

chrome.runtime.onMessage.addListener(
    function(request, sender, sendResponse) {
        console.log("From tab: " + sender.tab.url);
        switch (request.reqType) {
            case "isNews":
                sendResponse({isNews: isNews(request.url)});
                break;

            case "news":
                break;
        }
    }
);