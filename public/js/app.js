// Converts TF-IDF algorithm output ('sentence': 'score'), to correctly named k:v pairs (uses underscore.js)
function setDictObjs(dictionary){
  let tmp = _.mapObject(dictionary, (val, key) => {
    return({
      'sentence': key,
      'score': val
    });
  })
  return tmp;
};

// Creates an array of objects out of a nested object
function createArray(dictionary) {
  let tmp = [];
  _.each(dictionary, (obj) => {
    tmp.push(obj);
  });
  return tmp;
};

// Finds the min and max score of sentences and returns them
function minAndMax(dictionary) {
  let min, max = 0;
  max = _.max(dictionary, (sent) => { return sent.score }).score;
  min = _.min(dictionary, (sent) => { return sent.score }).score;
  return { max: max, min: min };
}

// Normalizes the scores on a scale of 0 to 1 and add it to the object
function normalize(dictionary) {
  let minMax = minAndMax(dictionary);
  let normalized = _.map(dictionary, (obj) => {
    let norm = ((obj['score'] - minMax.min) / (minMax.max - minMax.min));
    let normScore = { 'normScore': norm };
    return _.extend(obj, normScore);
  });
  return normalized;
};

// Using React with ES6 Syntax
$(() => {

// Main React parent component that maintains authenticated states and displays
// logged-in or logged-out experiences
  class Application extends React.Component {
    constructor() {
      super();
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

// Main logged-in component that holds summarized content and tabbed navigation 
// state, and makes AJAX calls to the summarization algorithm
  class SummarySearch extends React.Component {
    constructor() {
      super();
      let tabList = [
        { id: 1, name: 'URL Search' },
        { id: 2, name: 'Pocket Articles'},
        { id: 3, name: 'Summary'},
      ];
      this.state = { 
        title: 'No Article Found. Summarize Something!',
        dict: [],
        threshold: 0.5,
        tabList: tabList,
        currentTab: 1
      };
      this.getSummary = this.getSummary.bind(this);
      this.changeTab = this.changeTab.bind(this);
      this.handleThresholdChange = this.handleThresholdChange.bind(this);
    }

    // AJAX call to the summary controller and summarization module; sets state
    // up at the parent component with the returned scored dictionary
    getSummary(url, existingTitle) {
      $.ajax({
        url: '/summarize',
        method: 'POST',
        data: { url: url },
        success: (data) => {
          let dictionary = createArray(setDictObjs(data.dictionary));
          let norm = normalize(dictionary);
          // console.log(norm);
          let title = existingTitle ? existingTitle : data.title;
          this.setState({ 
            dict: norm,
            currentTab: 3,
            title: title
          });
        }.bind(this),
        error: (xhr, status, err) => {
          console.error(status, err.toString());
        }.bind(this)
      });
    }

    // Sets state of the current tab
    changeTab(tab) {
      this.setState({ currentTab: tab.id });
    }

    // Sets state of the threshold based on HTML range slider, which filters sentences
    handleThresholdChange(num) {
      // console.log('threshold changing: ' + num);
      // console.log(this.state);
      this.setState({ threshold: num });
    }

    render() {
      return(
        <div className="app-container">
          <div className="tabs-container">
            <Tabs
              currentTab={this.state.currentTab}
              tabList={this.state.tabList}
              changeTab={this.changeTab}
            />
          </div>
          <Content 
            currentTab={this.state.currentTab} 
            summaryCall={this.getSummary}
            changePocket={this.props.changePocket}
            pocketIsAuthed={this.props.pocketIsAuthed}
            title={this.state.title}
            dict={this.state.dict}
            changeThresh={this.handleThresholdChange}
            threshold={this.state.threshold}
          />
        </div>
      );
    }
  };

  // Tabs component that generates three tab child components
  class Tabs extends React.Component {
    handleClick(tab) {
      this.props.changeTab(tab);
    }

    render() {
      let tab = this.props.tabList.map((tab) => {
        return(
          <Tab 
            handleClick={this.handleClick.bind(this, tab)}
            key={tab.id}
            name={tab.name}
            isCurrent={(this.props.currentTab === tab.id)}
          />
        );
      });
      return(
        <ul>
          {tab}
        </ul>
      );
    }
  };

  // Tab component that generates individual tab; when clicked, switches tabs
  class Tab extends React.Component {
    handleClick(e) {
      e.preventDefault();
      this.props.handleClick();
    }

    render() {
      return(
        <li className={this.props.isCurrent ? 'current' : null}>
          <div onClick={this.handleClick.bind(this)} >
            {this.props.name}
          </div>
        </li>
      );
    }
  }

  // Contains the main content – search, articles list, and summary display
  // conditionally rendered based on currentTab props
  class Content extends React.Component {
    render() {
      return(
        <div className="content">
          {this.props.currentTab === 1 ? 
            <UrlSearch 
              summaryCall={this.props.summaryCall.bind(this)}
            />
          : null}

          {this.props.currentTab === 2 ? 
            <ArticlesList
              changePocket={this.props.changePocket.bind(this)}
              pocketIsAuthed={this.props.pocketIsAuthed}
              summaryCall={this.props.summaryCall.bind(this)}
            />
          : null}

          {this.props.currentTab === 3 ? 
            <SummaryDisplay
              title={this.props.title}
              dict={this.props.dict}
              changeThresh={this.props.changeThresh.bind(this)}
              threshold={this.props.threshold}
            />
          : null}
        </div>
      );
    }
  };

  // Component that allows you to search and summarize by URL
  class UrlSearch extends React.Component {
    constructor() {
      super();
      this.state = { tempUrl: null };
    }

    // Maintains temporary URL storage
    handleSearchChange(e) {
      // console.log(e.target.value);
      this.setState({ tempUrl: e.target.value });
    }

    // Passes temporary URL state to the summarization AJAX call from its parent
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

  // Displays the summarized text, filtered by the slider threshold
  class SummaryDisplay extends React.Component {
    // Sets the threshold state in parent component as the slider moves
    handleSlider(e) {
      console.log('threshold in child component: ' + e.target.value);
      // console.log(this.props);
      this.props.changeThresh(e.target.value);
    }

    // Filters the displayed sentences based on the slider threshold number
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
          <div 
            className="slider-container"
            id="footer"
          >
            <div className="slider-second-container">
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
        </div>
      );
    }
  };

  // Contains User's Pocket account details, fetches articles, stores and displays them
  class ArticlesList extends React.Component {
    constructor() {
      super();
      this.state = {
        articles: []
      };
    }

    // Grabs the latest pocket articles in the DB and updates the state before render
    componentWillMount() {
      $.ajax({
        url: '/users/articles',
        method: 'GET'
      })
      .done((articles) => {
        this.setState({ articles: articles });
      })
    }

    // Calls summarize on the article when the summary button is clicked
    getSummary(url, title) {
      console.log(url);
      this.props.summaryCall(url, title);
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
          />
        </div>
      );
    }
  };

  // Conditionally displays Pocket OAuth or Fetch Articles buttons
  class PocketAuthBtn extends React.Component {

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

  // Login form
  class LoginForm extends React.Component {
    constructor() {
      super();
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
        }.bind(this),
        error: (xhr, status, err) => {
          console.error(status, err.toString());
        }.bind(this),
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

  // Signup form
  class SignupForm extends React.Component {
    constructor() {
      super();
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
        }.bind(this),
        error: (xhr, status, err) => {
          console.error(status, err.toString());
        }.bind(this)
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
        }.bind(this),
        error: (xhr, status, err) => {
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

 // Main React Render function
  ReactDOM.render(
    <div>
      <Application />
    </div>,
     document.getElementById('container')
  );
});
