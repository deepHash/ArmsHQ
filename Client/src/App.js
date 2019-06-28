import React, { Component } from 'react';
import { Provider } from 'react-redux';
import store from './store';
import { BrowserRouter, Route, Switch } from "react-router-dom";
// import Login from './Login';
import Main from './Layouts/main';

class App extends Component {

  render() {
    return (
      <Provider store={store}>
        <BrowserRouter>
          <Switch>
            {/* <Route exact path="/" component={Login} /> */}
            <Route exact path="/" component={Main} />
          </Switch>
        </BrowserRouter>
      </Provider>
    );
  }
}

export default App;
