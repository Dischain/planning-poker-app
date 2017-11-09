'use strict';

import React, { Component } from 'react';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';

import VotationCard from './VotationCard.js';
import UserCard from './UserCard.js';

import {
  DEFAULT_PAGINATION_LIMIT,
  DEFAULT_PAGINATION_OFFSET,
  DATALIST_VIEW_USER,
  DATALIST_VIEW_VOTATIONS
} from '../constants/commonConstants.js';

class DataList extends Component {
  componentDidMount() {
    window.addEventListener('scroll', this.onScroll, false);
    if (this.props.currentView === DATALIST_VIEW_VOTATIONS) {
      // fetch votaions
      // in fetchVotations action set new paginationOffset
    }
  }

  render() {
    let items; 
    //if (this.props.currentView === '') {
      if (this.props.currentView === DATALIST_VIEW_VOTATIONS) {
        items = this.props.votations.map(item => {
          return (
            <VotationCard
              name = {item.name}
              desc = {item.desc}
              votes = {item.votes}
              creatordata = {item.creatordata}
            />
          );
        });
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
}

// default for /users/:id - user`s votations
// default for /dashboard - last votations