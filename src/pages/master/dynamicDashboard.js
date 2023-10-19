import React, { useState, useContext, useEffect } from "react";

import Fnselectcomponent from '../../components/selectComponent';
import 'bootstrap/dist/css/bootstrap.min.css';
import { Container, Row } from 'react-bootstrap';
import { useParams } from "react-router-dom";
import AuthContext from "../../context/AuthContext";
import PreContext from '../../context/PreContext';
import Tableact from '../../components/tableComponent';
import FnBtnComponent from "../../components/buttonComponent";

const FnDynamicDashboard = () => {
  let { authTokens } = useContext(AuthContext);
  let { userSettings } = useContext(PreContext);
  // To store dynamic data from backend tables 
  const [dynamic_data, setDynamic_data] = useState([]);
  // To store all table names used in 1st level API call
  const [all_tables, setAll_tables] = useState([]);
  // To store table columns their respective model and serializer class names from backend used in 2nd level API CALL
  const [model_name_query, setModel_name_query] = useState("");
  const [serializer_name_query, setSerializer_name_query] = useState("");
  const [table_columns, setTable_columns] = useState([]);
  // To pass as an Onchange and storing value for react_select Reuseable Component
  const [table_name_api_query, setTable_name_api_query] = useState("");
  const [table_columns_query, setTable_columns_query] = useState("");

  // Reusable TableComponent required fields 
  const [startingIndex, setStartingindex] = useState(0);
  const PageSize = (userSettings) ? userSettings.pagination : process.env.REACT_APP_PAGINATION;
  // const endingIndex = startingIndex+Number(PageSize);
  const [add, setAdd] = useState(false);
  const [view, setView] = useState(false);
  const date_columns = [];
  const columns_type = ["str", "str", "str"];
  const { id } = useParams();

  // To use
  
  // A UseState to create multiple same field set
  const [query, setQuery] = useState([{}]);

  // Method to add fields 
  const add_fields = () => {

    setQuery([...query, {}])

  }

  // Method to remove fields
  const remove_fields = (i) => {

    let list = [...query]
    // console.log("li",list);
    list.splice(i, 1)
    setQuery(list)

  }

  // Method to clear data
  const refresh = async () => {

    setTable_name_api_query("")
    setTable_columns("")
    setTable_columns_query("")
    setDynamic_data("")
    query.length = 0;

  }

  let handle_filter_event = (i, e) => {

    let list = [...query]

    if (e.target.name === "condition" && e.target.value === "__range") {
      delete list[i]["search_value"]
    }

    if (e.target.name === "condition" && e.target.value !== "__range") {
      delete list[i]["from_date"]
      delete list[i]["to_date"]
    }

    list[i][e.target.name] = e.target.value
    setQuery(list)
  }

  // 1st level API call auto triggered using UseEffect to get All DB Table Names
  const fn_get_details = async () => {

    // Dynamic API Call to get all table names inside the base app created in django
    let res = await fetch(`${process.env.REACT_APP_SERVER_URL}/api/get_all_tables`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': 'Bearer ' + String(authTokens.access)
      },
    })

    let data = await res.json();

    if (res.status === 200) {
      if (data) {
        if (!all_tables.includes(data)) {
          setAll_tables(data)
        }
      }
    }

  }

  // 2nd level API Call to get the model,serializer,columns of the selected Table in the !st level API Call
  const dynamic_api = async (table_name_api_query) => {

    // Dynamic API Call for Statically selected Dynamic Table get_dynamic_trio
    let res = await fetch(`${process.env.REACT_APP_SERVER_URL}/api/get_dynamic_trio/${table_name_api_query}/`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': 'Bearer ' + String(authTokens.access)
      },
    })

    let data = await res.json();

    if (res.status === 200) {

      if (data) {

        if (!table_columns.includes(data.table_fields)) {
          setTable_columns(data.table_fields)
        }

        if (!model_name_query.includes(data.model_name)) {
          setModel_name_query([data.model_name])
        }

        if (!serializer_name_query.includes(data.serializer_name)) {
          setSerializer_name_query([data.serializer_name])
        }

      }

    }

  }

  // 3rd level API Call to fetch the data set based on the give condition by user
  const filter_api = async (model_name_query, serializer_name_query, table_columns_query) => {

    let col_name = []
    let conditional_operator = []
    let col_value = []
    let from_date_value = []
    let to_date_value = []

    query.forEach((temp) => {

      col_name.push(temp.condition_fields)
      conditional_operator.push(temp.condition)

      if (temp.search_value) {
        col_value.push(temp.search_value)
      }

      else {
        from_date_value.push(temp.from_date)
        to_date_value.push(temp.to_date)
      }

    })

    let res = await fetch(`${process.env.REACT_APP_SERVER_URL}/api/get_dynamic_filtering`, {
      method: 'POST',
      body: JSON.stringify({
        model_name_query: model_name_query,
        serializer_name_query: serializer_name_query,
        table_columns_query: table_columns_query,
        col_name: col_name,
        conditional_operator: conditional_operator,
        col_value: col_value,
        from_date_value: from_date_value,
        to_date_value: to_date_value
      }),
      headers: {
        'Content-Type': 'application/json',
        'Authorization': 'Bearer ' + String(authTokens.access)
      },
    })

    let data = await res.json();

    if (res.status === 200) {

      if (data) {
        setDynamic_data(data)
      }

    }

  }

  // UseEffect
  useEffect(() => {

    // // 1st level API call auto triggered using UseEffect to get All DB Table Names
    // const fn_get_details = async () => {

    //   // Dynamic API Call to get all table names inside the base app created in django
    //   let res = await fetch(`${process.env.REACT_APP_SERVER_URL}/api/get_all_tables`, {
    //     method: 'GET',
    //     headers: {
    //       'Content-Type': 'application/json',
    //       'Authorization': 'Bearer ' + String(authTokens.access)
    //     },
    //   })

    //   let data = await res.json();

    //   if (res.status === 200) {
    //     if (data) {
    //       if (!all_tables.includes(data)){
    //         setAll_tables(data)
    //       }
    //     }
    //   }

    // }
    fn_get_details()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  return (
    <Container fluid>

      <Row className='sc_cl_row p-2'>

        <div className="sc_cl_div col-lg-12 d-flex flex-column flex-lg-row flex-sm-column justify-content-between">

          <div className="sc_cl_div col-12 col-lg-8 d-flex flex-column">

            <label className='sc_cl_label h6'>Select static Tables</label>

            <Fnselectcomponent values={all_tables} labels={all_tables} query={table_name_api_query} setQuery={setTable_name_api_query} multiselect={false} />

          </div>

        </div>

        <div className="sc_cl_div align-items-center d-flex justify-content-evenly my-3 w-auto">

          {/* <button onClick={() => dynamic_api(table_name_api_query)} className="sc_cl_button btn btn-sm btn-primary w-auto">Filter</button> */}
          <FnBtnComponent onClick={() => dynamic_api(table_name_api_query)} children={"Filter"} classname={"sc_cl_submit_button"} />
        </div>

        <hr />

        <div className="sc_cl_div col-lg-12 d-flex flex-column flex-lg-row flex-sm-column justify-content-between my-3">

          <div className="sc_cl_div col-12 col-lg-6 d-flex flex-column">

            <label className='sc_cl_label h6'>Select Multiple Fields</label>

            <Fnselectcomponent values={table_columns} labels={table_columns}
              query={table_columns_query} setQuery={setTable_columns_query} multiselect={true} />

          </div>

          <div className="sc_cl_div col-12 col-lg-1 d-flex flex-column justify-content-end">

            <button onClick={add_fields}>add</button>

          </div>

        </div>

        {query.map((temp, index) => {

          return (

            <div key={index} className="sc_cl_div col-lg-12 d-flex flex-column flex-lg-row flex-sm-column justify-content-between my-3">

              <div className="sc_cl_div col-12 col-lg-4 d-flex flex-column">

                <label className='sc_cl_label h6'>Select Conditional Field</label>

                <select name="condition_fields" className="w-75" value={temp.condition_fields || ""} onChange={(e) => handle_filter_event(index, e)}>
                  <option hidden>--Select--</option>
                  {table_columns.map((temp, index) => (
                    <option key={index} value={temp}>{temp}</option>
                  ))}

                </select>

              </div>

              <div className="sc_cl_div col-12 col-lg-4 d-flex flex-column">

                <label className='sc_cl_label h6'>Select Where Condition</label>

                <select name='condition' title='condition' className="w-75" value={temp.condition || ""} onChange={(e) => handle_filter_event(index, e)}>
                  <option hidden>---Select---</option>
                  <option value='__iexact'>==</option>
                  <option value='__gt'>{'>'}</option>
                  <option value='__lt'>{'<'}</option>
                  <option value='__gte'>{'>='}</option>
                  <option value='__lte'>{'<='}</option>
                  <option value='__range'>Date Range</option>
                </select>

              </div>

              {temp.condition !== "__range" ?

                <div className="sc_cl_div col-12 col-lg-3 d-flex flex-column">

                  <label className='sc_cl_label h6'>Enter value</label>

                  <input name="search_value" type="search" className="w-75" placeholder="Enter value" value={temp.search_value || ""} onChange={(e) => handle_filter_event(index, e)} autoFocus />

                </div>

                :

                <div className="sc_cl_div col-12 col-lg-3 d-flex flex-column">

                  <label className='sc_cl_label h6'>Select From Date</label>

                  <input name="from_date" type="date" className="sc_cl_input w-75" value={temp.from_date || ""} onChange={(e) => handle_filter_event(index, e)} />

                  <label className='sc_cl_label h6 my-2'>Select To Date</label>

                  <input name="to_date" type="date" className="sc_cl_input w-75" value={temp.to_date || ""} onChange={(e) => handle_filter_event(index, e)} />

                </div>
              }

              {query.length > 1 ?

                <div className="sc_cl_div col-12 col-lg-1 d-flex flex-column justify-content-end">

                  <button onClick={() => remove_fields(index)}>remove</button>

                </div>

                :

                ""

              }

            </div>

          )

        })}

        <div className="sc_cl_div align-items-center d-flex justify-content-evenly my-3 w-auto">

          <button onClick={() => filter_api(model_name_query, serializer_name_query, table_columns_query)}
            className="sc_cl_button btn btn-sm btn-primary w-auto">Submit</button>

          <button onClick={refresh} className="sc_cl_button btn btn-sm btn-secondary w-auto mx-2">Clear</button>

        </div>

      </Row>

      <hr />

      {dynamic_data.length === 0 ?

        <h3 className="sc_cl_h3 d-flex justify-content-center w-auto ">Welcome to Dashboard Select your table and click on submit</h3>

        :

        <div className="sc_cl_div container">

          <Tableact data={dynamic_data} page_size={PageSize} columns_in={table_columns_query}
            start={setStartingindex} date_columns={date_columns} columns_type={columns_type} add={setAdd} view={setView} menu_id={id} action={false} />

        </div>
      }

    </Container>
  )

}

export default FnDynamicDashboard