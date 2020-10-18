async function getKeywords() {
    let text = $("p").text().toString();
    text = text.replaceAll(/[-a-zA-Z0-9@:%._+~#=]{1,256}\.[a-zA-Z0-9()]{1,6}\b([-a-zA-Z0-9()@:%_+.~#?&\/=]*)?/gi, "");
    text = text.replaceAll(/[\[\]+\-@#^*_=]/gi, "");
    text = text.replaceAll(/([!.;:,?)])(\w)/gi, "$1 $2");
    // pass text to nlp for keyword extraction
    const nlpUrl = "https://us-west3-angles-dh2020.cloudfunctions.net/getRelevantEntities";
    let keywords = [];
    await $.ajax({
        type: "POST",
        url: nlpUrl,
        data: JSON.stringify({message: text}),
        contentType: "application/json",
        dataType: "json",
        success: function(data) {
            keywords = JSON.parse(data).keywords;
        }
    });
    return keywords;
}

function relevantNews(keywords, publisher, callback) {
    chrome.runtime.sendMessage({reqType: "news", keywords: keywords}, function(response) {
        callback(response.articles);
    });
}

function expandFloater(floater, publisher) {
    const keywords = getKeywords().slice(0, 5);
    relevantNews(keywords, publisher, articles => {
        floater.removeClass("collapsed").addClass("expanded");
        floater.empty();
        chrome.runtime.sendMessage({reqType: "loadFloaterHtml"}, function(response) {
            let html = response.replaceAll(/[\s\S]+<body>/gi, "").replaceAll(/<\/body>[\s\S]+/gi, "");
            console.log(html);
            floater.html(html);
        });
        // TODO: display this news
    }); // assume format {url: "", title: "", publisher: ""}
}

function enableFloater(publisher) {
    const floater = $("<div id='angles-floater' class='collapsed'><div>Angles</div></div>");
    floater.on("click", function() {
        expandFloater(floater);
    });
    $("body").append(floater);
    console.log(floater);
}

function execIfNews(url, callback) {
    chrome.runtime.sendMessage({reqType: "publisher", url: url}, function(response) {
        if (response.publisher) {
            callback(response.publisher);
        }
    });
}

$(function() {
    console.log("Page loaded!");

    execIfNews(window.location.href, function(publisher) {
        enableFloater(publisher);
    });
});