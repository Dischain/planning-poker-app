'use strict';

import { 
  SET_USER, 
  REMOVE_USER,
  CHANGE_SEARCH_USERS_VALUE
} from '../constants/userConstants.js';

const initialState = {
  userData: {
    name: '',
    email: '',
    id: '',
    avatar: '' 
  },
  searchUsersValue: ''
};

const assign = Object.assign;

export default function userReducer(state = initialState, action) {
  switch(action.type) {
    case SET_USER:
      return assign({}, state, {
        userData: action.userData
      });      
    case REMOVE_USER:
      return assign({}, state, {
        userData: action.userData
      });      
    case CHANGE_SEARCH_USERS_VALUE:
      return assign({}, state, {
        searchUsersValue: action.searchUsersValue
      });      
    default:
      return state;
  }
}