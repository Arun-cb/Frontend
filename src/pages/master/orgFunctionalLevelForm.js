/* ============================================================================================================================================================

   CITTABASE SOLUTIONS - All Rights Reserved.
   ------------------------------------------------------------------------------------------------------------------------------------------------------------

   10-Aug-2022   Priya S      Initial Version             V1

   ** This Page is to define org functional level form  **

============================================================================================================================================================*/

import React, { useState, useContext, useEffect } from "react";
import AuthContext from "../../context/AuthContext";
import { Row, Form } from "react-bootstrap";
import { useParams } from "react-router-dom";
import Swal from "sweetalert2";
import FnBtnComponent from "../../components/buttonComponent";
import FnBreadCrumbComponent from "../../components/breadCrumbComponent";
import FnTooltipComponent from "../../components/tooltipComponent";
import PreContext from "../../context/PreContext";

const FnOrgFunctionalLevelForm = ({
  data,
  close,
  len_data,
  viewvalue,
  diverts,
  setdiverts,
}) => {
  let { authTokens, user } = useContext(AuthContext);
  let { setisloading } = useContext(PreContext);
  const [adata, setAdata] = useState({
    created_by: user.user_id,
    last_updated_by: user.user_id,
  });

  const [error, setError] = useState({});
  const [action, setAction] = useState(false);
  let a = [data];
  const [helper, setHelper] = useState([]);

  const { id } = useParams();

  let breadcumb_menu = [
    { Label: "Home", Link: "/" },

    {
      Label: "Organization Functional Level",
      Link: `/organization_functional_level/${id}`,
    },

    // { Label: "Functional Level Form" },
  ];

  // Function for updating functional level details
  const fnUpdateDetails = async () => {
    setisloading(true);
    let res = await fetch(
      `${process.env.REACT_APP_SERVER_URL}/api/upd_org_functional_level/${adata.id}/`,
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
      });
    } else {
      setError(data);
    }
    setisloading(false);
  };

  // Function for inserting functional level details
  const fnSubmitDetails = async () => {
    setisloading(true);
    let res = await fetch(
      `${process.env.REACT_APP_SERVER_URL}/api/ins_org_functional_level`,
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
        // title: 'Created',
        text: "Created Successfully!",
      }).then(function () {
        close(false);
      });
    } else {
      setError(data);
    }
    setisloading(false);
  };

  //  Used for rendering every time action done
  useEffect(() => {
    if (data) {
      const newdata = a.map(
        ({
          id,
          hierarchy_level,
          hierarchy_name,
          created_by,
          last_updated_by,
        }) => ({
          id,
          hierarchy_level,
          hierarchy_name,
          created_by,
          last_updated_by,
        })
      );
      setAdata(...newdata);
      setAction(true);
      setdiverts(false);
    } else {
      setAdata({ ...adata, hierarchy_level: len_data + 1 });
    }
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
    };
    fnGetDetails();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [action]);

  if (adata.last_updated_by !== user.user_id) {
    setAdata({ ...adata, last_updated_by: user.user_id });
  }

  // onchange function
  const fnInputHandler = (e) => {
    setAdata({ ...adata, [e.target.name]: e.target.value });
    setError({ ...error, [e.target.name]: "" });
  };
  
  return (
    <div className="sc_cl_div w-100 px-2">
      <div className="d-flex flex-column flex-lg-row sc_cl_row sc_cl_page_header">
        <div className="align-items-center col-12 col-lg-6 d-flex py-2 text-center">
          <h5 className="sc_cl_head m-0">
            Organization Functional Level 
          </h5>
        </div>

        <div className="align-items-center col-12 col-lg-6 d-flex justify-content-lg-end py-2 text-center">
          <FnBreadCrumbComponent
            seperator_symbol={" >"}
            nav_items={breadcumb_menu}
            clickevent={() => close(false)}
          />
        </div>
      </div>

      {/* <hr></hr> */}

      <Row className="mt-2 mt-lg-0 sc-cl-main-content mt-lg-2">
        <Form>
          <Form.Group className="sc_cl_form_alignment">
            <div className="sc_cl_field_alignment">
              <div className="pe-2">
                <Form.Label className="sc_cl_label">
                  Hierarchy Level<sup className="text-danger">*</sup>
                  <FnTooltipComponent
                    label={helper
                      .filter((user) => user.context_order === 1)
                      .map((use) => use.label)}
                    context={helper
                      .filter((user) => user.context_order === 1)
                      .map((use) => use.help_context)}
                    classname={""}
                    placement="bottom"
                  />
                </Form.Label>

                <Form.Control
                  type={"text"}
                  placeholder={"Enter Hierarchy Level"}
                  value={adata.hierarchy_level || len_data + 1}
                  name={"hierarchy_level"}
                  onChange={fnInputHandler}
                  disabled={true}
                  className={"sc_cl_input"}
                  size="sm"
                  maxLength={100}
                  max={100}
                  min={50}
                  autoComplete="off"
                />
              </div>
              <span className="sc_cl_span red">
                {error && error[0] && error[0]['hierarchy_level'] ? error[0]['hierarchy_level'] : ''}
              </span>
            </div>

            <div className="sc_cl_field_alignment">
              <div className="pe-2">
                <Form.Label className="sc_cl_label">
                  Hierarchy Name<sup className="text-danger">*</sup>
                  <FnTooltipComponent
                    label={helper
                      .filter((user) => user.context_order === 2)
                      .map((use) => use.label)}
                    context={helper
                      .filter((user) => user.context_order === 2)
                      .map((use) => use.help_context)}
                    classname={""}
                    placement="bottom"
                  />
                </Form.Label>

                <Form.Control
                  type={"text"}
                  placeholder={"Enter Hierarchy Name"}
                  value={adata.hierarchy_name || ""}
                  name={"hierarchy_name"}
                  onChange={fnInputHandler}
                  disabled={viewvalue}
                  className={"sc_cl_input"}
                  size="sm"
                  maxLength={100}
                  max={100}
                  min={50}
                  autoComplete="off"
                />
              </div>
              <span className="sc_cl_span red">
                {error && error[0] && error[0]['hierarchy_name'] ? error[0]['hierarchy_name'] : ''}
              </span>
            </div>
          </Form.Group>
        </Form>

        <div className="sc_cl_div align-items-center d-flex justify-content-evenly mt-4 w-auto">
          {viewvalue === false &&
            (action ? (
              <FnBtnComponent
                onClick={fnUpdateDetails}
                classname={"sc_cl_submit_button"}
                children={"Update"}
              />
            ) : (
              <FnBtnComponent
                onClick={fnSubmitDetails}
                children={"Submit"}
                classname={"sc_cl_submit_button"}
              />
            ))}
          <FnBtnComponent
            onClick={() => close(false)}
            children={"Back"}
            classname={"sc_cl_close_button ms-2"}
          />
        </div>
      </Row>
    </div>
  );
};

export default FnOrgFunctionalLevelForm;
