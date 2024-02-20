/* =========================================================================================================================
   CITTIABASE SOLUTIONS - All Rights Reserved.
   ----------------------------------------------------------------------------------------------------------------------------

   15-JUL-2023  Jagadeshwaran R      Initial Version             V1

   ** This Component contains Tab Layout **

==========================================================================================================================*/

import React, { useState, useContext, useRef, useEffect } from "react";
import { useParams } from "react-router-dom";

const FnTabComponent = ({ data }) => {
  const { id,tab } = useParams();

  const [getActiveTab, setActiveTab] = useState(Number(tab)); //Number(id)
  
  const openActiveTab = (tabId) => {
    setActiveTab(tabId);
  };
  useEffect(() =>{
    // openActiveTab();
    if(tab){
    setActiveTab(Number(tab))
    }
    else{
      setActiveTab(1);
    }
  },[tab])

  return (
    <div className="sc-cl-main-content">
      <ul className="nav nav-tabs" id="myTab" role="tablist">
        <li className="nav-item col-lg-10 d-flex" role="presentation">
          {data.map((tabItem) => (
            <div
              className={`nav-link d-flex flex-column justify-content-center align-items-center col-lg-3 
            ${
              getActiveTab === tabItem.id
                ? "active text-primary border-bottom-0"
                : "text-secondary active-tab"
            }`}
              id="home-tab"
              data-bs-toggle="tab"
              data-bs-target="#home"
              role="tab"
              aria-controls="home"
              aria-selected="true"
              key={tabItem.id}
              onClick={() => openActiveTab(tabItem.id)}
            >
              <div className="child-icon">{tabItem.icon}</div>
              <div className="mt-1 small child-label">{tabItem.label}</div>
            </div>
          ))}
        </li>
      </ul>

      <div
        className="border d-block tab-content border-top-0 myTabContent"
        // id="myTabContent"
        // style={{ height: "350px" }}
      >
        {data.map(
          (tabOptions) =>
            getActiveTab === tabOptions.id && (
              <div
                key={tabOptions.id}
                className="tab-pane fade show active"
                role="tabpanel"
                aria-labelledby="home-tab"
              >
                {tabOptions.content}
              </div>
            )
        )}
      </div>
    </div>
  );
};

export default FnTabComponent;
