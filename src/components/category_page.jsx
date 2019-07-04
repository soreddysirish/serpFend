import React, { Component } from "react";
import queryString from 'query-string'
import axios from "axios";
import Promise from "promise"
import { host } from "./helper";
import { BootstrapTable, TableHeaderColumn } from 'react-bootstrap-table';
const catogories_list = ["AE Q1 Hotels Keywords", "Emirates - UAE Campaign", "India Flights", "India Hotels", "KSA Q1 Arabic Keywords", "KSA Q1 Keywords", "UAE Q1 Activities", "UAE Q1 Keywords", "Visa"]
class CategoryPage extends Component {
    constructor(props) {
        super(props)
        this.state = {
            category_name: '',
            category_data: [{ headings: [], main_obj: [] }],
            loading:false
        }
        this.handleChange = this.handleChange.bind(this)
        this.getCategoryData = this.getCategoryData.bind(this)
    }
    handleChange(e, fieldName) {
        let _self = this
        _self.setState({ [fieldName]: e.target.value,loading:true })
        setTimeout(function () {
            _self.getCategoryData()
        }, 500)
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
            category_name: parsed["name"],
            loading:true
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
                let obj = {}
                obj["headings"] = json.data["headings"]
                obj["main_obj"] = json.data["main_obj"]
                if (obj["main_obj"].length > 0) {
                    obj["main_obj"].map(function (k, v) {
                        k["sdRank"] = k["start_date_ranks"]["desktop_rank"]
                        k["smRank"] = k["start_date_ranks"]["mobile_rank"]
                        k["cdRank"] = k["current_date_ranks"]["desktop_rank"]
                        k["cmRank"] = k["current_date_ranks"]["mobile_rank"]
                    })
                }
                _self.setState({ category_data: obj,loading:false })
            }).catch(function (err) {
                _self.setState({loading:false})
            })
        })
    }

    render() {
        const { category_name, category_data,loading } = this.state
        const options = {
            clearSearch: true
          };
        return (
            <div>
                 <div className={loading ? "loading" : ""}></div>
                <label>Select Category</label>
                <select
                    disabled={false}
                    onChange={e => this.handleChange(e, "category_name")}
                    name="category_name"
                    value={category_name}
                >
                    {this.returnOptions(catogories_list)}
                </select>
                <BootstrapTable data={category_data["main_obj"]}  pagination search  options={ options } >
                    <TableHeaderColumn row='0' dataField='keyword' rowSpan="2" isKey>keyword</TableHeaderColumn>
                    <TableHeaderColumn row='0' dataField='category_name' rowSpan="2" >Category</TableHeaderColumn>
                    <TableHeaderColumn row='0' dataField='tags' rowSpan="2" >Tags</TableHeaderColumn>
                    <TableHeaderColumn row='0' colSpan='2' headerAlign='center'>Start</TableHeaderColumn>
                    <TableHeaderColumn row='1' dataField='smRank' >Mobile</TableHeaderColumn>
                    <TableHeaderColumn row='1' dataField='sdRank'>Desktop</TableHeaderColumn>
                    <TableHeaderColumn row='0' colSpan='2' headerAlign='center'>Current</TableHeaderColumn>
                    <TableHeaderColumn row='1' dataField='cmRank'>Mobile</TableHeaderColumn>
                    <TableHeaderColumn row='1' dataField='cdRank'>Desktop</TableHeaderColumn>
                </BootstrapTable>
            </div>
        )
    }
}
export default CategoryPage;