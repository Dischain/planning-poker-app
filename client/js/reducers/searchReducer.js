'use strict';

import {
  CHANGE_USERS_SEARCH_BOX,
  CHANGE_VOTATIONS_SEARCH_BOX,
  CHANGE_VOTATIONS_FILTER,
  SENDING_USERS_SEARCH_REQUEST,
  SENDING_VOTATIONS_SEARCH_REQUEST,
  SET_USERS_SEARCH_RESULT,
  SET_VOTATIONS_SEARCH_RESULT
} from '../constants/searchConstants.js';

const assign = Object.assign;

const initialState = {
  usersSearchBoxValue: '',
  votationsSearchBoxValue: '',
  votationsSearchFilterValue: '',
  sendingUsersSearchRequest: false,
  sendingVotationsSearchRequest: false,
  usersSearchResult: [],
  votationsSearchResult: []
};

export default function searchReducer(state = initialState, action) {
  switch(action.type) {
    case CHANGE_USERS_SEARCH_BOX:
      return assign({}, state, {
        usersSearchBoxValue: action.value
      });
    case CHANGE_VOTATIONS_SEARCH_BOX:
      return assign({}, state, {
        votationsSearchBoxValue: action.value
      });
    case CHANGE_VOTATIONS_FILTER:
      return assign({}, state, {
        votationsSearchFilterValue: value
      });
    case SENDING_USERS_SEARCH_REQUEST:
      return assign({}, state, {
        sendingUsersSearchRequest: action.sending
      });
    case SENDING_VOTATIONS_SEARCH_REQUEST:
      return assign({}, state, {
        sendingVotationsSearchRequest: action.sending
      });
    case SET_USERS_SEARCH_RESULT: {
      let newResult = state.usersSearchResult.concat(action.data);
      return assign({}, state, {
        usersSearchResult: newResult
      });
    }
    case SET_VOTATIONS_SEARCH_RESULT: {
      let newResult = state.votationsSearchResult.concat(action.data);
      return assign({}, state, {
        votationsSearchResult: newResult
      });
    }
    default:
      return state;
  }
}