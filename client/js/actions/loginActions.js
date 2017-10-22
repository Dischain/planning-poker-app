'use strict';

import { 
  SET_AUTH, 
  CHANGE_LOGIN_FORM, 
  SENDING_LOGIN_REQUEST,
  SENDING_LOGOUT_REQUEST,
  SET_LOGIN_ERROR,
  SET_LOGIN_FORM_VALID,
  SET_LOGIN_FORM_ERROR_MESSAGES,  
} from '../constants/loginConstants.js';
import commonErrors from '../constants/commonConstants.js';
import { API_BASE_PATH } from '../../config.js';
import { storeUser, clearUser } from './userActions.js';
import { setErrorMessage } from './commonActions.js';
import { browserHistory } from 'react-router';

export function login({ email, password }) {
  return (dispatch, getState) => {
    dispatch(sendingLoginRequest(true));

    let { isLoginFormValid } = getState().loginReducer;

    if (!isLoginFormValid) {
      dispatch(sendingLoginRequest(false));
      return;
    }

    let _status;

    return fetch(API_BASE_PATH + '/login', {
      headers: {
        'Accept': 'application/json, text/plain, */*',
        'Content-Type': 'application/json'
      },
      mode: 'cors',
      method: 'POST',
      credentials: 'include',
      body: JSON.stringify({ email, password })
    })
    .then((res) => {
      _status = res.status;
      return res.json();
    })
    .then((json) => { 
        let data = JSON.parse(json);

        if (_status === 200) {
          dispatch(storeUser(data));
          dispatch(setAuthState(true));
          browserHistory.push('/dashboard');
          dispatch(changeForm({ email: '', email: '' }));
        } else if (_status === 400) {
          dispatch(setErrorMessage('login', data.message));
        } else {
          dispatch(setErrorMessage('login', commonErrors.ERROR));
        }
        dispatch(sendingLoginRequest(false));
    })
    .catch((err) => {
        dispatch(setErrorMessage('login', commonErrors.ERROR));
        dispatch(sendingLoginRequest(false));
    });
  }
}

export function logout() {
  return (dispatch) => {
    dispatch(sendingLogoutRequest(true));
    return fetch(API_BASE_PATH + '/logout', {      
      mode: 'cors',
      method: 'GET',
      credentials: 'include',
    })
    .then((res) => {
      if (res.status === 200) {
        dispatch(sendingLogoutRequest(false));
        dispatch(setAuthState(false));
        dispatch(clearUser());

        browserHistory.push('/');
      } else {
        // ?
      }
    })
  }
}

export function sendingLoginRequest(sending) {
  return { type: SENDING_LOGIN_REQUEST, sending };
}

export function sendingLogoutRequest(sending) {
  return { type: SENDING_LOGOUT_REQUEST, sending };
}

export function setAuthState(authState) {
  return { type: SET_AUTH, authState };
}

export function setLoginFormErrorMessages(message) {
  return { type: SET_LOGIN_FORM_ERROR_MESSAGES, message };
}

export function setLoginError(message) {
  return { type: SET_LOGIN_ERROR, message };
}

export function setLoginFormIsValid(valid) {
  return { type: SET_LOGIN_FORM_VALID, valid };
}

export function changeForm(newState) {
  return { type: CHANGE_LOGIN_FORM, newState };
}