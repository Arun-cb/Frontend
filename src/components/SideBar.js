import React, { useState, useEffect, useContext } from "react";
import AuthContext from "../context/AuthContext";
import "../Assets/CSS/pagination.css";
import "bootstrap/dist/css/bootstrap.min.css";
import { Link, useLocation } from "react-router-dom";
import "../Assets/CSS/stylesheet.css";
import Badge from "@mui/material/Badge";

import { AiOutlineHome } from "react-icons/ai";
import { GrScorecard } from "react-icons/gr";
import {
  MdOutlineAnalytics,
  MdOutlineSettingsEthernet,
  MdClose,
  MdMenu,
  MdOutlineBalance,
  MdOutlineSecurity,
} from "react-icons/md";
import { BiChevronRight, BiChevronDown, BiLeftArrowAlt } from "react-icons/bi";

const FnSideBar = ({
  toggleSideNav,
  isSideNavOpen,
  activity,
  setactivity,
  count,
  BtnRef,
  menudetails,
}) => {
  let { user } = useContext(AuthContext);
  let { authTokens, logoutUser } = useContext(AuthContext);
  const [Dropdown, setDropdown] = useState([]);
  const [Temp, SetTemp] = useState([]);
  const [showoffcanvas, setShowOffCanvas] = useState(false);
  const [btnclassglb, setBtnClassglb] = useState([]);
  const [logo, setLogo] = useState();
  const location = useLocation();
  const [menuChange, setMenuChange] = useState(false);
  
  let NavIcons = {
 
    1: { Icon: <AiOutlineHome className="icon " /> },
 
    2: { Icon: <MdOutlineAnalytics className="icon " /> },
 
    7: { Icon: <MdOutlineBalance className="icon " /> },
 
    12: { Icon: <GrScorecard className="icon " /> },
 
    16: { Icon: <MdOutlineAnalytics className="icon " /> },
 
    20: { Icon: <MdOutlineSecurity className="icon" />},
 
    23: { Icon: <MdOutlineSettingsEthernet className="icon " /> },
 
  };

  function Fn_active(index) {
    let stage2 = [];
    stage2[index] = "sc_cl_nav_button_active";
    if (isSideNavOpen) {
      setBtnClassglb(stage2);
      setMenuChange(true);
    }else{
      toggleSideNav()
      setBtnClassglb(stage2);
      setMenuChange(true);
    }
  }

  function fn_dropdown_toggle(key) {
    if (Dropdown[key] === "T" && isSideNavOpen) {
      setDropdown((Dropdown[key] = "F"));
    } else {
      let test = [];
      test[key] = test[key] === "T" ? "F" : "T";
      if (isSideNavOpen) {
        setDropdown(test);
        setShowOffCanvas(!showoffcanvas);
      }else{
        toggleSideNav()
        setDropdown(test);
      }
    }
  }


  // Getting a tag using id attribute and setting it to a variable
  var imgElement = document.getElementById("Get_logo");

  // Access the src attribute
  var srcAttribute = imgElement && imgElement.src ? imgElement.src : "";

  // Store the src attribute value in localStorage
  localStorage.setItem("imgSrcAttribute", srcAttribute);

  useEffect(() => {
    // This code will run whenever the pathname changes
    if (menuChange) {
      setMenuChange(false);
    } else {
      setBtnClassglb([]);
    }

    // You can perform any necessary actions here
  }, [location.pathname]);

  const Submenu = ({ data, itmindex }) => {
    const classAdd = (index) => {
      let test = [];
      test[index] = "sc_cl_nav_button_active";
      let stage2 = [];
      stage2[itmindex] = test;
      if (isSideNavOpen) {
        setBtnClassglb(stage2);
        setMenuChange(true);
      }
    };

    return data.map((items, index) => (
      <Link key={index}
        to={{ pathname: `/${items.url}/${items.menu_id}` }}
        className={`${
          btnclassglb[itmindex] !== undefined &&
          btnclassglb[itmindex][index] !== undefined
            ? btnclassglb[itmindex][index]
            : "sc_cl_nav_button"
        } sub-menus p-2 my-1`}
        onClick={() => {
          classAdd(index);
        }}
      >
        <i>{/* <BiRadioCircle className="Icon" /> */}</i>
        <span className="sc_cl_nav_link ps-3" style={{font_weight:"600"}}
        >{items.menu_name}</span>
      </Link>
    ));
  };

  return (
    <>
      <div
      id="nav-header-content"
        className="nav-header"
        onClick={() => {
          toggleSideNav();
          SetTemp(Dropdown);
          if (!isSideNavOpen) {
            setDropdown(Temp);
          } else {
            setDropdown([]);
          }
        }}
      >
        <img
          id="Get_logo"
          src={`/Assets/master/logo.png`}
          alt="Choose your Image"
          // className="justify-content-middle m-2"
          className={`${isSideNavOpen ? "d-flex" : "d-none"}`}
          // width="auto"
          // height="50px"
        />
        <button className="sc_cl_head_button justify-content-end">
          {isSideNavOpen ? <BiLeftArrowAlt size={20} /> : <MdMenu size={20} />}
        </button>
      </div>
      <div className="nav-body-scroll" id="nav-body-content">
        <div className="nav-body px-3">
          {menudetails.map((item, index) => {
            return item.childNodes.length > 0 ? (
              <div className="sc_cl_nav_group" key={index}>
                <button
                  className={`${
                    btnclassglb[index] !== undefined && !isSideNavOpen
                      ? "sc_cl_nav_button_active"
                      : "sc_cl_nav_button"
                  } gap-3 p-2`}
                  onClick={() => {
                    fn_dropdown_toggle(index);
                  }}
                >
                  <i className="nav-item-icon">{NavIcons[item.menu_id] && NavIcons[item.menu_id].Icon}</i>
                  <span className="sc_cl_nav_link">{item.menu_name}</span>
                  {Dropdown[index] === "T" ? (
                    <BiChevronDown
                      className={isSideNavOpen ? "Icon ms-auto" : "d-none"}
                    />
                  ) : (
                    <BiChevronRight
                      className={isSideNavOpen ? "Icon ms-auto" : "d-none"}
                    />
                  )}
                </button>
                <div
                  className={`custom-content ${
                    Dropdown[index] === "T" ? "sc_cl_nav_group" : "hidden"
                  }`}
                >
                  {item.childNodes.length > 0 ? (
                    <Submenu data={item.childNodes} itmindex={index} />
                  ) : (
                    <></>
                  )}
                </div>
              </div>
            ) : (
              <React.Fragment key={index}>
                {isSideNavOpen ? (
                  <Link
                    to={{ pathname: `${item.url}/${item.menu_id}` }}
                    className={`${
                      btnclassglb[index] !== undefined
                        ? btnclassglb[index]
                        : "sc_cl_nav_button"
                    } gap-3 p-2 my-1`}
                    onClick={() => {
                      Fn_active(index);
                    }}
                  >
                    <i className="nav-item-icon ">
                      {NavIcons && NavIcons[item.menu_id].Icon}
                    </i>
                    <span className="sc_cl_nav_link">
                      {item.menu_name}
                    </span>
                  </Link>
                ) : (
                  <Link
                    to={{ pathname: `${item.url}/${item.menu_id}` }}
                    id={item.menu_id}
                    className={`${
                      btnclassglb[index] !== undefined
                        ? btnclassglb[index]
                        : "sc_cl_nav_button"
                    } gap-3 p-2 my-1`}
                    onClick={() => {
                      Fn_active(index);
                    }}
                  >
                    <i className="nav-item-icon">
                      {NavIcons && NavIcons[item.menu_id].Icon}
                    </i>
                  </Link>
                )}
              </React.Fragment>
            );
          })}
        </div>
      </div>

      
    </>
  );
};

export default FnSideBar;
