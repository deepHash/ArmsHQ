import React, { Component } from 'react';
import { Map, TileLayer, Marker, Popup } from 'react-leaflet';
import '../assets/css/Map.css';

class MapView extends Component {

    state = {
      lat: 31.771959,
      lng: 35.217018,
      zoom: 13,
    }
    
    render() {
      const position = [this.state.lat, this.state.lng]
      return (
        <div className="Wrapper">
          <Map className="map" center={position} zoom={this.state.zoom}>
            <TileLayer
              attribution='&amp;copy <a href="http://osm.org/copyright">OpenStreetMap</a> contributors'
              url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
            />
            <Marker position={position}>
              <Popup>
                A pretty CSS3 popup. <br /> Easily customizable.
              </Popup>
            </Marker>
          </Map>
        </div>
      );
    }
  }
  
  export default MapView;