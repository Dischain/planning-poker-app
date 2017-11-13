import { 
  setCurView, 
  setCurViewData,
  setPaginationOffset,
  sendingPaginationRequest,
  sendingSearchRequest
} from '../actions/dataListActions.js';
import {
  DATA_LIST_VOTATIONS_VIEW,
  DATA_LIST_USER_VOTATIONS_VIEW,
  DATA_LIST_VOTATIONS_SEARCH_VIEW,
  DATA_LIST_USERS_SEARCH_VIEW
} from '../constants/dataListConstants.js'
import {
  CHANGE_SEARCH_VOTATIONS_VALUE
} from '../constants/votationsConstants.js';
import {
  DEFAULT_PAGINATION_OFFSET
} from '../constants/commonConstants.js';

import { API_BASE_PATH } from '../../config.js';
import { browserHistory } from 'react-router';
import { constructQuery } from '../util/query.js';

export function getVotations(data) {
  return (dispatch, getState) => {    
    if (getState().currentView !== DATA_LIST_VOTATIONS_VIEW) {
      dispatch(setCurViewData([]));
      dispatch(setCurView(DATA_LIST_VOTATIONS_VIEW));
    }

    if (data.offset !== DEFAULT_PAGINATION_OFFSET) {
      dispatch(sendingPaginationRequest(true));
    } else {
      dispatch(sendingSearchRequest(true));
    }
    
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
      let result = JSON.parse(json);
      console.log(result);
      if (_status === 200) {
        dispatch(setCurViewData(result));

      } else if (_status === 401) {
        browserHistory.push('/login');
      } else {
        
      }
      dispatch(sendingPaginationRequest(false));
      dispatch(sendingSearchRequest(false));
    })
    .catch((err) => {
      dispatch(sendingPaginationRequest(false));
      dispatch(sendingSearchRequest(false));
    });
  };
}

export function getUserVotations(data) {
  return (dispatch, getState) => {    
    if (getState().currentView !== DATA_LIST_USER_VOTATIONS_VIEW) {
      dispatch(setCurViewData([]));
      dispatch(setCurView(DATA_LIST_USER_VOTATIONS_VIEW));
    }

    if (data.offset !== DEFAULT_PAGINATION_OFFSET) {
      dispatch(sendingPaginationRequest(true));
    } else {
      dispatch(sendingSearchRequest(true));
    }
    
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
      let result = JSON.parse(json);

      if (_status === 200) {
        dispatch(setCurViewData(result));

      } else if (_status === 401) {
        browserHistory.push('/login');
      } else {
        // TODO
      }
      dispatch(sendingPaginationRequest(false));
      dispatch(sendingPaginationRequest(false));
    })
    .catch((err) => {
      dispatch(sendingPaginationRequest(false));
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

    if (data.offset !== DEFAULT_PAGINATION_OFFSET) {
      dispatch(sendingPaginationRequest(true));
    } else {
      dispatch(sendingSearchRequest(true));
    }
    
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
      let result = JSON.parse(json);

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

export function changeSearchVotationsValue(value) {
  return { type: CHANGE_SEARCH_VOTATIONS_VALUE, searchVotationsValue: value };
}