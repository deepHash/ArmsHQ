import { CONNECT_SOCKET} from '../actions/types';

const initialState = {
    socket: undefined
};

export default function(state = initialState, action) {
  switch (action.type) {
    case CONNECT_SOCKET:
      return {
        ...state,
        socket: action.payload
      };
    default:
      return state;
  }
}