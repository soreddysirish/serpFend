import React, { Component } from "react";
import queryString from 'query-string'
import axios from "axios";
import Promise from "promise"
import { host, checkSession } from "./helper";
import '../react-bootstrap-table-all.min.css'
import excel_icon from '../images/excel-icon.svg'
import { BootstrapTable, TableHeaderColumn } from 'react-bootstrap-table';
import ReactExport from "react-data-export";
import moment from 'moment'
import Chart from "react-apexcharts";
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
            excelJsonObj: [],
            isLogin: true,
            formated_cat_name: '',
            week_ranks: [],
            category_keyword_rankings: [],
            pieChartFilterVal: 'desktop',
            top_1: {
                options: {
                    labels: []
                },
                series: []
            },
            top_2_3: {
                options: {
                    labels: []
                }, series: []
            },
            top_4_10: {
                options: {
                    labels: []
                }, series: []
            },
            above_10: {
                options: {
                    labels: []
                }, series: []
            }
        }
        this.handleChange = this.handleChange.bind(this)
        this.handleChartTypeChange = this.handleChartTypeChange.bind(this)
        this.getCategoryData = this.getCategoryData.bind(this)
        this.excelColumns = this.excelColumns.bind(this)
        this.generatexcelJsonObj = this.generatexcelJsonObj.bind(this)
        this.formatCatogory_name = this.formatCatogory_name.bind(this)
        this.setChartData = this.setChartData.bind(this)
    }

    handleChange(e, fieldName) {
        if (checkSession()) {
            let _self = this
            _self.setState({ [fieldName]: e.target.value, page_loading: true })
            setTimeout(function () {
                if (window.history.pushState) {
                    let newurl = window.location.protocol + "//" + window.location.host + window.location.pathname + '?name=' + _self.state.category_name
                    window.history.pushState({ path: newurl }, '', newurl);
                }
                _self.getCategoryData()
            }, 500)
        } else {
            return window.location.href = "/login"
        }
    }
    handleChartTypeChange(e, fieldName) {
        let _self = this
        _self.setState({
            pieChartFilterVal: e.target.value
        })
        setTimeout(function(){
            _self.setChartData(_self.state.category_keyword_rankings)
        },5)
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
        if (!checkSession()) {
            _self.setState({
                isLogin: false
            })
        } else {
            _self.setState({
                isLogin: true
            })
        }
        let parsed = queryString.parse(this.props.location.search);
        let formatCatogory_name = this.formatCatogory_name(parsed['name']) || ''
        _self.setState({
            category_name: parsed["name"],
            page_loading: true,
            formated_cat_name: formatCatogory_name
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
                        let info = {}
                        info["tag_name"] = obj["tags"]["mobile_tag"] || "N/A"
                        info["device_name"] = "Mobile"
                        info["current_grank"] = obj["current_date_ranks"]["mobile_rank"] || "N/A"
                        excel_obj_mobile.push({ ...obj, ...info })
                    } else if (val == "desktop_type") {
                        let info = {}
                        info["tag_name"] = obj["tags"]["desktop_tag"] || "N/A"
                        info["device_name"] = "Desktop"
                        info["current_grank"] = obj["current_date_ranks"]["desktop_rank"] || "N/A"
                        excel_obj_desktop.push({ ...obj, ...info })
                    }
                })
            }
        })
        _self.setState({
            excelJsonObj: excel_obj_desktop.concat(excel_obj_mobile)
        })
    }
    pieChartDynamicObj(type, obj, filterVal) {
        if (obj.length > 0) {
            let labels = []
            let series = []
            let colors = ['#FA4443', 'rgba(15,113,9,1)']
            let heading = type
            let total_text =''
            labels.push(filterVal + "_start_" + type)
            labels.push(filterVal + "_current_" + type)
            series.push(obj[0][labels[0]])
            series.push(obj[1][labels[1]])
            heading = heading.replace(/_/g, ' ')
            heading = heading.charAt(0).toUpperCase() + heading.substr(1).toLowerCase()
            let number = heading.match(/[\d\.]+/g)
            heading = heading.replace(/\d+/g, '') + number.join("-")
            if (series[0] > series[1]) {
                colors = colors.reverse()
            }
            total_text = "Total: "+series.reduce((a,b) => a+b,0) 
            return {
                options: {
                    labels: ["Starting position", "Current position"],
                    legend: {
                        show: true,
                        showForSingleSeries: false,
                        showForNullSeries: true,
                        showForZeroSeries: true,
                        position: 'bottom',
                        floating: false,
                        fontSize: '14px',
                        fontFamily: 'Helvetica, Arial',
                        formatter: function (seriesName, opts) {
                            return [seriesName + " (" + opts.w.globals.series[opts.seriesIndex] + ")"]
                        }
                    },
                    subtitle: {
                        text: total_text,
                        align: 'left',
                        margin: 10,
                        offsetX: 0,
                        offsetY: 0,
                        floating: false,
                        style: {
                          fontSize:  '16px',
                          color: '#4c4c4c'
                        },
                    },
                    colors: colors,
                    animations: {
                        enabled: true,
                        easing: 'linear',
                        speed: 1000,
                        animateGradually: {
                            enabled: true,
                            delay: 1000
                        },
                        dynamicAnimation: {
                            enabled: true,
                            speed: 1000
                        }
                    },
                    title: {
                        text: heading,
                        align: 'center',
                        margin: 0,
                        offsetX: 0,
                        offsetY: 0,
                        floating: false,
                        style: {
                            fontSize: '25px',
                            color: '#263238'
                        },
                    }
                },
                series: series
            }
        }
    }

    setChartData(obj) {
        let _self = this
        let top_1 = _self.pieChartDynamicObj("top_1", obj, _self.state.pieChartFilterVal)
        let top_2_3 = _self.pieChartDynamicObj("top_2_3", obj, _self.state.pieChartFilterVal)
        let top_4_10 = _self.pieChartDynamicObj("top_4_10", obj, _self.state.pieChartFilterVal)
        let above_10 = _self.pieChartDynamicObj("above_10", obj, _self.state.pieChartFilterVal)
        _self.setState({
            top_1: top_1, top_2_3: top_2_3, top_4_10: top_4_10, above_10: above_10
        })
    }

    getCategoryData() {
        let _self = this
        let formatCatogory_name = _self.formatCatogory_name(_self.state.category_name) || ''
        return new Promise(function (resolve) {
            axios.get(host() + "/category/" + _self.state.category_name).then(function (json) {
                let individual_categories = []
                if (json.data["categories_keys"] && json.data["categories_keys"].length > 0) {
                    _self.setState({ categories_keys: json.data["categories_keys"] })
                }
                if (json.data["category_keyword_rankings"] && json.data["category_keyword_rankings"].length > 0) {
                    _self.setState({ category_keyword_rankings: json.data["category_keyword_rankings"] })
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
                        _self.setState({ key_names: key_names, week_ranks: key_names.splice(0, 7) })
                        k["day"] = k["cycle_changes"]["day_change"]
                        k["month"] = k["cycle_changes"]["month_change"]
                        k["week"] = k["cycle_changes"]["week_change"]
                        k["life"] = k["cycle_changes"]["life_change"]
                        k["sdRank"] = k["current_date_ranks"]["desktop_intial_position"] || k['start_date_ranks']['desktop_intial_position'] || 'N/A'
                        k["smRank"] = k["current_date_ranks"]["moblie_intial_position"] || k['start_date_ranks']['moblie_intial_position'] || 'N/A'
                        k["cdRank"] = k["current_date_ranks"]["desktop_rank"] || k["start_date_ranks"]["desktop_rank"] || 'N/A'
                        k["cmRank"] = k["current_date_ranks"]["mobile_rank"] || k["start_date_ranks"]["mobile_rank"] || 'N/A'
                        k["tdRank"] = k["current_date_ranks"]["desktop_target_position"] || k["start_date_ranks"]["desktop_target_position"] || 'N/A'
                        k["tmRank"] = k["current_date_ranks"]["mobile_target_position"] || k["start_date_ranks"]["mobile_target_position"] || 'N/A'
                        k["dPersentage"] = k["percentage"]["desktop_rank_percentage"]
                        k["mPersentage"] = k["percentage"]["mobile_rank_percentage"]
                        k["search_volume"] = k["search_volume"] || "N/A"
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
                    _self.setState({ category_data: individual_categories, page_loading: false, formated_cat_name: formatCatogory_name })
                    _self.generatexcelJsonObj(individual_categories)
                    _self.setChartData(json.data["category_keyword_rankings"])
                } else {
                    _self.setState({
                        page_loading: false,
                        load_txt: 'No data present please add it',
                        category_data: [],
                        excelJsonObj: [],
                        formated_cat_name: formatCatogory_name
                    })
                }

            }).catch(function (err) {
                _self.setState({
                    page_loading: false,
                    load_txt: 'No data present please add it',
                    category_data: [],
                    excelJsonObj: []
                })
            })
        })
    }
    cellFormatter(cell, row, enumObject) {
        let row_value = cell
        if (cell) {
            if (enumObject == "smRank") {
                let starting_mobile_rank = parseInt(row['smRank']) || "N/A"
                let current_mobile_rank = parseInt(row['cmRank']) || "N/A"
                if (current_mobile_rank !== "N/A" && starting_mobile_rank !== "N/A" && current_mobile_rank > starting_mobile_rank) {
                    row_value = "<span class='decreased'>" + current_mobile_rank + "</span><span> (" + starting_mobile_rank + ")</span><span class='decreased'><i class='fa fa-arrow-down' aria-hidden='true'></i></span>"
                } else if (current_mobile_rank !== "N/A" && starting_mobile_rank !== "N/A" && current_mobile_rank < starting_mobile_rank) {
                    row_value = "<span class='increased'>" + current_mobile_rank + "</span><span> (" + starting_mobile_rank + ")</span><span class='increased'><i class='fa fa-arrow-up' aria-hidden='true'></i></span>"
                } else if (current_mobile_rank == starting_mobile_rank) {
                    row_value = current_mobile_rank + " (" + starting_mobile_rank + ")"
                } else {
                    row_value = current_mobile_rank + " (" + starting_mobile_rank + ")"
                }
            } else if (enumObject == "sdRank") {
                let starting_desktop_rank = parseInt(row['sdRank']) || "N/A"
                let current_desktop_rank = parseInt(row['cdRank']) || "N/A"

                if (current_desktop_rank !== "N/A" && starting_desktop_rank !== "N/A" && current_desktop_rank > starting_desktop_rank) {
                    row_value = "<span class='decreased'>" + current_desktop_rank + "</span><span> (" + starting_desktop_rank + ")</span><span class='decreased'><i class='fa fa-arrow-down' aria-hidden='true'></i></span>"
                } else if (current_desktop_rank !== "N/A" && starting_desktop_rank !== "N/A" && current_desktop_rank < starting_desktop_rank) {
                    row_value = "<span class='increased'>" + current_desktop_rank + "</span><span> (" + starting_desktop_rank + ")</span><span class='increased'><i class='fa fa-arrow-up' aria-hidden='true'></i></span>"
                } else if (current_desktop_rank == starting_desktop_rank) {
                    row_value = current_desktop_rank + " (" + starting_desktop_rank + ")"
                } else {
                    row_value = current_desktop_rank + " (" + starting_desktop_rank + ")"
                }
            }
        }
        else {
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
            return (num / 1000000000).toFixed(1).replace(/\.0$/, '') + 'G';
        }
        if (num >= 1000000) {
            return (num / 1000000).toFixed(1).replace(/\.0$/, '') + 'M';
        }
        if (num >= 1000) {
            return (num / 1000).toFixed(1).replace(/\.0$/, '') + 'K';
        }
        return num;
    }
    formatCatogory_name(cat) {
        let cat_name_key = cat.replace(/[_-\s]/g, " ").replace("  ", "").toLowerCase();
        let category_formatted = cat_name_key.charAt(0).toUpperCase() + cat_name_key.slice(1);
        return category_formatted
    }
    percentArcheived(cell, row, enumObject) {
        if (typeof (cell) === 'undefined' || cell === null) {
            cell = "N/A"
            return cell
        }
        if (enumObject === "mPersentage" && row['tmRank'] == "N/A") {
            cell = "N/A"
            return cell
        } else if (enumObject === "dPersentage" && row['tdRank'] == "N/A") {
            cell = "N/A"
            return cell
        }
        if (cell > 0 || cell == 0) {
            cell = "<span class='archived'>Achieved</span>"
        } else {
            if (cell !== "N/A") {
                cell += " %"
            }
        }
        return cell
    }

    excelColumns = options => {
        return options.map((opt, idx) => {
            return (
                <ExcelColumn label={opt} value={opt} key={idx} />
            );
        });
    }

    revertSortFunc(a, b, order, field, enumObject) {
        if (order === 'desc') {
            if (enumObject == 'mobile') {
                return a['cmRank'] - b['cmRank'];
            } else {
                return a['cdRank'] - b['cdRank'];
            }
        } else {
            if (enumObject == 'mobile') {
                return b['cmRank'] - a['cmRank'];
            } else {
                return b['cdRank'] - a['cdRank'];
            }
        }
    }
    render() {
        const { isLogin, category_name, category_data, page_loading, key_names, load_txt, categories_keys, excelJsonObj, formated_cat_name, week_ranks, category_keyword_rankings, pieChartFilterVal, top_1, top_2_3, top_4_10, above_10 } = this.state
        if (!isLogin) {
            return window.location.href = "/login"
        }
        var options = {
            clearSearch: true,
            noDataText: 'Loading...',
            sizePerPage: 20,
            paginationShowsTotal: this.renderShowsTotal,
            defaultSortName: 'search_volume',
            defaultSortOrder: 'desc'
        };
        return (
            <div className="ctbot-dashboard category-page">
                {category_keyword_rankings.length > 0 ?
                    <div id="chart">
                        <div className="category-filter-chart">
                            <select
                                disabled={false}
                                onChange={e => this.handleChartTypeChange(e, "chart_type")}
                                name="chart_type"
                                value={pieChartFilterVal}
                            >
                                <option name="desktop" value='desktop'>Desktop</option>
                                <option name="mobile" value='mobile'>Mobile</option>
                            </select>
                        </div>
                        <ul className="pieChartList">
                            <li><Chart
                                options={top_1.options}
                                series={top_1.series}
                                type="pie"
                                width="300"
                            />
                            </li>
                            <li>
                                <Chart
                                    options={top_2_3.options}
                                    series={top_2_3.series}
                                    type="pie"
                                    width="300"
                                />
                            </li>
                            <li>
                                <Chart
                                    options={top_4_10.options}
                                    series={top_4_10.series}
                                    type="pie"
                                    width="300"
                                />
                            </li>
                            <li>
                                <Chart
                                    options={above_10.options}
                                    series={above_10.series}
                                    type="pie"
                                    width="300"
                                />
                            </li>
                        </ul>
                    </div> : ''}
                <div className="ctbot-top">
                    <div className="common-title">List of keywords in <b><span className="categoryName">{formated_cat_name}</span></b></div>
                    <button type="button" className="bckBtn"><a href="/" className="bckAncorTag">Back</a></button>
                    <div className="clearfix"></div>
                </div>
                <div className="clearfix"></div>
                <div className="monitor-tale">
                    <div className="category-filter">
                        <select
                            disabled={false}
                            onChange={e => this.handleChange(e, "category_name")}
                            name="category_name"
                            value={category_name}
                        >
                            {this.returnOptions(categories_keys)}
                        </select>
                        {excelJsonObj && excelJsonObj.length > 0 ?
                            <ExcelFile filename={category_name} alignment={{ vertical: "center", horizontal: "center" }} element={<span className="excel-download excel-individual-category"><img src={excel_icon} alt="" /> Download</span>}>
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
                                    <ExcelColumn label="Target(D)" value="tdRank" />
                                    <ExcelColumn label="Target(M)" value="tmRank" />
                                    <ExcelColumn label="Google Ranking Url" value="google_ranking_url" />
                                    <ExcelColumn label="Search Volume" value="search_volume" />
                                    <ExcelColumn label="%(D)" value="dPersentage" />
                                    <ExcelColumn label="%(M)" value="mPersentage" />
                                    {this.excelColumns(key_names)}
                                </ExcelSheet>
                            </ExcelFile> : ''}
                    </div>
                    <div className="clearfix"></div>
                    <div className={page_loading ? "loading" : ""}></div>
                    {category_data.length > 0 ?
                        <BootstrapTable data={category_data} pagination search options={options} keyField="keyword" >
                            <TableHeaderColumn row='0' dataField='keyword' headerAlign='center' rowSpan="2" columnTitle filter={{ type: 'TextFilter', placeholder: 'search by keyword' }} width="250"
                            >Keyword</TableHeaderColumn>
                            <TableHeaderColumn row='0' colSpan='2' headerAlign='center' width="110">Current rank(Starting rank)</TableHeaderColumn>
                            <TableHeaderColumn row='1' dataField='smRank' dataFormat={this.cellFormatter} formatExtraData="smRank" dataAlign='center' width="85" dataSort={true} sortFunc={this.revertSortFunc} sortFuncExtraData={'mobile'}
                            ><i className="fa fa-mobile" aria-hidden="true"></i></TableHeaderColumn>
                            <TableHeaderColumn row='1' dataField='sdRank' dataFormat={this.cellFormatter} formatExtraData="sdRank" dataAlign='center' width="85" dataSort={true} sortFunc={this.revertSortFunc} sortFuncExtraData={'desktop'}><i className="fa fa-desktop" aria-hidden="true"></i></TableHeaderColumn>
                            <TableHeaderColumn row='0' colSpan='2' headerAlign='center'>Target rank</TableHeaderColumn>
                            <TableHeaderColumn row='1' dataField='tmRank' dataFormat={this.cellFormatter} formatExtraData="tmRank" headerAlign='center' dataAlign='center' width="75"><i className="fa fa-mobile" aria-hidden="true"></i>
                            </TableHeaderColumn>
                            <TableHeaderColumn row='1' dataField='tdRank' dataFormat={this.cellFormatter} formatExtraData="tdRank" headerAlign='center' dataAlign='center' width="75"><i className="fa fa-desktop" aria-hidden="true"></i>
                            </TableHeaderColumn>
                            {/* map is not working in bootstrap table */}
                            <TableHeaderColumn row='0' colSpan='7' headerAlign='center'>Ranks from past one week</TableHeaderColumn>
                            <TableHeaderColumn row='1' width="60" dataField={week_ranks[0]}>{week_ranks[0]} </TableHeaderColumn>
                            <TableHeaderColumn row='1' width="60" dataField={week_ranks[1]}>{week_ranks[1]} </TableHeaderColumn>
                            <TableHeaderColumn row='1' width="60" dataField={week_ranks[2]}>{week_ranks[2]} </TableHeaderColumn>
                            <TableHeaderColumn row='1' width="60" dataField={week_ranks[3]}>{week_ranks[3]} </TableHeaderColumn>
                            <TableHeaderColumn row='1' width="60" dataField={week_ranks[4]}>{week_ranks[4]} </TableHeaderColumn>
                            <TableHeaderColumn row='1' width="60" dataField={week_ranks[5]}>{week_ranks[5]} </TableHeaderColumn>
                            <TableHeaderColumn row='1' width="60" dataField={week_ranks[6]}>{week_ranks[6]} </TableHeaderColumn>
                            <TableHeaderColumn row='0' colSpan='2' headerAlign='center'>Target %</TableHeaderColumn>
                            <TableHeaderColumn row='1' dataField='mPersentage' dataFormat={this.percentArcheived} dataAlign='left' width="90" headerAlign="center" formatExtraData="mPersentage" ><i className="fa fa-mobile" aria-hidden="true"></i>
                            </TableHeaderColumn>
                            <TableHeaderColumn row='1' dataField='dPersentage' dataFormat={this.percentArcheived} dataAlign='left' headerAlign="center" width="90" formatExtraData="dPersentage"><i className="fa fa-desktop" aria-hidden="true" ></i>
                            </TableHeaderColumn>
                            <TableHeaderColumn row='0' dataField='search_volume' dataFormat={this.convertFixNum} rowSpan="2" width="80" columnTitle dataSort={true}>Search volume </TableHeaderColumn>
                        </BootstrapTable> : <div>{load_txt}</div>}
                </div>
            </div>
        )
    }
}
export default CategoryPage;


