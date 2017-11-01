'use strict';

import { 
  UPDATE_PARTICIPANTS, 
  ADD_USER,
  REMOVE_USER,
  ADD_VOTE,
  CLOSE_VOTATION
} from '../../constants/socketVotationRoomConstants.js';

const initialState = {
  currentVotationParticipants: [],
  currentVotationVotes: [],
  updateVotationList: false,

  currentInviteData: {
    creatorId: '',
    title: '',
    description: ''
  }
}

export default function socketVotationReducer(state = initialState, action) {
  switch(action.type) {
    case UPDATE_PARTICIPANTS:
      return assign({}, state, {
        currentVotationParticipants: action.users
      });
    case ADD_USER: {
      let temp = state.currentVotationParticipants;
      let { user, votationId, ...restInviteData } = action.data;
      temp.push(user);

      return assign({}, state, {
        currentVotationParticipants:  temp,
        currentInviteData: restInviteData
      });
    }
    case REMOVE_USER: {
      let temp = state.currentVotationParticipants;
      let indexToRemove = temp.reduce((initial, id, index) => {
        if (id === action.userId) return initial = index;
	    else return initial;
      }, null);
      temp.splice(indexToRemove, 1);

      return assign({}, srtate, {
          currentVotationParticipants: temp
      });
    }
    case ADD_VOTE: {
      let temp = state.currentVotationVotes;
      
      temp.push(action.voteData);

      return assign({}, state, {
        currentVotationVotes: temp
      });
    }
    case CLOSE_VOTATION: {
        return assign({}, state, {
          updateVotationList: true,
          currentVotationId: '',
          currentVotationParticipants: [],
          currentVotationVotes: [],  
        });
    }
    default:
      return state;
  }
}