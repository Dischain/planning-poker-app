'use strict';

import React, { Component } from 'react';
import { connect } from 'react-redux';

import  SideBar from '../SideBar.js';

class Dashboard extends Component {
  render() {
    return (
      <div className = 'container clearfix'>
        <SideBar />
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