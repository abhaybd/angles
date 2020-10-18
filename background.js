chrome.runtime.onMessage.addListener(
    function(request, sender, sendResponse) {
        console.log("From tab: " + sender.tab.url);
        switch (request.reqType) {
            case "publisher":
                getPublisher(request.url).then(publisher => sendResponse({publisher: publisher}));
                return true;

            case "news":
                getRelevantNews(request.keywords, request.publisher).then(articles => sendResponse({articles: articles}));
                return true;

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

// @param keywords: list of keywords
// @param publisher: name of publisher of current article
async function getRelevantNews(keywords, publisher) {
    const bias = await getBias(publisher);
    const publishers = await oppositeBias(bias);
    
    // domains must be comma-separated list of domain names
    var domains = publishers[0].url;
    for (let i = 1; i < publishers.length; i++) {
        domains += "," + publishers[i].url.split('/')[0];
    }
    console.log("publishers " + publishers);
    
    var oppositeBiases = [];
    for (let i = 0; i < publishers.length; i++) {
        oppositeBiases.push(publishers[i].bias);
    }
    
    console.log("domains " + domains);
    
    var response = await queryNews(keywords, domains);

    var articles = response.articles;
    
    for (let i = 0; i < articles.length; i++) {
        var currentPublisher = articles[i].source.name;
        
        //find bias of currentPublisher and set that as current article's bias
        for (let j = 0; j < publishers.length; j++) {
            if (publishers[j].publisher === currentPublisher) {
                articles[i]["bias"] = oppositeBiases[j];
                break;
            }
        }
    }
    console.log(articles);
    return articles;
}

// deprecated
function getRelevantNdsgews(keywords, publisher) {
    // const bias = getBias(publisher);
    // const publishers = oppositeBias(bias);
    return new Promise(resolve => resolve(JSON.parse("{\n" +
        "\"status\": \"ok\",\n" +
        "\"totalResults\": 3253,\n" +
        "\"articles\": [\n" +
        "{\n" +
        "\"source\": {\n" +
        "\"id\": \"bbc-news\",\n" +
        "\"name\": \"BBC News\"\n" +
        "},\n" +
        "\"bias\": 1,\n" +
        "\"author\": \"https://www.facebook.com/bbcnews\",\n" +
        "\"title\": \"'One day everyone will use China's digital currency'\",\n" +
        "\"description\": \"China plans a digital version of its currency, which some say could become a big global payment system.\",\n" +
        "\"url\": \"https://www.bbc.co.uk/news/business-54261382\",\n" +
        "\"urlToImage\": \"https://ichef.bbci.co.uk/news/1024/branded_news/C414/production/_114569105_chandler.racks.jpg\",\n" +
        "\"publishedAt\": \"2020-09-24T23:16:08Z\",\n" +
        "\"content\": \"Image copyrightChandler GuoImage caption\\r\\n Chandler Guo at one of his cryptocurrency mines\\r\\nChandler Guo was a pioneer in cryptocurrency, the digital currencies that can be created and used independe… [+5995 chars]\"\n" +
        "},\n" +
        "{\n" +
        "\"source\": {\n" +
        "\"id\": \"engadget\",\n" +
        "\"name\": \"Engadget\"\n" +
        "},\n" +
        "\"bias\": 1,\n" +
        "\"author\": \"Mariella Moon\",\n" +
        "\"title\": \"'The Dark Overlord' hacking group member sentenced to five years in prison\",\n" +
        "\"description\": \"A US district judge has sentenced a UK National to five years in federal prison for participating in the cybercrime activities of hacking collective group “The Dark Overlord.” Nathan Wyatt was extradited from the UK to the US in December 2019 for targeting co…\",\n" +
        "\"url\": \"https://www.engadget.com/the-dark-overlord-member-sentenced-063851213.html\",\n" +
        "\"urlToImage\": \"https://o.aolcdn.com/images/dims?resize=1200%2C630&crop=1200%2C630%2C0%2C0&quality=95&image_uri=https%3A%2F%2Fs.yimg.com%2Fos%2Fcreatr-images%2F2019-06%2Fea58ee80-863b-11e9-b5ff-71b01764a4c6&client=amp-blogside-v2&signature=94170af4e99228d984f5e1d77a0d3d5945454d30\",\n" +
        "\"publishedAt\": \"2020-09-22T06:38:51Z\",\n" +
        "\"content\": \"A US district judge has sentenced a UK National to five years in federal prison for participating in the cybercrime activities of hacking collective group “The Dark Overlord.” Nathan Wyatt was extrad… [+961 chars]\"\n" +
        "}]}")));
}