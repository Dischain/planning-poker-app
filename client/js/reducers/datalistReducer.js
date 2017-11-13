'use strict';

import {
  DATA_LIST_VOTATIONS_VIEW,

  SET_CUR_VIEW,
  SET_CUR_VIEW_DATA,
  SET_CUR_QUERY_VALUE,
  SENDING_PAGINATION_REQUEST,
  SENDING_SEARCH_REQUEST,
  SET_PAGINATION_OFFSET
} from '../constants/dataListConstants.js'

import { 
  DEFAULT_PAGINATION_OFFSET, 
} from '../constants/commonConstants.js';

const initialState = {
  currentView: DATA_LIST_VOTATIONS_VIEW,
  currentViewData: [],
  currentPaginationOffset: DEFAULT_PAGINATION_OFFSET,
  currentQueryValue: {},
  sendingPaginationRequest: false,
  sendingSearchRequest: false
}

const assign = Object.assign;

export default function datalistReducer(state = initialState, action) {
  switch(action.type) {
    case SET_CUR_VIEW:
      return assign({}, state, {
        currentView: action.currentView
      });
    case SET_CUR_VIEW_DATA: {
      let newData = state.currentViewData;
      newData = newData.concat(action.currentViewData);

      return assign({}, state, {
        currentViewData: newData
      });
    }
    case SET_CUR_QUERY_VALUE:
      return assign({}, state, {
        currentQueryValue: action.currentQueryValue
      });
    case SENDING_PAGINATION_REQUEST: 
      return assign({}, state, {
        sendingPaginationRequest: action.sendingPaginationRequest
      });
    case SENDING_SEARCH_REQUEST:
      return assign({}, state, {
        sendingSearchRequest: action.sendingSearchRequest
      });
    case SET_PAGINATION_OFFSET:
      return assign({}, state, {
        currentPaginationOffset: actions.offset
      });
    default:
      return state;
  }
}