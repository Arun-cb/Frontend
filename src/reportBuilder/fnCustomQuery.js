import { useState, useEffect, useRef } from "react";
import Swal from "sweetalert2";
import { Accordion, Button, Card, Modal, Table, Form, FormGroup, Col, FormLabel, FormSelect } from "react-bootstrap";
import FnBtnComponent from "../components/buttonComponent";
import FnExportComponent from "../components/ExportComponent";
import FnTableComponent from "../components/tableComponent";



const FnETLProcess = ({authTokens, getselectedConnections, getquerydata, etl, setETL}) => {

    const columns_type = [];
    const date_columns = [];
    const [action, setAction] = useState(null);
    const [etlData, setETLData] = useState([]);
    const [etlColumns, setETLColumns] = useState([]);
    const [loading, setLoading] = useState(false);
    const [adata, setAdata] = useState({})
  
    const findandreplace = () => {
      setAction("Find and Replace")
    }
  
    const GetQuerydataforETL = async () => {
      setLoading(true)
      let updatedSelectedConnections = { ...getselectedConnections };
  
      // if (!updatedSelectedConnections.query_text) { }
      updatedSelectedConnections.query_text = getquerydata.query_text;
      // else { }
      
      let fetchTableRequest = await fetch(
        `${process.env.REACT_APP_SERVER_URL}/api/get_query_result`,
        {
          method: "POST",
          body: JSON.stringify(updatedSelectedConnections),
          headers: {
            "Content-Type": "application/json",
            Authorization: "Bearer " + String(authTokens.access),
          },
        }
      );
      let fetchTablenResults = await fetchTableRequest.json()
  
      if (fetchTableRequest.status === 200) {
        // setETLColumns(fetchTablenResults[0]["columns"])
        setETLData(fetchTablenResults[0]["data"])
        if(fetchTablenResults[0]["data"].length >= 1){
          setETLColumns(Object.keys(fetchTablenResults[0]["data"][1]).map(key => key))
        }
      }
      setLoading(false)
    }
  
    const fnLoadData = async(fun) => {
      // setLoading(true)
      let fetchTableRequest = await fetch(
        `${process.env.REACT_APP_SERVER_URL}/api/load_data`,
        {
          method: "POST",
          body: JSON.stringify({'function':fun,'params':adata,'etldata':etlData}),
          headers: {
            "Content-Type": "application/json",
            Authorization: "Bearer " + String(authTokens.access),
          },
        }
      );
      let fetchTablenResults = await fetchTableRequest.json()
  
      if (fetchTableRequest.status === 200) {
        setETLData(fetchTablenResults)
        if(fetchTablenResults.length >= 1){
          setETLColumns(Object.keys(fetchTablenResults[1]).map(key => key))
        }
        // setAdata({})
      }
      // setTimeout(() => {
      //   setLoading(false)
      // }, 800);
    }
  
    const InputHandler = (e) => {
      setAdata({
        ...adata, [e.target.name]:e.target.value
      })
    }
  
    useEffect(() => {
      GetQuerydataforETL()
    },[])
  
    return (
      <div>
          <div className="col-12">
            {/* <h6>Transform Data</h6>
            <hr></hr> */}
            <div className="d-flex gap-5 p-2 bg-light">
            <div className="d-flex flex-column">
              <span className="cursor-pointer" onClick={() => findandreplace()}>Find & Replace</span>
              <span onClick={() => setAction('Merge Columns')}>Merge Columns</span>
              <span>Split</span>
            </div>
            <div className="d-flex flex-column">
              <span>Drop</span>
            </div>
            </div>
            <hr></hr>
            <div className="sc_cl_div col-10 m-auto">
              <table className="sc_cl_etl_table">
                <thead className="sc_cl_etl_thead">
                  <th style={{width:'40px'}}>#</th>
                  {
                    etlColumns.map((d, i) => (
                      <th key={i}>{d.replaceAll("_", " ")}</th>
                    ))
                  }
                </thead>
                <tbody className="sc_cl_etl_tbody">
                  {
                    loading ? 
                      <td colSpan="10" className="sc_cl_tr border-bottom-0">
                        Loading...
                      </td>
                    :
                    etlData.length > 0 ?
                    etlData.map((data, index) => (
                      <>
                        <tr key={data.id}>
                          <td style={{width:'40px'}}>{index+1}</td>
                          {etlColumns &&
                            etlColumns.map((v, index) => {
      
                              return (
                                <td
                                  key={v}
                                  className={`sc_cl_td 
                                  ${columns_type[index] === "int" ? "text-end" : ""}
                                  ${columns_type[index] === "str" ? "text-start" : ""}
                                  ${columns_type[index] === "date" ? "text-start" : ""}`}
                                >
                                  {data[v]}
                                </td>
                              );
                            })}
                        </tr>
                      </>
                      ))
                    : 
                    <tr className="sc_cl_tr text-center ">
                      <td colSpan="10" className="sc_cl_tr text-danger border-bottom-0">
                        No Data Found
                      </td>
                    </tr>
                  }
                </tbody>
              </table>
            </div>
            {
            action !== null && 
            action === 'Find and Replace' && 
              <div className="m-auto col-9 rounded bg-white my-3 p-2">
                <h6>{action}</h6>
                <hr></hr>
                Column : 
                <select name="column" onChange={(e) => InputHandler(e)}>
                  <option value={''} selected>-- select --</option>
                  {
                    etlColumns.map((c,i) => (
                      <option value={c}>{c}</option>
                    ))
                  }
                </select>
                <div className="py-2">
                  Find : <input type="text" name="find" onChange={(e) => InputHandler(e)}></input>
                  Replace : <input type="text" name="replace" onChange={(e) => InputHandler(e)}></input>
                </div>
  
                <div>
                <FnBtnComponent
                  onClick={() => {
                    // handleNext(rightItems, getselectedItems, getSelectedColumn, rows, getjoinrows, query, 2);
                    // setSelectedConnections({ ...getselectedConnections, savedConnectionItems: '', query_name: '' });
                    // setQueryData({ query_text: '' })
                    fnLoadData(action)
                  }}
                  children={"Load"}
                  classname={"sc_cl_submit_button my-3"} size={"sm"} />
                </div>
              </div>
            }
            {
            action !== null && 
            action === 'Merge Columns' && 
              <div className="m-auto col-9 rounded bg-white my-3 p-2">
                <h6>{action}</h6>
                <hr></hr>
                  Column Name : 
                  <input className="h-100 mx-2" type="text" name="columnname" onChange={(e) => InputHandler(e)}></input>
                <div className="py-2">
                  Column 1 : 
                      <select className="h-100 mx-2" name="column1" onChange={(e) => InputHandler(e)}>
                        <option value={''} selected>-- select --</option>
                        {
                          etlColumns.map((c,i) => (
                            <option value={c}>{c}</option>
                          ))
                        }
                      </select>
  
                  <input className="text-center small-button h-100 mx-2" type="text" name="split" placeholder="Split Charactor" onChange={(e) => InputHandler(e)}></input>
                  Column 2 : 
                      <select className="h-100 mx-2" name="column2" onChange={(e) => InputHandler(e)}>
                        <option value={''} selected>-- select --</option>
                        {
                          etlColumns.map((c,i) => (
                            <option value={c}>{c}</option>
                          ))
                        }
                      </select>
                  {/* Column 2 : <input type="text" name="column2" onChange={(e) => InputHandler(e)}></input> */}
                </div>
  
                <div>
                <FnBtnComponent
                  onClick={() => {
                    // handleNext(rightItems, getselectedItems, getSelectedColumn, rows, getjoinrows, query, 2);
                    // setSelectedConnections({ ...getselectedConnections, savedConnectionItems: '', query_name: '' });
                    // setQueryData({ query_text: '' })
                    fnLoadData(action)
                  }}
                  children={"Load"}
                  classname={"sc_cl_submit_button my-3"} size={"sm"} />
                </div>
              </div>
            }
            <div>
            </div>
          </div>
      </div>
    )
  }



const FnCustomQuery = ({ authTokens, leftItems, setLeftItems, userSettings, getedit, setEdit, 
    getstepCount, setstepCount, etl, setETL,handlePrev, getalldata, setAlldata }) => {
  
    // const [getquery, setQuery] = useState([]);
    const [getquerydata, setQueryData] = useState([]);
  
    const [getqueryresult, setQueryResult] = useState([]);
  
    const [getquerydataresults, setQueryDataResults] = useState([]);
  
    const [geterrorcode, setErrorCode] = useState([]);
  
    let [search, setSearch] = useState("");
  
    // let columns_to;
    const [bol_v, setBol_V] = useState(false);
  
    const [etlcolumns, setETLColumns] = useState([]);
    const [etldata, setETLData] = useState([]);
  
    const textareaRef = useRef(null);
  
    const [startingIndex, setStartingindex] = useState(0);
    const PageSize =
      userSettings && userSettings.pagination
        ? userSettings.pagination
        : process.env.REACT_APP_PAGINATION;
    const endingIndex = startingIndex + Number(PageSize);
  
    useEffect(() => {
      handleGetSchemaTables()
    }, [endingIndex, startingIndex, PageSize])
  
    const handleGetSchemaTables = async () => {
  
      let updatedSelectedConnections = { ...getalldata["Page1"] };
  
      updatedSelectedConnections.query_type = true;
  
    //   setSelectedConnections(updatedSelectedConnections)
  
      let fetchTableRequest = await fetch(
        `${process.env.REACT_APP_SERVER_URL}/api/get_connected_tables`,
        {
          method: "POST",
          body: JSON.stringify(updatedSelectedConnections),
          headers: {
            "Content-Type": "application/json",
            Authorization: "Bearer " + String(authTokens.access),
          },
        }
      );
      let fetchTablenResults = await fetchTableRequest.json()
  
      if (fetchTableRequest.status === 200) {
        setLeftItems(fetchTablenResults)
      }
    }
  
    const handleValidateQuery = async () => {
        if (getquerydata.length !== 0 && getquerydata.query_text !== ''){
            let updatedSelectedConnections = { ...getalldata['Page1'] };
            updatedSelectedConnections.query_text = getquerydata.query_text;
            setAlldata({...getalldata, ['Page1']: updatedSelectedConnections})
            
            let fetchTableRequest = await fetch(
                `${process.env.REACT_APP_SERVER_URL}/api/get_query_result`,
                {
                method: "POST",
                body: JSON.stringify(updatedSelectedConnections),
                headers: {
                    "Content-Type": "application/json",
                    Authorization: "Bearer " + String(authTokens.access),
                },
                }
            );
            let fetchTablenResults = await fetchTableRequest.json()
        
            if (fetchTableRequest.status === 200) {
                setQueryResult([{ "columns": fetchTablenResults[0]["columns"], "data": fetchTablenResults[0]["data"].slice(0, 10) }]);
                setErrorCode("Query Executed Successfully");
            }
            else {
                setErrorCode(fetchTablenResults)
                setBol_V(false)
            }
        }else{
            setErrorCode({error : "Please write completed query here"})
        }
    }

  
    // const GetQuerydataforETL = async () => {
    //   let updatedSelectedConnections = { ...getselectedConnections };
  
    //   // if (!updatedSelectedConnections.query_text) { }
    //   updatedSelectedConnections.query_text = getquerydata.query_text;
    //   // else { }
  
    //   setSelectedConnections(updatedSelectedConnections);
      
    //   let fetchTableRequest = await fetch(
    //     `${process.env.REACT_APP_SERVER_URL}/api/get_query_result`,
    //     {
    //       method: "POST",
    //       body: JSON.stringify(updatedSelectedConnections),
    //       headers: {
    //         "Content-Type": "application/json",
    //         Authorization: "Bearer " + String(authTokens.access),
    //       },
    //     }
    //   );
    //   let fetchTablenResults = await fetchTableRequest.json()
  
    //   if (fetchTableRequest.status === 200) {
    //     setETLColumns(fetchTablenResults[0]["columns"])
    //     setETLData(fetchTablenResults[0]["data"])
    //   }
    //   else {
    //     setErrorCode(fetchTablenResults)
    //   }
    // }
  
    const handleSaveQuery = async (status) => {
  
      let updatedSelectedConnections = { ...getalldata["Page1"] };
  
      // updatedSelectedConnections.custom_query = true;
      updatedSelectedConnections.query_text = getquerydata.query_text;
      updatedSelectedConnections.query_status = status;
      // else { }
  
    //   setSelectedConnections(updatedSelectedConnections);
  
      if (status) {
        let fetchTableRequest = await fetch(
          `${process.env.REACT_APP_SERVER_URL}/api/get_query_result`,
          {
            method: "POST",
            body: JSON.stringify(updatedSelectedConnections),
            headers: {
              "Content-Type": "application/json",
              Authorization: "Bearer " + String(authTokens.access),
            },
          }
        );
        let fetchTablenResults = await fetchTableRequest.json()
  
        if (fetchTableRequest.status === 200) {
          let custom_query_Request = await fetch(
            `${process.env.REACT_APP_SERVER_URL}/api/ins_save_connection_data`,
            {
              method: "POST",
              body: JSON.stringify(updatedSelectedConnections),
              headers: {
                "Content-Type": "application/json",
                Authorization: "Bearer " + String(authTokens.access),
              },
            }
          );
          let custom_query_Results = await custom_query_Request.json()
          if (custom_query_Request.status === 201) {
            Swal.fire({
              icon: "success",
              text: "Saved Successfully!",
            }).then(function () {
              if ("caches" in window) {
                caches
                  .delete("QueryBuilder")
                  .then(function (res) {
                    return res;
                  });
              }
              setAlldata({})
              setErrorCode()
              setstepCount(1)
            });
          } else {
            setErrorCode(fetchTablenResults)
          }
        }
        else { setErrorCode(fetchTablenResults) }
      }
      else {
  
  
        let custom_query_Request = await fetch(
          `${process.env.REACT_APP_SERVER_URL}/api/ins_save_connection_data`,
          {
            method: "POST",
            body: JSON.stringify(updatedSelectedConnections),
            headers: {
              "Content-Type": "application/json",
              Authorization: "Bearer " + String(authTokens.access),
            },
          }
        );
        let custom_query_Results = await custom_query_Request.json()
        if (custom_query_Request.status === 201) {
          Swal.fire({
            icon: "success",
            text: "Saved Successfully!",
          }).then(function () {
            if ("caches" in window) {
              caches
                .delete("QueryBuilder")
                .then(function (res) {
                  return res;
                });
            }
            setErrorCode()
            setstepCount(1)
          });
        } else {
          setErrorCode({ 'error': "Query can't be blank" })
        }
      }
    }
  
    //  Function for updating Connection details
    const fnUpdateDetails = async (status) => {
  
      let updatedSelectedConnections = { ...getalldata["Page1"] };
  
      updatedSelectedConnections.query_text = getquerydata.query_text;
      updatedSelectedConnections.query_status = status;
  
    //   setSelectedConnections(updatedSelectedConnections);
  
      if (status) {
        let fetchTableRequest = await fetch(
          `${process.env.REACT_APP_SERVER_URL}/api/get_query_result`,
          {
            method: "POST",
            body: JSON.stringify(updatedSelectedConnections),
            headers: {
              "Content-Type": "application/json",
              Authorization: "Bearer " + String(authTokens.access),
            },
          }
        );
        let fetchTablenResults = await fetchTableRequest.json()
  
        if (fetchTableRequest.status === 200) {
          let res = await fetch(
            `${process.env.REACT_APP_SERVER_URL}/api/upd_connection_data/${updatedSelectedConnections.id}/`,
            {
              method: "PUT",
              body: JSON.stringify(updatedSelectedConnections),
              headers: {
                "Content-Type": "application/json",
                Authorization: "Bearer " + String(authTokens.access),
              },
            }
          );
          let data = await res.json();
          if (res.status === 201) {
            Swal.fire({
              icon: "success",
              text: "Updated Successfully!",
            }).then(function () {
              if ("caches" in window) {
                caches
                  .delete("QueryBuilder")
                  .then(function (resp) {
                    return resp;
                  });
              }
              setErrorCode();
              setEdit(false);
              setstepCount(1);
            });
          } else {
            setErrorCode(fetchTablenResults)
          }
        } else {
          setErrorCode(fetchTablenResults)
        }
      }
  
      else {
  
  
        let res = await fetch(
          `${process.env.REACT_APP_SERVER_URL}/api/upd_connection_data/${updatedSelectedConnections.id}/`,
          {
            method: "PUT",
            body: JSON.stringify(updatedSelectedConnections),
            headers: {
              "Content-Type": "application/json",
              Authorization: "Bearer " + String(authTokens.access),
            },
          }
        );
        let custom_query_Results = await res.json()
        if (res.status === 201) {
          Swal.fire({
            icon: "success",
            text: "Updated Successfully!",
          }).then(function () {
            if ("caches" in window) {
              caches
                .delete("QueryBuilder")
                .then(function (res) {
                  return res;
                });
            }
            setErrorCode();
            setEdit(false);
            setstepCount(1);
          });
        } else {
          setErrorCode({ 'error': "Query can't be blank", custom_query_Results })
        }
      }
    };
  
    const handleselect = (id, table) => {
      const textarea = textareaRef.current;
  
      // Get the current cursor position
      const cursorPosition = textarea.selectionStart;
  
      // Split the query_text into two parts at the cursor position
      const queryBeforeCursor = getquerydata.query_text.substring(0, cursorPosition);
      const queryAfterCursor = getquerydata.query_text.substring(cursorPosition);
  
      // Insert the selected table name at the cursor position
      const updatedQuery = `${queryBeforeCursor} ${table} ${queryAfterCursor}`;
  
      // Update the state with the new query_text
      setQueryData((prevQueryData) => ({
        ...prevQueryData,
        query_text: updatedQuery,
      }));
  
      // Set the cursor position after the inserted table name
      textarea.setSelectionRange(cursorPosition + table.length + 2, cursorPosition + table.length + 2);
  
      // setQueryData((prevQueryData) => ({
      //   ...prevQueryData,
      //   query_text: `${prevQueryData.query_text} ${table}`,
      // }));
    }
  
    let columns_to = [...getqueryresult.map((d) => d.columns)]
    let newadata = [...getqueryresult.map((d) => d.data)]
    const columns_type = [];
    const date_columns = [];
  
    let [sortcolumn, setSortColumn] = useState("");
    let [sortorder, setSortOrder] = useState(true);


    useEffect(() => {
        if(getalldata['Page1']['query_text']){
            setQueryData({'query_text': getalldata['Page1']['query_text']})
        }
    },[])
  
    return (
      <div>
        {
          etl ? 
          <FnETLProcess
            // data={etldata}
            // columns={etlcolumns}
            authTokens={authTokens}
            getselectedConnections={getalldata["Page1"]}
            getquerydata={getquerydata}
            etl={etl} setETL={setETL}
          /> : 
          <>
            <div>
              <Form>
                <Form.Group className={"d-flex gap-4 mx-4"}>
                <div className="w-75 d-flex flex-column gap-1 bg-white p-3 rounded">
                  <div className="sc_cl_label">Query Name : <span className="text-primary">{getalldata['Page1'].query_name}</span></div>
                  <Form.Control
                    ref={textareaRef}
                    as={"textarea"} // Setting the type to "textarea"
                    // style={{ resize: 'none' }}
                    // placeholder={items.placeholder} // Placeholder text for the textarea
                    value={getquerydata.query_text} // Value of the textarea taken from formData
                    name={"query_text"} // Name of the textarea input
                    onChange={(e) => setQueryData({ [e.target.name]: e.target.value })}
                    disabled={false} // Whether the textarea should be disabled or not
                    className='sc_cl_query_text' // Additional class for custom styling (optional)
                    // size="sm" // Size of the textarea, e.g., "sm", "lg", etc.
                    // maxLength={""} // Maximum character length for the textarea
                    // style={{ height: '300px', width: '600px!important' }}
                    autoComplete="off" // Disable browser autoComplete for the textarea
                  />
                </div>
                <div className="w-50 d-flex flex-column gap-1 align-items-center bg-white p-3">
                  <div className="w-50 sc_cl_label">Available Tables</div>
                  <div className="qb_list_selector_container shadow-sm px-3 w-50" style={{ background: '#d3d3d357', height: '300px', overflowX: 'auto', overflowY: 'auto' }}>
                    <ul className="list-unstyled">
                      {leftItems.map((item, tableIndex) => (
                        <li
                          key={item.table_id}
                          onDoubleClick={(e) => handleselect(item.table_id, item.table_name)}
                          className={getquerydata?.query_text?.includes(item.table_name) ? 'selected' : ''}
                        >
                          {item.table_name}
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>
  
                </Form.Group>
              </Form>
  
              <span className={`${geterrorcode?.error ? "red" : "text-success"} sc_cl_span mx-4 my-3 small w-50`} >
                {geterrorcode && geterrorcode.error ? geterrorcode.error : geterrorcode}
              </span>
              {geterrorcode && geterrorcode == "Query Executed Successfully" ?
                <div className="mx-4">
                  <FnBtnComponent children={"Preview Result"} onClick={() => setBol_V(true)} classname={"sc_cl_submit_button mb-3"} />
                  <FnBtnComponent children={"Transform Data"} onClick={() => setETL(true)} classname={"sc_cl_submit_button mb-3 ms-2"} />
                </div>
                : ''
              }
  
              {/* <div className="align-items-center d-flex justify-content-start mt-2 sc_cl_div"> */}
              <div className="d-flex mx-4 sc_cl_div">
                <FnBtnComponent children={"Run"} onClick={() => handleValidateQuery()} classname={"sc_cl_submit_button"} />
                {(getedit ? (
                  <>
                    <FnBtnComponent children={"Back"} onClick={() => handlePrev(getstepCount)} classname={"sc_cl_close_button ms-2"} />
                    <FnBtnComponent onClick={() => fnUpdateDetails(false)} classname={"sc_cl_submit_button ms-2"} children={"Update as Draft"} />
  
                    <FnBtnComponent onClick={() => fnUpdateDetails(true)} classname={"sc_cl_submit_button ms-2"} children={"Update"} />
                  </>
                ) : (
                  <div className="align-item-end">
                    <FnBtnComponent children={"Back"} onClick={() => handlePrev(getstepCount)} classname={"sc_cl_close_button ms-2"} />
                    <FnBtnComponent children={"Save as Draft"} onClick={() => handleSaveQuery(false)} classname={"sc_cl_close_button ms-2"} />
  
                    <FnBtnComponent children={"Save"} onClick={() => handleSaveQuery(true)} classname={"sc_cl_update_button ms-2"} />
                  </div>
                ))}
              </div>
  
            </div>
  
            {bol_v ? (
              <Card className="overflow-hidden border-0">
                <div className="sc_cl_row card-header">
                  <div className="sc_cl_div d-flex justify-content-end">
                    <input
                      type='text'
                      className='sc_cl_Search px-3 me-2'
                      placeholder='Search'
                      value={search || ''}
                      onChange={(e) => {
                        setSearch(e.target.value)
                      }}
                    />
  
                    <FnExportComponent
                      data={newadata[0]}
                      columns={columns_to[0]}
                      csvdata={newadata[0]}
                    />
                  </div>
                </div>
  
                <div className="sc_cl_div">
                  <FnTableComponent
                    data={newadata[0]}
                    csv_export={"csvdata"}
                    data_length={Number(50)}
                    page_size={PageSize}
                    columns_in={columns_to[0]}
                    date_columns={date_columns}
                    columns_type={columns_type}
                    start={setStartingindex}
                    // close={setQueryDataResults}
                    // updates={setQueryDataResults}
                    // load={setQueryDataResults}
                    // add={setQueryDataResults}
                    // view={setQueryDataResults}
                    menu_id={101}
                    // diverts={setQueryDataResults}
                    api_name={"del_currencies"}
                    action={false}
                    searchWord={search}
                    pagination={false}
                    custom_action={false}
                    sortcolumn={sortcolumn}
                    setSortColumn={setSortColumn}
                    sortorder={sortorder}
                    setSortOrder={setSortOrder}
                    sorting={true}
                  />
                </div>
  
              </Card>) :
              ""}
          </>
        }
  
      </div>
    )
  }

  export default FnCustomQuery