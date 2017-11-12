'use strict';

import React, { Component } from 'react';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';

import Nav from './Nav.js';
import Footer from './Footer.js';

class Layout extends Component {
  render() {
    const { children, ...otherProps } = this.props;
    
    return (
      <div className='wrapper'>
        <Nav 
          loggedIn = {this.props.loggedIn}
          sendingLogoutRequest = {this.props.sendingLogoutRequest}
          location={this.props.location} 
          dispatch={this.props.dispatch}
        />
        {React.cloneElement(children, otherProps)}
        <Footer />
      </div>
    );
  }
}

const mapStateToProps = (state) => {
  return {
    loggedIn: state.loggedIn
  };
}

Layout.prototypes = {
  loggedIn: PropTypes.bool.isRequired,
  sendingLogoutRequest: PropTypes.bool.isRequired,
}

export default connect(mapStateToProps)(Layout);