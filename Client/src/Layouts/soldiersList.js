
import React, { Component } from 'react';

import '../assets/css/Search.css';
import Form from 'react-bootstrap/Form'
import FormControl from 'react-bootstrap/FormControl'
import { MDBBtn } from "mdbreact";
import { MDBIcon } from "mdbreact";

export default class SoldiersList extends Component {
    constructor(props) {
        super(props);
        this.state = {
            filtered: [],
            isFocus:false,
        }
        this.handleChange = this.handleChange.bind(this);
        
    }

    componentDidMount() {
        this.setState({
          filtered: this.props.items
        });
      }
      
      componentWillReceiveProps(nextProps) {
        this.setState({
          filtered: nextProps.items
        });
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
        if (this.state.filtered.length!=this.props.items.length) this.setState({isFocus:true})
    }

    handleClick = (event) => {
        this.setState({ isFocus:this.state.isFocus===true?false:true });
    }

      render() {
        const { classes } = this.props;

        return (
            <div>
            <Form inline></Form>
                <FormControl type="text" placeholder="Search Soldier.." className="mr-sm-2" onChange={this.handleChange} onClick={this.handleClick}/>
                <ul style={{display: this.state.isFocus ? 'block' : 'none' }}>
                    <li id="hideSearch" onClick={this.handleClick}>
                        <MDBBtn floating size="sm" gradient="purple" className="md-toolbar"><MDBIcon  icon="times" /></MDBBtn>
                    </li>
                    {this.state.filtered.map(item => (
                        <li className="list-group-item" data-category={item} key={item.mashId}>{item.name}</li>
                    ))}
                </ul>
             
            </div>
        )
    }
}

