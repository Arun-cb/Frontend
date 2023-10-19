/* ============================================================================================================================================================

   CITTABASE SOLUTIONS - All Rights Reserved.
   ------------------------------------------------------------------------------------------------------------------------------------------------------------

   12-Sep-2022   Priya S      Initial Version             V1

   ** This Page is to define perspectives form  **

============================================================================================================================================================*/

import React, { useState, useContext, useEffect } from "react";
import { useParams } from "react-router-dom";
import AuthContext from "../../context/AuthContext";
import { Row } from "react-bootstrap";
import Swal from "sweetalert2";
import FnBtnComponent from "../../components/buttonComponent";
import FnBreadCrumbComponent from "../../components/breadCrumbComponent";
import FnFormComponent from "../../components/formComponent";

const FnPerspectivesForm = ({
  data,
  close,
  viewvalue,
  diverts,
  setdiverts,
  configData  
}) => {
  let { authTokens, user } = useContext(AuthContext);
  const [adata, setAdata] = useState({
    created_by: user.user_id,
    last_updated_by: user.user_id,
  });
  const [error, setError] = useState({});
  const [action, setAction] = useState(false);
  let a = [data];
  const { id } = useParams();
  const [helper, setHelper] = useState([]);


  //formComp test

  const fieldData = [
    { id: 1, name: 'perspective_code', label: 'Perspective Code', placeholder: 'Enter Perspective Code', type: 'text',maxlen:'50',ismandatory:'Y'  },
    { id: 2, name: 'perspective', label: 'Perspective', placeholder: 'Enter Perspective Code', type: 'text',maxlen:'100',ismandatory:'Y'  },
    { id: 3, name: 'description', label: 'Description', placeholder: 'Enter Description', type: 'text',maxlen:'200',ismandatory:'Y'  }
  ]

  let breadcumb_menu = [
    { Label: "Home", Link: "/" },

    {
      Label: configData ? configData.menu_name : "Perspectives",
      Link: `/` + (configData ? configData.url : `Perspectives` ) + `/${id}`,
    },
  ];

  //  Function for updating perspective details
  const fnUpdateDetails = async () => {
    let res = await fetch(
      `${process.env.REACT_APP_SERVER_URL}/api/upd_perspectives/${adata.id}/`,
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
      Swal.fire({
        icon: "success",
        text: "Updated Successfully!",
      }).then(function () {
        close(false);
      });
    } else {
      setError(data);
    }
  };

  //  Function for inserting perspective details
  const fnSubmitDetails = async () => {
    let res = await fetch(
      `${process.env.REACT_APP_SERVER_URL}/api/ins_perspectives`,
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
    if (res.status === 200) {
      setError();
      setAction();
      Swal.fire({
        icon: "success",
        text: "Created Successfully!",
      }).then(function () {
        close(false);
      });
    } else {
      setError(data);
    }
  };

  //  Used for rendering every time action done
  useEffect(() => {
    const fnGetDetails = async () => {
      let res_helper = await fetch(
        `${process.env.REACT_APP_SERVER_URL}/api/get_helper`,
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
    }
    fnGetDetails();
    if (diverts === true) {
      const newdata = a.map(
        ({
          id,
          perspective_code,
          perspective,
          description,
          created_by,
          last_updated_by,
        }) => ({
          id,
          perspective_code,
          perspective,
          description,
          created_by,
          last_updated_by,
        })
      );
      setAdata(...newdata);
      setAction(true);
      setdiverts(false);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [action]);

  if (adata.last_updated_by !== user.user_id) {
    setAdata({ ...adata, last_updated_by: user.user_id });
  }

  // Onchange function
  const fnInputHandler = (name, value) => {
    // setAdata({ ...adata, [e.target.name]: e.target.value });
    setAdata((prevState) => ({
      ...prevState,
      [name]: value
    }))

    const errors = { ...error }
    setError(errors)
  };

  const help = helper.filter(user => String(user.page_no)
    .includes(String(id))).map((use) => use);


  return (
    <div className="sc_cl_div w-100 px-2">

      <div className="d-flex flex-column flex-lg-row sc_cl_row sc_cl_page_header">
        <div className="align-items-center col-12 col-lg-6 d-flex py-2 text-center">
          <h5 className="sc_cl_head m-0">{configData ? configData.menu_name : "Perspective"}</h5>
        </div>

        <div className="align-items-center col-12 col-lg-6 d-flex justify-content-lg-end py-2 text-center">
          <FnBreadCrumbComponent seperator_symbol={" >"} nav_items={breadcumb_menu} clickevent={() => close(false)}/>
        </div>
      </div>

      {/* <hr></hr> */}

      <Row className="mt-2 mt-lg-2 sc-cl-main-content">

        <FnFormComponent fields={fieldData} formData={adata} onchange={fnInputHandler} onsubmit={fnSubmitDetails} errorcode = {error} disablevalue={viewvalue} stylename={"sc_cl_input mb-2"} tooltipvalue={help} />

        <div className="align-items-center d-flex justify-content-start mt-2 sc_cl_div">
          {viewvalue === false &&
            (action ? (
              <FnBtnComponent onClick={fnUpdateDetails} classname={"sc_cl_submit_button"} children={"Update"} />
            ) : (
              <FnBtnComponent onClick={fnSubmitDetails} children={"Submit"} classname={"sc_cl_submit_button"} />
            ))}
          <FnBtnComponent classname={"sc_cl_close_button ms-2"} children={"Back"} onClick={() => close(false)} />
        </div>
      </Row>

    </div>
  );
};

export default FnPerspectivesForm;