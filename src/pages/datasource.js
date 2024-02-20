/* =========================================================================================================================
   CITTIABASE SOLUTIONS - All Rights Reserved.
   ----------------------------------------------------------------------------------------------------------------------------

   15-JUL-2023  Jagadeshwaran R      Initial Version             V1

   ** DB Configurtation page contains Single sign on Functionalities Parameter passing page **

==========================================================================================================================*/

import React, { useState, useContext, useEffect } from "react";
import FnBreadCrumbComponent from "../components/breadCrumbComponent";
import AuthContext from "../context/AuthContext";
import FnTabComponent from "../components/tabComponent";
import { useNavigate, useParams } from "react-router-dom";
// import FnReportBuilder from "./databaseconnection";
import { BsDatabaseFillAdd } from "react-icons/bs";
import { TbApi } from "react-icons/tb";
import FnRestfulConnection from "./restfulConnection";
import FnConnectionDefinition from "./connectionDefinitionReport";

const FnDataSource = () => {
    let { authTokens, user } = useContext(AuthContext);
    const [view, setView] = useState();
    const { id } = useParams();
    const navigator = useNavigate();

    let breadcumb_menu = [
        { Label: "Home", Link: "/" },

        {
            Label: "Data Source",
        },
    ];

    const tabOptions = [
        {
            id: 1,
            label: "Connection Setup",
            icon: <BsDatabaseFillAdd size={20} />,
            content: <FnConnectionDefinition />,
        // {
        //     id: 1,
        //     label: "Database Connection",
        //     icon: <BsDatabaseFillAdd size={20} />,
        //     content: <FnReportBuilder />,
        },
        // {
        //     id: 2,
        //     label: "Restful Connection",
        //     icon: <TbApi size={20} />,
        //     content: <FnRestfulConnection />,
        // },
        // {
        //   id: 3,
        //   label: "Session Management",
        //   icon: <PiClockClockwise  size={25} />,
        //   content: <FnSessionConfiguration />,
        // },
    ];

    return (//sc_cl_page_header
        <div className="sc_cl_div w-100 px-2">
            <div className="d-flex flex-column flex-lg-row sc_cl_row sc_cl_page_header">
                <div className="align-items-center col-12 col-lg-6 d-flex py-2 text-center">
                    <h5 className="sc_cl_head m-0">Data Source</h5>
                </div>

                <div className="align-items-center col-12 col-lg-6 d-flex justify-content-lg-end py-2 text-center">
                    <FnBreadCrumbComponent
                        seperator_symbol={" >"}
                        nav_items={breadcumb_menu}
                    />
                </div>
            </div>

            {/* <hr></hr> */}

            <FnTabComponent data={tabOptions} />
        </div>
    );
};

export default FnDataSource;
