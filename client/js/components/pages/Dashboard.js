'use strict';

import React, { Component } from 'react';
import { connect } from 'react-redux';

class Dashboard extends Component {
  render() {
    return (
      <div>
        <h2>Dashboard</h2>
      </div>
    );
  }
}

function mapStateToProps({ loginReducer }) {
  return {
    loggedIn: loginReducer.loggedIn
  };
}

export default connect(mapStateToProps)(Dashboard);