'use strict';

import {
  CHANGE_USERS_SEARCH_BOX,
  CHANGE_VOTATIONS_SEARCH_BOX,
  CHANGE_VOTATIONS_FILTER,
  SENDING_USERS_SEARCH_REQUEST,
  SENDING_VOTATIONS_SEARCH_REQUEST,
  SET_USERS_SEARCH_RESULT,
  SET_VOTATIONS_SEARCH_RESULT
} from '../constants/searchConstants.js';

import { API_BASE_PATH } from '../../config.js';
import { browserHistory } from 'react-router';

export function searchUsers(text, limit, offset) {
  return (dispatch, getState) => {
    dispatch(sendingUsersSearchRequest(true));

    let _status;
    const query = '?user=' + text 
      + '&limit=' + limit
      + '&offset=' + offset;
    
    return fetch(API_BASE_PATH + '/users' + query, {
      headers: {
        'Accept': 'application/json, text/plain, */*',
        'Content-Type': 'application/json'
      },
      mode: 'cors',
      method: 'GET',
      credentials: 'include',
    })
    .then((res) => {
      _status = res.status;
      return res.json();
    })
    .then((json) => {
      let data = JSON.parse(json);

      if (_status === 200) {
        dispatch(setUsersSearchResult(data));
        dispatch(changeUsersSearchBox(''));
      } else if (_status === 401) {
        dispatch(changeUsersSearchBox(''));
        browserHistory.push('/login');
      } else {
        // TODO: handle error
      }
      dispatch(sendingUsersSearchRequest(false));
    })
    .catch((err) => {
      // TODO: handle error
      dispatch(sendingUsersSearchRequest(false));
    });
  }
}

export function changeUsersSearchBox(value) {
  return { type: CHANGE_USERS_SEARCH_BOX, value };
}

export function changeVotationsSearchBox(value) {
  return { type: CHANGE_VOTATIONS_SEARCH_BOX, value };
}

export function changeVotationsFilter(value) {
  return { type: CHANGE_VOTATIONS_FILTER, value };
}

export function sendingUsersSearchRequest(sending) {
  return { type: SENDING_USERS_SEARCH_REQUEST, sending };
}

export function sendingVotationsSearchRequest(sending) {
  return { type: SENDING_VOTATIONS_SEARCH_REQUEST, sending };
}

export function setUsersSearchResult(data) {
  return { type: SET_USERS_SEARCH_RESULT, data };
}

export function setVotationsSearchResult(data) {
  return { type: SET_VOTATIONS_SEARCH_RESULT, data };
}