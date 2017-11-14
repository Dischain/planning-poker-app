'use strict';

import {
  CHANGE_SEARCH_VOTATIONS_VALUE,
  CHANGE_FILTER_VOTATIONS_VALUE,

  ALL, OWNER_ONLY, OWNER_PARTICIPATED
} from '../constants/votationsConstants.js';

const assign = Object.assign;

const initialState = {
  searchVotationsValue: '',
  filterVotationsValue: ALL
};

export default function votationsReducer(state = initialState, action) {
  switch(action.type) {
    case CHANGE_SEARCH_VOTATIONS_VALUE:
      return assign({}, state, {
        searchVotationsValue: action.searchVotationsValue
      });
    case CHANGE_FILTER_VOTATIONS_VALUE:
      return assign({}, state, {
        filterVotationsValue: action.filterVotationsValue
      });
    default:
      return state;
  }
}