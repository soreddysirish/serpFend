import React, { Component } from "react";
import { NavLink } from "react-router-dom";
class Layout extends Component {
    render() {
        return (
            <div>
                <div className="main-navbar">
                    <div className="rhs-nav">
                        <ul className="list-unstyled rhs-nav-links">
                            {/* <li>
                                <span className="apply-filter-btn">
                                    <i className="fa fa-plus"></i> Add New Monitor</span>
                            </li>
                            <li className="noify">
                                <i className="fa fa-bell"></i> <span className="notify-count">5</span>
                            </li> */}
                            <li>
                                <span className="profile-pic">
                                    <img src="images/profile-pic.jpeg" alt="" />
                                </span>
                                <span className="user-name">Admin</span>
                            </li>
                        </ul>
                    </div>
                    <div className="clearfix"></div>
                </div>
                <div className="side-navbar">
                    <div className="side-bar-toggle">
                        <a className="ctBrand" href="/">
                            <span className="cleartripLogo" title="Cleartrip ">Home</span>
                        </a>
                        <div className="clearfix"></div>
                    </div>
                    <ul className="list-unstyled side-nav-links">
                        <li><a href="/dash_board">Keyowrds</a></li>
                        {/* <li>
                            Flights<ul className="list-unstyled">
                                <li><a href="">Flight Schedule</a></li>
                                <li><a href="">Airline Overview</a></li>
                                <li><a href="">Flight Tickets</a></li>
                                <li><a href="">Booking Routes</a></li>
                                <li><a href="">Others</a></li>
                            </ul>
                        </li>
                        <li><a href="">Hotels</a></li>
                        <li><a href="">Calendar API</a></li>
                        <li><a href="">Bot Logs</a></li> */}
                    </ul>
                </div>
            </div>
        )
    }
}

export default Layout;
