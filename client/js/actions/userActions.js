'use strict';

import { SET_USER, REMOVE_USER } from '../constants/userConstants.js';

export function storeUser(userData) {
  return (dispatch) => {
    dispatch(setUser(userData));
    console.log('user actions: store user');
    console.log(userData)
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
    const user = JSON.parse(sessionStorage.getItem('user'));

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