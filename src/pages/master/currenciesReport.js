/* ============================================================================================================================================================

   CITTABASE SOLUTIONS - All Rights Reserved.
   ------------------------------------------------------------------------------------------------------------------------------------------------------------

   09-Aug-2022   Jagadeshwaran R      Initial Version             V1

   ** This Page is to define currencies form  **

============================================================================================================================================================*/

import React, { useState, useContext, useEffect } from "react";
import Swal from "sweetalert2";
import { Row, Breadcrumb, Card, Modal } from "react-bootstrap";
import { useNavigate, useParams } from "react-router-dom";
import AuthContext from "../../context/AuthContext";
import PreContext from "../../context/PreContext";
import FnCurrenciesForm from "./currenciesForm";
import FnExportComponent from "../../components/ExportComponent";
import FnTableComponent from "../../components/tableComponent";
import FnModalComponent from "../../components/modalComponent";
import FnBtnComponent from "../../components/buttonComponent";
import FnBreadCrumbComponent from "../../components/breadCrumbComponent";
import { BiMessageRoundedError } from "react-icons/bi";

const FnCurrenciesReport = () => {
  let { authTokens, user } = useContext(AuthContext);
  let { userSettings } = useContext(PreContext);
  const [adata, setAdata] = useState([]);
  const [adatalength, setAdatalength] = useState(0);
  const [mode, setMode] = useState(false);
  const [update, setUpdate] = useState(false);
  const [updatedata, setUpdatedata] = useState();
  const [divert, setDivert] = useState(false);
  const [startingIndex, setStartingindex] = useState(0);
  const PageSize =
    userSettings && userSettings.pagination
      ? userSettings.pagination
      : process.env.REACT_APP_PAGINATION;
  const endingIndex = startingIndex + Number(PageSize);

  const [array_c_code] = useState([]);

  const [add, setAdd] = useState(false);
  const [view, setView] = useState(false);
  const [viewpage, setViewPage] = useState();
  const navigator = useNavigate();

  const { id } = useParams();

  const columns_to = ["currency_code", "currency_name", "sign"];
  const columns_type = ["str", "str", "str"];

  const columns_to_modal = ["currency_code", "currency_name"];
  const columns_nonfilter_field = ["currency_name"];
  const column_filter_field = ["currency_code"];
  const date_columns = [];
  const [csvdata, setCsvdata] = useState([]);

  const newadata = adata.map(
    ({
      id,
      currency_code,
      currency_name,
      sign,
      created_by,
      last_updated_by,
    }) => ({
      id,
      currency_code,
      currency_name,
      sign,
      created_by,
      last_updated_by,
    })
  );

  let breadcumb_menu = [
    { Label: "Home", Link: "/" },

    {
      Label: "Currencies",
    },
  ];

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

  useEffect(() => {
    fnGetPermissions();
    const fnGetDetails = async () => {
      let res = await fetch(
        `${process.env.REACT_APP_SERVER_URL}/api/get_range_currencies/${startingIndex}/${endingIndex}/`,
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

    fnGetDetails();
  }, [endingIndex, update, mode, startingIndex, PageSize]);

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
    <div className="sc_cl_div">
      {mode ? (
        <FnCurrenciesForm
          data={updatedata}
          close={setMode}
          viewvalue={view}
          diverts={divert}
          setdiverts={setDivert}
        />
      ) : (
        <div className="sc_cl_div w-100 px-2">
          <div className="d-flex flex-column flex-lg-row sc_cl_row sc_cl_page_header">
            <div className="align-items-center col-12 col-lg-6 d-flex py-2 text-center">
              <h5 className="sc_cl_head m-0">Currencies</h5>
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
            <div className="sc_cl_row card-header">
              <div className="sc_cl_div d-flex justify-content-end">
                <FnModalComponent
                  col_in_label={"Currency Code"}
                  col_in_modal_report={columns_to_modal}
                  columns_type={columns_type}
                  search_data_api={"currency_code"}
                  get_range_api={"get_range_currencies"}
                  report_filter_api={"multivaluesccode"}
                  report_data={newadata}
                  report_data_fun={setAdata}
                  report_add={setAdd}
                  report_menu_id={id}
                  include_map={(temp) =>
                    array_c_code.includes(temp.currency_code)
                  }
                  exclude_map={(temp) =>
                    !array_c_code.includes(temp.currency_code)
                  }
                  array_col_names={array_c_code}
                  col_nonfilter_field={columns_nonfilter_field}
                  col_filter_field={column_filter_field}
                  data_length={adatalength}
                  page_size={PageSize}
                  start={setStartingindex}
                  date_columns={date_columns}
                />
                <FnExportComponent
                  data={newadata}
                  columns={columns_to}
                  csvdata={csvdata}
                />
                {add && (
                  <FnBtnComponent
                    onClick={fnAddDetails}
                    children={"Add Currencies"}
                    classname={"sc_cl_submit_button px-3 p-2"}
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
                add={setAdd}
                view={setView}
                menu_id={id}
                diverts={setDivert}
                api_name={"del_currencies"}
                action={true}
              />
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

export default FnCurrenciesReport;

export const fnDeleteDetails = async (id, authTokens, load, api_name) => {
  Swal.fire({
    title: "Are you sure?",
    text: "You won't be able to revert this!",
    icon: "warning",
    showCancelButton: true,
    confirmButtonColor: "#3085d6",
    cancelButtonColor: "#d33",
    confirmButtonText: "Yes, delete it!",
  }).then((result) => {
    if (result.isConfirmed) {
      let res = fetch(
        `${process.env.REACT_APP_SERVER_URL}/api/${api_name}/${id}/`,
        {
          method: "PUT",
          body: JSON.stringify({ delete_flag: "Y" }),
          headers: {
            "Content-Type": "application/json",
            Authorization: "Bearer " + String(authTokens.access),
          },
        }
      );
      if (res) {
        Swal.fire("Deleted!", "Your file has been deleted.", "success").then(
          function () {
            load(false);
          }
        );
      }
    }
  });
};
