import { combineReducers } from 'redux';
import soldierReducer from './soldierReducer';
import socketReducer from './socketReducer';
import pagesReducer from './pagesReducer';

export default combineReducers({
    soldiers: soldierReducer,
    socket: socketReducer,
    pages: pagesReducer
});