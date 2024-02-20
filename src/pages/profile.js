/* =========================================================================================================================
   CITTIABASE SOLUTIONS - All Rights Reserved.
   ----------------------------------------------------------------------------------------------------------------------------

   20-AUG-2023  Jagadeshwaran R      Initial Version             V1

   ** User Profile page contains user info and other options **

==========================================================================================================================*/

import React from "react";
import { FaUser } from "react-icons/fa";
import { BsDatabaseFillAdd } from "react-icons/bs";
import { MdOutlineSettingsSuggest, MdPassword, MdQueryBuilder } from "react-icons/md";
import { TbReportAnalytics, TbReport } from "react-icons/tb";
import FnCreateUserReport from "./createUserReport";
import ChangePassword from "./ChangePassword";
import FnSettingsForm from "./settings";
import FnTabComponent from "../components/tabComponent";
import FnBreadCrumbComponent from "../components/breadCrumbComponent";
// ! Test
import FnUser from "./user";
import FnReportBuilder from "./databaseconnection";


const FnProfilePage = () => {
  let breadcumb_menu = [
    { Label: "Home", Link: "/" },

    {
      Label: "User Profile",
    },
  ];

  const tabOptions = [
    {
      id: 1,
      label: "User Profile",
      icon: <FaUser size={20} />,
      content: <FnUser />,
    },
    {
      id: 2,
      label: "Settings",
      icon: <MdOutlineSettingsSuggest size={25} />,
      content: <FnSettingsForm />,
    },
    {
      id: 3,
      label: "Change Password",
      icon: <MdPassword size={25} />,
      content: <ChangePassword />,
    },
    // {
    //   id: 4,
    //   label: "Database Connection",
    //   icon: <BsDatabaseFillAdd size={20} />,
    //   content: <FnReportBuilder />,
    // },
  ];

  return (//sc_cl_page_header
    <div className="sc_cl_div w-100 px-2">
      <div className="d-flex flex-column flex-lg-row sc_cl_row sc_cl_page_header">
        <div className="align-items-center col-12 col-lg-6 d-flex py-2 text-center">
          <h5 className="sc_cl_head m-0">User Profile</h5>
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

export default FnProfilePage;
