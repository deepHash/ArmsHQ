import React, { Component } from 'react';
import { connect } from 'react-redux';
import { fetchSoldiers } from '../../actions/soldierActions';
import { connectSocket } from '../../actions/socketActions';
import socketIoClient from 'socket.io-client';
import { Map, TileLayer, Marker, Popup } from 'react-leaflet';
import L from 'leaflet';
import '../../assets/css/Map.css';
import soldierImage from '../../assets/images/soldier.png';
import soldierEmerg from '../../assets/images/soldierEmerg.png';
import {NotificationContainer, NotificationManager} from 'react-notifications';
import '../../assets/css/notifications.css';


class MapView extends Component {

    //component state
    constructor(props){
      super(props);
      
      this.state = {
        lat: 32.682400,
        lan: 35.421000,
        offsetLat: 0.02871,
        offsetLng: 0.33078,
        zoom: 13,
        //socket state vars
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
  
    componentDidMount() {
      //mounting socket in component
      // this.props.connectSocket();
      const endpoint = this.state.endpoint;
      const socket = socketIoClient(endpoint);

      this.props.fetchSoldiers();

      //gps data
      socket.on("gps", this.updateGPSData)
      //emergency data
      socket.on("emergency", this.updateEmergency)

    }
    
    updateGPSData = (gps) => {
      var mySoldier = gps.data;
      var soldiers = this.state.soldiers;
      soldiers = soldiers.map((soldier) => {
        if (soldier.meshID === mySoldier.meshID)
          soldier.gps = mySoldier.gps;
        return soldier;
      });
      this.setState({soldiers});
    }
    notifications(_name){
        NotificationManager.warning( _name + ' sent help ','Notification',1000000);
    }

    updateEmergency = (emergency) => {
      console.log(emergency)
      this.notifications(emergency.soldierName);
      var soldiers = this.props.soldiers;
      soldiers.map((soldier) => {
        if(soldier.meshID === emergency.meshID){
          soldier.emerg = true;
        }
      });
      this.SoldiersList(soldiers);
    }

    SoldiersList(_soldiers) {
      var soldierJsx = (<div></div>)
      var soldiers = _soldiers;
      if(soldiers){
        soldierJsx = soldiers.map((soldier) =>
          {
            let position,
                icon = this.soldierIcon; 
            if(soldier.gps){
              position = [soldier.gps.lat, soldier.gps.lan];
            }
            else{
              //no gps for soldier
              position = [0, 0];
            }
            if(soldier.emerg){
              icon = this.soldierEmergIcon;
            }
            return (<Marker 
            key={soldier.meshID}
            position={position}
            icon={ icon }>            
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
      const soldiers  = this.props.soldiers;
      console.log(soldiers);
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

  const mapStateToProps = state => ({
    soldiers: state.soldiers.items
    //socket: state.socket
  });
  
  export default connect(mapStateToProps, {fetchSoldiers})(MapView);
