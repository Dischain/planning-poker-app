'use strict';

import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';

import SearchBox from './SearchBox.js';

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

class UserSelector extends Component {
  render() {
    return (      
      <div className="usr-selector clearfix">
        <div className="usr-selector__selector float-left">
          <SearchBox
            className = 'search-box-sm'
            style = {{ width: '400px' }}
            type = {'text'}
            id = {'usersSeatchText'}
            value = {this.props.usersSearchBoxValue}
            placeholder = {'Search users'}
            onChange = {this._onChangeUsersSearchInput.bind(this)}
            onSubmit = {this._onSubmitUsersSearch.bind(this)}
          />
          <ul >
            <li className= 'user-card-xsm usr-selector__item clearfix'>
              <img className = 'user-card-xsm__avatar float-left' 
                src = "./ava.png" width='45' height='45'></img>                  
              <div className='user-card-xsm__name float-left'>
                <a href="#">Dischain</a>
              </div>
            </li>
            <li>{this.props.currentViewData}</li>
          </ul>
        </div>
        <div className="usr-selector__selected float-left">
          <div className="user-card-xsm clearfix">
            <img className = 'user-card-xsm__avatar float-left' 
              src = "./ava.png" width='45' height='45'></img>                  
            <div className='user-card-xsm__name float-left'>
              <a href="#">Dischain</a>
            </div>
          </div>
        </div>
      </div>
    );
  }

  _onChangeUsersSearchInput(event) {
    const value = event.target.value;

    this.props.changeSearchUsersValue(value);
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

function mapStateToProps({ userReducer, dataListReducer }) {
  return {
    searchUsersValue: userReducer.searchUsersValue,
    currentViewData: dataListReducer.currentViewData
  };
}

function mapDispatchToProps(dispatch) {
  return {
    dispatch: func => dispatch(func),
    searchUsers: data => dispatch(searchUsers(data)),
    changeSearchUsersValue: value => dispatch(changeSearchUsersValue(value)),
    setPaginationOffset: offset => dispatch(setPaginationOffset(offset))
  };
}

export default connect(mapStateToProps, mapDispatchToProps)(UserSelector);