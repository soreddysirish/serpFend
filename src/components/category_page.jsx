import React, { Component } from "react";
import queryString from 'query-string'
import axios from "axios";
import Promise from "promise"
import { host } from "./helper";
import '../react-bootstrap-table-all.min.css'
import excel_icon from '../images/excel-icon.svg'
import { BootstrapTable, TableHeaderColumn } from 'react-bootstrap-table';
const catogories_list = ["AE Q1 Hotels Keywords", "Emirates - UAE Campaign", "India Flights", "India Hotels", "KSA Q1 Arabic Keywords", "KSA Q1 Keywords", "UAE Q1 Activities", "UAE Q1 Keywords", "Visa"]
class CategoryPage extends Component {
    constructor(props) {
        super(props)
        this.state = {
            category_name: '',
            category_data: [{ headings: [], category_details_obj: [] }],
            page_loading: false
        }
        this.handleChange = this.handleChange.bind(this)
        this.getCategoryData = this.getCategoryData.bind(this)
    }
    handleChange(e, fieldName) {
        let _self = this
        _self.setState({ [fieldName]: e.target.value, page_loading: true })
        setTimeout(function () {
            if(window.history.pushState){
                let newurl = window.location.protocol + "//" + window.location.host + window.location.pathname + '?name='+_self.state.category_name
                window.history.pushState({path:newurl},'',newurl);
            }
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
            page_loading: true
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
                obj["category_details_obj"] = json.data["category_details_obj"]
                if (obj["category_details_obj"].length > 0) {
                    obj["category_details_obj"].map(function (k, v) {
                        k["sdRank"] = k["start_date_ranks"]["desktop_rank"]
                        k["smRank"] = k["start_date_ranks"]["mobile_rank"]
                        k["cdRank"] = k["current_date_ranks"]["desktop_rank"]
                        k["cmRank"] = k["current_date_ranks"]["mobile_rank"]
                        k["dPersentage"] = k["percentage"]["desktop_rank_percentage"]
                        k["mPersentage"] = k["percentage"]["mobile_rank_percentage"]
                    })
                }
                _self.setState({ category_data: obj, page_loading: false })
            }).catch(function (err) {
                _self.setState({ page_loading: false })
            })
        })
    }


    render() {
        const { category_name, category_data, page_loading } = this.state
        var options = {
            clearSearch: true,
            noDataText: 'Loading...'
        };
        return (
            <div className="ctbot-dashboard">
                <div className="ctbot-top">
                    <span className="common-title"><b>Dashboard</b></span>
                </div>
                <div className="monitor-tale">
                <span className="excel-download"><img src={excel_icon} alt="" /> Download</span>
                    <div className={page_loading ? "loading" : ""}></div>
                    <select
                        disabled={false}
                        onChange={e => this.handleChange(e, "category_name")}
                        name="category_name"
                        value={category_name}
                    >
                        {this.returnOptions(catogories_list)}
                    </select>
                    <BootstrapTable data={category_data["category_details_obj"]} pagination search options={options}>
                        <TableHeaderColumn row='0' dataField='keyword'  isKey rowSpan="2"> keyword</TableHeaderColumn>
                        <TableHeaderColumn row='0' dataField='category_name' rowSpan="2">Category</TableHeaderColumn>
                        <TableHeaderColumn row='0' dataField='tags'  rowSpan="2">Tags</TableHeaderColumn>
                        <TableHeaderColumn row='0' colSpan='2' headerAlign='center'>Start</TableHeaderColumn>
                        <TableHeaderColumn row='1' dataField='smRank' >Mobile</TableHeaderColumn>
                        <TableHeaderColumn row='1' dataField='sdRank'>Desktop</TableHeaderColumn>
                        <TableHeaderColumn row='0' colSpan='2' headerAlign='center'>Current</TableHeaderColumn>
                        <TableHeaderColumn row='1' dataField='cmRank'>Mobile</TableHeaderColumn>
                        <TableHeaderColumn row='1' dataField='cdRank'>Desktop</TableHeaderColumn>
                        <TableHeaderColumn row='0' colSpan='2' headerAlign='center'>%</TableHeaderColumn>
                        <TableHeaderColumn row='1' dataField='mPersentage'>Mobile</TableHeaderColumn>
                        <TableHeaderColumn row='1' dataField='dPersentage'>Desktop</TableHeaderColumn>
                    </BootstrapTable>
                </div>
            </div>
        )
    }
}
export default CategoryPage;