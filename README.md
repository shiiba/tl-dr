# TL:DR
A Summarization App for your Pocket Queue 

[Link to TL;DR](http://tl-dr-app.herokuapp.com/)

### Description
Final project for General Assembly's Web Development Immersive. 
A Node.js & React.js application that allows a user to connect their Pocket account and auto-summarize / compress the number of sentences in the article for faster reading. Uses an implementation of [TF-IDF](https://en.wikipedia.org/wiki/Tf–idf) (term frequency - inverse document frequency) to determine the relative importance of sentences.

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
- Ability to archive Pocket articles
- Implement a better web scraper
- Implement a better TF-IDF algorithm
