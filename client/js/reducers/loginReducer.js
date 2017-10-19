import { 
  SET_AUTH, 
  CHANGE_LOGIN_FORM, 
  SENDING_LOGIN_REQUEST,
  SENDING_LOGOUT_REQUEST,
  SET_LOGIN_ERROR,
  SET_LOGIN_FORM_VALID,
  SET_LOGIN_FORM_ERROR_MESSAGES
} from '../constants/loginConstants.js';

const assign = Object.assign;

const initialState = {
  loginFormState: {
    email: '',
    password: ''
  },
  sendingLoginRequest: false,
  sendingLogoutRequest: false,
  loginFormErrorMessages: {
    email: '',
    password: ''
  },
  loginError: '',
  isLoginFormValid: false,
  loggedIn: false
};

export default function loginReducer(state = initialState, action) {
  switch(action.type) {
    case SET_AUTH:
      return assign({}, state, {
        loggedIn: action.authState
      });
      break;
    case CHANGE_LOGIN_FORM:
      return assign({}, state, {
        loginFormState: action.newState
      });
      break;
    case SENDING_LOGIN_REQUEST:
      return assign({}, state, {
        sendingLoginRequest: action.sending
      });
      break;
    case SENDING_LOGOUT_REQUEST:
      return assign({}, state, {
        sendingLogoutRequest: action.sending
      });
      break;
    case SET_LOGIN_FORM_ERROR_MESSAGES:
      return assign({}, state, {
        loginFormErrorMessages: action.message
      });
      break;
    case SET_LOGIN_FORM_VALID:
      return assign({}, state, {
        isLoginFormValid: action.valid
      });
      break;
    case SET_LOGIN_ERROR:
      return assign({}, state, {
        loginError: action.message
      });
      break;
    default:
      return state;
  }
}