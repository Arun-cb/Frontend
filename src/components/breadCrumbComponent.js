/* =========================================================================================================================
   CITTIABASE SOLUTIONS - All Rights Reserved.
   ----------------------------------------------------------------------------------------------------------------------------

   29-MAR-2023  Revan Rufus S      Initial Version             V1

   ** This Component contains BreadCrumb Navigation with custom seperator and with default seperator**

==========================================================================================================================*/

import React from "react";
import { Link } from "react-router-dom";

export default function FnBreadCrumbComponent({ nav_items, seperator_symbol, clickevent }) {

    const seperator = seperator_symbol || '/';
    
    return (
        <>
            <nav>
                <ol className="d-flex list-unstyled m-0 sc_cl_breadcrum_ul" >
                    {
                        nav_items.map((items, index) =>
                        (
                            <li key={index} className="ms-1">
                                {items.Link ? <Link to={{
                                    pathname:`${items.Link}`
                                }} onClick={clickevent}>{items.Label}</Link> : <span className="text-muted">{items.Label}</span>}
                                {index < nav_items.length-1 ? <span>{seperator}</span>:''}
                            </li>
                        )
                        )
                    }
                </ol>
            </nav>
        </>
    )
}