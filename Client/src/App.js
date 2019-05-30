import React, { Component } from 'react';
import './App.css';
import { Provider } from 'react-redux';
import store from './store';

import Main from './Layouts/main';
import NavBar from './Layouts/navbar';
import AddSoldier from './Layouts/addSoldier'

class App extends Component {

  render() {
    return (
      <Provider store={store}>
        <div className="App">
          {/* <NavBar /> */}
          <Main />
          {/* <AddSoldier /> */}
        </div>
      </Provider>
    );
  }
}

export default App;
