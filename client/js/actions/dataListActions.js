import { 
  getVotations, 
  getUserVotations, 
  searchVotations 
} from '../actions/votationsActions.js';
import { searchUsers } from '../actions/userActions.js';

export function dispatchLastRequest(view, paginationOffset, limit, data) {
  return (dispatch, getState) => {
    let request;
    switch(view) {
      case DATA_LIST_VOTATIONS_VIEW:
        request = getVotations;
      case DATA_LIST_USER_VOTATIONS_VIEW:
        request = getUserVotations;
      case DATA_LIST_VOTATIONS_SEARCH_VIEW:
        request = searchVotations;
      case DATA_LIST_USERS_SEARCH_VIEW:
        request = searchUsers;
      default:
        request = getVotations;
    }

    dispatch(request(paginationOffset, limit, data));
  };
}

export function setCurView(view) {
  return { type: SET_CUR_VIEW, currentView: view }
}

export function setCurViewData(data) {
  return { type: SET_CUR_VIEW_DATA, currentViewData: data }
}

export function setPaginationOffset(offset) {
  return { type: SET_PAGINATION_OFFSET, currentPaginationOffset: offset }  
}

export function sendingPaginationRequest(sending) {
  return { type: SENDING_PAGINATION_REQUEST, sendingPaginationRequest: sending };
}