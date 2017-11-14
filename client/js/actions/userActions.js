'use strict';

import { 
  SET_USER, 
  REMOVE_USER,
  CHANGE_SEARCH_USERS_VALUE
} from '../constants/userConstants.js';
import {
  DATA_LIST_USERS_SEARCH_VIEW
} from '../constants/dataListConstants.js'
import {
  DEFAULT_PAGINATION_OFFSET,
  DEFAULT_PAGINATION_LIMIT
} from '../constants/commonConstants.js';

import { setAuthState } from './loginActions.js';
import { 
  setCurView, 
  setCurViewData,
  clearCurViewData,
  setCurMainQueryValue,
  setPaginationOffset,
  sendingPaginationRequest,
  sendingSearchRequest
} from '../actions/dataListActions.js';

import { API_BASE_PATH } from '../../config.js';
import { browserHistory } from 'react-router';
import { constructQuery } from '../util/query.js';

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

export function searchUsers(data) {
  return (dispatch, getState) => {    
    if (getState().currentView !== DATA_LIST_USERS_SEARCH_VIEW) {
      dispatch(clearCurViewData([]));
      dispatch(setCurView(DATA_LIST_USERS_SEARCH_VIEW));
    }

    if (data.offset !== DEFAULT_PAGINATION_OFFSET) {
      dispatch(sendingPaginationRequest(true));
    } else {
      const { limit, offset, ...rest } = data;
      dispatch(setCurMainQueryValue(rest));
      dispatch(sendingSearchRequest(true));
    }
    
    dispatch(setPaginationOffset(data.offset + DEFAULT_PAGINATION_LIMIT));

    let _status;

    fetch(API_BASE_PATH + '/users' + constructQuery(data), {
      headers: {
        'Accept': 'application/json, text/plain, */*',
        'Content-Type': 'application/json'
      },
      mode: 'cors',
      method: 'GET',
      credentials: 'include',
    })
    .then(res => {
      _status = res.status;
      return res.json();
    })
    .then((json) => { 
      let result = JSON.parse(json);
      console.log(result);
      if (_status === 200) {
        dispatch(setCurViewData(result));

      } else if (_status === 401) {
        browserHistory.push('/login');
      } else {
        // TODO
      }
      dispatch(sendingPaginationRequest(false));
      dispatch(sendingSearchRequest(true));
    })
    .catch((err) => {
      dispatch(sendingPaginationRequest(false));
      dispatch(sendingSearchRequest(true));
    });
  };
}

export function changeSearchUsersValue(value) {
  return { type: CHANGE_SEARCH_USERS_VALUE, searchUsersValue: value };
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