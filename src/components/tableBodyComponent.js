/* ============================================================================================================================================================

   CITTABASE SOLUTIONS - All Rights Reserved.

   ------------------------------------------------------------------------------------------------------------------------------------------------------------

   30-Aug-2022   Jagadeshwaran R      Initial Version             V1

   ** This Page is to define table body component  **

============================================================================================================================================================*/

import React, { useState, useContext, useEffect } from "react";
import { fnDeleteDetails } from "../pages/master/currenciesReport";
import AuthContext from "../context/AuthContext";
import { FiEdit } from "react-icons/fi";
import { FaEdit } from "react-icons/fa";
import { RiDeleteBin6Line } from "react-icons/ri";

const FnTableBody = ({
  tableData,
  columns,
  columns_type,
  close,
  updates,
  load,
  view,
  edit,
  remove,
  api_name,
  diverts,
  action,
}) => {
  const [update, setUpdate] = useState(false);
  let { authTokens } = useContext(AuthContext);

  if (tableData[0] === "") {
    tableData.splice(0, 1);
  }

  const fnGetDetails = async () => {
    if (tableData.length > 0) {
      setUpdate(true);
    } else {
      setUpdate(false);
    }
  };

  useEffect(() => {
    fnGetDetails();
  });

  const fnUpdateDetails = async (data, disable) => {
    updates(data);
    close(true);
    diverts(true);
    view(disable);
  };
  
  return (
    <tbody className="sc_cl_tbody text-center">
      {update ? (
        tableData.map((data) => (
          <tr key={data.id}>
            {columns &&
              columns.map((v, index) => {
                return (
                  <td
                    key={v}
                    className={`sc_cl_td 
                    ${columns_type[index] === "int" ? "text-end" : ""}
                    ${columns_type[index] === "str" ? "text-start" : ""}
                    ${columns_type[index] === "date" ? "text-start" : ""}`}
                  >
                    {columns_type[index] !== "bol" ? data[v] :
                    columns_type[index] === "bol" && data[v]==true ?
                    <button className="sc_cl_switch_button float-start bg-opacity-50 bg-success border-0 fw-semibold text-opacity-100 text-success" disabled>{"Active"}</button> 
                    : <button className="sc_cl_switch_button float-start bg-opacity-10 bg-secondary border-0 fw-semibold text-opacity-75 text-secondary" disabled>{"Inactive"}</button>}
                  </td>
                );
              })}

            {action ? (
              <td>
                {edit === false ? (
                  <FaEdit onClick={() => fnUpdateDetails(data, true)} />
                ) : (
                  <></>
                )}

                {edit ? (
                  <FiEdit
                    className="sc_cl_table_icons text-success"
                    onClick={() => fnUpdateDetails(data, false)}
                  />
                ) : (
                  <></>
                )}

                {remove ? (
                  <RiDeleteBin6Line
                    className="sc_cl_table_icons ms-3 text-danger"
                    onClick={() =>
                      fnDeleteDetails(data.id, authTokens, load, api_name)
                    }
                  />
                ) : (
                  <></>
                )}
              </td>
            ) : (
              <></>
            )}
          </tr>
        ))
      ) : (
        <tr className="sc_cl_tr text-center ">
          <td colSpan="10" className="sc_cl_tr text-danger">
            No Data Found
          </td>
        </tr>
      )}
    </tbody>
  );
};
export default FnTableBody;
