import React, { Component } from "react";
import { NavLink } from "react-router-dom";
class Layout extends Component {
    render() {
        return (<div className="sidenav">
            <NavLink to="/dash_board" activeClassName="current sidebarLinks">
                Dash Board
                </NavLink>
        </div>)
    }
}

export default Layout;
