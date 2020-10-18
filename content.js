function relevantNews(keywords, publisher, callback) {
    chrome.runtime.sendMessage({reqType: "news", keywords: keywords}, function(response) {
        callback(response.articles);
    });
}

function collapseFloater(floater) {
    floater.empty();
    floater.removeClass("expanded").addClass("collapsed");
    floater.append("<div>Angles</div>");
}

function expandFloater(floater, publisher) {
    floater.removeClass("collapsed").addClass("expanded");
    floater.empty();
    const backButton = $("<div id='collapse-button'>></div>");
    backButton.on("click", () => collapseFloater(floater));
    floater.off("click");
    floater.prepend(backButton);
    chrome.runtime.sendMessage({reqType: "loadFloaterHtml"}, function(response) {
        let html = response.replaceAll(/[\s\S]+<body>/gi, "").replaceAll(/<\/body>[\s\S]+/gi, "");
        console.log(html);
        floater.append(html);
        populateFloater(floater, publisher);
    });
}

function enableFloater(publisher) {
    const floater = $("<div id='angles-floater' class='collapsed'><div>Angles</div></div>");
    floater.on("click", function() {
        expandFloater(floater, publisher);
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