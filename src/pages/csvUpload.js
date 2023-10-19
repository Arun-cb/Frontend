import React, { useState, useContext, useEffect } from "react";
import Swal from "sweetalert2";
import AuthContext from "../context/AuthContext";
import {
  Card,
  Form,
  Col,
  FloatingLabel,
} from "react-bootstrap";
import { CSVLink } from "react-csv";

function FnCSVUpload() {
  let { authTokens, user } = useContext(AuthContext);
  const [file, setFile] = useState();
  const [filenamed, setFilenamed] = useState();
  const [table, setTable] = useState();
  const [error, setError] = useState({});

  const tables = {
    user_groups: ["Username", "User Group"],
    user: ["Password", "Username", "First name", "Last name", "Email"],
    currencies: ["Currency code", "Currency name", "Sign"],
    uom_masters: ["Uom Code", "Description"],
    config_codes: ["Config type", "Config code", "Config value"],
    org_functional_level: ["Hierarchy Level", "Hierarchy Name"],
    perspectives: ["Perspective Code", "Perspective", "Description"],
  };
  
  const data = [{}]; // Create an array with one empty object

  const headersFormatted =
    tables[table] &&
    tables[table].map((header) => ({
      label: header,
      key: header,
    })); // Format the headers for the CSVLink component

  const [csvReport, setCsvReport] = useState({
    data: data,
    headers: headersFormatted,
    filename: "table_format.csv",
  });

  useEffect(() => {
    const data = [{}]; // Create an array with one empty object
    const headersFormatted =
      tables[table] &&
      tables[table].map((header) => ({
        label: header,
        key: header,
      })); // Format the headers for the CSVLink component

    const csvJson = {
      data: data,
      headers: headersFormatted,
      filename: "table_format.csv",
    };

    setCsvReport(csvJson);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [table]);

  const ins_csv = async () => {
    const uploadData = new FormData();
    uploadData.append("file", file);
    uploadData.append("table", table);
    let res = await fetch(
      `${process.env.REACT_APP_SERVER_URL}/api/csv_insert/${user.user_id}/`,
      {
        method: "POST",
        body: uploadData,
        headers: {
          // 'Content-Type': 'application/json',
          Authorization: "Bearer " + String(authTokens.access),
        },
      }
    );
    let data = await res.json();
    if (res.status === 200) {
      Swal.fire({
        icon: "success",
        text: "CSV Data Inserted Successfully!",
      });
    } else {
      Swal.fire({
        icon: "error",
        text: "CSV Data Inserted failed!",
      });
      setError(data);
    }
  };

  const handleFileDrag = (evt) => {
    evt.preventDefault();
  };

  const handleFileDrop = (evnt) => {
    evnt.preventDefault();
    setFile(evnt.dataTransfer.files[0]);
    setFilenamed(evnt.dataTransfer.files.name);
  };

  return (
    <div className="w-100" style={{ height: "200px" }}>
      <div className="d-flex py-4 row">
        <Col className="" lg={6} sm={12}>
          <FloatingLabel controlId="" label="Select Table">
            <Form.Select size="sm" onChange={(e) => setTable(e.target.value)}>
              <option hidden>Open this select menu</option>
              {Object.keys(tables).map((itm, idx) => {
                return (
                  <option key={idx} value={itm}>
                    {itm}
                  </option>
                );
              })}
            </Form.Select>
          </FloatingLabel>
        </Col>
        <Col
          lg={6}
          sm={12}
          className={`align-items-center d-flex fw-semibold justify-content-end text-muted ${
            table ? "" : "d-none"
          }`}
        >
          {}
          <CSVLink {...csvReport}>Download Format</CSVLink>
        </Col>
      </div>
      <Card className="h-100 sc_cl_csv_card shadow">
        <Card.Body
          className="align-items-center card-body d-flex flex-column justify-content-center text-center"
          onDragOver={handleFileDrag}
          onDrop={handleFileDrop}
        >
          <p className="m-0">
            <strong>Drag and Drop Files here</strong>
          </p>
          <p className="m-0 py-1 text-muted">--or--</p>
          <label
            htmlFor="inputTag"
            className="sc_cl_button btn btn-sm btn-success"
          >
            Upload
            <input
              type="file"
              id="inputTag"
              className="sc_cl_input d-none"
              onChange={e => { setFile(e.target.files[0]);setFilenamed(e.target.files[0]["name"]) }}
            />
          </label>
          <p className="m-0 py-2 text-muted">{filenamed}</p>
        </Card.Body>
      </Card>
      
      <span className="sc_cl_span red mt-1">{error.error || ""}</span>

      <div className="py-4">
        <button
          className="sc_cl_button btn btn-sm btn-success fw-semibold px-4 py-2"
          value="submit"
          onClick={ins_csv}
        >
          Submit
        </button>
      </div>
    </div>
  );
}
export default FnCSVUpload;
