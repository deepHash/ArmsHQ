import React, { Component } from 'react';
import { connect } from 'react-redux';
import { fetchSoldiers } from '../../actions/soldierActions';
// import { connectSocket } from '../../actions/socketActions';
import { Map, TileLayer } from 'react-leaflet';
import {NotificationContainer, NotificationManager} from 'react-notifications';
import MapMarker from './mapMarker';
import socketIoClient from 'socket.io-client';
import '../../assets/css/map.css';
import '../../assets/css/notifications.css';


class MapView extends Component {

    //component state
    constructor(props){
      super(props);
      
      this.state = {
        firstPos: true,
        lat: 32.682400,
        lan: 35.421000,
        offsetLat: 0.0365,
        offsetLan: 0.3304,
        zoom: 13,
        //socket state vars
        endpoint: "http://127.0.0.1:4000"
      }

    }
    
    componentDidMount() {
      //mounting socket in component
      const endpoint = this.state.endpoint;
      const socket = socketIoClient(endpoint);

      //gps data
      socket.on("gps", this.updateGPSData)
      //emergency data
      socket.on("emergency", this.updateEmergency)
      //disconnected mesh
      socket.on("disconnected", this.updateDisconnect)
      //acc data
      socket.on("acc", this.updateAcc)
      //pulse data
      socket.on("pulse", this.updatePulse)

    }

    componentDidUpdate(){
      var map = this.refs.map.leafletElement;
      map.invalidateSize() //fixes invalid tiles sizes
    }

    centerPosition(lat, lan) {
      this.setState({lat: lat+this.state.offsetLat, lan: lan+this.state.offsetLan, firstPos: false});
    }
    
    notifications(soldier, type){
      switch (type) {
        case "emergency":
            NotificationManager.warning( soldier.name + ' sent help call','Emergency!',10000, () => {});
            break;
        case "disconnect":
            NotificationManager.info( soldier.name + ' has been disconnected from the mesh network','Network Alert!',10000, () => {});
            break;
        default:
            console.log("Notification route not found")
            break;
        }          
      if(soldier.gps){
         this.centerPosition(soldier.gps.lat, soldier.gps.lan);
      }
      else
      //add no gps validation message 
      ;
    }

    updateGPSData = (gps) => {
      var newData = gps.data;
      var soldiers = this.props.soldiers;
      soldiers = soldiers.map((soldier) => {
        if (soldier.meshID === newData.meshID)
          soldier.gps = newData.gps;
        return soldier;
      });
      this.setState({soldiers});
    }

    //calling notification and running on soldier 
    //to change state to emerg: true with positioning 
    updateEmergency = (emergency) => {
      var soldiers = this.props.soldiers;
      soldiers.forEach((soldier) => {
        if(soldier.meshID == emergency.meshID){
          soldier.emerg = true;
          this.notifications(soldier, "emergency");
          //this.setState({state: this.state});
        }
      });
    }

    updateDisconnect = (disconnect) => {
      var soldiers = this.props.soldiers;
      var newData = disconnect.data;
      soldiers.forEach((soldier) => {
        if(soldier.meshID == newData.meshID){
          soldier.emerg = true;
          this.notifications(soldier, "disconnect")
        }
      })
    }

    updatePulse = (pulse) => {
      var newData = pulse.data;
      var soldiers = this.props.soldiers;
      soldiers.forEach((soldier) => {
        if(soldier.meshID == newData.meshID){
          soldier.pulse = newData.pulse;
          this.props.onNewData(soldier, "pulse");
        return soldier
        }
      });
      this.setState({soldiers});
    }

    updateAcc = (acc) => {
      var newData = acc.data;
      var soldiers = this.props.soldiers;
      soldiers.forEach((soldier) => {
        if(soldier.meshID == newData.meshID){
          soldier.acc = newData.acc;
        return soldier
        }
      });
      this.setState({soldiers});
    }

    HandlePopUpClick = (__soldier) => {
      this.props.soldiers.forEach((soldier) => {
        if (soldier.meshID == __soldier.meshID){
          soldier.emerg = false;
          this.setState({state: this.state});
        }
      });
    }

    render() {
      const soldiers  = this.props.soldiers;
      const pos       = this.props.pos;
      console.log(soldiers);
      var position = [ this.state.lat, this.state.lan ];
      soldiers.forEach((soldier) => {
        //set initial view to the commanders position
        if(soldier.isCommander == true && this.state.firstPos)
        position = [soldier.gps.lat+this.state.offsetLat, soldier.gps.lan+this.state.offsetLan];
      });
      if(pos){
        position = [pos.lat+this.state.offsetLat, pos.lan+this.state.offsetLan];
      }
      return (
        <div className="Wrapper" >
          <NotificationContainer id="notification"/>
          <Map className="map" center={position} zoom={this.state.zoom} ref="map">
            <TileLayer 
              attribution='&amp;copy <a href="http://osm.org/copyright">OpenStreetMap</a> contributors'
              url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
            />
            <MapMarker soldiers={soldiers} offsetLan={this.state.offsetLan} offsetLat={this.state.offsetLat} onPopUpClick={this.HandlePopUpClick}/>
          </Map>
        </div>
      );
    }
  }

  const mapStateToProps = state => ({
    soldiers: state.soldiers.items
  });
  
  export default connect(mapStateToProps, {fetchSoldiers})(MapView);
