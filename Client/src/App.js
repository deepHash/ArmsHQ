import React, { Component } from 'react';
import './App.css';
import { Provider } from 'react-redux';
import store from './store';

import Main from './Layouts/main';
import NavBar from './Layouts/navbar';
import MainNew from './Layouts/MainNew';


class App extends Component {

  render() {
    return (
      <Provider store={store}>
        <div className="App">
          <MainNew />
        </div>
      </Provider>
    );
  }
}

export default App;
