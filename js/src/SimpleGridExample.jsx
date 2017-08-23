import React, {Component} from "react";
import {AgGridReact} from "ag-grid-react";
import RowDataFactory from "./RowDataFactory";

export default class extends Component {
    constructor(props) {
        super(props);

        this.state = {
            columnDefs: this.createColumnDefs(),
            rowData: this.GetEmployees()
        }
        this.onSubmit = this.AddEmployee.bind(this);
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
          this.setState({rowData: json.employees});
        });
      }
        return 0
      });
    }

    AddEmployee(event) {
      // alert(event);
      var self = this;
      console.log(self.refs.name.value)
      fetch('http://127.0.0.1:5000/employees/create', {
       method: 'POST',
       headers: {
         "Content-Type": 'application/json',
       },
       body: JSON.stringify({
         name: self.refs.name.value
       })
     })
     .then(function(response) {
       return response.json()
     }).then(function(body) {
       this.setState({
         rowData: this.state.rowData.concat(body.employee)
       });
     });
      event.preventDefault();
      // fetch('http://127.0.0.1:5000/employees/create', {
      //   method: 'POST',
      //   headers: {
      //     Accept: 'application/json',
      //   },
      //   data: {
      //     name:
      //   }
      // })
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

    render() {
        let containerStyle = {
            height: 115,
            width: 500
        };
        var employeeList = "Loading.."
        if (this.state.rowData != undefined) {
          employeeList = (
            <select ref="parent_id">
              <option value="" > -- root --</option>
                {this.state.rowData.map(function(employee){
                    return <option value={ employee.id }>{employee.name}</option>;
                  })}
            </select>
          )
        }

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
                <h3>Add Employee</h3>
                <form onSubmit={this.onSubmit}>
                  <b>Name: </b> <input type="text" ref="name" required/><br/>
                  <b>Role: </b> <input type="text"ref="role"/><br/>
                  <b>Birth Date: </b> <input type="date" ref="birth_date"/><br/>
                  <b>Joining Date: </b> <input type="date"ref="joining_date"/><br/>
                  <b>Address: </b> <input type="text"ref="address"/><br/>
                  <b>Manager: </b> {employeeList}<br/>
                  <button type="submit" value="Add">Submit</button>
                </form>
            </div>
        )
    }
};
