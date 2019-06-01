import React, { Component } from 'react';
import { connect } from 'react-redux';
import { fetchSoldiers } from '../actions/soldierActions';
import {NotificationContainer, NotificationManager} from 'react-notifications';
import socketIoClient from 'socket.io-client';
import '../assets/css/notifications.css';

export default class SoldierInfo extends Component {
    constructor(props) {
      super(props);
      // this.state = {
      //   list: [
      //     "Go to the store",
      //     "Wash the dishes",
      //     "Learn some code"
      //   ]
      // }
    }

    render() {
        return (
          {/* <div className="content">
            <div className="container">
              <section className="section">
                <ul>
                  {this.state.list.map(item => (
                    <li key={item}>{item}</li>
                  ))}
                </ul>
              </section>
            </div>
          </div> */}
        )
      }

  }