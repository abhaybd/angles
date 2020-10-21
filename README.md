# Angles
![Angles Logo](./images/ANGLES128.png)

**Built for DUBHACKS 2020**

### A Chrome extension that allows you to scroll through your favorite news sites, while also presenting related articles from other news sources with contrasting perspectives. 

[Link to Devpost submission](https://devpost.com/software/angles-sqdzlt)

## **Contributors**
- [Abhinav Bandari](https://github.com/abx393)
- [Abhay Deshpande](https://github.com/abhaybd)
- [Arnav Thareja](https://github.com/arnavthareja)
- [Yiyang (Ian) Wang](https://github.com/iwangy)
- [Cindy Zou](https://github.com/x9du)

## Inspiration
Over the past few decades, data shows that our nation has become more ideologically divided. We hope to help address this by creating a tool to diversify readers' news diets. Nowadays, we’ve become stuck in news echo chambers. In these echo chambers, we just reaffirm our own opinions, we never challenge our beliefs, and we rarely see perspectives that differ from our own. This separation does little to help the massive polarization and tension that plagues our politics today. Angles seeks to proactively challenge its users to expand their perspectives, drawing from a wide variety of news sources they wouldn’t have visited otherwise

## What it does
Our Chrome extension Angles analyzes a webpage’s “bias” using natural language processing as well as data drawn from pre-generated datasets. We analyze this data and accumulate a list of articles on the same subject but with contrasting ideological perspectives from those of the current article. These suggested articles are presented in a browser popup.

## How we built it
Angles works by integrating together several different APIs and Datasets. First, it automatically detects when a user is reading a news article and then displays an unobtrusive modal. Then, we use an Extractor API to scrape text from the article. Additionally, we query a dataset from a news organization called All Sides to determine the ideological leanings of the user's current news sources and find alternative sources with contrasting political leanings. Then, we use Google Cloud NLP to extract keywords from the aforementioned scraped text. Those keywords are then used with the alternative news sources to find relevant news articles from those sources. Finally, the top results are then displayed as hyperlinks with corresponding icons in the frontend of the floating browser modal.

## Challenges we ran into
Cleaning the data from the datasets we queried was a challenge. (It turns out there are many, many different ways to say "The New York Times"). Pulling from multiple datasets and ensuring that entries existed in all of them was difficult. Another challenge was that the articles returned from the news API query were not always relevant to the subject of the current article.

## Accomplishments that we're proud of
Different APIs and datasets represent the same information in different ways. Getting all of our components to play well together took a lot of work, but it worked great once we got it.

## What we learned
None of us had ever made a Chrome extension before, so we all got valuable experience through this. Additionally, we learned a lot about working with RESTful APIs.

## What's next for Angles
We want to implement more accurate content analysis and keyword extraction to display more relevant articles to the user’s current article. We’re currently using free versions of these APIs, so we want to integrate with enterprise APIs to get better results for our queries and higher rate limits. To reduce the delay between opening Angles and when the relevant articles get queried, we want to do a thorough performance overhaul. We also want to make the UI configurable to fit the user’s browsing habits.
