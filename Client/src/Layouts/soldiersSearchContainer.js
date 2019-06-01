import React, { Component } from 'react';
import { connect } from 'react-redux';
import { fetchSoldiers } from '../actions/soldierActions';
import {NotificationContainer, NotificationManager} from 'react-notifications';
import socketIoClient from 'socket.io-client';
import '../assets/css/notifications.css';
// import SearchIcon from '@material-ui/icons/Search';
// import InputBase from '@material-ui/core/InputBase';
import SoldiersList from './soldiersList';


export default class SoldiersSearchContainer extends Component {
    constructor(props) {
      super(props);
      this.state = {
        list: [
          "Go to the store",
          "Wash the dishes",
          "Learn some code"
        ]
      }
    }
    
   
    render() {
        return (
            <div className="root">
                <div className="search">
                {/* <div className="searchIcon">
                <SearchIcon className="searchIcon"/>
                </div> */}
                {/* <InputBase
                placeholder="Search…"
                classes={{
                    root: "inputRoot",
                    input: "inputInput",
                }}
                onChange={this.handleChange}
                /> */}
            
                <div className="toolbar" />
                <div className="content">
                    <div className="container">
                    <section className="section">
                    <SoldiersList items={this.state.list}/>
                        {/* <ul>
                        {this.state.list.map(item => (
                            <li key={item}>{item}</li>
                        ))}
                        </ul> */}
                    </section>
                    </div>
                </div> 
            </div>
        </div>
        )
    }
    
}  


  