
import React, { Component } from 'react';
import '../../assets/css/MainNew.css';
// import Divider from 'react-bootstrap/Divider'

export default class SoldierCard extends Component {
    constructor(props) {
        super(props);
    
    }

      render() {

        return (
            <div>
                <div >Name: {this.props.name}</div>
                <div >Mesh ID: {this.props.meshID}</div>
                <div >Role: {this.props.role}</div>

                <div >Blood: {this.props.blood}</div>
                <div >Pulse: {this.props.pulse}</div>
                <div >Acc: {this.props.acc}</div>
            </div>
        )
    }
}



