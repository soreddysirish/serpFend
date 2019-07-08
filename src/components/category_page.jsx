import React, { Component } from "react";
import queryString from 'query-string'
import axios from "axios";
import Promise from "promise"
import { host } from "./helper";
import '../react-bootstrap-table-all.min.css'
import excel_icon from '../images/excel-icon.svg'
import { BootstrapTable, TableHeaderColumn } from 'react-bootstrap-table';
import ReactExport from "react-data-export";
const ExcelFile = ReactExport.ExcelFile;
const ExcelSheet = ReactExport.ExcelFile.ExcelSheet;
const ExcelColumn = ReactExport.ExcelFile.ExcelColumn;
const catogories_list = ["AE Q1 Hotels Keywords", "Emirates - UAE Campaign", "India Flights", "India Hotels", "KSA Q1 Arabic Keywords", "KSA Q1 Keywords", "UAE Q1 Activities", "UAE Q1 Keywords", "Visa"]
class CategoryPage extends Component {
    constructor(props) {
        super(props)
        this.state = {
            category_name: '',
            category_data: [],
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
                let individual_categories = []
                if ( json.data["category_details_obj"].length > 0) {
                    json.data["category_details_obj"].map(function (k, v) {
                        let obj={}
                        obj["category_name"]=k["category_name"]
                        obj["keyword"]=k["keyword"]
                        obj["tags"] = k["tags"]
                        obj["sdRank"] = k["start_date_ranks"]["desktop_rank"]
                        obj["smRank"] = k["start_date_ranks"]["mobile_rank"]
                        obj["cdRank"] = k["current_date_ranks"]["desktop_rank"]
                        obj["cmRank"] = k["current_date_ranks"]["mobile_rank"]
                        obj["dPersentage"] = k["percentage"]["desktop_rank_percentage"]
                        obj["mPersentage"] = k["percentage"]["mobile_rank_percentage"]
                        individual_categories.push(obj)
                    })
                }
                _self.setState({ category_data:individual_categories , page_loading: false })
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
                <ExcelFile element={<span className="excel-download"><img src={excel_icon} alt="" /> Download</span>}>
                        <ExcelSheet data={category_data} name="categories data">
                            <ExcelColumn label="category" value="category_name" />  
                            <ExcelColumn label="keyword" value="keyword" />
                            <ExcelColumn label="tags" value="tags" />
                            <ExcelColumn label="start date desktop rank" value="sdRank" />
                            <ExcelColumn label="start date mobile rank" value="smRank" />
                            <ExcelColumn label="current date desktop rank" value="cdRank" />
                            <ExcelColumn label="current date mobile rank" value="cmRank" />
                            <ExcelColumn label="desktop percentabe" value="dPersentage" />
                            <ExcelColumn label="mobile percentabe" value="mPersentage" />
                        </ExcelSheet>
                    </ExcelFile>
                    <div className={page_loading ? "loading" : ""}></div>
                    <select
                        disabled={false}
                        onChange={e => this.handleChange(e, "category_name")}
                        name="category_name"
                        value={category_name}
                    >
                        {this.returnOptions(catogories_list)}
                    </select>
                    <BootstrapTable data={category_data} pagination search options={options}>
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