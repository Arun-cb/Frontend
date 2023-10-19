/* ============================================================================================================================================================

   CITTABASE SOLUTIONS - All Rights Reserved.
   ------------------------------------------------------------------------------------------------------------------------------------------------------------

   09-Nov-2022   Arun R      Initial Version             V1

   ** This Page is to define download functionalities of the reusable chart component   **

============================================================================================================================================================*/

import React, { useCallback, useEffect, useState } from "react";
import FileSaver from "file-saver";
import { jsPDF } from "jspdf";
import { Dropdown } from "react-bootstrap";
import { CSVLink } from "react-csv";
import { HiMenu } from "react-icons/hi";

export let allchart = [];

const FnDownloadChartComponent = ({ getchartPng, kpi, chart_type, chart_name, id, onchange }) => {
  const [loading, ] = useState(false);
  const CustomToggle = React.forwardRef(({ children, onClick }, ref) => (
    <a
      href="/"
      ref={ref}
      onClick={(e) => {
        e.preventDefault();
        onClick(e);
      }}
    >
      {children}
      <span className="h4">
        <HiMenu />
      </span>
    </a>
  ));

  const fnHandleLineDownload = useCallback(async () => {
    if (chart_type !== "gauge") {
      const png = await getchartPng();
      if (png) {
        FileSaver.saveAs(png, `${chart_name}.png`);
      }
    } else {
      if (getchartPng) {
        FileSaver.saveAs(getchartPng, `${chart_name}.png`);
      }
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [getchartPng]);

  const fnPDFDownload = async () => {
    const pdf = new jsPDF();
    pdf.setFontSize(20);

    if (chart_type !== "gauge") {
      const png = await getchartPng();
      pdf.addImage(png, "png", 15, 15, 180, 100);
    } else {
      pdf.addImage(getchartPng, "png", 15, 15, 180, 90);
    }
    // pdf.output('pdfobjectnewwindow')
    pdf.save(`${chart_name}.pdf`);
  };

  const FnExportData = () => {
    const columns_in = ["period", "actuals"];
    const columns = columns_in;
    let csv_heading = [];
    columns &&
      columns.forEach((col, i) => {
        csv_heading.push({
          label:
            col.charAt(0).toUpperCase() + col.slice(1).replaceAll("_", " "),
          key: col,
        });
      });
    const csvReport = {
      data: kpi,
      headers: csv_heading,
      filename: `${chart_name}.csv`,
    };
    return (
      <CSVLink
        {...csvReport}
        className="data-rr-ui-dropdown-item dropdown-item"
      >
        Export Data
      </CSVLink>
    );
  };

  useEffect(() => {
    allchart[id - 1] = getchartPng;
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [loading]);
  
  return (
    <>
      <Dropdown className="text-end" onClick={onchange}>
        <Dropdown.Toggle as={CustomToggle}></Dropdown.Toggle>*
        <Dropdown.Menu size="sm" title="">
          <Dropdown.Item onClick={fnHandleLineDownload}>Export PNG</Dropdown.Item>
          <Dropdown.Item onClick={fnPDFDownload}>Export PDF</Dropdown.Item>
          <FnExportData />
        </Dropdown.Menu>
      </Dropdown>
    </>
  );
};

export default FnDownloadChartComponent;
