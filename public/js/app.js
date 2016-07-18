function setDictObjs(dictionary){
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

$(() => {
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
          <div className="logged-out all">
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

  class SummarySearch extends React.Component {
    constructor() {
      super();
      var tabList = [
        { id: 1, name: 'URL Search' },
        { id: 2, name: 'Pocket Articles'},
        { id: 3, name: 'Summary'},
      ];
      this.state = { 
        title: '',
        dict: [],
        threshold: 0.5,
        tabList: tabList,
        currentTab: 1
      };
      this.getSummary = this.getSummary.bind(this);
      this.changeTab = this.changeTab.bind(this);
      this.handleThresholdChange = this.handleThresholdChange.bind(this);
    }

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

    changeTab(tab) {
      this.setState({ currentTab: tab.id });
    }

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
          <div 
            className="slider-container"
            id="footer"
            // style={inlineStyle}
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
});
