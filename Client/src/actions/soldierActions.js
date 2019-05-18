import { FETCH_SOLDIERS } from './types';

export const fetchSoldiers = () => dispatch => {
  fetch('http://localhost:4000/getAllsoldiers')
    .then(res => res.json())
    .then(soldiers =>
      dispatch({
        type: FETCH_SOLDIERS,
        payload: soldiers
      })
    );
};