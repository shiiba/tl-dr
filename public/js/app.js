function setDictObjs(dictionary) {
  let tmp = _.mapObject(dictionary, function(val, key) {
    return({
      'sentence': key,
      'score': val
    });
  })
  return tmp;
};

function createArray(dictionary) {
  let tmp = [];
  _.each(dictionary, function(obj){
    tmp.push(obj);
  });
  return tmp;
};

function normalize(dictionary) {
  let min, max = 0;
  max = _.max(dictionary, function(sent){ return sent.score }).score;
  min = _.min(dictionary, function(sent){ return sent.score }).score;
  let normalized = _.map(dictionary, function(obj){
    let norm = ((obj['score'] - min) / (max - min));
    let normScore = { 'normScore': norm };
    return _.extend(obj, normScore);
  });
  return normalized;
};


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
    this.state = { 
      dict: []
    };
  }

  getSummary(url) {
    $.ajax({
      url: '/summarize',
      method: 'POST',
      data: { url: url },
      success: function(data){
        let dictionary = createArray(setDictObjs(data.dictionary));
        let norm = normalize(dictionary);
        // console.log(norm);
        this.setState({ dict: norm });
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
    let filtered = _.filter(this.props.dict, function(obj) {
      return obj['normScore'] >= 0.5;
    });
    let sentences = _.map(filtered, function(obj) {
      return(
        <span 
          // key={} 
          id={obj['score']}
          value={obj['normScore']}
        >
          {obj['sentence']}
        </span>
      );
    });
    return(
      <div>
        <div>
          {sentences}
        </div>
        <input 
          type="range" 
          min="0" 
          max="1" 
          step=".1" 
          // onInput={} 
        />
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

