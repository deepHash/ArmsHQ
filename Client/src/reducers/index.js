import { combineReducers } from 'redux';
import soldierReducer from './soldierReducer';
import socketReducer from './socketReducer';

export default combineReducers({
    soldiers: soldierReducer,
    socket: socketReducer
});