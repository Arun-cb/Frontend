/* ============================================================================================================================================================

   CITTABASE SOLUTIONS - All Rights Reserved.
   ------------------------------------------------------------------------------------------------------------------------------------------------------------

   09-Aug-2022   Jagadeshwaran R      Initial Version             V1

   ** This Page is to define currencies form  **

============================================================================================================================================================*/


import React, { useState, useContext, useEffect } from "react";
import Swal from "sweetalert2";
import {
  Row,
  Breadcrumb,
  Form,
  FormGroup,
  FormLabel,
  FormControl
} from "react-bootstrap";
import { useParams } from "react-router-dom";
import AuthContext from "../../context/AuthContext";
import FnBtnComponent from "../../components/buttonComponent";
import FnTooltipComponent from "../../components/tooltipComponent";
import FnBreadCrumbComponent from "../../components/breadCrumbComponent";
import FnFormComponent from "../../components/formComponent";

const FnCurrenciesForm = ({
  data,
  close,
  viewvalue,
  diverts,
  setdiverts,
}) => {
  let { authTokens, user } = useContext(AuthContext);
  const [adata, setAdata] = useState({
    created_by: user.user_id,
    last_updated_by: user.user_id,
  });
  const [error, setError] = useState([{
    "currency_code": [
        ''
    ]
},
{
    "currency_name": [
    '']
},
{
    "sign": [
    '']
}]);
  const [action, setAction] = useState(false);
  let a = [data];
  const [helper, setHelper] = useState([]);

  const { id } = useParams();

  let breadcumb_menu = [
    { Label: "Home", Link: "/" },

    {
      Label: "Currencies",
      Link: `/currencies/${id}`,
    },

    // { Label: "Currency" },
  ];
  const currenciesFieldData = [
    { id: 1, name: 'currency_code', label: 'Currency Code', placeholder: 'Enter Currency Code', type: 'text', maxlen: '3',ismandatory:'Y'  },
    { id: 2, name: 'currency_name', label: 'Currency Name', placeholder: 'Enter Currency Name', type: 'text', maxlen: '100',ismandatory:'Y'  },
    { id: 3, name: 'sign', label: 'Sign', placeholder: 'Enter Sign', type: 'text', maxlen: '5',ismandatory:'Y'  }
  ]

  const fnUpdateDetails = async () => {
    let res = await fetch(
      `${process.env.REACT_APP_SERVER_URL}/api/upd_currencies/${adata.id}/`,
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
      setAction(false);
      Swal.fire({
        icon: "success",
        title: "Success",
        text: "Currencies updated successfully!",
      }).then(function () {
        close(false);
      });
    } else {
      setError(data);
    }
  };

  const fnSubmitDetails = async () => {
    let res = await fetch(
      `${process.env.REACT_APP_SERVER_URL}/api/ins_currencies`,
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
      Swal.fire({
        icon: "success",
        title: "Success",
        text: "New Currencies added successfully!",
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
          currency_code,
          currency_name,
          sign,
          created_by,
          last_updated_by,
        }) => ({
          id,
          currency_code,
          currency_name,
          sign,
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

  const fnInputHandler = (name, value) => {
    setAdata((prevState) => ({
      ...prevState,
      [name]: value.toUpperCase()
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
          <h5 className="sc_cl_head m-0">Currencies</h5>
        </div>

        <div className="align-items-center col-12 col-lg-6 d-flex justify-content-lg-end py-2 text-center">
          <FnBreadCrumbComponent seperator_symbol={" >"} nav_items={breadcumb_menu} clickevent={() => close(false)}/>
        </div>
      </div>

      {/* <hr></hr> */}

      <Row className="mt-lg-2 sc-cl-main-content">

        <FnFormComponent fields={currenciesFieldData} formData={adata} onchange={fnInputHandler} disablevalue={viewvalue} errorcode={error} tooltipvalue={help} stylename={"mb-2 sc_cl_input"} />

        <div className=" align-items-center d-flex mt-2">
          {viewvalue === false &&
            (action ? (
              <FnBtnComponent onClick={fnUpdateDetails} children={"Update"} classname={"sc_cl_submit_button"} />
            ) : (
              <FnBtnComponent onClick={fnSubmitDetails} children={"Submit"} classname={"sc_cl_submit_button"} />
            ))}
          <FnBtnComponent
            onClick={() => close(false)}
            children={"Back"}
            classname={"sc_cl_close_button ms-2"} />
        </div>
      </Row>
    </div>
  );
};

export default FnCurrenciesForm;
