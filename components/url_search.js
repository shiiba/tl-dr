import React from 'react';

// Component that allows you to search and summarize by URL
export default class UrlSearch extends React.Component {
  constructor(props) {
    super(props);
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
