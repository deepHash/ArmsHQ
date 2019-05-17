import React, { Component } from 'react';
import socketIoClient from 'socket.io-client';
import { Map, TileLayer, Marker, Popup } from 'react-leaflet';
import L from 'leaflet';
import '../assets/css/Map.css';
import soldierImage from '../assets/images/soldier.png';
import soldierEmerg from '../assets/images/soldierEmerg.png';
import {NotificationContainer, NotificationManager} from 'react-notifications';
import '../assets/css/notifications.css';


class MapView extends Component {

    //component state
    constructor(props){
      super(props);

      this.state = {
        soldiers: [],
        lat: 32.682400,
        lan: 35.421000,
        offsetLat: 0.02871,
        offsetLng: 0.33078,
        zoom: 13,
        //socket state vars
        response: false,
        endpoint: "http://127.0.0.1:4000"
      }

    }

    //icon vars
     soldierIcon = L.icon({
      iconUrl: soldierImage,
      iconSize: [70, 70],
      iconAnchor: [22, 94],
      popupAnchor: [12, -85]
     });

     soldierEmergIcon = L.icon({
      iconUrl: soldierEmerg,
      iconSize: [70, 70],
      iconAnchor: [22, 94],
      popupAnchor: [12, -85]
  });

    pushSoldier(_soldier){
        var soldier = this.state.soldier;
        soldier.set(_soldier.soldierId,{_soldier});
        this.setState({soldier});
        console.log(this.state.soldier);
    }
    //mounting socket in component
    componentDidMount() {
      const { endpoint } = this.state;
      const socket = socketIoClient(endpoint);

      //init data
      socket.on("initData", this.handleData)
      //gps data
      socket.on("gps", this.updateGPSData)
      //emergency data
      socket.on("emergency", this.updateEmergency)

    }

    handleData = (initData) => {
      console.log(initData.soldiers);
      this.setState({soldiers: initData.soldiers, response: true})
    }
    updateGPSData = (gps) => {
      var mySoldier = gps.data;
      var soldiers = this.state.soldiers;
      soldiers = soldiers.map((soldier) => {
        if (soldier.meshID == mySoldier.meshID)
          soldier.gps = mySoldier.gps;
        return soldier;
      });
      this.setState({soldiers});
    }
    notifications(_name){
        NotificationManager.warning( _name + ' sent help ','Notification',2000);
    }

    updateEmergency = (emergency) => {
      console.log(emergency)
      this.notifications(emergency.soldierName)
    }

    SoldiersList() {
      var soldierJsx = (<div></div>)
      var soldiers = this.state.soldiers;
      var i = 0;
      if(soldiers){
        soldierJsx = soldiers.map((soldier) =>
          {
            let position;
            if(soldier.gps){
              position = [soldier.gps.lat, soldier.gps.lan];
            }
            else{
              //no gps for soldier
              position = [0, 0];
            }


            //console.log(position);
            return (<Marker
            key={i++}
            position={ position}
            icon={ this.soldierIcon }>
            <Popup>
              ID: {soldier.meshID}<br></br>
              Name: {soldier.name}
            </Popup>
        </Marker>)}
          );
      }
      return soldierJsx;
    }

    render() {
      const { soldiers } = this.state;
      const position = [ this.state.lat, this.state.lan];
      return (
        <div className="Wrapper">
          <NotificationContainer/>
          <Map className="map" center={position} zoom={this.state.zoom}>
            <TileLayer
              attribution='&amp;copy <a href="http://osm.org/copyright">OpenStreetMap</a> contributors'
              url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
            />
            {this.SoldiersList(soldiers)}
          </Map>
        </div>
      );
    }
  }

  export default MapView;