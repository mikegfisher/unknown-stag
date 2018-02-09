import React from 'react';
import { Link } from 'react-router-dom';
import './Navigation.css';

import * as routes from '../../constants/routes';

const Navigation = () =>
  <div>
    <nav>
      <div className="nav-wrapper">
        <Link className="brand-logo" to={routes.LANDING}>Unknown Stag</Link>
        <ul id="nav-mobile" className="right hide-on-med-and-down">
          <li><Link to={routes.SESSIONS}>Sessions</Link></li>
          <li><Link to={routes.LOGIN}>Log in</Link></li>
        </ul>
      </div>
    </nav>
  </div>

export default Navigation;