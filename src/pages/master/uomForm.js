/* ============================================================================================================================================================

   CITTABASE SOLUTIONS - All Rights Reserved.
   ------------------------------------------------------------------------------------------------------------------------------------------------------------

   02-Sep-2022   Dinesh J      Initial Version             V1

   ** This Page is to define unit of measures form  **

============================================================================================================================================================*/

import React, { useState, useContext, useEffect } from "react";
import AuthContext from "../../context/AuthContext";
import { Row, FormGroup, FormLabel, FormControl } from "react-bootstrap";
import { useParams } from "react-router-dom";
import Swal from "sweetalert2";
import FnTooltipComponent from "../../components/tooltipComponent";
import FnFormComponent from "../../components/formComponent";
import FnBtnComponent from "../../components/buttonComponent";
import FnBreadCrumbComponent from "../../components/breadCrumbComponent";

const FnUomForm = ({ data, close, viewvalue }) => {
  let { authTokens, user } = useContext(AuthContext);
  const [adata, setAdata] = useState({
    created_by: user.user_id,
    last_updated_by: user.user_id,
  });
  const [error, setError] = useState({});
  const [action, setAction] = useState(false);
  const { id } = useParams();
  const [helper, setHelper] = useState([]);


  const uomFeildData = [
    { id: 1, name: 'uom_code', label: 'UOM Code', placeholder: 'Enter UOM code', type: 'text', maxlen: '5',ismandatory:'Y'  },
    { id: 2, name: 'description', label: 'Description', placeholder: 'Enter Description', type: 'text', maxlen: '100',ismandatory:'Y'  }
  ]

  let breadcumb_menu = [
    { Label: "Home", Link: "/" },

    {
      Label: "UOM Report",
      Link: `/uom_report/${id}`,
    },

    { Label: "UOM Form" },
  ];

  //  Function for inserting perspective details
  const fnSubmitDetails = async () => {
    let res = await fetch(`${process.env.REACT_APP_SERVER_URL}/api/ins_uom`, {
      method: "POST",
      body: JSON.stringify(adata),
      headers: {
        "Content-Type": "application/json",
        Authorization: "Bearer " + String(authTokens.access),
      },
    });
    let data = await res.json();
    if (res.status === 201) {
      setError();
      setAction();
      Swal.fire({
        icon: "success",
        title: "Created",
        text: "Created Successfully!",
      }).then(function () {
        close(false);
      });
    } else {
      setError(data);
    }
  };

  //  Function for updating perspective details
  const fnUpdateDetails = async () => {
    let res = await fetch(
      `${process.env.REACT_APP_SERVER_URL}/api/upd_uom/${adata.id}/`,
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
      Swal.fire({
        icon: "success",
        text: "Updated Successfully!",
      }).then(function () {
        setAction(false);
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
    if (data) {
      setAdata(data);
      setAction(true);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [action]);

  if (adata.last_updated_by !== user.user_id) {
    setAdata({ ...adata, last_updated_by: user.user_id });
  }

  // Onchange function
  const fnInputHandler = (name, value) => {
    // setAdata({ ...adata, [e.target.name]: e.target.value.toUpperCase() });
    // setError({ ...error, [e.target.name]: "" });
    setAdata((prevState) => ({
      ...prevState,
      [name]: value.toUpperCase()
    }))

    const errors = { ...error }
    setError(errors)

    // const errors = { ...error }
    // setError((prevErrors)=>({
    //   ...prevErrors,
    //   [name]:''
    // }))
  };

  const help = helper.filter(user => String(user.page_no)
    .includes(String(id))).map((use) => use);

  return (
    <div className="sc_cl_div w-100 px-2">

      <div className="d-flex flex-column flex-lg-row sc_cl_row">
        <div className="align-items-center col-12 col-lg-6 d-flex py-2 text-center">
          <h5 className="sc_cl_head m-0">UOM</h5>
        </div>

        <div className="align-items-center col-12 col-lg-6 d-flex justify-content-lg-end py-2 text-center">
          <FnBreadCrumbComponent seperator_symbol={" >"} nav_items={breadcumb_menu} clickevent={() => close(false)} />
        </div>
      </div>

      <hr></hr>

      <div className="sc_cl_row">
        <FnFormComponent fields={uomFeildData} tooltipvalue={help} formData={adata} onchange={fnInputHandler} disablevalue={viewvalue} errorcode={error} stylename={"mb-2 sc_cl_input"} />

        <div className="sc_cl_div align-items-center d-flex  w-auto">
          {viewvalue === false &&
            (action ?
              <FnBtnComponent onClick={fnUpdateDetails} classname={"sc_cl_submit_button"} children={"Update"} />
              :
              <FnBtnComponent onClick={fnSubmitDetails} children={"Submit"} classname={"sc_cl_submit_button"} />)}

          <FnBtnComponent onClick={() => close(false)} children={"Back"} classname={"sc_cl_close_button ms-2"} />
        </div>
      </div>
    </div>
  );
};

export default FnUomForm;
