/* ============================================================================================================================================================

   CITTABASE SOLUTIONS - All Rights Reserved.
   ------------------------------------------------------------------------------------------------------------------------------------------------------------
  
   30-Sep-2022  Arun R      Initial Version             V1
   
   ** This Page is to define Overall Global Settngs for this Application  **
   
============================================================================================================================================================*/

import React, { useState, useContext, useEffect } from "react";
import AuthContext from "../context/AuthContext";
import {
  FormControl,
  FormGroup,
  FormLabel,
  FormSelect,
  Button,
  Modal,
} from "react-bootstrap";
import FnBtnComponent from "../components/buttonComponent";
import FnBreadCrumbComponent from "../components/breadCrumbComponent";

import PreContext from "../context/PreContext";
import { BiMessageRoundedError } from "react-icons/bi";
import { useNavigate, useParams } from "react-router-dom";

const FnSettingsForm = () => {
  let { authTokens, user } = useContext(AuthContext);
  const { id } = useParams();
  const history = useNavigate();
  let { preloading } = useContext(PreContext);
  const [adata, setAdata] = useState({
    created_by: user.user_id,
    last_updated_by: user.user_id,
  });
  const [, setError] = useState({});
  const [inputs, setInputs] = useState({});
  const [load, setLoad] = useState(false);

  const values = ["black", "red", "blue", "skyblue"];
  const labels = ["Black", "Red", "Blue", "Skyblue"];
  let i = 0;
  let options = [];

  const [add, setAdd] = useState(false);
  const [view, setView] = useState();
  const [edit, setEdit] = useState(false);
  const [remove, setRemove] = useState(false);

  let breadcumb_menu = [
    { Label: "Home", Link: "/" },

    {
      Label: "Settings",
    },
  ];

  for (i = 0; i < values.length; i++) {
    options.push({ value: values[i], label: labels[i] });
  }

  const getDetails = async () => {
    let res = await fetch(
      `${process.env.REACT_APP_SERVER_URL}/api/get_settings/${user.user_id}/`,
      {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          Authorization: "Bearer " + String(authTokens.access),
        },
      }
    );
    let data = await res.json();
    let tempobj = Object.create({});
    if (res.status === 200) {
      if (data.length > 0) {
        data.forEach((temp) => {
          tempobj[temp.variable_name] = { ...temp };
        });
        setInputs(tempobj);
      }
    }
  };

  const fn_submit_details = async () => {
    let res = await fetch(
      `${process.env.REACT_APP_SERVER_URL}/api/upd_settings/${user.user_id}/`,
      {
        method: "PUT",
        body: JSON.stringify(inputs),
        headers: {
          "Content-Type": "application/json",
          Authorization: "Bearer " + String(authTokens.access),
        },
      }
    );
    let data = await res.json();
    if (res.status === 200) {
      setError();
      alert("Settings updated Successfully...");
      setAdata({ created_by: user.user_id, last_updated_by: user.user_id });
      preloading(true);
    } else {
      setError(data);
    }
  };

  const fnGetPermissions = async () => {
    // API call to Get Arc level User Group Permissions
    let get_permission_res = await fetch(
      `${process.env.REACT_APP_SERVER_URL}/api/join_user_group_access/${user.user_id}/${id}/`,
      {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          Authorization: "Bearer " + String(authTokens.access),
        },
      }
    );
    let get_permission_data = await get_permission_res.json();
    if (get_permission_res.status === 200) {
      if (get_permission_data.length > 0) {
        let pdata = { ...get_permission_data };
        setRemove(pdata[0].delete === "Y" ? true : false);
        setEdit(pdata[0].edit === "Y" ? true : false);
        setAdd(pdata[0].add === "Y" ? true : false);
        setView(pdata[0].view === "Y" ? true : false);
      }
    }
  };

  useEffect(() => {
    fnGetPermissions();
    
    if (load === false) {
      getDetails();
    } else {
      setLoad();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [load]);

  const InputHandler = (e, name) => {
    if (name === undefined) {
      if (!inputs[e.target.name]) {
        inputs[e.target.name] = {
          ...adata,
          variable_name: e.target.name,
          value: e.target.value,
        };
        setLoad(true);
      } else {
        inputs[e.target.name] = {
          ...inputs[e.target.name],
          value: e.target.value,
        };
        setLoad(true);
      }
    } else {
      if (!inputs[name]) {
        inputs[name] = { ...adata, variable_name: name, value: e.value };
        setLoad(true);
      } else {
        inputs[name] = { ...inputs[name], value: e.value };
        setLoad(true);
      }
    }
    // if(!inputs[e.target.name]){
    //         inputs[e.target.name] = {...adata, variable_name:e.target.name, value: e.target.value}
    //     setLoad(true)
    // }else{
    //     inputs[e.target.name] = {...inputs[e.target.name], value: e.target.value}
    //     setLoad(true)
    // }
  };
  
  return (
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
    <div className="sc_cl_div">
      <div className="sc_cl_row">
        <FormGroup className="align-items-center d-flex">
          <FormLabel className="m-0 sc_cl_label">Pagination</FormLabel>
          <FormControl
            className="ms-3 w-25"
            type="number"
            name="pagination"
            onChange={InputHandler}
            value={!inputs["pagination"] ? "" : inputs["pagination"].value}
          />
        </FormGroup>

        <FormGroup className="align-items-center d-flex py-2">
          <FormLabel className="m-0 sc_cl_label text-nowrap">
            Date Format
          </FormLabel>
          <FormSelect
            className="ms-2 w-25"
            name="date"
            title="date format"
            onChange={InputHandler}
            value={!inputs["date"] ? "" : inputs["date"].value}
          >
            <option disabled>---Select---</option>
            <option value="dd-MM-yyyy">DD-MM-YYYY</option>
            <option value="yyyy-MM-dd">YYYY-MM-DD</option>
            <option value="dd/MM/yyyy">DD/MM/YYYY</option>
            <option value="Do MMM yyyy">Do MMM YYYY</option>
            <option value="dd-MM-yyyy H:mm:ss">DD-MM-YYYY H:mm:ss</option>
          </FormSelect>
        </FormGroup>
      </div>

      <div className="d-flex justify-content-between sc_cl_row">
        <div>
          <FnBtnComponent
            onClick={fn_submit_details}
            classname={`sc_cl_submit_button`}
            children={"Submit"}
          />
        </div>
      </div>
    </div>
    )}
    </>
  }
</>
  );
};

export default FnSettingsForm;
