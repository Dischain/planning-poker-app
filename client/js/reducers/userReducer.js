'use strict';

import { SET_USER, REMOVE_USER } from '../constants/userConstants.js';

const initialState = {
  userData: {
    name: '',
    email: '',
    id: '',
    avatar: '' 
  }
};

const assign = Object.assign;

export default function userReducer(state = initialState, action) {
  switch(action.type) {
    case SET_USER:
      return assign({}, state, {
        userData: state.newState
      });
    case REMOVE_USER:
      return assign({}, state, {
        userData: state.newState
      });
    default:
      return state;
  }
}