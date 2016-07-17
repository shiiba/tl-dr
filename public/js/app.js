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
      authenticatedUser: document.cookie ? true : '',
      pocketAuth: false
    };
  }

  changeLogin() {
    console.log('change login');
    this.setState({ authenticatedUser: true });
  }

  changePocket(val) {
    console.log('changing pocketAuth: ');
    console.log(val);
    this.setState({ pocketAuth: val });
  }

  handleReset() {
    this.setState({ 
      authenticatedUser: '',
      pocketAuth: false
    });
  }

  render() {
    if(this.state.authenticatedUser === true) {
      return(
        <div className="parent-container">
          <div className="logged-in all">
            <SummarySearch 
              pocketIsAuthed={this.state.pocketAuth}
              changePocket={this.changePocket.bind(this)}
            />
          </div>
        </div>
      );
    } else {
      return(
        <div className="parent-container">
          <div className="logged-out all">
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
                    changeLogin={this.changeLogin.bind(this)}
                  />
                </div>
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
      title: '',
      dict: [],
      threshold: 0.5
    };
    this.handleThresholdChange = this.handleThresholdChange.bind(this);
    this.setTitle = this.setTitle.bind(this);
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
    this.setState({ threshold: num });
  }

  setTitle(title) {
    this.setState({ title: title });
  }

  render() {
    return(
      <div>
        <UrlSearch 
          summaryCall={this.getSummary.bind(this)}
        />
        <SummaryDisplay
          title={this.state.title}
          dict={this.state.dict}
          changeThresh={this.handleThresholdChange}
          threshold={this.state.threshold}
        />
        <ArticlesList
          changePocket={this.props.changePocket.bind(this)}
          pocketIsAuthed={this.props.pocketIsAuthed}
          summaryCall={this.getSummary.bind(this)}
          setTitle={this.setTitle}
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
    // console.log(e.target.value);
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
      return obj['normScore'] <= this.props.threshold;
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
        <div className="summary-container">
          <div className="summary-title">
            {this.props.title}
          </div>
          <div className="summary-text">
            {sentences}
          </div>
        </div>
        <div className="slider-container">
          <input 
            type="range" 
            min="0.3" 
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

class ArticlesList extends React.Component {
  constructor() {
    super();
    this.state = {
      articles: []
    };
  }

  componentWillMount() {
    $.ajax({
      url: '/users/articles',
      method: 'GET'
    })
    .done((articles) => {
      this.setState({ articles: articles });
    })
  }

  getSummary(title, url) {
    console.log(url);
    this.props.setTitle(title);
    this.props.summaryCall(url);
  }

  render() {
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
              onClick={() => this.getSummary(article.resolvedTitle, article.resolvedUrl)}
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
        <PocketAuthBtn 
          changePocket={this.props.changePocket.bind(this)}
          pocketIsAuthed={this.props.pocketIsAuthed}
        />
        <div className="articles-container">
          {articles}
        </div>
      </div>
    );
  }
};

class PocketAuthBtn extends React.Component {

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

  getPocketArticles() {
    $.ajax({
      url: '/users/pocket_articles',
      method: 'GET'
    });
  }

  render() {
    if(this.props.pocketIsAuthed === false) {
      return(
        <div>
          <span>Connect Your Pocket Account:</span>
          <a href="./auth/pocket" className="button">Connect</a>
        </div>
      ); 
    } else {
      return (
        <div>
          <button
            onClick={this.getPocketArticles.bind(this)}
          >
            Fetch Pocket Articles
          </button>
        </div>
      );
    } 
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
    // console.log('username: ' + username);
    // console.log('password: ' + password);
    this.loginAJAX(username, password);
  }

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
      success: function(data) {
        // console.log('successful login ajax call');
        Cookies.set('jwt_token', data.token);
        Cookies.set('userId', data.userId);
        // console.log(data);
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
    let self = this;
    let callback = function() {
      self.props.changeLogin();
    };
    $.ajax({
      url: '/auth',
      method: 'POST',
      data: {
        username: username,
        password: password
      },
      success: function(data) {
        // console.log('Token acquired.');
        // console.log(data);
        Cookies.set('jwt_token', data.token);
        Cookies.set('userId', data.userId);
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

