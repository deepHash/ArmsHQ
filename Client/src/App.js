import React, { Component } from 'react';
import { Provider } from 'react-redux';
import store from './store';
import './App.css';

import Login from './Login';
import Main from './Layouts/main';

class App extends Component {

  render() {
    return (
      <Provider store={store}>
        <div className="App">
          {/* <Main /> */}
          <Login />
        </div>
      </Provider>
    );
  }
}

export default App;
