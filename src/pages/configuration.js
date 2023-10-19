/* =========================================================================================================================
   CITTIABASE SOLUTIONS - All Rights Reserved.
   ----------------------------------------------------------------------------------------------------------------------------

   15-JUL-2023  Jagadeshwaran R      Initial Version             V1

   ** SSO Configurtation page contains Single sign on Functionalities Parameter passing page **

==========================================================================================================================*/

import React, { useState, useContext, useEffect } from "react";
import FnBreadCrumbComponent from "../components/breadCrumbComponent";
import FnSmtpConfiguration from "./smtpConfiguration";
import FnSsoConfiguration from "./ssoConfiguration";
import AuthContext from "../context/AuthContext";
import FnTabComponent from "../components/tabComponent";
import { SiMicrosoftazure } from "react-icons/si";
import { PiClockClockwise } from "react-icons/pi";
import { RiMailSettingsLine } from 'react-icons/ri';
import FnSessionConfiguration from "./sessionConfiguration";
import { useNavigate, useParams } from "react-router-dom";
import { Col, Row, Container, Table, Form, Modal } from "react-bootstrap";
import FnBtnComponent from "../components/buttonComponent";
import { BiMessageRoundedError } from "react-icons/bi";

const FnConfiguration = () => {
  let { authTokens, user } = useContext(AuthContext);
  const [view, setView] = useState();
  const { id } = useParams();
  const navigator = useNavigate();
  
  let breadcumb_menu = [
    { Label: "Home", Link: "/" },

    {
      Label: "Configuration",
    },
  ];

  const tabOptions = [
    {
      id: 1,
      label: "Azure AD",
      icon: <SiMicrosoftazure size={20} />,
      content: <FnSsoConfiguration />,
    },
    {
      id: 2,
      label: "SMTP",
      icon: <RiMailSettingsLine size={25} />,
      content: <FnSmtpConfiguration />,
    },
    {
      id: 3,
      label: "Session Management",
      icon: <PiClockClockwise  size={25} />,
      content: <FnSessionConfiguration />,
    },
  ];

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
        // setRemove(pdata[0].delete === "Y" ? true : false);
        // setEdit(pdata[0].edit === "Y" ? true : false);
        // setAdd(pdata[0].add === "Y" ? true : false);
        setView(pdata[0].view === "Y" ? true : false);
      }
    }
  };

  useEffect(() => {
    fnGetPermissions();
  },[]);

  return (//sc_cl_page_header
  <>
    {view === undefined ?
    '' 
  :<>
      {view === false ? (
        // <FnAccessRestricted />
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
              onClick={() => navigator("/")}
              children={"Close"}
              classname={"sc_cl_close_button"}
            ></FnBtnComponent>
          </Modal.Footer>
        </Modal>
      ) :  (
    <div className="sc_cl_div w-100 px-2">
      <div className="d-flex flex-column flex-lg-row sc_cl_row sc_cl_page_header">
        <div className="align-items-center col-12 col-lg-6 d-flex py-2 text-center">
          <h5 className="sc_cl_head m-0">Configuration</h5>
        </div>

        <div className="align-items-center col-12 col-lg-6 d-flex justify-content-lg-end py-2 text-center">
          <FnBreadCrumbComponent
            seperator_symbol={" >"}
            nav_items={breadcumb_menu}
          />
        </div>
      </div>

      {/* <hr></hr> */}

      <FnTabComponent data={tabOptions} />
    </div>
     )}
     </>
 }
   </>
  );
};

export default FnConfiguration;
