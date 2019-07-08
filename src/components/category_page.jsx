import React, { Component } from "react";
import queryString from 'query-string'
import axios from "axios";
import Promise from "promise"
import { host } from "./helper";
import '../react-bootstrap-table-all.min.css'
import excel_icon from '../images/excel-icon.svg'
import { BootstrapTable, TableHeaderColumn } from 'react-bootstrap-table';
import ReactExport from "react-data-export";
import Moment from 'react-moment';
import moment from 'moment'
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
            page_loading: false,
            key_names:[]
        }
        this.handleChange = this.handleChange.bind(this)
        this.getCategoryData = this.getCategoryData.bind(this)
        this.excelColumns = this.excelColumns.bind(this)
    }
    handleChange(e, fieldName) {
        let _self = this
        _self.setState({ [fieldName]: e.target.value, page_loading: true })
        setTimeout(function () {
            if (window.history.pushState) {
                let newurl = window.location.protocol + "//" + window.location.host + window.location.pathname + '?name=' + _self.state.category_name
                window.history.pushState({ path: newurl }, '', newurl);
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

    excelColumns = options => {
        return options.map((opt, idx) => {
            return (
                <ExcelColumn label={opt} value={opt} key={idx} />
            );
        });
    }
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
                if (json.data["category_details_obj"].length > 0) {
                    json.data["category_details_obj"].map(function (k, v) {
                        const dates = [];
                        const key_names = []
                        const NUM_OF_DAYS = 30;
                        for (let i = 0; i < NUM_OF_DAYS; i++) {
                            let date = moment();
                            date.subtract(i, 'day').format('DD-MM-YYYY');
                            dates.push(date);
                        }
                        dates.map((v,key) => {
                            let obj = {}
                            let key_name = moment(v._d).format("MMM Do")
                            k[key_name] =  k["google_rank_history"][key]
                            key_names.push(key_name)
                        })
                        k["key_names"] = key_names
                        _self.setState({key_names:key_names})
                        k["day"] = k["cycle_changes"]["day_change"]
                        k["month"] = k["cycle_changes"]["month_change"]
                        k["week"] = k["cycle_changes"]["week_change"]
                        k["life"] = k["cycle_changes"]["life_change"]
                        k["sdRank"] = k["start_date_ranks"]["desktop_rank"]
                        k["smRank"] = k["start_date_ranks"]["mobile_rank"]
                        k["cdRank"] = k["current_date_ranks"]["desktop_rank"]
                        k["cmRank"] = k["current_date_ranks"]["mobile_rank"]
                        k["dPersentage"] = k["percentage"]["desktop_rank_percentage"]
                        k["mPersentage"] = k["percentage"]["mobile_rank_percentage"]
                        if (k["types"]["desktop_type"] && k["types"]["mobile_type"]) {
                            k["type"] = "Mobile and Desktop"
                        } else if (typeof (k["types"]["desktop_type"]) == 'undefined' && k["types"]["mobile_type"]) {
                            k["type"] = "Mobile"
                        } else if (typeof (k["types"]["mobile_type"]) == 'undefined' && k["types"]["desktop_type"]) {
                            k["type"] = "Desktop"
                        }
                        k["google_rank_history"] = k["google_rank_history"].toString()
                        individual_categories.push(k)
                    })
                }
                _self.setState({ category_data: individual_categories, page_loading: false })
            }).catch(function (err) {
                _self.setState({ page_loading: false })
            })
        })
    }
    render() {
        const { category_name, category_data, page_loading,key_names } = this.state
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
                    <ExcelFile  filename={category_name} element={<span className="excel-download"><img src={excel_icon} alt="" /> Download</span>}>
                        <ExcelSheet data={category_data} name="categories data">
                            <ExcelColumn label="Domain" value="domain" />
                            <ExcelColumn label="Keyword" value="keyword" />
                            <ExcelColumn label="Region" value="region" />
                            <ExcelColumn label="Language" value="language" />
                            <ExcelColumn label="Tags" value="tags" />
                            <ExcelColumn label="Type" value="type" />
                            <ExcelColumn label="Google Page" value="google_page" />
                            <ExcelColumn label="Start" value="kw_start_position" />
                            <ExcelColumn label="Google" value="google_rank" />
                            <ExcelColumn label="Bing" value="bing_rank" />
                            <ExcelColumn label="Yahoo" value="yahoo_rank" />
                            <ExcelColumn label="Day" value="day" />
                            <ExcelColumn label="Week" value="week" />
                            <ExcelColumn label="Month" value="month" />
                            <ExcelColumn label="Life" value="life" />
                            <ExcelColumn label="Google ranking url" value="google_ranking_url" />
                            <ExcelColumn label="Search volume" value="search_volume" />
                            <ExcelColumn label="Desktop percentage" value="dPersentage" />
                            <ExcelColumn label="Mobile percentage" value="mPersentage" />
                            {/* <ExcelColumn label="Google rank history" value="google_rank_history" /> */}
                            {this.excelColumns(key_names)}
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
                        <TableHeaderColumn row='0' dataField='category_name' rowSpan="2">Category</TableHeaderColumn>
                        <TableHeaderColumn row='0' dataField='keyword' isKey rowSpan="2"> keyword</TableHeaderColumn>
                        <TableHeaderColumn row='0' dataField='tags' rowSpan="2">Tags</TableHeaderColumn>
                        <TableHeaderColumn row='0' colSpan='2' headerAlign='center'>Start</TableHeaderColumn>
                        <TableHeaderColumn row='1' dataField='smRank' >Mobile</TableHeaderColumn>
                        <TableHeaderColumn row='1' dataField='sdRank'>Desktop</TableHeaderColumn>
                        <TableHeaderColumn row='0' colSpan='2' headerAlign='center'>Current</TableHeaderColumn>
                        <TableHeaderColumn row='1' dataField='cmRank'>Mobile</TableHeaderColumn>
                        <TableHeaderColumn row='1' dataField='cdRank'>Desktop</TableHeaderColumn>
                        <TableHeaderColumn row='0' colSpan='2' headerAlign='center'>%</TableHeaderColumn>
                        <TableHeaderColumn row='1' dataField='mPersentage'>Mobile</TableHeaderColumn>
                        <TableHeaderColumn row='1' dataField='dPersentage'>Desktop</TableHeaderColumn>
                        <TableHeaderColumn row='0' dataField='search_volume' rowSpan="2">volume count</TableHeaderColumn>
                    </BootstrapTable>
                </div>
            </div>
        )
    }
}
export default CategoryPage;