import React, { Component } from 'react';
import socketIoClient from 'socket.io-client';
import { Map, TileLayer, Marker, Popup } from 'react-leaflet';
import L from 'leaflet';
import '../assets/css/Map.css';
import soldierImage from '../assets/images/soldier.png';

class MapView extends Component {

    //component state
    constructor(props){
      super(props);

      this.state = {
        soldier: [],
        soldiers: [{
          meshID: 0,
          gps: {
            lat: Number,
            lan: Number
          },
          emerg: Boolean
        }],
        lat: 32.682400,
        lng: 35.421000,
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
    
    }

    handleData = (initData) => {
      console.log(initData.soldiers);
      this.setState({soldiers: initData.soldiers, response: true})
    }

    SoldiersList(props) {
      const soldiers = props.soldiers;
      const markerList = soldiers.map((soldier) =>
        <Marker 
          position={ soldier.gps }
          icon={ this.soldierIcon }>            
          <Popup>
            Soldier ID is: {soldier.meshID}
          </Popup>
        </Marker>
        );
        return (
          {markerList}
      );
    }
    
    render() {
      const position = [this.state.lat, this.state.lng]
      const { soldiers } = this.state;
      return (
        <div className="Wrapper">
          <Map className="map" center={position} zoom={this.state.zoom}>
            <TileLayer
              attribution='&amp;copy <a href="http://osm.org/copyright">OpenStreetMap</a> contributors'
              url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
            />
            <Marker 
              position={ position }
              icon={ this.soldierIcon }>            
            <Popup>
            {/* <markerList soldiers={soldiers} /> */}
              Soldier ID is: {soldiers[0].meshID}
            </Popup>
            </Marker>
          </Map>
        </div>
      );
    }
  }
  
  export default MapView;