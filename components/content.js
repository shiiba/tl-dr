import React from 'react';
import UrlSearch from './url_search.js';
import ArticlesList from './articles_list.js';
import SummaryDisplay from './summary_display.js';

// Contains the main content – search, articles list, and summary display
// conditionally rendered based on currentTab props
export default class Content extends React.Component {
  constructor(props) {
    super(props);
  }

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
            changeTab={this.props.changeTab}
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
