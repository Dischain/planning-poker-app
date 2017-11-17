'use strict';

import React, { Component } from 'react';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';

import VotationCard from './VotationCard.js';
import UserCard from './UserCard.js';
import EmptyList from './EmptyList.js';

import { 
  getVotations, 
  getUserVotations, 
  searchVotations 
} from '../actions/votationsActions.js';
import { searchUsers } from '../actions/userActions.js';
import { setCurQueryValue } from '../actions/dataListActions.js';
import {
  DEFAULT_PAGINATION_LIMIT,
  DEFAULT_PAGINATION_OFFSET,
} from '../constants/commonConstants.js';
import {
  DATA_LIST_VOTATIONS_VIEW,
  DATA_LIST_USER_VOTATIONS_VIEW,
  DATA_LIST_VOTATIONS_SEARCH_VIEW,
  DATA_LIST_USERS_SEARCH_VIEW
} from '../constants/dataListConstants.js'
import { browserHistory } from 'react-router';
class DataList extends Component {
  componentDidMount() {
    window.addEventListener('scroll', this.onScroll, false);

    const { 
      getVotations, getUserVotations,
      setCurView, setPaginationOffset,
      currentPaginationOffset
    } = this.props;
    const location = browserHistory.getCurrentLocation().pathname;

    if (location === '/dashboard') {
      getVotations({ 
        offset: DEFAULT_PAGINATION_OFFSET, 
        limit: DEFAULT_PAGINATION_LIMIT
      });
    } else if (/users\/[0-9]+/.test(location)) {
      let creatorId = Number.parseInt(location.split('/')[2]);

      getUserVotations({
        offset: DEFAULT_PAGINATION_OFFSET, 
        limit: DEFAULT_PAGINATION_LIMIT, 
        creatorId 
      });
    }
  }

  render() {
    const { currentView, currentViewData } = this.props;    
    let dataList;
    
    if (currentViewData.length === 0) {
      return ( <EmptyList /> );
    } else {    
      if (currentView === DATA_LIST_VOTATIONS_VIEW ||
          currentView === DATA_LIST_USER_VOTATIONS_VIEW ||
          currentView === DATA_LIST_VOTATIONS_SEARCH_VIEW) {
            console.log('not empty, votations');
        dataList = currentViewData.map((item, i) => {
          return (
            <VotationCard 
              key = { i }
            />
          );
        });
      } else if (currentView === DATA_LIST_USERS_SEARCH_VIEW) {
        console.log('not empty, users');
        dataList = currentViewData.map((item, i) => {
          return (
            <UserCard 
              key = {i}
              id = { item.id }
              name = { item.name }
              avatar = { item.avatar }
            />
          );
        });
      }
      return(
        <ul>
          {dataList}
        </ul>
      );
    }
  }

  onScroll() {
    const { currentPaginationOffset, currentView } = this.props;

    if ((window.innerHeight + window.scrollY) >= (document.body.offsetHeight - 400)) {
      let userId, data = {};
      if (currentView === DATA_LIST_USER_VOTATIONS_VIEW) {
        userId = Number.parseInt(location.split('/')[2]);
        this.props.setCurQueryValue({ userId });
      }

      this.props.dispatchLastRequest(currentView, {
        offset: currentPaginationOffset, 
        limit: DEFAULT_PAGINATION_LIMIT
      });
    }
  }
}

function mapStateToProps({ dataListReducer }) {
  return {
    currentView: dataListReducer.currentView,
    currentViewData: dataListReducer.currentViewData,
    currentPaginationOffset: dataListReducer.currentPaginationOffset
  };
}

function mapDispatchToProps(dispatch) {
  return {
    dispatch: func => dispatch(func),
    dispatchLastRequest: data => dispatch(dispatchLastRequest(data)),
    getVotations: data => dispatch(getVotations(data)),
    getUserVotations: data => dispatch(getUserVotations(data)),
    setCurQueryValue: data => dispatch(setCurQueryValue(data))
  };
}

DataList.prototypes = {
  getVotations: PropTypes.func.isRequired,
  getUserVotations: PropTypes.func.isRequired,
  searchVotations: PropTypes.func.isRequired,

  searchUsers: PropTypes.func.isRequired,

  currentlySendingPaginationReq: PropTypes.bool.isRequired,
  currentView: PropTypes.bool.isRequired,
  currentViewData: PropTypes.bool.isRequired,
  currentPaginationOffset: PropTypes.number.isRequired,
  sendingPaginationRequest: PropTypes.bool.isRequired,  
}

export default connect(mapStateToProps, mapDispatchToProps)(DataList);
