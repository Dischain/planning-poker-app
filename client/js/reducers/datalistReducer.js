import {
  DATA_LIST_VOTATIONS_VIEW,

  SET_CUR_VIEW,
  SET_CUR_VIEW_DATA,
  SENDING_PAGINATION_REQUEST,
  SET_PAGINATION_OFFSET
} from '../constants/dataListConstants.js'

import { 
  DEFAULT_PAGINATION_OFFSET, 
} from '../constants/commonConstants.js';

const initialState = {
  currentView: DATA_LIST_VOTATIONS_VIEW,
  currentViewData: [],
  currentPaginationOffset: DEFAULT_PAGINATION_OFFSET,
  sendingPaginationRequest: false
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
      newData.push(action.currentViewData);

      return assign({}, state, {
        currentViewData: newData
      });
    }
    case SENDING_PAGINATION_REQUEST: 
      return assign({}, state, {
        sendingPaginationRequest: action.sendingPaginationRequest
      });
    case SET_PAGINATION_OFFSET:
      return assign({}, state, {
        currentPaginationOffset: actions.offset
      });
    default:
      return state;
  }
}