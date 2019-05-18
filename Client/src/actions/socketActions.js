import { CONNECT_SOCKET } from './types';
import socketIoClient from 'socket.io-client';

export const connectSocket = () => dispatch => {
    const endpoint = "http://127.0.0.1:4000";
    const socket = socketIoClient(endpoint);
        dispatch({
          type: CONNECT_SOCKET,
          payload: socket
        })
};