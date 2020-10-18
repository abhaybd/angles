const blacklist = new Set(["some", "things", "and", "the", "data", "for", "cookies", "browser", "way", "matters",
    "privacy", "ads", "privacy preferences", "cnn", "cnnupdated"]);


function getKeywords() {
    let text = $("p").text().toString();
    text = text.replaceAll(/[-a-zA-Z0-9@:%._+~#=]{1,256}\.[a-zA-Z0-9()]{1,6}\b([-a-zA-Z0-9()@:%_+.~#?&\/=]*)?/gi, "");
    text = text.replaceAll(/[\[\]+\-@#^*_=]/gi, "");
    text = text.replaceAll(/([!.;:,?)])(\w)/gi, "$1 $2");
    const nlpUrl = "https://us-west3-angles-dh2020.cloudfunctions.net/getRelevantEntities";
    return new Promise((resolve => {
        $.ajax({
            type: "POST",
            url: nlpUrl,
            data: JSON.stringify({message: text}),
            contentType: "application/json",
            dataType: "json",
            success: function(data) {
                const keywords = [];
                for (let i = 0; i < data.keywords.length && keywords.length < 5; i++) {
                    let word = data.keywords[i];
                    if (!blacklist.has(word.toLowerCase())) {
                        keywords.push(word);
                    }
                }
                console.log(keywords);
                resolve(keywords);
            }
        });
    }));
}

function populateFloater(floater, publisher) {
    getKeywords().then(keywords => {
        relevantNews(keywords, publisher, response => {
            floater.find(".current-article").text(document.title);
            const articles = response.slice(0, 5);
            const articlesRoot = $(".contrasting-article").first();
            for (let articleObj of articles) {
                const article = $("<div class='article'></div>");
                article.append(`<a class='article-header' href='${articleObj.url}'>${articleObj.title}</a>`);
                article.append(`<div class='bias-bar'><div class=bias${articleObj.bias}></div></div>`);
                articlesRoot.append(article);
            }
        });
    })
}

var slider = document.getElementById("myRange");

function setSlider() {
    document.getElementById("myRange").value = "75";
  }
setSlider();