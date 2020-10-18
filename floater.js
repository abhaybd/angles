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
                resolve(data.keywords.slice(0, 5));
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
                const imageDiv = $("<div class='article-image'></div>");
                $.get("https://cors-anywhere.herokuapp.com/" + articleObj.url, function(data) {
                    imageDiv.append($(data).find("img").first());
                });
                article.append(imageDiv);
                article.append(`<div class='article-header'>${articleObj.title}</div>`);
                article.append(`<div class='bias-bar'><div class=bias${articleObj.bias}></div></div>`);
                articlesRoot.append(article);
            }
        });
    })
}
