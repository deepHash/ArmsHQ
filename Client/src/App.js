import React, { Component } from 'react';
import Header from './Layouts/Header';
import Map from './Layouts/MapView';
import './App.css';

class App extends Component {

  render() {
    return (
      <div className="App">
        <Header/>
        <Map/>
      </div>
    );
  }
}

export default App;
