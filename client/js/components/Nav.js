'use strict';

import React, { Component } from 'react';
import { Link } from 'react-router';
import LoadingButton from './LoadingButton.js';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { logout } from '../actions/loginActions';

class Nav extends Component {
  render() {
    const navBtns = this.props.loggedIn ? (
      <div>
        <Link to='/dashboard' className='btn btn--dash btn--nav'>Dashboard</Link>
        {this.props.sendingLogoutRequest ? (
          <LoadingButton className='btn--nav' btnText = {'Login'}/>
        ) : (
          <a href='#' 
            className='btn btn--login btn--nav' 
            onClick={this._logout.bind(this)}>Logout
          </a>
        )}
      </div>
    ) : (
      <div>
        <Link to='/register' className='btn btn--login btn--nav'>Register</Link>
        <Link to='/login' className='btn btn--login btn--nav'>Login</Link>
      </div>
    );
    return (
      <div className = 'nav'>
        <div className='nav__wrapper'>
          <Link to='/' className='nav__logo-wrapper'><h1 className='nav__logo'>Login&nbsp;Flow</h1></Link>
          { navBtns }
        </div>
      </div>
    );
  }

  _logout(event) {
    event.preventDefault();
    this.props.logout();
  }
}

function mapStateToProps({ loginReducer }) {
  return {
    sendingLogoutRequest: loginReducer.sendingLogoutRequest,
    loggedIn: loginReducer.loggedIn
  };
}

function mapDispatchToProps(dispatch) {
  return {
    dispatch: func => dispatch(func),
    logout: userData => dispatch(logout())
  }
}

Nav.prototypes = {
  loggedIn: PropTypes.bool.isRequired,
  sendingLogoutRequest: PropTypes.bool.isRequired,
  logout: PropTypes.func.isRequired
}

export default connect(mapStateToProps, mapDispatchToProps)(Nav);