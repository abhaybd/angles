//TEST CODE FOR IAN TO REFERENCE
let changeColor = document.getElementById('changeColor');

chrome.storage.sync.get('color', function(data) {
  changeColor.style.backgroundColor = data.color;
  changeColor.setAttribute('value', data.color);
});

changeColor.onclick = function(element) {
    let color = element.target.value;
    chrome.tabs.query({active: true, currentWindow: true}, function(tabs) {
      chrome.tabs.executeScript(
          tabs[0].id,
          {code: 'document.body.style.backgroundColor = "' + color + '";'});
    });
  };


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