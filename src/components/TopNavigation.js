import React, { useState, useEffect, useContext, useRef } from "react";
import AuthContext from "../context/AuthContext";
import "bootstrap/dist/css/bootstrap.min.css";
import {
  Dropdown,
  Col,
  Popover,
  OverlayTrigger,
} from "react-bootstrap";
import * as ico5 from "react-icons/io5";
import { FiSettings } from "react-icons/fi";
import { Link } from "react-router-dom";
import PreContext from "../context/PreContext";
import { BiHelpCircle } from "react-icons/bi";
import { useParams } from "react-router-dom";
import * as tb from "react-icons/tb";
import * as ai from "react-icons/ai";
import moment from "moment";

const TopNavBar = () => {
  let { authTokens, logoutUser, user, setLoading } = useContext(AuthContext);
  const { id } = useParams();
  
  const [pending, setPending] = useState();
  const [close, setClose] = useState(false);
  const [alertclose, setAlertClose] = useState();
  const [showallnotification, setShowAllNotification] = useState(false);
  const [helper, setHelper] = useState([]);
  const [appname, setAppname] = useState([]);
  const [usergroup, setUserGroup] = useState();
  const current_date = new moment();

  // ? TO GET PROFILE PIC
  const [profilepic, setProfilepic] = useState();
  const [picstate, setPicState] = useState(false);

  

  const getHelper = async () => {
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
    let res2 = await fetch(
      `${process.env.REACT_APP_SERVER_URL}/api/get_user_profile/${user.user_id}`,
      {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          Authorization: "Bearer " + String(authTokens.access),
        },
      }
    );
    let data2 = await res2.json();
    if (res2.status === 200) {
      if (data2.length > 0) {
        setProfilepic(data2 && data2[0].profile_pic ? data2[0].profile_pic.replace(/^.*[\\\/]/, '') : "");
        if (data2 && data2[0].profile_pic ? true : false) {
          setPicState(true);
        }
        else {
          setPicState(false);
        }
      }
    }
  };
  

  const fnGetUserGroup = async () => {
    let res = await fetch(
      `${process.env.REACT_APP_SERVER_URL}/api/get_user_groups/${user.user_id}/`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: "Bearer " + String(authTokens.access),
        },
        body: JSON.stringify({'is_superuser' : user.is_superuser})
      }
    );
    let data = await res.json();
    if (res.status === 200) {
      if (data.length > 0) {
        setUserGroup(data);
      }
    }
  };

  useEffect(() => {
    getHelper();
    fnGetUserGroup();
  }, [close]);

  const countNoDate = (end_date) => {
    if (current_date > moment(end_date)) {
      let no_of_days = current_date.diff(end_date, "days")
      if (no_of_days === 1) {
        return no_of_days + " day ago"
      } else if (no_of_days > 1 && no_of_days < 31) {
        return no_of_days + " days ago"
      } else if (no_of_days === 31) {
        return Math.round(no_of_days / 31) + " month ago"
      } else if (no_of_days > 31) {
        return Math.round(no_of_days / 31) + " months ago"
      } else {
        if (current_date.diff(end_date, "minutes") <= 59) {
          return current_date.diff(end_date, "minutes") + " minutes ago"
        } else if (current_date.diff(end_date, "minutes") === 60) {
          return Math.round(current_date.diff(end_date, "minutes") / 60) + " hour ago"
        } else if (current_date.diff(end_date, "minutes") > 60) {
          return Math.round(current_date.diff(end_date, "minutes") / 60) + " hours ago"
        }
      }
    }
  }

  const chooseIcon = (action) => {
    switch (action) {
      case 'warning':
        return <div className="notification-icons notification-warning-icon"><ai.AiOutlineWarning /></div>
      case 'alert':
        return <div className="notification-icons notification-alert-icon"><ai.AiFillAlert /></div>
      case 'success':
        return <div className="notification-icons notification-success-icon"><ai.AiOutlineCheck /></div>
      case 'pending':
        return <div className="notification-icons notification-pending-icon"><tb.TbRefreshAlert /></div>

      default:
        return <div className="notification-icons notification-alert-icon"><ai.AiFillAlert /></div>
    }
  }

  const handleClick = (event) => {
    setShowAllNotification(!showallnotification)
    var d = document.querySelector(".extra-notification");
    if (showallnotification) {
      d.classList.add('collapsed')
      d.classList.remove('expanded')
    }
    else {
      d.classList.remove('collapsed')
      d.classList.add('expanded')
    }
    event.stopPropagation();
  };

  const closeSingleNotification = async (event, id, uid, unique_id) => {
    event.stopPropagation();
    let e = document.querySelector(`.tb-sc-content-${unique_id}`);
    e.classList.toggle('close')
    if (uid === undefined) {
      const timer = setTimeout(() => {
        const filter_notification = pending.filter((data) => !(data.id === id && data.notification_type === 'other'))
        setPending(filter_notification)
        let res = fetch(
          `${process.env.REACT_APP_SERVER_URL}/api/notification_show_handle/${id}/`,
          {
            method: "PUT",
            headers: {
              "Content-Type": "application/json",
              Authorization: "Bearer " + String(authTokens.access),
            },
          }
        );
      }, 400);
      return () => clearTimeout(timer);
    } else {
      const timer = setTimeout(() => {
        const filter_notification = pending.filter((data) => !(data.id === id && data.user_id === user.user_id))
        setPending(filter_notification)
        let res = fetch(
          `${process.env.REACT_APP_SERVER_URL}/api/notification_kpi_show_handle/${id}/`,
          {
            method: "PUT",
            headers: {
              "Content-Type": "application/json",
              Authorization: "Bearer " + String(authTokens.access),
            },
          }
        );
      }, 400);
      return () => clearTimeout(timer);
    }
  }

  // Getting a tag using id attribute and setting it to a variable
  var titleElement = document.getElementById('Get_title');

  // Access the src attribute
  var srcAttribute = titleElement && titleElement.textContent ? titleElement.textContent : "";

  // Store the src attribute value in localStorage
  localStorage.setItem('titleSrcAttribute', srcAttribute);



  return (
    <div className="shadow-sm col-10 col-lg-12" id="top_nav">
      <div className="bg-white col-12 d-flex justify-content-between px-0 py-0 px-lg-3 py-lg-1 sc_cl_top_nav">
        <Col className="col-lg-6 col-md-6 d-flex">
          <div className="d-flex">
            <Link to="/" className="align-items-center d-flex">
              <div className="align-items-center d-flex w-100 sc_cl_brand_text">
                <h4 className="m-0 d-lg-flex fw-semibold" id="Get_title">
                  {"Query Builder"}
                </h4>
              </div>
            </Link>
          </div>
        </Col>

        <div className="col-6 col-lg-6 d-flex justify-content-end me-2">
          <Col className="align-items-center col-12 col-lg-6 d-flex justify-content-end">
            {
              helper
                .filter((user) => user.page_no === Number(id))
                .map((items, index) => items.help_context).length > 0
                ? (
                  <div className="me-2 ms-2 d-none">
                    <OverlayTrigger
                      className=""
                      trigger="click"
                      placement={"bottom"}
                      overlay={
                        <Popover
                          className="sc_cl_popover_body"
                          style={{ maxWidth: "50%" }}
                        >
                          <React.Fragment>
                            <Popover.Header as="h4" className="text-center">
                              Context Help
                            </Popover.Header>
                            {helper
                              .filter((user) => user.page_no === Number(id))
                              .map((items, idx) => {
                                return (
                                  <Popover.Body className="" key={idx}>
                                    <h6>{items.label}</h6>
                                    <p className="context_para_help">
                                      {items.help_context}
                                    </p>
                                  </Popover.Body>
                                );
                              })}
                          </React.Fragment>
                        </Popover>
                      }
                    >
                      <div>
                        <i>
                          <BiHelpCircle
                            size={20}
                            color={"#0d6efd"}
                            className="sc_cl_cursor_pointer"
                          />
                        </i>
                      </div>
                    </OverlayTrigger>
                  </div>
                ) : (
                  ""
                )}
            <div className="sc_cl_setting_btn" id="top_nav_setting_icon">
              <Link to="/user_profile/4/2" aria-label="Settings">

                <FiSettings />
              </Link>
            </div>
            {
              localStorage.getItem('remaining') > 0 &&
              <Dropdown className="sc_license_warning">
                <Dropdown.Toggle className="dropdown-toggle bg-transparent sc_cl_navigation_item border-0" size="sm">
                  <ai.AiOutlineWarning />
                  <Dropdown.Menu>
                    <Dropdown.Item>{`Your application validity is expiring in ${localStorage.getItem('remaining')} days.`}</Dropdown.Item>
                  </Dropdown.Menu>
                </Dropdown.Toggle>
              </Dropdown>
            }


            <Dropdown className="sc_license_warning">
              <Dropdown.Toggle className="dropdown-toggle bg-transparent sc_cl_navigation_item sc_cl_navigation_bell border-0" size="sm">
                <ico5.IoNotifications />
                {
                  pending && pending.length > 0 &&
                  <span className="align-items-center d-flex justify-content-center rounded-circle sc_cl_notification_badge">
                    {pending.length}
                  </span>
                }
                <Dropdown.Menu className="notificaion-dropdown-menu">
                  <div className="tb-sc-notification-header">Notification</div>
                  {
                    pending && pending.length === 0 &&
                    <div className='notification-footer'><div className="menu-title">No Notification</div></div>
                  }
                  <div className="tb-sc-notification-body">
                    {
                      pending && pending.map((data, i) => {
                        if (i < 3) {
                          return (
                            <div key={i} className={`tb-sc-notification-content tb-sc-content-${data.unique_id}`} href="#">
                              <div className="notification-item">
                                {chooseIcon(data.action)}
                                <div>
                                  <p className="item-info">{data.message}</p>
                                  <p className="item-date-info">{countNoDate(data.last_updated_date)}</p>
                                </div>
                                <div className="tb-sc-notification-single-close" onClick={(e) => closeSingleNotification(e, data.id, data.user_id, data.unique_id)}><ai.AiFillCloseCircle /></div>
                              </div>
                            </div>
                          )
                        }
                      })
                    }
                    <div id="tb-sc-expand-container">
                      <div className="extra-notification collapsed">
                        {
                          pending && pending.map((data, i) => {
                            if (i >= 3) {
                              console.log("data", data)
                              return <div className={`notification-item tb-sc-content-${data.unique_id}`}>
                                {chooseIcon(data.action)}
                                <div>
                                  <p className="item-info">{data.message}</p>
                                  <p className="item-date-info">{countNoDate(data.last_updated_date)}</p>
                                </div>
                                <div className="tb-sc-notification-single-close" onClick={(e) => closeSingleNotification(e, data.id, data.user_id, data.unique_id)}><ai.AiFillCloseCircle /></div>
                              </div>
                            }
                          })
                        }
                      </div>
                    </div>
                    <div className={pending && pending.length > 3 ? 'tb-sc-notification-footer' : 'd-none'}><div className="menu-title" onClick={(e) => handleClick(e)}>{showallnotification ? 'Collapse All' : 'View all'}</div></div>
                  </div>
                </Dropdown.Menu>
              </Dropdown.Toggle>
            </Dropdown>

            <div className="align-items-center d-flex justify-content-center px-1 py-1 sc_cl_account_border">
              <div className="sc_cl_profile_pic d-flex align-items-center justify-content-center px-1 py-1">
                <img
                  src={picstate ? `/Assets/master/${profilepic}` : "/Assets/gray-user-profile-icon.png"} //profiledefault
                  className="w-100 rounded-circle img-fluid align-items-center d-flex img-fluid justify-content-center m-0 rounded-circle"
                />
              </div>
              <Dropdown className="" id="top_nav_profile_details_icon">
                <Dropdown.Toggle
                  className="bg-transparent dropdown-toggle sc_cl_navigation_item border-0 d-flex align-items-center"
                  size="sm"
                >
                  <span className="d-none d-lg-block">{user.username.charAt(0).toUpperCase() +
                    user.username.slice(1)}</span>
                  <Dropdown.Menu>
                    <Link to="/user_profile/24/1" className="dropdown-item">View Profile</Link>
                    <Link to="/user_profile/24/3" className="dropdown-item">Change Password</Link>
                    <Dropdown.Item onClick={() => logoutUser(usergroup, true)}>Logout</Dropdown.Item>
                  </Dropdown.Menu>
                </Dropdown.Toggle>
              </Dropdown>
            </div>
          </Col>
        </div>
      </div>
    </div>
  );
};

export default TopNavBar;
