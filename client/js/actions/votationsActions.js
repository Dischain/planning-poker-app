import { 
  setCurView, 
  setCurViewData,
  setPaginationOffset,
  sendingPaginationRequest
} from '../actions/dataListActions.js';
import {
  DATA_LIST_VOTATIONS_VIEW,
  DATA_LIST_USER_VOTATIONS_VIEW,
  DATA_LIST_VOTATIONS_SEARCH_VIEW,
  DATA_LIST_USERS_SEARCH_VIEW
} from '../constants/dataListConstants.js'
import { API_BASE_PATH } from '../../config.js';
import { browserHistory } from 'react-router';
import { constructQuery } from '../util/query.js';

export function getVotations(data) {
  return (dispatch, getState) => {    
    if (getState().currentView !== DATA_LIST_VOTATIONS_VIEW) {
      dispatch(setCurViewData([]));
      dispatch(setCurView(DATA_LIST_VOTATIONS_VIEW));
    }

    dispatch(sendingPaginationRequest(true));
    
    let _status;

    fetch(API_BASE_PATH + '/votations' + constructQuery(data), {
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
      let data = JSON.parse(json);

      if (_status === 200) {
        dispatch(setCurViewData(data));

      } else if (_status === 401) {
        browserHistory.push('/login');
      } else {
        // TODO
      }
      dispatch(sendingPaginationRequest(false));
    })
    .catch((err) => {
      dispatch(sendingPaginationRequest(false));
    });
  };
}

export function getUserVotations(data) {
  return (dispatch, getState) => {    
    if (getState().currentView !== DATA_LIST_USER_VOTATIONS_VIEW) {
      dispatch(setCurViewData([]));
      dispatch(setCurView(DATA_LIST_USER_VOTATIONS_VIEW));
    }

    dispatch(sendingPaginationRequest(true));
    
    let _status;

    fetch(API_BASE_PATH + '/votations' + constructQuery(data), {
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
      let data = JSON.parse(json);

      if (_status === 200) {
        dispatch(setCurViewData(data));

      } else if (_status === 401) {
        browserHistory.push('/login');
      } else {
        // TODO
      }
      dispatch(sendingPaginationRequest(false));
    })
    .catch((err) => {
      dispatch(sendingPaginationRequest(false));
    });
  };
}

export function searchVotations(data) {
  return (dispatch, getState) => {    
    if (getState().currentView !== DATA_LIST_VOTATIONS_SEARCH_VIEW) {
      dispatch(setCurViewData([]));
      dispatch(setCurView(DATA_LIST_VOTATIONS_SEARCH_VIEW));
    }

    dispatch(sendingPaginationRequest(true));
    
    let _status;

    fetch(API_BASE_PATH + '/votations' + constructQuery(data), {
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
      let data = JSON.parse(json);

      if (_status === 200) {
        dispatch(setCurViewData(data));

      } else if (_status === 401) {
        browserHistory.push('/login');
      } else {
        // TODO
      }
      dispatch(sendingPaginationRequest(false));
    })
    .catch((err) => {
      dispatch(sendingPaginationRequest(false));
    });
  };
}