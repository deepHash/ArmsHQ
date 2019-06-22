import React, { Component } from 'react'
import { Marker, Popup } from 'react-leaflet';
import icons from './mapIcons';
import Leaflet from 'leaflet';
import { Button } from 'react-bootstrap';
import '../../assets/css/markers.css'

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
            className: emergency ? 'blinking' : 'soldier-location',
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
            className: emergency ? 'blinking' : 'soldier-location',
            html:   `<svg viewBox="0 0 200.000000 200.000000">
            <g transform="translate(0.000000,200.000000) scale(0.100000,-0.100000)"
            fill="#000000" stroke="none">
            <path fill=${color} d="M883 1745 c-171 -37 -321 -175 -373 -344 -23 -73 -27 -210 -8 -291
            13 -59 458 -930 482 -945 11 -7 21 -7 32 0 24 15 472 893 484 948 13 61 13
            199 -1 257 -18 79 -71 172 -134 235 -127 129 -302 179 -482 140z m85 -157
            c-11 -35 -27 -78 -34 -96 -8 -18 -14 -41 -14 -50 0 -10 -7 -28 -16 -40 -14
            -21 -22 -22 -150 -22 -106 0 -134 3 -134 13 0 25 76 132 116 164 72 56 152 91
            215 92 l37 1 -20 -62z m196 29 c32 -15 76 -41 98 -59 41 -32 118 -140 118
            -165 0 -10 -29 -13 -139 -13 l-139 0 -10 28 c-14 36 -51 146 -67 201 l-14 43
            48 -4 c26 -3 73 -17 105 -31z m242 -338 c16 -164 -78 -325 -235 -402 -61 -30
            -73 -32 -171 -32 -100 0 -109 2 -175 34 -59 30 -67 36 -51 45 9 6 31 23 48 38
            17 15 40 30 50 34 10 3 18 10 18 15 0 5 7 9 15 9 8 0 15 5 15 10 0 6 7 10 15
            10 8 0 15 4 15 8 0 19 49 32 75 20 14 -6 25 -15 25 -20 0 -4 7 -8 15 -8 8 0
            15 -4 15 -10 0 -5 7 -10 15 -10 8 0 15 -4 15 -8 0 -5 18 -18 40 -31 22 -12 40
            -26 40 -30 0 -11 48 -32 54 -23 2 4 -15 66 -39 137 l-43 130 32 27 c17 15 46
            35 64 45 17 10 32 21 32 25 0 5 7 8 15 8 8 0 15 4 15 9 0 14 64 51 73 42 4 -4
            10 -36 13 -72z m-755 54 c16 -10 29 -21 29 -25 0 -4 6 -8 14 -8 8 0 16 -4 18
            -8 2 -4 31 -27 66 -51 64 -45 68 -50 54 -67 -7 -7 -41 -109 -78 -232 -5 -19
            -34 3 -79 59 -39 50 -70 122 -80 192 -9 56 2 157 17 157 5 0 23 -8 39 -17z"/>
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
        if(soldier.emerg)
            if(soldier.isCommander)
                icon = this.createCommanderIcon(colorArray[soldier.forceID], true);
            else
                icon = this.createSoldierIcon(colorArray[soldier.forceID], true);
        else
            if(soldier.isCommander)
                icon = this.createCommanderIcon(colorArray[soldier.forceID], false);
            else
                icon = this.createSoldierIcon(colorArray[soldier.forceID], false);
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
