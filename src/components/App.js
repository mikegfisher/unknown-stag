import React, { Component } from 'react';
import {
  BrowserRouter as Router,
  Route,
} from 'react-router-dom';

/* import components */
import Navigation from './Navigation/Navigation';

/* import pages */
import LandingPage from '../pages/Landing';
import LoginPage from '../pages/Login';
import HomePage from '../pages/Home';
import AccountPage from '../pages/Account';

/* import routes */
import * as routes from '../constants/routes';

class App extends Component {
  constructor(props) {
    super(props);
    this.state = {
    }
  }
  render() {
    return (
      <div>
      <Router>
    <div>
      <Navigation />

      <hr/>

      <Route
        exact path={routes.LANDING}
        component={() => <LandingPage />}
      />
      <Route
        exact path={routes.LOGIN}
        component={() => <LoginPage />}
      />
      <Route
        exact path={routes.HOME}
        component={() => <HomePage />}
      />
      <Route
        exact path={routes.ACCOUNT}
        component={() => <AccountPage />}
      />
    </div>
  </Router>

      
      </div>
    );
  }
}
export default App;