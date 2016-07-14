class Application extends React.Component {
  render() {
    return(
      <SummarySearch />
    );
  }
}

class SummarySearch extends React.Component {
  constructor() {
    super();
    this.state = { dict: [] };
  }

  getSummary(url) {
    $.ajax({
      url: '/summarize',
      method: 'POST',
      data: { url: url },
      success: function(data){
        var dictionary = []
        for(let i in data.dictionary) {
          let o = {};
          o[i] = data.dictionary[i];
          dictionary.push(o);
        }
        console.log(dictionary);
        this.setState({ dict: dictionary });
      }.bind(this),
      error: function(xhr, status, err){
        console.error(status, err.toString());
      }.bind(this)
    });
  }

  render() {
    return(
      <div>
        <UrlSearch 
          summaryCall={this.getSummary.bind(this)}
        />
        <SummaryDisplay
          dict={this.state.dict}
        />
      </div>
    );
  }
}

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
}

class SummaryDisplay extends React.Component {
  render() {
    return(
      <div>
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

