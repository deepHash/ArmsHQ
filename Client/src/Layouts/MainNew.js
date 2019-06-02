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
            // filtered: [],

        }
        this.RemoveFloatingCard = this.RemoveFloatingCard.bind();
        // this.handleChange = this.handleChange.bind(this);

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
    //   componentDidMount() {
    //     this.setState({
    //       filtered: this.props.items
    //     });
    //     console.log(this.state.list)
    //   }
      
    //   componentWillReceiveProps(nextProps) {
    //     this.setState({
    //       filtered: nextProps.items
    //     });
    //   }
    //   handleChange = (event) => {
    //     const { target: { name, value } } = event;
    //         // Variable to hold the original version of the list
    //     let currentList = [];
    //         // Variable to hold the filtered list before putting into state
    //     let newList = [];

    //         // If the search bar isn't empty
    //     if (event.target.value !== "") {
    //     currentList = this.props.items;
    //     if (!currentList) return newList;
    //     newList = currentList.filter(item => {
    //         const lc = item.name.toLowerCase();
    //         const filter = event.target.value.toLowerCase();
    //         return lc.includes(filter);
    //     });
    //     } else {
    //             // If the search bar is empty, set newList to original task list
    //     newList = this.props.items;
    //     }
    //         // Set the filtered state based on what our rules added to newList
    //     this.setState({
    //     filtered: newList
    //     });
    // }
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
                    {/* <Form inline>
                        <FormControl type="text" placeholder="Search Soldier.." className="mr-sm-2" onChange={this.handleChange}/>
                        <Card id="FloatingCard" style={{display:this.props.currPage === undefined ? "none" : "block"}}>
                            
                            <ul>
                                {this.state.filtered.map(item => (
                                    <li className="list-group-item" data-category={item} key={item.mashId}>{item.name}</li>
                                ))}
                            </ul>
                        </Card>
                    </Form>   */}
                    {console.log("--------------dddd------"+this.props.soldiers)}
                    <SoldiersList items={this.props.soldiers}/>

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
    currPage: state.pages.curr,
    soldiers: state.soldiers.items
  });
  
  export default connect(mapStateToProps,{changePage,fetchSoldiers})(MainNew)