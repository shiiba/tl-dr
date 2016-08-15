import React from 'react';
import $ from 'jquery';
import Tabs from './tabs.js';
import Content from './content.js';
import { setDictObjs, createArray, normalize } from './helpers/dictionary.js';

// Main logged-in component that holds summarized content and tabbed navigation 
// state, and makes AJAX calls to the summarization algorithm
export default class SummarySearch extends React.Component {
  constructor(props) {
    super(props);
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
      },
      // }.bind(this),
      error: (xhr, status, err) => {
        console.error(status, err.toString());
      }
      // }.bind(this)
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
          changeTab={this.changeTab}
        />
      </div>
    );
  }
};
