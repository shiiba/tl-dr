import React from 'react';
import ReactDOM from 'react-dom';
import $ from 'jquery';
import _ from 'underscore';
import styles from '../public/css/styles.css';
import SummarySearch from './summary_search.js';
import SignupForm from './signup_form.js';
import LoginForm from './login_form.js';

// Main React parent component that maintains authenticated states and displays
// logged-in or logged-out experiences
class Application extends React.Component {
  constructor(props) {
    super(props);
    this.state = { 
      authenticatedUser: document.cookie ? true : '',
      pocketAuth: false
    };
  }

  // Sets state which determines whether login/signup is displayed
  changeLogin() {
    console.log('change login');
    this.setState({ authenticatedUser: true });
  }

  // Sets state which determines whether pocket connect or fetch btn appears
  changePocket(val) {
    console.log('changing pocketAuth: ');
    console.log(val);
    this.setState({ pocketAuth: val });
  }

  // Logs the user out, resets state, and removes cookies
  handleReset() {
    Cookies.remove('jwt_token');
    Cookies.remove('connect.sid');
    Cookies.remove('userId');
    this.setState({ 
      authenticatedUser: '',
      pocketAuth: false
    });
  }

  renderMainApp() {
    if(this.state.authenticatedUser === true) {
      return(
        <div className="logged-in all">
          <SummarySearch 
            pocketIsAuthed={this.state.pocketAuth}
            changePocket={this.changePocket.bind(this)}
          />
        </div>
      );
    } else {
      return(
        <div className="logged-out">
          <div className="auth-container">
            <div className="signup"> 
              <SignupForm 
                changeLogin={this.changeLogin.bind(this)}
              />
            </div>
            <div className="login">
              <LoginForm 
                changeLogin={this.changeLogin.bind(this)}
              />
            </div>
          </div>
        </div>
      );
    }
  }

  render() {
    return(
        <div className="parent-container">
          <header>
            <nav>
              <div>
                <span className="header-text">TL;DR</span> – A Summarization App
              </div>
              <div 
                className={this.state.authenticatedUser === true ? "logout" : "hidden"}
                onClick={this.handleReset.bind(this)}
              >
                Logout
              </div>
            </nav>
          </header>
          {this.renderMainApp()}
        </div>
    );
  }
};

// Main React Render function
ReactDOM.render(
  <div>
    <Application />
  </div>,
   document.getElementById('container')
);
