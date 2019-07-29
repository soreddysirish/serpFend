import React, { Component } from "react";
import jwtDecode from "jwt-decode"
export default class Login extends Component {
    constructor(props) {
        super(props)
    }
    render() {
        let jwtDecode_val = jwtDecode("eyJhbGciOiJIUzI1NiJ9.eyJkYXRhIjp7Im5hbWUiOiJTSVJJU0gifSwiZXhwIjoxNTY0Mzg0MDM0fQ.IJGEogWCzVD_lcMEBZmpnlFhBW0YmTOPTs2jwb6vmv4")
        let exp = jwtDecode_val["exp"]
        // exp < new Date().getTime() / 1000
        return (
            <div className="ctbot-dashboard">
            <div className="monitor-tale">
                <form className="form-horizontal" >
                    <div className="form-group">
                        <label className="control-label col-sm-2" for="email">Email:</label>
                        <div className="col-sm-10">
                            <input type="email" className="form-control" id="email" placeholder="User name" />
                        </div>
                    </div>
                    <div className="form-group">
                        <label className="control-label col-sm-2" for="pwd">Password:</label>
                        <div className="col-sm-10">
                            <input type="password" className="form-control" id="pwd" placeholder="Password" />
                        </div>
                    </div>
                    <div className="form-group">
                        <div className="col-sm-offset-2 col-sm-10">
                            <button type="submit" className="btn btn-default">Submit</button>
                        </div>
                    </div>
                </form>
            </div>
            </div>
        )
    }
}