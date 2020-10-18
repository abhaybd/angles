chrome.runtime.onInstalled.addListener(async function() {
    console.log('check');
    var keywords = ["president", "election"];
    var domains = "cnn.com,foxnews.com";
    var queryResults = await queryNews(keywords, domains);
    console.log("queryResults " + queryResults);
});

chrome.runtime.onMessage.addListener(
    async function(request, sender, sendResponse) {
        console.log("From tab: " + sender.tab.url);
        switch (request.reqType) {
            case "publisher":
                sendResponse({publisher: getPublisher(request.url)});
                break;

            case "news":
                const news = await getRelevantNews(request.keywords, request.publisher);
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

async function getRelevantNews(keywords, publisher) {
    //console.log('getrelevantnews()');
    const bias = getBias(publisher);
    const publishers = oppositeBias(bias);
    console.log("publishers " + publishers);
    
    var domains = publishers[0][1];
    for (let i = 1; i < domains.length; i++) {
        domains += "," + publishers[i][1];
    }
    console.log("domains " + domains);
    
    var response = await queryNews(keywords, domains);
    return response;
}