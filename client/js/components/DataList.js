'use strict';

import React, { Component } from 'react';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';

import VotationCard from './VotationCard.js';
import UserCard from './UserCard.js';

import { 
  getVotations, 
  getUserVotations, 
  searchVotations 
} from '../actions/votationsActions.js';
import { searchUsers } from '../actions/userActions.js';

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

class DataList extends Component {
  componentDidMount() {
    window.addEventListener('scroll', this.onScroll, false);

    const { 
      location, getVotations, getUserVotations,
      setCurView, setPaginationOffset,
      currentPaginationOffset
    } = this.props;

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
    let items; 
    //if (this.props.currentView === '') {
      /*if (this.props.currentView === DATALIST_VIEW_VOTATIONS) {
        items = this.props.votations.map(item => {
          return (
            <VotationCard
              name = {item.name}
              desc = {item.desc}
              votes = {item.votes}
              creatordata = {item.creatordata}
            />
          );
        });*/
      }
    //}
    return (
      <div>
        <ul>

        </ul>
      </div>
    );
  }

  onScroll() {
    if ((window.innerHeight + window.scrollY) >= (document.body.offsetHeight - 400)) {
      // start pagination
    }
  }
}

DataList.prototypes = {
  currentView: PropTypes.string.isRequired,
  currentPaginationOffset: PropTypes.number.isRequired,
  votations: PropTypes.array.isRequired,
  users: PropTypes.array.isRequired,
  sendingPaginationRequest: PropTypes.bool.isRequired
};

// default for /users/:id - user`s votations
// default for /dashboard - last votations