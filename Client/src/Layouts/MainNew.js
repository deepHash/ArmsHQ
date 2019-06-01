import React, { Component } from 'react';

import Map from './Map/MapView';

import PropTypes from 'prop-types';

import Pages from './helper/pages';

import EditSoldier from './Soldiers/EditSoldier';

import '../assets/css/main.css';
import { connect } from 'react-redux';
import { changePage } from '../actions/pagesActions';
import ViewSoldier from './Soldiers/ViewSoldier';
import Header from './Header';
import '../assets/css/MainNew.css';

export default class MainNew extends Component {
  
  render() {

    return (
        <div>
            <Header/>
            <Map/>
        </div>
    );
  }
}


const mapStateToProps = state => ({
  currPage: state.pages.curr
  //socket: state.socket
});

