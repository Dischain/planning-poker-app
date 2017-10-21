'use strict';

import { SET_USER, REMOVE_USER } from '../constants/userConstants.js';
import { setAuthState } from './loginActions.js';

export function storeUser(userData) {
  return (dispatch) => {
    dispatch(setUser(userData));

    sessionStorage.setItem('user', JSON.stringify(userData));
  }
}

export function clearUser() {
  return (dispatch) => {
    dispatch(removeUser());

    sessionStorage.setItem('user', JSON.stringify(
      { name: '', email: '', id: '', avatar: '' }
    ));
  }
}

export function fetchUser() {
  return (dispatch) => {
    let user = JSON.parse(sessionStorage.getItem('user'));

    if (user === null) {
      user = { name: '', email: '', id: '', avatar: '' }
    }

    if (user.id !== '') {
      dispatch(setAuthState(true));
    }

    dispatch(setUser(user));
  }
}

export function setUser(userData) {
  return { type: SET_USER, userData };
}

export function removeUser() {
  return { 
    type: REMOVE_USER, 
    userData: { name: '', email: '', id: '', avatar: '' }
  };
}