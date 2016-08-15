import React from 'react';
import _ from 'underscore';

// Displays the summarized text, filtered by the slider threshold
export default class SummaryDisplay extends React.Component {
  constructor(props) {
    super(props);
    this.state = { key: [] };
    this.tmp = [];
  }

  // Sets the threshold state in parent component as the slider moves
  handleSlider(e) {
    console.log('threshold in child component: ' + e.target.value);
    // console.log(this.props);
    this.props.changeThresh(e.target.value);
  }

  setKey(score) {
    return this.state.key.indexOf(score) === -1 ? score : score + Math.random() * 1000;
  }

  componentDidMount() {
    // console.log('this.tmp: ' + this.tmp);
    this.setState({ key: this.tmp });
  }

  // Filters the displayed sentences based on the slider threshold number
  render() {
    let filtered = _.filter(this.props.dict, (obj) => {
      return obj['normScore'] <= this.props.threshold;
    });
    
    let sentences = _.map(filtered, (obj) => {
      let currentKey = this.setKey(obj['score']);
      // console.log(currentKey);
      this.tmp.push(currentKey);
      return(
        <span 
          id={obj['score']}
          key={obj['score']}
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
