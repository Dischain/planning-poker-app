'use strict';

import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';

import { STATIC_SERVER_BASE_PATH } from '../../config.js';

class SideBar extends Component {
  render() {
    const { name, email, avatar } = this.props.userData;
    console.log(avatar);
    return (
      <div className = 'side-bar float-left'>
        <img 
          className = 'side-bar__avatar' 
          src={STATIC_SERVER_BASE_PATH + '/' + avatar} 
          width="214" height="214">
        </img>
        <div className = "side-bar__name"><span>{name}</span></div>
        <div className = "sb-details">
          <span className = "sb-details__email"><a href={email}>{email}</a></span>
        </div>
      </div>
    );
  }
}

function mapStateToProps({ userReducer }) {
  return {
    userData: userReducer.userData    
  };
}

SideBar.prototypes = {
  userData: PropTypes.object.isRequired
}

export default connect(mapStateToProps)(SideBar);