/* =========================================================================================================================

   CITTIABASE SOLUTIONS - All Rights Reserved.
   ----------------------------------------------------------------------------------------------------------------------------

   21-MAR-2023  Jagadeshwaran R      Initial Version             V1

   ** This Component contains Modal window for currency filter**

==========================================================================================================================*/

import React, { useState, useContext } from "react";
import AuthContext from "../context/AuthContext";
import { Row, Modal, Table } from "react-bootstrap";
import FnTableComponent from "./tableComponent";
import FnSelectComponent from "./selectComponent";
import { MdSearch } from "react-icons/md";
import "bootstrap/dist/css/bootstrap.min.css";
import FnBtnComponent from "./buttonComponent";

const FnModalComponent = ({
  col_in_label,
  col_in_modal_report,
  columns_type,
  search_data_api,
  get_range_api,
  report_filter_api,
  report_data,
  report_data_fun,
  report_add,
  report_menu_id,
  include_map,
  exclude_map,
  array_col_names,
  col_nonfilter_field,
  col_filter_field,
  data_length,
  page_size,
  start,
  date_columns,
}) => {

  let { authTokens } = useContext(AuthContext);
  const [modaladata, setModaladata] = useState([]);
  const [modal, setModal] = useState(false);
  const [c_code, setC_Code] = useState("");
  const [search, setSearch] = useState("");
  const [array_data] = useState([]);
  const [, setDummy] = useState("");

  const fnToggle = async () => {
    setModal(!modal);
  };

  const fnFilter = async (c_code) => {
    if (c_code.length !== 0) {
      let response = await fetch(
        `${process.env.REACT_APP_SERVER_URL}/api/${report_filter_api}/${c_code}`,
        {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
            Authorization: "Bearer " + String(authTokens.access),
          },
        }
      );

      let data = await response.json();

      if (response.status === 200) {
        report_data_fun(data);
      }
    } else {
      alert("Empty search not supported...");
    }
  };

  const fnSearch = async (search) => {
    if (search !== "") {
      let response = await fetch(
        `${process.env.REACT_APP_SERVER_URL}/api/${search_data_api}/?search=${search}`,
        {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
            Authorization: "Bearer " + String(authTokens.access),
          },
        }
      );

      let data = await response.json();

      if (response.status === 200) {
        setModaladata(data);
      }
    } else {
      alert("Empty search not supported in Modal...");
    }
  };

  const fnSelectValues = async (array_col_names) => {
    setC_Code(array_col_names);
    setModal(!modal);
  };

  const fnpushCCode = async (data, codedata) => {
    array_data.push(data);
    array_col_names.push(codedata);
    setDummy(data);
  };

  const fnRefresh = async () => {
    array_data.length = 0;
    array_col_names.length = 0;
    setDummy(array_data);
  };

  return (
    <div className="sc_cl_div">
      <FnBtnComponent
        onClick={fnToggle}
        children={"Currencies"}
        classname={"sc_cl_close_button px-3 p-2 bg-opacity-50 bg-secondary border-0"} 
        Icon={<MdSearch className="me-2" />}
        />

      <Modal size="lg" show={modal} onHide={fnToggle}>
        <Modal.Header closeButton onClick={() => fnSelectValues(array_col_names)}>
          <Modal.Title>Search Modal</Modal.Title>
        </Modal.Header>

        <Modal.Body>
          <div className="sc_cl_div align-items-center d-flex w-auto">
            <label className="sc_cl_label">{col_in_label} :</label>
            <input
              type="search"
              className="sc_cl_input ms-2"
              placeholder="Enter data for search..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              autoFocus
            />
            
            <FnBtnComponent
              onClick={() => fnSearch(search)}
              children={"Search"}
              classname={"sc_cl_submit_button ms-2"} />
            
            <FnBtnComponent
              onClick={() => fnSelectValues(array_col_names)}
              children={"Close"}
              classname={"sc_cl_close_button mx-2"} />
            
            <FnBtnComponent
              onClick={fnRefresh}
              children={"Refresh"}
              classname={"sc_cl_submit_button"} />
            
          </div>

          {modaladata.length === 0 && (
            <FnTableComponent
              data={report_data}
              columns_in={col_in_modal_report}
              columns_type={columns_type}
              add={report_add}
              menu_id={report_menu_id}
              api_name={"del_currencies"}
              action={false}
              data_length={data_length}
              page_size={page_size}
              start={start}
              date_columns={date_columns}
            />
          )}
          {modaladata.length !== 0 && (
            <div className=" ">
              <Table
                className="sc_cl_table  m-auto table-responsive"
                striped
                hover
              >
                <thead className="card-header text-left custom-cursor-pointer">
                  <tr className="sc_cl_th">
                    {col_in_modal_report.map((data) => (
                      <th key={data}>{data.replaceAll("_", " ")}</th>
                    ))}
                  </tr>
                </thead>

                <tbody className="sc_cl_tbody text-center">
                  {array_data.filter(include_map).map((temp) => (
                    <tr key={temp.id} className="bg-warning">
                      {col_in_modal_report.map((v) => {
                        return (
                          <td key={v} className="sc_cl_td text-start">
                            {" "}
                            {temp[v]}{" "}
                          </td>
                        );
                      })}
                    </tr>
                  ))}

                  {modaladata.filter(exclude_map).map((temp) => (
                    <tr key={temp.id} className="sc_cl_tr">
                      {col_filter_field.map((e) => (
                        <td className="sc_cl_td text-start" key={e}>
                          <option
                            onClick={(e) => fnpushCCode(temp, e.target.value)}
                          >
                            {temp[e]}
                          </option>
                        </td>
                      ))}

                      {col_nonfilter_field.map((v) => {
                        return (
                          <td key={v} className="sc_cl_td text-start">
                            {" "}
                            {temp[v]}{" "}
                          </td>
                        );
                      })}
                    </tr>
                  ))}
                </tbody>
              </Table>
            </div>
          )}
        </Modal.Body>
      </Modal>

      {c_code.length !== 0 && (
        <Row className="sc_cl_row p-2">
          <div className="sc_cl_div col-lg-12 d-flex flex-column flex-lg-row flex-sm-column justify-content-between">
            <div className="sc_cl_div col-12 col-lg-6 d-flex flex-column">
              <label className="sc_cl_label h6">{col_in_label}</label>

              <FnSelectComponent
                values={array_col_names}
                labels={array_col_names}
                query={c_code}
                setQuery={setC_Code}
                multiselect={true}
              />
            </div>
          </div>

          <div className="sc_cl_div align-items-center d-flex justify-content-evenly mt-4 w-auto">
            <FnBtnComponent
              onClick={() => fnFilter(c_code)}
              children={"Filter"}
              classname={"sc_cl_submit_button"} />
          </div>
        </Row>
      )}

    </div>
  );
};

export default FnModalComponent;
