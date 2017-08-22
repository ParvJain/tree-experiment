import React, {Component} from "react";
import {AgGridReact} from "ag-grid-react";

export default class extends Component {
    constructor(props) {
        super(props);

        this.state = {
            columnDefs: this.createColumnDefs(),
            rowData: this.GetEmployees()
        }
    }

    onGridReady(params) {
        this.gridApi = params.api;
        this.columnApi = params.columnApi;

        this.gridApi.sizeColumnsToFit();
    }

    GetEmployees() {
      // return [{name: "Jagdish"}]
      fetch('http://127.0.0.1:5000/employees/all', {
        method: 'GET',
        headers: {
          Accept: 'application/json',
        },
      },
      ).then(response => {
      if (response.ok) {
        response.json().then(json => {
          this.setState({ rowData: json.employees})
        });
      }
        return this.createRowData()
      });
    }

    createColumnDefs() {
        return [
            {headerName: "name", field: "name"},
            {headerName: "role", field: "role"},
            {headerName: "age", field: "age"},
            {headerName: "joining_date", field: "joining_date"},
            {headerName: "address", field: "address"},
            {headerName: "parent_id", field: "parent_id"}
        ];
    }

    createRowData() {
        return [
            {make: "Toyota", model: "Celica", price: 35000},
            {make: "Ford", model: "Mondeo", price: 32000},
            {make: "Porsche", model: "Boxter", price: 72000}
        ];
    }

    render() {
        let containerStyle = {
            height: 115,
            width: 500
        };

        return (
            <div style={containerStyle} className="ag-fresh">
                <h1>Simple ag-Grid React Example</h1>
                <AgGridReact
                    // properties
                    columnDefs={this.state.columnDefs}
                    rowData={this.state.rowData}

                    // events
                    onGridReady={this.onGridReady}>
                </AgGridReact>
            </div>
        )
    }
};
