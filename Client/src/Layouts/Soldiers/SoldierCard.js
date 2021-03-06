
import React, { Component } from 'react';
import { MDBBtn } from "mdbreact";
import { MDBIcon } from "mdbreact";
import Image from '../../assets/Images/default-user.png';
import '../../assets/css/main.css';

export default class SoldierCard extends Component {
    constructor(props) {
        super(props);
    
    }
   
    handleClick = (event) => {
        this.props.onExitSoldierCard();
    }   
     
      
    render() {
        let pulse;
        if (this.props.pulse!=undefined){
            pulse=<div ><b>Pulse: </b>{this.props.pulse}</div>
        }
        return (
            <div style={{textAlign:"left"}}>
                <MDBBtn floating id="exitBtn" size="sm" gradient="purple" className="md-toolbar" onClick={this.handleClick}><MDBIcon icon="times" /></MDBBtn>
                <div ><img id="soldierImage" src={this.props.image!="" ? this.props.image : Image} alt={this.props.name} /></div>
                <div className="startCard"><b>Name: </b>{this.props.name}</div>
                <div ><b>Mesh ID:</b> {this.props.meshID}</div>
                <div ><b>Force ID:</b> {this.props.forceID}</div>
                <div style={{ borderBottom :"1px solid black", marginBottom:"10px", paddingBottom:"10px"}}><b>Role: </b>{this.props.role}</div>
                <div ><b>Blood: </b>{this.props.blood}</div>
                {pulse}
                
                {/* <div ><b>Acc X: </b>{this.props.acc.x}</div>
                <div ><b>Acc Y: </b>{this.props.acc.y}</div>
                <div ><b>Acc Z: </b>{this.props.acc.z}</div> */}

            </div>
        )
    }
}



