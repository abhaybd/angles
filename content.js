function isNews(origin) {
    // TODO: determine if origin is a news site
    return true;
}

function enableExtension() {

}

function enableFloater() {
    const floater = $("<div id='angles-floater' class='collapsed'><div>Angles</div></div>");
    $("body").append(floater);
    console.log(floater);
}

$(function() {
    console.log("Page loaded!");
    if (isNews(window.origin)) {
        enableExtension();
        enableFloater();
    }
});