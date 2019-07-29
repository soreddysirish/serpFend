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
import 'font-awesome/css/font-awesome.min.css';
const ExcelFile = ReactExport.ExcelFile;
const ExcelSheet = ReactExport.ExcelFile.ExcelSheet;
const ExcelColumn = ReactExport.ExcelFile.ExcelColumn;
class CategoryPage extends Component {
    constructor(props) {
        super(props)
        this.state = {
            category_name: '',
            category_data: [],
            page_loading: false,
            key_names: [],
            load_txt: 'Please wait',
            categories_keys: [],
            excelJsonObj: []
        }
        this.handleChange = this.handleChange.bind(this)
        this.getCategoryData = this.getCategoryData.bind(this)
        this.excelColumns = this.excelColumns.bind(this)
        this.generatexcelJsonObj = this.generatexcelJsonObj.bind(this)
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

    generatexcelJsonObj(resObj) {
        let excel_obj_mobile = []
        let excel_obj_desktop = []
        let _self = this
        resObj.map((v, i) => {
            let obj = v
            let type_keys = Object.keys(v["types"])
            if (type_keys.length > 0) {
                type_keys.map((val, key) => {
                    if (val == "mobile_type") {
                        let info ={}
                        info["tag_name"] = obj["tags"]["mobile_tag"] || "N/A"
                        info["device_name"] = "Mobile"
                        info["current_grank"] = obj["current_date_ranks"]["mobile_rank"] || "N/A"
                        excel_obj_mobile.push({...obj,...info})
                    } else if(val == "desktop_type") {
                        let info ={}
                        info["tag_name"] = obj["tags"]["desktop_tag"] || "N/A"
                        info["device_name"] = "Desktop"
                        info["current_grank"] = obj["current_date_ranks"]["desktop_rank"]  || "N/A"
                        excel_obj_desktop.push({...obj,...info})
                    }
                })
            }
        })
        debugger
        _self.setState({
            excelJsonObj:excel_obj_desktop.concat(excel_obj_mobile)
        })
    }

    getCategoryData() {
        let _self = this
        return new Promise(function (resolve) {
            axios.get(host() + "/category/" + _self.state.category_name).then(function (json) {
                let individual_categories = []
                if (json.data["categories_keys"] && json.data["categories_keys"].length > 0) {
                    _self.setState({ categories_keys: json.data["categories_keys"] })
                }
                if (json.data["category_details_obj"] && json.data["category_details_obj"].length > 0) {
                    json.data["category_details_obj"].map(function (k, v) {
                        const dates = [];
                        const key_names = []
                        const NUM_OF_DAYS = 30;
                        for (let i = 0; i < NUM_OF_DAYS; i++) {
                            let date = moment();
                            date.subtract(i, 'day').format('DD-MM-YYYY');
                            dates.push(date);
                        }
                        dates.map((v, key) => {
                            let key_name = moment(v._d).format("MMM Do")
                            k[key_name] = k["google_rank_history"][key] || "N/A"
                            key_names.push(key_name)
                        })
                        k["key_names"] = key_names
                        _self.setState({ key_names: key_names })
                        k["day"] = k["cycle_changes"]["day_change"]
                        k["month"] = k["cycle_changes"]["month_change"]
                        k["week"] = k["cycle_changes"]["week_change"]
                        k["life"] = k["cycle_changes"]["life_change"]
                        k["sdRank"] = k["current_date_ranks"]["desktop_intial_position"] || 'N/A'
                        k["smRank"] = k["current_date_ranks"]["moblie_intial_position"]
                        k["cdRank"] = k["current_date_ranks"]["desktop_rank"] || 'N/A'
                        k["cmRank"] = k["current_date_ranks"]["mobile_rank"]
                        k["tdRank"] = k["current_date_ranks"]["desktop_target_position"] || 'N/A'
                        k["tmRank"] = k["current_date_ranks"]["mobile_target_position"]
                        k["dPersentage"] = k["percentage"]["desktop_rank_percentage"] || 'N/A'
                        k["mPersentage"] = k["percentage"]["mobile_rank_percentage"] || 'N/A'
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
                    _self.setState({ category_data: individual_categories, page_loading: false })
                    _self.generatexcelJsonObj(individual_categories)
                } else {
                    _self.setState({
                        page_loading: false,
                        load_txt: 'No data present please add it',
                        category_data: []
                    })
                }

            }).catch(function (err) {
                _self.setState({ page_loading: false })
            })
        })
    }
    cellFormatter(cell, row, enumObject) {
        let row_value = cell
        if (cell) {
            if (enumObject == 'cmRank') {
                let current_date_mobile_value = cell
                let start_date_mobile_value = row["smRank"]
                if (parseInt(current_date_mobile_value) > parseInt(start_date_mobile_value)) {
                    row_value = "<i class='fa fa-mobile' aria-hidden='true'></i> <span class='decreased'>" + cell + "<i class='fa fa-arrow-down' aria-hidden='true'></i></span>"
                } else if (parseInt(current_date_mobile_value) < parseInt(start_date_mobile_value)) {
                    row_value = "<i class='fa fa-mobile' aria-hidden='true'></i> <span class='increased'>" + cell + "<i class='fa fa-arrow-up' aria-hidden='true'></i></span>"
                } else if (parseInt(current_date_mobile_value) == parseInt(start_date_mobile_value)) {
                    row_value = "<i class='fa fa-mobile' aria-hidden='true'></i> " + cell
                } else {
                    row_value = "<i class='fa fa-mobile' aria-hidden='true'></i> " + cell
                }
            } else if (enumObject == 'cdRank') {
                let current_date_desktop_value = cell
                let start_date_desktop_value = row["sdRank"]
                if (parseInt(current_date_desktop_value) > parseInt(start_date_desktop_value)) {
                    row_value = "<span class='decreased'>" + cell + "<i class='fa fa-arrow-down' aria-hidden='true'></i></span>"
                } else if (parseInt(current_date_desktop_value) < parseInt(start_date_desktop_value)) {
                    row_value = "<span class='increased'>" + cell + "<i class='fa fa-arrow-up' aria-hidden='true'></i></span>"
                }
            } else if (enumObject == "smRank") {
                row_value = "<i class='fa fa-mobile' aria-hidden='true'></i> " + cell
            }
        } else {
            if (cell != 0 || cell == "")
                row_value = "N/A"
        }
        return (row_value);
    }
    renderShowsTotal(start, to, total) {
        return (<p>Showing {start} to {to} of {total} entries</p>)
    }

    convertFixNum(cell, row) {
        let num = cell
        if (isNaN(num)) return num;
        if (num < 999) { return num; }
        if (num >= 1000000000) {
            return (num / 1000000000).toFixed(1).replace(/\.0$/, '') + ' G';
        }
        if (num >= 1000000) {
            return (num / 1000000).toFixed(1).replace(/\.0$/, '') + ' M';
        }
        if (num >= 1000) {
            return (num / 1000).toFixed(1).replace(/\.0$/, '') + ' K';
        }
        return num;
    }
    render() {
        const { category_name, category_data, page_loading, key_names, load_txt, categories_keys,excelJsonObj } = this.state
        var options = {
            clearSearch: true,
            noDataText: 'Loading...',
            sizePerPage: 20,
            paginationShowsTotal: this.renderShowsTotal,
            paginationPosition: 'top'
        };
        return (
            <div className="ctbot-dashboard">
                <div className="ctbot-top">
                    <span className="common-title"><b>Dashboard</b></span>
                    <div className="clearfix"></div>
                </div>
                <div className="clearfix"></div>
                <div className="monitor-tale">
                    <ExcelFile filename={category_name} alignment={{vertical:"center",horizontal:"center"}} element={<span className="excel-download"><img src={excel_icon} alt="" /> Download</span>}>
                        <ExcelSheet data={excelJsonObj} name="categories data">
                            <ExcelColumn label="Domain" value="domain" />
                            <ExcelColumn label="Keyword" value="keyword" />
                            <ExcelColumn label="Region" value="region" />
                            <ExcelColumn label="Language" value="language" />
                            <ExcelColumn label="Tags" value="tag_name" />
                            <ExcelColumn label="Type" value="device_name" />
                            <ExcelColumn label="Google Page" value="google_page" />
                            <ExcelColumn label="start" value="kw_start_position" />
                            <ExcelColumn label="Google" value="current_grank" />
                            <ExcelColumn label="Bing" value="bing_rank" />
                            <ExcelColumn label="Yahoo" value="yahoo_rank" />
                            <ExcelColumn label="Day" value="day" />
                            <ExcelColumn label="Week" value="week" />
                            <ExcelColumn label="Month" value="month" />
                            <ExcelColumn label="Life" value="life" />
                            <ExcelColumn label="Start(D)" value="sdRank" />
                            <ExcelColumn label="Start(M)" value="smRank" />
                            <ExcelColumn label="Current(D)" value="cdRank" />
                            <ExcelColumn label="Current(M)" value="cmRank" />
                            <ExcelColumn label="Target(M)" value="tdRank" />
                            <ExcelColumn label="Target(M)" value="tmRank" />
                            <ExcelColumn label="Google Ranking Url" value="google_ranking_url" />
                            <ExcelColumn label="Search Volume" value="search_volume" />
                            <ExcelColumn label="%(D)" value="dPersentage" />
                            <ExcelColumn label="%(M)" value="mPersentage" />
                            {this.excelColumns(key_names)}
                        </ExcelSheet>
                    </ExcelFile>
                    <div className={page_loading ? "loading" : ""}></div>
                    <span className="category-filter">
                    <select
                        disabled={false}
                        onChange={e => this.handleChange(e, "category_name")}
                        name="category_name"
                        value={category_name}
                    >
                        {this.returnOptions(categories_keys)}
                    </select>
                    </span>
                    <div className="clearfix"></div>
                    {category_data.length > 0 ?
                        <BootstrapTable data={category_data} pagination search options={options}>
                            {/* <TableHeaderColumn row='0' dataField='category_name' rowSpan="2" columnTitle width="220">Category</TableHeaderColumn> */}
                            <TableHeaderColumn row='0' dataField='keyword' isKey rowSpan="2" columnTitle filter={{ type: 'TextFilter', placeholder: 'search by keyword' }} width="200"> Keyword</TableHeaderColumn>
                            {/* <TableHeaderColumn row='0' dataField='tags' rowSpan="2" columnTitle width="200">Tags</TableHeaderColumn> */}
                            <TableHeaderColumn row='0' colSpan='2' headerAlign='center'>Initial Rank</TableHeaderColumn>
                            <TableHeaderColumn row='1' dataField='smRank' dataFormat={this.cellFormatter} formatExtraData="smRank"
                            >Mobile</TableHeaderColumn>
                            <TableHeaderColumn row='1' dataField='sdRank' dataFormat={this.cellFormatter} formatExtraData="sdRank">Desktop</TableHeaderColumn>
                            <TableHeaderColumn row='0' colSpan='2' headerAlign='center'>Current Rank</TableHeaderColumn>
                            <TableHeaderColumn row='1' dataField='cmRank' dataFormat={this.cellFormatter} formatExtraData="cmRank">Mobile</TableHeaderColumn>
                            <TableHeaderColumn row='1' dataField='cdRank' dataFormat={this.cellFormatter} formatExtraData="cdRank">Desktop</TableHeaderColumn>
                            <TableHeaderColumn row='0' colSpan='2' headerAlign='center'>Target Rank</TableHeaderColumn>
                            <TableHeaderColumn row='1' dataField='tmRank' dataFormat={this.cellFormatter} formatExtraData="tmRank">Mobile</TableHeaderColumn>
                            <TableHeaderColumn row='1' dataField='tdRank' dataFormat={this.cellFormatter} formatExtraData="tdRank">Desktop</TableHeaderColumn>
                            <TableHeaderColumn row='0' colSpan='2' headerAlign='center'>%</TableHeaderColumn>
                            <TableHeaderColumn row='1' dataField='mPersentage'>Mobile</TableHeaderColumn>
                            <TableHeaderColumn row='1' dataField='dPersentage'>Desktop</TableHeaderColumn>
                            <TableHeaderColumn row='0' dataField='search_volume' dataFormat={this.convertFixNum} rowSpan="2" columnTitle>Search Volume </TableHeaderColumn>
                        </BootstrapTable> : <div>{load_txt}</div>}
                </div>
            </div>
        )
    }
}
export default CategoryPage;