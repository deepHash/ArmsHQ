import { FETCH_SOLDIERS, FETCH_ALERTS, ADD_SOLDIER } from './types';

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

export const fetchAlerts = () => dispatch => {
  fetch('http://localhost:4000/getAllAlerts')
    .then(res => res.json())
    .then(alerts =>
      dispatch({
        type: FETCH_ALERTS,
        payload: alerts
      })
    );
};



export const addNewSoldier = soldierData => dispatch => {
  fetch('http://localhost:4000/addSoldier', {
    method: 'POST',
    headers: {
      'Accept': 'application/json',
      'content-type': 'application/json'
    },
    body: JSON.stringify(soldierData)
  })
    .then(res => res.json())
    .then(soldier =>
      dispatch({
        type: ADD_SOLDIER,
        payload: soldier
      }),
    );
};