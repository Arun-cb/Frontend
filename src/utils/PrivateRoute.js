import React, { useContext, useEffect, useState, useRef } from "react";
import { Container, Row, Card, Button } from "react-bootstrap";
import { Navigate, Outlet } from "react-router-dom";
import TopNavBar from "../components/TopNavigation";
import AuthContext from "../context/AuthContext";
import PreContext from "../context/PreContext";
import { ReactComponent as MySVG } from "../Assets/Images/up-arrow-svgrepo-com.svg";
import img_user from "../Assets/Images/img_user.png";
import profile_pic from "../Assets/Images/profile_pic.jpg";
import "../Assets/CSS/global.css";
import { Link, useParams } from "react-router-dom";
import FnBtnComponent from "../components/buttonComponent";
import FnPinToDashboard from "../components/pinToDashboard";
import Spinner from "../components/Spinner";
import { AiFillCloseCircle } from "react-icons/ai";
import IdleTimeOut from "../pages/IdleTimeOut";
import FnSideBar from "../components/SideBar";

import { BiChevronDown, BiChevronRight, BiLeftArrowAlt } from "react-icons/bi";

import { HiMenuAlt2, HiGlobeAlt } from "react-icons/hi";
import { Offcanvas, Dropdown, Col } from "react-bootstrap";
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
import { TbRuler, TbReportMoney, TbActivityHeartbeat } from "react-icons/tb";
import { VscOrganization } from "react-icons/vsc";

const useAuth = () => {
  let { user } = useContext(AuthContext);
  if (user) {
    return true;
  } else {
    return false;
  }
};

let NavIcons = {
 
  1: { Icon: <AiOutlineHome className="icon " /> },

  2: { Icon: <MdOutlineAnalytics className="icon " /> },

  7: { Icon: <MdOutlineBalance className="icon " /> },

  12: { Icon: <GrScorecard className="icon " /> },

  16: { Icon: <MdOutlineAnalytics className="icon " /> },

  20: { Icon: <MdOutlineSecurity className="icon" />},

  23: { Icon: <MdOutlineSettingsEthernet className="icon " /> },

};

const FnPrivateRoute = ({ children, ...rest }) => {
  let { authTokens, user, logoutUser, current_date, SessionlogoutUser } =
    useContext(AuthContext);

  let { userSettings, isloading, setisloading } =
    useContext(PreContext);

  const [pending, setPending] = useState([]);
  const [mode] = useState(false);
  const { id } = useParams();
  const [activity, setactivity] = useState(false);
  const [visible, setVisible] = useState(false);
  const [license_alert, setLicense_alert] = useState(false);
  const [days_remaining, setDaysRemaining] = useState();
  const [isActive, setIsActive] = useState(true);
  const [isSideNavOpen, setSideNavOpen] = useState(false);
  const [showoffcanvas, setShowOffCanvas] = useState(false);
  const [highlightedDays, setHighlightedDays] = useState([]);
  const [menudetails, SetMenuDetails] = useState([]);
  const [configdata, setConfigdata] = useState([]);

  const [flag, setFlag] = useState(false);

  const ActivityRef = useRef();
  const BtnRef = useRef();

  const formatTwoDigits = (number) => {
    return number.toString().padStart(2, "0");
  };

  const DateNow = new Date();
  const DateNowStr = `${DateNow.getFullYear()}-${formatTwoDigits(
    DateNow.getMonth() + 1
  )}-${formatTwoDigits(DateNow.getDate())}T${formatTwoDigits(
    DateNow.getHours()
  )}:${formatTwoDigits(DateNow.getMinutes())}:${formatTwoDigits(
    DateNow.getSeconds()
  )}`;

  const toggleSideNav = () => {
    setSideNavOpen(!isSideNavOpen);
  };

  let Theme =
    userSettings && userSettings.theme === "black" ? "black" : "white";
  document.documentElement.style.setProperty("--my-theme-color", Theme);

  document.documentElement.style.setProperty(
    "--my-label-color",
    userSettings && userSettings.labelcolor
  );

  const auth = useAuth();

  

  const fnOrderdPending = (data) => {
let daysToDisplay = configdata
      .filter(
        (data) =>
          data.config_type.includes(
            "Activity Config Details"
          ) && data.is_active
      ).map(itm =>{
        if (itm.config_code == "Past notification display(Days)"){
          return itm.config_value
        }
      })
    const minDate = new Date();
    const day = minDate.getDate() - Number(daysToDisplay[0]);
    minDate.setDate(day)
    const sortedDataAscending = data
      .slice()
      .sort((a, b) => new Date(a.upcoming_date) - new Date(b.upcoming_date));
    const dataWithStatus = sortedDataAscending.map((item) => ({
      ...item,
      status: new Date(item.upcoming_date) <= new Date() ? "Past" : "Future",
    }));
    let filterJSON = dataWithStatus.filter((itm) => {
      return new Date(itm.upcoming_date) > minDate
    })
    setPending(filterJSON);
    let ListDate = [];
    sortedDataAscending.map((item) => {
      ListDate.push(new Date(item.upcoming_date));
      // setHighlightedDays([...highlightedDays, new Date(item.upcoming_date)]);
    });
    setHighlightedDays(ListDate);
  };

  

  const toggleVisible = () => {
    if (
      document.body.scrollTop > 500 ||
      document.documentElement.scrollTop > 500
    ) {
      setVisible(true);
    } else {
      setVisible(false);
    }
  };

  const ScrollToTop2 = () => {
    function scrollTo() {
      window.scrollTo(0, 0);
    }
    return (
      <button
        className={`scroll-to-top ${!visible ? "d-none" : ""}`}
        onClick={() => window.scrollTo(0, 0)}
      >
        <MySVG />
      </button>
    );
  };

  const fnReturnPermissionList = (menuresult, PermissionDetails) => {
    let list = [];

    menuresult.map((item) => {
      PermissionDetails.map((PerItm) => {

        if (
          (item.menu_id === PerItm.menu_id &&
          PerItm.view === "Y") 
        ) {
          list.push(item);
        }
      });
    });
    list = fngetparentlist(list,menuresult)
    return list;
  };

  const fngetparentlist = (list, menuresult) =>{
    let ParentMenu = menuresult.filter((i)=>{
      return i.url === '/'
    })
    let TotalList = list

    ParentMenu.map((item) => {
      list.map((PerItm) => {
        if (
          (item.menu_id === PerItm.parent_menu_id && !list.includes(item)) 
        ) {
          TotalList.push(item);
        }
      });
    });

    return TotalList
  }

  async function SetMenu() {
    let get_nav_menu_response = await fetch(
      `${process.env.REACT_APP_SERVER_URL}/api/get_navigation_menu_details`,
      {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          Authorization: "Bearer " + String(authTokens.access),
        },
      }
    );

    let res = await fetch(
      `${process.env.REACT_APP_SERVER_URL}/api/join_user_group_access/${user.role}`,
      {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          Authorization: "Bearer " + String(authTokens.access),
        },
      }
    );

    let nav_menu_data = await get_nav_menu_response.json();
    let PermissionDetails = await res.json();

    if (get_nav_menu_response.status === 200) {
      SetMenuDetails(nav_menu_data);
    }

    if (PermissionDetails.status === 200) {
    }

    let menuresult = nav_menu_data;

    let menu_result = fnReturnPermissionList(menuresult, PermissionDetails);
    const menu_table = Object.create(null);

    menu_result.forEach((actualData) => {
      menu_table[actualData.menu_id] = {
        ...actualData,
        childNodes: [],
        countChildNodes: [],
      };
    });

    const menuTree = [];

    menu_result.forEach((actualData) => {
      if (actualData.parent_menu_id > 0) {
        menu_table[actualData.parent_menu_id].childNodes.push(
          menu_table[actualData.menu_id]
        );
      } else {
        menuTree.push(menu_table[actualData.menu_id]);
      }
    });

    menuTree.map((itm, index) => {
      if (
        itm.url === "/" &&
        (itm.childNodes.length === 0 || itm.childNodes === undefined)
      ) {
        menuTree.splice(index, 1);
      }
    });

    let NavMenu = menuTree;

    SetMenuDetails(NavMenu);
  }

  useEffect(() => {
    window.addEventListener("scroll", toggleVisible, false);
  }, []);

  useEffect(() => {
    const calculateDaysRemaining = () => {
      const currentDate = new Date(current_date);
      const examDate = new Date(localStorage.getItem("licenseValidity")); // Replace with your desired exam date
      const timeDifference = Math.abs(examDate - currentDate);
      const daysRemaining = Math.ceil(timeDifference / (1000 * 60 * 60 * 24));
      setDaysRemaining(daysRemaining);
      if (daysRemaining <= 31) {
        localStorage.setItem("remaining", daysRemaining);
        setLicense_alert(true);
      }
    };
    setHighlightedDays([]);
    calculateDaysRemaining();
    SetMenu();
  }, []);

  useEffect(() => {
    if (isActive === false) {
      SessionlogoutUser();
    }
    if (isloading === false) {
      setTimeout(() => {
        setisloading(null);
      }, 800);
    }
  }, [isloading, isActive]);

  useEffect(() => {
    const ActivityHandler = (e) => {
      if (
        ActivityRef.current &&
        !ActivityRef.current.contains(e.target) &&
        BtnRef.current &&
        !BtnRef.current.contains(e.target)
      ) {
        setactivity(false);
        setFlag(false);
      }
    };

    document.addEventListener("mousedown", ActivityHandler);
    return () => {
      document.removeEventListener("mousedown", ActivityHandler);
    };
  });

  const Submenu = ({ data }) => {
    return data.map((items, index) => (
      // <button id={items.menu_id} className="sc_cl_nav_button " key={index}>
        <Link key={index}
          to={{ pathname: `/${items.url}/${items.menu_id}` }}
          className="sc_cl_nav_button sub-menus px-2 py-1 my-1"
        >
          <i>{/* <BiRadioCircle className="Icon" /> */}</i>
        <span className="sc_cl_nav_link_mobile ps-3" style={{ font_weight: "600" }} onClick={(e) => setShowOffCanvas(!showoffcanvas)}
        >{items.menu_name}</span>
        </Link>
      // </button>
    ));
  };

  const ResSideNav = () => {

    const [NavDropdown, setNavDropdown] = useState({});

    function fn_dropdown_toggle(key) {
      console.log({key});
      if (NavDropdown[key] === "T") {console.log("if");
        setNavDropdown((NavDropdown[key] = "F"));
      } else {console.log("else");
        let test = [];
        test[key] = test[key] === "T" ? "F" : "T";
        // if (isSideNavOpen) {
          console.log("object",test);
          setNavDropdown(test);
          // setShowOffCanvas(!showoffcanvas);
        // }else{
        //   toggleSideNav()
        //   setDropdown(test);
        // }
      }
    }
    
    return (
      <div id="canvas" className="align-items-center canvas bg-white shadow-sm justify-content-center col-2">
        <button
          className="sc_cl_head_button gap-3"
          onClick={() => setShowOffCanvas(!showoffcanvas)}
        >
          <MdMenu size={20}/>
        </button>

        <Offcanvas
          show={showoffcanvas}
          onHide={() => setShowOffCanvas(false)}
          responsive="lg"
          className="w-75"
          id="sm_mobile_side_nav"
        >
          <Offcanvas.Header className="">
            <Offcanvas.Title>
              <img
          id="Get_logo"
          src={`/Assets/master/${'org_settings_logo_1_upd.png'}`}
          alt="Choose your Image"
          // className="justify-content-middle m-2"
          // className={`${isSideNavOpen ? "d-flex" : "d-none"}`}
          width="auto"
          height="50px"
        />
        </Offcanvas.Title>
        <button className="sc_cl_head_button" onClick={(e)=>setShowOffCanvas(!showoffcanvas)}>
          <BiLeftArrowAlt size={20} />
        </button>
          </Offcanvas.Header>

          <Offcanvas.Body className="">{/**p-2 */}
            <div className="d-flex flex-column">
              {menudetails.map((item, index) => {
                return item.childNodes.length > 0 ? (
                  <div className="sc_cl_nav_group" key={index}>
                    <button
                      className="sc_nav_button p-2 gap-3 d-flex btn align-items-center justify-content-center"
                      onClick={() => {
                        console.log({index});
                        fn_dropdown_toggle(index);
                      }}
                    >
                      <i className="nav-item-icon">{NavIcons[item.menu_id] && NavIcons[item.menu_id].Icon}</i>
                  <span className="sc_cl_nav_link_mobile small">{item.menu_name}</span>
                  {NavDropdown && NavDropdown[index] === "T" ? (
                   <BiChevronDown className={"Icon ms-auto"}/>
                    ) : (
                      <BiChevronRight
                      className={"Icon ms-auto"}
                    />
                  )}
                  </button>
                  <div
                  className={`custom-content ${
                    NavDropdown[index] === "T" ? "sc_cl_nav_group" : "hidden"
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
                  <React.Fragment
                    key={index}
                  >
                    <Link to={{ pathname: `${item.url}/${item.menu_id}`}}
                    className="sc_cl_nav_button gap-3 p-2 my-1">
                    <i className="nav-item-icon ">
                      {NavIcons[item.menu_id] && NavIcons[item.menu_id].Icon}
                    </i>
                    <span className="d-flex" onClick={(e)=>setShowOffCanvas(!showoffcanvas)}>
                      {item.menu_name}
                    </span>
                    </Link>
                  </React.Fragment>
                );
              })}
            </div>
          </Offcanvas.Body>
        </Offcanvas>
      </div>
    );
  };

  return auth ? (
    <>
      {license_alert === true && (
        <Container id="1" fluid className="sc_fluid_container sc_license_alert">
          {`Your application validity is expiring in ${
            localStorage.getItem("remaining") >= 1
              ? localStorage.getItem("remaining") + " days."
              : localStorage.getItem("remaining") + " day."
          }`}
          <a
            className="sc_license_alert_close"
            onClick={() => setLicense_alert(false)}
          >
            <AiFillCloseCircle></AiFillCloseCircle>
          </a>
        </Container>
      )}
      <Container fluid className="sc_fluid_container p-0 p-lg-1" id="2">
        <IdleTimeOut
          onActive={() => {
            setIsActive(true);
          }}
          onIdle={() => {
            setIsActive(false);
          }}
        />
        <div className="layout-size col-12" id="3">
          <div
            id="mySidenav"
            className={
              isSideNavOpen
                ? "sideNavOpenHead sidenav "
                : "sideNavClosedHead sidenav "
            }
          >
            <FnSideBar
              toggleSideNav={toggleSideNav}
              isSideNavOpen={isSideNavOpen}
              activity={activity}
              setactivity={setactivity}
              count={pending.length}
              BtnRef={BtnRef}
              menudetails={menudetails}
            />
          </div>

          <div
            id="main"
            className={isSideNavOpen ? "sideNavOpenBody" : "sideNavClosedBody"}
          >
            <div className="" id="4">
              <div className="col-12 d-flex " id="4.1">
              <ResSideNav />
              <TopNavBar />
              </div>
              {/* <TopNavBar />

              <div className="" id="5">
                <ResSideNav />
              </div> */}

              <div className="sc_outlet" id="6">
                {isloading === false || isloading === true ? (
                  <>
                    <Spinner />
                  </>
                ) : (
                  ""
                )}
                <Outlet />
                <div ref={ActivityRef}>
                  <div
                    id="Activity"
                    className={` ${
                      activity ? "sc_cl_activity" : "sc_cl_activity_disabled"
                    } ${
                      isSideNavOpen ? "sideNavOpenBody" : "sideNavClosedBody"
                    }`}
                  >
                    
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
        <ScrollToTop2 />
        {/* <ScrollToTop smooth component={<MySVG />} /> */}
        {/* <footer className="bg-light sc_cl_footer text-center text-lg-start text-white position-absolute">
        <div className="bg-secondary py-1 text-center">
          © 2022 Copyright:
          <a
            className="text-white"
            href="http://cittabase.com/"
            target="_blank"
          >
            Cittabase.com
          </a>
        </div>
      </footer> */}
      </Container>
    </>
  ) : (
    <Navigate to="/login" />
  );
};

export default FnPrivateRoute;
