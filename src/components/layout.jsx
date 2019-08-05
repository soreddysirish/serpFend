import React, { Component } from "react";
import { checkSession } from "./helper";
import ReactHtmlParser, {
  processNodes,
  convertNodeToElement,
  htmlparser2
} from "react-html-parser";
import 'react-notifications/lib/notifications.css';
import { NotificationContainer, NotificationManager } from 'react-notifications';

class Layout extends Component {
  constructor(props) {
    super(props);
    this.state = {
      userLogin: false,
      redirect: false
    };
    this.logout = this.logout.bind(this);
  }
  logout() {
    localStorage.removeItem("token");
    this.setState({
      redirect: true
    });
  }
  componentDidMount() {
    let _self = this;
    if (checkSession()) {
      _self.setState({ userLogin: true });
    } else {
      _self.setState({ userLogin: false });
    }
  }
  render() {
    const { userLogin, redirect } = this.state;
    if (redirect) {
      setTimeout(function () {
        setTimeout(function () {
          return window.location.href = "/login"
        }, 1000)
        NotificationManager.info("Logout", "You are successfully loggedout", 1000)
      }, 1500)
    }
    return (
      <div>
        <div className="main-navbar">
          <div className="ct-logo">
            <a className="ctBrand" href="/">
              <span className="cleartripLogo" title="Cleartrip ">
                Home
              </span>
            </a>
          </div>
          <div className="rhs-nav">
            <ul className="list-unstyled rhs-nav-links">
              <li>
                {userLogin ? (
                  <button
                    type="button"
                    className="btn btn-info logOutBtn"
                    onClick={this.logout}
                  >
                    Logout
                  </button>
                ) : (
                    <button type="button" className="btn btn-info">
                      {ReactHtmlParser(
                        "<a class='loginBtn' href='/login'>Login</a>"
                      )}
                    </button>
                  )}
              </li>
            </ul>
          </div>
          <div className="clearfix" />
        </div>
        <NotificationContainer />
      </div>
    );
  }
}

export default Layout;
