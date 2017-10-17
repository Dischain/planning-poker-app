'use strict';

import React, { Component } from 'react';
import { connect } from 'react-redux';

import Nav from './Nav.js';
import Footer from './Footer.js';

class Layout extends Component {
  render() {
    return (
      <div className='wrapper'>
        <Nav 
          loggedIn = {this.props.loggedIn}
          sendingLogoutRequest = {this.props.sendingLogoutRequest}
          location={this.props.location} 
          dispatch={this.props.dispatch}
        />
        {React.cloneElement(this.props.children)}
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

export default connect(mapStateToProps)(Layout);