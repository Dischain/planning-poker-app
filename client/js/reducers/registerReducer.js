'use strict';

import { 
  CHANGE_REGISTER_FORM, 
  SENDING_REGISTER_REQUEST,
  SET_REGISTER_ERROR,
  SET_REGISTER_FORM_VALID,
  SET_REGISTER_FORM_ERROR_MESSAGES
} from '../constants/registerConstants.js';

const assign = Object.assign;

const initialState = {
  registerFormState: {
    name: '',
    email: '',
    password1: '',
    password2: '',
    avatar: ''
  },
  sendingRegisterRequest: false,
  registerError: '',
  isRegisterFormValid: false,
  registerFormErrorMessages: {
    name: '',
    email: '',
    password1: '',
    password2: ''
  }
};

export default function registerReducer(state = initialState, action) {
  switch(action.type) {
    case CHANGE_REGISTER_FORM:
      return assign({}, state, {
        registerFormState: action.newState
      });      
    case SENDING_REGISTER_REQUEST:
      return assign({}, state, {
        sendingRegisterRequest: action.sending
      });      
    case SET_REGISTER_FORM_ERROR_MESSAGES:
      return assign({}, state, {
        registerFormErrorMessages: action.messages
      });      
    case SET_REGISTER_FORM_VALID:
      return assign({}, state, {
        isRegisterFormValid: action.valid
      });          
    case SET_REGISTER_ERROR:
      return assign({}, state, {
        registerError: action.message
      });      
    default:
      return state;
  }
}