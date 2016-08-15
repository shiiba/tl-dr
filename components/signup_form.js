import React from 'react';
import $ from 'jquery';

// Signup form
export default class SignupForm extends React.Component {
  constructor(props) {
    super(props);
    this.state = { 
      username: '',
      password: ''
    };
  }

  // Temporarily stores the form data in state
  handleSignupFormChange(setName, e) {
    let change = {};
    change[setName] = e.target.value
    this.setState(change);
  }

  // Trims inputs and hits signup AJAX method
  handleSubmit(e) {
    e.preventDefault();
    let username = this.state.username.trim();
    let password = this.state.password.trim();
    this.signupAJAX(username, password);
  }

  // POST request to users controller that creates the user in the DB and then
  // hits the auto-authentication method
  signupAJAX(username, password) {
    console.log('sending signup post request');
    $.ajax({
      url:'/users/register',
      method: 'POST',
      data: {
        username: username,
        password: password
      },
      success: (data) => {
        console.log("A new user signed up!");
        console.log(data);
        this.handleSignupAuthentication(username, password);
      },
      // }.bind(this),
      error: (xhr, status, err) => {
        console.error(status, err.toString());
      }
      // }.bind(this)
    });
  }

  // Auto-authenticates users who sign up
  handleSignupAuthentication(username, password) {
    let self = this;
    let callback = () => {
      self.props.changeLogin();
    };
    $.ajax({
      url: '/auth',
      method: 'POST',
      data: {
        username: username,
        password: password
      },
      success: (data) => {
        // console.log('Token acquired.');
        // console.log(data);
        Cookies.set('jwt_token', data.token);
        Cookies.set('userId', data.userId);
        callback();
      },
      // }.bind(this),
      error: (xhr, status, err) => {
        console.error(status, err.toString());
      }
      // }.bind(this)
    });
  }

  render() {
    return(
      <div className="signup-form">
        <h1> Create An Account </h1>
        <form 
          onSubmit={this.handleSubmit.bind(this)}
        >
          <label htmlFor="username"> 
            Username: 
          </label>
          <br/>
          <input 
            className="username-create" 
            type="text" 
            onChange={this.handleSignupFormChange.bind(this,'username')}
          /><br/>
          <label htmlFor="password">
              Password: 
          </label>
          <br/>
          <input 
            className="password-create" 
            type="password" 
            onChange={this.handleSignupFormChange.bind(this,'password')}
          /><br/>
          <input
            className="signupSubmit" 
            type="submit"
          />
        </form>
      </div>
    );
  }
}
