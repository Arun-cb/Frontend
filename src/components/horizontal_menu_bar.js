/* =========================================================================================================================

   CITTIABASE SOLUTIONS - All Rights Reserved.
   ----------------------------------------------------------------------------------------------------------------------------

   21-MAR-2023  Revan Rufus S      Initial Version             V1

   ** This Component contains Navigation menu items which appear on the header**

==========================================================================================================================*/



import React, { useState, useEffect, useContext, useRef } from "react";
import AuthContext from "../context/AuthContext";
import '../Assets/CSS/pagination.css';
import { HiMenuAlt2, HiGlobeAlt } from "react-icons/hi"

import "bootstrap/dist/css/bootstrap.min.css";
import {
  Offcanvas,
  Dropdown,
  Col,
} from "react-bootstrap";

import { Link, useNavigate } from "react-router-dom";

function HorizontalNavMenu() {
  let { user } = useContext(AuthContext);
  let { authTokens, logoutUser } = useContext(AuthContext);
  const [menudetails, SetMenuDetails] = useState([]);

  const [showoffcanvas, setShowOffCanvas] = useState(false);

  const menu_navigate = useNavigate();

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

    let nav_menu_data = await get_nav_menu_response.json();

    if (get_nav_menu_response.status === 200) {
      SetMenuDetails(nav_menu_data);
    }

    let menuresult = nav_menu_data;

    let menu_result = menuresult;
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

    let NavMenu = menuTree;
    SetMenuDetails(NavMenu);
  }

  useEffect(() => {
    SetMenu();
  }, []);

  return (
    <div className="p-0">
      <div className="col-lg-12 d-lg-flex d-none rounded-2 sc_cl_menu_navigation_bg">
        <Col lg={6} className="d-flex">
          <div className="d-flex flex-column flex-lg-row flex-md-row">
            {menudetails.map((item, index) => {
              return item.childNodes.length > 0 ?
                <Dropdown key={item.menu_id}>
                  <Dropdown.Toggle
                    id="navbarDropdown"
                    className="bg-transparent dropdown-toggle ms-2  sc_cl_navigation_item text-white border-0 sc_cl_main_menu"
                    key={item.menu_id}
                    size="sm">
                    {item.menu_name}
                    <Dropdown.Menu key={index} className="menu-animate slideIn">
                      {item.childNodes.length > 0 ? (<Submenu data={item.childNodes} />) : ("")}
                    </Dropdown.Menu>
                  </Dropdown.Toggle>
                </Dropdown> :
                <button className="bg-transparent border border-0 ms-2 btn btn-sm text-nowrap sc_cl_main_menu"
                  key={item.menu_id}
                  id="main-menu">
                  <Link to={{ pathname: `${item.url}/${item.menu_id}` }} className="text-white">
                    {item.menu_name}
                  </Link>
                </button>
            }
            )}
          </div>
        </Col>
      </div>

      <div className="d-lg-none d-flex">
        <p
          className="h2 m-0 text-success"
          onClick={() => setShowOffCanvas(!showoffcanvas)}
        >
          <HiMenuAlt2 />
        </p>

        <Offcanvas
          show={showoffcanvas}
          onHide={() => setShowOffCanvas(false)}
          responsive="lg"
          className="w-75"
        >
          <Offcanvas.Header closeButton className="p-0 p-2">
            <Offcanvas.Title>
              <div className="align-items-center d-flex sc_cl_brand_text w-100">
                <HiGlobeAlt className="m-0" />
                <p className="m-0 ms-1 text-nowrap" style={{ fontSize: "14px" }}>
                  Balanced Scorecard
                </p>
              </div>
            </Offcanvas.Title>
          </Offcanvas.Header>

          <Offcanvas.Body className="p-0 p-2">
            <div className="d-flex flex-column h-50 justify-content-around">
              {menudetails.map((item, index) => {
                return item.childNodes.length > 0 ? (
                  <Dropdown key={item.menu_id}>
                    <Dropdown.Toggle
                      className="sc_navbar_item"
                      key={item.menu_id}
                      size="sm"
                    >
                      {" "}
                      {item.menu_name}
                      <Dropdown.Menu key={index}>
                        {item.childNodes.length > 0 ? (
                          <Submenu data={item.childNodes} />
                        ) : (
                          ""
                        )}
                      </Dropdown.Menu>
                    </Dropdown.Toggle>
                  </Dropdown>
                ) : (
                  <button
                    className="bg-transparent border border-0 text-nowrap text-start text-white"
                    key={item.menu_id}
                  >
                    {" "}
                    <Link to={{ pathname: `${item.url}/${item.menu_id}` }}>
                      {" "}
                      {item.menu_name}{" "}
                    </Link>{" "}
                  </button>
                );
              })}
            </div>
          </Offcanvas.Body>
        </Offcanvas>
      </div>
    </div>
  );
}

const Submenu = ({ data }) => {
  return data.map((items, index) => (
    <div className="dropdown" key={index}>
      <Link
        to={{ pathname: `/${items.url}/${items.menu_id}` }}
        className="hyperlink dropdown-item"
      >
        {items.menu_name}
      </Link>
    </div>
  ));
};

export default HorizontalNavMenu;
