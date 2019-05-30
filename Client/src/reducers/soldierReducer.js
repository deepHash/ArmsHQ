import { FETCH_SOLDIERS, SET_POSITION, ADD_SOLDIER} from '../actions/types';

const initialState = {
  items: [],
  item: {}
};

export default function(state = initialState, action) {
  switch (action.type) {
    case FETCH_SOLDIERS:
      return {
        ...state,
        items: action.payload
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