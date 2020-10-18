function relevantNews(keywords, publisher, callback) {
    chrome.runtime.sendMessage({reqType: "news", keywords: keywords, publisher: publisher}, function(response) {
        callback(response);
    });
}

function setFloaterClickEnabled(floater, publisher, enabled) {
    if (enabled === true) {
        floater.on("click", () => expandFloater(floater, publisher));
    } else {
        floater.off("click");
    }
}

function collapseFloater(floater, publisher) {
    floater.empty();
    floater.removeClass("expanded").addClass("collapsed");
    floater.append("<div>Angles</div>");
    setTimeout(() => setFloaterClickEnabled(floater, publisher, true), 1000);
}

function expandFloater(floater, publisher) {
    floater.removeClass("collapsed").addClass("expanded");
    floater.empty();
    const imgUrl = chrome.extension.getURL("images/collapse.png");
    const hoverImgUrl = chrome.extension.getURL("images/collapse1.png");
    const backButton = $(`<img id='collapse-button' src='${imgUrl}' alt="collapse"/>`);
    backButton.on("mouseenter", () => $('#collapse-button').attr('src', hoverImgUrl));
    backButton.on("mouseleave", () => $('#collapse-button').attr('src', imgUrl));
    backButton.on("click", () => collapseFloater(floater, publisher));
    setFloaterClickEnabled(floater, publisher, false);
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
    setFloaterClickEnabled(floater, publisher, true);
    $("body").append(floater);
    console.log(floater);
}

function execIfNews(url, callback) {
    chrome.runtime.sendMessage({reqType: "publisher", url: url}, function(response) {
        console.log("publisher: " + response.publisher);
        if (response.publisher) {
            callback(response.publisher);
        }
    });
}

$(function() {
    console.log("Page loaded!");

    execIfNews(window.location.href, function(publisher) {
        $("head").prepend("<link rel='stylesheet' href='https://fonts.googleapis.com/css?family=Bitter'>")
        enableFloater(publisher);
    });
});