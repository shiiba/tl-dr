import React from 'react';
import Tab from './tab.js';

// Tabs component that generates three tab child components
export default class Tabs extends React.Component {
  constructor(props) {
    super(props);
  }

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
