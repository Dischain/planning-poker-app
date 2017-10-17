'use strict';

import { SET_USER, REMOVE_USER } from '../constants/userConstants.js';

export function setUser(userData) {
  return { type: SET_USER, userData };
}

export function removeUser() {
  return { type: REMOVE_USER, userData: null };
}