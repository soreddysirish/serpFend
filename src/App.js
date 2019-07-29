import React, { Component } from "react";
import './App.css';
import './react-bootstrap-table-all.min.css'
import Layout from './components/layout'
import DashBoard from './components/dash_board'
import CategoryPage from './components/category_page'
import 'bootstrap/dist/css/bootstrap.css';
import { BrowserRouter as Router, Switch, Route,Redirect } from "react-router-dom";
import jwtDecode from "jwt-decode"
class App extends Component {
  render() {
    return (<section id="ctbot-wrapper">
      <Router>
        <Layout />
          <Switch>
            <Route exact path="/" component={DashBoard} />
            <Route exact path="/dash_board" component={DashBoard} />
            <Route exact path="/category_page" component={CategoryPage} />
          </Switch>
      </Router>
    </section>)
  }
}
export default App
