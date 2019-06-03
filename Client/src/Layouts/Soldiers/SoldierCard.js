
import React, { Component } from 'react';
import '../../assets/css/MainNew.css';
import { MDBBtn } from "mdbreact";
import { MDBIcon } from "mdbreact";
import '../../assets/css/MainNew.css';

export default class SoldierCard extends Component {
    constructor(props) {
        super(props);
    
    }
    handleClick = (event) => {
        this.props.onExitSoldierCard();
    }   
    render() {

        return (
            <div style={{textAlign:"left"}}>
                <MDBBtn floating id="exitBtn" size="sm" gradient="purple" className="md-toolbar" onClick={this.handleClick}><MDBIcon  icon="times" /></MDBBtn>
                <div className="startCard"><b>Name: </b>{this.props.name}</div>
                <div ><b>Mesh ID:</b> {this.props.meshID}</div>
                <div style={{ borderBottom :"1px solid black", marginBottom:"10px", paddingBottom:"10px"}}><b>Role: </b>{this.props.role}</div>
                <div ><b>Blood: </b>{this.props.blood}</div>
                <div ><b>Pulse: </b>{this.props.pulse}</div>
                <div ><b>Acc: </b>{this.props.acc}</div>
            </div>
        )
    }
}



