import React, { Component } from "react";
import axios from "axios";
import Promise from "promise"
import 'react-table/react-table.css'
import { BootstrapTable, TableHeaderColumn } from 'react-bootstrap-table';
import { host } from "./helper";
import ReactHtmlParser, { processNodes, convertNodeToElement, htmlparser2 } from 'react-html-parser';
class DashBoard extends Component {
    constructor(props) {
        super(props)
        this.state = {
            data: [{ categories_keys: [], categories_data: [] }],
            page_loading: true,
            catData: []
        }
    }
    componentDidMount() {
        let _self = this
        return new Promise(function (resolve) {
            axios.get(host() + "/dashboard").then(function (json) {
                let obj = {}
                let tobj = []
                obj["categories_keys"] = json.data["categories_keys"]
                obj["categories_data"] = json.data["categories_data"]
                _self.setState({ data: obj})
                if (obj["categories_data"] && obj["categories_keys"]) {
                    _self.state.data["categories_keys"].map(function (k, i) {
                        let bObj = {}
                        let v = _self.state.data["categories_data"][k]
                        let cat_name = "<a href=" + window.location.origin + "/category_page/?name=" + k.replace(/[^A-Z0-9]/ig, "_").replace("__", "") + ">" + k + "</a>"
                        bObj["category"] = k
                        bObj["1"] = v["rank_one_keywords"]
                        bObj["2-3"] = v["rank_in_between_two_and_three"]
                        bObj["4-10"] = v["rank_in_between_four_and_ten"]
                        bObj["10-20"] = v["rank_in_between_ten_and_twenty"]
                        bObj[">20"] = v["rank_above_twenty"]
                        tobj.push(bObj)
                    })
                    _self.setState({ catData: tobj, page_loading: false  })
                }
                return resolve(json)
            }).catch(function (err) {
                _self.setState({page_loading:false})
                console.log(err)
            })
        })
    }
    cellFormatter(cell, row) {
        let cat_name = "<a href=" + window.location.origin + "/category_page/?name=" + cell.replace(/[^A-Z0-9]/ig, "_").replace("__", "") + ">" + cell + "</a>"
        return (cat_name);
    }
    render() {
        const { catData,page_loading } = this.state
        return (
            <div>
                <div className={page_loading  ? "loading" : ""}></div>
                <h2>DashBoard Home page</h2>
                <BootstrapTable data={catData} pagination search >
                    <TableHeaderColumn row='0' dataField='category' dataFormat={this.cellFormatter} isKey width='80'> category</TableHeaderColumn>
                    <TableHeaderColumn row='0' dataField='1' width='90'>1</TableHeaderColumn>
                    <TableHeaderColumn row='0' dataField='2-3' width='90'>2-3</TableHeaderColumn>
                    <TableHeaderColumn row='0' dataField='4-10' width='90'>4-10</TableHeaderColumn>
                    <TableHeaderColumn row='0' dataField='10-20' width='90'>10-20</TableHeaderColumn>
                    <TableHeaderColumn row='0' dataField='>20' width='90'>>20</TableHeaderColumn>
                </BootstrapTable>
            </div>
        )
    }
}
export default DashBoard;