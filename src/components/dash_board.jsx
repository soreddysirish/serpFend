import React, { Component } from "react";
import axios from "axios";
import Promise from "promise"
import '../react-bootstrap-table-all.min.css'
import excel_icon from '../images/excel-icon.svg'
import { BootstrapTable, TableHeaderColumn } from 'react-bootstrap-table';
import { host } from "./helper";
import ReactHtmlParser, { processNodes, convertNodeToElement, htmlparser2 } from 'react-html-parser';
import ReactExport from "react-data-export";
const ExcelFile = ReactExport.ExcelFile;
const ExcelSheet = ReactExport.ExcelFile.ExcelSheet;
const ExcelColumn = ReactExport.ExcelFile.ExcelColumn;
class DashBoard extends Component {
    constructor(props) {
        super(props)
        this.state = {
            page_loading: true,
            catData: []
        }
    }
    componentDidMount() {
        let _self = this
        return new Promise(function (resolve) {
            axios.get(host() + "/overall_categories").then(function (json) {
                let obj = {}
                let customizedRowData = []
                if (json.data && json.data.length > 0) {
                    json.data.map(function (category, i) {
                        let tableHeaderAndValues = {}
                        tableHeaderAndValues["category"] = category["category_name"]
                        tableHeaderAndValues["count"] = category["count"]
                        tableHeaderAndValues["start_unranked"] = category["start_date_kws"]["unranked"]
                        tableHeaderAndValues["start_top_1"] = category["start_date_kws"]["rank_1"]
                        tableHeaderAndValues["start_top_2_3"] = category["start_date_kws"]["rank_2_3"]
                        tableHeaderAndValues["start_top_4_10"] = category["start_date_kws"]["rank_4_10"]
                        tableHeaderAndValues["start_rank_above_10"] = category["start_date_kws"]["rank_above_10"]
                        tableHeaderAndValues["current_unranked"] = category["current_date_kws"]["unranked"]
                        tableHeaderAndValues["current_top_1"] = category["current_date_kws"]["rank_1"]
                        tableHeaderAndValues["current_top_2_3"] = category["current_date_kws"]["rank_2_3"]
                        tableHeaderAndValues["current_top_4_10"] = category["current_date_kws"]["rank_4_10"]
                        tableHeaderAndValues["current_rank_above_10"] = category["current_date_kws"]["rank_above_10"]
                        tableHeaderAndValues["1"] = tableHeaderAndValues["current_top_1"] + "(" + tableHeaderAndValues["start_top_1"] + ")"
                        tableHeaderAndValues["2_3"] = tableHeaderAndValues["current_top_2_3"] + "(" + tableHeaderAndValues["start_top_2_3"] + ")"
                        tableHeaderAndValues["4_10"] = tableHeaderAndValues["current_top_4_10"] + "(" + tableHeaderAndValues["start_top_4_10"] + ")"
                        tableHeaderAndValues[">10"] = tableHeaderAndValues["current_rank_above_10"] + "(" + tableHeaderAndValues["start_rank_above_10"] + ")"
                        customizedRowData.push(tableHeaderAndValues)
                    })
                    _self.setState({ catData: customizedRowData, page_loading: false })
                }
                return resolve(json)
            }).catch(function (err) {
                _self.setState({ page_loading: false })
                console.log(err)
            })
        })
    }

    cellFormatter(cell, row) {
        let cat_name = "<a href=" + window.location.origin + "/category_page/?name=" + cell.replace(/[^A-Z0-9]/ig, "_").replace("__", "") + ">" + cell + "</a>"
        return (cat_name);
    }
    customExcelRows = options => {
        if (options.length > 0) {
            return options.map((opt, idx) => {
                let columns
                Object.keys(opt).map((v, k) => {
                    return (<ExcelColumn label={opt[v]} value={opt[v]} />)
                })
            })
        }
    }
    render() {
        var options = {
            clearSearch: true,
            noDataText: (<span>Loading.....</span>)
        };

        const { catData, page_loading } = this.state
        return (
            <div className="ctbot-dashboard">
                <div className="ctbot-top">
                    <span className="common-title"><b>Dashboard</b></span>
                </div>
                <div className="monitor-tale">
                    <ExcelFile element={<span className="excel-download"><img src={excel_icon} alt="" /> Download</span>}>
                        <ExcelSheet data={catData} name="categories data">
                            <ExcelColumn label="Category" value="category" />
                            <ExcelColumn label="Count" value="count" />
                            <ExcelColumn label="Starting Posiotion Top 1" value="start_top_1" />
                            <ExcelColumn label="Starting Posiotion Top 2-3" value="start_top_2_3" />
                            <ExcelColumn label="Starting Posiotion Top 4-10" value="start_top_4_10" />
                            <ExcelColumn label="Starting Posiotion Above 10" value="start_rank_above_10" />
                            <ExcelColumn label="Starting Unranked" value="start_unranked" />
                            <ExcelColumn label="Current Posiotion top 1" value="current_top_1" />
                            <ExcelColumn label="Current Posiotion top 2-3" value="current_top_2_3" />
                            <ExcelColumn label="Current Posiotion top 4-10" value="current_top_4_10" />
                            <ExcelColumn label="Current Posiotion above 10" value="current_rank_above_10" />
                            <ExcelColumn label="Current Unranked" value="current_unranked" />
                            <ExcelColumn label="1" value="1" />
                            <ExcelColumn label="2-3" value="2_3" />
                            <ExcelColumn label="4-10" value="4_10" />
                            <ExcelColumn label="> 10" value=">10" />
                        </ExcelSheet>
                    </ExcelFile>
                    <div className={page_loading ? "loading" : ""}></div>
                    <BootstrapTable data={catData} pagination search options={options} >
                        <TableHeaderColumn row='0' dataField='category' rowSpan="2" dataFormat={this.cellFormatter} isKey> category</TableHeaderColumn>
                        <TableHeaderColumn row='0' rowSpan="2" dataField='count'>Total Keywords</TableHeaderColumn>
                        <TableHeaderColumn row='0' colSpan="5" headerAlign='center'>Starting Position</TableHeaderColumn>
                        <TableHeaderColumn row='1' dataField='start_top_1'>Top 1</TableHeaderColumn>
                        <TableHeaderColumn row='1' dataField='start_top_2_3'>Top 2-3</TableHeaderColumn>
                        <TableHeaderColumn row='1' dataField='start_top_4_10'>Top 4-10</TableHeaderColumn>
                        <TableHeaderColumn row='1' dataField='start_rank_above_10'>>10</TableHeaderColumn>
                        <TableHeaderColumn row='1' dataField='start_unranked'>Unranked</TableHeaderColumn>
                        <TableHeaderColumn row='0' colSpan="5" headerAlign='center'>Current Position</TableHeaderColumn>
                        <TableHeaderColumn row='1' dataField='current_top_1'>Top 1</TableHeaderColumn>
                        <TableHeaderColumn row='1' dataField='current_top_2_3'>Top 2-3</TableHeaderColumn>
                        <TableHeaderColumn row='1' dataField='current_top_4_10'>Top 4-10</TableHeaderColumn>
                        <TableHeaderColumn row='1' dataField='current_rank_above_10'>>10</TableHeaderColumn>
                        <TableHeaderColumn row='1' dataField='current_unranked'>Unranked</TableHeaderColumn>
                        <TableHeaderColumn row='0' rowSpan="2" dataField='1'>1</TableHeaderColumn>
                        <TableHeaderColumn row='0' rowSpan="2" dataField='2_3'>2-3</TableHeaderColumn>
                        <TableHeaderColumn row='0' rowSpan="2" dataField='4_10'>4-10</TableHeaderColumn>
                        <TableHeaderColumn row='0' rowSpan="2" dataField='>10'>>10</TableHeaderColumn>
                    </BootstrapTable>
                </div>
            </div>
        )
    }
}
export default DashBoard;