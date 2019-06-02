import React, { Component } from 'react';

import Map from './Map/MapView';
import { fetchSoldiers } from '../actions/soldierActions';
import Pages from './helper/pages';
import EditSoldier from './Soldiers/EditSoldier';
import { connect } from 'react-redux';
import { changePage } from '../actions/pagesActions';
import ViewSoldier from './Soldiers/ViewSoldier';
import Navbar from 'react-bootstrap/Navbar'
import Nav from 'react-bootstrap/Nav'
import Card from 'react-bootstrap/Card'

import '../assets/css/MainNew.css';
import SoldiersList from './soldiersList';

class MainNew extends React.Component{
    constructor(props){
        super(props);
        this.state = {
            type: this.props.type || 'new',
            name: this.props.name || '',
            mashId: this.props.name || -1,
            bloodType: this.props.bloodType || '',
            role: this.props.role || '',
            setNewPos: false,
        }
        this.RemoveFloatingCard = this.RemoveFloatingCard.bind();
    }

    RemoveFloatingCard(){
        this.setState({
            currPage:undefined
       })   
    }

    renderFloatingCard(){
        switch(this.props.currPage){
            case undefined:
                return(null);
                
            case 'View All Soldiers':
                return(<ViewSoldier onSelectSoldier={this.handleSelectSoldier}/>);
            
            case 'Edit Force':
                return(< EditSoldier />);    
        }
      }

      handleSelectSoldier = (soldier) => {
          this.setState({setNewPos: soldier.gps})
      }

     
  render() {
    return (
        <div>
            <Navbar bg="light" expand="lg">
                <Navbar.Brand onClick={this.props.changePage.bind(this,undefined)}>ARMS</Navbar.Brand>
                <Navbar.Toggle aria-controls="basic-navbar-nav" />
                <Navbar.Collapse id="basic-navbar-nav">
                    <Nav className="mr-auto">
                        <Nav.Link onClick={this.props.changePage.bind(this,undefined)}>Home</Nav.Link>
                        {Pages.map(({text,Icon}, index) => (
                            <Nav.Link onClick={this.props.changePage.bind(this,text)}>
                                {text}
                            </Nav.Link>
                        ))}
                    </Nav>
                    {/* search bar */}
                    <SoldiersList items={this.props.soldiers}/>
                </Navbar.Collapse>
            </Navbar>
           <div>
                <Card id="FloatingCard" style={{display:this.props.currPage === undefined ? "none" : "block"}}>
                        {this.renderFloatingCard()}
                </Card>
                <Map pos={this.state.setNewPos}/>              
         </div>
                
        </div>
    );
  }
}


  const mapStateToProps = state => ({
    currPage: state.pages.curr,
    soldiers: state.soldiers.items
  });
  
  export default connect(mapStateToProps,{changePage,fetchSoldiers})(MainNew)