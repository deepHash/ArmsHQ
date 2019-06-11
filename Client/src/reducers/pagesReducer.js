import { CHANGE_PAGE } from '../actions/types';

const initialState = {
  page:'map'
};

export default function(state = initialState, action) {
  switch (action.type) {
    case CHANGE_PAGE:
      return {
        ...state,
        curr: action.payload
      };
    default:
      return state;
  }
}