import React, { useContext, useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import AuthContext from "../context/AuthContext";
import Swal from "sweetalert2";
import { Button } from "react-bootstrap";
import { Col, Row, Container, Table } from "react-bootstrap";
import FnBreadCrumbComponent from "../components/breadCrumbComponent";
import FnBtnComponent from "../components/buttonComponent";

function CreateUser({ data, close, viewvalue, diverts, setdiverts }) {
  let { authTokens, logoutUser, user } = useContext(AuthContext);
  const [authdata, setAuthdata] = useState([]);
  const [userid, setUserid] = useState({});
  const [user_group, setUser_group] = useState({ user_id: "", group_id: "" });
  const { id } = useParams();
  let a = [data];
  const [action, setAction] = useState(false);

  const [input, setInput] = useState({});

  const [error, setError] = useState({
    username: "",
    email: "",
    password: "",
    confirmPassword: "",
    group: "",
  });

  let breadcumb_menu = [
    { Label: "Home", Link: "/" },

    {
      Label: "Create User Report",
      Link: `/CreateUser_Report/${id}`,
    },

    { Label: "Create User Form" },
  ];

  const [isToggled, setIsToggled] = useState(false);

  function handleClick() {
    setIsToggled(!isToggled);
    setInput({ ...input, is_active: !isToggled });
  }

  const get_userid_details = async () => {
    let userid_res = await fetch(
      `${process.env.REACT_APP_SERVER_URL}/api/getempregdetails`,
      {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          Authorization: "Bearer " + String(authTokens.access),
        },
      }
    );
    let userid_data = await userid_res.json();

    if (userid_res.status === 200) {
      setUserid(userid_data);
      return userid_data[userid_data.length - 1].id;
    }
  };

  // console.log(userid)

  const auth_group_details = async () => {
    let auth_res = await fetch(
      `${process.env.REACT_APP_SERVER_URL}/api/get_auth_group`,
      {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          Authorization: "Bearer " + String(authTokens.access),
        },
      }
    );
    let group_data = await auth_res.json();
    if (auth_res.status === 200) {
      setAuthdata(group_data);
    }
  };

  const validation_of_input = () => {
    let error = {};

    if (!input.username) {
      error.username = "Please enter Username.";
    }

    if (!input.email) {
      error.email = "Please enter Email.";
    }

    if (!input.password) {
      error.password = "Please enter Password.";
    }
    if (!input.confirmPassword) {
      error.confirmPassword = "Please enter Confirm Password.";
    }

    if (
      input.confirmPassword !== input.password &&
      input.confirmPassword &&
      input.password
    ) {
      error.confirmPassword = "Password and confirm password should be same.";
    }

    if (!input.group) {
      error.group = "Please select group.";
    }

    if (Object.keys(error).length == 0) {
      setError(error);
      CreateUserSubmit();
    } else {
      setError(error);
    }
  };

  const handleUserInput = (e) => {
    const { name, value } = e.target;
    setInput((prev) => ({
      ...prev,
      [name]: value,
    }));
    setUser_group({ ...user_group, group_id: Number(e.target.value) });
  };

  const CreateUserSubmit = async () => {
    let res = await fetch(
      `${process.env.REACT_APP_SERVER_URL}/api/createuser`,
      {
        method: "POST",
        body: JSON.stringify(input),
        headers: {
          "Content-Type": "application/json",
          Authorization: "Bearer " + String(authTokens.access),
        },
      }
    );
    let data = await res.json();

    if (res.status === 200) {
      get_userid_details().then(async (foundResult) => {
        let json_data = {
          user_id: foundResult,
          group_id: input.group,
        };
        console.log("user", json_data);
        let usergroup_res = await fetch(
          `${process.env.REACT_APP_SERVER_URL}/api/ins_user_groups`,
          {
            method: "POST",
            body: JSON.stringify(json_data),
            headers: {
              "Content-Type": "application/json",
              Authorization: "Bearer " + String(authTokens.access),
            },
          }
        );
        let user_group_data = await usergroup_res.json();

        if (usergroup_res.status === 200) {
          Swal.fire({
            icon: "success",
            text: "User Added successfully!",
          });
        }
      });
    } else {
      Swal.fire({
        icon: "error",
        text: "User already exist!",
      });
    }
  };

  const user_update = async () => {
    let res = await fetch(
      `${process.env.REACT_APP_SERVER_URL}/api/upd_user_groups`,
      {
        method: "PUT",
        body: JSON.stringify(input),
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
        title: "Updated",
        text: "Updated Successfully!",
      }).then(function () {
        close(false);
      });
    } else {
      if (data === "User already exist") {
        Swal.fire({
          icon: "error",
          text: "User already exist!",
        });
      }
      setError(data);
    }
  };

  // useEffect(() => {
  //   auth_group_details();
  //   get_userid_details();
  //   if (diverts === true) {
  //     const newdata = a.map(
  //       ({ id, username, email, name, created_by, last_updated_by }) => ({
  //         id,
  //         username,
  //         email,
  //         name,
  //         created_by,
  //         last_updated_by,
  //       })
  //     );
  //     setInput(...newdata);
  //     setAction(true);
  //     setdiverts(false);
  //   }
  // }, [action]);

  useEffect(() => {
    if (data) {
      setInput({
        id: data.user_id,
        username: data.user_name,
        email: data.user_mail,
        group: data.user_group_id,
        is_active: data.is_active,
      });
      setAction(true);
      setIsToggled(data.is_active === "Yes" ? true : false);
    }
    auth_group_details();
    get_userid_details();
  }, []);

  return (
    <div className="sc_cl_div">
      {/* <div className="d-flex flex-column flex-lg-row sc_cl_row">
        <div className="align-items-center col-12 col-lg-6 d-flex py-2 text-center">
          <h5 className="sc_cl_head m-0">User Details</h5>
        </div>

        <div className="align-items-center col-12 col-lg-6 d-flex justify-content-lg-end py-2 text-center">
          <FnBreadCrumbComponent seperator_symbol={" >"} nav_items={breadcumb_menu} clickevent={() => close(false)} />
        </div>
      </div>

      <hr></hr> */}

      {/* <h5 className="text-center">Create New User</h5> */}
      <table className="table table-bordered mt-3">
        <tbody>
          <tr>
            <th scope="row">Username</th>
            <td>
              <input
                type="text"
                name="username"
                className="form-control"
                placeholder="Enter Username"
                value={input.username}
                onChange={handleUserInput}
              />
              <p className="sc_cl_user_err">{error.username}</p>
            </td>
          </tr>
          <tr>
            <th scope="row">Email</th>
            <td>
              <input
                type="text"
                name="email"
                className="form-control"
                placeholder="Enter Email"
                value={input.email}
                onChange={handleUserInput}
              />
              <p className="sc_cl_user_err">{error.email}</p>
            </td>
          </tr>
          <tr className={`sc_cl_tr ${data ? "d-none" : ""}`}>
            <th scope="row">Password </th>
            <td>
              <input
                type="password"
                name="password"
                className="form-control"
                placeholder="Enter Password"
                value={input.password}
                onChange={handleUserInput}
              />
              <p className="sc_cl_user_err">{error.password}</p>
            </td>
          </tr>
          <tr className={`sc_cl_tr ${data ? "d-none" : ""}`}>
            <th scope="row">Confirm Password </th>
            <td>
              <input
                type="password"
                name="confirmPassword"
                className="form-control"
                placeholder="Enter Confirm Password"
                value={input.confirmPassword}
                onChange={handleUserInput}
              />
              <p className="sc_cl_user_err">{error.confirmPassword}</p>
            </td>
          </tr>
          <tr>
            <th scope="row">User Groups</th>
            <td>
              <select
                name="group"
                value={input.group}
                onChange={handleUserInput}
              >
                <option hidden>Select Group</option>
                {authdata.map((item) => {
                  return (
                    <option key={item.name} value={item.id}>
                      {item.name}
                    </option>
                  );
                })}
              </select>
              <p className="sc_cl_user_err">{error.group}</p>
            </td>
          </tr>
          <tr className={`sc_cl_tr ${data ? "" : "d-none"}`}>
            <th scope="row">User active</th>
            <td>
              {/* <FnBtnComponent children={"Submit"} onClick={handleClick} classname={"sc_cl_submit_button"}/> */}
              <Button
                variant={isToggled ? "success" : "danger"}
                onClick={handleClick}
              >
                {isToggled ? "Yes" : "No"}
              </Button>
            </td>
            {console.log(input.is_active)}
          </tr>
          <tr>
            <th scope="row">
              {action ? (
                <FnBtnComponent onClick={user_update} children={"Update"} classname={"sc_cl_submit_button"} />

              ) : (
                <FnBtnComponent onClick={validation_of_input} children={"Submit"} classname={"sc_cl_submit_button"} />

              )}
              {
                <FnBtnComponent onClick={() => close(false)} children={"Back"} classname={"sc_cl_close_button m-2"} />

              }
            </th>
            {/* <td></td> */}
          </tr>
        </tbody>
      </table>
    </div>
  );
}

export default CreateUser;
