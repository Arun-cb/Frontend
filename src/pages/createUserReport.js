import React, { useState, useContext, useEffect } from "react";
import { useParams } from "react-router-dom";
import AuthContext from "../context/AuthContext";
import { Row, Breadcrumb } from "react-bootstrap";
import Tableact from "../components/tableComponent";
import PreContext from "../context/PreContext";
import "../Assets/CSS/preloader.css";
import CreateUser from "./CreateUser";
import FnBreadCrumbComponent from "../components/breadCrumbComponent";
import FnBtnComponent from "../components/buttonComponent";
import { Card } from "react-bootstrap";

const FnCreateUserReport = () => {
  let { authTokens } = useContext(AuthContext);
  let { userSettings } = useContext(PreContext);
  const [mode, setMode] = useState(false);
  const [update, setUpdate] = useState(false);
  const [divert, setDivert] = useState(false);
  const [updatedata, setUpdatedata] = useState();
  const [add, setAdd] = useState(true);
  const [csvdata, setCsvdata] = useState([]);
  const [view, setView] = useState(false);
  const { id } = useParams();
  const [adatalength, setAdatalength] = useState(0);
  const [startingIndex, setStartingindex] = useState(0);
  const [ , setloading] = useState(true);
  const PageSize =
    userSettings && userSettings.pagination
      ? userSettings.pagination
      : process.env.REACT_APP_PAGINATION;
  const endingIndex = startingIndex + Number(PageSize);
  const [input, setInput] = useState([]);

  const get_createuser_details = async () => {
    let res = await fetch(
      `${process.env.REACT_APP_SERVER_URL}/api/get_range_user_groups/${startingIndex}/${endingIndex}/`,
      {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          Authorization: "Bearer " + String(authTokens.access),
        },
      }
    );
    let user_data = await res.json();
    if (res.status === 200) {
      setInput(user_data.data);
      setCsvdata(user_data.data);
      setAdatalength(user_data.data_length);
      setUpdate(true);
      setloading(false);
    }
  };
  const columns_to = ["user_name", "user_mail", "user_group_name", "is_active"];
  const columns_type = ["str", "str", "str", "str"];
  const date_columns = [];

  const newadata = input.map(
    ({
      user_id,
      user_name,
      user_mail,
      user_group_name,
      user_group_id,
      is_active,
    }) => ({
      user_id,
      user_name,
      user_mail,
      user_group_name,
      user_group_id,
      is_active: is_active ? "Yes" : "No",
    })
  );

  const finalData = [...newadata];

  let breadcumb_menu = [
    { Label: "Home", Link: "/" },

    {
      Label: "User Details",
    },
  ];

  useEffect(() => {
    get_createuser_details();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [update, mode, startingIndex, PageSize]);

  const fn_add_details = () => {
    setUpdatedata();
    setMode(true);
  };

  return (
    <div className="sc_cl_div">
      {mode ? (
        <CreateUser
          data={updatedata}
          close={setMode}
          viewvalue={view}
          diverts={divert}
          setdiverts={setDivert}
        />
      ) : (
        <div className="sc_cl_div">

            {/* <div className="d-flex flex-column flex-lg-row sc_cl_row">
                <div className="align-items-center col-12 col-lg-6 d-flex py-2 text-center">
                    <h5 className="sc_cl_head m-0">User Details</h5>
                </div>

                <div className="align-items-center col-12 col-lg-6 d-flex justify-content-lg-end py-2 text-center">
                    <FnBreadCrumbComponent seperator_symbol={" >"} nav_items={breadcumb_menu} />
                </div>
            </div>

            <hr></hr> */}
            <Card className="overflow-hidden border-0 shadow-lg">
          <div className="sc_cl_row card-header">
            {add && (
              <FnBtnComponent children={"Add User"} onClick={fn_add_details} classname={"sc_cl_submit_button"}/>
              
            )}
          </div>

          <div className="sc_cl_div p-0 card-body">
            <Tableact
              data={finalData}
              csv_export={csvdata}
              data_length={adatalength}
              page_size={PageSize}
              columns_in={columns_to}
              columns_type={columns_type}
              date_columns={date_columns}
              start={setStartingindex}
              close={setMode}
              updates={setUpdatedata}
              load={setUpdate}
              api_name={"del_user_groups"}
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

export default FnCreateUserReport;
