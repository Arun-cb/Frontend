import React, { useContext, useEffect, useState } from "react";
import AuthContext from "../context/AuthContext";
import PreContext from "../context/PreContext";
import Swal from "sweetalert2";
import FnBtnComponent from "../components/buttonComponent";
import FnTooltipComponent from "../components/tooltipComponent";
import FnFormComponent from "../components/formComponent";
import { useParams, useNavigate } from "react-router-dom";
import { PiUserCirclePlusBold, PiUserSwitchBold } from "react-icons/pi";

const FnUser = () => {
  let { authTokens, user } = useContext(AuthContext);
  const { id } = useParams();
  const navigator = useNavigate();

  // For Individual user acces includes admin
  const [adata, setAdata] = useState({
    created_by: user.user_id,
    last_updated_by: user.user_id,
  });

  const [newadata, setNewAdata] = useState({
    // user_status: true,
    created_by: user.user_id,
    last_updated_by: user.user_id,
  });

  // Admin level user update
  const [userdata, setUserdata] = useState({
    current_user: user.username,
    // created_by: user.user_id,
    // last_updated_by: user.user_id,
  });

  // For Admin access only data of all user details
  const [user_names, setUser_names] = useState([]);
  const [authgroup, setAuthGroup] = useState([]);
  const [helper, setHelper] = useState([]);

  const [profilepic, setProfilepic] = useState();
  const [previewURL, setPreviewURL] = useState("");
  const [error, setError] = useState({});

  const [action, setAction] = useState(false);
  const [add, setAdd] = useState(false);
  const [edit, setEdit] = useState(false);
  const [readonly, setReadOnly] = useState(false);
  const [admin, setAdmin] = useState(false);
  const [remove, setRemove] = useState(false);

  const [client_error_msg, Client_error_msg] = useState([]);

  const [warnings, setWarnings] = useState([]);

  let null_error_msg = warnings
    .filter(
      (items, index) =>
        items.error_code.includes("null") && items.error_from.includes("Client")
    )
    .map((data) => data.error_msg);

  let same_password_error_msg = warnings
    .filter(
      (items, index) =>
        items.error_code.includes("same password") && items.error_from.includes("Client")
    )
    .map((data) => data.error_msg);

  const userDetails = [
    {
      id: 1,
      name: "username",
      label: "User Name",
      placeholder: "Enter User Name",
      type: "text",
      maxlen: "100",
      ismandatory: "Y",
    },
    {
      id: 2,
      name: "first_name",
      label: "First Name",
      placeholder: "Enter First Name",
      type: "text",
      maxlen: "100",
      ismandatory: "N",
    },
    {
      id: 3,
      name: "last_name",
      label: "Last Name",
      placeholder: "Enter Last Name",
      type: "text",
      maxlen: "100",
      ismandatory: "N",
    },
    {
      id: 4,
      name: "email",
      label: "Email",
      placeholder: "Enter Email",
      type: "email",
      maxlen: "100",
      ismandatory: "Y",
    },
    {
      id: 5,
      name: "temporary_address",
      label: "Temporary Address",
      placeholder: "Enter Temporary Address",
      type: "textarea",
      maxlen: "300",
      ismandatory: "N",
    },
    {
      id: 6,
      name: "permanent_address",
      label: "Permanent Address",
      placeholder: "Enter Permanent Address",
      type: "textarea",
      maxlen: "300",
      ismandatory: "N",
    },
    {
      id: 7,
      name: "contact",
      label: "Contact",
      placeholder: "Enter Contact Number",
      type: "number",
      maxlen: "10",
      ismandatory: "N",
      minva: "0",
    },
    {
      id: 8,
      name: "user_group",
      label: "User Group",
      type: "select",
      ismandatory: "Y",
    },
    {
      id: 9,
      name: "user_status",
      label: "User Status",
      type: "switch",
      ismandatory: "Y",
    },
  ];

  const newuserDetails = [
    {
      id: 1,
      name: "username",
      label: "User Name",
      placeholder: "Enter User Name",
      type: "text",
      maxlen: "100",
      ismandatory: "Y",
    },
    {
      id: 2,
      name: "password",
      label: "Password",
      placeholder: "Enter Password",
      type: "password",
      maxlen: "15",
      ismandatory: "Y",
    },
    {
      id: 3,
      name: "confirmpassword",
      label: "Confirm Password",
      placeholder: "Enter Confirm Password",
      type: "password",
      maxlen: "15",
      ismandatory: "Y",
    },
    {
      id: 4,
      name: "email",
      label: "Email",
      placeholder: "Enter Email",
      type: "email",
      maxlen: "100",
      ismandatory: "Y",
    },
    {
      id: 5,
      name: "user_group",
      label: "User Group",
      type: "select",
      ismandatory: "Y",
    },
  ];

  const userDetails_admin = [
    {
      id: 1,
      name: "current_user",
      label: "Current User",
      type: "select",
    },
  ];

  let selectedData_admin = {
    current_user: user_names.map((items, index) => ({
      value: items.username,
      label: items.username,
    })),
  };

  let selectedData = {
    user_group: authgroup.map((items, index) => ({
      // value: index + 1,
      value: items.id,
      label: items.name,
    })),
  };

  // Function To Trigger when Create User is clicked
  const fnCreateUser = async () => {
    setAction(false);
    // setEdit(!edit);
    setReadOnly(!readonly);
    setProfilepic();
    setNewAdata({
      username: "",
      first_name: "",
      last_name: "",
      email: "",
      temporary_address: "",
      permanent_address: "",
      contact: "",
      user_group: "",
      user_status: true,
      password: "",
      confirmpassword: "",
      created_by: user.user_id,
      last_updated_by: user.user_id,
    })
    // setAdata({
    //   username: "",
    //   first_name: "",
    //   last_name: "",
    //   email: "",
    //   temporary_address: "",
    //   permanent_address: "",
    //   contact: "",
    //   user_group: "",
    //   user_status: true,
    //   password: "",
    //   confirmpassword: "",
    //   created_by: user.user_id,
    //   last_updated_by: user.user_id,
    // });
  };

  // Function To Trigger when Edit User is clicked
  const fnEditEnable = async () => {
    // setEdit(!edit);
    setReadOnly(!readonly);
  };

  const fnSubmitValidation = () => {
    var keys = Object.keys(newadata);
    let upd_keys = keys.map((element) => element.replace(/_/g, " "));
    let error = {};

    if (newadata.username == "") {
      error.username = null_error_msg[0].replace("%1", upd_keys[0]);
    }

    if (newadata.email == "") {
      error.email = null_error_msg[0].replace("%1", upd_keys[3]);
    }

    if (newadata.password == "") {
      error.password = null_error_msg[0].replace("%1", upd_keys[9]);
    }
    if (newadata.confirmpassword == "") {
      error.confirmpassword = null_error_msg[0].replace("%1", upd_keys[10]);
    }

    if (
      newadata.confirmpassword !== newadata.password &&
      newadata.confirmpassword &&
      newadata.password
    ) {
      error.confirmpassword = same_password_error_msg[0].replace("%1", upd_keys[9]).replace("%2", upd_keys[10]);
    }

    if (newadata.user_group == "") {
      error.user_group = null_error_msg[0].replace("%1", upd_keys[7]);
    }

    if (Object.keys(error).length == 0) {
      setError(error);
      fnSubmitDetails();
    } else {
      setError(error);
    }
  };

  const fnUpdateValidation = () => {
    var keys = Object.keys(adata);
    let upd_keys = keys.map((element) => element.replace(/_/g, " "));
    let error = {};

    if (adata.username == "") {
      error.username = null_error_msg[0].replace("%1", upd_keys[0]);
    }

    if (adata.email == "") {
      error.email = null_error_msg[0].replace("%1", upd_keys[3]);
    }

    if (adata.password == "") {
      error.password = null_error_msg[0].replace("%1", upd_keys[9]);
    }
    if (adata.confirmpassword == "") {
      error.confirmpassword = null_error_msg[0].replace("%1", upd_keys[10]);
    }

    if (
      adata.confirmpassword !== adata.password &&
      adata.confirmpassword &&
      adata.password
    ) {
      error.confirmpassword = same_password_error_msg[0].replace("%1", upd_keys[9]).replace("%2", upd_keys[10]);
    }

    if (adata.user_group == "") {
      error.user_group = null_error_msg[0].replace("%1", upd_keys[7]);
    }

    if (Object.keys(error).length == 0) {
      setError(error);
      fnUpdateDetails();
    } else {
      setError(error);
    }
  };

  const fnGetWarnings = async () => {
    let res_warnings = await fetch(
      `${process.env.REACT_APP_SERVER_URL}/api/get_warnings`,
      {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          Authorization: "Bearer " + String(authTokens.access),
        },
      }
    );

    let warning_data = await res_warnings.json();
    if (res_warnings.status === 200) {
      if (warning_data) {
        setWarnings(warning_data);
      }
    }
  };

  //  Function for Inserting user details on auth_user, user_group, user_profile
  const fnSubmitDetails = async () => {
    // API call to Insert User Details in auth_user Table
    let ins_auth_user_res = await fetch(
      `${process.env.REACT_APP_SERVER_URL}/api/createuser`,
      {
        method: "POST",
        body: JSON.stringify(newadata),
        headers: {
          "Content-Type": "application/json",
          Authorization: "Bearer " + String(authTokens.access),
        },
      }
    );
    let ins_auth_user_data = await ins_auth_user_res.json();
    if (ins_auth_user_res.status === 200) {
      // Function call to get the Inserted User id and make relationship between auth_user and user_group Tables
      fnGetUserIdDetails().then(async (foundResult) => {
        let json_data = {
          user_id: foundResult,
          group_id: newadata.user_group,
        };
        // API call to Insert User Group Details in user_group Table
        let ins_usergroup_res = await fetch(
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
        let ins_user_group_data = await ins_usergroup_res.json();
        // });
        if (ins_usergroup_res.status === 200) {
          // Function call to get the Inserted User id and make relationship between auth_user and user_group and user_profile Tables
          fnGetUserIdDetails().then(async (foundResult) => {
            const uploadData = new FormData();
            uploadData.append("user_id", foundResult);
            if (profilepic) {
              uploadData.append("profile_pic", profilepic); // Append the profilepic only if it's provided
            }
            uploadData.append("username", newadata.username);
            uploadData.append("first_name", "");
            uploadData.append("last_name", "");
            uploadData.append("email", newadata.email);
            uploadData.append("temporary_address", "");
            uploadData.append("permanent_address", "");
            uploadData.append("contact", "");
            uploadData.append("user_group", newadata.user_group);
            uploadData.append("user_status", true);
            uploadData.append("created_by", user.user_id);
            uploadData.append("last_updated_by", user.user_id);
            // API call to Insert User Group Details in user_group Table
            let ins_user_profile_res = await fetch(
              `${process.env.REACT_APP_SERVER_URL}/api/ins_user_profile`,
              {
                method: "POST",
                body: uploadData, //? Directly passing FormData No need for JSON.stringify(uploadData)
                headers: {
                  // "Content-Type": "application/json",   // ? No need for Content-Type since passing FormData as a Json Object
                  Authorization: "Bearer " + String(authTokens.access),
                },
              }
            );
            let ins_user_profile_data = await ins_user_profile_res.json();
            if (ins_user_profile_res.status === 201) {
              Swal.fire({
                icon: "success",
                text: "User Created successfully!",
              });
            } else {
              Swal.fire({
                icon: "error",
                text: "Error!",
              });
            }
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

  // Function to get the Inserted User id and make relationship between auth_user and user_group and user_profile Tables
  const fnGetUserIdDetails = async () => {
    // API call to Get User ID in auth_user Table
    let get_userid_res = await fetch(
      `${process.env.REACT_APP_SERVER_URL}/api/getempregdetails`,
      {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          Authorization: "Bearer " + String(authTokens.access),
        },
      }
    );
    let get_userid_data = await get_userid_res.json();

    if (get_userid_res.status === 200) {
      return get_userid_data[get_userid_data.length - 1].id;
    }
  };

  //  Function for Updating user details on auth_user, user_group, user_profile
  const fnUpdateDetails = async () => {
    let auth_user_group_update = {
      id: adata.user_id,
      username: adata.username,
      email: adata.email,
      group: adata.user_group,
      is_active: adata.user_status,
    };
    let res1 = await fetch(
      `${process.env.REACT_APP_SERVER_URL}/api/upd_user_groups`,
      {
        method: "PUT",
        body: JSON.stringify(auth_user_group_update),
        headers: {
          "Content-Type": "application/json",
          Authorization: "Bearer " + String(authTokens.access),
        },
      }
    );
    let data1 = await res1.json();
    if (res1.status === 200) {
      const uploadData = new FormData();
    uploadData.append("user_id", adata.user_id);
    uploadData.append("profile_pic", profilepic);
    uploadData.append("username", adata.username);
    uploadData.append("first_name", adata.first_name);
    uploadData.append("last_name", adata.last_name);
    uploadData.append("email", adata.email);
    uploadData.append("temporary_address", adata.temporary_address);
    uploadData.append("permanent_address", adata.permanent_address);
    uploadData.append("contact", adata.contact);
    uploadData.append("user_group", adata.user_group);
    uploadData.append("user_status", adata.user_status);
    uploadData.append("created_by", user.user_id);
    uploadData.append("last_updated_by", user.user_id);
    let res = await fetch(
      `${process.env.REACT_APP_SERVER_URL}/api/upd_user_profile/${adata.id}/`,
      {
        method: "PUT",
        body: uploadData,
        headers: {
          // "Content-Type": "application/json",
          Authorization: "Bearer " + String(authTokens.access),
        },
      }
    );
    let data = await res.json();
    if (res.status === 200) {
      Swal.fire({
        icon: "success",
        text: "Updated Successfully!",
      }).then(function () {
        // close(false);
      });
    } else {
      setError(data);
    }
    } else {
      if (data1 === "User already exist") {
        Swal.fire({
          icon: "error",
          text: "User already exist!",
        });
      }
      setError(data1);
    }
  };

  //  Function for Handling OnChange Input Events
  const fnInputHandler = (name, value, e) => {
    if (
      name &&
      name.target &&
      name.target.files &&
      name.target.files != undefined
    ) {
      const file = name.target.files[0];
      if (file && file.size > 1048576) {
        // ? 1MB = 1048576 bytes
        setError({
          ...error,
          [name.target.name]: "File size should be less than 1MB",
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
          [name.target.name]:
            "Please select an image file (eg : JPEG, PNG etc...)",
        });
        return;
      }

      setProfilepic(file);

      const reader = new FileReader();

      reader.onloadend = () => {
        setPreviewURL(reader.result);
      };

      if (file) {
        // Read the file as a data URL
        reader.readAsDataURL(file);
      }
      setAdata((prevState) => ({
        ...prevState,
        [name.target.name]: name.target.value,
      }));
    }

    setAdata((prevState) => ({
      ...prevState,
      [name]: value,
    }));

    const errors = { ...error };
    setError(errors);
  };

  //  Function for Handling OnChange Input Events
  const fnInputHandler2 = (name, value) => {
    setUserdata((prevState) => ({
      ...prevState,
      [name]: value,
    }));

    let filtered_data = user_names
      .filter((data) => data.username === value)
      .map((data) => data)[0];
    setAdata(filtered_data);
    setProfilepic(
      filtered_data && filtered_data.profile_pic
        ? filtered_data.profile_pic.replace(/^.*[\\\/]/, "")
        : ""
    );

    const errors = { ...error };
    setError(errors);
  };

  //  Function for Handling OnChange Input Events
  const fnInputHandler1 = (name, value, e) => {
    if (
      name &&
      name.target &&
      name.target.files &&
      name.target.files != undefined
    ) {
      const file = name.target.files[0];
      if (file && file.size > 1048576) {
        // ? 1MB = 1048576 bytes
        setError({
          ...error,
          [name.target.name]: "File size should be less than 1MB",
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
          [name.target.name]:
            "Please select an image file (eg : JPEG, PNG etc...)",
        });
        return;
      }

      setProfilepic(file);

      const reader = new FileReader();

      reader.onloadend = () => {
        setPreviewURL(reader.result);
      };

      if (file) {
        // Read the file as a data URL
        reader.readAsDataURL(file);
      }
      setNewAdata((prevState) => ({
        ...prevState,
        [name.target.name]: name.target.value,
      }));
    }

    setNewAdata((prevState) => ({
      ...prevState,
      [name]: value,
    }));

    const errors = { ...error };
    setError(errors);
  };


  if (adata.last_updated_by !== user.user_id) {
    setAdata({ ...adata, last_updated_by: user.user_id });
  }

  //  Function for Get Group level Permissions
  const fnGetPermissions = async () => {
    // API call to Get Arc level User Group Permissions
    let get_permission_res = await fetch(
      `${process.env.REACT_APP_SERVER_URL}/api/join_user_group_access/${user.user_id}/${id}/`,
      {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          Authorization: "Bearer " + String(authTokens.access),
        },
      }
    );
    let get_permission_data = await get_permission_res.json();
    if (get_permission_res.status === 200) {
      if (get_permission_data.length > 0) {
        let pdata = { ...get_permission_data };
        setRemove(pdata[0].delete === "Y" ? true : false);
        setEdit(pdata[0].edit === "Y" ? true : false);
        setAdd(pdata[0].add === "Y" ? true : false);
      }
    }
  };

  const fnGetDetails = async () => {
    // API call to Get Individual user details
    let get_individual_user_res = await fetch(
      `${process.env.REACT_APP_SERVER_URL}/api/get_user_profile/${user.user_id}`,
      {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          Authorization: "Bearer " + String(authTokens.access),
        },
      }
    );
    let get_individual_user_data = await get_individual_user_res.json();
    if (get_individual_user_res.status === 200) {
      if (get_individual_user_data.length > 0) {
        setAdata(get_individual_user_data[0]);
        setProfilepic(
          get_individual_user_data && get_individual_user_data[0].profile_pic
            ? get_individual_user_data[0].profile_pic.replace(/^.*[\\\/]/, "")
            : ""
        );
        setAction(true);
        setReadOnly(true);
        setAdmin(get_individual_user_data[0].user_group === "1")
      }
    }

    // API call to Get All user details for admin level access
    let get_all_user_res = await fetch(
      `${process.env.REACT_APP_SERVER_URL}/api/get_user_profile`,
      {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          Authorization: "Bearer " + String(authTokens.access),
        },
      }
    );
    let get_all_user_data = await get_all_user_res.json();
    if (get_all_user_res.status === 200) {
      if (get_all_user_data.length > 0) {
        setUser_names(get_all_user_data);
        setAction(true);
        setReadOnly(true);
      }
    }
    // API call To set option for user group
    let get_auth_group_res = await fetch(
      `${process.env.REACT_APP_SERVER_URL}/api/get_auth_group`,
      {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          Authorization: "Bearer " + String(authTokens.access),
        },
      }
    );
    let get_auth_group_data = await get_auth_group_res.json();
    if (get_auth_group_res.status === 200) {
      setAuthGroup(get_auth_group_data);
    }

    // to get tooltip dataset
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
    fnGetWarnings();
    fnGetPermissions();
    fnGetDetails();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []); //imageUrl

  const openActiveTab = () => {
    setAction(!action);
    // setAdata()
    // setEdit(!edit);
    setReadOnly(!readonly);
    setProfilepic(adata.profile_pic.replace(/^.*[\\\/]/, ""));
    setError();
  };

  let user_profile_tooltip = helper.filter(item => item.label !== "Current User");

  let current_user_tooltip = helper.filter(data => data.label == "Current User").map(data => data);

  return (
    <div className="">
      <div className="sc_cl_div d-flex col-12 border-bottom mb-3">
        <div className="d-flex col-6 align-items-center">
          {previewURL ? (
            <img
              src={previewURL}
              alt="Preview"
              width="100px"
              className="border border-opacity-50 border-primary justify-content-middle m-2"
            />
          ) : (
            <img
              src={
                profilepic
                  ? "/Assets/master/" + profilepic
                  : "/Assets/gray-user-profile-icon.png"
              }
              alt="Choose your Image"
              className="border border-opacity-50 border-primary justify-content-middle m-2"
              width="100px"
              height="100px"
            />
          )}
          <label
            htmlFor="inputTag"
            className={`sc_cl_submit_button ${!readonly ? "" : "d-none"}`} //edit //!edit
          >
            {profilepic ? "Change" : "Upload"}
            <input
              type="file"
              accept="image/*"
              id="inputTag"
              name="profile_pic"
              className="sc_cl_input d-none"
              onChange={action ? fnInputHandler : fnInputHandler1}
            />
          </label>
          <span className="sc_cl_span red">{error && error.profile_pic}</span>
          <FnTooltipComponent
            label={helper
              .filter((user) => user.context_order === 10)
              .map((use) => use.label)}
            context={helper
              .filter((user) => user.context_order === 10)
              .map((use) => use.help_context)}
            classname={""}
            placement="bottom"
          />
        </div>
        {action && admin && (
          <div className="d-flex col-6 justify-content-end align-items-center">
            <FnFormComponent
              fields={userDetails_admin}
              select={selectedData_admin}
              formData={userdata}
              tooltipvalue={current_user_tooltip}
              // errorcode={error}
              disablevalue={readonly} // "!edit" //edit
              onchange={fnInputHandler2}
              stylename={"sc_cl_input"}
            // client_error_msg={client_error_msg}
            />
          </div>
        )}
      </div>

      <FnFormComponent
        fields={action ? userDetails : newuserDetails}
        select={selectedData}
        formData={action ? adata : newadata}
        tooltipvalue={user_profile_tooltip}
        errorcode={error}
        disablevalue={readonly} // "!edit" //edit
        onchange={action ? fnInputHandler : fnInputHandler1}
        stylename={"sc_cl_input"}
      // client_error_msg={client_error_msg}
      />

      <div className="py-2 d-flex col-12 flex-column flex-lg-row sc_cl_row">
        <div className="align-items-end col-6 d-flex">
          {action ? (
            <>
              <FnBtnComponent
                onClick={fnUpdateValidation}
                classname={`${!readonly ? "" : "d-none"} sc_cl_submit_button`} // edit //!edit //!readonly
                children={"Update"}
              />
              <FnBtnComponent
                children={"Back"}
                onClick={() => setReadOnly(!readonly)}//setEdit(!edit) } //() => navigator("/") //!edit //!readonly
                classname={`${!readonly ? "" : "d-none"} sc_cl_close_button ms-2`} //!edit //!readonly
              />
            </>
          ) : (
            <>
              <FnBtnComponent
                onClick={fnSubmitValidation} //fnSubmitDetails
                classname={`${add ? "" : "d-none" //add && !readonly
                  } sc_cl_submit_button`} //!edit
                children={"Submit"}
              />
              <FnBtnComponent
                children={"Back"}
                onClick={() => openActiveTab()} //() => navigator("/")
                classname={`${add ? "" : "d-none" //add && !readonly
                  } sc_cl_close_button ms-2`} //!edit
              />
            </>
          )}
        </div>
        <div className="d-flex col-6 justify-content-end">
          {add && (
            <>
              <div
                className={`${readonly ? "" : "d-none"
                  } d-flex flex-column justify-content-center align-items-center active-tab`} //edit
              >
                <div className="child-icon">
                  {<PiUserCirclePlusBold size={25} onClick={fnCreateUser} />}
                </div>
                <div className="mt-1 small child-label">{"Create User"}</div>
              </div>
            </>
          )}
          {edit && ( //edit
            <div
              className={`${readonly ? "" : "d-none"
                } d-flex flex-column justify-content-center align-items-center active-tab ms-2`} //edit
            >
              <div className="child-icon">
                {<PiUserSwitchBold size={25} onClick={fnEditEnable} />}
              </div>
              <div className="mt-1 small child-label">{"Edit User"}</div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default FnUser;
