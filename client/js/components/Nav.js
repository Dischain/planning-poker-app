'use strict';

import React, { Component } from 'react';
import { Link } from 'react-router';
import PropTypes from 'prop-types';
import { logout } from '../actions/loginActions';

export default class Nav extends Component {
  render() {
    return (
      <div className = 'nav'>
        Navbar {this.props.loggedIn}
      </div>
    );
  }
}

Nav.prototypes = {
  loggedIn: PropTypes.bool.isRequired,
  sendingLogoutRequest: PropTypes.bool.isRequired
}