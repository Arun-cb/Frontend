/* ============================================================================================================================================================

   CITTABASE SOLUTIONS - All Rights Reserved.
   ------------------------------------------------------------------------------------------------------------------------------------------------------------
  
   08-Aug-2022  Arun R      Initial Version             V1
   
   ** This Page is to define org definition details  **
   
============================================================================================================================================================*/

import React, { useState, useContext, useEffect } from "react";
import AuthContext from "../../context/AuthContext";
import { Row, Card, Form, Modal, Table } from "react-bootstrap";
import { useParams, useNavigate } from "react-router-dom";
import Swal from "sweetalert2";
import FnBtnComponent from "../../components/buttonComponent";
import FnTooltipComponent from "../../components/tooltipComponent";
import FnBreadCrumbComponent from "../../components/breadCrumbComponent";
import FnFormComponent from "../../components/formComponent";
import PreContext from "../../context/PreContext";

import { BiMessageRoundedError } from "react-icons/bi";

const FnOrgDefinitionForm = () => {
  let { authTokens, user } = useContext(AuthContext);
  let { setisloading } = useContext(PreContext);
  let [adata, setAdata] = useState({
    organization_name: "",
    address_1: "",
    address_2: "",
    city: "",
    country: "",
    no_of_org_functional_levels: "",
    created_by: user.user_id,
    last_updated_by: user.user_id,
  });
  const history = useNavigate();

  const [error, setError] = useState({});
  const [action, setAction] = useState(false);
  const [add, setAdd] = useState(false);
  const [view, setView] = useState();
  const [edit, setEdit] = useState(false);
  const [, setRemove] = useState(false);
  const { id } = useParams();

  const [client_error_msg, Client_error_msg] = useState([]);

  // Org_definition_Stop_Light_Indicators
  const [frerror, setFrerror] = useState([{}, {}, {}, {}]);
  const [toerror, setToerror] = useState([{}, {}, {}, {}]);
  const [query, setQuery] = useState([
    {
      stop_light_indicator: "#FF0000",
      created_by: user.user_id,
      last_updated_by: user.user_id,
    },
    {
      stop_light_indicator: "#FFA500",
      created_by: user.user_id,
      last_updated_by: user.user_id,
    },
    {
      stop_light_indicator: "#76B947",
      created_by: user.user_id,
      last_updated_by: user.user_id,
    },
    {
      stop_light_indicator: "#116530",
      created_by: user.user_id,
      last_updated_by: user.user_id,
    },
  ]);
  const [helper, setHelper] = useState([]);
  // ! test
  const [warnings, setWarnings] = useState([]);

  const orgDefnitionData = [
    {
      id: 1,
      name: "organization_name",
      label: "Organization Name",
      placeholder: "Enter Organization Name",
      type: "text",
      maxlen: "300",
      ismandatory: "Y",
    },
    {
      id: 2,
      name: "address_1",
      label: "Address 1",
      placeholder: "Enter Address 1",
      type: "textarea",
      maxlen: "300",
      ismandatory: "Y",
    },
    {
      id: 3,
      name: "address_2",
      label: "Address 2",
      placeholder: "Enter Address 2",
      type: "textarea",
      maxlen: "300",
      ismandatory: "N",
    },
    {
      id: 4,
      name: "city",
      label: "City",
      placeholder: "Enter City",
      type: "text",
      maxlen: "50",
      ismandatory: "Y",
    },
    {
      id: 5,
      name: "country",
      label: "Country",
      placeholder: "Enter Country",
      type: "text",
      maxlen: "50",
      ismandatory: "Y",
    },
    {
      id: 6,
      name: "no_of_org_functional_levels",
      label: "Organization Levels",
      placeholder: "Enter Organization Levels",
      type: "number",
      minval: "0",
      maxval: "10",
      ismandatory: "Y",
    },
  ];

  let breadcumb_menu = [
    { Label: "Home", Link: "/" },

    {
      Label: "Organization Definition",
    },
  ];

  let null_error_msg = warnings
    .filter(
      (items, index) =>
        items.error_code.includes("null") && items.error_from.includes("Client")
    )
    .map((data) => data.error_msg);

  const navigator = useNavigate();

  // Range function for validaion usage
  function fnRange(start, end) {
    let ans = [];
    for (let i = start; i <= end; i++) {
      ans.push(i);
    }
    return ans;
  }

  // get a permission for a user group
  const fnGetPermissions = async () => {
    let res = await fetch(
      `${process.env.REACT_APP_SERVER_URL}/api/join_user_group_access/${user.user_id}/${id}/`,
      {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          Authorization: "Bearer " + String(authTokens.access),
        },
      }
    );
    let data = await res.json();
    if (res.status === 200) {
      if (data.length > 0) {
        let pdata = { ...data };
        setRemove(pdata[0].delete === "Y" ? true : false);
        setEdit(pdata[0].edit === "Y" ? true : false);
        setAdd(pdata[0].add === "Y" ? true : false);
        setView(pdata[0].view === "Y" ? true : false);
      }
    }
  };

  // Get data of org_definition for a report
  const fnGetDetails = async () => {
    let res = await fetch(
      `${process.env.REACT_APP_SERVER_URL}/api/get_org_definition`,
      {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          Authorization: "Bearer " + String(authTokens.access),
        },
      }
    );
    let data = await res.json();
    if (res.status === 200) {
      if (data.length > 0) {
        setAdata(...data);
        setAction(true);
      }
    }

    let res1 = await fetch(
      `${process.env.REACT_APP_SERVER_URL}/api/get_org_definition_stop_light_indicators`,
      {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          Authorization: "Bearer " + String(authTokens.access),
        },
      }
    );
    let data1 = await res1.json();
    if (res1.status === 200) {
      if (data1.length > 0) {
        setQuery(data1);
        setAction(true);
      }
    }

    let res_helper = await fetch(
      `${process.env.REACT_APP_SERVER_URL}/api/get_helper/${id}`,
      {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          Authorization: "Bearer " + String(authTokens.access),
        },
      }
    );
    let helper_data = await res_helper.json();
    if (res_helper.status === 200) {
      if (helper_data) {
        setHelper(helper_data);
      }
    }
  };

  //  Function for updating org_definition details
  const fnUpdateDetails = async () => {
    setisloading(true);
    let e = orgDefnitionData.map((name) => name.name);
    let error_data = {};
    for (let i = 0; i < e.length; i++) {
      if (e[i] !== "address_2" && adata[e[i]] == "") {
        error_data[e[i]] = null_error_msg[0]
          .replace("%1", e[i])
          .replace(/_/g, " ");
      }
    }

    Client_error_msg(error_data);
    let null_flag = true;
    let null_flag_lt = true;
    let null_flag_range = false;

    // Stop Light Indicators Validation for null
    for (let i = 0; i < query.length; i++) {
      if (
        Number(query[i]["stop_light_indicator_from"]) === null ||
        Number.isNaN(Number(query[i]["stop_light_indicator_from"])) === true
      ) {
        let list = [...frerror];
        list[i]["stop_light_indicator_from"] = null_error_msg[0].replace(
          "%1",
          "start value"
        );
        //  "Can`t be null value";
        setFrerror(list);
        null_flag = true;
        break;
      } else {
        let list = [...frerror];
        list[i]["stop_light_indicator_from"] = "";
        setFrerror(list);
        null_flag = false;
      }

      if (
        Number(query[i]["stop_light_indicator_to"]) == null ||
        Number.isNaN(Number(query[i]["stop_light_indicator_to"])) === true
      ) {
        let list = [...toerror];
        list[i]["stop_light_indicator_to"] = null_error_msg[0].replace(
          "%1",
          "end value"
        );
        // "Can`t be null value";
        setToerror(list);
        null_flag = true;
        break;
      } else {
        let list = [...toerror];
        list[i]["stop_light_indicator_to"] = "";
        setToerror(list);
        null_flag = false;
      }
    }
    // Stop Light Indicators Validation for end

    // Stop Light Indicators Validation for From > To and max
    if (null_flag === false) {
      for (let i = 0; i < query.length; i++) {
        if (
          Number(query[i]["stop_light_indicator_from"]) <
          Number(query[i]["stop_light_indicator_to"]) &&
          Number(query[i]["stop_light_indicator_from"]) >= 0 &&
          Number(query[i]["stop_light_indicator_from"]) <= 100
        ) {
          let list = [...frerror];
          list[i]["stop_light_indicator_from"] = "";
          setFrerror(list);
          null_flag_lt = false;

          if (
            Number(query[i]["stop_light_indicator_to"]) >
            Number(query[i]["stop_light_indicator_from"]) &&
            Number(query[i]["stop_light_indicator_to"]) >= 0 &&
            Number(query[i]["stop_light_indicator_to"]) <= 100
          ) {
            let list = [...toerror];
            list[i]["stop_light_indicator_to"] = "";
            setToerror(list);
            null_flag_lt = false;
          } else {
            let list = [...toerror];
            list[i]["stop_light_indicator_to"] =
              "To should be greater than from and between 0 to 100";
            setToerror(list);
            null_flag_lt = true;
            break;
          }
        } else {
          let list = [...frerror];
          list[i]["stop_light_indicator_from"] =
            "From should be Lesser than to and between 0 to 100";
          setFrerror(list);
          null_flag_lt = true;
          // break;
          if (
            Number(query[i]["stop_light_indicator_to"]) >
            Number(query[i]["stop_light_indicator_from"]) &&
            Number(query[i]["stop_light_indicator_to"]) >= 0 &&
            Number(query[i]["stop_light_indicator_to"]) <= 100
          ) {
            let list = [...toerror];
            list[i]["stop_light_indicator_to"] = "";
            setToerror(list);
            null_flag_lt = false;
          } else {
            let list = [...toerror];
            list[i]["stop_light_indicator_to"] =
              "To should be greater than from and between 0 to 100";
            setToerror(list);
            null_flag_lt = true;
            break;
          }
        }
      }
    }
    // Stop Light Indicators Validation for end

    // Stop Light Indicators Validation for range
    if (null_flag === false && null_flag_lt === false) {
      let ar = [];
      for (let i = 0; i < query.length; i++) {
        ar.push(
          fnRange(
            Number(query[i]["stop_light_indicator_from"]),
            Number(query[i]["stop_light_indicator_to"])
          )
        );
      }
      let new_ar;
      for (let i = ar.length - 1; i >= 0; i--) {
        for (let j = i - 1; j >= 0; j--) {
          new_ar = ar[i].filter((x) => ar[j].includes(x));
          if (new_ar.length > 0) {
            let list_fr = [...frerror];
            list_fr[i]["stop_light_indicator_from"] =
              "Enter a valid from value";
            setFrerror(list_fr);
            null_flag_range = true;

            let list_to = [...toerror];
            list_to[i]["stop_light_indicator_to"] = "Enter a valid to value";
            setToerror(list_to);
            null_flag_range = true;
            break;
          } else {
            let list_fr = [...frerror];
            list_fr[i]["stop_light_indicator_from"] = "";
            setFrerror(list_fr);

            let list_to = [...toerror];
            list_to[i]["stop_light_indicator_to"] = "";
            setToerror(list_to);
          }
        }
      }
    }

    if (
      null_flag === false &&
      null_flag_lt === false &&
      null_flag_range === false
    ) {
      let res = await fetch(
        `${process.env.REACT_APP_SERVER_URL}/api/upd_org_definition/${adata.id}/`,
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
      let res1 = await fetch(
        `${process.env.REACT_APP_SERVER_URL}/api/upd_org_definition_stop_light_indicators/${adata.id}/`,
        {
          method: "PUT",
          body: JSON.stringify(query),
          headers: {
            "Content-Type": "application/json",
            Authorization: "Bearer " + String(authTokens.access),
          },
        }
      );
      // let data1 = await res1.json();
      if (res.status === 200 && res1.status === 200) {
        Swal.fire({
          icon: "success",
          text: "Updated Successfully!",
        }).then(function () {
          setError();
          setAction(false);
        });
      } else {
        setError(data);
      }
    }
    setisloading(false);
  };

  //  Function for deleting org_definition details
  const fnDeleteDetails = async (id) => {
    Swal.fire({
      title: "Are you sure?",
      text: "You won't be able to revert this!",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#3085d6",
      cancelButtonColor: "#d33",
      confirmButtonText: "Yes, delete it!",
    }).then((result) => {
      if (result.isConfirmed) {
        fetch(
          `${process.env.REACT_APP_SERVER_URL}/api/del_org_definition/${id}/`,
          {
            method: "PUT",
            body: JSON.stringify({
              delete_flag: "Y",
              last_updated_by: user.user_id,
            }),
            headers: {
              "Content-Type": "application/json",
              Authorization: "Bearer " + String(authTokens.access),
            },
          }
        );

        fetch(
          `${process.env.REACT_APP_SERVER_URL}/api/del_org_definition_stop_light_indicators/${id}/`,
          {
            method: "PUT",
            body: JSON.stringify({
              delete_flag: "Y",
              last_updated_by: user.user_id,
            }),
            headers: {
              "Content-Type": "application/json",
              Authorization: "Bearer " + String(authTokens.access),
            },
          }
        );

        Swal.fire(
          "Deleted!",
          "Organization Definition Deleted && stop Light Indicators...",
          "success"
        ).then(function () {
          setAdata({
            organization_name: "",
            address_1: "",
            address_2: "",
            city: "",
            country: "",
            no_of_org_functional_levels: "",
            created_by: user.user_id,
            last_updated_by: user.user_id,
          });
          setQuery([
            {
              stop_light_indicator: "#FF0000",
              created_by: user.user_id,
              last_updated_by: user.user_id,
            },
            {
              stop_light_indicator: "#FFA500",
              created_by: user.user_id,
              last_updated_by: user.user_id,
            },
            {
              stop_light_indicator: "#76B947",
              created_by: user.user_id,
              last_updated_by: user.user_id,
            },
            {
              stop_light_indicator: "#116530",
              created_by: user.user_id,
              last_updated_by: user.user_id,
            },
          ]);
          setAction(false);
        });
      }
    });
  };


  //  Function for inserting org_definition details
  const fnSubmitDetails = async () => {
    let e = orgDefnitionData.map((name) => name.name);
    let error_data = {};
    for (let i = 0; i < e.length; i++) {
      if (e[i] !== "address_2" && adata[e[i]] == "") {
        error_data[e[i]] = null_error_msg[0]
          .replace("%1", e[i])
          .replace(/_/g, " ");
      }
    }
    Client_error_msg(error_data);

    let null_flag = true;
    let null_flag_lt = true;
    let null_flag_range = false;
    setisloading(true);

    // Stop Light Indicators Validation for null
    for (let i = 0; i < query.length; i++) {
      if (
        Number(query[i]["stop_light_indicator_from"]) === null ||
        Number.isNaN(Number(query[i]["stop_light_indicator_from"])) === true
      ) {
        let list = [...frerror];
        list[i]["stop_light_indicator_from"] = null_error_msg[0].replace(
          "%1",
          "start value"
        );
        // "Can`t be null value";
        setFrerror(list);
        null_flag = true;
        // break;
      } else {
        let list = [...frerror];
        list[i]["stop_light_indicator_from"] = "";
        setFrerror(list);
        null_flag = false;
      }

      if (
        Number(query[i]["stop_light_indicator_to"]) == null ||
        Number.isNaN(Number(query[i]["stop_light_indicator_to"])) === true
      ) {
        let list = [...toerror];
        list[i]["stop_light_indicator_to"] = null_error_msg[0].replace(
          "%1",
          "end value"
        );
        // "Can`t be null value";
        setToerror(list);
        null_flag = true;
        // break;
      } else {
        let list = [...toerror];
        list[i]["stop_light_indicator_to"] = "";
        setToerror(list);
        null_flag = false;
      }
    }

    // Stop Light Indicators Validation for From > To and max
    if (null_flag === false) {
      for (let i = 0; i < query.length; i++) {
        if (
          Number(query[i]["stop_light_indicator_from"]) <
          Number(query[i]["stop_light_indicator_to"]) &&
          Number(query[i]["stop_light_indicator_from"]) >= 0 &&
          Number(query[i]["stop_light_indicator_from"]) <= 100
        ) {
          let list = [...frerror];
          list[i]["stop_light_indicator_from"] = "";
          setFrerror(list);
          null_flag_lt = false;
          if (
            Number(query[i]["stop_light_indicator_to"]) >
            Number(query[i]["stop_light_indicator_from"]) &&
            Number(query[i]["stop_light_indicator_to"]) >= 0 &&
            Number(query[i]["stop_light_indicator_to"]) <= 100
          ) {
            let list = [...toerror];
            list[i]["stop_light_indicator_to"] = "";
            setToerror(list);
            null_flag_lt = false;
          } else {
            let list = [...toerror];
            list[i]["stop_light_indicator_to"] =
              "To should be greater than from and between 0 to 100";
            setToerror(list);
            null_flag_lt = true;
            break;
          }
        } else {
          let list = [...frerror];
          list[i]["stop_light_indicator_from"] =
            "From should be Lesser than to and between 0 to 100";
          setFrerror(list);
          null_flag_lt = true;

          if (
            Number(query[i]["stop_light_indicator_to"]) >
            Number(query[i]["stop_light_indicator_from"]) &&
            Number(query[i]["stop_light_indicator_to"]) >= 0 &&
            Number(query[i]["stop_light_indicator_to"]) <= 100
          ) {
            let list = [...toerror];
            list[i]["stop_light_indicator_to"] = "";
            setToerror(list);
            null_flag_lt = false;
          } else {
            let list = [...toerror];
            list[i]["stop_light_indicator_to"] =
              "To should be greater than from and between 0 to 100";
            setToerror(list);
            null_flag_lt = true;
            break;
          }
        }
      }
    }
    // Stop Light Indicators Validation for end

    // Stop Light Indicators Validation for range
    if (null_flag === false && null_flag_lt === false) {
      let ar = [];
      for (let i = 0; i < query.length; i++) {
        ar.push(
          fnRange(
            Number(query[i]["stop_light_indicator_from"]),
            Number(query[i]["stop_light_indicator_to"])
          )
        );
      }
      let new_ar;
      for (let i = ar.length - 1; i >= 0; i--) {
        for (let j = i - 1; j >= 0; j--) {
          new_ar = ar[i].filter((x) => ar[j].includes(x));
          if (new_ar.length > 0) {
            let list_fr = [...frerror];
            list_fr[i]["stop_light_indicator_from"] =
              "Enter a valid from value";
            setFrerror(list_fr);
            null_flag_range = true;

            let list_to = [...toerror];
            list_to[i]["stop_light_indicator_to"] = "Enter a valid to value";
            setToerror(list_to);
            null_flag_range = true;
            break;
          } else {
            let list_fr = [...frerror];
            list_fr[i]["stop_light_indicator_from"] = "";
            setFrerror(list_fr);

            let list_to = [...toerror];
            list_to[i]["stop_light_indicator_to"] = "";
            setToerror(list_to);
          }
        }
      }
    }
    // Stop Light Indicators Validation for range end

    if (
      null_flag === false &&
      null_flag_lt === false &&
      null_flag_range === false
    ) {
      let res = await fetch(
        `${process.env.REACT_APP_SERVER_URL}/api/ins_org_definition`,
        {
          method: "POST",
          body: JSON.stringify(adata),
          headers: {
            "Content-Type": "application/json",
            Authorization: "Bearer " + String(authTokens.access),
          },
        }
      );
      let data = await res.json();
      if (res.status === 201) {
        setError();
        setAction();
        for (let i = 0; i < query.length; i++) {
          let temp = [...query];
          temp[i]["def_id"] = data.id;
          setQuery(temp);
        }

        let res1 = await fetch(
          `${process.env.REACT_APP_SERVER_URL}/api/ins_org_definition_stop_light_indicators`,
          {
            method: "POST",
            body: JSON.stringify(query),
            headers: {
              "Content-Type": "application/json",
              Authorization: "Bearer " + String(authTokens.access),
            },
          }
        );
        // let data1 = await res1.json();
        if (res.status === 201 && res1.status === 201) {
          Swal.fire({
            icon: "success",
            title: "Created Indictors",
            text: "Created Successfully!",
          });
        } else {
          alert("Error at insert stop light indicators");
        }
      } else {
        setError(data);
      }
    }
    setisloading(false);
  };

  // ! test
  const fnGetWarnings = async () => {
    let res_warnings = await fetch(
      `${process.env.REACT_APP_SERVER_URL}/api/get_warnings`,
      {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          Authorization: "Bearer " + String(authTokens.access),
        },
      }
    );

    let warning_data = await res_warnings.json();
    if (res_warnings.status === 200) {
      if (warning_data) {
        setWarnings(warning_data);
      }
    }
  };

  //  Used for rendering every time action done
  useEffect(() => {
    fnGetPermissions();
    fnGetWarnings();
    fnGetDetails();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [action]);

  if (adata.last_updated_by !== user.user_id) {
    setAdata({ ...adata, last_updated_by: user.user_id });
  }

  // onchange function for org_definiton
  const fnInputHandler = (name, value) => {
    setAdata((prevState) => ({
      ...prevState,
      [name]: value,
    }));

    const errors = { ...error };
    setError(errors);
  };

  // onchange function 2 for org_defintion_stop_light_indicators
  const fnInputHandler2 = (e, i) => {
    let newformValues = [...query];
    newformValues[i][e.target.name] = e.target.value;
    setQuery(newformValues);
  };

  const help = helper
    .filter((user) => String(user.page_no).includes(String(id)))
    .map((use) => use);

  return (
    //sc_cl_page_header
    <>
      {view === undefined ?
        ''
        : <>
          {view === false ? (
            <Modal
              show={true}
              centered
              style={{ padding: "20px", textAlign: "center" }}
            >
              <Modal.Header className="justify-content-center text-danger">
                <BiMessageRoundedError size={70} />
              </Modal.Header>
              <Modal.Body>
                <h2>{"User Restricted"}</h2>
                <h5> {"You don't have access!"}</h5>
              </Modal.Body>
              <Modal.Footer className="justify-content-center">
                <FnBtnComponent
                  onClick={() => history("/")}
                  children={"Close"}
                  classname={"sc_cl_close_button"}
                ></FnBtnComponent>
              </Modal.Footer>
            </Modal>
          ) : (

            <div className="sc_cl_div w-100 px-2">
              <div className="d-flex flex-column flex-lg-row sc_cl_row sc_cl_page_header">
                <div className="align-items-center col-12 col-lg-6 d-flex py-2 text-center">
                  <h5 className="sc_cl_head m-0">Organization Definition</h5>
                </div>

                <div className="align-items-center col-12 col-lg-6 d-flex justify-content-lg-end py-2 text-center">
                  <FnBreadCrumbComponent
                    seperator_symbol={" >"}
                    nav_items={breadcumb_menu}
                  />
                </div>
              </div>

              <div className="sc-cl-main-content">
                <FnFormComponent
                  fields={orgDefnitionData}
                  formData={adata}
                  tooltipvalue={helper}
                  errorcode={error}
                  disablevalue={!edit}
                  onchange={fnInputHandler}
                  stylename={"sc_cl_input"}
                  client_error_msg={client_error_msg}
                />

                <div className="col-lg-5 col-12 sc_cl_table_parent_cls">
                  <table className="p-2">
                    <thead>
                      <tr>
                        <th>Indicators</th>
                        <th>Start</th>
                        <th>End</th>
                      </tr>
                    </thead>
                    <tbody>
                      {
                        query.map((indicatorItems, i) => {
                          return (
                            <tr>
                              <td>
                                <input
                                  type="color"
                                  name="stop_light_indicator"
                                  className="sc_cl_color_picker"
                                  value={indicatorItems.stop_light_indicator || ""}
                                  onChange={(e) => fnInputHandler2(e, i)}
                                  disabled
                                />
                              </td>
                              <td>
                                <input
                                  type="number"
                                  style={{ borderColor: indicatorItems.stop_light_indicator }}
                                  name="stop_light_indicator_from"
                                  className="sc_cl_input w-75 m-auto form-control-sm"
                                  value={
                                    indicatorItems.stop_light_indicator_from != null
                                      ? indicatorItems.stop_light_indicator_from
                                      : indicatorItems.stop_light_indicator_from || ""
                                  }
                                  onChange={(e) => fnInputHandler2(e, i)}
                                  placeholder="Enter From value"
                                  disabled={!edit}
                                />
                                <span className="sc_cl_span red" key={i}>
                                  {frerror[i]["stop_light_indicator_from"]}
                                </span>
                              </td>

                              <td>
                                <input
                                  type="number"
                                  style={{ borderColor: indicatorItems.stop_light_indicator }}
                                  name="stop_light_indicator_to"
                                  className="sc_cl_input w-75 m-auto form-control-sm"
                                  value={
                                    indicatorItems.stop_light_indicator_to != null
                                      ? indicatorItems.stop_light_indicator_to
                                      : indicatorItems.stop_light_indicator_to || ""
                                  }
                                  onChange={(e) => fnInputHandler2(e, i)}
                                  placeholder="Enter To value"
                                  disabled={!edit}
                                />
                                <span className="sc_cl_span red">
                                  {toerror[i]["stop_light_indicator_to"]}
                                </span>
                              </td>
                            </tr>
                          )
                        })
                      }
                    </tbody>
                  </table>
                </div>



                <div className="py-2 d-flex flex-lg-row sc_cl_row" id="mb_btn_view">
                  {action ? (
                    <>
                      <FnBtnComponent
                        onClick={fnUpdateDetails}
                        classname={`${edit ? "" : "d-none"} sc_cl_submit_button`}
                        children={"Update"}
                      />

                      <FnBtnComponent
                        onClick={() => fnDeleteDetails(adata.id)}
                        children={"Delete"}
                        classname={`${edit ? "" : "d-none"
                          } sc_cl_close_button ms-2`}
                      />
                    </>
                  ) : (
                    <>
                      <FnBtnComponent
                        onClick={fnSubmitDetails}
                        classname={`${add ? "" : "d-none"} sc_cl_submit_button`}
                        children={"Submit"}
                      />
                    </>
                  )}
                  <FnBtnComponent
                    children={"Back"}
                    onClick={() => navigator("/")}
                    classname={"sc_cl_close_button ms-2"}
                  />
                </div>
                {/* </Form.Group>
</Form> */}
              </div>
            </div>
          )}
        </>
      }
    </>
  );
};

export default FnOrgDefinitionForm;
