/* ============================================================================================================================================================

   CITTABASE SOLUTIONS - All Rights Reserved.
   ------------------------------------------------------------------------------------------------------------------------------------------------------------
  
   13-Sep-2022  Revan Rufus S     Initial Version             V1
   
   ** This Page is to define org functional hierarchy report  **
   
============================================================================================================================================================*/

import React, { useContext, useEffect, useState } from "react";
import { Row, Modal, Form, FormGroup } from "react-bootstrap";
import "bootstrap/dist/css/bootstrap.min.css";

import AuthContext from "../../context/AuthContext";
import { FaEdit, FaTrash } from "react-icons/fa";
import { IoMdAddCircle } from "react-icons/io";
import { useNavigate, useParams } from "react-router-dom";
import FnOrgFunctionalHierarchyForm from "./orgFunctionalHierarchyForm";
import Swal from "sweetalert2";
import FnTooltipComponent from "../../components/tooltipComponent";

// Css External Test
import "../../Assets/CSS/tree_style.css";
import FnBtnComponent from "../../components/buttonComponent";
import FnBreadCrumbComponent from "../../components/breadCrumbComponent";
import { BiMessageRoundedError } from "react-icons/bi";

const FnOrgFunctionalHierarchyReport = () => {
  let { authTokens, user } = useContext(AuthContext);
  const [actualgetdata, SetActualGetData] = useState([]);
  const [mode, SetMode] = useState(false);
  const [updatedata, SetUpdateData] = useState({});
  const [, setAction] = useState(false);
  const [hierarchy, SetHierarchy] = useState([]);
  const [leveldetails, SetLevelDetails] = useState({});
  const [add, setAdd] = useState(false);
  const [view, setView] = useState(false);
  const [viewpage, setViewPage] = useState();
  const [remove, setRemove] = useState(false);
  const [edit, setEdit] = useState(false);
  const [Reload, setReload] = useState(false);
  const { id } = useParams();
  const [helper, setHelper] = useState([]);
  const [funlevel, setFunlevel] = useState([]);
  const [parentid, setParentid] = useState([]);

  const history = useNavigate();

  let breadcumb_menu = [
    { Label: "Home", Link: "/" },

    {
      Label: "Organization Functional Hierarchy",
    },
  ];

  async function fnGetDetails() {
    const get_response = await fetch(
      `${process.env.REACT_APP_SERVER_URL}/api/get_org_functional_hierarchy`,
      {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          Authorization: "Bearer " + String(authTokens.access),
        },
      }
    );

    let get_data = await get_response.json();
    if (get_response.status === 200) {
      SetActualGetData(get_data);
      SetUpdateData(true);
    }

    const get_func_level_data = await fetch(
      `${process.env.REACT_APP_SERVER_URL}/api/get_scorecard`,
      {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          Authorization: "Bearer " + String(authTokens.access),
        },
      }
    );

    let func_level_data_check = await get_func_level_data.json();
    if (get_func_level_data.status === 200) {
      setFunlevel(func_level_data_check);
    }

    let hieracrchy_data = get_data;

    let hierarchy_object = Object.create(null);

    hieracrchy_data.forEach((actualData) => {
      hierarchy_object[actualData.functional_level_id] = {
        ...actualData,
        childnodes: [],
        countofchildnodes: [],
      };
    });

    const hierarchy_array = [];

    hieracrchy_data.forEach((actualData) => {
      if (actualData.parent_level_id > 0) {
        hierarchy_object[actualData.parent_level_id].childnodes.push(
          hierarchy_object[actualData.functional_level_id]
        );
      } else {
        hierarchy_array.push(hierarchy_object[actualData.functional_level_id]);
      }
    });

    let outdata = hierarchy_array;
    SetHierarchy(outdata);

    let res_helper = await fetch(
      `${process.env.REACT_APP_SERVER_URL}/api/get_helper`,
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
  }

  let check_fun_level_id = funlevel.map(
    (check) => check.functional_hierarchy_level
  );
  let check_par_level_id = actualgetdata.map((check) => check.parent_level_id);

  let parent_data = actualgetdata
    .filter((check) =>
      String(check.functional_level_id).includes(String(check_fun_level_id))
    )
    .map((parent) => parent.parent_level_id);

  let parnt_data = actualgetdata
    .filter((temp) =>
      funlevel
        .map((t) => t.functional_hierarchy_level)
        .includes(temp.functional_level_id)
    )
    .map((t) => t.parent_level_id);

  let parnt_data1 = actualgetdata
    .filter((temp) => parnt_data.includes(temp.functional_level_id))
    .map((t) => t.parent_level_id);

  
  let parnt_data2 = actualgetdata
    .filter((temp) => parnt_data1.includes(temp.functional_level_id))
    .map((t) => t.parent_level_id);

    
  
  // --- Start FnAddTreeData ---
  const FnAddTreeData = () => {
    const [show, SetShow] = useState(false);
    const handleClose = () => SetShow(false);
    const handleShow = () => SetShow(true);
    const [savedata, SetSaveData] = useState({
      created_by: user.user_id,
      last_updated_by: user.user_id,
      parent_level_id: 0,
    });
    const [, SetHierarchyLevelData] = useState([]);
    const [error, setError] = useState({});
    const [functionallevel, setFunctionallevel] = useState([]);

    const level_one_name = functionallevel
      .filter((temp) => String(temp.id).includes(String(1)))
      .map((data) => data.hierarchy_name);

    async function fn_submit_details() {
      const submit_response = await fetch(
        `${process.env.REACT_APP_SERVER_URL}/api/ins_org_functional_hierarchy`,
        {
          method: "POST",
          body: JSON.stringify(savedata),
          headers: {
            "Content-Type": "application/json",
            Authorization: "Bearer " + String(authTokens.access),
          },
        }
      );

      let ins_data = await submit_response.json();
      if (submit_response.status === 201) {
        setError();
        setAction();
        Swal.fire({
          icon: "success",
          text: "Created Successfully!",
        }).then(function () {
          SetMode(false);
          setReload(true);
        });
      } else {
        setError(ins_data);
      }
    }

    async function get_hierarchy_level() {
      // Getting Functional level from Org Definition Page
      const get_hierarchy_level = await fetch(
        `${process.env.REACT_APP_SERVER_URL}/api/get_org_functional_level`,
        {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
            Authorization: "Bearer " + String(authTokens.access),
          },
        }
      );

      let level_data = await get_hierarchy_level.json();

      if (get_hierarchy_level.status === 200) {
        setFunctionallevel(level_data);
      } else {
        alert("not happened");
      }

      const get_hierarchy_level_2 = await fetch(
        `${process.env.REACT_APP_SERVER_URL}/api/get_org_functional_hierarchy_2`,
        {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
            Authorization: "Bearer " + String(authTokens.access),
          },
        }
      );

      let level_data_2 = await get_hierarchy_level_2.json();

      SetSaveData({
        ...savedata,
        hierarchy_level: 1,
        main_parent_id: level_data_2 + 1,
      });
      SetHierarchyLevelData(level_data);
    }

    useEffect(() => {
      get_hierarchy_level();
      // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    const InputHandler = (e) => {
      SetSaveData({ ...savedata, [e.target.name]: e.target.value });
      setError({ ...error, [e.target.name]: "" });
    };

    const fn_get_permissions = async () => {
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
          setView(pdata[0].edit === "Y" ? false : true);
          // setViewPage(pdata[0].view === "Y" ? true : false);
        }
      }
    };

    useEffect(() => {
      fn_get_permissions();
    }, []);
    
    const help = helper
      .filter((user) => String(user.page_no).includes(String(id)))
      .map((use) => use);

    return (
      <div>
        {add && (
          <FnBtnComponent
            onClick={handleShow}
            classname={"sc_cl_submit_button"}
            children={"Add " + level_one_name}
          />
        )}
        <Modal
          show={show}
          onHide={handleClose}
          backdrop="static"
          size="sm"
          centered
        >
          <Modal.Header>
            <Modal.Title>Add {level_one_name}</Modal.Title>
          </Modal.Header>

          <Modal.Body>
            <Form>
              <Form.Group>
                <div className="col-12 d-flex flex-column">
                  <Form.Label className="sc_cl_input_label">
                    Functional Level Name
                    <FnTooltipComponent
                      label={help
                        .filter(
                          (user) =>
                            String(user.context_order).includes(String("1")) &&
                            Number(user.context_order) <= 9
                        )
                        .map((use) => use.label)}
                      context={help
                        .filter(
                          (user) =>
                            String(user.context_order).includes(String("1")) &&
                            Number(user.context_order) <= 9
                        )
                        .map((use) => use.help_context)}
                      classname={""}
                      placement="bottom"
                    />
                  </Form.Label>
                  <Form.Control
                    size="sm"
                    type="text"
                    name="functional_level_code"
                    value={savedata.functional_level_code || ""}
                    onChange={InputHandler}
                    placeholder="Functional Level Name"
                    className="w-100"
                  />
                  <span className="sc_cl_span red">
                    {error && error.functional_level_code}
                  </span>
                </div>

                {/* <div className="col-12 col-lg-6 d-flex flex-column">
                  <Form.Label className="sc_cl_input_label">Parent Level ID
                  <FnTooltipComponent 
                label={help.filter(user=> String(user.context_order).includes(String("2")) &&
                Number(user.context_order)<=9).map((use)=>use.label)}
                context={help.filter(user=>String(user.context_order).includes(String("2"))  &&
                Number(user.context_order)<=9).map((use)=>use.help_context)}
                classname={""}
                placement="bottom"/>
                </Form.Label>
                  <Form.Select
                    size="sm"
                    onChange={InputHandler}
                    name="parent_level_id"
                    className="w-75"
                  >
                    
                    <option defaultValue={"0"}>is Parent</option>
                    {actualgetdata
                      .filter((filterdata) => filterdata.parent_level_id === 0)
                      .map((level_items, i) => {
                        return (
                          <option
                            key={i}
                            value={level_items.functional_level_id}
                          >
                            {level_items.functional_level_code}
                          </option>
                        );
                      })}
                  </Form.Select>
                </div> */}
              </Form.Group>
            </Form>
          </Modal.Body>

          <Modal.Footer>
            <FnBtnComponent
              onClick={fn_submit_details}
              classname={"sc_cl_submit_button"}
              children={"Submit"}
            />

            <FnBtnComponent
              onClick={handleClose}
              classname={"sc_cl_close_button"}
              children={"Close"}
            />
          </Modal.Footer>
        </Modal>
      </div>
    );
  };
  // --- End FnAddTreeData ---

  // --- Start FnAddChildData ---
  const FnAddChildData = (parent_id, hierarchy_lvl, main_parent_data) => {
    const [show, SetShow] = useState(false);
    const handleClose = () => SetShow(false);
    const handleShow = () => SetShow(true);
    const [error, setError] = useState({});

    const [details, SetDetails] = useState([]);
    const [child, SetChild] = useState({
      created_by: user.user_id,
      last_updated_by: user.user_id,
    });

    const [functionallevel, setFunctionallevel] = useState([]);

    const level_two_name = functionallevel
      .filter((temp) =>
        String(temp.id).includes(String(parent_id.hierarchy_data))
      )
      .map((data) => data.hierarchy_name);

    async function get_tree_data() {
      // Getting Functional level from Org Definition Page
      const get_hierarchy_level = await fetch(
        `${process.env.REACT_APP_SERVER_URL}/api/get_org_functional_level`,
        {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
            Authorization: "Bearer " + String(authTokens.access),
          },
        }
      );

      let level_data = await get_hierarchy_level.json();

      if (get_hierarchy_level.status === 200) {
        setFunctionallevel(level_data);
      } else {
        alert("not happened");
      }

      let tree_response = await fetch(
        `${process.env.REACT_APP_SERVER_URL}/api/get_org_functional_hierarchy`,
        {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
            Authorization: "Bearer " + String(authTokens.access),
          },
        }
      );

      let tree_data = await tree_response.json();
      if (tree_response.status === 200) {
        SetDetails(tree_data);
      }
    }

    useEffect(() => {
      get_tree_data();
    }, []);

    async function addchildnode() {
      let child_response = await fetch(
        `${process.env.REACT_APP_SERVER_URL}/api/ins_org_functional_hierarchy`,
        {
          method: "POST",
          body: JSON.stringify({
            functional_level_id: details.length + 1,
            functional_level_code: child,
            hierarchy_level: parent_id.hierarchy_data,
            main_parent_id: parent_id.main_parent_data,
            parent_level_id: parent_id.parent_data,
            created_by: details[0].created_by,
            last_updated_by: details[0].last_updated_by,
          }),
          headers: {
            "Content-Type": "application/json",
            Authorization: "Bearer " + String(authTokens.access),
          },
        }
      );
      let child_data = await child_response.json();
      if (child_response.status === 201) {
        setError();
        setAction();
        Swal.fire({
          icon: "success",
          text: "Created Successfully!",
        }).then(function () {
          SetMode(false);
          setReload(true);
        });
      } else {
        setError(child_data);
      }
    }

    const help = helper
      .filter((user) => String(user.page_no).includes(String(id)))
      .map((use) => use);

    return (
      <>
        <IoMdAddCircle className="sc_cl_add_icon 456" 
        // color={"#1a72de"}
         onClick={handleShow} />
        <Modal
          show={show}
          onHide={handleClose}
          backdrop="static"
          size="sm"
          centered
        >
          <Modal.Header>
            <Modal.Title>Add {level_two_name}</Modal.Title>
          </Modal.Header>
          <Modal.Body>
            <Form>
              <FormGroup>
                <div className="col-12 d-flex flex-column">
                  <Form.Label className="sc_cl_lable">
                    Functional Level Name
                    <FnTooltipComponent
                      label={help
                        .filter(
                          (user) =>
                            String(user.context_order).includes(String("1")) &&
                            Number(user.context_order) <= 9
                        )
                        .map((use) => use.label)}
                      context={help
                        .filter(
                          (user) =>
                            String(user.context_order).includes(String("1")) &&
                            Number(user.context_order) <= 9
                        )
                        .map((use) => use.help_context)}
                      classname={""}
                      placement="bottom"
                    />
                  </Form.Label>
                  <Form.Control
                    size="sm"
                    type="text"
                    name="functional_level_code"
                    onChange={(e) => SetChild(e.target.value)}
                    placeholder="Functional Level Name"
                    className="w-100"
                  />
                  <span className="sc_cl_span red">
                    {error && error.functional_level_code}
                  </span>
                </div>
              </FormGroup>
            </Form>
          </Modal.Body>
          <Modal.Footer>
            <FnBtnComponent
              onClick={addchildnode}
              classname={"sc_cl_submit_button"}
              children={"Submit"}
            />

            <FnBtnComponent
              children={"Close"}
              onClick={handleClose}
              classname={"sc_cl_close_button"}
            />
          </Modal.Footer>
        </Modal>
      </>
    );
  };

  // --- End FnAddChildData ---

  async function fnDeleteDetails(id, h_id, p_id) {
    if (
      check_fun_level_id.includes(p_id) ||
      parnt_data.includes(p_id) ||
      parnt_data1.includes(p_id)
    ) {
      Swal.fire({
        icon: "error",
        text: "There is a Hierarchy in the Scorecard Level, You can not Delete This!",
      });
    } else {
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
          let delete_response = fetch(
            `${process.env.REACT_APP_SERVER_URL}/api/del_org_functional_hierarchy_3/${p_id}/`,
            {
              method: "PUT",
              body: JSON.stringify({ delete_flag: "Y" }),
              headers: {
                "Content-Type": "application/json",
                Authorization: "Bearer " + String(authTokens.access),
              },
            }
          );

          if (delete_response) {
            Swal.fire(
              "Deleted!",
              "Your file has been deleted.",
              "success"
            ).then(function () {
              setReload(true);
              SetActualGetData([]);
              SetUpdateData(true);
            });
          }
        }
      });
    }
  }

  async function fnGetOrgDefDetails() {
    const org_def_response = await fetch(
      `${process.env.REACT_APP_SERVER_URL}/api/get_org_definition`,
      {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          Authorization: "Bearer " + String(authTokens.access),
        },
      }
    );

    let org_def_data = await org_def_response.json();

    if (org_def_response.status === 200) {
      SetLevelDetails(org_def_data);
    }
    let [total_length] = org_def_data.map((temp) => {
      return parseInt(temp.no_of_org_functional_levels);
    });

    SetLevelDetails(total_length);
  }

  // --- Start FnDataUpdateDeleteAdd ---
  const FnDataUpdateDeleteAdd = ({ items }) => {
    return (
      <>
        <summary
          key={items.functional_level_id}
          className="caret fw-bolder mt-1"
        >
          {items.functional_level_code}

          <>
            {edit ? (
              <FaEdit
                className="sc-icons ms-2 sc_cl_edit_icon"
                  size={12}
                  color={"#1a72de"}
                  // color={"rgb(108, 117, 125)"}
                // className="sc_cl_edit_icon ms-2"
                onClick={() => fnUpdateDetails(items)}
              />
            ) : (
              <></>
            )}
            {remove ? (
              <FaTrash
              className="mx-2 sc-icons sc_cl_delete_icon"
                  size={12}
                  color={"rgb(220, 53, 69)"}
                // className=" mx-2 sc_cl_delete_icon"
                // onClick={() => {
                //   fnDeleteDetails(
                //     items.main_parent_id,
                //     items.hierarchy_level,
                //     items.functional_level_id
                //   );
                // }}

                onClick={() => {
                  fnDeleteDetails(
                    items.main_parent_id,
                    items.hierarchy_level,
                    items.functional_level_id
                  );
                }}
              />
            ) : (
              ""
            )}
            {items.hierarchy_level < leveldetails && add ? (
              <FnAddChildData
                parent_data={items.functional_level_id}
                hierarchy_data={items.hierarchy_level + 1}
                main_parent_data={items.main_parent_id}
              />
            ) : (
              ""
            )}
          </>
        </summary>
      </>
    );
  };

  // --- End FnDataUpdateDeleteAdd ---

  // Sample Function Test
  function fnMyFunction() {
    var element = document.getElementsByClassName("detail");
    if (document.getElementsByClassName("detail")[0].hasAttribute("open")) {
      for (var i = 0; i < element.length; i++) {
        document.getElementsByClassName("detail")[i].removeAttribute("open");
      }
    } else {
      for (var j = 0; j < element.length; j++) {
        document
          .getElementsByClassName("detail")
          [j].setAttribute("open", "open");
      }
    }
  }

  // --- Start FnSubHierarchy ---
  const FnSubHierarchy = ({ data }) => {
    return data.map((items, i) => (
      <React.Fragment key={i}>
        {items.childnodes.length > 0 ? (
          <li key={items.functional_level_id}>
            <details key={items.functional_level_id} className="detail">
              <FnDataUpdateDeleteAdd items={items} />
              <ul key={items.functional_level_id} className="111 mt-1">
                <FnSubHierarchy data={items.childnodes} />
              </ul>
            </details>
          </li>
        ) : (
          <>
            <li
              key={items.functional_level_id}
              className="align-items-center d-flex sc-li fw-bold mt-1"
            >
              {items.functional_level_code}
              &nbsp;&nbsp;
              {edit ? (
                <FaEdit
                  className="sc-icons sc_cl_edit_icon"
                  size={12}
                  // color={"rgb(108, 117, 125)"}
                  color={"#1a72de"}
                  onClick={() => fnUpdateDetails(items)}
                />
              ) : (
                <></>
              )}
              {remove ? (
                <FaTrash
                  className="mx-2 sc-icons sc_cl_delete_icon"
                  size={12}
                  color={"rgb(220, 53, 69)"}
                  onClick={() => {
                    fnDeleteDetails(
                      items.main_parent_id,
                      items.hierarchy_level,
                      items.functional_level_id
                    );
                  }}
                />
              ) : (
                ""
              )}
              {items.hierarchy_level < leveldetails && add ? (
                <FnAddChildData
                  parent_data={items.functional_level_id}
                  hierarchy_data={items.hierarchy_level + 1}
                  main_parent_data={items.main_parent_id}
                />
              ) : (
                ""
              )}
            </li>
          </>
        )}
      </React.Fragment>
    ));
  };

  // --- End FnSubHierarchy ---

  const fnUpdateDetails = async (temp) => {
    SetUpdateData(temp);
    SetMode(true);
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
        setViewPage(pdata[0].view === "Y" ? true : false);
      }
    }
  };

  useEffect(() => {
    if (mode === false || Reload === true) {
      fnGetPermissions();
      fnGetDetails();
      fnGetOrgDefDetails();
      setReload(false);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [mode, Reload]);

  useEffect(() => {
    var toggler = document.getElementsByClassName("caret");

    for (var i = 0; i < toggler.length; i++) {
      toggler[i].addEventListener("click", function () {
        var nestedElement = this.parentElement.querySelectorAll(".nested");
        for (var j = 0; j < nestedElement.length; j++) {
          nestedElement[j].classList.toggle("active");
        }
        this.classList.toggle("caret-down");
      });
    }
  });

  return (
    <>
    {viewpage === undefined ?
    '' 
  :<>
      {viewpage === false ? (
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
              onClick={() => history("/")}
              children={"Close"}
              classname={"sc_cl_close_button"}
            ></FnBtnComponent>
          </Modal.Footer>
        </Modal>
      ) : (
    <div className="sc_cl_div w-100 px-2">
      <div className="d-flex flex-column flex-lg-row sc_cl_row sc_cl_page_header">
        <div className="align-items-center col-12 col-lg-6 d-flex py-2 text-center">
          <h5 className="sc_cl_head m-0">Organization Functional Hierarchy</h5>
        </div>

        <div className="align-items-center col-12 col-lg-6 d-flex justify-content-lg-end py-2 text-center">
          <FnBreadCrumbComponent
            seperator_symbol={" >"}
            nav_items={breadcumb_menu}
          />
        </div>
      </div>

      {/* <hr></hr> */}

      <div className="mt-3">
        {mode ? (
          <FnOrgFunctionalHierarchyForm
            data={updatedata}
            close={SetMode}
            viewvalue={view}
          />
        ) : (
          ""
        )}
      </div>

      {hierarchy.length !== 0 ? (
        <div className="d-flex justify-content-end">
          <FnBtnComponent
            children={"Expand/Colapse"}
            onClick={fnMyFunction}
            classname={"sc_cl_submit_button"}
          />
        </div>
      ) : (
        ""
      )}

      <ul className="tree mt-2">
        {hierarchy.map((data, i) => {
          return (
            <div key={i} className="align-items-center d-flex">
              {data.childnodes.length > 0 ? (
                <li key={data.functional_level_id} className="mt-2">
                  <details key={data.functional_level_id} className="detail">
                    <FnDataUpdateDeleteAdd items={data} />
                    <ul key={data.functional_level_id} className="222 mt-1">
                      <FnSubHierarchy data={data.childnodes} />
                    </ul>
                  </details>
                </li>
              ) : (
                <li key={data.functional_level_id} className="mt-2">
                  <details key={data.functional_level_id} className="detail">
                    <FnDataUpdateDeleteAdd items={data} />
                  </details>
                </li>
              )}
            </div>
          );
        })}
      </ul>

      <div className="mt-2">
        <FnAddTreeData />
      </div>
    </div>
     )}
     </>
}
   </>
  );
};

export default FnOrgFunctionalHierarchyReport;
