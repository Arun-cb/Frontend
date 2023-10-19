/* ============================================================================================================================================================

   CITTABASE SOLUTIONS - All Rights Reserved.
   ------------------------------------------------------------------------------------------------------------------------------------------------------------

   02-Sep-2022   Dinesh J      Initial Version             V1

   ** This Page is to define unit of measures report  **

============================================================================================================================================================*/

import React, { useState, useContext, useEffect } from "react";
import AuthContext from "../../context/AuthContext";
import { useParams, Link } from "react-router-dom";
import FnUomForm from "./uomForm";
import FnTableComponent from "../../components/tableComponent";
import "../../Assets/CSS/preloader.css";
import PreContext from "../../context/PreContext";
import FnBtnComponent from "../../components/buttonComponent";
import FnBreadCrumbComponent from "../../components/breadCrumbComponent";
import { Card } from "react-bootstrap";
import FnExportComponent from "../../components/ExportComponent";


const FnUomReport = () => {
  let { authTokens } = useContext(AuthContext);
  let { userSettings } = useContext(PreContext);
  const [adata, setAdata] = useState([]);
  const [csvdata, setCsvdata] = useState([]);
  const [adatalength, setAdatalength] = useState(0);
  const [mode, setMode] = useState(false);
  const [update, setUpdate] = useState(false);
  const [updatedata, setUpdatedata] = useState();
  const [divert, setDivert] = useState(false);
  const [add, setAdd] = useState(false);
  const [view, setView] = useState(false);
  const { id } = useParams();
  const [startingIndex, setStartingindex] = useState(0);
  const PageSize =
    userSettings && userSettings.pagination
      ? userSettings.pagination
      : process.env.REACT_APP_PAGINATION;
  const endingIndex = startingIndex + Number(PageSize);

  let breadcumb_menu = [
    { Label: "Home", Link: "/" },

    {
      Label: "UOM Report",
    },
  ];

  // Get data of UOM details for a report
  const fnGetDetails = async () => {
    let res = await fetch(
      `${process.env.REACT_APP_SERVER_URL}/api/get_range_uom/${startingIndex}/${endingIndex}/`,
      {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          Authorization: "Bearer " + String(authTokens.access),
        },
      }
    );
    let data = await res.json();
    if (res.status === 200) {
      if (data.data_length > 0) {
        setAdata(data.data);
        setCsvdata(data.csv_data);
        setAdatalength(data.data_length);
        setUpdate(true);
      } else {
        setAdata([]);
        setAdatalength(0);
        setUpdate(false);
      }
    }
  };

  //  Used for rendering based on dependencies
  useEffect(() => {
    if (mode === false) {
      fnGetDetails();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [update, mode, startingIndex, PageSize]);

  const fnAddDetails = () => {
    setUpdatedata();
    setMode(true);
  };

  const columns_to = ["uom_code", "description"];
  const columns_type = ["str", "str"];

  const date_columns = ["created_date", "last_updated_date"];
  const newadata = adata.map(
    ({
      id,
      uom_code,
      description,
      created_date,
      last_updated_date,
      created_by,
      last_updated_by,
    }) => ({
      id,
      uom_code,
      description,
      created_date,
      last_updated_date,
      created_by,
      last_updated_by,
    })
  );

  return (
    <div className="sc_cl_div">
      {mode ? (
        <FnUomForm
          data={updatedata}
          close={setMode}
          viewvalue={view}
          diverts={divert}
          setdiverts={setDivert}
        />
      ) : (
        <div className="sc_cl_div w-100 px-2">

        <div className="d-flex flex-column flex-lg-row sc_cl_row">
          <div className="align-items-center col-12 col-lg-6 d-flex py-2 text-center">
            <h5 className="sc_cl_head m-0">UOM </h5>
          </div>

          <div className="align-items-center col-12 col-lg-6 d-flex justify-content-lg-end py-2 text-center">
            <FnBreadCrumbComponent seperator_symbol={" >"} nav_items={breadcumb_menu} />
          </div>
        </div>

        <hr></hr>
        <Card className="overflow-hidden border-0 shadow-lg">
          <div className="sc_cl_div card-header">
            

            <div className="sc_cl_div d-flex justify-content-end ">
              
              <FnExportComponent data={newadata} columns={columns_to} csvdata={csvdata}/>
              
              {add ? (
                  <FnBtnComponent children={"Add UOM"} onClick={fnAddDetails} classname={"sc_cl_submit_button px-3 p-2"}/>
                ) : (
                  ""
                )}
              
            </div>
          </div>

          <div className="sc_cl_div p-0 card-body">
            <FnTableComponent
              data={newadata}
              csv_export={csvdata}
              data_length={adatalength}
              page_size={PageSize}
              columns_in={columns_to}
              start={setStartingindex}
              columns_type={columns_type}
              close={setMode}
              updates={setUpdatedata}
              load={setUpdate}
              date_columns={date_columns}
              api_name={"del_uom"}
              diverts={setDivert}
              add={setAdd}
              view={setView}
              menu_id={id}
              action={true}
            />
          </div>
        </Card>
          
        </div>
      )}
    </div>
  );
};

export default FnUomReport;
