import React, { Component } from "react";
import axios from "axios";
import Promise from "promise"
import { host,checkSession } from "./helper";
import { Redirect } from 'react-router-dom'
export default class Login extends Component {
    constructor(props) {
        super(props)
        this.state = {
            islogin: false,
            username: "",
            password: "",
            showUsernameErr: false,
            showPasswordErr: false,
            showLoginErr:false
        }
        this.handleChage = this.handleChage.bind(this)
        this.loginSerp = this.loginSerp.bind(this)
    }
    loginSerp() {
        let _self = this
        if (_self.state.username == "") {
            _self.setState({ showUsernameErr: true })
            return false
        } else if (_self.state.password == "") {
            _self.setState({ showPasswordErr: true })
            return false
        }
        return new Promise(function(resolve){
            axios.get(host() +"/authenticate_user",{params:{username:_self.state.username,password:_self.state.password}}).then(function(json){
                if(json.data && json.data.token){
                    localStorage.setItem("token",json.data.token)
                    _self.setState({
                        showLoginErr: false,
                        islogin:true
                    })
                }
            }).catch(function(err){
                _self.setState({showLoginErr: true,username:"",password:"",islogin:false})
                localStorage.removeItem("token")
            })
        })
    }
    componentDidMount(){
        if(checkSession()){
            let _self = this
            _self.setState({
                islogin:true
            })
        }
    }
    handleChage(e) {
        let _self = this
        _self.setState({
            [e.target.name]: e.target.value,
            showUsernameErr: false,
            showPasswordErr: false,
            showLoginErr:false
        })
    }
    render() {
        const { username, password, showUsernameErr, showPasswordErr,showLoginErr,islogin } = this.state
        if(islogin){
            return <Redirect to={"/"} />
        }
        return (
            <div className="ctbot-dashboard">
                <div className="monitor-tale">
                    <form className="form-horizontal loginForm" >
                    <span className={"error " + (showLoginErr ? '' : 'hide')}>Please enter valid credentials</span>
                        <div className="form-group">
                            <label className="control-label col-sm-2" htmlFor="email">Username:</label>
                            <div className="col-sm-10">
                                <input type="email" className="form-control" placeholder="Username" name="username" onChange={this.handleChage} value={username} />
                                <span className={"error " + (showUsernameErr ? '' : 'hide')}>Please enter username</span>
                            </div>
                        </div>
                        <div className="form-group">
                            <label className="control-label col-sm-2" htmlFor="pwd">Password:</label>
                            <div className="col-sm-10">
                                <input type="password" className="form-control" id="pwd" placeholder="Password" name="password" onChange={this.handleChage} value={password} />
                                <span className={"error " + (showPasswordErr ? '' : 'hide')}>Please enter  password </span>
                            </div>
                        </div>
                        <div className="form-group">
                            <div className="col-sm-offset-2 col-sm-10">
                                <button type="button" className="btn btn-primary" onClick={this.loginSerp}>Submit</button>
                            </div>
                        </div>
                    </form>
                </div>
            </div>
        )
    }
}