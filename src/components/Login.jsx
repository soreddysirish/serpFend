import React, { Component } from "react";
import axios from "axios";
import Promise from "promise"
import { host, checkSession } from "./helper";
import 'react-notifications/lib/notifications.css';
import { NotificationContainer, NotificationManager } from 'react-notifications';
export default class Login extends Component {
    constructor(props) {
        super(props)
        this.state = {
            islogin: false,
            username: "",
            password: "",
            showUsernameErr: false,
            showPasswordErr: false,
            showLoginErr: false,
            passwordErrMsg: 'password required',
            usernameErrMsg: 'username required',
            page_loading: false
        }
        this.handleChage = this.handleChage.bind(this)
        this.loginSerp = this.loginSerp.bind(this)
    }
    loginSerp() {
        let _self = this
        if (_self.state.username == "") {
            _self.setState({
                showUsernameErr: true,
                usernameErrMsg: 'username required'
            })
            return false
        } else if (_self.state.password == "") {
            _self.setState({
                showPasswordErr: true,
                passwordErrMsg: 'password required',
            })
            return false
        }
        _self.setState({ page_loading: true })
        return new Promise(function (resolve) {
            axios.get(host() + "/authenticate_user", { params: { username: _self.state.username, password: _self.state.password } }).then(function (json) {
                if (json.data && json.data.token) {
                    localStorage.setItem("token", json.data.token)
                    _self.setState({
                        showLoginErr: false,
                        islogin: true
                    })
                    NotificationManager.success("success", "You are successfully loggedin", 1000)
                    setTimeout(function () {
                        return window.location.href = "/"
                    }, 1500)

                } else {
                    if (json.data && json.data.obj) {
                        let resp = json.data.obj[0]
                        if (resp["name"] && resp["name"] != "") {
                            _self.setState({
                                showUsernameErr: false,
                                usernameErrMsg: "username required",
                            })
                        } else {
                            _self.setState({
                                showUsernameErr: true,
                                usernameErrMsg: "username doesn't exists",
                                username: ""
                            })
                        }
                        if (resp["auth"]) {
                            _self.setState({
                                showPasswordErr: false,
                                passwordErrMsg: "password required"
                            })
                        } else {
                            _self.setState({
                                showPasswordErr: true,
                                passwordErrMsg: "wrong password",
                                password: ""
                            })
                        }
                    }
                }
                setTimeout(function () {
                    _self.setState({
                        page_loading: false
                    })
                }, 1400)
            }).catch(function (err) {
                _self.setState({ showLoginErr: true, username: "", password: "", islogin: false, showPasswordErr: true, passwordErrMsg: "wrong password", showUsernameErr: true, passwordErrMsg: "wrong username", page_loading: false })
                localStorage.removeItem("token")
            })
        })
    }
    componentDidMount() {
        if (checkSession()) {
            let _self = this
            _self.setState({
                islogin: true
            })
        }
    }
    handleChage(e) {
        let _self = this
        _self.setState({
            [e.target.name]: e.target.value,
            showUsernameErr: false,
            showPasswordErr: false,
            showLoginErr: false
        })
    }
    render() {
        const { username, password, showUsernameErr, showPasswordErr, page_loading, islogin, passwordErrMsg, usernameErrMsg } = this.state
        return (
            <div className="ctbot-dashboard">
                <div className={page_loading ? "loading" : ""} />
                <div className="monitor-tale">
                    <form className="form-horizontal loginForm" >
                        <div className="form-group">
                            <label className="control-label col-sm-2" htmlFor="email">Username:</label>
                            <div className="col-sm-10">
                                <input type="email" className="form-control" placeholder="Username" name="username" onChange={this.handleChage} value={username} />
                                <span className={"error " + (showUsernameErr ? '' : 'hide')}>{usernameErrMsg}</span>
                            </div>
                        </div>
                        <div className="form-group">
                            <label className="control-label col-sm-2" htmlFor="pwd">Password:</label>
                            <div className="col-sm-10">
                                <input type="password" className="form-control" id="pwd" placeholder="Password" name="password" onChange={this.handleChage} value={password} autoComplete="off" />
                                <span className={"error " + (showPasswordErr ? '' : 'hide')}>{passwordErrMsg}</span>
                            </div>
                        </div>
                        <div className="form-group">
                            <div className="col-sm-offset-2 col-sm-10">
                                <button type="button" className="btn btn-primary logInOutBtn" onClick={this.loginSerp}>Login</button>
                            </div>
                        </div>
                    </form>
                </div>
                <NotificationContainer />
            </div>
        )
    }
}