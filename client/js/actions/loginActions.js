'use strict';

import { 
  SET_AUTH, 
  CHANGE_LOGIN_FORM, 
  SENDING_LOGIN_REQUEST,
  SENDING_LOGOUT_REQUEST,
  SET_LOGIN_ERROR,
  SET_LOGIN_FORM_VALID,
  SET_LOGIN_FORM_ERROR_MESSAGE,  
} from '../constants/loginConstants.js';
import commonErrors from '../constants/commonConstants.js';
import { API_BASE_PATH } from '../../config.js';
import { setUser, removeUser } from './userActions.js';
import { browserHistory } from 'react-router';

export function login({ email, password }) {
  return (dispatch) => {
    dispatch(sendingLoginRequest(true));

    let isValid;
    _validateLoginForm({ email, password }, (valid, field, info) => {
       if (!valid) {
         dispatch(setLoginFormErrorMessage({ field, info }));
       }
       
       isValid = valid;
    });

    if (!isValid) {
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
      body: JSON.stringify({ email: email, password: password })
    })
    .then((res) => {
      _status = res.status;
      return res.json();
    })
    .then((json) => { 
        let data = JSON.parse(json);

        if (_status === 200) {
          dispatch(setUser(data));
          dispatch(setAuthState(true));
          browserHistory.push('/dashboard');
          dispatch(changeForm({ email: '', email: '' }));
        } else if (_status === 400) {
          dispatch(setLoginError(data.message));
        } else {
          dispatch(setLoginError(commonErrors.ERROR));
        }
        dispatch(sendingLoginRequest(false));
    })
    .catch((err) => {
        dispatch(setLoginError(commonErrors.ERROR));
        dispatch(sendingLoginRequest(false));
    });
  }
}

export function logout() {
  return (dispatch) => {
    dispatch(sendingLogoutRequest(true));
    return fetch(API_BASE_PATH + '/logout', {
      headers: {
        'Accept': 'application/json, text/plain, */*',
        'Content-Type': 'application/json'
      },
      mode: 'cors',
      method: 'POST',
      credentials: 'include',
    })
    .then((res) => {
      if (res.status === 200) {
        dispatch(sendingLogoutRequest(false));
        dispatch(setAuthState(false));
        dispatch(removeUser());
        browserHistory.replace(null, '/');
      } else {
        // ?
      }
    })
  }
}

function _validateLoginForm(data, cb) {
  if (data.email === '')
    return cb(false, 'email', 'Empty email');
  else if (data.password === '')
    return cb(false, 'password', 'Empty password');
  else 
    return cb(true);
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

export function setLoginFormErrorMessage(message) {
  return { type: SET_LOGIN_FORM_ERROR_MESSAGE, message };
}

export function setLoginError(message) {
  return { type: SET_LOGIN_ERROR, message };
}

export function setIsLoginFormValid(valid) {
  return { type: SET_LOGIN_FORM_VALID, valid };
}

export function changeForm(newState) {
  return { type: CHANGE_LOGIN_FORM, newState };
}