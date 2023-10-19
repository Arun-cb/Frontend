/* ============================================================================================================================================================

   CITTABASE SOLUTIONS - All Rights Reserved.
   ------------------------------------------------------------------------------------------------------------------------------------------------------------

   19-Apr-2023   Jagadeshwaran R      Initial Version             V1

   ** This Page is to define Tooltip Reusable Component   **

============================================================================================================================================================*/

import React from "react";
import Tooltip from "react-bootstrap/Tooltip";
import OverlayTrigger from "react-bootstrap/OverlayTrigger";
import { BsInfoCircle } from "react-icons/bs";
// import Popover from "react-bootstrap/Popover";

//this functions were click event being handled
export default function FnTooltipComponent({ label, context, classname, placement }) {
  return (
    <OverlayTrigger

        placement={placement}
        // popperConfig={{modifiers:{preventOverflow:{boundriesElement:'viewport'}}}}
        overlay={
          <Tooltip>
            <i className="strong">{label}</i>
            <hr></hr>
            <i>
            {context}
            </i>
          </Tooltip>
        }
      >
        <i className="ms-1 sc_cl_helper_text">
          <BsInfoCircle />
        </i>
      </OverlayTrigger>
    // <div className="sc_cl_toottip">
    //   <i className="ms-1">
    //     <BsInfoCircle />
    //   </i>
    //   <div className="sc_cl_toottip_text">
    //     <div>
    //       <p className="fw-bold m-0">
    //         {label}
    //       </p>
    //     </div>
    //     <hr className="m-0 p-0 my-2"></hr>
    //     <div>
    //       <p className="m-0">
    //         {context}
    //       </p>
    //     </div>
    //   </div>
    // </div>
  )
}
//ends here