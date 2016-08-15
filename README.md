# TL;DR (Too Long; Didn't Read)
A Summarization App for your Pocket Queue 

[Link to TL;DR](http://tl-dr-app.herokuapp.com/) | **username**: test , **password**: test

### Description
Final project for General Assembly's Web Development Immersive. 
A Node.js & React.js application that allows a user to connect their Pocket account and auto-summarize / compress the number of sentences in the article for faster reading. Uses an implementation of [TF-IDF](https://en.wikipedia.org/wiki/Tf–idf) (term frequency - inverse document frequency) to determine the relative importance of sentences.

Articles URLs are scraped and individual sentences within the article are given a score via TF-IDF. Use the slider at the bottom of the summary to adjust the threshold and compress / expand the article (left for compressed, right for expanded). When expanding, sentences appear by next-most-important score. 

### Notes
- The URL scraper doesn't work well for all URLs
- Summarization works better for harder news articles, and less well with op-eds or narrative pieces that require more sentence-to-sentence context

### Tech used
- Node.js
- Express
- Javascript (ES6)
- React.js (ES6)
- Underscore.js
- Passport (User Auth)
- Pocket API OAuth
- Mongoose (MongoDB)

### Features
- Summarization using TF-IDF (term frequency - inverse document frequency) algorithm
- Summarize by URL
- Connect your Pocket Account & summarize articles from Pocket
- Use range slider to filter sentences by importance
- Account management using Passport

### Future Features
- Authentication validation / flash messages
- Ability to archive Pocket articles
- Implement a better web scraper
- Implement a better TF-IDF algorithm
