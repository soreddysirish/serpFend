import React, { Component } from "react";
import jwtDecode from "jwt-decode"
export default class Login extends Component {
    constructor(props) {
        super([props])
    }
    render() {
        let jwtDecode_val = jwtDecode("eyJhbGciOiJIUzI1NiJ9.eyJkYXRhIjp7Im5hbWUiOiJTSVJJU0gifSwiZXhwIjoxNTY0Mzg0MDM0fQ.IJGEogWCzVD_lcMEBZmpnlFhBW0YmTOPTs2jwb6vmv4")
        let exp = jwtDecode_val["exp"]
        exp < new Date().getTime() / 1000
        return (<p>Login</p>)
    }
}