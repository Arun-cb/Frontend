/* ============================================================================================================================================================

   CITTABASE SOLUTIONS - All Rights Reserved.

   ------------------------------------------------------------------------------------------------------------------------------------------------------------

   05-jul-2022   Dinesh j      Initial Version             V1

   ** This Page is to define Reusable Export Component  **

============================================================================================================================================================*/

import React from "react";
import { CSVLink } from "react-csv";
import * as XLSX from "xlsx";
import { Dropdown } from "react-bootstrap";

const FnExportComponent = ({ data, columns, csvdata }) => {
  let csv_heading = [];
  columns &&
    columns.forEach((col, i) => {
      csv_heading.push({
        label: col.charAt(0).toUpperCase() + col.slice(1).replaceAll("_", " "),
        key: col,
      });
    });
  const csvReport = {
    data: csvdata,
    headers: csv_heading,
    filename: "table.csv",
  };

  const downloadExcel = (data) => {
    const excel_heading = csv_heading.map((key) => key.key);
    const excel_data = data.map((obj) => {
      const newObj = {};
      excel_heading.forEach((key) => {
        newObj[key] = obj[key];
      });
      return newObj;
    });
    const worksheet = XLSX.utils.json_to_sheet(excel_data);
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, "Sheet1");
    XLSX.writeFile(workbook, "DataSheet.xlsx");
  };

  return (
    <>
      {data.length > 0 && (
        <>
          <Dropdown>
            <Dropdown.Toggle
              className="dropdown-toggle sc_cl_close_button me-2 bg-opacity-50 bg-secondary border-0"
              size="sm"
            >
              Export
              </Dropdown.Toggle>
          
              <Dropdown.Menu style={{ zIndex: 999 }}>
                <CSVLink {...csvReport} className="text-secondary small dropdown-item">
                    Export to CSV
                  </CSVLink>
                <Dropdown.Item onClick={() => downloadExcel(csvdata)} className="small">
                  Export to Excel
                </Dropdown.Item>
              </Dropdown.Menu>
          </Dropdown>
        </>
      )}
    </>
  );
};

export default FnExportComponent;
