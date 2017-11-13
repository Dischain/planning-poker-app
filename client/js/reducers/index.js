'use strict';

import { combineReducers } from "redux";
import userReducer from './userReducer.js';
import loginReducer from './loginReducer.js';
import registerReducer from './registerReducer.js';
import searchReducer from './searchReducer.js';
import dataListReducer from './datalistReducer.js';
import votationsReducer from './votationsReducer.js';

export default combineReducers({
  userReducer,
  loginReducer,
  registerReducer,
  searchReducer,
  dataListReducer,
  votationsReducer
});