'use strict';

import { 
  CHANGE_REGISTER_FORM, 
  SENDING_REGISTER_REQUEST,
  SET_REGISTER_ERROR,
  SET_REGISTER_FORM_VALID,
  SET_REGISTER_FORM_ERROR_MESSAGES
} from '../constants/registerConstants.js';
import commonErrors from '../constants/commonConstants.js';
import { API_BASE_PATH } from '../../config.js';
import { setErrorMessage } from './commonActions.js';
import { upload } from '../util/upload.js';
import { browserHistory } from 'react-router';

export function register(userData) {
  return (dispatch, getState) => {
    dispatch(sendingRegisterRequest(true));

    let { registerReducer } = getState()
      , { isRegisterFormValid } = registerReducer;

    if (!isRegisterFormValid) {
      dispatch(sendingRegisterRequest(false));
      return;
    }

    let _status;

    return fetch(API_BASE_PATH + '/register', {
      headers: {
        'Accept': 'application/json, text/plain, */*',
        'Content-Type': 'application/json'
      },
      mode: 'cors',
      method: 'POST',
      credentials: 'include',
      body: JSON.stringify({ 
        name: userData.name,
        email: userData.email, 
        password: userData.password2,
        avatar: userData.avatar
      })
    })
    .then((res) => {
      _status = res.status;
      return res.json();
    })
    .then((json) => {
      let data = JSON.parse(json);

      if (_status === 201) {        
        dispatch(setRegisterError(''))
        browserHistory.push('/login');
      } else if (_status === 409) {
        dispatch(setErrorMessage('register', data.message));
      } else {
        dispatch(setErrorMessage('login', commonErrors.ERROR));
      }

      return upload('avatar', registerReducer.registerFormState.avatar);
    })
    .then(() => {
      dispatch(sendingRegisterRequest(false));
    })
    .catch((err) => {
      dispatch(setErrorMessage('login', commonErrors.ERROR));
      dispatch(sendingRegisterRequest(false));
    });
  }
}

export function sendingRegisterRequest(sending) {
  return { type: SENDING_REGISTER_REQUEST, sending };
}

export function setRegisterFormErrorMessages(messages) {
  return { type: SET_REGISTER_FORM_ERROR_MESSAGES, messages };
}

export function setRegisterError(message) {
  return { type: SET_REGISTER_ERROR, message };
}

export function setRegisterFormIsValid(valid) {
  return { type: SET_REGISTER_FORM_VALID, valid };
}

export function changeForm(newState) {
  return { type: CHANGE_REGISTER_FORM, newState };
}