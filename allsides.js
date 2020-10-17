const csv = require('./node_modules/jquery-csv/src/jquery.csv.js'); // C:\Users\zhouc\vscode-workspace\angles\node_modules\jquery-csv\src\jquery.csv.js
const $ = require("./angles/jquery-3.5.1.min.js"); // angles\jquery-3.5.1.min.js
var allsides_data;
$(document).ready(function () {
    $.ajax({
        type: "GET",
        url: "allsides_data.csv",
        dataType: "text",
        success: function(data) {processData(data);}
     });
});

function processData(data) {
    allsides_data = $.csv.toObjects(data);
    console.log(allsides_data[0]);
}

function isNews(url) {
    // if url contains any host url's from allsides
    return false;
}