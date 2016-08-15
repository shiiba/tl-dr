import React from 'react';
import $ from 'jquery';
import _ from 'underscore';
import PocketAuthBtn from './pocket_auth.js';

// Contains User's Pocket account details, fetches articles, stores and displays them
export default class ArticlesList extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      articles: [],
      waiting: true
    };
    this.getArticles = this.getArticles.bind(this);
  }

  getArticles() {
    $.ajax({
      url: '/users/articles',
      method: 'GET'
    })
    .done((articles) => {
      this.setState({ 
        articles: articles,
        waiting: false
       });
    });
  }

  // Grabs the latest pocket articles in the DB and updates the state before render
  componentWillMount() {
    this.getArticles();
  }

  // Calls summarize on the article when the summary button is clicked
  getSummary(url, title) {
    console.log(url);
    this.props.summaryCall(url, title);
  }

  renderWaitingForArticles(){
    return (<div>Waiting for articles...</div>)
  }

  renderArticles(){
    let articles = _.map(this.state.articles, (article) => {
      return(
        <div className="article-container">
          <div className="article-info-container">
            <div className="article-title">
              {article.resolvedTitle}
            </div>
            <div className="article-wordcount">
              Word Count: {article.wordCount}
            </div>
          </div>
          <div className="article-btn-container">
            <button
              onClick={() => this.getSummary(article.resolvedUrl, article.resolvedTitle)}
              className="article-btn"
            >
              Summarize
            </button>
          </div>
        </div>
      );
    });
    return(
      <div>
        <div className="articles-container">
          {articles}
        </div>
        <PocketAuthBtn 
          changePocket={this.props.changePocket.bind(this)}
          pocketIsAuthed={this.props.pocketIsAuthed}
          changeTab={this.props.changeTab}
          getArticles={this.getArticles}
        />
      </div>
    );
  }

  render() {
    if(this.state.waiting){
      return this.renderWaitingForArticles();
    }else{
      return this.renderArticles();
    }
  }
};
