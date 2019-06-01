import React, { Component } from 'react'
import { Marker, Popup } from 'react-leaflet';
import icons from './mapIcons';
import Leaflet from 'leaflet';

export default class mapMarker extends Component {
    
    //map icons settings
    iconSize = [70, 70];
    iconAnchor = [22, 94];
    popupAnchor = [12, -85];

    //regular soldier icon
    soldierIcon = Leaflet.icon({
        iconUrl: icons("soldier").image,
        iconSize: this.iconSize,
        iconAnchor: this.iconAnchor,
        popupAnchor: this.popupAnchor
    });
    //emergency soldier icon
    soldierEmergIcon = Leaflet.icon({
        iconUrl: icons("soldierEmerg").image,
        iconSize: this.iconSize,
        iconAnchor: this.iconAnchor,
        popupAnchor: this.popupAnchor
    });
    //commander icon
    CommanderIcon = Leaflet.icon({
        iconUrl: icons("commander").image,
        iconSize: this.iconSize,
        iconAnchor: this.iconAnchor,
        popupAnchor: this.popupAnchor
    });
    //emergency icon
    CommanderEmergIcon = Leaflet.icon({
        iconUrl: icons("commanderEmerg").image,
        iconSize: this.iconSize,
        iconAnchor: this.iconAnchor,
        popupAnchor: this.popupAnchor
    });

    SoldiersList(_soldiers) {
        var soldierJsx = <div></div>,
            soldiers = _soldiers;
        if(soldiers && soldiers.length > 0){
          soldierJsx = soldiers.map((soldier) =>
            {
              let position = this.setGPS(soldier.gps),
                  icon = this.setIcon(soldier);

              return (
                <Marker 
                    key={ soldier.meshID }
                    position={ position }
                    icon={ icon }>            
                    <Popup>
                        ID: { soldier.meshID }<br></br>
                        Name: { soldier.name }
                    </Popup>
                </Marker>
              )}
            );
        }
        return (
          soldierJsx
        )
      }

      setGPS(gps){
        if(gps)
            return [gps.lat + this.props.offsetLat, gps.lan + this.props.offsetLan];
        else
            //no gps for soldier
            return [0, 0];
      }

      setIcon(soldier){
        let icon;
        if(soldier.emerg)
            if(soldier.isCommander)
                icon = this.CommanderEmergIcon;
            else
                icon = this.soldierEmergIcon;
        else
            if(soldier.isCommander)
                icon = this.CommanderIcon;
            else
                icon = this.soldierIcon;
        return icon;    
      }
    
    render() {
        const soldiers = this.props.soldiers;
        var   soldiersList = this.SoldiersList(soldiers);
        return (
            <div>
                {soldiersList}
            </div>
        )
    }
}