/* ============================================================================================================================================================

   CITTABASE SOLUTIONS - All Rights Reserved.
   ------------------------------------------------------------------------------------------------------------------------------------------------------------

   02-Nov-2022   Arun R      Initial Version             V1

   ** This Page is to define Authontext details   **

============================================================================================================================================================*/

import { createContext, useState, useEffect } from "react";
import jwt_decode from "jwt-decode";
import { useNavigate } from "react-router-dom";
import "bootstrap/dist/js/bootstrap.min.js";
import Swal from "sweetalert2";
import CryptoJS from "crypto-js";
import moment from "moment";
import { PublicClientApplication } from "@azure/msal-browser";
import { config } from "../Config";
import "../Assets/CSS/stylesheet.css";

const AuthContext = createContext();

export default AuthContext;

export const AuthProvider = ({ children }) => {
  let [authTokens, setAuthTokens] = useState(() =>
    localStorage.getItem("authTokens")
      ? JSON.parse(localStorage.getItem("authTokens"))
      : null
  );
  let [user, setUser] = useState(() =>
    localStorage.getItem("authTokens")
      ? jwt_decode(localStorage.getItem("authTokens"))
      : null
  );
  let [loading, setLoading] = useState(true);
  let [isloading, setIsLoading] = useState(false);

  // Navigate to actuals states
  let [navigateact, setNavigateAct] = useState(false)
  let [kpiId, setKpiId] = useState()

  // const application_valid = '2023-07-02'
  let [application_valid, setApplication_valid] = useState(null);
  let [current_date, setCurrent_date] = useState();
  const history = useNavigate();

  const [loggedIn, setLoggedIn] = useState(false);

  // const checkAdmin = async(e) => {
  //   let response = fetch(`${process.env.REACT_APP_SERVER_URL}/api/checkadmin/${authTokens?.access}/`, {
  //     method: "GET",
  //     headers: {
  //       "Content-Type": "application/json",
  //     },
  //   });
  //   // const data = await response.json()
  //   // return data;
  // }
  const UpdateSession = async({token, action, uid, prev_token}) => {
    switch (action) {
      case "update":
        let res = fetch(`${process.env.REACT_APP_SERVER_URL}/api/updatesession/${jwt_decode(token).user_id}/update/`, {
          method : "POST",
          headers : {
            "Content-Type": "application/json",
            Authorization: "Bearer " + String(token),
          },
          body: JSON.stringify({access:token,prev_token:prev_token}),
          // body: JSON.stringify({access:token,prev_token:prev_token, last_time:moment().format('YYYY-MM-DD HH:mm:ss')}),
          // body: JSON.stringify(token),
        })
        if((await res).status === 500 || (await res).status === 400){
          logoutUser()
        }
        break;
      case "close":
        let close_res = fetch(`${process.env.REACT_APP_SERVER_URL}/api/updatesession/${uid}/close/`, {
          method : "POST",
          headers : {
            "Content-Type": "application/json",
            Authorization: "Bearer " + String(token),
          },
          body: JSON.stringify({access:token, last_time:moment().format('YYYY-MM-DD HH:mm:ss')}),
          // body: JSON.stringify(token),
        })
        if((await close_res).status === 500 || (await close_res).status === 400){
          logoutUser()
        }
        break;
      case "shutdown":
        const tok = JSON.parse(localStorage.getItem('authTokens'))
        let shutdown_res = fetch(`${process.env.REACT_APP_SERVER_URL}/api/updatesession/${jwt_decode(tok.access).user_id}/shotdown/`, {
          method : "POST",
          headers : {
            "Content-Type": "application/json",
            Authorization: "Bearer " + String(tok.access),
          },
          body: JSON.stringify({access:tok.access, last_time:moment().format('YYYY-MM-DD HH:mm:ss')}),
          // body: JSON.stringify(token),
        })
        break;
      default:
        let default_res = fetch(`${process.env.REACT_APP_SERVER_URL}/api/updatesession/${jwt_decode(token.access).user_id}/`, {
          method : "POST",
          headers : {
            "Content-Type": "application/json",
            Authorization: "Bearer " + String(token.access),
          },
          body: JSON.stringify({...token, login_time:moment().format('YYYY-MM-DD HH:mm:ss')}),
          // body: JSON.stringify(token),
        })
        return default_res;
    }
  }

  

  let loginUser = async (e,input) => {
    
    if(input==undefined){
    e.preventDefault();
    }
      
    let response = await fetch(
      `${process.env.REACT_APP_SERVER_URL}/api/token/`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(
          input !== undefined
            ? {
                username: input.username,
                password: input.password,
                sso: true,
              }
            : {
                username: e.target.username.value,
                password: e.target.password.value,
                sso: false,
              }
        ),
          
      }
    )
    const ldata = await response.json();
    if (response.status === 200) {
      if ((application_valid === null || new Date(current_date) > new Date(await getLicense()))) {
        if (jwt_decode(ldata.access).is_superuser) {
          Swal.fire({
            title: 'Enter the license key',
            input: 'text',
            inputAttributes: {
              autocapitalize: 'off'
            },
            showCancelButton: true,
            confirmButtonText: 'Submit',
            showLoaderOnConfirm: true,
            preConfirm: (login) => {
              if (login == '') {
                return Swal.showValidationMessage(
                  `Please enter license key`
                )
              } else {
                const bytes = CryptoJS.AES.decrypt(login, process.env.REACT_APP_SECRET_KEY);
                if (bytes.sigBytes !== 12) {
                  return Swal.showValidationMessage(
                    'Please enter valid license key'
                  )
                }
                const dectdata = JSON.parse(bytes.toString(CryptoJS.enc.Utf8));
              }
              return fetch(`${process.env.REACT_APP_SERVER_URL}/api/ins_upd_license/${jwt_decode(ldata.access).user_id}/`,
                {
                  method: "PUT",
                  headers: {
                    "Content-Type": "application/json",
                  },
                  body: JSON.stringify({
                    key: login,
                  }),
                })
                .then(response => {
                  if (!response.ok) {
                    throw new Error(response.statusText)
                  }
                  return response.json()
                })
                .catch(error => {
                  Swal.showValidationMessage(
                    `Request failed: ${error}`
                  )
                })
            },
            showCancelButton: true,
            allowOutsideClick: () => !Swal.isLoading()
          }).then((result) => {
            if (result.isConfirmed) {
              Swal.fire({
                text: 'You have successfully renewed your license. Please login to continue.',
                // imageUrl: result.value.avatar_url
              }).then(() => {
                getLicense()
              })
            }
          })
        } else {
          Swal.fire({
            icon: "error",
            text: "Your application has been expired!. Please contact your admin."
          })
        }
      } else {
        await UpdateSession({token:ldata}).then((data) => {
          if(data.status === 200){
            setAuthTokens(ldata);
            setUser(jwt_decode(ldata.access));
            localStorage.setItem("authTokens", JSON.stringify(ldata))
            history("/");
          }else{
            Swal.fire({
              icon: "error",
              text: "Already the user have few active session..."
            })
          }
        })
        
      }
    } else {
      Swal.fire({
        icon: "error",
        text: "Invalid Credentials!"
      })
    }
  //   if (!e.target.username.value || !e.target.password.value) {
  //     if (!e.username || !e.password) {
  //     Swal.fire({
  //       icon: "error",
  //       text: "Please Enter Your Username and Password!"
  //     })
  //   }
  // }
  };



  // const CloseAlert = async () => {
  //   await fetch(
  //     `${process.env.REACT_APP_SERVER_URL}/api/upd_flag_kpi_pending_actions/${user.user_id}/`,
  //     {
  //       method: "PUT",
  //       body: JSON.stringify({ show_flag: "Y" }),
  //       headers: {
  //         "Content-Type": "application/json",
  //         Authorization: "Bearer " + String(authTokens.access),
  //       },
  //     }
  //   );
  // };

  let getLicense = async () => {
    let response = await fetch(
      `${process.env.REACT_APP_SERVER_URL}/api/get_license`,
      {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
        },
      }
    );
    const data = await response.json();

    if (response.status === 200) {
      setCurrent_date(data.current_date)
      if (data.data.length > 0 && data.data[0].license_key) {
        const bytes = CryptoJS.AES.decrypt(data.data[0].license_key, process.env.REACT_APP_SECRET_KEY);
        const dectdata = JSON.parse(bytes.toString(CryptoJS.enc.Utf8));
        setApplication_valid(dectdata)
        if (dectdata !== '') {
          localStorage.setItem("licenseValidity", dectdata);
          return dectdata
        }
      }
    }
  };

  let SessionlogoutUser = () =>{
    if (user && authTokens) {
      // CloseAlert();
      UpdateSession({action:'close',token:authTokens.access,uid:user.user_id})
    }
    setAuthTokens(null);
    setUser(null);
    localStorage.clear()
    sessionStorage.clear();
    setLoading(false)
    history("/login");
  }



  let logoutUser = async (data, confirmLogout = false) => {
    if (user && authTokens) {
      if(confirmLogout){
        const result = await Swal.fire({
          // title: "Logout Confirmation",
          title: "Are you sure\n you want to log out?",
          // text: "Are you sure you want to log out?",// You won't be able to revert this!
          icon: "info",
          showCancelButton: true,
          confirmButtonColor: "#3085d6",
          cancelButtonColor: "#d33",
          confirmButtonText: "Yes, sign out!",
          width: "250px",
          heightAuto: "50px",
          customClass: {
            // container: 'small-popup',
            title: 'small-title',
            icon: 'small-icon',
            confirmButton: 'small-button',
            cancelButton: 'small-button'
          }
          })
          if(result.isConfirmed){
            if (data[0].is_staff === false) {
              const { appId, redirectUrl, scopes, authority } = await config(
                "f6031fe8-a1db-4221-a246-329c56a87a6e",
                "488d0bae-755e-4d30-9fb8-e0c5495654c4"
              );
              const publicClientApplication = new PublicClientApplication({
                auth: {
                  clientId: appId,
                  redirectUrl: redirectUrl,
                  authority: authority,
                },
                // cache: {
                //   cacheLocation: "sessionStorage",
                //   storeAuthStateInCookie: true,
                // },
              });
              try {
                await publicClientApplication.logoutPopup();
              } catch (err) {
                console.error("Error during logout:", err);
              }
              
            }
          // CloseAlert();
          UpdateSession({action:'close',token:authTokens.access,uid:user.user_id})
          setAuthTokens(null);
          setUser(null);
          localStorage.clear()
          sessionStorage.clear();
          setLoading(false)
          history("/login");
        }
      }else{
        // CloseAlert();
        UpdateSession({action:'close',token:authTokens.access,uid:user.user_id})
        setAuthTokens(null);
        setUser(null);
        localStorage.clear()
        sessionStorage.clear();
        setLoading(false)
        history("/login");
      }
  } 
};

  let contextData = {
    user: user,
    loginUser: loginUser,
    logoutUser: logoutUser,
    SessionlogoutUser: SessionlogoutUser,
    authTokens: authTokens,
    loading: loading,
    isloading: isloading,
    setLoading: setLoading,
    current_date: current_date,
    navigateact: navigateact,
    setNavigateAct: setNavigateAct,
    setKpiId: setKpiId,
    kpiId: kpiId,
  };
  let updateToken = async () => {
    // const prev_token = authTokens && authTokens.access
    const prev_token = localStorage.getItem('authTokens') && JSON.parse(localStorage.getItem('authTokens')).access
    let response = await fetch(
      `${process.env.REACT_APP_SERVER_URL}/api/token/refresh/`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ refresh: authTokens?.refresh }),
      }
    );
    const data = await response.json();

    if (response.status === 200) {
      setAuthTokens(data);
      setUser(jwt_decode(data.access));
      localStorage.setItem("authTokens", JSON.stringify(data));
      UpdateSession({token:JSON.parse(localStorage.getItem('authTokens')).access,prev_token:prev_token ,action:'update'})
    } else {
      SessionlogoutUser();
    }

    if (loading) {
      setLoading(false);
    }
  };
  // if(!localStorage.getItem('authTokens')){
  //   logoutUser()
  // }
 
  // if(localStorage.getItem('authTokens') === null){
  // }
  useEffect(() => {
    if(!localStorage.getItem('authTokens')){
      logoutUser()
    }
    if (loading) {
      updateToken();
      getLicense();
    }
    if(localStorage.getItem('authTokens')){
      let fourMinutes = 1000 * 60 * 4;
      // let fourMinutes = 1000 * 5;
      let interval = setInterval(() => {
        if (authTokens) {
          localStorage.setItem('datetime', new Date().toLocaleTimeString())
          updateToken();
          // getLicense()
        }
      }, fourMinutes);
      return () => clearInterval(interval);
    }else{
      logoutUser()
    }
      // window.addEventListener('storage', function(event){
      //   if (event.key !== 'authTokens') { 
      //     logoutUser()
      //   }
      // });
      
      
  }, [authTokens,loading]);

  // ! Test

  const msalConfig = {
    auth: {
      clientId: "f6031fe8-a1db-4221-a246-329c56a87a6e",
      redirectUrl: 'http://localhost:3000',
      authority: "https://login.microsoftonline.com/488d0bae-755e-4d30-9fb8-e0c5495654c4",
    }
  };
  
  const pca = new PublicClientApplication(msalConfig);
  
  useEffect(() => {
    // Check if user is already logged in
    const accounts = pca.getAllAccounts();
    // if (accounts.length > 0) {
    //   console.log("inside if",accounts,"length",accounts.length);
    //   // setLoggedIn(true);
    // }
    // else{
    //   console.log("inside else",accounts,"length",accounts.length);
    //   // SessionlogoutUser();
    // }
  }, []);

  return (
    <AuthContext.Provider value={contextData}>
      {loading ? null : children}
    </AuthContext.Provider>
  );
};
