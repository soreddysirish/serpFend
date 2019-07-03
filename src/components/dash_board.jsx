import React, { Component } from "react";
import axios from "axios";
import Promise from "promise"
import ReactTable from 'react-table'
import 'react-table/react-table.css'
import { host } from "./helper";
class DashBoard extends Component {
    constructor(props) {
        super(props)
        this.state = {
            data: [{ categories_keys:[], categories_data: []}],
            page_loading: true
        }
    }
    componentDidMount() {
        let _self = this
        return new Promise(function (resolve) {
            axios.get(host()+"/dashboard").then(function (json) {
                let obj = {}
                obj["categories_keys"] = json.data["categories_keys"]
                obj["categories_data"] = json.data["categories_data"]
                _self.setState({ data: obj,page_loading:false })

                return resolve(json)
            }).catch(function (err) {
                console.log(err)
            })
        })
    }
    render() {
        let _self = this
        const tData = []
        let columns = [
            {Header: 'Category', accessor: 'catogory_name'}, 
            {Header: '1', accessor: 'rank_one_keywords'},
            {Header: '2-3', accessor: 'rank_in_between_two_and_three'},
            {Header: '4-10', accessor: 'rank_in_between_four_and_ten'},
            {Header: '10-20', accessor: 'rank_in_between_ten_and_twenty'},
            {Header: '>20', accessor: 'rank_above_twenty'}
        ]
        if (_self.state.data["categories_keys"] && _self.state.data["categories_data"]) {
          _self.state.data["categories_keys"].map(function (k, i) {
                let v = _self.state.data["categories_data"][k]
               let  table_obj = { catogory_name: k, rank_one_keywords: v["rank_one_keywords"],rank_in_between_two_and_three:v["rank_in_between_two_and_three"],rank_in_between_four_and_ten:v["rank_in_between_four_and_ten"],rank_in_between_ten_and_twenty:v["rank_in_between_ten_and_twenty"],rank_above_twenty:v["rank_above_twenty"]}
                tData.push(table_obj)
            })
        }
        return (
            <div>
                <h2>DashBoard Home page</h2>
                <ReactTable 
                    data={tData}
                    columns={columns}
                    loading={_self.state.page_loading}
                    showPaginationTop={true}
                    showPaginationBottom={false}
                    sortable={false}
                />
            </div>
        )
    }
}
export default DashBoard;