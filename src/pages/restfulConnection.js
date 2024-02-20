import React, { useContext, useEffect, useState } from "react";
import AuthContext from "../context/AuthContext";
import PreContext from "../context/PreContext";
import FnBtnComponent from "../components/buttonComponent";
import { useParams, useNavigate } from "react-router-dom";
import FnExportComponent from "../components/ExportComponent";
import FnTableComponent from "../components/tableComponent";
import FnRestfulConnectionForm from "./restfulConnectionForm";
import { Card } from "react-bootstrap";

const FnRestfulConnection = () => {
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

  const columns_to = ["connection_name", "connection_type", "method"];
  const columns_type = ["str", "str", "str"];

  const date_columns = [];

  const newadata = adata.map(
    ({
      id,
      connection_name,
      connection_type,
      auth_type,
      connection_url,
      auth_url,
      body,
      user_id,
      password,
      data_enpoint_url,
      method,
      client_id,
      secret_code,
      created_by,
      last_updated_by,
    }) => ({
      id,
      connection_name,
      connection_type,
      auth_type,
      connection_url,
      auth_url,
      body,
      user_id,
      password,
      data_enpoint_url,
      method,
      client_id,
      secret_code,
      created_by,
      last_updated_by,
    })
  );

  const fnAddDetails = () => {
    setUpdatedata();
    setMode(true);
  };
  

  const fnGetDetails = async () => {
    // API call to Get Individual user details
    let res = await fetch(
      `${process.env.REACT_APP_SERVER_URL}/api/get_range_rb_connect_definition_table/${startingIndex}/${endingIndex}/`,
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

  useEffect(() => {
    fnGetDetails();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [update, mode, startingIndex, PageSize]); //imageUrl

  return (
    <div>
      {mode ? (
        <FnRestfulConnectionForm
          data={updatedata}
          close={setMode}
          viewvalue={view}
          diverts={divert}
          setdiverts={setDivert}
          configData={configData}
        />
      ) : (
        <div className="sc_cl_div w-100 px-2">
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
                    children={"New Connection"}
                    classname={"sc_cl_submit_button px-3 p-2"}
                    onClick={fnAddDetails}
                  />
                )}
              </div>
            </div>

            <div className="sc_cl_div">
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
                  api_name={"del_rb_db_connect_table"}
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

export default FnRestfulConnection;
