import React from 'react';

// Tab component that generates individual tab; when clicked, switches tabs
export default class Tab extends React.Component {
  constructor(props) {
    super(props);
  }

  handleClick(e) {
    e.preventDefault();
    this.props.handleClick();
  }

  render() {
    return(
      <li 
        className={this.props.isCurrent ? 'current' : null}
        onClick={this.handleClick.bind(this)}
      >
        <div>
          {this.props.name}
        </div>
      </li>
    );
  }
}
