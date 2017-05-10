import React from 'react';
import Signup from './Signup.jsx';
import LocalLogin from './LocalLogin.jsx';
import { HashRouter as Router, Route, Redirect, Link } from 'react-router-dom';

const Login = () => {
  return (
    <Router>    
      <div>
        <div>
          <ul>
            <li>
              <a href="/login/facebook">Login with Facebook</a>
            </li>
            <li>
              <a href="/login/google">Login with Google</a>
            </li>
            <li>
              <Link to="/login/local">Login to Account</Link>
            </li>
            <li>
              <Link to="/signup">Create an Account</Link>
            </li>
          </ul>
        </div>
        <Route path="/login/local" component={LocalLogin} />
        <Route path="/signup" component={Signup} />
      </div>
    </Router>
  )
};

export default Login;