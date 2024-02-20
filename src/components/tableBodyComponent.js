/* ============================================================================================================================================================

   CITTABASE SOLUTIONS - All Rights Reserved.

   ------------------------------------------------------------------------------------------------------------------------------------------------------------

   30-Aug-2022   Jagadeshwaran R      Initial Version             V1

   ** This Page is to define table body component  **

============================================================================================================================================================*/

import React, { useState, useContext, useEffect } from "react";
import AuthContext from "../context/AuthContext";
import { FiEdit } from "react-icons/fi";
import { FaEdit } from "react-icons/fa";
import { RiDeleteBin6Line } from "react-icons/ri";
import moment from 'moment';
// import {
//   div
// } from "react-micron";
import Parser from 'html-react-parser';

const FnTableBody = ({
  tableData,
  columns,
  columns_type,
  bol_labels,
  close,
  updates,
  load,
  view,
  edit,
  remove,
  api_name,
  diverts,
  action,
  searchWord
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
                const tempsearchWord = searchWord && searchWord.toLowerCase()
                function highlight(text) {
                  if (text.toLowerCase().includes(tempsearchWord) === true) {
                    const regex = new RegExp(tempsearchWord, 'gi');
                    const wrappedText = text.replace(regex, `${'<span className=sc_cl_highlight>'}$&${'</span>'}`);
                    return Parser(wrappedText);
                  } else {
                    return text
                  }
                }
                let tempData = typeof (data[v]) === 'string' && tempsearchWord !== '' ? highlight(data[v]) : data[v]

                let tempDateData;
                if (columns_type[index] === "date") {
                  tempDateData = moment(tempData).format("DD-MM-YYYY");
                }

                return (
                  <td
                    key={v}
                    className={`sc_cl_td 
                    ${columns_type[index] === "int" ? "text-end" : ""}
                    ${columns_type[index] === "str" ? "text-start" : ""}
                    ${columns_type[index] === "date" ? "text-start" : ""}`}
                  >
                    {columns_type[index] !== "bol" ? (columns_type[index] === "date" ? tempDateData : tempData) :
                      columns_type[index] === "bol" && data[v] == true ?
                        <button className="sc_cl_switch_button float-start bg-opacity-50 bg-success border-0 fw-semibold text-opacity-100 text-success" disabled>{bol_labels[0]}</button>
                        :
                        <button className="sc_cl_switch_button float-start bg-opacity-10 bg-secondary border-0 fw-semibold text-opacity-75 text-secondary" disabled>{bol_labels[1]}</button>}
                    {columns_type[index] !== "bol1" ? '' :
                      columns_type[index] === "bol1" && data[v] == true ?
                        <button className="sc_cl_switch_button float-start bg-opacity-50 bg-success border-0 fw-semibold text-opacity-100 text-success" disabled>{bol_labels[2]}</button>
                        :
                        <button className="sc_cl_switch_button float-start bg-opacity-10 bg-secondary border-0 fw-semibold text-opacity-75 text-secondary" disabled>{bol_labels[3]}</button>}
                  </td>
                );
              })}

            {action ? (
              <td >
                {/* className="d-flex justify-content-center" */}
                {edit === false ? (
                  <FaEdit onClick={() => fnUpdateDetails(data, true)} />
                ) : (
                  <>
                  </>
                )}

                {edit ? (
                  // <div
                  //   events="onMouseEnter"
                  //   timing="ease-in-out"
                  //   duration={0.5}
                  //   inline={true}
                  // >
                  <FiEdit
                    className="sc_cl_table_icons text-success"
                    onClick={() => fnUpdateDetails(data, false)}
                  />
                  // </div>
                ) : (
                  <></>
                )}

                {remove ? (
                  // <div
                  //   events="onMouseEnter"
                  //   timing="ease-in-out"
                  //   duration={0.5}
                  //   inline={true}
                  // >
                  <RiDeleteBin6Line
                    className="sc_cl_table_icons ms-3 text-danger"
                    />
                  // </div>
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
          <td colSpan="10" className="sc_cl_tr text-danger border-bottom-0">
            No Data Found
          </td>
        </tr>
      )}
    </tbody>
  );
};
export default FnTableBody;
