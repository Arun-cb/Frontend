import React, { useState,useContext } from "react";
import AuthContext from "../context/AuthContext";
import { Accordion, Card, Col, Row } from "react-bootstrap";
import { BiChevronRight, BiChevronDown } from "react-icons/bi";
import { FiEdit } from "react-icons/fi";
import { RiDeleteBin6Line } from "react-icons/ri";
import { fnDeleteDetails } from "../pages/master/currenciesReport";

const Fnmobilereport = ({ data }) => {
  let { authTokens } = useContext(AuthContext);
  const [flag, setFlag] = useState([]);
  let api_name = "del_perspectives"
  let load = false

  return (
    <>
      <Card.Header className=" d-flex justify-content-between sc_cl_th">
        <p>perspective</p>
        <p>Action</p>
      </Card.Header>

      {data.map((item, index) => (
        <div key={index}>
          <Card.Header
            className="align-items-center d-flex fw-normal justify-content-between"
            onClick={() => {
              let test = [...flag];
              test[index] = test[index] ? !test[index] : true;
              setFlag(test);
            }}
          >
            <div className="sc_cl_td_accordion">{item.perspective}</div>
            <div className="d-flex">
              <FiEdit className="sc_cl_table_icons text-success" />
              <RiDeleteBin6Line
                className="sc_cl_table_icons ms-2 text-danger"
                onClick={() =>
                  fnDeleteDetails(data.id, authTokens, load, api_name)
                }
              />
              {true ? (
                <BiChevronDown className="Icon ms-2" />
              ) : (
                <BiChevronRight className="Icon ms-2" />
              )}
            </div>
          </Card.Header>
          <Accordion className={`collapse ${flag[index] ? "show" : ""}`}>
            <Card.Body>
              {Object.entries(item).map(([key, value]) => {
                if (
                  key !== "id" &&
                  key !== "perspective" &&
                  key !== "created_by" &&
                  key !== "last_updated_by"
                ) {
                  return (
                    <div key={key} className="d-flex sc_cl_td_accordion">
                      <p className="sc_cl_keyrespo">{key}</p>
                      <p>{value}</p>
                    </div>
                  );
                }
              })}
            </Card.Body>
          </Accordion>
        </div>
      ))}
    </>
  );
};

export default Fnmobilereport;