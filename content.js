function getKeywords() {
    let text = $("p").text().toString();
    text = text.replaceAll(/[-a-zA-Z0-9@:%._+~#=]{1,256}\.[a-zA-Z0-9()]{1,6}\b([-a-zA-Z0-9()@:%_+.~#?&\/=]*)?/gi, "");
    text = text.replaceAll(/[\[\]+\-@#^*_=]/gi, "");
    text = text.replaceAll(/([!.;:,?)])(\w)/gi, "$1 $2");
    console.log(text);
    // pass text to nlp for keyword extraction
    return []; // TODO: this should be result from call
}

function relevantNews(keywords, publisher, callback) {
    chrome.runtime.sendMessage({reqType: "news", keywords: keywords}, function(response) {
        callback(response.articles);
    });
}

function expandFloater(floater, publisher) {
    const keywords = getKeywords().slice(0, 5);
    relevantNews(keywords, publisher, function(articles) {
        floater.removeClass("collapsed").addClass("expanded");
        floater.empty();
        floater.append(`<div id='angles-curr-article'><div class='title'>${document.title}</div></div>`);
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