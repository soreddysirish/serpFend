import React, { Component } from "react";
import axios from "axios";
import Promise from "promise";
import "../react-bootstrap-table-all.min.css";
import excel_icon from "../images/excel-icon.svg";
import { BootstrapTable, TableHeaderColumn } from "react-bootstrap-table";
import { host, checkSession } from "./helper";
import { Redirect } from "react-router-dom";
import ReactExport from "react-data-export";
const ExcelFile = ReactExport.ExcelFile;
const ExcelSheet = ReactExport.ExcelFile.ExcelSheet;
const ExcelColumn = ReactExport.ExcelFile.ExcelColumn;
class DashBoard extends Component {
  constructor(props) {
    super(props);
    this.state = {
      page_loading: true,
      catData: [],
      isLogin: true
    };
  }
  componentDidMount() {
    let _self = this;
    if (!checkSession()) {
      _self.setState({
        isLogin: false
      });
      return false;
    } else {
      _self.setState({
        isLogin: true
      });
    }
    return new Promise(function(resolve) {
      axios
        .get(host() + "/overall_categories")
        .then(function(json) {
          let customizedRowData = [];
          if (json.data && json.data.length > 0) {
            json.data.map(function(category, i) {
              let tableHeaderAndValues = {};
              tableHeaderAndValues["category"] = category["category_name"];
              tableHeaderAndValues["count"] = category["count"];
              tableHeaderAndValues["start_unranked"] =
                category["start_date_kws"]["unranked"];
              tableHeaderAndValues["start_top_1"] =
                category["start_date_kws"]["rank_1"];
              tableHeaderAndValues["start_top_2_3"] =
                category["start_date_kws"]["rank_2_3"];
              tableHeaderAndValues["start_top_4_10"] =
                category["start_date_kws"]["rank_4_10"];
              tableHeaderAndValues["start_rank_above_10"] =
                category["start_date_kws"]["rank_above_10"];
              tableHeaderAndValues["current_unranked"] =
                category["current_date_kws"]["unranked"];
              tableHeaderAndValues["current_top_1"] =
                category["current_date_kws"]["rank_1"];
              tableHeaderAndValues["current_top_2_3"] =
                category["current_date_kws"]["rank_2_3"];
              tableHeaderAndValues["current_top_4_10"] =
                category["current_date_kws"]["rank_4_10"];
              tableHeaderAndValues["current_rank_above_10"] =
                category["current_date_kws"]["rank_above_10"];
              tableHeaderAndValues["target_unranked"] =
                category["target_kws"]["target_unranked"];
              tableHeaderAndValues["target_top_1"] =
                category["target_kws"]["target_top_1"];
              tableHeaderAndValues["target_top_2_3"] =
                category["target_kws"]["target_top_2_3"];
              tableHeaderAndValues["target_top_4_10"] =
                category["target_kws"]["target_top_4_10"];
              tableHeaderAndValues["target_rank_above_10"] =
                category["target_kws"]["target_above_10"];
              tableHeaderAndValues["1"] =
                tableHeaderAndValues["current_top_1"] +
                "(" +
                tableHeaderAndValues["start_top_1"] +
                ")";
              tableHeaderAndValues["2_3"] =
                tableHeaderAndValues["current_top_2_3"] +
                "(" +
                tableHeaderAndValues["start_top_2_3"] +
                ")";
              tableHeaderAndValues["4_10"] =
                tableHeaderAndValues["current_top_4_10"] +
                "(" +
                tableHeaderAndValues["start_top_4_10"] +
                ")";
              tableHeaderAndValues[">10"] =
                tableHeaderAndValues["current_rank_above_10"] +
                "(" +
                tableHeaderAndValues["start_rank_above_10"] +
                ")";
              tableHeaderAndValues["unranked"] =
                category["current_date_kws"]["unranked"] +
                "(" +
                category["start_date_kws"]["unranked"] +
                ")";
              customizedRowData.push(tableHeaderAndValues);
            });
            _self.setState({ catData: customizedRowData, page_loading: false });
          }
          return resolve(json);
        })
        .catch(function(err) {
          _self.setState({ page_loading: false });
          console.log(err);
        });
    });
  }
  colorForPositveAndNegitive(cell,row){
    let cell_val = cell
    if(cell !="N/A"){
      let splitVal = cell.replace("("," ").replace(")","").split(" ")
      if(!splitVal.includes("N/A")){
        debugger
        if(splitVal.length ==2){
          if(parseInt(splitVal[0]) < parseInt(splitVal[1])){
            cell_val = "<span class='error-index'>" + splitVal[0] + "</span> ("+ splitVal[1]+")"
          }else if(parseInt(splitVal[0]) > parseInt(splitVal[1])){
            cell_val = "<span class='success-index'>" + splitVal[0] + "</span> ("+ splitVal[1]+")"
          }else if(parseInt(splitVal[1]) == parseInt(splitVal[0])){
            cell_val = "<span class=''>" + splitVal[0] + "</span> ("+ splitVal[1]+")"  
          }
        }
      }
    }
    return cell_val
  }

  cellFormatter(cell, row) {
    let cat_name_key = cell
      .replace(/[_-\s]/g, " ")
      .replace("  ", "")
      .toLowerCase();
    let category_formatted =
      cat_name_key.charAt(0).toUpperCase() + cat_name_key.slice(1);
    let cat_name =
      "<a href=" +
      window.location.origin +
      "/category_page/?name=" +
      cell.replace(/[^A-Z0-9]/gi, "_").replace("__", "") +
      ">" +
      category_formatted +
      "</a>";
    return cat_name;
  }
  customExcelRows = options => {
    if (options.length > 0) {
      return options.map((opt, idx) => {
        let columns;
        Object.keys(opt).map((v, k) => {
          return <ExcelColumn label={opt[v]} value={opt[v]} />;
        });
      });
    }
  };
  render() {
    var options = {
      clearSearch: true,
      noDataText: <span>Loading.....</span>,
      sizePerPage: 15
    };

    const { catData, page_loading, isLogin } = this.state;
    if (!isLogin) {
      return (window.location.href = "/login");
    }
    return (
      <div className="ctbot-dashboard">
        <div className="ctbot-top">
          <span className="common-title">
            <b>Dashboard</b>
          </span>
        </div>
        <div className="monitor-tale">
          <ExcelFile
            filename="dash_board"
            element={
              <span className="excel-download">
                <img src={excel_icon} alt="" /> Download
              </span>
            }
          >
            <ExcelSheet data={catData} name="categories data">
              <ExcelColumn label="Category" value="category" />
              <ExcelColumn label="1" value="1" />
              <ExcelColumn label="2-3" value="2_3" />
              <ExcelColumn label="4-10" value="4_10" />
              <ExcelColumn label="> 10" value=">10" />
              <ExcelColumn label="Unranked" value="unranked" />
              <ExcelColumn label="Total count" value="count" />
              <ExcelColumn label="Start top 1" value="start_top_1" />
              <ExcelColumn label="Start top 2-3" value="start_top_2_3" />
              <ExcelColumn label="Start top 4-10" value="start_top_4_10" />
              <ExcelColumn label="Start above 10" value="start_rank_above_10" />
              <ExcelColumn label="Start Unranked" value="start_unranked" />
              <ExcelColumn label="Current top 1" value="current_top_1" />
              <ExcelColumn label="Current top 2-3" value="current_top_2_3" />
              <ExcelColumn label="Current top 4-10" value="current_top_4_10" />
              <ExcelColumn
                label="Current above 10"
                value="current_rank_above_10"
              />
              <ExcelColumn label="Current Unranked" value="current_unranked" />
              <ExcelColumn label="Target top 1" value="target_top_1" />
              <ExcelColumn label="Target top 2-3" value="target_top_2_3" />
              <ExcelColumn label="Target top 4-10" value="target_top_4_10" />
              <ExcelColumn
                label="Target above 10"
                value="target_rank_above_10"
              />
              <ExcelColumn label="Target Unranked" value="target_unranked" />
            </ExcelSheet>
          </ExcelFile>
          <div className={page_loading ? "loading" : ""} />
          <BootstrapTable
            data={catData}
            pagination
            search
            options={options}
           hover
          >
            <TableHeaderColumn
              row="0"
              width="180"
              dataField="category"
              rowSpan="2"
              dataFormat={this.cellFormatter}
              isKey
            >
              {" "}
              Category
            </TableHeaderColumn>
            <TableHeaderColumn
              row="0"
              width="100"
              rowSpan="2"
              dataField="count"
            >
              Total Keywords
            </TableHeaderColumn>
            <TableHeaderColumn row="0" width="80" rowSpan="2" dataField="1" dataFormat={this.colorForPositveAndNegitive}>
              1
            </TableHeaderColumn>
            <TableHeaderColumn row="0" width="80" rowSpan="2" dataField="2_3" dataFormat={this.colorForPositveAndNegitive}>
              2-3
            </TableHeaderColumn>
            <TableHeaderColumn row="0" width="80" rowSpan="2" dataField="4_10" dataFormat={this.colorForPositveAndNegitive}>
              4-10
            </TableHeaderColumn>
            <TableHeaderColumn row="0" width="80" rowSpan="2" dataField=">10" dataFormat={this.colorForPositveAndNegitive}>
              >10
            </TableHeaderColumn>
            <TableHeaderColumn
              row="0"
              width="100"
              rowSpan="2"
              dataField="unranked"
              dataFormat={this.colorForPositveAndNegitive}
            >
              Unranked
            </TableHeaderColumn>
            <TableHeaderColumn
              row="0"
              width="100"
              colSpan="5"
              headerAlign="center"
            >
              Starting Position
            </TableHeaderColumn>
            <TableHeaderColumn row="1" width="80" dataField="start_top_1">
              Top 1
            </TableHeaderColumn>
            <TableHeaderColumn row="1" width="80" dataField="start_top_2_3">
              Top 2-3
            </TableHeaderColumn>
            <TableHeaderColumn row="1" width="90" dataField="start_top_4_10">
              Top 4-10
            </TableHeaderColumn>
            <TableHeaderColumn
              row="1"
              width="80"
              dataField="start_rank_above_10"
            >
              >10
            </TableHeaderColumn>
            <TableHeaderColumn row="1" width="100" dataField="start_unranked">
              Unranked
            </TableHeaderColumn>
            <TableHeaderColumn
              row="0"
              width="100"
              colSpan="5"
              headerAlign="center"
            >
              Current Position
            </TableHeaderColumn>
            <TableHeaderColumn row="1" width="80" dataField="current_top_1">
              Top 1
            </TableHeaderColumn>
            <TableHeaderColumn row="1" width="80" dataField="current_top_2_3">
              Top 2-3
            </TableHeaderColumn>
            <TableHeaderColumn row="1" width="90" dataField="current_top_4_10">
              Top 4-10
            </TableHeaderColumn>
            <TableHeaderColumn
              row="1"
              width="80"
              dataField="current_rank_above_10"
            >
              >10
            </TableHeaderColumn>
            <TableHeaderColumn row="1" width="100" dataField="current_unranked">
              Unranked
            </TableHeaderColumn>
            <TableHeaderColumn
              row="0"
              width="100"
              colSpan="5"
              headerAlign="center"
            >
              Target
            </TableHeaderColumn>
            <TableHeaderColumn row="1" width="80" dataField="target_top_1">
              Top 1
            </TableHeaderColumn>
            <TableHeaderColumn row="1" width="80" dataField="target_top_2_3">
              Top 2-3
            </TableHeaderColumn>
            <TableHeaderColumn row="1" width="90" dataField="target_top_4_10">
              Top 4-10
            </TableHeaderColumn>
            <TableHeaderColumn
              row="1"
              width="80"
              dataField="target_rank_above_10"
            >
              >10
            </TableHeaderColumn>
            <TableHeaderColumn row="1" width="100" dataField="target_unranked">
              Unranked
            </TableHeaderColumn>
          </BootstrapTable>
        </div>
      </div>
    );
  }
}
export default DashBoard;
