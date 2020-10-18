const blacklist = new Set(["some", "things", "and", "the", "data", "for", "cookies", "browser", "way", "matters",
    "privacy", "ads", "privacy preferences", "cnn", "cnnupdated"]);

async function scrapeText() {
    const url = window.location.href;
    return new Promise(resolve => {
        $.get("https://extractorapi.com/api/v1/extractor/?apikey=99a0ee9cecec0f90e16e20fe3e4cdfac17814ff2&url=" + url, function(data) {
            resolve(data.text);
        });
    })
}

async function getKeywords() {
    let text = await scrapeText();
    console.log(text);
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
                for (let i = 0; i < data.keywords.length && keywords.length < 2; i++) {
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
            const valueMapper = x => (x-1) * 25;
            document.getElementById("source-slider").value = valueMapper(response.currBias);
            const articles = response.articles.slice(0, 5);
            const articlesRoot = $(".contrasting-article").first();
            for (let articleObj of articles) {
                const article = $("<div class='article'></div>");
                article.append(`<a class='article-header' href='${articleObj.url}'>${articleObj.title}</a>`);
                const slider = $(`<div class = 'slidercontainer'><input type='range' min='1' max='100' value='${valueMapper(articleObj.bias)}' class='slider' disabled></div>`);
                article.append(slider);
                articlesRoot.append(article);
            }
        });
    })
}