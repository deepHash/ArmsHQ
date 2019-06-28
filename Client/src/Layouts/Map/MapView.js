import React, { Component } from 'react';
import { connect } from 'react-redux';
import { fetchSoldiers } from '../../actions/soldierActions';
// import { connectSocket } from '../../actions/socketActions';
import { Map, TileLayer } from 'react-leaflet';
import {NotificationContainer, NotificationManager} from 'react-notifications';
import MapMarker from './mapMarker';
import socketIoClient from 'socket.io-client';
import '../../assets/css/Map.css';
import '../../assets/css/notifications.css';
import Leaflet from 'leaflet';


class MapView extends Component {

    //component state
    constructor(props){
      super(props);
      
      this.state = {
        firstPos: true,
        lat: 32.682400,
        lan: 35.421000,
        offsetLat: 0.0, //0.0365
        offsetLan: 0.0, //0.3304
        zoom: 15,
        //socket state vars
        endpoint: "http://127.0.0.1:4000",
        boundryRoutes: []
      }

    }
    
    componentDidMount() {
      //mounting socket in component
      const endpoint = this.state.endpoint;
      const socket = socketIoClient(endpoint);

      //gps data
      socket.on("gps", this.updateNewData)
      //acc data
      socket.on("acc", this.updateNewData)
      //pulse data
      socket.on("pulse", this.updateNewData)
      //emergency data
      socket.on("emergency", this.updateAlertData)
      //disconnected mesh
      socket.on("disconnected", this.updateAlertData)
      //reconnected mesh
      socket.on("reconnected", this.updateAlertData)
    }

    componentDidUpdate(){
      var map = this.refs.map.leafletElement;
      map.invalidateSize() //fixes invalid tiles sizes
      
      //focus on specific force
      if(this.props.focusOnForce!=undefined){
        this.centerForcesPosition(this.props.focusOnForce);
        // this.props.focusOnForce=false;
      }

      //set marker for each soldier gps and create map bound for arrayOfMarkers => route
      if(this.props.forcePos == true){
        this.props.onNewData("", "position")
        var route = Leaflet.featureGroup().addTo(map);
        this.props.soldiers.forEach((soldier) => {
          if(soldier.gps && soldier.gps != [0,0]){
            let m = Leaflet.marker([soldier.gps.lat+this.state.offsetLat, soldier.gps.lan+this.state.offsetLan], 
                                    {icon: Leaflet.icon({iconUrl:"none", shadowUrl:"none"})})
            route.addLayer(m);
          }
        })
        //update bounds on the map
        map.fitBounds(route.getBounds());
        //update the bounds array for all forces - ALL soldiers sits on [0]
        let arr = this.state.boundryRoutes.slice();
        arr[0] = route;
        this.setState({boundryRoutes: arr})
      }
    }

    //update soldier data via socket info
    updateNewData = (socketData) => {
      var newData = socketData.data;
      var type = socketData.type;
      var soldiers = this.props.soldiers;
      soldiers = soldiers.map((soldier) => {
        if (soldier.meshID === newData.meshID){
          switch (type){
            case "gps":
                soldier.gps = newData.gps;
                break;
            case "pulse":
                soldier.pulse = newData.pulse;
                this.props.onNewData(soldier, "pulse");
                break;
            case "acc":
                soldier.acc = newData.acc;
                this.props.onNewData(soldier, "acc");
                break;
          }
        }
        return soldier;
      });
      this.setState({soldiers});
    }

    //calling notification and running on soldier 
    updateAlertData = (socketData) => {
      var newData = socketData.data;
      var type = socketData.type;
      var soldiers = this.props.soldiers;
      soldiers.forEach((soldier) => {
        if(soldier.meshID == newData.meshID){
          //stop the blinking if reconnected
            if(type == "reconnect")
              soldier.emerg = false;
            else
              soldier.emerg = true;
            this.notifications(soldier, type);
        }
      });
    }

    centerPosition(soldier) {
      var map = this.refs.map.leafletElement;
      map.panTo(new Leaflet.LatLng(soldier.gps.lat+this.state.offsetLat, soldier.gps.lan+this.state.offsetLan));
      this.setState({state: this.state});
      setTimeout(function() { //Start the timer
         this.centerForcesPosition(soldier.forceID);
      }.bind(this), 2500)
    }

    centerForcesPosition(forceID) {
      var map = this.refs.map.leafletElement;
      let boundsArray = this.state.boundryRoutes;
      
      if(boundsArray[forceID])
        map.fitBounds(boundsArray[forceID].getBounds());

      else{
        let route = Leaflet.featureGroup().addTo(map);
        this.props.soldiers.forEach((soldier) => {
          if(soldier.gps && soldier.gps != [0,0] && soldier.forceID == forceID){
            let m = Leaflet.marker([soldier.gps.lat+this.state.offsetLat, soldier.gps.lan+this.state.offsetLan], 
                                          {icon: Leaflet.icon({iconUrl:"none", shadowUrl:"none"})})
            route.addLayer(m);
          }
        })
        //update bounds on the map
        map.fitBounds(route.getBounds());
        //update the bounds array for #forceID 
        let arr = this.state.boundryRoutes.slice();
        arr[forceID] = route;
        this.setState({boundryRoutes: arr})
      }
      this.props.onNewData(undefined, "forceID"); // open soldier card
    }
    
    notifications(soldier, type){
      switch (type) {
        case "emergency":
            NotificationManager.warning( soldier.name + ' sent help call','Emergency!',10000);
            this.props.onNewData(soldier, "emergency"); // open soldier card
            if(soldier.gps)
               this.centerPosition(soldier);
            break;
        case "disconnect":
            NotificationManager.info( soldier.name + ' disconnected from the network','Network Alert!',10000);
            this.props.onNewData(soldier, "emergency");
            break;
        case "reconnect":
            NotificationManager.info( soldier.name + ' was reconnected to the network', 'Network Alert', 10000)
            break;
        default:
            console.log("Notification route not found")
            break;
        }           
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
      console.log(soldiers);
      const pos       = this.props.pos;
      var position = [ this.state.lat, this.state.lan ];
      if(pos)
        position = [pos.lat+this.state.offsetLat, pos.lan+this.state.offsetLan];
      return (
        <div className="Wrapper" >
          <NotificationContainer id="notification"/>
          <Map className="map" center={position} zoom={this.state.zoom} ref="map">
            <TileLayer 
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
