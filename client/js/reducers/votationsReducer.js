'use strict';

import {
  CHANGE_SEARCH_VOTATIONS_VALUE
} from '../constants/votationsConstants.js';

const assign = Object.assign;

const initialState = {
  searchVotationsValue: ''
}

export default function votationsReducer(state = initialState, action) {
  switch(action.type) {
    case CHANGE_SEARCH_VOTATIONS_VALUE:
      return assign({}, state, {
        searchVotationsValue: action.searchVotationsValue
      });
    default:
      return state;
  }
}