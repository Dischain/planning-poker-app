'use strict';

import React, { Component } from 'react';
import { Link } from 'react-router';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';

import LoadingButton from './LoadingButton.js';
import SearchBox from './SearchBox.js';

import { logout } from '../actions/loginActions';
import { 
  searchUsers, 
  changeSearchUsersValue,
} from '../actions/userActions.js';
import {
  setPaginationOffset
} from '../actions/dataListActions.js';

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
          className = 'nav__item'
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

    this.props.dispatch(changeSearchUsersValue(value));
  }

  _onSubmitUsersSearch(event) {
    event.preventDefault();

    this.props.setPaginationOffset(DEFAULT_PAGINATION_OFFSET);
    this.props.searchUsers({
      user: this.props.searchUsersValue,
      limit: DEFAULT_PAGINATION_LIMIT,
      offset: DEFAULT_PAGINATION_OFFSET
    });
  }
}

function mapStateToProps({ loginReducer, userReducer }) {
  return {
    sendingLogoutRequest: loginReducer.sendingLogoutRequest,
    loggedIn: loginReducer.loggedIn,
    searchUsersValue: userReducer.searchUsersValue
  };
}

function mapDispatchToProps(dispatch) {
  return {
    dispatch: func => dispatch(func),
    logout: userData => dispatch(logout()),
    searchUsers: data => dispatch(searchUsers(data)),
    changeSearchUsersValue: value => dispatch(changeSearchUsersValue(value)),
    setPaginationOffset: offset => dispatch(setPaginationOffset(offset))
  };
}

Nav.prototypes = {
  loggedIn: PropTypes.bool.isRequired,
  sendingLogoutRequest: PropTypes.bool.isRequired,
  logout: PropTypes.func.isRequired,
  searchUsers: PropTypes.func.isRequired
}

export default connect(mapStateToProps, mapDispatchToProps)(Nav);