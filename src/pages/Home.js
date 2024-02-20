/* ============================================================================================================================================================

   CITTABASE SOLUTIONS - All Rights Reserved.
   ------------------------------------------------------------------------------------------------------------------------------------------------------------

   03-Aug-2022   Revan Rufus S      Initial Version             V1

   ** This Page is to define Home Page of the Application   **

============================================================================================================================================================*/

import React from "react";
import { Row, Card } from "react-bootstrap";
import FnBreadCrumbComponent from "../components/breadCrumbComponent";

const Home = () => {
  let breadcumb_menu = [{ Label: "Home" }];

  return (
    <div className="sc_cl_div w-100 px-2">
      <div className="d-flex flex-column flex-lg-row sc_cl_row sc_cl_page_header">
        <div className="align-items-center col-12 col-lg-6 d-flex py-2 text-center">
          <h5 className="sc_cl_head m-0">Home</h5>
        </div>

        <div className="align-items-center col-12 col-lg-6 d-flex justify-content-lg-end py-2 text-center">
          <FnBreadCrumbComponent
            seperator_symbol={" >"}
            nav_items={breadcumb_menu}
          />
        </div>
      </div>

      {/* <hr></hr> */}

    <Row>
    </Row>
      <Row className="d-flex px-1" id="myDiv">
      </Row>
    </div>
  );
};

export default Home;
