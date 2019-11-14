import React from 'react';

import { BrowserRouter, Switch, Route, Redirect } from 'react-router-dom';

import DafaultLayout from "./layout"
import Login from './pages/login';

import "./styles.css";
import 'semantic-ui-css/semantic.min.css';
import { isAuthenticated } from './services/auth';

const PrivateRoute = ({ component: Component, ...rest }) => (
  <Route
    {...rest}
    render={props =>
      isAuthenticated() ? (
         <Component {...props} />
      ) : (
          <Redirect to={{ pathname: "/login", state: { from: props.location}}} />
        )
    }
  />
);

function App() {
  return (
    <div className="App">
      <BrowserRouter basename={process.env.REACT_APP_BASE_URL}>
        <Switch>
          <Route exact path="/login" component={Login} />
          <PrivateRoute path="*" component={DafaultLayout} />
        </Switch>
      </BrowserRouter>
    </div>
  );
}

export default App;