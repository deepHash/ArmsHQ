import { CONNECT_SOCKET} from '../actions/types';

const initialState = {
    socket: {}
};

export default function(state = initialState, action) {
  // console.log(action.payload);
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