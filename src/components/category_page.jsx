import React, { Component } from "react";
import queryString from 'query-string'
import axios from "axios";
import Promise from "promise"
import { host } from "./helper";
const catogories_list = ["AE Q1 Hotels Keywords", "Emirates - UAE Campaign", "India Flights", "India Hotels", "KSA Q1 Arabic Keywords", "KSA Q1 Keywords", "UAE Q1 Activities", "UAE Q1 Keywords", "Visa"]
class CategoryPage extends Component {
    constructor(props) {
        super(props)
        this.state = {
            category_name: '',
        }
        this.handleChange = this.handleChange.bind(this)
        this.getCategoryData = this.getCategoryData.bind(this)
    }
    handleChange(e, fieldName) {
        let _self = this
        _self.setState({ [fieldName]: e.target.value })
        this.getCategoryData()
    }
    returnOptions = options => {
        return options.map((opt, idx) => {
            return (
                <option key={idx} value={opt.replace(/[^A-Z0-9]/ig, "_").replace("__", "")}>
                    {opt}
                </option>
            );
        });
    };

    componentDidMount() {
        let _self = this
        let parsed = queryString.parse(this.props.location.search);
        _self.setState({
            category_name: parsed["name"]
        })
        setTimeout(function () {
            if (_self.state.category_name) {
                _self.getCategoryData()
            }
        }, 500)
    }

    getCategoryData() {
        let _self = this
        return new Promise(function (resolve) {
            axios.get(host() + "/category/" + _self.state.category_name).then(function (json) {
                debugger
            }).catch(function (err) {
            })
        })
    }

    render() {
        const { category_name } = this.state
        return (
            <div>
                <label>Select Category</label>
                <select
                    disabled={false}
                    onChange={e => this.handleChange(e, "category_name")}
                    name="category_name"
                    value={category_name}
                >
                    {this.returnOptions(catogories_list)}
                </select>
            </div>
        )
    }
}
export default CategoryPage;