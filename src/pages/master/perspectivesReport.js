/* ============================================================================================================================================================

   CITTABASE SOLUTIONS - All Rights Reserved.
   ------------------------------------------------------------------------------------------------------------------------------------------------------------

   12-Sep-2022   Priya S      Initial Version             V1

   ** This Page is to define perspectives report  **

============================================================================================================================================================*/

import React, { useState, useContext, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import AuthContext from "../../context/AuthContext";
import FnPerspectivesForm from "./perspectivesForm";
import FnTableComponent from "../../components/tableComponent";
import "../../Assets/CSS/preloader.css";
import PreContext from "../../context/PreContext";
import FnBtnComponent from "../../components/buttonComponent";
import FnBreadCrumbComponent from "../../components/breadCrumbComponent";
import { Card, Modal } from "react-bootstrap";
import FnExportComponent from "../../components/ExportComponent";
import useCheckMobileScreen from "../../components/useCheckMobileScreen";
import Fnmobilereport from "../../components/mobileReport";
import { BiMessageRoundedError } from "react-icons/bi";

const FnPerspectivesReport = () => {
  let { authTokens, user } = useContext(AuthContext);
  let { userSettings } = useContext(PreContext);
  const [adata, setAdata] = useState([]);
  const [csvdata, setCsvdata] = useState([]);
  const [mode, setMode] = useState(false);
  const [update, setUpdate] = useState(false);
  const [divert, setDivert] = useState(false);
  const [updatedata, setUpdatedata] = useState();
  const [add, setAdd] = useState(false);
  const [view, setView] = useState(false);
  const [configData, setConfigData] = useState();

  const { id } = useParams();
  const navigator = useNavigate();
  const [adatalength, setAdatalength] = useState(0);
  const [startingIndex, setStartingindex] = useState(0);
  const [viewpage, setViewPage] = useState();
  const PageSize =
    userSettings && userSettings.pagination
      ? userSettings.pagination
      : process.env.REACT_APP_PAGINATION;
  const endingIndex = startingIndex + Number(PageSize);

  let isMobile = useCheckMobileScreen();

  // Get data of perspective details for a report
  const fnGetPerspectivesDetails = async () => {
    let res = await fetch(
      `${process.env.REACT_APP_SERVER_URL}/api/get_range_perspectives/${startingIndex}/${endingIndex}/`,
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

  const columns_to = ["perspective_code", "perspective", "description"];
  const columns_type = ["str", "str", "str"];

  const date_columns = [];

  let breadcumb_menu = [
    { Label: "Home", Link: "/" },

    {
      Label: configData ? configData.menu_name : "Perspectives",
    },
  ];

  const newadata = adata.map(
    ({
      id,
      perspective_code,
      perspective,
      description,
      created_by,
      last_updated_by,
    }) => ({
      id,
      perspective_code,
      perspective,
      description,
      created_by,
      last_updated_by,
    })
  );
  
  const fnGetPermissions = async () => {
    let res = await fetch(
      `${process.env.REACT_APP_SERVER_URL}/api/join_user_group_access/${user.user_id}/${id}/`,
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
      if (data.length > 0) {
        let pdata = { ...data };
        setViewPage(pdata[0].view === "Y" ? true : false);
      }
    }
  };


  const getConfigData = async () =>{
    const resposnse = await fetch(
      `${process.env.REACT_APP_SERVER_URL}/api/get_single_navigation_menu_details/7/`,
      {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          Authorization: "Bearer " + String(authTokens.access),
        },
      });

      
      let data = await resposnse.json();
      if (resposnse.status === 200){
        setConfigData(data[0])
      }
  }

  //  Used for rendering based on dependencies
  useEffect(() => {
    fnGetPermissions();
    fnGetPerspectivesDetails();
    getConfigData()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [update, mode, startingIndex, PageSize]);

  const fnAddDetails = () => {
    setUpdatedata();
    setMode(true);
  };
  
  return (
    <>
    {viewpage === undefined ?
    '' 
  :<>
      {viewpage === false ? (
        // <FnAccessRestricted />
        <Modal
          show={true}
          centered
          style={{ padding: "20px", textAlign: "center" }}
        >
          <Modal.Header className="justify-content-center text-danger">
            <BiMessageRoundedError size={70} />
          </Modal.Header>
          <Modal.Body>
            <h2>{"User Restricted"}</h2>
            <h5> {"You don't have access!"}</h5>
          </Modal.Body>
          <Modal.Footer className="justify-content-center">
            <FnBtnComponent
              onClick={() => navigator("/")}
              children={"Close"}
              classname={"sc_cl_close_button"}
            ></FnBtnComponent>
          </Modal.Footer>
        </Modal>
      ) :  (
    <div>
      {mode ? (
        <FnPerspectivesForm
          data={updatedata}
          close={setMode}
          viewvalue={view}
          diverts={divert}
          setdiverts={setDivert}
          configData={configData}
        />
      ) : (
        <div className="sc_cl_div w-100 px-2">
          <div className="d-flex flex-column flex-lg-row sc_cl_row sc_cl_page_header">
            <div className="align-items-center col-12 col-lg-6 d-flex py-2 text-center">
              <h5 className="sc_cl_head m-0">{configData ? configData.menu_name : "Perspective"}</h5>
            </div>

            <div className="align-items-center col-12 col-lg-6 d-flex justify-content-lg-end py-2 text-center">
              <FnBreadCrumbComponent
                seperator_symbol={" >"}
                nav_items={breadcumb_menu}
              />
            </div>
          </div>
          {/* <hr></hr> */}

          <Card className="overflow-hidden border-0 mt-lg-2">
            <div className="sc_cl_div card-header">
              <div className="sc_cl_div d-flex justify-content-end ">
                <FnExportComponent
                  data={newadata}
                  columns={columns_to}
                  csvdata={csvdata}
                />

                {add && (
                  <FnBtnComponent
                    children={"Add Perspective"}
                    classname={"sc_cl_submit_button px-3 p-2"}
                    onClick={fnAddDetails}
                  />
                )}
              </div>
            </div>

            <div className="sc_cl_div">
              {isMobile ? (
                <Fnmobilereport
                  data={newadata}
                  csv_export={csvdata}
                  data_length={adatalength}
                  page_size={PageSize}
                  columns_in={columns_to}
                />
              ) : (
                <FnTableComponent
                  data={newadata}
                  csv_export={csvdata}
                  data_length={adatalength}
                  page_size={PageSize}
                  columns_in={columns_to}
                  date_columns={date_columns}
                  columns_type={columns_type}
                  start={setStartingindex}
                  close={setMode}
                  updates={setUpdatedata}
                  load={setUpdate}
                  api_name={"del_perspectives"}
                  diverts={setDivert}
                  add={setAdd}
                  view={setView}
                  menu_id={id}
                  action={true}
                />
              )}
            </div>
          </Card>
        </div>
      )}
    </div>
     )}
     </>
 }
   </>
  );
};

export default FnPerspectivesReport;
