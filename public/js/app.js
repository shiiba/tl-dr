function setDictObjs(dictionary) {
  let tmp = _.mapObject(dictionary, (val, key) => {
    return({
      'sentence': key,
      'score': val
    });
  })
  return tmp;
};

function createArray(dictionary) {
  let tmp = [];
  _.each(dictionary, (obj) => {
    tmp.push(obj);
  });
  return tmp;
};

function minAndMax(dictionary) {
  let min, max = 0;
  max = _.max(dictionary, (sent) => { return sent.score }).score;
  min = _.min(dictionary, (sent) => { return sent.score }).score;
  return { max: max, min: min };
}

function normalize(dictionary) {
  let minMax = minAndMax(dictionary);
  let normalized = _.map(dictionary, (obj) => {
    let norm = ((obj['score'] - minMax.min) / (minMax.max - minMax.min));
    let normScore = { 'normScore': norm };
    return _.extend(obj, normScore);
  });
  return normalized;
};

class Application extends React.Component {
  constructor() {
    super();
    this.state = { 
      authenticatedUser: document.cookie ? true : ''
    };
  }

  changeLogin() {
    console.log('changelogin');
    this.setState({ authenticatedUser: true });
  }

  handleReset() {
    this.setState({ authenticatedUser: '' });
  }

  render() {
    if(this.state.authenticatedUser === true) {
      return(
        <div className="logged-in">
          <SummarySearch />
        </div>
      );
    } else {
      return(
        <div className="logged-out">
          <div className="auth-container">
            <nav>
            Q
            </nav>
            <div className="title">
              TL;DR
            </div>
            <div className="auth-forms">
              <div className="signup"> 
                <SignupForm 
                  changeLogin={this.changeLogin.bind(this)}
                />
              </div>
              <div className="login">
                <LoginForm 
                  // initialLoginCheck={this.state.authenticatedUser} 
                  changeLogin={this.changeLogin.bind(this)}
                />
              </div>
            </div>
          </div>
        </div>
      );
    }
  }
};

class SummarySearch extends React.Component {
  constructor() {
    super();
    this.state = { 
      dict: [],
      threshold: 0.5
    };
    this.handleThresholdChange = this.handleThresholdChange.bind(this);
  }

  getSummary(url) {
    $.ajax({
      url: '/summarize',
      method: 'POST',
      data: { url: url },
      success: (data) => {
        let dictionary = createArray(setDictObjs(data.dictionary));
        let norm = normalize(dictionary);
        // console.log(norm);
        this.setState({ dict: norm });
      }.bind(this),
      error: (xhr, status, err) => {
        console.error(status, err.toString());
      }.bind(this)
    });
  }

  handleThresholdChange(num) {
    // console.log('threshold changing: ' + num);
    // console.log(this.state);
    this.setState({ 
      threshold: num
    })
  }

  render() {
    return(
      <div>
        <UrlSearch 
          summaryCall={this.getSummary.bind(this)}
        />
        <SummaryDisplay
          dict={this.state.dict}
          changeThresh={this.handleThresholdChange}
          threshold={this.state.threshold}
        />
      </div>
    );
  }
};

class UrlSearch extends React.Component {
  constructor() {
    super();
    this.state = { tempUrl: null };
  }

  handleSearchChange(e) {
    console.log(e.target.value);
    this.setState({ tempUrl: e.target.value });
  }

  handleSubmit(e) {
    e.preventDefault();
    this.props.summaryCall(this.state.tempUrl);
  }

  render() {
    return(
      <div 
        className="search-bar"
      >
        <form 
          onSubmit={this.handleSubmit.bind(this)}
        >
          <label 
            // htmlFor="searchForm"
          > 
            Paste a URL to Summarize: 
          </label>
          <br/>
          <input
            className="url-search-form" 
            type="text" 
            // value={} 
            placeholder="Paste a URL"
            onChange={this.handleSearchChange.bind(this)}
          />
          <button 
            className="sum-btn" 
          >
            Summarize
          </button>
        </form>
      </div>
    );
  }
};

class SummaryDisplay extends React.Component {
  handleSlider(e) {
    console.log('threshold in child component: ' + e.target.value);
    // console.log(this.props);
    this.props.changeThresh(e.target.value);
  }

  render() {
    let filtered = _.filter(this.props.dict, (obj) => {
      return obj['normScore'] >= this.props.threshold;
    });
    
    let sentences = _.map(filtered, (obj) => {
      return(
        <span 
          id={obj['score']}
          value={obj['normScore']}
          className="sentence-span"
        >
          {obj['sentence']}
        </span>
      );
    });

    return(
      <div>
        <div
          className="summary"
        >
          {sentences}
        </div>
        <div
          className="slider-container"
        >
          <input 
            type="range" 
            min="0" 
            max="1" 
            step=".0001"
            onInput={this.handleSlider.bind(this)} 
            className="slider"
          />
        </div>
      </div>
    );
  }
};

class LoginForm extends React.Component {
  constructor() {
    super();
    this.state = { 
      username: '',
      password: ''
    };
  }

  handleLoginFormChange(stateName, e) {
    let change = {};
    change[stateName] = e.target.value;
    this.setState(change);
  }

  handleSubmit(e) {
    e.preventDefault();
    let username = this.state.username.trim();
    let password = this.state.password.trim();
    console.log('username: ' + username);
    console.log('password: ' + password);
    this.loginAJAX(username, password);
  }

  loginAJAX(username, password) {
    console.log('login AJAX hit');
    console.log(username);
    console.log(password);
    $.ajax({
      url: "/auth",
      method: "POST",
      data: {
        username: username,
        password: password
      },
      success: function(data) {
        console.log('successful login ajax call');
        Cookies.set('jwt_token', data.token);
        console.log(data);
        this.props.changeLogin(data.token);
      }.bind(this),
      error: function(xhr, status, err) {
        console.error(status, err.toString());
      }.bind(this),
    });
  }

  render() {
    return(
      <div className="login">
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
      </div>  
    );
  }
}

class SignupForm extends React.Component {
  constructor() {
    super();
  }

  handleSignupFormChange(setName, e) {
    let change = {};
    change[setName] = e.target.value
    this.setState(change);
  }

  handleSubmit(e) {
    e.preventDefault();
    let username = this.state.username.trim();
    let password = this.state.password.trim();
    this.signupAJAX(username, password);
  }

  signupAJAX(username, password) {
    console.log('sending signup post request');
    $.ajax({
      url:'/users/register',
      method: 'POST',
      data: {
        username: username,
        password: password
      },
      success: function(data){
        console.log("A new user signed up!");
        console.log(data);
        this.handleSignupAuthentication(username, password);
      }.bind(this),
      error: function(xhr, status, err) {
        console.error(status, err.toString());
      }.bind(this)
    });
  }

  handleSignupAuthentication(username, password) {
    var self = this;
    var callback = function() {
      self.props.changeLogin();
    };
    $.ajax({
      url: '/auth',
      method: 'POST',
      data: {
        username: username,
        password: password
      },
      //if saved it console logs
      success: function(data) {
        console.log('Token acquired.');
        console.log(data);
        Cookies.set('jwt_token', data.token);
        callback();
      }.bind(this),
      error: function(xhr, status, err) {
        console.error(status, err.toString());
      }.bind(this)
    });
  }

  render() {
    return(
      <div className="signup-form">
        <h1> Create An Account </h1>
        <form 
          onSubmit={this.handleSubmit.bind(this)}
        >
          <label htmlFor="firstName"> 
            First Name: 
          </label>
          <br/>
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

ReactDOM.render(
  <div>
    <Application />
  </div>,
   document.getElementById('container')
);

