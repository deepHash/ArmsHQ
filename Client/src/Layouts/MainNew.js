import React, { Component } from 'react';

import Map from './Map/MapView';
import { fetchSoldiers } from '../actions/soldierActions';
import PropTypes from 'prop-types';
import Pages from './helper/pages';
import EditSoldier from './Soldiers/EditSoldier';
import { connect } from 'react-redux';
import { changePage } from '../actions/pagesActions';
import ViewSoldier from './Soldiers/ViewSoldier';
import Navbar from 'react-bootstrap/Navbar'
import Nav from 'react-bootstrap/Nav'
import NavDropdown from 'react-bootstrap/NavDropdown'
import Form from 'react-bootstrap/Form'
import FormControl from 'react-bootstrap/FormControl'
import Button from 'react-bootstrap/Button'
import Card from 'react-bootstrap/Card'

import '../assets/css/MainNew.css';
import { NavItem } from 'react-bootstrap';

class MainNew extends React.Component{
    constructor(props){
        super(props);
        this.state = {
            type: this.props.type || 'new',
            name: this.props.name || '',
            mashId: this.props.name || -1,
            bloodType: this.props.bloodType || '',
            role: this.props.role || '',
            multiple: false,
            setNewPos: false 
        }
        this.RemoveFloatingCard = this.RemoveFloatingCard.bind()
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

      handleChange = (event) => {
        const { target: { name, value } } = event;
            // Variable to hold the original version of the list
        let currentList = [];
            // Variable to hold the filtered list before putting into state
        let newList = [];

            // If the search bar isn't empty
        if (event.target.value !== "") {
        currentList = this.props.items;
        if (!currentList) return newList;
        newList = currentList.filter(item => {
            const lc = item.name.toLowerCase();
            const filter = event.target.value.toLowerCase();
            return lc.includes(filter);
        });
        } else {
                // If the search bar is empty, set newList to original task list
        newList = this.props.items;
        }
            // Set the filtered state based on what our rules added to newList
        this.setState({
        filtered: newList
        });
    }
  render() {
    const {multiple} = this.state;
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
                        {/* <NavDropdown title="Dropdown" id="basic-nav-dropdown">
                            <NavDropdown.Item href="#action/3.1">Action</NavDropdown.Item>
                            <NavDropdown.Item href="#action/3.2">Another action</NavDropdown.Item>
                            <NavDropdown.Item href="#action/3.3">Something</NavDropdown.Item>
                            <NavDropdown.Divider />
                            <NavDropdown.Item href="#action/3.4">Separated link</NavDropdown.Item>
                        </NavDropdown> */}
                    </Nav>
                    <Form inline>
                        <FormControl type="text" placeholder="Search Soldier.." className="mr-sm-2" onChange={this.handleChange}/>
                    </Form>
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