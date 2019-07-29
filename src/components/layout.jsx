import React, { Component } from "react";
import { checkSession } from "./helper";
import ReactHtmlParser, { processNodes, convertNodeToElement, htmlparser2 } from 'react-html-parser';
import { Redirect } from 'react-router-dom'

class Layout extends Component {
    constructor(props) {
        super(props)
        this.state = {
            userLogin: true,
            redirect: false
        }
        this.logout = this.logout.bind(this)
    }
    logout() {
        localStorage.removeItem("token")
        this.setState({
            redirect: true
        })
    }
    render() {
        const { userLogin, redirect } = this.state
        let _self = this
        if (checkSession()) {
            setTimeout(function () {
                _self.setState({ userLogin: true })
            }, 10)
        } else {
            setTimeout(function () {
                _self.setState({ userLogin: false })
            }, 10)
        }
        if (redirect) {
            return <Redirect to={"/login"} />
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
                                <span className="profile-pic">
                                    <img src="images/profile-pic.jpeg" alt="" />
                                </span>
                                <span className="user-name">Admin</span>
                            </li>
                            <li>
                                {userLogin ?
                                    <button type="button" className="btn btn-info" onClick={this.logout}>Logout</button>
                                    : <button type="button" className="btn btn-info">{ReactHtmlParser("<a class='loginBtn' href='/login'>Login</a>")}</button>}
                            </li>
                        </ul>
                    </div>
                    <div className="clearfix" />
                </div>
            </div>
        );
    }
}

export default Layout;