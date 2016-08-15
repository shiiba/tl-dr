import React from 'react';
import $ from 'jquery';

// Conditionally displays Pocket OAuth or Fetch Articles buttons
export default class PocketAuthBtn extends React.Component {
  constructor(props) {
    super(props);
  }

  // Checks to see if the user is already auth'd with Pocket
  componentWillMount() {
    $.ajax({
      url: '/users/pocket_auth',
      method: 'GET'
    })
    .done((val) => {
      // console.log('componentWillMount pocket check value: ');
      // console.log(val);
      this.props.changePocket(val);
    });
  }

  // AJAX call to users controller that queries the Pocket API and grabs a 
  // users's latest 30 articles; stores them in the DB
  getPocketArticles() {
    $.ajax({
      url: '/users/pocket_articles',
      method: 'GET'
    })
    .done(() => {
      console.log('finished grabbing articles');
      this.props.getArticles();
    });
  }

  render() {
    if(this.props.pocketIsAuthed === true) {
      return (
        <div className="fetch-btn">
          <button
            onClick={this.getPocketArticles.bind(this)}
          >
            Fetch Pocket Articles
          </button>
        </div>
      );
    } else {
      return(
        <div>
          <span>Connect Your Pocket Account:</span>
          <a href="./auth/pocket" className="button">Connect</a>
        </div>
      ); 
    } 
  }
};
