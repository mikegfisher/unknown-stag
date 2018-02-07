import React from 'react';
import { Link } from 'react-router-dom';

import * as routes from '../../constants/routes';

const Navigation = () =>
  <div>
    <nav>
    <div class="nav-wrapper">
      <Link class="brand-logo" to={routes.LANDING}>Unknown Stag</Link>
      <ul id="nav-mobile" class="right hide-on-med-and-down">
        <li><Link to={routes.SESSIONS}>Sessions</Link></li>
        <li><Link to={routes.LOGIN}>Log in</Link></li>
      </ul>
    </div>
  </nav>
  </div>

export default Navigation;