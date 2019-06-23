import React, { Component } from 'react'
import { Marker, Popup } from 'react-leaflet';
import icons from './mapIcons';
import Leaflet from 'leaflet';
import { Button } from 'react-bootstrap';
import '../../assets/css/Map.css'

export default class mapMarker extends Component {
    
    //map icons settings
    iconSize = [60, 60];
    iconAnchor = [22, 94];
    popupAnchor = [8, -85];
    
    createSoldierIcon(color, emergency) {
        return Leaflet.divIcon({
            iconSize: this.iconSize,
            iconAnchor: this.iconAnchor,
            popupAnchor: this.popupAnchor,
            className: emergency ? 'blinking' : 'non-blinking',
            html:   `<svg viewBox="0 0 200.000000 200.000000"> 
            <g transform="translate(0.000000,200.000000) scale(0.100000,-0.100000)"
            fill="#000000" stroke="none">
            <path fill=${color} d="M883 1745 c-171 -37 -321 -175 -373 -344 -23 -73 -27 -210 -8 -291
            13 -59 458 -930 482 -945 11 -7 21 -7 32 0 24 15 472 893 484 948 13 61 13
            199 -1 257 -18 79 -71 172 -134 235 -127 129 -302 179 -482 140z m289 -132
            c122 -58 205 -166 230 -302 32 -171 -64 -352 -231 -434 -61 -30 -72 -32 -171
            -32 -99 0 -110 2 -171 32 -125 62 -209 173 -232 306 -28 166 63 346 214 423
            80 40 95 43 199 41 84 -2 103 -6 162 -34z"/>
            <path d="M943 1530 c-38 -25 -59 -68 -68 -136 -8 -54 5 -94 29 -94 8 0 16 -10
            20 -23 3 -12 15 -33 27 -45 11 -13 19 -25 17 -27 -2 -3 -49 41 -103 95 -55 55
            -105 100 -111 100 -19 0 -45 36 -38 54 6 17 -3 20 -30 10 -26 -10 -19 -27 34
            -79 27 -28 50 -54 50 -59 0 -4 18 -30 41 -57 22 -27 38 -53 34 -59 -3 -5 -24
            -10 -46 -10 -38 0 -40 -2 -37 -27 3 -27 5 -28 65 -28 34 0 64 -3 67 -6 3 -3
            -12 -16 -34 -28 -44 -25 -60 -47 -60 -85 l0 -26 220 0 220 0 0 39 c0 32 -6 43
            -34 65 -19 14 -38 26 -43 26 -15 0 -83 61 -83 75 0 7 6 15 14 18 8 3 20 22 27
            41 8 22 20 36 33 38 51 7 36 144 -23 210 -25 28 -35 32 -92 35 -52 3 -70 0
            -96 -17z"/>
            </g> </svg>`
        })
    }

    //commander icon
    createCommanderIcon(color, emergency){
        return Leaflet.divIcon({
            iconSize: this.iconSize,
            iconAnchor: this.iconAnchor,
            popupAnchor: this.popupAnchor,
            className: emergency ? 'blinking' : 'non-blinking',
            html:   `<svg viewBox="0 0 200.000000 200.000000">
            <g transform="translate(0.000000,200.000000) scale(0.100000,-0.100000)"
            fill="#000000" stroke="none">
            <path fill=${color} d="M883 1745 c-171 -37 -321 -175 -373 -344 -23 -73 -27 -210 -8 -291
            13 -59 458 -930 482 -945 11 -7 21 -7 32 0 24 15 472 893 484 948 13 61 13
            199 -1 257 -18 79 -71 172 -134 235 -127 129 -302 179 -482 140z m201 -100
            c226 -48 369 -274 312 -495 -33 -127 -107 -219 -218 -271 -69 -32 -79 -34
            -179 -34 -101 0 -108 1 -181 37 -151 75 -240 232 -224 398 8 86 8 87 38 145
            58 112 162 194 279 220 83 17 91 17 173 0z"/>
            <path d="M929 1528 c-28 -57 -53 -104 -54 -106 -2 -2 -47 -10 -101 -18 -137
            -20 -144 -22 -144 -43 0 -11 36 -53 85 -98 l84 -78 -19 -105 c-11 -58 -20
            -113 -20 -122 0 -29 34 -21 140 32 l100 50 100 -50 c106 -53 140 -61 140 -32
            0 9 -9 64 -20 122 l-19 105 84 78 c49 45 85 87 85 98 0 21 -7 23 -144 43 -54
            8 -99 16 -101 18 -1 2 -26 49 -54 106 -39 78 -56 102 -71 102 -15 0 -32 -24
            -71 -102z"/>
            </g>
            </svg>`
        })
    }

    handlePopUpClick(soldier) {
        this.props.onPopUpClick(soldier);
    }

    SoldiersList(_soldiers) {
        var soldierJsx = <div ></div>,
            soldiers = _soldiers;
        if(soldiers && soldiers.length > 0){
          soldierJsx = soldiers.map((soldier) =>
            {
              let position = this.setGPS(soldier.gps),
                  icon = this.setIcon(soldier),
                  resolveButton = this.setButton(soldier);
                  
              return (
                <Marker
                    key={ soldier.meshID }
                    position={ position }
                    icon={ icon }>            
                    <Popup>
                        ID: { soldier.meshID }<br/>
                        Name: { soldier.name }<br/>
                        {resolveButton}
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
            return [-1, -1];
      }

      setIcon(soldier){
        let icon;
        const colorArray = ["#a6cee3", "#1f78b4", "#33a02c", "#fb9a99", "#e31a1c", "#fdbf6f", "#ff7f00", "#6a3d9a", "#b15928"]

        if(soldier.isCommander)
            icon = this.createCommanderIcon(colorArray[soldier.forceID], soldier.emerg);
        else
            icon = this.createSoldierIcon(colorArray[soldier.forceID], soldier.emerg);
        return icon;    
      }

      setButton(soldier){
          let button
          if (soldier.emerg == true)
            button = <div><br/> <Button variant="outline-danger" size="sm" 
                                    onClick={() => this.handlePopUpClick(soldier)}>Resolve Alert</Button></div>
          else
            button = <div></div>;
        return button
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
