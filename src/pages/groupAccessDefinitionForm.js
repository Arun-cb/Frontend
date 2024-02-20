import React, { useState, useContext, useEffect } from "react";
import AuthContext from "../context/AuthContext";
import { Col, Row, Container, Table, Form, Modal } from "react-bootstrap";
import { useNavigate, useParams } from "react-router-dom";
import Swal from "sweetalert2";
import FnBreadCrumbComponent from "../components/breadCrumbComponent";
import FnBtnComponent from "../components/buttonComponent";
import { BiMessageRoundedError } from "react-icons/bi";

const FnGroupAccessDefinitionForm = () => {
  let { authTokens, user } = useContext(AuthContext);
  const [adata] = useState({
    created_by: user.user_id,
    last_updated_by: user.user_id,
    add: "N",
    view: "N",
    edit: "N",
    delete: "N",
  });
  const [allgroup, setAllgroup] = useState([]);
  const [existpermissions, setExistPermissions] = useState({});
  const [selectedid, setSelectedid] = useState(null);
  const [load, setLoad] = useState(false);
  const [allselected, setAllselected] = useState(false);
  const [createnewtab, setCreatenewtab] = useState(false);
  const [inputs, setInputs] = useState({});
  const [menus, setMenus] = useState([]);
  const [deletedisablemenu, setDeletedisablemenu] = useState(null);
  const [excepteditdisablemenu, setExceptEditDisableMenu] = useState(null);
  const [error, setError] = useState({});
  const navigator = useNavigate();
  const [view, setView] = useState();
  const { id } = useParams();

  let breadcumb_menu = [
    { Label: "Home", Link: "/" },

    {
      Label: "Menu Permisssions",
    },
  ];

  const getGroupDetails = async () => {
    let res = await fetch(
      `${process.env.REACT_APP_SERVER_URL}/api/get_auth_group`,
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
        setAllgroup(data);
      }
    }
  };

  const getMenusDeatils = async () => {
    let mres = await fetch(
      `${process.env.REACT_APP_SERVER_URL}/api/get_navigation_menu_details`,
      {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          Authorization: "Bearer " + String(authTokens.access),
        },
      }
    );
    let mdata = await mres.json();
    
    let filtered_mdata = mdata.filter((data) => data.menu_name !== "Home");
    
    if (mres.status === 200) {
      if (filtered_mdata.length > 0) {
        filtered_mdata.forEach((m) => {
          if (m.menu_name === "Functional Level") {
            setDeletedisablemenu(m.menu_id);
          } else if (m.menu_name === "Publish Scorecard") {
            setExceptEditDisableMenu(m.menu_id);
          }
        });
        setMenus(filtered_mdata);
      }
    }
  };

  const fn_update_details = async () => {
    let res = await fetch(
      `${process.env.REACT_APP_SERVER_URL}/api/upd_group_access_definition/${selectedid}/`,
      {
        method: "PUT",
        body: JSON.stringify(inputs),
        headers: {
          "Content-Type": "application/json",
          Authorization: "Bearer " + String(authTokens.access),
        },
      }
    );
    let data = await res.json();
    if (res.status === 200) {
      Swal.fire({
        icon: "success",
        // title: 'Updated',
        text: "Updated Successfully!",
      }).then(function () {
        setError();
        // setAction(false)
      });
      // setLoad('')
    } else {
      setError(data);
    }
  };

  const fn_submit_details = async () => {
    if (inputs[0] && inputs[0]["group_name"] !== "") {
      let res = await fetch(
        `${process.env.REACT_APP_SERVER_URL}/api/ins_group_access`,
        {
          method: "POST",
          body: JSON.stringify(inputs),
          headers: {
            "Content-Type": "application/json",
            Authorization: "Bearer " + String(authTokens.access),
          },
        }
      );
      let data = await res.json();
      if (res.status === 201) {
        Swal.fire({
          icon: "success",
          // title: 'Updated',
          text: "User Access Added Successfully...",
        }).then(function () {
          setError();
        });
      } else {
        setError({ group_name: data.name });
        setInputs({});
        window.scrollTo(0, 0);
      }
    } else {
      setError({ group_name: "Group name is Required" });
      window.scrollTo(0, 0);
    }
  };

  const Existpremissiondetails = async (id) => {
    let res = await fetch(
      `${process.env.REACT_APP_SERVER_URL}/api/join_user_group_access${
        id ? `/${id}/` : ""
      }`,
      {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          Authorization: "Bearer " + String(authTokens.access),
        },
      }
    );

    let data = await res.json();
    const tempobj = Object.create({});
    if (res.status === 200) {
      if (data.length >= 0) {
        setExistPermissions(data);
        if (data.length === 0) {
          setAllselected(false);
        }
        data.forEach((temp) => {
          tempobj[temp.menu_id] = { ...temp, group_id: id };
          if (
            temp.add === "N" ||
            temp.edit === "N" ||
            temp.view === "N" ||
            temp.delete === "N"
          ) {
            if (temp.menu_id === deletedisablemenu) {
              setAllselected(true);
            }
            // else if(temp.menu_id === excepteditdisablemenu){

            // }
            else {
              setAllselected(false);
            }
          }
        });
      }
      setInputs(tempobj);
    }
  };

  const fn_get_permisstion = (id) => {
    setError({});
    setAllselected(true);
    setSelectedid(id);
    Existpremissiondetails(id);
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
        // setRemove(pdata[0].delete === "Y" ? true : false);
        // setEdit(pdata[0].edit === "Y" ? true : false);
        // setAdd(pdata[0].add === "Y" ? true : false);
        setView(pdata[0].view === "Y" ? true : false);
      }
    }
  };

  useEffect(() => {
    fnGetPermissions();
    if (load === false) {
      getMenusDeatils();
      getGroupDetails();
    } else {
      setLoad(false);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [load]);

  const InputHandler = (e, mid) => {
    if (e.target.name === "group_name") {
      setError({ ...error, [e.target.name]: "" });
      inputs[0] = {
        [e.target.name]: e.target.value,
        created_by: user.user_id,
        last_updated_by: user.user_id,
      };
    }
    if (!inputs[mid]) {
      menus.forEach((temp) => {
        if (temp.menu_id === mid) {
          inputs[temp.menu_id] = {
            ...adata,
            menu_id: temp.menu_id,
            group_id: selectedid,
            [e.target.name]: e.target.value,
          };
        } else if (!inputs[temp.menu_id]) {
          inputs[temp.menu_id] = {
            ...adata,
            menu_id: temp.menu_id,
            group_id: selectedid,
          };
        } else {
          inputs[temp.menu_id] = {
            ...inputs[temp.menu_id],
            menu_id: temp.menu_id,
            group_id: selectedid,
          };
        }
      });
      setLoad(true);
    } else {
      inputs[mid] = { ...inputs[mid], [e.target.name]: e.target.value };
      setLoad(true);
    }
  };

  const fn_create_new_group = () => {
    setCreatenewtab(true);
    Existpremissiondetails();
  };

  const SelectAll = () => {
    if (allselected) {
      menus.forEach((temp) => {
        inputs[temp.menu_id] = {
          ...inputs[temp.menu_id],
          menu_id: temp.menu_id,
          group_id: selectedid,
          add: "N",
          edit: "N",
          view: "N",
          delete: "N",
        };
      });
      setLoad(true);
      setAllselected(false);
    } else {
      menus.forEach((temp) => {
        if (temp.menu_id === deletedisablemenu) {
          inputs[temp.menu_id] = {
            ...adata,
            menu_id: temp.menu_id,
            group_id: selectedid,
            add: "Y",
            edit: "Y",
            view: "Y",
            delete: "N",
          };
        } else if (temp.menu_id === excepteditdisablemenu) {
          inputs[temp.menu_id] = {
            ...adata,
            menu_id: temp.menu_id,
            group_id: selectedid,
            add: "Y",
            edit: "N",
            view: "N",
            delete: "N",
          };
        } else if (!inputs[temp.menu_id]) {
          inputs[temp.menu_id] = {
            ...adata,
            menu_id: temp.menu_id,
            group_id: selectedid,
            add: "Y",
            edit: "Y",
            view: "Y",
            delete: "Y",
          };
        } else {
          inputs[temp.menu_id] = {
            ...inputs[temp.menu_id],
            menu_id: temp.menu_id,
            group_id: selectedid,
            add: "Y",
            edit: "Y",
            view: "Y",
            delete: "Y",
          };
        }
      });
      setLoad(true);
      setAllselected(true);
    }
  };

  return (
    <>
      {view === undefined ? (
        ""
      ) : (
        <>
          {view === false ? (
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
          ) : (
            <div className="sc_cl_div w-100 px-2">
              <div className="d-flex flex-column flex-lg-row sc_cl_row sc_cl_page_header">
                <div className="align-items-center col-12 col-lg-6 d-flex py-2 text-center">
                  <h5 className="sc_cl_head m-0">Menu Permisssions</h5>
                </div>

                <div className="align-items-center col-12 col-lg-6 d-flex justify-content-lg-end py-2 text-center">
                  <FnBreadCrumbComponent
                    seperator_symbol={" >"}
                    nav_items={breadcumb_menu}
                  />
                </div>
              </div>

              
              <div className="mt-lg-2 sc-cl-main-content">
                {createnewtab ? (
                  <>
                    <h5> Create a new group</h5>
                    <div className="col-12 col-lg-6 col-md-6 col-sm-12 d-inline-block pb-3">
                      <Form.Label className="sc_cl_label">Name: </Form.Label>
                      <Form.Control
                        className="w-75"
                        name="group_name"
                        type="text"
                        size="sm"
                        onChange={InputHandler}
                        placeholder="Enter a group name"
                      ></Form.Control>

                      <div>
                        <span className="sc_cl_span red">
                          {error && error.group_name}
                        </span>
                      </div>
                    </div>
                  </>
                ) : (
                  <>
                    <div className="col-12 col-lg-2 col-md-6 col-sm-12 d-inline-block">
                      <Form.Label className="sc_cl_label">Group</Form.Label>
                      <div className="d-flex">
                        <Form.Select
                          // value={formData[items.name]}
                          name="group_id"
                          onChange={(e) => fn_get_permisstion(e.target.value)}
                          size="sm"
                        >
                          {allgroup.length > 0 ? (
                            <>
                              <option hidden>Select Option</option>
                              {allgroup.map((temp) => (
                                <option key={temp.id} value={temp.id}>
                                  {temp.name}
                                </option>
                              ))}
                            </>
                          ) : (
                            <option hidden>No available groups</option>
                          )}
                        </Form.Select>
                      </div>
                      <span className="red">{error && error.group_id}</span>
                    </div>
                    <FnBtnComponent
                      onClick={fn_create_new_group}
                      children={"Create Group"}
                      classname={"sc_cl_submit_button ms-2"}
                    ></FnBtnComponent>
                  </>
                )}
              </div>

              {existpermissions.length >= 0 && (
                <>
                  <div className="sc_cl_row">
                  <label className="d-flex gap-2 m-2">
                <input
                  name="selectall"
                  type="checkbox"
                  className=""
                  checked={allselected ? true : null || ""}
                  onChange={SelectAll}
                // id='inline-checkbox-2'
                />
                Select All
              </label>
                 <div className="sc_cl_col mt-2 fixTableHead">
                      <Table className="sc_cl_table">
                        <thead>
                          <tr>
                            <th>Menu Name</th>
                            <th className="text-center">Add</th>
                            <th className="text-center">Edit</th>
                            <th className="text-center">View</th>
                            <th className="text-center">Delete</th>
                            </tr>
                        </thead>
                        <tbody>
                          {menus.map((temp) => (
                            <tr key={temp.menu_id}>
                              {temp.parent_menu_id !== 0 ? (
                                <>
                                  <td className="px-5">{temp.menu_name}</td>
                                  <td className="text-center">
                                      <input
                                        type="checkbox"
                                        name="add"
                                        className="sc_cl_input_checkbox"
                                        value={
                                          inputs[temp.menu_id] &&
                                          inputs[temp.menu_id].add === "Y"
                                            ? "N"
                                            : "Y"
                                        }
                                        checked={
                                          (inputs[temp.menu_id] &&
                                            (inputs[temp.menu_id].add === "Y"
                                              ? true
                                              : null)) ||
                                          ""
                                        }
                                        onChange={(e) =>
                                          InputHandler(e, temp.menu_id)
                                        }
                                        // disabled={
                                        //   temp.menu_id === excepteditdisablemenu ?true :false
                                        // }
                                      />
                                    </td>
                                    <td className="text-center">
                                      <input
                                        name="edit"
                                        type="checkbox"
                                        className=""
                                        checked={
                                          (inputs[temp.menu_id] &&
                                            (inputs[temp.menu_id].edit === "Y"
                                              ? true
                                              : null)) ||
                                          ""
                                        }
                                        value={
                                          inputs[temp.menu_id] &&
                                          inputs[temp.menu_id].edit === "Y"
                                            ? "N"
                                            : "Y"
                                        }
                                        onChange={(e) =>
                                          InputHandler(e, temp.menu_id)
                                        }
                                        disabled={
                                          temp.menu_id === excepteditdisablemenu
                                            ? true
                                            : false
                                        }
                                      />
                                    </td>
                                    <td className="text-center">
                                      <input
                                        name="view"
                                        type="checkbox"
                                        className=""
                                        checked={
                                          (inputs[temp.menu_id] &&
                                            (inputs[temp.menu_id].view === "Y"
                                              ? true
                                              : null)) ||
                                          ""
                                        }
                                        value={
                                          inputs[temp.menu_id] &&
                                          inputs[temp.menu_id].view === "Y"
                                            ? "N"
                                            : "Y"
                                        }
                                        onChange={(e) =>
                                          InputHandler(e, temp.menu_id)
                                        }
                                        disabled={
                                          temp.menu_id === excepteditdisablemenu
                                            ? true
                                            : false
                                        }
                                      />
                                    </td>
                                    <td className="text-center">
                                      <input
                                        name="delete"
                                        type="checkbox"
                                        className=""
                                        value={
                                          inputs[temp.menu_id] &&
                                          inputs[temp.menu_id].delete === "Y"
                                            ? "N"
                                            : "Y"
                                        }
                                        checked={
                                          (inputs[temp.menu_id] &&
                                            (inputs[temp.menu_id].delete === "Y"
                                              ? true
                                              : null)) ||
                                          ""
                                        }
                                        onChange={(e) =>
                                          InputHandler(e, temp.menu_id)
                                        }
                                        disabled={
                                          temp.menu_id === deletedisablemenu
                                            ? true
                                            : false ||
                                              temp.menu_id ===
                                                excepteditdisablemenu
                                            ? true
                                            : false
                                        }
                                      />
                                    </td>
                                </>
                              ) : (
                                <>
                                  <td>{temp.menu_name}</td>
                                  <td colSpan="4"></td>
                                </>
                              )}
                            </tr>
                          ))}
                        </tbody>
                      </Table>
                    </div>
                  </div>
                  <Row>
                    <Col className="col mt-2">
                      {existpermissions.length > 0 && !createnewtab ? (
                        <FnBtnComponent
                          children={"Update"}
                          onClick={fn_update_details}
                          classname={"sc_cl_submit_button"}
                        />
                      ) : (
                        <FnBtnComponent
                          children={"Submit"}
                          onClick={fn_submit_details}
                          classname={"sc_cl_submit_button"}
                        />
                      )}
                      <FnBtnComponent
                        children={"Back"}
                        onClick={() => navigator("/")}
                        classname={"sc_cl_close_button m-2"}
                      />
                    </Col>
                  </Row>
                </>
              )}
            </div>
          )}
        </>
      )}
    </>
  );
};

export default FnGroupAccessDefinitionForm;
