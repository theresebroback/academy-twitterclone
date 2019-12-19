import React from 'react';
import { HashRouter, Switch, Route } from 'react-router-dom';
import './App.css';

import Login from './components/Login';
import Feed from './components/Feed';
import Signup from './components/Signup';
import Logout from './components/Logout';
import Authenticate from './components/Authenticate';

function App() {
  return (
    <HashRouter>
      <Switch>
        <Route path="/" exact component={Authenticate} />
        <Route path="/home" component={Feed} />
        <Route path="/login" component={Login} />
        <Route path="/logout" component={Logout} />
        <Route path="/signup" component={Signup} />
      </Switch>
    </HashRouter>
  );
}

export default App;
