/* ============================================================================================================================================================

   CITTABASE SOLUTIONS - All Rights Reserved.
   ------------------------------------------------------------------------------------------------------------------------------------------------------------

   03-Aug-2022   Arun R      Initial Version             V1

   ** This Page is to define Forgot Password   **

============================================================================================================================================================*/

import React, { useContext, useState, useEffect } from "react";
import {
  Col,
  Container,
  Form,
  FormGroup,
  InputGroup,
  Row,
  Modal,
} from "react-bootstrap";
import AuthContext from "../context/AuthContext";
import { FaUserTie, FaLock } from "react-icons/fa";
import { VscEye, VscEyeClosed } from "react-icons/vsc";
import { TiVendorMicrosoft } from "react-icons/ti";
import FnBtnComponent from "../components/buttonComponent";
import Swal from "sweetalert2";
// ! test
import { config } from "../Config";
import { PublicClientApplication } from "@azure/msal-browser";
import CryptoJS from "crypto-js";
import cittabase_logo from '../Assets/Images/cittabase_logo.png'

const Login = () => {
  let { authTokens, loginUser } = useContext(AuthContext);
  const [checksmtp, setCheckSmtp] = useState(false);
  const [passwordType, setPasswordType] = useState("password");
  const [passwordInput, setPasswordInput] = useState("");

  const handlePasswordChange = (evnt) => {
    setPasswordInput(evnt.target.value);
  };
  // ! test
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [input, setInput] = useState({});
  const [checksso, setCheckSso] = useState(false);
  const [ssoappid, setAppid] = useState();
  const [ssotenantid, setTenantid] = useState();

  const fnCheckSMTP = async () => {
    let res = await fetch(`${process.env.REACT_APP_SERVER_URL}/api/get_smtp`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
      },
    });
    let data = await res.json();
    if (res.status === 200) {
      if (data.length === 1) {
        setCheckSmtp(true);
      }
    }

    let sso_res = await fetch(`${process.env.REACT_APP_SERVER_URL}/api/get_sso`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
      },
    });
    let sso_data = await sso_res.json();
    if (sso_res.status === 200) {
      if (sso_data.length === 1) {
        setCheckSso(true);
        const decryptapp = CryptoJS.AES.decrypt(sso_data[0].app_id, process.env.REACT_APP_SECRET_KEY);
        const decryptedAppId = JSON.parse(decryptapp.toString(CryptoJS.enc.Utf8));
        const decrypttenant = CryptoJS.AES.decrypt(sso_data[0].tenant_id, process.env.REACT_APP_SECRET_KEY);
        const decryptedTenantId = JSON.parse(decrypttenant.toString(CryptoJS.enc.Utf8));
        setAppid(decryptedAppId);
        setTenantid(decryptedTenantId);
      }
    }

  };

  const fnForgotPassword = async () => {
    if (checksmtp) {
      const { value: getEmail } = await Swal.fire({
        title: "Forgot Your Password?",
        width: 700,
        input: "email",
        inputLabel:
          "Enter your registered email address. We will send you new password.",
        inputPlaceholder: "Enter your email address",
        showCancelButton: true,
        confirmButtonText: "Retrieve Password",
        allowOutsideClick: false,
      });

      if (getEmail) {
        Swal.fire({
          title: "Please Wait!",
          html: "Sending your password", // add html attribute if you want or remove
          allowOutsideClick: false,
          onBeforeOpen: () => {
            Swal.showLoading();
          },
        });
        let res = await fetch(
          `${process.env.REACT_APP_SERVER_URL}/api/forgot_password`,
          {
            method: "POST",
            body: JSON.stringify(getEmail),
            headers: {
              "Content-Type": "application/json",
            },
          }
        );
        if (res.status === 200) {
          Swal.fire({
            icon: "success",
            text: "Your password has been successfully reset and a confirmation has been sent to your e-mail address.",
          });
        } else {
          Swal.fire({
            icon: "error",
            text: "There is no account registered to this e-mail",
          });
        }
      }
    } else {
      Swal.fire({
        icon: "error",
        title: "Oops...",
        text: "SMPT are not configured. You're not able to change password. Please contact your's HR/Admin",
      });
    }
  };
  useEffect(() => {
    // fnCheckSMTP();
  }, []);

  const togglePassword = () => {
    if (passwordType === "password") {
      setPasswordType("text");
      return;
    }
    setPasswordType("password");
  };

  const login = async () => {

    const { appId, redirectUrl, scopes, authority } = await config(
      ssoappid,
      ssotenantid
    );

    let name, mail;

    const publicClientApplication = new PublicClientApplication({
      auth: {
        clientId: appId,
        redirectUrl: redirectUrl,
        authority: authority,
      },
      cache: {
        cacheLocation: "sessionStorage",
        storeAuthStateInCookie: true,
      },
    });

    try {
      const response = await publicClientApplication.loginPopup({
        scopes: scopes,
        prompt: "select_account",
      });

      setIsAuthenticated(true);

      const account = response.account;
      name = account.name;
      mail = account.username;
      setInput({
        username: account.name,
        email: account.username,
        group: 3,
        password: "demo",
        confirmPassword: "demo",
        is_staff: 0,
      });
    } catch (err) {
      setIsAuthenticated(false);
    }

    // ? Get and check API for SSO

    let get_auth_group = await fetch(
      `${process.env.REACT_APP_SERVER_URL}/api/get_user_groups`,
      {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
        },
      }
    );
    let get_auth_group_data = await get_auth_group.json();

    if (get_auth_group.status === 200) {

      if (get_auth_group_data.filter(data => data.user_name === name).length > 0) {
        // if SSO User already exist redirect him to login
        loginUser("e", {
          username: name,
          email: mail,
          group: 3,
          password: "demo",
          confirmPassword: "demo",
          is_staff: 0,
        })
      }
      else {
        //  if SSO User is new add him to auth_group and provide viewer access in user_group by default and redirect him to login
        let res = await fetch(
          `${process.env.REACT_APP_SERVER_URL}/api/createmsuser`,
          {
            method: "POST",
            body: JSON.stringify({
              username: name,
              email: mail,
              group: 3,
              password: "demo",
              confirmPassword: "demo",
              is_staff: 0,
            }),
            headers: {
              "Content-Type": "application/json",
            },
          }
        );
        let data = await res.json();

        if (res.status === 200) {
          get_userid_details().then(async (foundResult) => {
            let json_data = {
              user_id: foundResult,
              group_id: 3,
            };
            let usergroup_res = await fetch(
              `${process.env.REACT_APP_SERVER_URL}/api/ms_ins_user_groups`,
              {
                method: "POST",
                body: JSON.stringify(json_data),
                headers: {
                  "Content-Type": "application/json",
                },
              }
            );
            let user_group_data = await usergroup_res.json();

            if (usergroup_res.status === 200) {
              get_userid_details().then(async (foundResult) => {
                const uploadData = new FormData();
            uploadData.append("user_id", foundResult);
            uploadData.append("username", name);
            uploadData.append("first_name", "");
            uploadData.append("last_name", "");
            uploadData.append("email", mail);
            uploadData.append("temporary_address", "");
            uploadData.append("permanent_address", "");
            uploadData.append("contact", "");
            uploadData.append("user_group", 3);
            uploadData.append("user_status", true);
            uploadData.append("created_by", foundResult);
            uploadData.append("last_updated_by", foundResult);
            // API call to Insert User Group Details in user_group Table
            let ins_user_profile_res = await fetch(
              `${process.env.REACT_APP_SERVER_URL}/api/ins_user_profile`,
              {
                method: "POST",
                body: uploadData, //? Directly passing FormData No need for JSON.stringify(uploadData)
                headers: {
                  // "Content-Type": "application/json",   // ? No need for Content-Type since passing FormData as a Json Object
                  // Authorization: "Bearer " + String(authTokens.access),
                },
              }
            );
            let ins_user_profile_data = await ins_user_profile_res.json();
            if (ins_user_profile_res.status === 201) {
              Swal.fire({
                icon: "success",
                text: "Welcome to Balanced Scorecard!",
              });
            }
            else{
              Swal.fire({
                icon: "error",
                text: "Error!",
              });
            }
              });
             

              loginUser("e", {
                username: name,
                email: mail,
                group: 3,
                password: "demo",
                confirmPassword: "demo",
                is_staff: 0,
              });
            }
          });
        }
      }
    }
  };

  const get_userid_details = async () => {
    let userid_res = await fetch(
      `${process.env.REACT_APP_SERVER_URL}/api/getempregdetails`,
      {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
        },
      }
    );
    let userid_data = await userid_res.json();

    if (userid_res.status === 200) {
      return userid_data[userid_data.length - 1].id;
    }
  };

  return (
    <div className='sc_cl_login'>

      <div className='sc_cl_login_cloud_container'>
        <div className='sc_cl_cloud'>
          <div className='sc_cl_cloud_img'></div>
        </div>

        <div className='sc_cl_cloud'>
          <div className='sc_cl_cloud_img'></div>
        </div>
      </div>

      <div className='sc_login_container'>
        <Col
          xxl={3}
          lg={3}
          md={10}

          className='bg-white p-0 rounded shadow-lg col-11'
        >
          <div className='d-flex justify-content-center p-2 flex-row'>
            <div>
              <img src={cittabase_logo} />
            </div>

          </div>
          <div className='text-center p-3'>
            <h5 className='fw-semibold'>Login to your account</h5>
          </div>
          <div className='px-3 pb-3'>
            <Col>
              <Form onSubmit={loginUser}>
                <FormGroup className='sc_cl_input-field'>
                  <Form.Control
                    type='text'
                    name='username'
                    // className='input-text'
                    // value={username}
                    required
                    autoComplete="off"
                  />
                  <Form.Label>Enter Username</Form.Label>
                </FormGroup>

                <FormGroup className='mt-3 sc_cl_input-field'>
                  <Form.Control
                    type={passwordType}
                    onChange={handlePasswordChange}
                    value={passwordInput}
                    name="password"
                    autoComplete="off"
                    required
                  />
                  <Form.Label>Password</Form.Label>
                  <i onClick={togglePassword}>{passwordType === "password" ? <VscEyeClosed /> : <VscEye />}</i>

                </FormGroup>
                <div className='align-items-center d-flex justify-content-between'>
                  <p className="text-primary mt-2 sc_cl_cursor_pointer" href="#0" onClick={fnForgotPassword}>Forgot Password</p>
                </div>

                <div className='d-flex w-100'>
                  <FnBtnComponent classname={"sc_cl_login_button w-100 py-1 fw-semibold"} children={"Login"} />
                </div>
              </Form>

              <div>
                {checksso ?
                  <>
                    <span className="d-flex justify-content-center p-2">
                      or login in with
                    </span>

                    <div className="d-flex justify-content-center">
                      <button className="" onClick={login}>
                        <span className="mx-2 fw-semibold">
                          <TiVendorMicrosoft />
                        </span>
                        Sign in
                      </button>
                    </div>
                  </>
                  :
                  ""
                }
              </div>

            </Col>
          </div>
        </Col>
      </div>

    </div >
  );
};


export default Login;





