/* ============================================================================================================================================================

   CITTABASE SOLUTIONS - All Rights Reserved.
   ------------------------------------------------------------------------------------------------------------------------------------------------------------

   10-Aug-2022   Dinesh J      Initial Version             V1

   ** This Page is to define org settings report  **

============================================================================================================================================================*/

import React, { useState, useContext, useEffect } from "react";
import AuthContext from "../../context/AuthContext";
import PreContext from "../../context/PreContext";
import {
  Row,
  FormGroup,
  FormLabel,
  FormControl,
  FormSelect,
  Modal,
} from "react-bootstrap";
import { useParams, useNavigate } from "react-router-dom";
import Swal from "sweetalert2";
import FnBtnComponent from "../../components/buttonComponent";
import FnBreadCrumbComponent from "../../components/breadCrumbComponent";
import FnTooltipComponent from "../../components/tooltipComponent";
import { BiMessageRoundedError } from "react-icons/bi";

const FnOrgSettingsReport = () => {
  let { authTokens, user, setLoading } = useContext(AuthContext);
  let { userSettings } = useContext(PreContext);
  const [adata, setAdata] = useState([]);
  const [logo, setLogo] = useState();
  const [action, setAction] = useState(false);
  const [mode, setMode] = useState(true);
  const [error, setError] = useState({});
  const [profiledetails, setProfiledetails] = useState([]);
  const [add, setAdd] = useState(false);
  const [view, setView] = useState();
  const [edit, setEdit] = useState(false);
  const [remove, setRemove] = useState(false);
  const { id } = useParams();
  const [helper, setHelper] = useState([]);
  const [previewURL, setPreviewURL] = useState("");
  const [configdata, setConfigdata] = useState([]);
  const [startingIndex, setStartingindex] = useState(0);
  const PageSize =
    userSettings && userSettings.pagination
      ? userSettings.pagination
      : process.env.REACT_APP_PAGINATION;
  const endingIndex = startingIndex + Number(PageSize);

  const navigator = useNavigate();

  let breadcumb_menu = [
    { Label: "Home", Link: "/" },

    {
      Label: "Organization Settings",
    },
  ];

  const fnGetConfigCodesDetails = async () => {
    let res = await fetch(
      `${process.env.REACT_APP_SERVER_URL}/api/get_range_config_codes/${startingIndex}/${endingIndex}`,
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
        setConfigdata(data.csv_data);
      } else {
        console.log("config_code api error");
      }
    }
  };

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
        setRemove(pdata[0].delete === "Y" ? true : false);
        setEdit(pdata[0].edit === "Y" ? true : false);
        setAdd(pdata[0].add === "Y" ? true : false);
        setView(pdata[0].view === "Y" ? true : false);
      }
    }
  };

  let fnGetCurrency = async () => {
    let response = await fetch(
      `${process.env.REACT_APP_SERVER_URL}/api/get_currencies`,
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
      if (data.length > 0) {
        setProfiledetails(data);
      }
    }
  };

  const fnGetDetails = async () => {
    let res = await fetch(
      `${process.env.REACT_APP_SERVER_URL}/api/get_org_settings`,
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
        setAdata(data[0]);
        setLogo(data[0].logo.replace(/^.*[\\\/]/, ""));
        setAction(true);
      }
    }

    let res_helper = await fetch(
      `${process.env.REACT_APP_SERVER_URL}/api/get_helper/${id}`,
      {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          Authorization: "Bearer " + String(authTokens.access),
        },
      }
    );
    let helper_data = await res_helper.json();
    if (res_helper.status === 200) {
      if (helper_data) {
        setHelper(helper_data);
      }
    }
  };

  useEffect(() => {
    fnGetPermissions();
    fnGetConfigCodesDetails();
    fnGetCurrency();
    // eslint-disable-next-line react-hooks/exhaustive-deps
    fnGetDetails();
    if (adata.length === 0) {
      setMode(true);
    } else {
      setMode(false);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [mode, action, adata.length]);

  const fnUpdateDetails = async () => {
    const uploadData = new FormData();
    uploadData.append("fiscal_year_start", adata.fiscal_year_start);
    uploadData.append("week_start", adata.week_start);
    uploadData.append("logo", logo);
    uploadData.append("reporting_currency", adata.reporting_currency);
    uploadData.append("number_format_decimals", adata.number_format_decimals);
    uploadData.append(
      "number_format_comma_seperator",
      adata.number_format_comma_seperator
    );
    uploadData.append("created_by", user.user_id);
    uploadData.append("last_updated_by", user.user_id);

    let res = await fetch(
      `${process.env.REACT_APP_SERVER_URL}/api/upd_org_settings/${adata.id}/`,
      {
        method: "PUT",
        body: uploadData,
        headers: {
          // 'Content-Type': 'application/json',
          Authorization: "Bearer " + String(authTokens.access),
        },
      }
    );
    let data = await res.json();
    if (res.status === 200) {
      setError();
      Swal.fire({
        icon: "success",
        text: "Organization Settings Updated Successfully!",
      }).then(function () {
        setAction(false);
        setLoading(true);
      });
    } else {
      setError(data);
    }
  };

  const fnInputHandler = (e) => {
    if (e.target.files != undefined) {
      const file = e.target.files[0];
      if (file && file.size > 1048576) {
        // 1MB = 1048576 bytes
        setError({
          ...error,
          [e.target.name]: "File size should be less than 1MB",
        });
        return;
      }
      if (
        file &&
        !(
          file.type === "image/jpeg" ||
          file.type === "image/png" ||
          file.type === "image/jpg" ||
          file.type === "image/gif" ||
          file.type === "image/tiff" ||
          file.type === "image/avif"
        )
      ) {
        setError({
          ...error,
          [e.target.name]:
            "Please select an image file (eg : JPEG, PNG etc...)",
        });
        return;
      }

      setLogo(file);

      const reader = new FileReader();

      reader.onloadend = () => {
        setPreviewURL(reader.result);
      };

      if (file) {
        // Read the file as a data URL
        reader.readAsDataURL(file);
      }
    }

    setAdata({ ...adata, [e.target.name]: e.target.value });
    setError({ ...error, [e.target.name]: "" });
  };

  return (
    <>
    {view === undefined ?
    '' 
  :<>
      {view === false ? (
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
        <div className="sc_cl_div w-100 px-2">
          <div className="d-flex flex-column flex-lg-row sc_cl_row sc_cl_page_header">
            <div className="align-items-center col-12 col-lg-6 d-flex py-2 text-center">
              <h5 className="sc_cl_head m-0">Organization Settings</h5>
            </div>

            <div className="align-items-center col-12 col-lg-6 d-flex justify-content-lg-end py-2 text-center">
              <FnBreadCrumbComponent
                seperator_symbol={" >"}
                nav_items={breadcumb_menu}
              />
            </div>
          </div>

          {/* <hr></hr> */}

          <div className="sc-cl-main-content">
            <div className="sc_cl_div col-lg-12 d-flex flex-column flex-lg-row flex-sm-column justify-content-between p-2 gap-1">
              <FormGroup className="sc_cl_div col-12 col-sm-4 d-flex flex-column">
                <FormLabel className="sc_cl_label">
                  Fiscal Year Start <sup className="text-danger">*</sup>
                  <FnTooltipComponent
                    label={helper
                      .filter((user) => user.context_order === 1)
                      .map((use) => use.label)}
                    context={helper
                      .filter((user) => user.context_order === 1)
                      .map((use) => use.help_context)}
                    classname={""}
                    placement="bottom"
                  />
                </FormLabel>
                <FormSelect
                  size="sm"
                  name="fiscal_year_start"
                  value={adata.fiscal_year_start || ""}
                  onChange={fnInputHandler}
                  className="sc_cl_select"
                  disabled={!edit}
                >
                  <option className="sc_cl_option" hidden>
                    Select a value
                  </option>
                  {configdata
                    .filter(
                      (data) =>
                        data.config_type.includes("Fiscal Year Start") &&
                        data.is_active
                    )
                    .map((temp) => {
                      return (
                        <option
                          className="sc_cl_option"
                          key={temp.id}
                          value={temp.config_value}
                        >
                          {temp.config_code}
                        </option>
                      );
                    })}
                </FormSelect>
                <span className="sc_cl_span red">
                  {error && error.fiscal_year_start}
                </span>
              </FormGroup>

              <FormGroup className="sc_cl_div col-12 col-sm-4 d-flex flex-column">
                <FormLabel className="sc_cl_label">
                  Week Start <sup className="text-danger">*</sup>
                  <FnTooltipComponent
                    label={helper
                      .filter((user) => user.context_order === 2)
                      .map((use) => use.label)}
                    context={helper
                      .filter((user) => user.context_order === 2)
                      .map((use) => use.help_context)}
                    classname={""}
                    placement="bottom"
                  />
                </FormLabel>
                <FormSelect
                  size="sm"
                  name="week_start"
                  value={adata.week_start || ""}
                  onChange={fnInputHandler}
                  className="sc_cl_select w-"
                  disabled={!edit}
                >
                  <option className="sc_cl_option" hidden>
                    Select a value
                  </option>
                  {configdata
                    .filter(
                      (data) =>
                        data.config_type.includes("Week Start") &&
                        data.is_active
                    )
                    .map((temp) => {
                      return (
                        <option
                          className="sc_cl_option"
                          key={temp.id}
                          value={temp.config_value}
                        >
                          {temp.config_code}
                        </option>
                      );
                    })}
                </FormSelect>
                <span className="sc_cl_span red">
                  {error && error.week_start}
                </span>
              </FormGroup>

              <FormGroup className="sc_cl_div col-12 col-sm-4 d-flex flex-column ">
                <FormLabel className="sc_cl_label">
                  Reporting Currency <sup className="text-danger">*</sup>
                  <FnTooltipComponent
                    label={helper
                      .filter((user) => user.context_order === 4)
                      .map((use) => use.label)}
                    context={helper
                      .filter((user) => user.context_order === 4)
                      .map((use) => use.help_context)}
                    classname={""}
                    placement="bottom"
                  />
                </FormLabel>

                <FormSelect
                  size="sm"
                  name="reporting_currency"
                  value={adata.reporting_currency || ""}
                  onChange={fnInputHandler}
                  className="sc_cl_select w-"
                  disabled={!edit}
                >
                  <option className="sc_cl_option" hidden>
                    Select a value
                  </option>
                  {profiledetails.map((temp) => (
                    <option
                      className="sc_cl_option"
                      key={temp.id}
                      value={temp.id}
                    >
                      {temp.currency_code}
                    </option>
                  ))}
                </FormSelect>
                <span className="sc_cl_span red">
                  {error && error.reporting_currency}
                </span>
              </FormGroup>
            </div>

            <div className="sc_cl_div col-lg-12 d-flex flex-column flex-lg-row flex-sm-column justify-content-between p-2 gap-1">
              <FormGroup className="sc_cl_div col-12 col-sm-4 d-flex flex-column ">
                <FormLabel className="sc_cl_label">
                  Number Format Decimals <sup className="text-danger">*</sup>
                  <FnTooltipComponent
                    label={helper
                      .filter((user) => user.context_order === 5)
                      .map((use) => use.label)}
                    context={helper
                      .filter((user) => user.context_order === 5)
                      .map((use) => use.help_context)}
                    classname={""}
                    placement="bottom"
                  />
                </FormLabel>

                <FormControl
                  size="sm"
                  type="number"
                  name="number_format_decimals"
                  min={0}
                  max={5}
                  value={adata.number_format_decimals || ""}
                  onChange={fnInputHandler}
                  placeholder="Enter Number Format Decimals"
                  className="sc_cl_input col-lg-5"
                  disabled={!edit}
                />
                <span className="sc_cl_span red">
                  {error && error.number_format_decimals}
                </span>
              </FormGroup>

              <FormGroup className="sc_cl_div col-12 col-sm-4 d-flex flex-column ">
                <FormLabel className="sc_cl_label text-nowrap">
                  Comma Seperator <sup className="text-danger">*</sup>
                  <FnTooltipComponent
                    label={helper
                      .filter((user) => user.context_order === 6)
                      .map((use) => use.label)}
                    context={helper
                      .filter((user) => user.context_order === 6)
                      .map((use) => use.help_context)}
                    classname={""}
                    placement="bottom"
                  />
                </FormLabel>

                <FormSelect
                  size="sm"
                  name="number_format_comma_seperator"
                  value={adata.number_format_comma_seperator || ""}
                  onChange={fnInputHandler}
                  className="sc_cl_select w-"
                  disabled={!edit}
                >
                  <option className="sc_cl_option" hidden>
                    Select a value
                  </option>
                  {configdata
                    .filter(
                      (data) =>
                        data.config_type.includes(
                          "Number Format-Comma Seperator"
                        ) && data.is_active
                    )
                    .map((temp) => {
                      return (
                        <option
                          className="sc_cl_option"
                          key={temp.id}
                          value={temp.config_value}
                        >
                          {temp.config_code}
                        </option>
                      );
                    })}
                </FormSelect>
                <span className="sc_cl_span red">
                  {error && error.number_format_comma_seperator}
                </span>
              </FormGroup>
              <div className="sc_cl_div col-12 col-sm-4 d-flex flex-column "></div>
            </div>

            {/* <Row className="sc_cl_row"> */}
            <div className="sc_cl_div align-items-center d-flex w-auto">
              {previewURL ? (
                <img
                  src={previewURL}
                  alt="Preview"
                  width="100px"
                  // height="200px"
                  className="justify-content-middle m-2"
                />
              ) : (
                <img
                  src={"/Assets/master" + adata.logo}
                  alt="Choose your Image"
                  className="justify-content-middle m-2"
                  width="100px"
                  // height="80px"
                />
              )}
              <label
                htmlFor="inputTag"
                className={`sc_cl_submit_button ${edit ? "" : "d-none"}`}
              >
                {logo ? "Change" : "Upload"}
                <input
                  type="file"
                  accept="image/*"
                  id="inputTag"
                  name="logo"
                  className="sc_cl_input d-none"
                  onChange={fnInputHandler}
                />
              </label>
              <span className="sc_cl_span red">{error && error.logo}</span>
              <sup className="text-danger">*</sup>
              <FnTooltipComponent
                label={helper
                  .filter((user) => user.context_order === 3)
                  .map((use) => use.label)}
                context={helper
                  .filter((user) => user.context_order === 3)
                  .map((use) => use.help_context)}
                classname={""}
                placement="bottom"
              />
            </div>
            {/* </Row> */}

            <div className="sc_cl_div align-items-center d-flex mt-3 w-auto">
              <FnBtnComponent
                children={"Update"}
                onClick={fnUpdateDetails}
                classname={`${edit ? "" : "d-none"} sc_cl_submit_button`}
              />

              <FnBtnComponent
                children={"Back"}
                onClick={() => navigator("/")}
                classname={"sc_cl_close_button m-2"}
              />
            </div>
          </div>
        </div>
      )}
      </>
}
    </>
  );
};

export default FnOrgSettingsReport;
