'use strict';

import React, { Component } from 'react';
import { Link } from 'react-router';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';

import LoadingButton from './LoadingButton.js';
import SearchBox from './SearchBox.js';

import { logout } from '../actions/loginActions';
import { searchUsers, changeUsersSearchBox } from '../actions/searchActions.js';

import { 
  DEFAULT_PAGINATION_LIMIT, 
  DEFAULT_PAGINATION_OFFSET
} from '../constants/commonConstants.js';

class Nav extends Component {
  render() {
    const navBtns = this.props.loggedIn ? (
      <div>
        <Link to='/dashboard' className='btn nav__item'>
          Dashboard
        </Link>
        <SearchBox 
          style = {{ width: '400px' }}
          type = {'text'}
          id = {'usersSeatchText'}
          value = {this.props.usersSearchBoxValue}
          placeholder = {'Search users'}
          onChange = {this._onChangeUsersSearchInput.bind(this)}
          onSubmit = {this._onSubmitUsersSearch.bind(this)}
        />
        {this.props.sendingLogoutRequest ? (
          <LoadingButton className='nav__item' btnText = {'Login'}/>
        ) : (
          <a href='#' 
            className='btn nav__item' 
            onClick={this._logout.bind(this)}>Logout
          </a>
        )}
      </div>
    ) : (
      <div>
        <Link to='/register' className='btn nav__item'>Register</Link>
        <Link to='/login' className='btn nav__item'>Login</Link>
      </div>
    );
    return (
      <div className = 'nav'>
        <div className='nav__wrapper'>
          <Link to='/' className='nav__logo-wrapper'><h1 className='nav__logo'>PP</h1></Link>
          { navBtns }
        </div>
      </div>
    );
  }

  _logout(event) {
    event.preventDefault();
    this.props.logout();
  }

  _onChangeUsersSearchInput(event) {
    const value = event.target.value;

    this.props.dispatch(changeUsersSearchBox(value));
  }

  _onSubmitUsersSearch(event) {
    event.preventDefault();

    this.props.searchUsers(
      this.props.usersSearchBoxValue, DEFAULT_PAGINATION_LIMIT, DEFAULT_PAGINATION_OFFSET);
  }
}

function mapStateToProps({ loginReducer, searchReducer }) {
  return {
    sendingLogoutRequest: loginReducer.sendingLogoutRequest,
    loggedIn: loginReducer.loggedIn,
    usersSearchBoxValue: searchReducer.usersSearchBoxValue,
    sendingUsersSearchRequest: searchReducer.sendingUsersSearchRequest
  };
}

function mapDispatchToProps(dispatch) {
  return {
    dispatch: func => dispatch(func),
    logout: userData => dispatch(logout()),
    searchUsers: (text, limit, offset) => dispatch(searchUsers(text, limit, offset))
  }
}

Nav.prototypes = {
  loggedIn: PropTypes.bool.isRequired,
  sendingLogoutRequest: PropTypes.bool.isRequired,
  logout: PropTypes.func.isRequired,
  searchUsers: PropTypes.func.isRequired
}

export default connect(mapStateToProps, mapDispatchToProps)(Nav);