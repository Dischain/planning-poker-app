import { 
  SET_AUTH, 
  CHANGE_LOGIN_FORM, 
  SENDING_LOGIN_REQUEST,
  SENDING_LOGOUT_REQUEST,
  SET_LOGIN_ERROR,
  SET_LOGIN_FORM_VALID,
  SET_LOGIN_FORM_ERROR_MESSAGE
} from '../constants/loginConstants.js';

const assign = Object.assign;

const initialState = {
  loginFormState: {
    email: '',
    password: ''
  },
  sendingLoginRequest: false,
  sendingLogoutRequest: false,
  loginFormErrorMessage: {
    field: '',
    message: ''
  },
  loginError: '',
  isLoginFormValid: false,
  loggedIn: false
};

export default function loginReducer(state = initialState, action) {
  switch(action.type) {
    case SET_AUTH: 
      return assign({}, state, {
        loggedIn: action.newState
      });
      break;
    case CHANGE_LOGIN_FORM:
      return assign({}, state, {
        loginFormState: action.newState
      });
      break;
    case SENDING_LOGIN_REQUEST:
      return assign({}, state, {
        sendingLoginRequest: action.newState
      });
      break;
    case SENDING_LOGOUT_REQUEST:
      return assign({}, state, {
        sendingLogoutRequest: action.newState
      });
      break;
    case SET_LOGIN_FORM_ERROR_MESSAGE:
      return assign({}, state, {
        loginFormErrorMessage: action.newState
      });
      break;
    case SET_LOGIN_FORM_VALID:
      return assign({}, state, {
        isLoginFormValid: action.newState
      });
      break;
    case SET_LOGIN_ERROR:
      return assign({}, state, {
        loginError: action.newState
      });
      break;
    default:
      return state;
  }
}