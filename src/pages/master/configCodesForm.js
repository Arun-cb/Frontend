/* ============================================================================================================================================================

   CITTABASE SOLUTIONS - All Rights Reserved.
   ------------------------------------------------------------------------------------------------------------------------------------------------------------

   05-Sep-2022   Priya S      Initial Version             V1

   ** This Page is to define config codes form  **

============================================================================================================================================================*/

import React, { useState, useContext, useEffect } from "react";
import { Link, useParams } from "react-router-dom";
import AuthContext from "../../context/AuthContext";
import { Row, FormGroup, FormLabel, FormControl } from "react-bootstrap";
import Swal from "sweetalert2";
import FnBtnComponent from "../../components/buttonComponent";
import FnTooltipComponent from "../../components/tooltipComponent";
import FnBreadCrumbComponent from "../../components/breadCrumbComponent";
import FnFormComponent from "../../components/formComponent";

const FnConfigCodesForm = ({ data, close, viewvalue, diverts, setdiverts }) => {
  let { authTokens, user, setLoading } = useContext(AuthContext);
  const [adata, setAdata] = useState({
    created_by: user.user_id,
    last_updated_by: user.user_id,
  });
  const [error, setError] = useState({});
  const [action, setAction] = useState(false);
  let a = [data];
  const { id } = useParams();
  const [helper, setHelper] = useState([]);

  const configcodesFieldData = [
    {id:1, name: 'config_type', label: 'Config Type', placeholder: 'Enter a value', type: 'select' ,maxlen:'500',ismandatory:'Y' },
    {id:2, name: 'config_code', label: 'Config Code', placeholder: 'Enter a value', type: 'text' ,maxlen:'500',ismandatory:'N'},
    {id:3, name: 'config_value', label: 'Config Value', placeholder: 'Enter a value', type: 'text' ,maxlen:'500',ismandatory:'Y' },
    {id:4, name: 'is_active', label: 'Is Active', type: 'switch' }
  ]

  let selectedData = {
    "config_type": [
        {
            value: "Period Type",
            label: "Period Type"
        },
        {
            value: "Frequency",
            label: "Frequency"
        },
        // {
        //     value: "Measure",
        //     label: "Measure"
        // },
        {
            value: "Optimization",
            label: "Optimization"
        },
        {
            value: "Chart Type",
            label: "Chart Type"
        },
        {
            value: "YTD",
            label: "YTD"
        },
        {
            value: "Fiscal Year Start",
            label: "Fiscal Year Start"
        },
        {
            value: "Week Start",
            label: "Week Start"
        },
        {
            value: "Number Format-Comma Seperator",
            label: "Number Format-Comma Seperator"
        },
        {
            value: "Application Title",
            label: "Application Title"
        }
    ]
}

  let breadcumb_menu = [
    { Label: "Home", Link: "/" },

    {
      Label: "Config Codes",
      Link: `/config_codes/${id}`,
    },

    // { Label: "Config Code" },
  ];

  const fnUpdateDetails = async () => {
    let res = await fetch(
      `${process.env.REACT_APP_SERVER_URL}/api/upd_config_codes/${adata.id}/`,
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
        // title: 'Updated',
        text: "Updated Successfully!",
      }).then(function () {
        close(false);
        setLoading(true)
      });
    } else {
      setError(data);
    }
  };

  const fnSubmitDetails = async () => {
    let res = await fetch(
      `${process.env.REACT_APP_SERVER_URL}/api/ins_config_codes`,
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
        // title: 'Created',
        text: "Created Successfully!",
      }).then(function () {
        close(false);
      });
    } else {
      setError(data);
    }
  };

  useEffect(() => {
    const fnGetDetails = async () => {
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
    }
    fnGetDetails();
    if (diverts === true) {
      const newdata = a.map(
        ({
          id,
          config_type,
          config_code,
          config_value,
          created_by,
          last_updated_by,
          is_active,
        }) => ({
          id,
          config_type,
          config_code,
          config_value,
          created_by,
          last_updated_by,
          is_active,
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

  const fnInputHandler = (name,value) => {
    setAdata((prevState) => ({
      ...prevState,
      [name]: value
    }))
    const errors = {...error}
    setError(errors)
  };

  const help = helper.filter(user=>String(user.page_no)
  .includes(String(id))).map((use)=>use);

  return (
    <div className="sc_cl_div w-100 px-2">

      <div className="d-flex flex-column flex-lg-row sc_cl_row sc_cl_page_header">
        <div className="align-items-center col-12 col-lg-6 d-flex py-2 text-center">
          <h5 className="sc_cl_head m-0">Config Codes</h5>
        </div>

        <div className="align-items-center col-12 col-lg-6 d-flex justify-content-lg-end py-2 text-center">
          <FnBreadCrumbComponent seperator_symbol={" >"} nav_items={breadcumb_menu} clickevent={() => close(false)} />
        </div>
      </div>

      {/* <hr></hr> */}

      <div className="mt-lg-2 sc-cl-main-content">

        <div>
          <FnFormComponent fields={configcodesFieldData} select={selectedData} formData={adata} stylename={"sc_cl_input"} tooltipvalue={help} onchange={fnInputHandler} errorcode={error} disablevalue={viewvalue}/>
        </div>

        <div className="sc_cl_div align-items-center d-flex mt-4 w-auto">
          {viewvalue === false &&
            (action ? (
              <FnBtnComponent onClick={fnUpdateDetails} classname={"sc_cl_submit_button"} children={"Update"} />
            ) : (
              <FnBtnComponent onClick={fnSubmitDetails} classname={"sc_cl_submit_button"} children={"Submit"} />
            ))}
          <FnBtnComponent onClick={() => close(false)} classname={"sc_cl_close_button ms-2"} children={"Back"} />
        </div>
      </div>
    </div>
  );
};

export default FnConfigCodesForm;
