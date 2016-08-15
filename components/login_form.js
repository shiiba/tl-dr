import React from 'react';
import $ from 'jquery';

// Login form
export default class LoginForm extends React.Component {
  constructor(props) {
    super(props);
    this.state = { 
      username: '',
      password: ''
    };
  }

  // Stores current login form values in state
  handleLoginFormChange(stateName, e) {
    let change = {};
    change[stateName] = e.target.value;
    this.setState(change);
  }

  // Trims the inputs and hits the login AJAX method
  handleSubmit(e) {
    e.preventDefault();
    let username = this.state.username.trim();
    let password = this.state.password.trim();
    // console.log('username: ' + username);
    // console.log('password: ' + password);
    this.loginAJAX(username, password);
  }

  // Hits the auth controller and logs the user in
  loginAJAX(username, password) {
    // console.log('login AJAX hit');
    // console.log(username);
    // console.log(password);
    $.ajax({
      url: "/auth",
      method: "POST",
      data: {
        username: username,
        password: password
      },
      success: (data) => {
        // console.log('successful login ajax call');
        Cookies.set('jwt_token', data.token);
        Cookies.set('userId', data.userId);
        // console.log(data);
        this.props.changeLogin(data.token);
      },
      // }.bind(this),
      error: (xhr, status, err) => {
        console.error(status, err.toString());
      }
      // }.bind(this),
    });
  }

  render() {
    return(
      <div className="login-form" >
        <h1>Please Login</h1>
        <form onSubmit={this.handleSubmit.bind(this)}>
          <label htmlFor="username" >
            Username:
          </label>
          <br/>
          <input 
            className="username-login-form" 
            type="text" 
            value={this.state.username} 
            onChange={this.handleLoginFormChange.bind(this, 'username')}
          /><br/>
          <label htmlFor="password">
            Password:
          </label>
          <br/>
          <input 
            className="password-login-form" 
            type="password" 
            value={this.state.password} 
            onChange={this.handleLoginFormChange.bind(this, 'password')}
          /><br/>
          <input
            className="loginSubmit" 
            type="submit"
          />
        </form>
      </div>
    );
  }
}
