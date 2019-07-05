import React, { Component } from "react";
import './App.css';
import './react-bootstrap-table-all.min.css'
import Layout from './components/layout'
import DashBoard from './components/dash_board'
import CategoryPage from './components/category_page'
import 'bootstrap/dist/css/bootstrap.css';
import { BrowserRouter as Router, Switch, Route } from "react-router-dom";
class App extends Component {
  render() {
    return (<div className="main">
      <Router>
        <Layout />
          <Switch>
            <Route exact path="/" component={DashBoard} />
            <Route exact path="/dash_board" component={DashBoard} />
            <Route exact path="/category_page" component={CategoryPage} />
          </Switch>
      </Router>
    </div>)
  }
}
export default App