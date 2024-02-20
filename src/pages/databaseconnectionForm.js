/* ============================================================================================================================================================

   CITTABASE SOLUTIONS - All Rights Reserved.

   ------------------------------------------------------------------------------------------------------------------------------------------------------------

   30-JUL-2023   Jagadeshwaran R      Initial Version             V1

   ** Database Connection Form Page **

============================================================================================================================================================*/

import React, { useState, useContext, useEffect } from "react";
import { useParams } from "react-router-dom";
import AuthContext from "../context/AuthContext";
import { Row, Form } from "react-bootstrap";
import Swal from "sweetalert2";
import FnBtnComponent from "../components/buttonComponent";
import FnTooltipComponent from "../components/tooltipComponent";
import FnFormComponent from "../components/formComponent";

const FnDatabaseConnectionForm = ({
  data,
  close,
  viewvalue,
  diverts,
  setdiverts,
  configData,
  typeItem
}) => {
  console.log('diverts', diverts)

  let { authTokens, user } = useContext(AuthContext);
  const [adata, setAdata] = useState({
    created_by: user.user_id,
    last_updated_by: user.user_id,
  });
  const [error, setError] = useState({});
  const [action, setAction] = useState(false);
  let a = [data];
  const { id } = useParams();
  // const [helper, setHelper] = useState([]);
  const [connectionstatus, setConnectionStatus] = useState();


  //formComp test
  let fieldData = [];

  if (adata["connection_type"] === "MYSQL" || (adata["connection_type"] === undefined && typeItem === "MYSQL")) {
    // setAdata({...adata, "connection_type": "MYSQL"})

    fieldData = [
      { id: 1, name: 'connection_name', label: 'Connection Name', placeholder: 'Enter Connection Name', type: 'text', maxlen: '500', ismandatory: 'Y' },
      { id: 2, name: 'user_name', label: 'User Name', placeholder: 'Enter User Name', type: 'text', maxlen: '100', ismandatory: 'Y' },
      { id: 3, name: 'password', label: 'Password', placeholder: 'Enter Password', type: 'password', maxlen: '200', ismandatory: 'N' },
      { id: 4, name: 'host_id', label: 'Host Id', placeholder: 'Enter Host Id', type: 'text', maxlen: '200', ismandatory: 'Y' },
      { id: 5, name: 'port', label: 'Port', placeholder: 'Enter Port', type: 'number', maxlen: '200', ismandatory: 'Y' },
      { id: 6, name: 'database_name', label: 'Database Name', placeholder: 'Enter Database Name', type: 'text', maxlen: '500', ismandatory: 'Y' },
    ]
  }
  else if (adata["connection_type"] === "Oracle" || (adata["connection_type"] === undefined && typeItem === "Oracle")) {

    // setAdata({...adata, "connection_type" : "Oracle"})

    fieldData = [
      { id: 1, name: 'connection_name', label: 'Connection Name', placeholder: 'Enter Connection Name', type: 'text', maxlen: '500', ismandatory: 'Y' },
      { id: 2, name: 'user_name', label: 'User Name', placeholder: 'Enter User Name', type: 'text', maxlen: '100', ismandatory: 'Y' },
      { id: 3, name: 'password', label: 'Password', placeholder: 'Enter Password', type: 'password', maxlen: '200', ismandatory: 'N' },
      { id: 4, name: 'host_id', label: 'Host Id', placeholder: 'Enter Host Id', type: 'text', maxlen: '200', ismandatory: 'Y' },
      { id: 5, name: 'port', label: 'Port', placeholder: 'Enter Port', type: 'number', maxlen: '200', ismandatory: 'Y' },
      { id: 6, name: 'service_name_or_SID', label: 'Service Name/SID', placeholder: 'Enter Service Name/SID', type: 'text', maxlen: '200', ismandatory: 'Y' },
    ]

  }
  else if (adata["connection_type"] === "Snowflake" || (adata["connection_type"] === undefined && typeItem === "Snowflake")) {

    // setAdata({...adata, "connection_type" : "Snowflake"})

    fieldData = [
      { id: 1, name: 'connection_name', label: 'Connection Name', placeholder: 'Enter Connection Name', type: 'text', maxlen: '500', ismandatory: 'Y' },
      { id: 2, name: 'user_name', label: 'User Name', placeholder: 'Enter User Name', type: 'text', maxlen: '100', ismandatory: 'Y' },
      { id: 3, name: 'password', label: 'Password', placeholder: 'Enter Password', type: 'password', maxlen: '200', ismandatory: 'N' },
      { id: 4, name: 'account_id', label: 'Account Id', placeholder: 'Enter Account Id', type: 'text', maxlen: '200', ismandatory: 'Y' },
      { id: 5, name: 'schema_name', label: 'Schema Name', placeholder: 'Enter Schema Name', type: 'text', maxlen: '500', ismandatory: 'N' },
      { id: 6, name: 'database_name', label: 'Database Name', placeholder: 'Enter Database Name', type: 'text', maxlen: '500', ismandatory: 'N' },
      { id: 7, name: 'warehouse_id', label: 'Warehouse Id', placeholder: 'Enter Warehouse Id', type: 'text', maxlen: '200', ismandatory: 'N' },
      { id: 8, name: 'role', label: 'Role', placeholder: 'Enter Role', type: 'text', maxlen: '200', ismandatory: 'N' },
    ]

  }
  else {
    fieldData = []
  }


  let selectedData = {
    "connection_type": [
      {
        value: "MYSQL",
        label: "MYSQL"
      },
      {
        value: "Oracle",
        label: "Oracle"
      },
      {
        value: "Snowflake",
        label: "Snowflake"
      },
      // {
      //     value: "Mongo",
      //     label: "Mongo"
      // }
    ]
  }

  //  Function for updating perspective details
  const fnUpdateDetails = async () => {
    let con_res = await fetch(
      `${process.env.REACT_APP_SERVER_URL}/api/rb_test_db_connection`,
      {
        method: "POST",
        body: JSON.stringify(adata),
        headers: {
          "Content-Type": "application/json",
          Authorization: "Bearer " + String(authTokens.access),
        },
      }
    );
    let con_data = await con_res.json();

    if (con_res.status === 200) {
      let res = await fetch(
        `${process.env.REACT_APP_SERVER_URL}/api/upd_rb_connect_definition_table/${adata.id}/`,
        {
          method: "PUT",
          body: JSON.stringify(adata),
          headers: {
            "Content-Type": "application/json",
            Authorization: "Bearer " + String(authTokens.access),
          },
        }
      );
      let data = await res.json();

      if (res.status === 200) {
        setError();
        setConnectionStatus(con_data)
        Swal.fire({
          icon: "success",
          text: "Connection Updated Successfully!",
        }).then(function () {
          close(false);
        });
      } else {
        setError(data);
      }
    }
    else if (con_res.status === 404) {
      setError(con_data);
    }
    else {
      setError();
      setConnectionStatus(con_data)
    }
  };

  //  Function for inserting perspective details
  const fnTestConnection = async () => {
    let reqData
    if(typeItem !== undefined){
      reqData = {...adata, "connection_type": typeItem}
    } else {
      reqData = {...adata}
    }
    let res = await fetch(
      `${process.env.REACT_APP_SERVER_URL}/api/rb_test_db_connection`,
      {
        method: "POST",
        body: JSON.stringify(reqData),
        headers: {
          "Content-Type": "application/json",
          Authorization: "Bearer " + String(authTokens.access),
        },
      }
    );
    let data = await res.json();

    if (res.status === 200) {
      setError();
      setConnectionStatus(data);
    }
    else if (res.status === 404) {
      setError(data);
    }
    else {
      setError();
      setConnectionStatus(data)
    }
  }

  //  Function for inserting perspective details
  const fnSubmitDetails = async () => {
    let reqData
    if(typeItem !== undefined){
      reqData = {...adata, "connection_type": typeItem}
    } else {
      reqData = {...adata}
    }
    console.log('reqData', reqData)

    let con_res = await fetch(
      `${process.env.REACT_APP_SERVER_URL}/api/rb_test_db_connection`,
      {
        method: "POST",
        body: JSON.stringify(reqData),
        headers: {
          "Content-Type": "application/json",
          Authorization: "Bearer " + String(authTokens.access),
        },
      }
    );
    let con_data = await con_res.json();

    if (con_res.status === 200) {
      let res = await fetch(
        `${process.env.REACT_APP_SERVER_URL}/api/ins_rb_connect_definition_table`,
        {
          method: "POST",
          body: JSON.stringify(reqData),
          headers: {
            "Content-Type": "application/json",
            Authorization: "Bearer " + String(authTokens.access),
          },
        }
      );
      let data = await res.json();
      if (res.status === 200) {
        setError();
        setAction();
        setConnectionStatus(con_data)
        Swal.fire({
          icon: "success",
          text: "Connection Saved Successfully!",
        }).then(function () {
          close(false);
        });
      } else {
        setError(data);
      }
    }
    else if (con_res.status === 404) {
      setError(con_data);
    }
    else {
      setError();
      setConnectionStatus(con_data)
    }
  };

  //  Used for rendering every time action done
  useEffect(() => {
    // const fnGetDetails = async () => {
    //   let res_helper = await fetch(
    //     `${process.env.REACT_APP_SERVER_URL}/api/get_helper`,
    //     {
    //       method: "GET",
    //       headers: {
    //         "Content-Type": "application/json",
    //         Authorization: "Bearer " + String(authTokens.access),
    //       },
    //     }
    //   );
    //   let helper_data = await res_helper.json();
    //   if (res_helper.status === 200) {
    //     if (helper_data) {
    //       setHelper(helper_data);
    //     }
    //   }
    // }
    // fnGetDetails();
    if (diverts === true) {
      const newdata = a.map(
        ({
          id,
          connection_type,
          connection_name,
          database_name,
          host_id,
          port,
          user_name,
          password,
          service_name_or_SID,
          account_id,
          schema_name,
          warehouse_id,
          role,
          created_by,
          last_updated_by,
        }) => ({
          id,
          connection_type,
          connection_name,
          database_name,
          host_id,
          port,
          user_name,
          password,
          service_name_or_SID,
          account_id,
          schema_name,
          warehouse_id,
          role,
          created_by,
          last_updated_by,
        })
      );
      setAdata(...newdata);
      setAction(true);
      setdiverts(false);
    }
    // setAdata()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [action, diverts]);

  if (adata.last_updated_by !== user.user_id) {
    setAdata({ ...adata, last_updated_by: user.user_id });
  }

  // Onchange function
  const fnInputHandler = (name, value) => {
    setAdata((prevState) => ({
      ...prevState,
      [name]: value
    }))

    const errors = { ...error }
    setError(errors)
  };

  // const help = helper.filter(user => String(user.page_no)
  //   .includes(String(id))).map((use) => use);

  return (
    <div className="sc_cl_div w-100 px-2">

      <div>
        <Form>
          <Form.Group className="sc_cl_form_alignment">
            <div className="sc_cl_field_alignment" >
              <div className="gap-1">
                <Form.Label className="sc_cl_label" >Connection Type <sup className="text-danger fs-6">*</sup>
                </Form.Label>
                <Form.Select
                  className="ms-2 w-25"
                  name={"connection_type"}
                  value={adata["connection_type"] || typeItem || ''}
                  onChange={(e) => fnInputHandler(e.target.name, e.target.value)}//(e) => setDBSelect(e.target.value)
                  disabled={false}
                  size="sm"
                >
                  <option hidden>---Select---</option>
                  <option value="MYSQL">MYSQL</option>
                  <option value="Oracle">Oracle</option>
                  <option value="Snowflake">Snowflake</option>
                </Form.Select>
              </div>
            </div>
          </Form.Group>
        </Form>
      </div>

      <Row className="mt-2 mt-lg-2 sc-cl-main-content">

        <FnFormComponent fields={fieldData} select={selectedData} formData={adata} onchange={fnInputHandler} onsubmit={fnSubmitDetails}
          errorcode={error} disablevalue={viewvalue} stylename={"sc_cl_input mb-2"} tooltipvalue={false} />

        <div>
          {connectionstatus &&
            (<label>status :
              <span className={`${connectionstatus && connectionstatus == "Connected" ? 'text-success' : 'text-danger'} small`}>
                {connectionstatus ? connectionstatus == "Connected" ? ' success' : connectionstatus : ''}</span>
            </label>)
          }
        </div>
        <div className="align-items-center d-flex justify-content-start mt-2 sc_cl_div gap-2">
          <FnBtnComponent onClick={fnTestConnection} children={"Test Connection"} classname={"sc_cl_close_button"} />
          {viewvalue === false &&
            (action ? (
              <FnBtnComponent onClick={fnUpdateDetails} classname={"sc_cl_submit_button"} children={"Update"} />
            ) : (
              <FnBtnComponent onClick={fnSubmitDetails} children={"Submit"} classname={"sc_cl_submit_button"} />
            ))}
          <FnBtnComponent classname={"sc_cl_close_button"} children={"Back"} onClick={() => close(false)} />
        </div>
      </Row>

    </div>
  );
};

export default FnDatabaseConnectionForm;