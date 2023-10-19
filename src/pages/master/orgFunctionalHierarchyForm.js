/* ============================================================================================================================================================

   CITTABASE SOLUTIONS - All Rights Reserved.
   ------------------------------------------------------------------------------------------------------------------------------------------------------------
  
   13-Sep-2022  Revan Rufus S     Initial Version             V1
   
   ** This Page is to define org functional hierarchy form  **
   
============================================================================================================================================================*/

import React, { useContext, useEffect, useState } from "react";
import { Button, Modal } from "react-bootstrap";
import AuthContext from "../../context/AuthContext";
import "bootstrap/dist/css/bootstrap.min.css";
import Swal from "sweetalert2";
import FnTooltipComponent from "../../components/tooltipComponent";
import FnBtnComponent from "../../components/buttonComponent";
import { useParams } from "react-router-dom";

const FnOrgFunctionalHierarchyForm = ({ data, close, viewvalue }) => {
  const [show, SetShow] = useState(true);
  const handleClose = () => SetShow(false);
  let { authTokens, user } = useContext(AuthContext);
  const [actualdata, SetActualData] = useState({
    created_by: user.user_id,
    last_updated_by: user.user_id,
  });
  const { id } = useParams();
  const [helper, setHelper] = useState([]);

  const [functionallevel, setFunctionallevel] = useState([]);

  const fnHierarcyUpdateDetails = async () => {
    let update_response = await fetch(
      `${process.env.REACT_APP_SERVER_URL}/api/upd_org_functional_hierarchy/${actualdata.functional_level_id}/`,
      {
        method: "PUT",
        body: JSON.stringify(actualdata),
        headers: {
          "Content-Type": "application/json",
          Authorization: "Bearer " + String(authTokens.access),
        },
      }
    );

    let update_data = await update_response.json();

    if (update_response.status === 200) {
      Swal.fire({
        icon: "success",
        // title: 'Updated',
        text: "Updated Successfully!",
      }).then(function () {
        close(false);
      });
    } else {
      alert("Error", update_data);
    }
  };

  useEffect(() => {
    if (data) {
      SetActualData(data);
    }
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

      const get_hierarchy_level = await fetch(
        `${process.env.REACT_APP_SERVER_URL}/api/get_org_functional_level`,
        {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
            Authorization: "Bearer " + String(authTokens.access),
          },
        }
      );

      let level_data = await get_hierarchy_level.json();

      if (get_hierarchy_level.status === 200) {
        setFunctionallevel(level_data)

      } else {
        alert("not happened");
      }
    }
    fnGetDetails();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [data]);

  if (actualdata.last_updated_by !== user.user_id) {
    SetActualData({ ...actualdata, last_updated_by: user.user_id });
  }

  const fnInputHandler = (e) => {
    e.preventDefault();
    SetActualData({ ...actualdata, [e.target.name]: e.target.value });
  };

  const help = helper.filter(user => String(user.page_no)
    .includes(String(id))).map((use) => use);

  const level_two_name = functionallevel.filter(temp =>
    String(temp.id).includes(String(actualdata.hierarchy_level))).map((data) => data.hierarchy_name);

  return (
    <Modal
      show={show}
      onHide={handleClose}
      backdrop="static"
      size="sm"
      centered
    >
      <Modal.Header closeButton>
        <Modal.Title>Edit {level_two_name}</Modal.Title>
      </Modal.Header>

      <Modal.Body>
        <div className="col-12">
          <label className="h6">Functionl Level Name
            <FnTooltipComponent
              label={help.filter(user => String(user.context_order).includes(String("1")) &&
                Number(user.context_order) <= 9).map((use) => use.label)}
              context={help.filter(user => String(user.context_order).includes(String("1")) &&
                Number(user.context_order) <= 9).map((use) => use.help_context)}
              classname={""}
              placement="bottom" />
          </label>
          <input
            type="text"
            name="functional_level_code"
            value={actualdata.functional_level_code || ""}
            onChange={fnInputHandler}
            placeholder="Funcationl Level Code"
            className="w-75"
            disabled={viewvalue}
          />
        </div>
      </Modal.Body>

      <Modal.Footer>
        {viewvalue === false && (
          <FnBtnComponent onClick={fnHierarcyUpdateDetails} classname={"sc_cl_submit_button"} children={"Update"} />
        )}

        <FnBtnComponent onClick={() => close(false)} classname={"sc_cl_close_button"} children={"Close"} />

      </Modal.Footer>
    </Modal>
  );
};
export default FnOrgFunctionalHierarchyForm;
