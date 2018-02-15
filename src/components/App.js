import React, { Component } from 'react';
import {
  BrowserRouter as Router,
  Route,
} from 'react-router-dom';

/* import components */
import Navigation from './Navigation/Navigation';
import LogIn from './LogIn/LogIn';
import Help from './Help/Help';
import LogOutFAB from './LogOutFAB/LogOutFAB';

/* import pages */
import SessionsPage from '../pages/Sessions';
import SessionPage from '../pages/Session';

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
            <LogIn />
            <Route
              exact path={routes.SESSIONS}
              component={() => <SessionsPage />}
            />
            <Route
              exact path={routes.SESSION}
              component={() => <SessionPage />}
            />
            <LogOutFAB />
          </div>
        </Router>
      </div>
    );
  }
}
export default App;