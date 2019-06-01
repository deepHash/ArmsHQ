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
            role: this.props.role || ''
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
                break;
          case 'View All Soldiers':
            return(<ViewSoldier />);
            break;
          case 'Edit Force':
            return(< EditSoldier/>);
            break;
        }
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
                        {/* <NavDropdown title="Dropdown" id="basic-nav-dropdown">
                            <NavDropdown.Item href="#action/3.1">Action</NavDropdown.Item>
                            <NavDropdown.Item href="#action/3.2">Another action</NavDropdown.Item>
                            <NavDropdown.Item href="#action/3.3">Something</NavDropdown.Item>
                            <NavDropdown.Divider />
                            <NavDropdown.Item href="#action/3.4">Separated link</NavDropdown.Item>
                        </NavDropdown> */}
                    </Nav>
                    <Form inline>
                    <FormControl type="text" placeholder="Search Soldier.." className="mr-sm-2" />
                    </Form>
                </Navbar.Collapse>
            </Navbar>
           <div>
                <Card id="FloatingCard" style={{display:this.props.currPage === undefined ? "none" : "block"}}>
                        {this.renderFloatingCard()}
                </Card>
                <Map/>              
         </div>
                
        </div>
    );
  }
}


  const mapStateToProps = state => ({
    currPage: state.pages.curr
  });
  
  export default connect(mapStateToProps,{changePage,fetchSoldiers})(MainNew)