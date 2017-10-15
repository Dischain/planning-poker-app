import React, { Component } from 'react';
import ReactDOM from 'react-dom';

import Bla from './component.js';

import '../css/main.css';

class Test extends Component {
  render() {
    return (
      <div>
        <Bla/>
        <p>Hello, bitches</p>
      </div>
    );
  }
}

ReactDOM.render(<Test/>, document.getElementById('app'));