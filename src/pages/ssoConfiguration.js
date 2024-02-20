/* =========================================================================================================================
   CITTIABASE SOLUTIONS - All Rights Reserved.
   ----------------------------------------------------------------------------------------------------------------------------

   15-JUL-2023  Jagadeshwaran R      Initial Version             V1

   ** SSO Configurtation page contains Single sign on Functionalities Parameter passing page **

==========================================================================================================================*/

import React, { useState, useContext, useRef, useEffect } from "react";
import AuthContext from "../context/AuthContext";
import {
  Form,
  FormGroup,
  FormLabel,
  FormControl,
  Row,
  Col,
} from "react-bootstrap";
import Swal from "sweetalert2";
import FnBtnComponent from "../components/buttonComponent";
import { useParams, useNavigate } from "react-router-dom";
import CryptoJS from "crypto-js";


const FnSsoConfiguration = () => {
  let { authTokens, user } = useContext(AuthContext);
  const [action, setAction] = useState(false);
  const [error, setError] = useState({});
  const [ssodata, setSsodata] = useState({
    username: "admin",
    created_by: user.user_id,
    last_updated_by: user.user_id,
  });
  

  const navigator = useNavigate();

  const fnGetDetails = async () => {
    let sso_res = await fetch(
      `${process.env.REACT_APP_SERVER_URL}/api/get_sso`,
      {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          Authorization: "Bearer " + String(authTokens.access),
        },
      }
    );
    let sso_data = await sso_res.json();
    if (sso_res.status === 200) {
      if (sso_data.length > 0) {
        // console.log("get sso",sso_data);
        // setSsodata(...sso_data);
        const decryptapp = CryptoJS.AES.decrypt(sso_data[0].app_id, process.env.REACT_APP_SECRET_KEY);
        const decryptedAppId = JSON.parse(decryptapp.toString(CryptoJS.enc.Utf8));
        const decrypttenant = CryptoJS.AES.decrypt(sso_data[0].tenant_id, process.env.REACT_APP_SECRET_KEY);
        const decryptedTenantId = JSON.parse(decrypttenant.toString(CryptoJS.enc.Utf8));
        setSsodata({
          id: sso_data[0].id,
          app_id: decryptedAppId,
          tenant_id: decryptedTenantId,
          created_by: sso_data[0].created_by,
          last_updated_by: sso_data[0].last_updated_by,
        });
        setAction(true);
      }
    }
  };
  
  const fnSubmitDetails = async () => {
    let res = await fetch(`${process.env.REACT_APP_SERVER_URL}/api/ins_sso`, {
      method: "POST",
      body: JSON.stringify(
        {app_id: CryptoJS.AES.encrypt(JSON.stringify(ssodata.app_id), process.env.REACT_APP_SECRET_KEY).toString(),
        tenant_id: CryptoJS.AES.encrypt(JSON.stringify(ssodata.tenant_id), process.env.REACT_APP_SECRET_KEY).toString(),
        created_by: user.user_id,
        last_updated_by: user.user_id,}),
      headers: {
        "Content-Type": "application/json",
        Authorization: "Bearer " + String(authTokens.access),
      },
    });
    let data = await res.json();
    if (res.status === 201) {
      setAction();
      setError();
      Swal.fire({
        icon: "success",
        // title: 'Created',
        text: "Created Successfully!",
      }).then(function () {});
    } else {
      setError(data);
    }
  };

  const fnUpdateDetails = async () => {
    let res = await fetch(
        `${process.env.REACT_APP_SERVER_URL}/api/upd_sso/${ssodata.id}/`,
        {
          method: "PUT",
          body: JSON.stringify(ssodata),
          headers: {
            "Content-Type": "application/json",
            Authorization: "Bearer " + String(authTokens.access),
          },
        }
      );
      let data = await res.json();

      if (res.status === 200) {
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
  };

  const fnInputHandler = (e) => {
    setSsodata({ ...ssodata, [e.target.name]: e.target.value });
    setError({ ...error, [e.target.name]: "" });
  };

  useEffect(() => {
    fnGetDetails();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  if (ssodata.last_updated_by !== user.user_id) {
    setSsodata({ ...ssodata, last_updated_by: user.user_id });
  }

 
  return(
      <>
      <div className="m-4">
      <Row>
          <Col
            lg={6}
            sm={12}
          >
        
        <Form>
        <FormGroup className=" align-items-lg-center d-flex flex-column flex-lg-row">
          <FormLabel className=" col-lg-4 col-md-8 col-sm-12 form-label m-0 text-nowrap">
            App Id <sup className="text-danger">*</sup>
          </FormLabel>

          <FormControl
            size="sm"
            type="text"
            name="app_id"
            value={ssodata.app_id || ""}
            onChange={fnInputHandler}
            placeholder="Enter App Id"
            // className="sc_cl_input col-lg-5"
            //   disabled={!edit}
          />
          <span className="sc_cl_span red">{error && error.app_id}</span>
        </FormGroup>

        <FormGroup className=" align-items-lg-center d-flex flex-column flex-lg-row my-2">
          <FormLabel className=" col-lg-4 col-md-8 col-sm-12 form-label m-0 text-nowrap">
            Tenant Id <sup className="text-danger">*</sup>
          </FormLabel>

          <FormControl
            size="sm"
            type="text"
            name="tenant_id"
            value={ssodata.tenant_id || ""}
            onChange={fnInputHandler}
            placeholder="Enter Tenant Id"
            // className="sc_cl_input col-lg-5"
            //   disabled={!edit}
          />
          <span className="sc_cl_span red">{error && error.tenant_id}</span>
        </FormGroup>
        </Form>
        </Col>
        </Row>
      </div>
      <div className="m-4 d-flex flex-column flex-lg-row sc_cl_row">
        {action ? (
          <>
            <FnBtnComponent
              onClick={fnUpdateDetails}
              classname={"sc_cl_submit_button"}
              children={"Update"}
            />
          </>
        ) : (
          <>
            <FnBtnComponent
              onClick={fnSubmitDetails}
              classname={` sc_cl_submit_button`}
              children={"Submit"}
            />
          </>
        )}
        <>
          <FnBtnComponent
            children={"Back"}
            onClick={() => navigator("/")}
            classname={"sc_cl_close_button ms-2"}
          />
        </>
      </div>
      </>
    )
  
};

export default FnSsoConfiguration;
