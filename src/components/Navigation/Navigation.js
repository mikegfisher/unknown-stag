import React from 'react';
import { Link } from 'react-router-dom';
import './Navigation.css';

import * as routes from '../../constants/routes';

const Navigation = () =>
  <div>
    <nav>
      <div className="nav-wrapper">
        <Link className="brand-logo" to={routes.SESSIONS}>Unknown Stag</Link>
      </div>
    </nav>
  </div>

export default Navigation;