import React, { Component } from "react";
import axios from "axios";
import Promise from "promise"
import '../react-bootstrap-table-all.min.css'
import { BootstrapTable, TableHeaderColumn } from 'react-bootstrap-table';
import { host } from "./helper";
import ReactHtmlParser, { processNodes, convertNodeToElement, htmlparser2 } from 'react-html-parser';
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
                        debugger
                        tableHeaderAndValues["category"] = category["category_name"]
                        tableHeaderAndValues["count"] = category["count"]
                        tableHeaderAndValues["start_top_1"] = category["start_date_kws"]["top_1"]
                        tableHeaderAndValues["start_top_2_3"] = category["start_date_kws"]["top_2_3"]
                        tableHeaderAndValues["start_top_4_10"] = category["start_date_kws"]["top_4_10"]
                        tableHeaderAndValues["start_rank_above_10"] = category["start_date_kws"]["rank_above_10"]
                        tableHeaderAndValues["current_top_1"] = category["current_date_kws"]["rank_1"]
                        tableHeaderAndValues["current_top_2_3"] = category["current_date_kws"]["rank_2_3"]
                        tableHeaderAndValues["current_top_4_10"] = category["current_date_kws"]["rank_4_10"]
                        tableHeaderAndValues["current_rank_above_10"] = category["current_date_kws"]["rank_above_10"]
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
    render() {
        var options = {
            clearSearch: true,
            noDataText: (<i className="fa fa-circle-o-notch fa-spin" style={{ 'fontSize': '24px' }}></i>)
        };
        const { catData, page_loading } = this.state
        return (
            <div className="ctbot-dashboard">
                <div className="ctbot-top">
                    <span className="common-title"><b>Dashboard</b></span>
                </div>
                <div className="monitor-tale">
                    <div className={page_loading ? "loading" : ""}></div>
                    <BootstrapTable data={catData} pagination search options={options} >
                        <TableHeaderColumn row='0' dataField='category' rowSpan="2" dataFormat={this.cellFormatter} isKey> category</TableHeaderColumn>
                        <TableHeaderColumn row='0' rowSpan="2" dataField='count'>Total keywords</TableHeaderColumn>
                        <TableHeaderColumn row='0' colSpan="4" headerAlign='center'>starting position</TableHeaderColumn>
                        <TableHeaderColumn row='1' dataField='start_top_1'>Top 1</TableHeaderColumn>
                        <TableHeaderColumn row='1' dataField='start_top_2_3'>Top 2-3</TableHeaderColumn>
                        <TableHeaderColumn row='1' dataField='start_top_4_10'>Top 4-10</TableHeaderColumn>
                        <TableHeaderColumn row='1' dataField='start_rank_above_10'>>10</TableHeaderColumn>
                        <TableHeaderColumn row='0' colSpan="4" headerAlign='center'>current position</TableHeaderColumn>
                        <TableHeaderColumn row='1' dataField='current_top_1'>Top 1</TableHeaderColumn>
                        <TableHeaderColumn row='1' dataField='current_top_2_3'>Top 2-3</TableHeaderColumn>
                        <TableHeaderColumn row='1' dataField='current_top_4_10'>Top 4-10</TableHeaderColumn>
                        <TableHeaderColumn row='1' dataField='current_rank_above_10'>>10</TableHeaderColumn>
                    </BootstrapTable>
                </div>
            </div>
        )
    }
}
export default DashBoard;