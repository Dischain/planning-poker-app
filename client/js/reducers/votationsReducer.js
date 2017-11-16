'use strict';

import {
  CHANGE_SEARCH_VOTATIONS_VALUE,
  CHANGE_FILTER_VOTATIONS_VALUE,
  
  CHANGE_NV_STATE_TITLE,
  CHANGE_NV_STATE_DESC,
  SET_NV_PARTICIPANTS,

  ALL, OWNER_ONLY, OWNER_PARTICIPATED
} from '../constants/votationsConstants.js';

const assign = Object.assign;

const initialState = {
  searchVotationsValue: '',
  filterVotationsValue: ALL,

  nvTitle: '',
  nvDescription: '',
  nvParticipants: []
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
    case CHANGE_NV_STATE_TITLE: 
      return assign({}, state, {
        nvTitle: action.title
      });
    case CHANGE_NV_STATE_DESC: 
      return assign({}, state, {
        nvDescription: action.description
      });   
    case SET_NV_PARTICIPANTS:
      return assign({}, state, {
        nvParticipants: action.participants
      });
    default:
      return state;
  }
}