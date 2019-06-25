import { FETCH_SOLDIERS, FETCH_ALERTS, SET_POSITION, ADD_SOLDIER} from '../actions/types';

const initialState = {
  items: [],
  alerts: [],
  item: {}
};

export default function(state = initialState, action) {
  switch (action.type) {
    case FETCH_SOLDIERS:
      return {
        ...state,
        items: action.payload
      };
    case FETCH_ALERTS:
      return {
        ...state,
        alerts: action.payload
      };
    case ADD_SOLDIER:
      return{
        ...state,
        item: action.payload
      };
    case SET_POSITION:
      return {
        ...state,
      };
    default:
      return state;
  }
}