import React, { Component } from "react";
import { NavLink } from "react-router-dom";
class Layout extends Component {
    render() {
        return (<div>
            <ul>
                <li>
                    <NavLink to="/dash_board" activeClassName="current sidebarLinks">
                        Dash Board
                </NavLink>
                </li>
                <li>
                    {/* <NavLink to="/category_page" activeClassName="current sidebarLinks">
                        filter by category
                </NavLink> */}
                </li>
            </ul>
        </div>)
    }
}

export default Layout;
