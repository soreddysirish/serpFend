import React, { Component } from "react";
import queryString from 'query-string'
import axios from "axios";
import Promise from "promise"
import { host } from "./helper";
class CategoryPage extends Component {
    constructor(props) {
        super(props)
        this.state = {
            category_name: ''
        }
    }
    componentDidMount() {
        let _self = this
        let parsed = queryString.parse(this.props.location.search);
        _self.setState({
            category_name: parsed["name"]
        })
        setTimeout(function(){
            if(_self.state.category_name){
                return new Promise(function(resolve){
                    axios.get(host()+"/category/"+_self.state.category_name).then(function(json){
                        debugger
                    }).catch(function(err){
                    })
                })
            }
        },1000)
    }
    render() {
        return (
            <div>
                <h2>Category  page</h2>
            </div>
        )
    }
}
export default CategoryPage;