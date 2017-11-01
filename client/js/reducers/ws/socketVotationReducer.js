'use strict';

import { 
  CREATE_VOTATION, 
  SET_CURRENT_VOTATION 
} from '../../constants/socketVotationConstants.js';

const initialState = {
  currentVotationId: '',
  currentVotationTitle: '',
  currentVotationDescription: ''
}

export default function socketVotationReducer(state = initialState, action) {
  switch(action.type) {
    case SET_CURRENT_VOTATION: {
      let { currentVotationId, currentVotationTitle, currentVotationDescription}
      return assign({}, state, {
        currentVotationId, 
        currentVotationTitle, 
        currentVotationDescription
      });
    }
    default:
      return state;
  }
}