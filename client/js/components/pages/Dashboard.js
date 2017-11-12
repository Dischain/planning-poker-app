'use strict';

import React, { Component } from 'react';
import { connect } from 'react-redux';

import SideBar from '../SideBar.js';
import DataList from '../DataList.js';

import {
  DEFAULT_DATALIST_USER,
  DEFAULT_DATALIST_DASHBOARD
} from '../../constants/commonConstants.js';

class Dashboard extends Component {
  render() {
    return (
      <div className = 'container clearfix'>
        <SideBar />
        <div className = 'content float-left'>
          <div className = 'position-relative'>
            <DataList defaultView = {DEFAULT_DATALIST_DASHBOARD}/>
          </div>
        </div>
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