import React, { useContext, useEffect, useState, useRef } from "react";
import ReactDOMServer from 'react-dom/server';
import AuthContext from "../context/AuthContext";
import PreContext from "../context/PreContext";
import { useNavigate, useParams } from "react-router-dom";
import Select from "react-select";
import Parser from "html-react-parser";
import Swal from "sweetalert2";

import { Accordion, Button, Card, Modal, Table, Form, FormGroup, Col, FormLabel, FormSelect } from "react-bootstrap";

import { BiChevronLeft, BiChevronRight, BiSolidChevronsLeft, BiSolidChevronsRight, BiSortAZ, BiSortZA } from "react-icons/bi";
import { RiDeleteBin6Line, RiErrorWarningLine, RiDeleteRow, RiFileUserLine } from "react-icons/ri";
import { FaRegCircleCheck, FaCreativeCommonsShare } from "react-icons/fa6";
import { FiEdit, FiCopy, FiShare2, FiEye, FiEyeOff } from "react-icons/fi";
import { MdKeyboardArrowUp, MdKeyboardArrowDown, MdOutlinePreview, MdAnalytics, MdOutlineAnalytics, MdFindReplace } from "react-icons/md";
import { TbShareOff, TbCopyOff, TbEditOff } from "react-icons/tb";
import { SiMysql, SiOracle, SiSnowflake } from "react-icons/si";

import FnBtnComponent from "../components/buttonComponent";
import FnBreadCrumbComponent from "../components/breadCrumbComponent";
import FnExportComponent from "../components/ExportComponent";
import FnTableComponent from "../components/tableComponent";
import FnTabComponent from "../components/tabComponent";
import FnToastMessageComp from "../components/toastMessageComponent";
import FnYDataProfiling from "./ydataprofiling";
import FnRestConnection from "./restConnection";
import FnCustomQuery from "./fnCustomQuery";

const FnStepReportBuilder = () => {

  // URL Unique id
  const { id } = useParams();
  let { userSettings } = useContext(PreContext);

  // Step Counter State To Navigate through Pages
  const [getstepCount, setstepCount] = useState(1);

  // Auth Tokens
  let { authTokens, user } = useContext(AuthContext);

  // To Save DB Connection Data in a State
  const [getSavedConnections, setSavedConnections] = useState([])
  const [getconnectiondbstr, setconnectionstr] = useState([])
  const [getsavedQueryDefinition, setSavedQueryDefinition] = useState([])

  // Selected Connection State (Page1)
  const [getselectedConnections, setSelectedConnections] = useState({
    created_user: user.username,
    created_by: user.user_id,
    last_updated_by: user.user_id,
  });

  // Table Shuttle state (Page2)
  const [leftItems, setLeftItems] = useState([])
  const [getselectedLeftItems, setSelectedLeftItems] = useState([])

  const [rightItems, setRightItems] = useState([])
  const [getselectedRightItems, setSelectedRightItems] = useState([])

  const [getpostedTables, setPostedTables] = useState([])

  // Column Selection TrasformData
  const [getsavedTables, setSavedTables] = useState([]);
  const [getalldata, setAlldata] = useState([]);
  const [getColumnWithTabeID, setColumnWithTabeID] = useState([]);
  const [getSelectedColumn, setSelectedColumn] = useState({});
  const [getselectedItems, setSelectedItems] = useState([]);

  // Column Alias  state
  const [getcolumnalias, setColumnAlias] = useState([]);

  // Aggregate Column State
  const [rows, setRows] = useState([])

  // State to store all columns data for Join and Filter
  const [getallcolumns, setAllColumns] = useState([]);

  // Join Column State
  const [getjoinrows, setJoinRows] = useState([]);

  // Column Filter
  const [query, setQuery] = useState([]);

  // Query Generator
  const [getopenquerygenerator, setOpenQueryGenerator] = useState(null)

  // Custom Query
  const [getquerydata, setQueryData] = useState([]);

  // Cache Show and Hide Popup Modal State
  const [show, setShow] = useState(false);

  // Error Validation
  const [geterror, setError] = useState([]);
  // cache data set and get state
  const [getcacheData, setCacheData] = useState([])

  // Edit State
  const [getedit, setEdit] = useState(false);

  // Edit Data State 
  const [geteditquery, setEditQuery] = useState([]);

  const [getquerydatafullresults, setquerydatafullresults] = useState([])

  const [getactivateButtons, setActiveButtons] = useState(false)

  const [gettoastMessage, setToastMessage] = useState(false)

  const [showComponent, setShowComponent] = useState(false);
  const [etl, setETL] = useState(false);
  const [mode, setMode] = useState('');


  // step wizard
  const stepCounter = [
    { id: 2, stepName: 'Query Definition' },
    { id: 3, stepName: 'Table Selection' },
    { id: 4, stepName: 'Column Selection' },
    { id: 5, stepName: 'Column Alias' },
    { id: 6, stepName: 'Aggregate Operation' },
    { id: 7, stepName: 'Join Operation' },
    { id: 8, stepName: 'Column Filter' }
  ];
  // const stepCounter = [
  //   { id: 1, stepName: 'Query Definition' },
  //   { id: 2, stepName: 'Table Selection' },
  //   { id: 3, stepName: 'Column Selection' },
  //   { id: 4, stepName: 'Column Alias' },
  //   { id: 5, stepName: 'Aggregate Operation' },
  //   { id: 6, stepName: 'Join Operation' },
  //   { id: 7, stepName: 'Column Filter' }
  // ];

  let breadcumb_menu = [
    { Label: "Home", Link: "/" },

    {
      Label: "Report Builder",
    },
  ];


  useEffect(() => {
    fetchSavedConnections();

    const cacheName = 'QueryBuilder';

    const checkCache = async () => {
      if ('caches' in window) {
        const cacheStorage = await caches.open(cacheName);
        const keys = await cacheStorage.keys();

        if (keys.length > 0) {
          setShow(true)
        } else {
          setShow(false)
        }
      }
    };


    checkCache();
  }, [showComponent])


  const fetchSavedConnections = async () => {

    let savedConnectionRequest = await fetch(
      `${process.env.REACT_APP_SERVER_URL}/api/get_rb_connect_definition_table`,
      {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          Authorization: "Bearer " + String(authTokens.access),
        },
      }
    );

    // let savedConnectionRestRequest = await fetch(
    //   `${process.env.REACT_APP_SERVER_URL}/api/get_rb_connect_definition_table`,
    //   {
    //     method: "GET",
    //     headers: {
    //       "Content-Type": "application/json",
    //       Authorization: "Bearer " + String(authTokens.access),
    //     },
    //   }
    // );


    let savedConnectionResults = await savedConnectionRequest.json();
    // let savedConnectionRestResults = await savedConnectionRestRequest.json();

    if (savedConnectionRequest.status === 200) {
      // savedConRes = [...savedConnectionResults]
      // savedConRes = { DB: savedConnectionResults }
      setSavedConnections(savedConnectionResults)
    }
    // if (savedConnectionRestRequest.status === 200) {
    //   savedConRes = { ...savedConRes, REST: savedConnectionRestResults }
    // }
    // setSavedConnections(savedConRes)
  }

  const handleDbConnection = async (connectionParameter, type) => {
    setconnectionstr(connectionParameter)
    let connectonRequest = await fetch(
      `${process.env.REACT_APP_SERVER_URL}/api/set_db_sql_connection`,
      {
        method: "POST",
        body: JSON.stringify(connectionParameter),
        headers: {
          "Content-Type": "application/json",
          Authorization: "Bearer " + String(authTokens.access),
        },
      }
    );
    let connectResults = await connectonRequest.json()

    if (connectonRequest.status === 200) {
      setconnectionstr({
        [connectionParameter.connection_name]: connectResults,
      });
      setSelectedConnections({
        ...getselectedConnections, connectionParameter, 'type': type
      })
      // getalldata['savedConnectionItems'] = {
      //   "status": connectResults,
      //   "details": connectionParameter
      // }
    } else {
      setconnectionstr({
        [connectionParameter.connection_name]: connectResults,
      })
      getalldata['savedConnectionItems'] = {}
      return <FnToastMessageComp Header={"Error"} duration={3000} message={connectResults} apiStatus={"Checking Success"} position={'Top'} />
    }

  }


  const handleRESTConnection = async (connectionParameter) => {

    try {

      let auth_token
      if (connectionParameter.auth_type === 'Token Based') {
        let authTestBody = {}
        for (let Itm of (JSON.parse(connectionParameter.body))) {
          authTestBody = {
            ...authTestBody,
            [Itm['key']]: Itm['pair'],
          }
        }
        let auth_res = await fetch(
          `${connectionParameter.auth_url}`,
          {
            method: "POST",
            body: JSON.stringify(authTestBody),
            headers: {
              "Content-Type": "application/json",
            },
          }
        );

        auth_token = await auth_res.json();
        if (auth_res.status === 200) {
          setError();
        }
      }


      let res;

      if (connectionParameter.auth_type === 'NoAuth') {
        res = await fetch(
          `${connectionParameter.data_enpoint_url}`,
          {
            method: `GET`,
          }
        );
      } else {
        const headers = {
          "Content-Type": "application/json",
          Authorization: connectionParameter.auth_type === 'Basic' ? "Basic " + btoa(connectionParameter.user_id + ":" + connectionParameter.password) : "Bearer " + String(auth_token.access),
        };
        res = await fetch(
          `${connectionParameter.data_enpoint_url}`,
          {
            method: `${connectionParameter.method}`,
            headers: headers,
          }
        );
      }

      let data = await res.json();
      if (res.status === 200) {
        setconnectionstr({
          ...getconnectiondbstr,
          [connectionParameter.connection_name]: "Connected",
        });
      }
    }

    catch (excep) {
      window.alert("exp", excep)
    }

  }

  // Step Wizard Next and Prevoius
  const fnDiscardCache = () => {

    if ("caches" in window) {
      caches
        .delete("QueryBuilder")
        .then(function (res) {
          return res;
        });
    }
    setShow(false);
    setstepCount(1);
  }

  // const handleNext = async (rightItems, getselectedItems, getSelectedColumn, rows, getjoinrows, query, option, page_name) => {
  const handleNext = async (data, page, option) => {
    console.log("handleNext", page, data)
    if ("caches" in window) {
      // Opening given cache and putting our data into it
      caches.open("QueryBuilder").then((cache) => {
        cache.put("http://localhost:3000",
          new Response(JSON.stringify({
            "StepCount": getstepCount, 
            "Page1": page === 'Page1' ? data : '', "Page2": page === 'Page2' ? data : '',
            "Page3": page === 'Page3' ? data : '', "Page4": page === 'Page4' ? data : '',
            "Page5": page === 'Page5' ? data : '', "Page6": page === 'Page6' ? data : '', 
            "Page7": page === 'Page7' ? data : '', "Page8": page === 'Page8' ? data : '',
            "Page9": page === 'Page9' ? data : ''
          }))
        );
      });
    }
    setAlldata({ 
      "StepCount": getstepCount, 
      "Page1": page === 'Page1' ? data : '', "Page2": page === 'Page2' ? data : {},
      "Page3": page === 'Page3' ? data : '', "Page4": page === 'Page4' ? data : '',
      "Page5": page === 'Page5' ? data : '', "Page6": page === 'Page6' ? data : '', 
      "Page7": page === 'Page7' ? data : '', "Page8": page === 'Page8' ? data : '',
      "Page9": page === 'Page9' ? data : ''
    })
    // console.log("tableData", tableData)
    // if (getselectedConnections['savedConnectionItems'] && getselectedConnections.query_name) {
      // setAlldata({
      //   "StepCount": getstepCount, "Page1": getselectedConnections, "Page2": rightItems,
      //   "Page3": getselectedItems, "Page4": { "getcolumnalias": getcolumnalias, "getSelectedColumn": getSelectedColumn },
      //   "Page5": rows, "Page6": { "getjoinrows": getjoinrows, "getallcolumns": getallcolumns }, "Page7": query, "Page8": getquerydata
      // })
      // const transformedData = {};
      // getselectedItems.forEach(({ table_name, column }) => {
      //   if (!transformedData[table_name]) {
      //     transformedData[table_name] = {
      //       table_name,
      //       table_columns: [],
      //     };
      //   }

      //   transformedData[table_name].table_columns.push({
      //     id: column.id,
      //     columnName: column.columnName,
      //     DataType: column.dataType,
      //     tableId: column.tableId
      //   });
      // });

      // let transformedColumnData = Object.values(transformedData)

      // if ("caches" in window) {
      //   // Opening given cache and putting our data into it
      //   caches.open("QueryBuilder").then((cache) => {
      //     cache.put("http://localhost:3000",
      //       new Response(JSON.stringify({
      //         "StepCount": getstepCount, "Page1": getselectedConnections, "Page2": rightItems,
      //         "Page3": getselectedItems, "Page4": { "getcolumnalias": getcolumnalias, "getSelectedColumn": getSelectedColumn },
      //         "Page5": rows, "Page6": { "getjoinrows": getjoinrows, "getallcolumns": getallcolumns }, "Page7": query, "Page8": getquerydata
      //       }))
      //     );
      //   });
      // }
      if (option) {
        setstepCount(option)
      }
      else {
        setstepCount(getstepCount + 1)
      }

      // // setSelectedColumn(getSelectedColumn)
      // setSelectedColumn(transformedColumnData)
      // setAllColumns(getColumnWithTabeID)
      // setError()
    // }
    // else {
    //   if (option == 3 || option == 9) {
    //     if (!getselectedConnections['savedConnectionItems'] && !getselectedConnections.query_name) {
    //       setError({ "query_name": "Query Name can't be blank", "savedConnectionItems": "Please choose from the Saved Connections" })
    //     }
    //     else if (!getselectedConnections.query_name) {
    //       setError({ "query_name": "Query Name can't be blank" })
    //     }
    //     else if (!getselectedConnections['savedConnectionItems']) {
    //       setError({ "savedConnectionItems": "Please choose a valid connection" })
    //     }
    //   }
    // }

    if (option == 2) {
      setstepCount(option)
    }

  }

  const handledata = async () => {
    if (typeof caches === "undefined") return false;

    const cacheStorage = await caches.open("QueryBuilder");
    const cachedResponse = await cacheStorage.match("http://localhost:3000");

    // If no cache exists
    if (!cachedResponse || !cachedResponse.ok) {
      window.alert("Cache Error !!");
    }

    return cachedResponse.json().then((item) => {
      setShow(!show)
      setstepCount(item["StepCount"]);
      setSelectedConnections(item["Page1"]);
      setRightItems(item["Page2"])
      setSelectedItems(item["Page3"])
      setColumnAlias(item["Page4"]["getcolumnalias"])
      setSelectedColumn(item["Page4"]["getSelectedColumn"])
      setRows(item["Page5"])
      setAllColumns(item["Page6"]["getallcolumns"])
      setJoinRows(item["Page6"]["getjoinrows"])
      setQuery(item["Page7"])
      setQueryData(item["Page8"])
      setAlldata(item)
    });

  }

  const handlesetdatatoState = async () => {
    if (typeof caches === "undefined") return false;

    const cacheStorage = await caches.open("QueryBuilder");
    const cachedResponse = await cacheStorage.match("http://localhost:3000");

    // If no cache exists
    if (!cachedResponse || !cachedResponse.ok) {
      window.alert("Cache Error !!");
    }

    return cachedResponse.json().then((item) => {
      setCacheData(item)
      secondFunction(item)
      setstepCount(item["StepCount"]);
      setSelectedConnections(item["Page1"]);
      setRightItems(item["Page2"])
      setSelectedItems(item["Page3"])
      setColumnAlias(item["Page4"]["getcolumnalias"])
      setSelectedColumn(item["Page4"]["getSelectedColumn"])
      setRows(item["Page5"])
      setAllColumns(item["Page6"]["getallcolumns"])
      setJoinRows(item["Page6"]["getjoinrows"])
      setQuery(item["Page7"])
      setQueryData(item["Page8"])
    });



  }

  const handlePrev = (option) => {
    if (option == 1) {
      setstepCount(option)
    }else if(option === 9){ //Back to connection selection page from custom Query page
      setstepCount(2)
    }
    else {
      setstepCount(getstepCount - 1)
    }
  }

  function secondFunction(data) {
    handleQueryColumnData(data)
  }

  function WizardNavigation(data) {
    console.log("data", data)
    if (data === 'Rest_api') {
      setShowComponent(true)
      setstepCount(0)
    } else {
      handleNext(rightItems, getselectedItems, getSelectedColumn, rows, getjoinrows, query, 3)
    }

  }
  const handlesavedetails = async () => {
    let Response = await fetch(
      `${process.env.REACT_APP_SERVER_URL}/api/ins_and_upd_connection_data`,
      {
        method: "POST",
        body: JSON.stringify(getalldata),
        headers: {
          "Content-Type": "application/json",
          Authorization: "Bearer " + String(authTokens.access),
        },
      }
    );
    let connectResults = await Response.json()
    alert(connectResults)
  }

  const handleQueryColumnData = async (data) => {

    let queryColumnRequest = await fetch(
      `${process.env.REACT_APP_SERVER_URL}/api/ins_query_column_data`,
      {
        method: "PUT",
        body: JSON.stringify(data),//getcacheData
        headers: {
          "Content-Type": "application/json",
          Authorization: "Bearer " + String(authTokens.access),
        },
      }
    );
    let queryColumnResults = await queryColumnRequest.json()

    // ! Revan Changes Commented
    if (queryColumnRequest.status == 200) {
      setstepCount(1)
      fnDiscardCache()
    }
    else {

    }

  }

  const fnChoosemode = (value) => {
    if(value === 'custom_query'){
      handleNext(rightItems, getselectedItems, getSelectedColumn, rows, getjoinrows, query, 9, getstepCount)
    }else if(value === 'query_wizard'){
      handleNext(rightItems, getselectedItems, getSelectedColumn, rows, getjoinrows, query, 3,'query_wizard')
    }else{
      setMode('')
      handleNext(rightItems, getselectedItems, getSelectedColumn, rows, getjoinrows, query)
    }
  }

  return (
    <div className="sc_cl_div w-100 px-2">
      <div className="d-flex flex-column flex-lg-row sc_cl_row sc_cl_page_header">
        <div className="align-items-center col-12 col-lg-6 d-flex py-2 text-center">
          <h5 className="sc_cl_head m-0">Report Builder</h5>
        </div>

        <div className="align-items-center col-12 col-lg-6 d-flex justify-content-lg-end py-2 text-center">
          <FnBreadCrumbComponent
            seperator_symbol={" >"}
            nav_items={breadcumb_menu}
          />

        </div>
      </div>
      <div className={`${getstepCount != 1 && getstepCount != 2 ? 'p-2' : 'd-none'}`}>
        {
          <div className={`${getstepCount == 1 || getstepCount == 9 ? 'd-none' : 'd-flex justify-content-between'}  `}>
            {stepCounter.map((stepItems, stepIndex) => {
              return (
                <div className={`${getstepCount >= stepItems.id ? "d-flex flex-column align-items-center" : "d-flex flex-column align-items-center nextstep"}`} key={stepIndex} >
                  <div className={`${stepItems.id == 8 ? `number_counter_container_last_child` : 'number_counter_container'} ${getstepCount > stepItems.id ? "completedStep" : ''}`}>
                    <p className="m-0">{getstepCount > stepItems.id ? <FaRegCircleCheck /> : ''}</p>
                    {/* <p className="m-0">{getstepCount > stepItems.id ? <FaRegCircleCheck /> : stepItems.id}</p> */}
                  </div>
                  <div className="nav-steps-label">
                    <p >{stepItems.stepName}</p>
                  </div>
                </div>
              )
            })}
          </div>

        }
      </div>


      <>
        {
          getstepCount == 1 &&
          <FnTabPage
            userSettings={userSettings}
            authTokens={authTokens}
            handleNext={handleNext}
            setquerydatafullresults={setquerydatafullresults}
            setColumnWithTabeID={setColumnWithTabeID}
            rows={rows} getjoinrows={getjoinrows} query={query}
            setOpenQueryGenerator={setOpenQueryGenerator} getopenquerygenerator={getopenquerygenerator}
            getSelectedColumn={getSelectedColumn} setSelectedColumn={setSelectedColumn}
            getselectedConnections={getselectedConnections} setSelectedConnections={setSelectedConnections}
            getstepCount={getstepCount} setstepCount={setstepCount}
            setRightItems={setRightItems} rightItems={rightItems}
            setSelectedItems={setSelectedItems} getselectedItems={getselectedItems}
            getquerydata={getquerydata} setQueryData={setQueryData} getedit={getedit} setEdit={setEdit} geteditquery={geteditquery}
            setEditQuery={setEditQuery}
            setRows={setRows} setJoinRows={setJoinRows}
            setActiveButtons={setActiveButtons} getcolumnalias={getcolumnalias} setColumnAlias={setColumnAlias}
            user={user} gettoastMessage={gettoastMessage} setToastMessage={setToastMessage} getalldata={getalldata} setAlldata={setAlldata} />
        }

        {getstepCount == 2 && (
          <FnConnectionSelection
            authTokens={authTokens}
            getSavedConnections={getSavedConnections}
            setSelectedConnections={setSelectedConnections}
            getselectedConnections={getselectedConnections}
            handleDBConnection={handleDbConnection}
            handleRESTConnection={handleRESTConnection}
            getconnectiondbstr={getconnectiondbstr}
            setSavedQueryDefinition={setSavedQueryDefinition}
            geterror={geterror}
            setError={setError}
            getstepCount={getstepCount}
            setstepCount={setstepCount}
            rightItems={rightItems} getselectedItems={getselectedItems}
            getSelectedColumn={getSelectedColumn} rows={rows} getjoinrows={getjoinrows} query={query}
            getactivateButtons={getactivateButtons} setActiveButtons={setActiveButtons}
            gettoastMessage={gettoastMessage} setToastMessage={setToastMessage}
            getcacheData={getcacheData}
            setAlldata={setAlldata}
            getalldata={getalldata}
            user={user}
            handleNext={handleNext}
            handlePrev={handlePrev}
          />
        )}

        {
          getstepCount == 9 && <FnCustomQuery authTokens={authTokens}
            getSavedConnections={getSavedConnections}
            setSelectedConnections={setSelectedConnections}
            getselectedConnections={getselectedConnections}
            handleDBConnection={handleDbConnection}
            getconnectiondbstr={getconnectiondbstr}
            getquerydata={getquerydata}
            setQueryData={setQueryData}
            leftItems={leftItems}
            setLeftItems={setLeftItems}
            userSettings={userSettings}
            getedit={getedit} setEdit={setEdit}
            getstepCount={getstepCount} setstepCount={setstepCount}
            gettoastMessage={gettoastMessage} setToastMessage={setToastMessage}
            etl={etl} setETL={setETL}
            handlePrev={handlePrev}
            getalldata={getalldata}
            setAlldata={setAlldata}
            />
        }

        {/* {
          getstepCount == 9 && <FnQueryExecutor authTokens={authTokens}
            getSavedConnections={getSavedConnections}
            setSelectedConnections={setSelectedConnections}
            getselectedConnections={getselectedConnections}
            handleDBConnection={handleDbConnection}
            getconnectiondbstr={getconnectiondbstr}
            getquerydata={getquerydata}
            setQueryData={setQueryData}
            leftItems={leftItems}
            setLeftItems={setLeftItems}
            userSettings={userSettings}
            getedit={getedit} setEdit={setEdit}
            getstepCount={getstepCount} setstepCount={setstepCount}
            gettoastMessage={gettoastMessage} setToastMessage={setToastMessage}
            etl={etl} setETL={setETL}
            handlePrev={handlePrev}
            getalldata={getalldata}
            />
        } */}

        {getstepCount == 3 && (
          <FnTableSelection
            authTokens={authTokens}
            getselectedConnections={getselectedConnections}
            leftItems={leftItems}
            rightItems={rightItems}
            setRightItems={setRightItems}
            setLeftItems={setLeftItems}
            getselectedLeftItems={getselectedLeftItems}
            getselectedRightItems={getselectedRightItems}
            setSelectedLeftItems={setSelectedLeftItems}
            setSelectedRightItems={setSelectedRightItems}
            getsavedQueryDefinition={getsavedQueryDefinition}
            setSavedQueryDefinition={setSavedQueryDefinition}
            getpostedTables={getpostedTables}
            setPostedTables={setPostedTables}
            setAlldata={setAlldata}
            getalldata={getalldata}
            handleNext={handleNext}
          // gettoastMessage={gettoastMessage}
          // setToastMessage={setToastMessage}
          />
        )}

        {getstepCount == 4 && (
          <FnColumnSelection
            authTokens={authTokens}
            rightItems={rightItems}
            getselectedConnections={getselectedConnections}
            getsavedQueryDefinition={getsavedQueryDefinition}
            getselectedItems={getselectedItems}
            setSelectedItems={setSelectedItems}
            getsavedTables={getsavedTables}
            setSavedTables={setSavedTables}
            getColumnWithTabeID={getColumnWithTabeID}
            setColumnWithTabeID={setColumnWithTabeID}
            setSelectedColumn={setSelectedColumn}
          // gettoastMessage={gettoastMessage}
          // setToastMessage={setToastMessage}
          />
        )}

        {
          getstepCount == 5 && <FnColumnAliasSelection authTokens={authTokens} getSelectedColumn={getSelectedColumn} setSelectedColumn={setSelectedColumn} getselectedConnections={getselectedConnections} getsavedQueryDefinition={getsavedQueryDefinition}
            getcolumnalias={getcolumnalias} setColumnAlias={setColumnAlias} gettoastMessage={gettoastMessage} setToastMessage={setToastMessage} />
        }

        {
          getstepCount == 6 && <FnColumnAggreation getSelectedColumn={getSelectedColumn} authTokens={authTokens} getsavedQueryDefinition={getsavedQueryDefinition}
            rows={rows} setRows={setRows} gettoastMessage={gettoastMessage} setToastMessage={setToastMessage} />
        }

        {
          getstepCount == 7 &&
          <FnJoinOperation getSelectedColumn={getSelectedColumn} getselectedConnections={getselectedConnections} authTokens={authTokens}
            getsavedQueryDefinition={getsavedQueryDefinition} getjoinrows={getjoinrows} setJoinRows={setJoinRows} getallcolumns={getallcolumns}
            setAllColumns={setAllColumns} gettoastMessage={gettoastMessage} setToastMessage={setToastMessage} />
        }

        {
          getstepCount == 8 &&
          <FnTableColumnFilter getSelectedColumn={getSelectedColumn} authTokens={authTokens} getsavedQueryDefinition={getsavedQueryDefinition}
            query={query} setQuery={setQuery} getallcolumns={getallcolumns} setAllColumns={setAllColumns} gettoastMessage={gettoastMessage} setToastMessage={setToastMessage} />
        }

        {
          getstepCount == 10 && <FnFullQueryResults getquerydatafullresults={getquerydatafullresults} setLeftItems={setLeftItems}
            setRightItems={setRightItems} setActiveButtons={setActiveButtons} gettoastMessage={gettoastMessage} setToastMessage={setToastMessage} />
        }

        {showComponent && <FnRestConnection />}

      </>
        {
          etl === false &&
          <div className={`${getstepCount == 2 ? '' : 'd-flex justify-content-between mt-3 '}`}>
            {
              getstepCount !== 1 && getstepCount !== 2 && getstepCount !== 9 ?
              <div>
              <button onClick={() => handlesavedetails()} className="mt-2 sc_cl_outline_button">Save & Continue</button>
              </div>
              :
              ''
            }
            
            {
              getstepCount != 10 ?
                <>
                  <FnBtnComponent children={"Previous"} onClick={() => handlePrev(getstepCount == 2 ? 1 : getstepCount)} classname={`${getstepCount == 1 || getstepCount == 2 || getstepCount == 9 ? 'visually-hidden' : 'sc_cl_outline_button '}`} />

                  {getstepCount == 8 ?
                    <FnBtnComponent children={"Finish"} onClick={() => handlesavedetails()} classname={"sc_cl_outline_button d-block"} />
                    // <FnBtnComponent children={"Finish"} onClick={() => handlesetdatatoState()} classname={"sc_cl_outline_button d-block"} />
                    :
                    <>
                    {
                      console.log("getstepCount", getstepCount)
                    }
                      
                      {/* <div className={`${getstepCount == 2 ? 'sc_cl_agree_box_container' : 'visually-hidden'}`}>
                        <label className="sc_cl_label">Mode <sup className="text-danger fs-6">*</sup> : </label>
                        <div className="col-lg-6 sc_cl_agree_box rounded"
                          onClick={() => setMode("custom_query")}
                          // classname={`${getstepCount == 2 ? '' : 'visually-hidden'} col-lg-6 sc_cl_agree_box rounded`}
                        >
                          <input type="checkbox" className="custom-cursor-pointer" checked={mode === 'custom_query' ? true : null}/>
                          <span className="px-2">Custom Query</span>
                          <p className="px-4">A custom query is a user-defined summary page that extends the functionality of an asset analyzer. It can be a wrapper around a user-defined SQL select statement.</p>
                        </div>

                        <div className="col-lg-6 sc_cl_agree_box rounded"
                          onClick={() => setMode("query_wizard")}
                        >
                          <input type="checkbox" className="custom-cursor-pointer" checked={mode === 'query_wizard' ? true : null} />
                          <span className="px-2">Query Wizard</span>
                          <p className="px-4">The Query Wizard is an interface through which you can view the database tables and fields. It enables you to create queries based on the database logic.</p>
                        </div>
                      </div> */}
                      {/* <FnBtnComponent children={"Query Wizard"} onClick={() => handleNext(rightItems, getselectedItems, getSelectedColumn, rows, getjoinrows, query, 3,'query_wizard')}
                      classname={`${getstepCount == 2 ? '' : 'visually-hidden'} sc_cl_outline_button`}
                      disabled={geteditquery.query_type === undefined ? false : geteditquery.query_type ? true : false} /> */}
                      {/* <FnToastMessageComp Header={"Notification"} duration={3000} message={"Checking"} apiStatus={"Checking Success"} position={'Top'} /> */}
                      {/* <FnBtnComponent children={"Custom Query"} onClick={() => handleNext(rightItems, getselectedItems, getSelectedColumn, rows, getjoinrows, query, 9, getstepCount)}
                        classname={`${getstepCount == 2 ? '' : 'visually-hidden'} sc_cl_outline_button m-3`}
                        disabled={geteditquery.query_type === undefined ? false : geteditquery.query_type ? false : true} /> */}
                      {/* <FnBtnComponent children={"Next"} onClick={() => handleNext(rightItems, getselectedItems, getSelectedColumn, rows, getjoinrows, query)}
                        classname={`${getstepCount == 1 || getstepCount == 9 ? 'visually-hidden' : 'sc_cl_outline_button d-block'}`} /> */}
                      {/* <div className="sc_cl_form_buttons">
                        <FnBtnComponent children={"Back"} onClick={() => { handlePrev(getstepCount == 2 || getstepCount == 9 ? 1 : getstepCount); setEdit(false) }}
                          classname={`${getstepCount == 2 || getstepCount == 9 ? 'sc_cl_close_button' : 'visually-hidden'}`} />
                        <FnBtnComponent children={"Next"} onClick={() => fnChoosemode(mode)}
                            classname={`${getstepCount == 1 || getstepCount == 9 ? 'visually-hidden' : 'sc_cl_submit_button'}`} />
                      </div> */}

                    </>
                  }

                </>
                : <FnBtnComponent children={"Back to Query Builder"} onClick={() => setstepCount(1)} />
            }
          </div>
        }

      <Modal show={show} backdrop="static">
        <Modal.Header>
          <Modal.Title>Warning !</Modal.Title>
        </Modal.Header>
        <Modal.Body>Your change's has not been saved !!!</Modal.Body>
        <Modal.Footer>
          <Button variant="primary" onClick={handledata}>
            Restore Changes
          </Button>
          <Button variant="secondary" onClick={fnDiscardCache}>
            Discard Changes
          </Button>
        </Modal.Footer>

      </Modal>
    </div>
  )
}

const FnConnectionSelection = ({ authTokens, getSavedConnections, handleDBConnection, setSelectedConnections, getselectedConnections, handleRESTConnection,
  getconnectiondbstr, setSavedQueryDefinition, getopenquerygenerator, setOpenQueryGenerator, setstepCount,
  geterror, setError, getstepCount, rightItems, getselectedItems, getSelectedColumn, rows, getjoinrows, query, getactivateButtons
  , setActiveButtons, gettoastMessage, setToastMessage, getcacheData, setAlldata, getalldata, user, handleNext, handlePrev }) => {
console.log("getalldata", getalldata)
  const [getToast, setToast] = useState([])
  const [getconnectionStatus, setConnectionStatus] = useState()
  const [conError, setConError] = useState({})
  const [getconnectionDetails, setConnectionDetails] = useState({
    'query_name' : '',
    'savedConnectionItems' : '',
    'mode': '',
    'created_user': user.username,
    'created_by': user.user_id,
    'last_updated_by': user.user_id,
  })

  const fnCheckDBstatus = async (connectionParameter, type) => {
    let connectonRequest = await fetch(
      `${process.env.REACT_APP_SERVER_URL}/api/set_db_sql_connection`,
      {
        method: "POST",
        body: JSON.stringify(connectionParameter),
        headers: {
          "Content-Type": "application/json",
          Authorization: "Bearer " + String(authTokens.access),
        },
      }
    );
    let connectResults = await connectonRequest.json()
    
    if (connectonRequest.status === 200) {
      setConnectionStatus({[connectionParameter.connection_name]: connectResults,});
      setConnectionDetails({
        ...getconnectionDetails, 'savedConnectionItems' : connectionParameter, 'type': type
      })
      // delete conError.query_name;
      setConError({ ...conError, savedConnectionItems : '' })
    } else {
      setConnectionStatus({[connectionParameter.connection_name]: connectResults,})
      // setConnectionDetails({
      //   ...getconnectionDetails, 'savedConnectionItems' : ''
      // })
      setConError({...conError, savedConnectionItems: connectResults})
      // getalldata['savedConnectionItems'] = {}
      // return <FnToastMessageComp Header={"Error"} duration={3000} message={connectResults} apiStatus={"Checking Success"} position={'Top'} />
    }

  }

  const handleCheckedConnection = (savedConnectionItems, type) => {
    // setSelectedConnections({
    //   ...getselectedConnections, savedConnectionItems, 'type': type
    // })
    handleDBConnection(savedConnectionItems, type)
  };

  const validateConnectionSelection = () => {
    // delete conError.query_name;
    const arr_error = {...conError}
    Object.keys(getconnectionDetails).map(m => {
      if(getconnectionDetails[m] === ''){
        arr_error[m] = 'Field is Required'
        setConError(arr_error)
      }
    })
    let err_status = false
    Object.keys(arr_error).map(m => {
      if(arr_error[m] !== ''){
        err_status = true
      }
    })
    if(!err_status){
      if(getconnectionDetails.mode === 'custom_query'){
        handleNext(getconnectionDetails, 'Page1', 9)
      }else if(getconnectionDetails.mode === 'query_wizard'){
        handleNext(getconnectionDetails, 'Page1')
      }
    }
  }

  const handleQueryName = (evt) => {
    const { name, value } = evt.target
    setConError({ ...conError, [name] : '' })
    setConnectionDetails({
      ...getconnectionDetails,
      [name]: value,
    })
  }

  const handleConnectionQueryPost = async () => {
    let connectionRequest = await fetch(
      `${process.env.REACT_APP_SERVER_URL}/api/ins_save_connection_data`,
      {
        method: "POST",
        body: JSON.stringify(getselectedConnections),
        headers: {
          "Content-Type": "application/json",
          Authorization: "Bearer " + String(authTokens.access),
        },
      }
    );
    let connectResults = await connectionRequest.json()

    if (connectionRequest.status === 201) {
      setSavedQueryDefinition(connectResults)
      setActiveButtons(true)
      setToastMessage(true)
      setToast((msgItm) => [...msgItm, { message: 'Connection has established and saved', apiStatus: 201 }])
    }
    else {
      setToast((msgItm) => [...msgItm, { message: 'Connection has established and but not saved saved', apiStatus: 400 }])
    }
  }

  useEffect(() => {
    if(getalldata['Page1']){
      setConnectionStatus({[getalldata['Page1']['savedConnectionItems'].connection_name]:'Connected'})
      if(getalldata['Page1']['query_type'] !== undefined){
        if(getalldata['Page1']['query_type'] === true){
          getalldata['Page1']['mode'] = 'custom_query'
        }else{
          getalldata['Page1']['mode'] = 'query_wizard'
        }
      }
      setConnectionDetails(getalldata['Page1'])

    }
  },[getalldata])

  return (
    <div>

      <Form>
        <FormGroup>
          <div className=" sc_cl_field_alignment">
            <Form.Label className="sc_cl_label">Query Name <sup className="text-danger fs-6">*</sup></Form.Label>
            <Form.Control
              type={"text"}
              placeholder={"Enter query name"}
              value={getconnectionDetails?.query_name || ""}
              name="query_name"
              onChange={(evt) => handleQueryName(evt)}
              disabled={false}
              className={"w-25"}
              size="sm"
              autoComplete="off"
            />
            <span className="sc_cl_span red">{conError && conError.query_name && conError.query_name}</span>
          </div>
        </FormGroup>
      </Form>

      <div className="">
        <div className=" sc_cl_field_alignment">
          <label className="sc_cl_label">Saved Databases <sup className="text-danger fs-6">*</sup></label>
          <span className="sc_cl_span red">{conError && conError.savedConnectionItems && conError.savedConnectionItems}</span>
        </div>
        <div className="col-12 col-sm-12 sc_cl_connection_container d-flex gap-3">
          {
            getSavedConnections && getSavedConnections['DB'].length > 0 && getSavedConnections['DB'].map((savedConnectionItems, tableIndex) => {
              return (
                <>
                  <div 
                    className={`sc_cl_connection_card rounded ${getconnectionStatus && getconnectionStatus[savedConnectionItems.connection_name] ? 
                      getconnectionStatus[savedConnectionItems.connection_name] === "Connected" ? 'lightgreen':'lightcoral' : 
                      'bg-white'}`}
                  
                    onClick={() => fnCheckDBstatus(savedConnectionItems, 'DB')}
                  >
                  {
                    savedConnectionItems.database_type === 'MYSQL' && <SiMysql key={tableIndex} className="col-2 sc_cl_connection_icon mysql" />
                  }
                  {
                    savedConnectionItems.database_type === 'Oracle' && <SiOracle key={tableIndex} className="col-2 sc_cl_connection_icon oracle" />
                  }
                  {
                    savedConnectionItems.database_type === 'Snowflake' && <SiSnowflake key={tableIndex} className="col-2 sc_cl_connection_icon snowflake" />
                  }
                    <span className="col-10">{savedConnectionItems.connection_name} / {savedConnectionItems.database_type}</span>
                  </div>
                </>
              )
            })
          }
          </div>
        <div className="d-flex gap-2">
          {
            getSavedConnections.length > 0 && getSavedConnections.map((savedConnectionItems, tableIndex) => {
              return (
                // <div 
                // className={`col-2 p-3 shadow-sm rounded d-flex flex-column align-items-start gap-2 
                // ${getconnectiondbstr[savedConnectionItems.connection_name] ? 
                //   getconnectiondbstr[savedConnectionItems.connection_name] === "Connected" ? 'lightgreen':'lightcoral' : 
                //   'bg-white'}`
                // }
                // // className="col-2 p-3 bg-white shadow-sm rounded d-flex flex-column align-items-start gap-2" 
                // key={tableIndex}>
                //   <div className="d-flex gap-2">
                //     {/* <SiMysql /> */}
                //     <input
                //       type="checkbox"
                //       onChange={(e) => handleCheckedConnection(savedConnectionItems, 'DB')}
                //       checked={getselectedConnections?.savedConnectionItems &&
                //         getselectedConnections?.savedConnectionItems.id === savedConnectionItems.id || false
                //       }
                //     />
                //     <p className="m-0">{savedConnectionItems.connection_name} / {savedConnectionItems.database_type}</p>
                //   </div>
                //   <div className="align-items-center d-flex gap-4">
                //     {/* <button onClick={() => handleDBConnection(savedConnectionItems)} className="sc_cl_update_button">Test Connection</button> */}

                //     {getconnectiondbstr && getconnectiondbstr[savedConnectionItems.connection_name] ?
                //       getconnectiondbstr[savedConnectionItems.connection_name] == "Connected" ?
                //         <span className="sc_cl_connection_success">Connection Secured</span> : <span className="sc_cl_connection_failed">Connection is down</span> : ""}
                //   </div>
                // </div>
                ''
              )
            })
          }
          {/* {
            getSavedConnections && getSavedConnections['REST'].length > 0 && getSavedConnections['REST'].map((savedConnectionItems, tableIndex) => {
              return (
                <div className="col-2 p-3 bg-white shadow-sm rounded d-flex flex-column align-items-start gap-2" key={tableIndex}>
                  <div className="d-flex gap-2">
                    <input
                      type="checkbox"
                      onChange={(e) => handleCheckedConnection(savedConnectionItems, 'REST')}
                      checked={getselectedConnections?.savedConnectionItems &&
                        getselectedConnections?.savedConnectionItems.id === savedConnectionItems.id || false
                      }
                    />

                    <p className="m-0">{savedConnectionItems.connection_name} / {savedConnectionItems.connection_type}</p>
                  </div>

                  <div className="align-items-center d-flex gap-4">
                    <button onClick={() => handleRESTConnection(savedConnectionItems)} className="sc_cl_update_button">Test Connection</button>

                    {getconnectiondbstr[savedConnectionItems.connection_name] ?
                      getconnectiondbstr[savedConnectionItems.connection_name] === "Connected" ?
                        <FaRegCircleCheck className="text-success" /> : <RiErrorWarningLine className="text-danger" /> : ""}
                  </div>
                </div>
              )
            })
          } */}
        </div>
      </div>
      {
        getToast.map((items, idx) => (
          <FnToastMessageComp Header={"Notification"} duration={3000} message={items.message} key={idx} apiStatus={items.apiStatus} />
        ))
      }
      <div className={`${getstepCount == 2 ? 'sc_cl_agree_box_container' : 'visually-hidden'}`}>
        <label className="sc_cl_label">Mode <sup className="text-danger fs-6">*</sup> : </label>
        <div className={`${(getalldata['Page1'] && getalldata['Page1']['query_type'] === false && getalldata['Page1']['connection_id'] !== '') ? 'd-none' : 'col-lg-6 sc_cl_agree_box rounded'}`}
          onClick={() => {setConError({ ...conError, 'mode' : '' });setConnectionDetails({...getconnectionDetails, 'mode': 'custom_query', query_type: true})}}
          // classname={`${getstepCount == 2 ? '' : 'visually-hidden'} col-lg-6 sc_cl_agree_box rounded`}
        >
          <input type="checkbox" className="custom-cursor-pointer" checked={getconnectionDetails && getconnectionDetails.mode === 'custom_query' ? true : null}/>
          <span className="px-2">Custom Query</span>
          <p className="px-4">A custom query is a user-defined summary page that extends the functionality of an asset analyzer. It can be a wrapper around a user-defined SQL select statement.</p>
        </div>

        <div className={`${(getalldata['Page1'] && getalldata['Page1']['query_type'] === true && getalldata['Page1']['connection_id'] !== '') ? 'd-none' : 'col-lg-6 sc_cl_agree_box rounded'}`}
          onClick={() => {setConError({ ...conError, 'mode' : '' });setConnectionDetails({...getconnectionDetails, 'mode': 'query_wizard'})}}
        >
          <input type="checkbox" className="custom-cursor-pointer" checked={getconnectionDetails && getconnectionDetails.mode === 'query_wizard' ? true : null} />
          <span className="px-2">Query Wizard</span>
          <p className="px-4">The Query Wizard is an interface through which you can view the database tables and fields. It enables you to create queries based on the database logic.</p>
        </div>
      </div>
      <span className="sc_cl_span red">{conError && conError.mode && conError.mode}</span>
      <div className="sc_cl_form_buttons">
          <FnBtnComponent children={"Back"} onClick={() => handlePrev(getstepCount)} classname='sc_cl_close_button' />
          <FnBtnComponent children={"Next"} onClick={() => validateConnectionSelection()} classname='sc_cl_submit_button' />
      </div>

    </div>
  )
}



const FnTableSelection = ({ authTokens,setPostedTables, setAlldata, getalldata, handleNext }) => {
    // let getselectedConnections = getalldata['Page1']['savedConnectionItems']
    
  const [getselectedLeftItems, setSelectedLeftItems] = useState([])
  const [getselectedRightItems, setSelectedRightItems] = useState([])
  const [rightItems, setRightItems] = useState([])
  const [leftItems, setLeftItems] = useState([])
  const [getsavedQueryDefinition, setSavedQueryDefinition] = useState([])
  const [getToast, setToast] = useState([])
  const [gettoastMessage, setToastMessage] = useState(false)
  const [Error, setError] = useState({})

  console.log("getalldata", getalldata)

  useEffect(() => {
    handleGetSchemaTables()
    // handleGetQueryDefinition()
  }, [])


  const handleGetSchemaTables = async () => {
    let fetchTableRequest = await fetch(
      `${process.env.REACT_APP_SERVER_URL}/api/get_connected_tables`,
      {
        method: "POST",
        body: JSON.stringify(getalldata["Page1"]),
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

  const handleGetQueryDefinition = async () => {
    let querydefinitionRequest = await fetch(
      `${process.env.REACT_APP_SERVER_URL}/api/get_connection_data`,
      {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          Authorization: "Bearer " + String(authTokens.access),
        },
      }
    );
    let querydefnitionResults = await querydefinitionRequest.json()

    const last_query = querydefnitionResults[querydefnitionResults.length - 1]

    setSavedQueryDefinition(last_query)
  }

  const toggleLeftItemSelection = (itemId) => {
    if (getselectedLeftItems.includes(itemId)) {
      setSelectedLeftItems(getselectedLeftItems.filter(id => id !== itemId));
    } else {
      setSelectedLeftItems([...getselectedLeftItems, itemId]);
      if(getalldata['Page2']['SelectedLeftItem'] === undefined){
        getalldata['Page2']['SelectedLeftItem'] = []
        getalldata['Page2']['SelectedLeftItem'].push(itemId)
      }else{
        getalldata['Page2']['SelectedLeftItem'].push(itemId)
      }
      setAlldata(getalldata)
    }
  };

  const toggleRightItemSelection = (itemId) => {
    if (getselectedRightItems.includes(itemId)) {
      setSelectedRightItems(getselectedRightItems.filter(id => id !== itemId));
    } else {
      setSelectedRightItems([...getselectedRightItems, itemId]);
      if(getalldata['Page2']['SelectedRightItem'] === undefined){
        getalldata['Page2']['SelectedRightItem'] = [getselectedRightItems.filter(id => id !== itemId)]
      }else{
        getalldata['Page2']['SelectedRightItem'].push(itemId)
      }
      setAlldata(getalldata)
    }
  };

  const moveSelectedToRight = () => {
    const selectedItems = leftItems.filter(item => getselectedLeftItems.includes(item.table_id));
    setRightItems([...rightItems, ...selectedItems]);
    setLeftItems(leftItems.filter(item => !getselectedLeftItems.includes(item.table_id)));
    setSelectedLeftItems([]);
    setError({})
  };

  const moveSelectedToLeft = () => {
    const selectedItems = rightItems.filter(item => getselectedRightItems.includes(item.table_id));
    setLeftItems([...leftItems, ...selectedItems]);
    setRightItems(rightItems.filter(item => !getselectedRightItems.includes(item.table_id)));
    setSelectedRightItems([]);
  };

  const moveAllToRight = () => {
    setRightItems([...rightItems, ...leftItems]);
    setLeftItems([]);
    setSelectedLeftItems([]);
    setError({})
  };

  const postselectedTables = async () => {

    setPostedTables(rightItems)

    let includedTableId = rightItems.map(rightselectedItem => ({
      ...rightselectedItem,
      query_id: getsavedQueryDefinition.id,
      created_by: getsavedQueryDefinition.created_by,
      last_updated_by: getsavedQueryDefinition.last_updated_by
    }))

    let postTableRequest = await fetch(
      `${process.env.REACT_APP_SERVER_URL}/api/ins_save_table_data`,
      {
        method: "POST",
        body: JSON.stringify(includedTableId),
        headers: {
          "Content-Type": "application/json",
          Authorization: "Bearer " + String(authTokens.access),
        },
      }
    );
    let postTableResults = await postTableRequest.json()

    if (postTableRequest.status === 201) {
      setToastMessage(true)
      setToast((msgItm) => [...msgItm, { message: 'Selected tables have been saved', apiStatus: 201 }])
    } else {
      // setToastMessage(true)
      setToast((msgItm) => [...msgItm, { message: 'Selected tables have not been saved', apiStatus: 400 }])
    }
  }

  const moveAllToLeft = () => {
    setLeftItems([...leftItems, ...rightItems]);
    setRightItems([]);
    setSelectedRightItems([]);

  };

  const validateSelectedTables = () => {
    if(rightItems.length === 0){
      setError({...Error, rightItems: 'Should be choose any tables from Available Tables'})
    }else{
      handleNext(rightItems, 'Page2')
    }
  }


  return (
    <div className="col-12">
      <div className="d-flex">
        <div className="col-5">
          <div className="">
            <h5>Available Tables</h5>
          </div>
          <div className="qb_list_selector_container shadow-sm px-3">
            <ul className="list-unstyled">
              {leftItems.map((item, tableIndex) => (
                <li
                  key={item.table_id}
                  onClick={() => toggleLeftItemSelection(item.table_id)}
                  className={getselectedLeftItems.includes(item.table_id) ? 'selected' : ''}
                >
                  {item.table_name}
                </li>
              ))}
            </ul>
          </div>
        </div>

        <div className="col-2 d-flex flex-column align-items-center justify-content-center gap-4">
          <button onClick={moveSelectedToRight} className="px-4 border-0 bg-white rounded"> <BiChevronRight /> </button>
          <button onClick={moveAllToRight} className="px-4 border-0 bg-white rounded"><BiSolidChevronsRight /></button>
          <button onClick={moveSelectedToLeft} className="px-4 border-0 bg-white rounded"><BiChevronLeft /></button>
          <button onClick={moveAllToLeft} className="px-4 border-0 bg-white rounded"><BiSolidChevronsLeft /></button>
        </div>

        <div className=" col-5 p-3">
          <div>
            <h5>Selected Tables</h5>
          </div>

          <div className="qb_list_selector_container shadow-sm px-3">
            <ul className="list-unstyled">
              {
                rightItems.map((rightItmes, tableIndex) => (
                  <li
                    className={getselectedRightItems.includes(rightItmes.table_id) ? "selected" : ''}
                    key={tableIndex}
                    onClick={() => toggleRightItemSelection(rightItmes.table_id)}

                  >
                    {rightItmes.table_name}
                  </li>
                ))
              }
            </ul>
          </div>
          <span className="sc_cl_span red">{Error && Error.rightItems && Error.rightItems}</span>
        </div>
      </div>

      {
        gettoastMessage && getToast.map((items, idx) => (
          <FnToastMessageComp Header={"Notification"} duration={3000} message={items.message} key={idx} apiStatus={items.apiStatus} />
        ))
      }
      <div className="sc_cl_form_buttons">
          <FnBtnComponent children={"Back"} onClick={() => console.log("Next 1")} classname='sc_cl_close_button' />
          <FnBtnComponent children={"Next"} onClick={() => validateSelectedTables()} classname='sc_cl_submit_button' />
      </div>

    </div>
  )
}



const FnColumnSelection = ({ rightItems, authTokens, getselectedConnections, getColumnWithTabeID, setColumnWithTabeID,
  getselectedItems, setSelectedItems, getsavedQueryDefinition }) => {

  const [savedTableItems, setSavedTableItems] = useState([]);

  const [getToast, setToast] = useState([])

  const [gettoastMessage, setToastMessage] = useState(false)

  useEffect(() => {
    handleGetColumnSelectedTable();
    handleGetSavedTable()
  }, [])

  const [getcolumnData, setColumnData] = useState([]);
  const [search, setSearch] = useState();
  const [order, setOrder] = useState();

  const handleGetColumnSelectedTable = async () => {
    let getColumnRequest = await fetch(
      `${process.env.REACT_APP_SERVER_URL}/api/display_columns`,
      {
        method: "POST",
        body: JSON.stringify({ "getselectedConnections": getselectedConnections, "rightItems": rightItems }),
        headers: {
          "Content-Type": "application/json",
          Authorization: "Bearer " + String(authTokens.access),
        },
      }
    );

    let getColumnResults = await getColumnRequest.json()

    setColumnData([...getColumnResults])

    transformData(getColumnResults)
  }


  const handleGetSavedTable = async () => {
    let querytableRequest = await fetch(
      `${process.env.REACT_APP_SERVER_URL}/api/get_save_table_data/${getsavedQueryDefinition.id}`,
      {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          Authorization: "Bearer " + String(authTokens.access),
        },
      }
    );
    let querytableResults = await querytableRequest.json()

    setSavedTableItems(querytableResults)

  }

  const transformData = (getColumnResults) => {
    const transformedColumns = getColumnResults.map((table, id) => {
      const tableName = Object.keys(table)[0];
      const tableColumns = table[tableName];

      return {
        "table_name": tableName,
        "table_columns": tableColumns,
      };
    });

    setColumnWithTabeID(transformedColumns)
  }

  const handleColumnSelection = (table, column) => {
    const isSelected = getselectedItems.some(
      (selectedItem) =>
        selectedItem.table_name === table.table_name && selectedItem.column.id === column.id
    );



    if (isSelected) {
      setSelectedItems(
        (prevSelectedItems) =>
          prevSelectedItems.filter(
            (selectedItem) =>
              selectedItem.table_name !== table.table_name || selectedItem.column.id !== column.id
          )
      );
    } else {
      // If not selected, add it to selectedItems
      setSelectedItems(
        [...getselectedItems, { table_name: table.table_name, column }]
      );
    }

  };

  const handlePostColumnData = async () => {
    const transformedData = {};


    getselectedItems.forEach(({ table_name, column }) => {
      if (!transformedData[table_name]) {
        transformedData[table_name] = {
          query_id: getsavedQueryDefinition.id,
          table_name,
          table_columns: [],
          created_by: getsavedQueryDefinition.created_by,
          last_updated_by: getsavedQueryDefinition.last_updated_by
        };
      }

      let matchinTableItems = savedTableItems.find((savedTables) => savedTables.table_name === table_name && savedTables.query_id === getsavedQueryDefinition.id)


      transformedData[table_name].table_columns.push({
        columnName: column.columnName,
        DataType: column.dataType,
        tableId: matchinTableItems.id,
        setAliasName: null
      });
    });

    let transformedColumnData = Object.values(transformedData)



    let postTableColumnRequest = await fetch(
      `${process.env.REACT_APP_SERVER_URL}/api/ins_save_column_data`,
      {
        method: "POST",
        body: JSON.stringify(transformedColumnData),
        headers: {
          "Content-Type": "application/json",
          Authorization: "Bearer " + String(authTokens.access),
        },
      }
    );

    let postTableColumnResults = await postTableColumnRequest.json()

    if (postTableColumnRequest.status === 200) {
      setToastMessage(true)
      setToast((msgItm) => [...msgItm, { message: 'Selected columns have been saved', apiStatus: 200 }])
    } else {
      setToastMessage(true)
      setToast((msgItm) => [...msgItm, { message: 'Selected columns have not been saved', apiStatus: 400 }])

    }

  }

  const fnHandlesorting = (sortField, sortOrder, objectList) => {
    if (sortField && sortOrder === "asc") {
      const sorted = [...objectList].sort((a, b) =>
        a[sortField].toString().toUpperCase() <
          b[sortField].toString().toUpperCase()
          ? -1
          : 1
      );
      return sorted;
    }

    if (sortField && sortOrder === "desc") {
      const sorted = [...objectList].sort((a, b) =>
        a[sortField].toString().toUpperCase() >
          b[sortField].toString().toUpperCase()
          ? -1
          : 1
      );
      return sorted;
    }
  };

  const toggleSorting = (idx, objectkey, Key) => {
    let tempOrder = order?.[idx] === "asc" ? "desc" : "asc";

    let objectList = [...objectkey];
    setOrder({
      ...order,
      [idx]: tempOrder,
    });

    let sortedData = fnHandlesorting("columnName", tempOrder, objectList);

    let tempSearchData = [...getColumnWithTabeID];
    tempSearchData[idx]['table_columns'] = sortedData;
  };

  const toggleSearch = (evnt, id, Key) => {
    const objectkey = getcolumnData?.[id]?.[Key];
    setSearch({
      ...search,
      [id]: evnt.target.value,
    });


    let searchData = [
      ...objectkey
        .filter((i, j) =>
          i.columnName.toLowerCase().includes(evnt.target.value.toLowerCase())
        )
        .map((m, n) => m),
    ];

    let tempSearchData = [...getColumnWithTabeID];
    tempSearchData[id]['table_columns'] = searchData;
  };


  return (
    <div className="col-12 d-flex gap-1 mt-3 flex-column">
      <div className="col-12  column_table_container">
        {
          getColumnWithTabeID && getColumnWithTabeID.map((tableItems, tableIndex) => {
            return (
              <Accordion defaultActiveKey="0">
                <Accordion.Item eventKey={tableIndex}>
                  <Accordion.Header>{tableItems.table_name}</Accordion.Header>
                  <Accordion.Body className="column-accordion-body">
                    <ul className="list-unstyled selector_list">
                      <Form id={tableIndex} key={tableIndex}>
                        <FormGroup className="sc_cl_search_field">
                          <Form.Control
                            id={tableIndex}
                            type="text"
                            onChange={(e) => toggleSearch(e, tableIndex, tableItems.table_name)}
                            value={search?.[tableIndex] || ""}
                            name="Search"
                            className="sc_cl_Search px-3 me-2 small-button"
                            required
                            autoComplete="off"
                          />
                          <Form.Label className="form-label">Search</Form.Label>
                          <i
                            id={tableIndex}
                            style={{ cursor: "pointer" }}
                            onClick={() =>
                              toggleSorting(tableIndex, tableItems.table_columns, tableItems.table_name)
                            }
                            className="align-items-center d-flex form-label justify-content-center sc_cl_sorting_icon"
                          >
                            {order?.[tableIndex] === "asc" ? (
                              <BiSortAZ
                                size={18}
                                id="sc_id_sortdown"
                                className="sc_cl_sortdown text-primary"
                              />
                            ) : (
                              <BiSortZA
                                size={18}
                                id="sc_id_sortup"
                                className="sc_cl_sortup text-primary"
                              />
                            )}
                          </i>
                        </FormGroup>
                      </Form>
                    </ul>

                    <ul className="list-unstyled selector_list">
                      {
                        tableItems.table_columns.map((columnItems, colIndex) => {
                          const tempsearchWord =
                            search?.[colIndex] && search?.[colIndex].toLowerCase();
                          function highlight(text) {
                            if (
                              text.toLowerCase().includes(tempsearchWord) === true
                            ) {
                              const regex = new RegExp(tempsearchWord, "gi");
                              const wrappedText = text.replace(
                                regex,
                                `${"<span className=sc_cl_highlight>"}$&${"</span>"}`
                              );
                              return Parser(wrappedText);
                            } else {
                              return text;
                            }
                          }
                          let tempData =
                            search?.[colIndex] !== ""
                              ? highlight(columnItems.columnName)
                              : columnItems.columnName;
                          return (
                            <li key={colIndex}>
                              <input
                                type="checkbox"
                                checked={getselectedItems.some(
                                  (selectedItem) =>

                                    selectedItem.table_name === tableItems.table_name && selectedItem.column.id === columnItems.id
                                )

                                }
                                onChange={() => handleColumnSelection(tableItems, columnItems)}
                              />
                              <span>{tempData}</span>
                            </li>
                          );
                        })}
                    </ul>
                  </Accordion.Body>
                </Accordion.Item>
              </Accordion>
            )
          })
        }
      </div>

      {/* <div>
        <button onClick={() => handlePostColumnData()} className="mt-2 sc_cl_outline_button">Save & Continue</button>
      </div> */}

      {
        gettoastMessage && getToast.map((items, idx) => (
          <FnToastMessageComp Header={"Notification"} duration={3000} message={items.message} key={idx} apiStatus={items.apiStatus} />
        ))
      }

    </div>
  )
}



const FnColumnAliasSelection = ({ getSelectedColumn, authTokens, getsavedQueryDefinition, getcolumnalias, setColumnAlias }) => {
  const [getTableIdtoMerge, setTableIdToMerge] = useState([]);
  const [getColumnId, setColumnId] = useState([])
  const [table_columns_query, setTable_columns_query] = useState("");

  const [getToast, setToast] = useState([])

  const [gettoastMessage, setToastMessage] = useState(false)





  useEffect(() => {
    handleGetSavedColumnData();
  }, []);

  const string_operators = [
    { id: 1, key: "concat", value: "CONCAT" },
    { id: 2, key: "substring", value: "SUBSTRING" },
    { id: 3, key: "length", value: "LENGTH" },
    { id: 4, key: "upper", value: "UPPER" },
    { id: 5, key: "trim", value: "TRIM" },
    { id: 6, key: "replace", value: "REPLACE" },
    { id: 7, key: "instr", value: "INSTR" },
    { id: 8, key: "right", value: "RIGHT" },
    { id: 9, key: "left", value: "LEFT" },
    { id: 10, key: "insert", value: "INSERT" },
    { id: 11, key: "repeat", value: "REPEAT" },
  ];

  const handleGetSavedColumnData = async () => {
    let savedTableDataRequest = await fetch(
      `${process.env.REACT_APP_SERVER_URL}/api/get_save_table_data`,
      {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          Authorization: "Bearer " + String(authTokens.access),
        },
      }
    );


    let savedColumnDataRequest = await fetch(
      `${process.env.REACT_APP_SERVER_URL}/api/get_save_column_data`,
      {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          Authorization: "Bearer " + String(authTokens.access),
        },
      }
    );

    let savedTableDataResults = await savedTableDataRequest.json();
    let savedColumnDataResults = await savedColumnDataRequest.json();

    setTableIdToMerge(savedTableDataResults);
    setColumnId(savedColumnDataResults)
  };

  const handleAliasEvent = (i, e, datatype) => {
    let list = [...getcolumnalias];

    if (!(Array.isArray(e))) {

      if ((e.target.name === "setColumnFunction" && e.target.value == "REPLACE") ||
        (e.target.name === "setColumnFunction" && e.target.value == "SUBSTRING")
      ) {
        delete list[i]["setFunctionValue"];
      }

      if ((e.target.name === "setColumnFunction" && e.target.value != "REPLACE") ||
        (e.target.name === "setColumnFunction" && e.target.value == "SUBSTRING")) {
        delete list[i]["setFunctionStartValue"];
        delete list[i]["setFunctionEndValue"];
      }

      if ((e.target.name === "setColumnFunction" && e.target.value == "LENGTH") ||
        (e.target.name === "setColumnFunction" && e.target.value == "UPPER") ||
        (e.target.name === "setColumnFunction" && e.target.value == "TRIM")) {
        delete list[i]["setFunctionValue"];
        delete list[i]["setFunctionStartValue"];
        delete list[i]["setFunctionEndValue"];
      }

      list[i][e.target.name] = e.target.value;
    }

    else {
      list[i]['setMultiValue'] = Array.isArray(e) ? e.map(x => x.value) : []
    }


    setColumnAlias(list);
  };


  const addAliasRow = () => {
    setColumnAlias([
      ...getcolumnalias, {
        selectedTableName: '',
        selectedColumnName: '',
        setAliasName: '',
      }
    ])
  }
  useEffect(() => {
    if (getcolumnalias.length === 0) {
      setColumnAlias([{
        selectedTableName: '',
        selectedColumnName: '',
        setAliasName: ''
      }])
    }
  })

  const removeAliasRow = (index) => {
    const removedAliasName = [...getcolumnalias];
    removedAliasName.splice(index, 1);
    setColumnAlias(removedAliasName);
  }

  const handlePostColumAliasData = async () => {


    const updatedAliasName = getcolumnalias.map((aliasItems) => {
      const updatedTabelIdResult = getTableIdtoMerge.find((resultItems) =>
        getsavedQueryDefinition.id === resultItems.query_id &&
        resultItems.table_name === aliasItems.selectedTableName
      )

      const updatedColumnIdResult = getColumnId.find((columnResultItems) =>
        columnResultItems.table_column_query_id === getsavedQueryDefinition.id &&
        columnResultItems.column_name === aliasItems.selectedColumnName
      )

      return {
        ...aliasItems,
        aliastableId: updatedTabelIdResult ? updatedTabelIdResult.id : null,
        aliascolumnId: updatedColumnIdResult ? updatedColumnIdResult.id : null,
        query_id: getsavedQueryDefinition.id,
        created_by: getsavedQueryDefinition.created_by,
        last_updated_by: getsavedQueryDefinition.last_updated_by

      }
    })

    const requestAliasTabelData = await fetch(
      `${process.env.REACT_APP_SERVER_URL}/api/ins_alias_table_data`,
      {
        method: "PUT",
        body: JSON.stringify(updatedAliasName),
        headers: {
          "Content-Type": "application/json",
          Authorization: "Bearer " + String(authTokens.access),
        },

      }
    )
    let resultAliasTableData = await requestAliasTabelData.json()

    if (requestAliasTabelData.status === 200) {
      setToastMessage(true)
      setToast((msgItm) => [...msgItm, { message: 'Alias has been saved', apiStatus: 201 }])
    } else {
      setToastMessage(true)
      setToast((msgItm) => [...msgItm, { message: 'Alias has not been saved', apiStatus: 400 }])
    }

  }

  return (
    <div>

      <div className="d-flex justify-content-end mt-3">
        <button onClick={() => addAliasRow()} className="bg-opacity-75 bg-primary border px-2 py-1 rounded text-white">Add Row + </button>
      </div>

      <div className="mt-3">
        <Table>
          <thead>
            <tr>
              <th>Table Name</th>
              <th>Column Name</th>
              <th>Alias Name</th>
              <th>Function</th>
              <th>Value</th>
              {getcolumnalias.length > 1 ? <th>Action</th> : ""}
            </tr>
          </thead>

          <tbody>
            {
              getcolumnalias
                .map((aliasItems, aliasIndex) => {
                  return (
                    <tr key={aliasIndex}>
                      <td>
                        <select
                          className={`form-select form-select-sm`}
                          value={aliasItems.selectedTableName}
                          name={"selectedTableName"}
                          onChange={(e) => handleAliasEvent(aliasIndex, e)}
                        >
                          <option value="">Select Table</option>
                          {getSelectedColumn.map((tableNameItems, tableNametableIndex) => (
                            <option key={tableNametableIndex} data-id={tableNameItems.id === aliasItems.table_column_table_id}>
                              {tableNameItems.table_name}
                            </option>
                          )
                          )}
                        </select>
                      </td>

                      <td>
                        <select
                          value={aliasItems.selectedColumnName}
                          className={`form-select form-select-sm`}
                          name={"selectedColumnName"}
                          onChange={(e) => handleAliasEvent(aliasIndex, e)}
                        >
                          <option hidden>Select Option</option>
                          {getSelectedColumn
                            .find((item) => item.table_name === aliasItems.selectedTableName)
                            ?.table_columns.map((col, colIndex) => (
                              <option key={colIndex} value={col.columnName}>
                                {col.columnName}
                              </option>
                            ))}
                        </select>
                      </td>

                      <td>
                        <input value={aliasItems.setAliasName} name={"setAliasName"} onChange={(e) => handleAliasEvent(aliasIndex, e)} className="border border-opacity-50 border-primary col-11 form-control-sm shadow-sm" />
                      </td>

                      <td>
                        <Form.Select
                          value={aliasItems.setColumnFunction}
                          name={"setColumnFunction"}
                          onChange={(e) => handleAliasEvent(aliasIndex, e)}
                          size="sm"
                          className="w-auto"
                          disabled
                        >
                          <option hidden>Select Option</option>
                          <React.Fragment key={aliasIndex}>
                            {string_operators.map((columnItems, idx) => {
                              return (
                                <option
                                  key={columnItems.id}
                                  value={columnItems.value}
                                >
                                  {columnItems.key}
                                </option>
                              );
                            })}
                          </React.Fragment>
                        </Form.Select>
                      </td>

                      <td>
                        <React.Fragment key={aliasIndex}>
                          {aliasItems.setColumnFunction != "LENGTH" &&
                            aliasItems.setColumnFunction != "UPPER" &&
                            aliasItems.setColumnFunction != "TRIM" &&
                            aliasItems.setColumnFunction != "REPLACE" &&
                            aliasItems.setColumnFunction != "SUBSTRING" &&
                            aliasItems.setColumnFunction != "CONCAT" ? (
                            <input
                              type={"text"}
                              placeholder="Enter the Value"
                              value={aliasItems.setFunctionValue}
                              name="setFunctionValue"
                              onChange={(e) => handleAliasEvent(aliasIndex, e)}
                              className="border border-opacity-50 border-primary col-11 form-control-sm shadow-sm"
                              disabled
                            />
                          ) : (
                            <React.Fragment>
                              {aliasItems.setColumnFunction == "REPLACE" ||
                                aliasItems.setColumnFunction == "SUBSTRING"
                                ? (
                                  <React.Fragment>
                                    <input
                                      type={"text"}
                                      className={`mx-2 `}
                                      value={aliasItems.setFunctionStartValue}
                                      name="setFunctionStartValue"
                                      onChange={(e) => handleAliasEvent(aliasIndex, e)}
                                    />
                                    <input
                                      type={"text"}
                                      className={` `}
                                      value={aliasItems.setFunctionEndValue}
                                      name="setFunctionEndValue"
                                      onChange={(e) => handleAliasEvent(aliasIndex, e)}
                                    />
                                  </React.Fragment>
                                ) : (<React.Fragment>
                                  {aliasItems.setColumnFunction == "CONCAT"
                                    ? (

                                      <React.Fragment>
                                        {
                                          (() => {
                                            // Declare a variable
                                            const resultArray = [];
                                            let value_array = getSelectedColumn
                                              .find((item) => item.table_name === aliasItems.selectedTableName)
                                              ?.table_columns.filter(col => col.columnName !== aliasItems.selectedColumnName)
                                              .map((col, colIndex) => (col.columnName));

                                            // Use a for loop
                                            for (let i = 0; i < value_array.length; i++) {
                                              resultArray.push({ value: value_array[i], label: value_array[i].toUpperCase() })
                                            }

                                            return (
                                              <React.Fragment>
                                                <Select
                                                  name={"setMultiValue"}
                                                  className='dropdown w-75'
                                                  placeholder="Select Option"
                                                  value={resultArray.filter(obj => aliasItems?.setMultiValue?.includes(obj.value))}
                                                  defaultValue={resultArray}
                                                  options={resultArray}
                                                  onChange={(e) => handleAliasEvent(aliasIndex, e)}
                                                  isMulti
                                                  isClearable
                                                  isSearchable
                                                />
                                              </React.Fragment>
                                            )
                                          })()
                                        }
                                      </React.Fragment>
                                    ) : ("")
                                  }
                                </React.Fragment>)}
                            </React.Fragment>
                          )}
                        </React.Fragment>
                      </td>

                      <td>
                        {getcolumnalias.length > 1 ? <button onClick={() => removeAliasRow()} className="bg-danger border d-flex gap-2 px-2 py-1 rounded shadow-sm text-white">
                          <span>{<RiDeleteRow />}</span>
                          <span>Remove</span>
                        </button> : ''}
                      </td>
                    </tr>
                  )
                })
            }
          </tbody>
        </Table>
      </div>

      {/* <div>
        <button onClick={() => handlePostColumAliasData()} className="mt-2 sc_cl_outline_button">Save & Continue</button>
      </div> */}

      {
        gettoastMessage && getToast.map((items, idx) => (
          <FnToastMessageComp Header={"Notification"} duration={3000} message={items.message} key={idx} apiStatus={items.apiStatus} />
        ))
      }

    </div>
  )
}



const FnColumnAggreation = ({ getSelectedColumn, authTokens, getsavedQueryDefinition, rows, setRows }) => {
  // const [rows, setRows] = useState([{}])
  const [errorlog, setErrorLog] = useState([]);

  const [getTableIdtoMerge, setTableIdToMerge] = useState([]);
  const [getColumnId, setColumnId] = useState([])

  const [getToast, setToast] = useState([])

  const [gettoastMessage, setToastMessage] = useState(false)



  const aggregateFunctions = [
    { id: 1, key: "Count", value: "COUNT" },
    { id: 2, key: "Sum", value: "SUM" },
    { id: 3, key: "Average", value: "AVG" },
    { id: 4, key: "Mim", value: "Min" },
    { id: 5, key: "Max", value: "Max" },
    { id: 6, key: "Distinct", value: "DISTINCT" },
  ];

  useEffect(() => {
    handleGetSavedColumnData()
    if (rows.length === 0) {
      setRows([{
        selectedTable: '',
        selectedColumn: '',
        selectedAttribute: ''
      }])
    }
  }, [])


  const handleGetSavedColumnData = async () => {
    let savedTableDataRequest = await fetch(
      `${process.env.REACT_APP_SERVER_URL}/api/get_save_table_data/${getsavedQueryDefinition.id}`,
      {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          Authorization: "Bearer " + String(authTokens.access),
        },
      }
    );


    let savedColumnDataRequest = await fetch(
      `${process.env.REACT_APP_SERVER_URL}/api/get_save_column_data/${getsavedQueryDefinition.id}`,
      {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          Authorization: "Bearer " + String(authTokens.access),
        },
      }
    );

    let savedTableDataResults = await savedTableDataRequest.json();
    let savedColumnDataResults = await savedColumnDataRequest.json();


    setTableIdToMerge(savedTableDataResults);
    setColumnId(savedColumnDataResults)
  }

  const addRow = () => {
    let check_empty = false
    const updatederror = [...errorlog];
    updatederror.map(perr => {
      Object.keys(perr).map(cerr => {
        if (perr[cerr] !== '') {
          check_empty = true
        }
      })
    })
    rows.map((prow, i) => {
      if (updatederror[i] === undefined) {
        updatederror[i] = {}
      }
      Object.keys(prow).map(crow => {
        if (prow[crow] === '') {
          check_empty = true
          updatederror[i][crow] = 'This field is empty';
        }
      })
    })
    setErrorLog(updatederror)
    if (!check_empty) {
      setRows([
        ...rows,
        {
          selectedTable: '',
          selectedColumn: '',
          selectedAttribute: '',
        },
      ]);
    }
  };

  const removeRow = (index) => {
    const updatedRows = [...rows];
    updatedRows.splice(index, 1);
    setRows(updatedRows);

    const updatedError = [...errorlog];
    updatedError.splice(index, 1);
    setErrorLog(updatedError);
  };

  const checkvalidation = (i, e) => {
    const isTableColumnRepeated = rows.some(
      (row) => row.selectedTable === rows[i].selectedTable && row.selectedColumn === rows[i].selectedColumn && row.selectedAttribute === e.target.value
    )


    if (isTableColumnRepeated) {
      const updatederror = [...errorlog];
      if (updatederror[i] === undefined) {
        updatederror[i] = {}
      }
      updatederror[i][e.target.name] = 'Already Exist';
      setErrorLog(updatederror)
    } else {
      let updatederror = [...errorlog];
      rows.map((row, i1) => {
        if (row.selectedTable === rows[i].selectedTable && row.selectedColumn === rows[i].selectedColumn && row.selectedAttribute === rows[i].selectedAttribute) {
          if (updatederror[i1] !== undefined) {
            // updatederror.splice(i1, 1);
            updatederror[i1][e.target.name] = '';
            // return;
          }
        }
      })
      // updatederror = '';
      setErrorLog(updatederror)
    }

    return isTableColumnRepeated
  }

  const InputHandler = (index, e, table) => {
    if (errorlog[index] !== undefined) {
      errorlog[index][e.target.name] = ''
    }
    const updatedRows = [...rows];
    if (table === 'selectedColumn') {
      updatedRows[index]['selectedAttribute'] = '';
    } else if (table === 'selectedAttribute') {
      checkvalidation(index, e)
    } else {
      updatedRows[index]['selectedColumn'] = '';
      updatedRows[index]['selectedAttribute'] = '';
    }
    updatedRows[index][e.target.name] = e.target.value;
    setRows(updatedRows);

  };

  const handlePostAggregationData = async () => {
    const updatedAggregatedName = rows.map((aggregrateItems) => {
      const updatedTabelIdResult = getTableIdtoMerge.find((resultItems) =>
        resultItems.query_id === getsavedQueryDefinition.id &&
        resultItems.table_name === aggregrateItems.selectedTable
      )



      const updatedColumnIdResult = getColumnId.find((columnResultItems) =>
        columnResultItems.table_column_query_id === getsavedQueryDefinition.id &&
        columnResultItems.column_name === aggregrateItems.selectedColumn
      )



      return {
        ...aggregrateItems,
        query_id: getsavedQueryDefinition.id,
        aggregatetableId: updatedTabelIdResult ? updatedTabelIdResult.id : null,
        aggregatecolumnId: updatedColumnIdResult ? updatedColumnIdResult.id : null,
        created_by: getsavedQueryDefinition.created_by,
        last_updated_by: getsavedQueryDefinition.last_updated_by
      }
    })




    const requestAggregateTabelData = await fetch(
      `${process.env.REACT_APP_SERVER_URL}/api/ins_aggregate_table_data`,
      {
        method: "POST",
        body: JSON.stringify(updatedAggregatedName),
        headers: {
          "Content-Type": "application/json",
          Authorization: "Bearer " + String(authTokens.access),
        },

      }
    )
    let resultAggregatedTableData = await requestAggregateTabelData.json()

    if (requestAggregateTabelData.status == 200) {
      setToastMessage(true)
      setToast((msgItm) => [...msgItm, { message: 'Aggreagtion Data for the respective column is being saved', apiStatus: 200 }])
    } else {
      setToastMessage(true)
      setToast((msgItm) => [...msgItm, { message: 'Aggreagtion Data for the respective column is not being saved', apiStatus: 400 }])
    }
  };


  return (
    <div>
      <div className="d-flex justify-content-end mt-3">
        <button onClick={() => addRow()} className="bg-opacity-75 bg-primary border px-2 py-1 rounded text-white">Add Row +</button>
      </div>

      <Table className="mt-3">
        <thead>
          <tr>
            <th>Table Name</th>
            <th>Column Name</th>
            <th>Operation</th>
            {rows.length > 1 ? <th>Action</th> : ''}

          </tr>
        </thead>

        <tbody>
          {rows.map((row, index) => (
            <tr key={index}>
              <td>
                <select
                  className={`form-select form-select-sm`}
                  // className={`form-select-sm ${errorlog[index] ? 'border-danger' : null}`}
                  name="selectedTable"
                  value={row.selectedTable}
                  onChange={(e) => InputHandler(index, e)}
                >
                  <option hidden value="">Select Table</option>
                  {getSelectedColumn.map((tableNameItems, tableNametableIndex) => (
                    <option key={tableNametableIndex}>{tableNameItems.table_name}</option>
                  ))}
                </select>
                {errorlog[index] && errorlog[index].selectedTable && (<span className="text-danger">{errorlog[index].selectedTable}</span>)}
              </td>

              <td>
                <select
                  value={row.selectedColumn}
                  name="selectedColumn"
                  className={`form-select form-select-sm`}
                  onChange={(e) => InputHandler(index, e, 'selectedColumn')}
                >
                  <option disabled value="">Select Column</option>
                  {getSelectedColumn
                    .find((item) => item.table_name === row.selectedTable)
                    ?.table_columns.map((col, colIndex) => (
                      <option key={colIndex} value={col.columnName}>
                        {col.columnName}
                      </option>
                    ))}
                </select>
                {errorlog[index] && errorlog[index].selectedColumn && (<span className="text-danger">{errorlog[index].selectedColumn}</span>)}
                {/* {errorlog && errorlog.columnError && (<span className="text-danger">{errorlog.columnError}</span>)} */}
              </td>

              <td>
                <select
                  name="selectedAttribute"
                  value={row.selectedAttribute}
                  onChange={(e) => InputHandler(index, e, 'selectedAttribute')}
                  className={`form-select form-select-sm`}
                >
                  <option hidden value="">select</option>
                  {getSelectedColumn
                    .find((item) => item.table_name === row.selectedTable)
                    ?.table_columns.map((col) => {
                      if (col.columnName === row.selectedColumn) {
                        if (col.DataType === 'int' || col.DataType === 'bigint' || col.DataType === 'tinyint') {
                          return (
                            aggregateFunctions.map(item => {
                              return <option>{item.key}</option>
                            }))

                        } else if (col.DataType === 'varchar' || col.DataType === 'datetime') {
                          // const filtedraf = aggregateFunctions.filter(af => af.id === 1 || af.id === 4 || af.id === 5)
                          return (
                            aggregateFunctions.filter(af => af.id === 1 || af.id === 4 || af.id === 5 || af.id === 6).map(item => {
                              return <option>{item.key}</option>
                            }))
                        } else {
                          <option>Not available yet</option>
                        }
                      }
                    }
                    )
                  }
                </select>
                {errorlog[index] && errorlog[index].selectedAttribute && (<span className="text-danger">{errorlog[index].selectedAttribute}</span>)}
              </td>


              <td>
                {rows.length > 1 ? <button onClick={() => removeRow(index)} className="bg-danger border d-flex gap-2 px-2 py-1 rounded shadow-sm text-white">
                  <span>{<RiDeleteRow />}</span>
                  <span>Remove</span>
                </button> : ''}
              </td>
            </tr>
          ))}
        </tbody>
      </Table>

      {/* <div>
        <button onClick={() => handlePostAggregationData()} className="mt-2 sc_cl_outline_button">Save & Continue</button>
      </div> */}
      {
        gettoastMessage && getToast.map((items, idx) => (
          <FnToastMessageComp Header={"Notification"} duration={3000} message={items.message} key={idx} apiStatus={items.apiStatus} />
        ))
      }

    </div>
  );
}



const FnJoinOperation = ({ getSelectedColumn, getselectedConnections, authTokens, getsavedQueryDefinition, getjoinrows,
  setJoinRows, getallcolumns, setAllColumns }) => {
  const [getTableIdtoMerge, setTableIdToMerge] = useState([])

  const [getToast, setToast] = useState([])
  const [gettoastMessage, setToastMessage] = useState(false)


  // const [errorlog, setErrorLog] = useState([
  //   {
  //     tableError: '',
  //     columnError: '',
  //   },
  // ]);

  useEffect(() => {
    handleGetSavedTableData()
    if (getjoinrows.length === 0) {
      setJoinRows([{
        selectedTable: '',
        selectedColumn: '',
        selectedAttribute: '',
        selectedTable2: '',
        selectedColumn2: '',
      }])
    }
  }, [])


  const handleGetSavedTableData = async () => {
    let savedColumnDataRequest = await fetch(
      `${process.env.REACT_APP_SERVER_URL}/api/get_save_table_data`,
      {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          Authorization: "Bearer " + String(authTokens.access),
        },

      }
    )

    let savedColumnDataResults = await savedColumnDataRequest.json()
    setTableIdToMerge(savedColumnDataResults)
  }

  const addRow = () => {
    setJoinRows([
      ...getjoinrows,
      {
        selectedTable: '',
        selectedColumn: '',
        selectedAttribute: '',
        selectedTable2: '',
        selectedColumn2: '',
      },
    ]);

    // setErrorLog([
    //   ...errorlog,
    //   {
    //     tableError: '',
    //     columnError: '',
    //   },
    // ]);
  };

  const removeRow = (index) => {
    const updatedRows = [...getjoinrows];
    updatedRows.splice(index, 1);
    setJoinRows(updatedRows);

    // const updatedError = [...errorlog];
    // updatedError.splice(index, 1);
    // setErrorLog(updatedError);
  };

  const handleTableChange = (index, value) => {
    const updatedRows = [...getjoinrows];
    updatedRows[index].selectedTable = value;
    setJoinRows(updatedRows);
    // validateTableColumn(index, value, getjoinrows[index].selectedColumn, getjoinrows[index].selectedAttribute);
  };

  const handleTable2Change = (index, value) => {
    const updatedRows = [...getjoinrows];
    updatedRows[index].selectedTable2 = value;
    setJoinRows(updatedRows);
    // validateTableColumn(index, value, getjoinrows[index].selectedColumn2, getjoinrows[index].selectedAttribute);
  };

  const handleColumnChange = (index, value) => {
    const updatedRows = [...getjoinrows];
    updatedRows[index].selectedColumn = value;
    setJoinRows(updatedRows);
    // validateTableColumn(index, getjoinrows[index].selectedTable, value, getjoinrows[index].selectedAttribute);
  };

  const handleColumn2Change = (index, value) => {
    const updatedRows = [...getjoinrows];
    updatedRows[index].selectedColumn2 = value;
    setJoinRows(updatedRows);
    // validateTableColumn(index, getjoinrows[index].selectedTable2, value, getjoinrows[index].selectedAttribute);
  };

  const handleAttributeChange = (index, value) => {
    const updatedRows = [...getjoinrows];
    updatedRows[index].selectedAttribute = value;
    setJoinRows(updatedRows);
    // validateTableColumn(index, getjoinrows[index].selectedTable, getjoinrows[index].selectedColumn, value);
  };

  // const validateTableColumn = (index, table, column, attribute) => {
  //     const updatedError = [...errorlog];
  //     updatedError[index].tableError = '';
  //     updatedError[index].columnError = '';

  //     const errorTableRows = [...getjoinrows]

  //     if (index > 0) {
  //         const prevRows = getjoinrows.slice(0, index);


  //         const isTableColumnRepeated = prevRows.some(
  //             (row) => row.selectedTable === errorTableRows[index].selectedTable && row.selectedColumn === errorTableRows[index].selectedColumn && row.selectedTable2 === errorTableRows[index].selectedTable2 && row.selectedColumn2 === errorTableRows[index].selectedColumn2
  //         );

  //         if (isTableColumnRepeated) {
  //             updatedError[index].tableError = "Selected tables and columns must be unique across all getjoinrows.";
  //             updatedError[index].columnError = "Selected tables and columns must be unique across all getjoinrows.";
  //         } else {
  //             setErrorLog([])
  //         }
  //     }

  //     if (index < getjoinrows.length - 1) {
  //         const succeedingRow = getjoinrows[index - 1];

  //         if (succeedingRow.selectedColumn === succeedingRow.selectedColumn2) {
  //             updatedError[index + 1].columnError = "Selected columns must be unique in the succeeding row.";
  //         }
  //     }

  //     setErrorLog(updatedError);
  // };

  // const validateTableColumn = (index, table, column, attribute) => {
  //   const updatedError = [...errorlog];
  //   updatedError[index].tableError = '';
  //   updatedError[index].columnError = '';

  //   // Validation logic for table and column
  //   if (index > 0) {
  //     const prevRows = getjoinrows.slice(0, index); // Rows before the current index

  //     // Check if the selected table and column already exist in previous getjoinrows
  //     const isTableColumnRepeated = prevRows.some(
  //       (row) => row.selectedTable === table && row.selectedColumn === column
  //     );

  //     if (isTableColumnRepeated) {
  //       updatedError[index].tableError = "Selected tables and columns must be unique across all getjoinrows.";
  //       updatedError[index].columnError = "Selected tables and columns must be unique across all getjoinrows.";
  //     }
  //   }

  //   // Check if any row is equal to any other row
  //   const isAnyRowEqual = getjoinrows.some((row, i) => i !== index && isEqual(row, getjoinrows[index]));

  //   if (isAnyRowEqual) {
  //     updatedError[index].tableError = "Each row must have unique combinations of table and column values.";
  //     updatedError[index].columnError = "Each row must have unique combinations of table and column values.";
  //   }

  //   setErrorLog(updatedError);
  // };

  const isEqual = (row1, row2) => {
    return (
      row1.selectedTable === row2.selectedTable &&
      row1.selectedColumn === row2.selectedColumn &&
      row1.selectedAttribute === row2.selectedAttribute &&
      row1.selectedTable2 === row2.selectedTable2 &&
      row1.selectedColumn2 === row2.selectedColumn2
    );
  };


  const handleSubmitJoinTable = async () => {
    const updatedSelectedTables = getjoinrows.map((table) => {
      const result1 = getTableIdtoMerge.find(result => result.query_id === getsavedQueryDefinition.id && result.table_name === table.selectedTable);
      const result2 = getTableIdtoMerge.find(result => result.query_id === getsavedQueryDefinition.id && result.table_name === table.selectedTable2);
      return {
        ...table,
        query_id: getsavedQueryDefinition.id,
        tableid1: result1 ? result1.id : null,
        tableid2: result2 ? result2.id : null,
        created_by: getsavedQueryDefinition.created_by,
        last_updated_by: getsavedQueryDefinition.last_updated_by

      };
    });


    const requestJoinTabelData = await fetch(
      `${process.env.REACT_APP_SERVER_URL}/api/ins_save_join_table_data`,
      {
        method: "POST",
        body: JSON.stringify(updatedSelectedTables),
        headers: {
          "Content-Type": "application/json",
          Authorization: "Bearer " + String(authTokens.access),
        },

      }
    )

    let resultJoinTableData = await requestJoinTabelData.json()

    if (requestJoinTabelData.status === 200) {
      setToastMessage(true)
      setToast((msgItm) => [...msgItm, { message: 'Join Data for the respective column is being saved', apiStatus: 200 }])
    }
    else {
      setToastMessage(true)
      setToast((msgItm) => [...msgItm, { message: 'Join Data for the respective column is not being saved', apiStatus: 400 }])
    }

  };

  return (
    <div>

      <div className="d-flex justify-content-end mt-3">
        <button onClick={() => addRow()} className="bg-opacity-75 bg-primary border px-2 py-1 rounded text-white">Add Row + </button>
      </div>

      <Table className="mt-3">
        <thead>
          <tr>
            <th>Table Name</th>
            <th>Column Name</th>
            <th>Join Type</th>
            <th>Table Name 2</th>
            <th>Column Name 2</th>
            {getjoinrows.length > 1 ? <th>Action</th> : ''}
          </tr>
        </thead>

        <tbody>
          {getjoinrows.map((row, index) => (
            <tr key={index}>
              <td>
                <select
                  // className={`form-select-sm ${errorlog[index].tableError ? "border-danger" : null
                  //   }`}
                  className={`form-select form-select-sm `}
                  value={row.selectedTable}
                  onChange={(e) => handleTableChange(index, e.target.value)}
                >
                  <option value="">Select Table</option>
                  {getallcolumns.map((tableNameItems, tableNametableIndex) => (
                    <option key={tableNametableIndex}>{tableNameItems.table_name}</option>
                  ))}
                </select>
              </td>

              <td>
                <select
                  value={row.selectedColumn}
                  // className={`form-select-sm ${errorlog[index].columnError ? "border-danger" : null
                  //   }`}
                  className={`form-select form-select-sm `}
                  onChange={(e) => handleColumnChange(index, e.target.value)}
                >
                  <option value="">Select Column</option>
                  {getallcolumns
                    .find((item) => item.table_name === row.selectedTable)
                    ?.table_columns.map((col, colIndex) => (
                      <option key={colIndex} value={col.columnName}>
                        {col.columnName}
                      </option>
                    ))}
                </select>
                {/* {errorlog[index].columnError && (<span className="text-danger">{errorlog[index].columnError}</span>)} */}
              </td>

              <td>
                <select
                  value={row.selectedAttribute}
                  onChange={(e) => handleAttributeChange(index, e.target.value)}
                  className="form-select form-select-sm"
                >
                  <option hidden value="">select</option>
                  <option value="inner join">Inner Join</option>
                  <option value="right join">Right Join</option>
                  <option value="left join">Left Join</option>
                </select>
              </td>

              <td className="">
                <select
                  // className={`form-select-sm ${errorlog[index].tableError ? "border-danger" : null
                  //   }`}
                  className={`form-select form-select-sm `}
                  value={row.selectedTable2}
                  onChange={(e) => handleTable2Change(index, e.target.value)}
                >
                  <option value="">Select Table</option>
                  {getallcolumns.map((tableNameItems, tableNametableIndex) => (
                    <option key={tableNametableIndex}>{tableNameItems.table_name}</option>
                  ))}
                </select>
                {/* {errorlog[index].tableError && (<span className="text-danger">{errorlog[index].tableError}</span>)} */}
              </td>

              <td className="">
                <select
                  value={row.selectedColumn2}
                  // className={`form-select-sm ${errorlog[index].columnError ? "border-danger" : null
                  //   }`}
                  className={`form-select form-select-sm`}
                  onChange={(e) => handleColumn2Change(index, e.target.value)}
                >
                  <option value="">Select Column</option>
                  {getallcolumns
                    .find((item) => item.table_name === row.selectedTable2)
                    ?.table_columns.map((col, colIndex) => (
                      <option key={colIndex} value={col.columnName}>
                        {col.columnName}
                      </option>
                    ))}
                </select>
                {/* {errorlog[index].columnError && (<span className="text-danger">{errorlog[index].columnError}</span>)} */}
              </td>

              <td>
                {getjoinrows.length > 1 ? <button onClick={() => removeRow(index)} className="bg-danger border d-flex gap-2 px-2 py-1 rounded shadow-sm text-white">
                  <span>{<RiDeleteRow />}</span>
                  <span>Remove</span>
                </button> : ''}
              </td>
            </tr>
          ))}
        </tbody>
      </Table>

      {/* <div>
        <button onClick={() => handleSubmitJoinTable()} className="mt-2 sc_cl_outline_button">Save & Continue</button>
      </div> */}

      {
        gettoastMessage && getToast.map((items, idx) => (
          <FnToastMessageComp Header={"Notification"} duration={3000} message={items.message} key={idx} apiStatus={items.apiStatus} />
        ))
      }


    </div>
  );
};



const FnTableColumnFilter = ({ selectedTables, authTokens, getSelectedColumn, getsavedQueryDefinition,
  query, setQuery, getallcolumns, setAllColumns }) => {

  const [savedtables, setSavedTables] = useState([])

  const [getToast, setToast] = useState([])

  const [gettoastMessage, setToastMessage] = useState(false)

  useEffect(() => {
    handleGetSavedTableData()
    // if(query.length > 0){

    // }
  }, [])


  const handleGetSavedTableData = async () => {
    let savedColumnDataRequest = await fetch(
      `${process.env.REACT_APP_SERVER_URL}/api/get_save_table_data`,
      {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          Authorization: "Bearer " + String(authTokens.access),
        },
      }
    )
    let savedColumnDataResults = await savedColumnDataRequest.json()
    setSavedTables(savedColumnDataResults)
  }



  const string_operators = [
    { id: 1, key: "Starts with", value: "LIKE%" },
    { id: 2, key: "Ends with", value: "%LIKE" },
    { id: 3, key: "Middle", value: "%LIKE%" },
    { id: 4, key: "Not Starts with", value: "NOT LIKE%" },
    { id: 5, key: "Not Ends with", value: "%NOT LIKE" },
    { id: 6, key: "Not in Middle", value: "%NOT LIKE%" },
    { id: 7, key: "Equal to", value: "==" },
    { id: 8, key: "Not Equal to", value: "<>" },
    { id: 9, key: "Blank", value: "IS NULL" },
    { id: 10, key: "Not Blank", value: "IS NOT NULL" },
    { id: 11, key: "Specific keys", value: "IN" },
    { id: 12, key: "Not Specific keys", value: "NOT IN" },
    { id: 13, key: "Regular Expressions", value: "REGEXP" },
  ];

  let numeric_operators = [
    { id: 1, key: "Starts with", value: "LIKE%" },
    { id: 2, key: "Ends with", value: "%LIKE" },
    { id: 3, key: "Middle", value: "%LIKE%" },
    { id: 4, key: "Not Starts with", value: "NOT LIKE%" },
    { id: 5, key: "Not Ends with", value: "%NOT LIKE" },
    { id: 6, key: "Not in Middle", value: "%NOT LIKE%" },
    { id: 7, key: "Equal to", value: "==" },
    { id: 8, key: "Not Equal to", value: "<>" },
    { id: 9, key: "greater than", value: ">" },
    { id: 10, key: "greater than or equal to", value: ">=" },
    { id: 11, key: "lesser than", value: "<" },
    { id: 12, key: "lesser than or equal to", value: "<=" },
    { id: 13, key: "Blank", value: "IS NULL" },
    { id: 14, key: "Not Blank", value: "IS NOT NULL" },
    { id: 15, key: "Specific keys", value: "IN" },
    { id: 16, key: "Not Specific keys", value: "NOT IN" },
    { id: 17, key: "Regular Expressions", value: "REGEX" },
    { id: 18, key: "Between", value: "BETWEEN" },
  ];

  let date_operators = [
    { id: 1, key: "Equal to", value: "==" },
    { id: 2, key: "greater than", value: ">" },
    { id: 3, key: "greater than or equal to", value: ">=" },
    { id: 4, key: "lesser than", value: "<" },
    { id: 5, key: "lesser than or equal to", value: "<=" },
    { id: 6, key: "Blank", value: "IS NULL" },
    { id: 7, key: "Not Blank", value: "IS NOT NULL" },
    { id: 8, key: "Between", value: "BETWEEN" },
  ];

  let handle_filter_event = (i, e, datatype) => {
    let list = [...query];

    if (e.target.name === "operator" && e.target.value == "BETWEEN") {
      delete list[i]["value"];
    }

    if (e.target.name === "operator" && e.target.value != "BETWEEN") {
      delete list[i]["start_value"];
      delete list[i]["end_value"];
    }

    if (
      (e.target.name === "operator" && e.target.value == "IS NULL") ||
      (e.target.name === "operator" && e.target.value == "IS NOT NULL")
    ) {
      delete list[i]["value"];
      delete list[i]["start_value"];
      delete list[i]["end_value"];
    }

    list[i][e.target.name] = e.target.value;
    setQuery(list);
  };

  // Method to add fields
  const add_fields = () => {
    setQuery([...query, {}]);
  };


  // Method to remove fields
  const remove_fields = (i) => {
    let list = [...query];
    list.splice(i, 1);
    setQuery(list);
  };




  const handlepostFilterData = async () => {
    const updatedSelectedTables = query.map((table) => {
      const result1 = savedtables.find(result => result.query_id === getsavedQueryDefinition.id && result.table_name === table.table_name)
      return {
        ...table,
        tab_filter_tale_id: result1.id,
        query_id: getsavedQueryDefinition.id,
        created_by: getsavedQueryDefinition.created_by,
        last_updated_by: getsavedQueryDefinition.last_updated_by
      }
    })
    const requestFilterColumnData = await fetch(
      `${process.env.REACT_APP_SERVER_URL}/api/ins_filter_column_data`,
      {
        method: "POST",
        body: JSON.stringify(updatedSelectedTables),
        headers: {
          "Content-Type": "application/json",
          Authorization: "Bearer " + String(authTokens.access),
        },
      }
    )
    let resultFilterColumnData = await requestFilterColumnData.json()
    if (requestFilterColumnData.status === 200) {
      setToastMessage(true)
      setToast((msgItm) => [...msgItm, { message: 'Filter Data for the respective column is being saved', apiStatus: 200 }])
    } else {
      setToastMessage(true)
      setToast((msgItm) => [...msgItm, { message: 'Filter Data for the respective column is not being saved', apiStatus: 400 }])
    }
  }



  return (
    <div className="">
      <div className="col-12  ">
        <div className="sc_cl_div col-12 d-flex justify-content-end py-3">
          <div className="d-flex col-lg-1 flex-column">
            <button onClick={add_fields} className="bg-opacity-75 bg-primary border px-2 py-1 rounded text-white">Add Row +</button>
          </div>
        </div>


        <Table striped bordered hover>
          <thead>
            <tr>
              <th>Table Name</th>
              <th>Column Fields</th>
              <th>Datatype</th>
              <th>Operator</th>
              <th>Value</th>
              {query.length > 1 ? <th>Action</th> : ""}
            </tr>
          </thead>
          {query.map((temp, index) => {
            return (
              <tbody key={index}>
                <tr>
                  {/* Table Name */}
                  <td>
                    <Form.Select
                      value={temp.table_name}
                      name={"table_name"}
                      onChange={(e) => handle_filter_event(index, e)}
                      disabled={false}
                      size="sm"
                      className="w-auto"
                    >
                      <option hidden>Select Option</option>
                      {getallcolumns.map((columnItems, idx) => {
                        return (
                          <option key={idx} value={columnItems.table_name}>
                            {columnItems.table_name}
                          </option>
                        );
                      })}
                    </Form.Select>
                  </td>
                  {/* Column Fields Name */}
                  <td>
                    <Form.Select
                      value={temp.column_name}
                      name={"column_name"}
                      onChange={(e) => handle_filter_event(index, e)}
                      disabled={false}
                      size="sm"
                      className="w-auto"
                    >
                      <option hidden>Select Option</option>
                      {getallcolumns

                        .find((item) => item.table_name === temp.table_name)

                        ?.table_columns.map((col, colIndex) => (
                          <option key={colIndex} value={col.columnName}>
                            {col.columnName}
                          </option>
                        ))}
                    </Form.Select>
                  </td>
                  {/* Datatype */}
                  <td>
                    {getallcolumns

                      .find((item) => item.table_name === temp.table_name)

                      ?.table_columns.map((col, idx) =>
                        col.columnName === temp.column_name ? (
                          <input
                            key={idx}
                            type={"text"}
                            value={col.dataType}
                            // onChange={(e) => handle_filter_event(index, e)}
                            disabled={true}
                          />
                        ) : (
                          ""
                        )
                      )}
                  </td>
                  {/* Conditional Operator Three Types */}
                  <td>
                    <Form.Select
                      value={temp.operator}
                      name={"operator"}
                      onChange={(e) => handle_filter_event(index, e)}
                      disabled={false}
                      size="sm"
                      className="w-auto"
                    >
                      <option hidden>Select Option</option>
                      {getallcolumns

                        .find((item) => item.table_name === temp.table_name)

                        ?.table_columns.map((col, idx) =>
                          col.columnName === temp.column_name ? (
                            <React.Fragment>
                              {" "}
                              {col.dataType == "varchar" ? (
                                <React.Fragment key={idx}>
                                  {string_operators.map((columnItems, idx) => {
                                    return (
                                      <option
                                        key={columnItems.id}
                                        value={columnItems.value}
                                      >
                                        {columnItems.key}
                                      </option>
                                    );
                                  })}
                                </React.Fragment>
                              ) : col.dataType == "int" || col.dataType == "bigint" ? (
                                <React.Fragment key={idx}>
                                  {numeric_operators.map((columnItems, idx) => {
                                    return (
                                      <option
                                        key={idx}
                                        value={columnItems.value}
                                      >
                                        {columnItems.key}
                                      </option>
                                    );
                                  })}
                                </React.Fragment>
                              ) : col.dataType == "datetime" ? (
                                <React.Fragment key={idx}>
                                  {date_operators.map((columnItems, idx) => {
                                    return (
                                      <option
                                        key={idx}
                                        value={columnItems.value}
                                      >
                                        {columnItems.key}
                                      </option>
                                    );
                                  })}
                                </React.Fragment>
                              ) : (
                                ""
                              )}
                            </React.Fragment>
                          ) : (
                            ""
                          )
                        )}
                    </Form.Select>
                  </td>
                  {/* Value Fields */}
                  <td>
                    {getallcolumns

                      .find((item) => item.table_name === temp.table_name)

                      ?.table_columns.map((col, idx) =>
                        col.columnName === temp.column_name ? (
                          <React.Fragment key={idx}>
                            {temp.operator != "IS NULL" &&
                              temp.operator != "IS NOT NULL" &&
                              temp.operator != "BETWEEN" ? (
                              <input
                                type={
                                  col.dataType
                                    == "varchar"
                                    ? "text"
                                    : col.dataType == "bigint"
                                      ? "number"
                                      : "date"
                                }
                                placeholder="Enter the Value"
                                value={temp.value}
                                name="value"
                                onChange={(e) => handle_filter_event(index, e)}
                              />
                            ) : (
                              <React.Fragment>
                                {temp.operator == "BETWEEN" ? (
                                  <React.Fragment>
                                    <input
                                      type={
                                        col.dataType == "bigint" || col.dataType == "int"
                                          ? "number"
                                          : "date"
                                      }
                                      className={`mx-2 ${col.dataType == "bigint" || col.dataType == "int" ? "w-25" : ""
                                        }`}
                                      value={temp.start_value}
                                      name="start_value"
                                      onChange={(e) =>
                                        handle_filter_event(index, e)
                                      }
                                    />
                                    <input
                                      type={
                                        col.dataType == "bigint" || col.dataType == "int"
                                          ? "number"
                                          : "date"
                                      }
                                      className={`${col.dataType == "bigint" || col.dataType == "int" ? "w-25" : ""
                                        }`}
                                      value={temp.end_value}
                                      name="end_value"
                                      onChange={(e) =>
                                        handle_filter_event(index, e)
                                      }
                                    />
                                  </React.Fragment>
                                ) : (
                                  ""
                                )}
                              </React.Fragment>
                            )}
                          </React.Fragment>
                        ) : (
                          ""
                        )
                      )}
                  </td>

                  {query.length > 1 ? (
                    <td>
                      <div
                        events="onMouseEnter"
                        timing="ease-in-out"
                        duration={0.5}
                        inline={true}
                      >
                        <RiDeleteBin6Line
                          className="sc_cl_table_icons ms-3 text-danger"
                          onClick={() => remove_fields(index)}
                        />
                      </div>
                    </td>
                  ) : (
                    ""
                  )}
                </tr>
              </tbody>
            );
          })}
        </Table>
      </div>

      {/* <div>
        <button onClick={() => handlepostFilterData()} className="mt-2 sc_cl_outline_button">Save & Continue</button>
      </div> */}
      {
        gettoastMessage && getToast.map((items, idx) => (
          <FnToastMessageComp Header={"Notification"} duration={3000} message={items.message} key={idx} apiStatus={items.apiStatus} />
        ))
      }

    </div>
  );
};


// const FnQueryExecutor = ({ authTokens, getSavedConnections, setSelectedConnections, getselectedConnections, handleDBConnection, getconnectiondbstr
//   , getquerydata, setQueryData, leftItems, setLeftItems, userSettings, getedit, setEdit, getstepCount, setstepCount, etl, setETL,handlePrev, getalldata }) => {

//   // const [getquery, setQuery] = useState([]);

//   const [getqueryresult, setQueryResult] = useState([]);

//   const [getquerydataresults, setQueryDataResults] = useState([]);

//   const [geterrorcode, setErrorCode] = useState([]);

//   let [search, setSearch] = useState("");

//   // let columns_to;
//   const [bol_v, setBol_V] = useState(false);

//   const [etlcolumns, setETLColumns] = useState([]);
//   const [etldata, setETLData] = useState([]);

//   const textareaRef = useRef(null);

//   const [startingIndex, setStartingindex] = useState(0);
//   const PageSize =
//     userSettings && userSettings.pagination
//       ? userSettings.pagination
//       : process.env.REACT_APP_PAGINATION;
//   const endingIndex = startingIndex + Number(PageSize);

//   useEffect(() => {
//     handleGetSchemaTables()
//   }, [endingIndex, startingIndex, PageSize])

//   const handleGetSchemaTables = async () => {

//     let updatedSelectedConnections = { ...getselectedConnections };

//     updatedSelectedConnections.query_type = true;

//     setSelectedConnections(updatedSelectedConnections)

//     let fetchTableRequest = await fetch(
//       `${process.env.REACT_APP_SERVER_URL}/api/get_connected_tables`,
//       {
//         method: "POST",
//         body: JSON.stringify(getalldata["Page1"]),
//         headers: {
//           "Content-Type": "application/json",
//           Authorization: "Bearer " + String(authTokens.access),
//         },
//       }
//     );
//     let fetchTablenResults = await fetchTableRequest.json()

//     if (fetchTableRequest.status === 200) {
//       setLeftItems(fetchTablenResults)
//     }
//   }

//   const handleValidateQuery = async () => {
//     let updatedSelectedConnections = { ...getselectedConnections };

//     // if (!updatedSelectedConnections.query_text) { }
//     updatedSelectedConnections.query_text = getquerydata.query_text;
//     // else { }

//     setSelectedConnections(updatedSelectedConnections);
    
//     let fetchTableRequest = await fetch(
//       `${process.env.REACT_APP_SERVER_URL}/api/get_query_result`,
//       {
//         method: "POST",
//         body: JSON.stringify(updatedSelectedConnections),
//         headers: {
//           "Content-Type": "application/json",
//           Authorization: "Bearer " + String(authTokens.access),
//         },
//       }
//     );
//     let fetchTablenResults = await fetchTableRequest.json()

//     if (fetchTableRequest.status === 200) {
//       setQueryResult([{ "columns": fetchTablenResults[0]["columns"], "data": fetchTablenResults[0]["data"].slice(0, 10) }]);
//       setErrorCode("Query Executed Successfully");
//     }
//     else {
//       setErrorCode(fetchTablenResults)
//       setBol_V(false)
//       // Swal.fire({
//       //   icon: "error",
//       //   title: "Syntax Error...",
//       //   text: "Something went wrong!",
//       //   confirmButtonText: 'Why do I have this issue?',
//       // }).then((result) => {
//       //   if (result.isConfirmed) {
//       //     setErrorCode(fetchTablenResults)
//       //     setBol_V(false)
//       //   }
//       // })
//     }
//   }

//   // const GetQuerydataforETL = async () => {
//   //   let updatedSelectedConnections = { ...getselectedConnections };

//   //   // if (!updatedSelectedConnections.query_text) { }
//   //   updatedSelectedConnections.query_text = getquerydata.query_text;
//   //   // else { }

//   //   setSelectedConnections(updatedSelectedConnections);
    
//   //   let fetchTableRequest = await fetch(
//   //     `${process.env.REACT_APP_SERVER_URL}/api/get_query_result`,
//   //     {
//   //       method: "POST",
//   //       body: JSON.stringify(updatedSelectedConnections),
//   //       headers: {
//   //         "Content-Type": "application/json",
//   //         Authorization: "Bearer " + String(authTokens.access),
//   //       },
//   //     }
//   //   );
//   //   let fetchTablenResults = await fetchTableRequest.json()

//   //   if (fetchTableRequest.status === 200) {
//   //     setETLColumns(fetchTablenResults[0]["columns"])
//   //     setETLData(fetchTablenResults[0]["data"])
//   //   }
//   //   else {
//   //     setErrorCode(fetchTablenResults)
//   //   }
//   // }

//   const handleSaveQuery = async (status) => {

//     let updatedSelectedConnections = { ...getselectedConnections };

//     // updatedSelectedConnections.custom_query = true;
//     updatedSelectedConnections.query_text = getquerydata.query_text;
//     updatedSelectedConnections.query_status = status;
//     // else { }

//     setSelectedConnections(updatedSelectedConnections);

//     if (status) {
//       let fetchTableRequest = await fetch(
//         `${process.env.REACT_APP_SERVER_URL}/api/get_query_result`,
//         {
//           method: "POST",
//           body: JSON.stringify(updatedSelectedConnections),
//           headers: {
//             "Content-Type": "application/json",
//             Authorization: "Bearer " + String(authTokens.access),
//           },
//         }
//       );
//       let fetchTablenResults = await fetchTableRequest.json()

//       if (fetchTableRequest.status === 200) {
//         let custom_query_Request = await fetch(
//           `${process.env.REACT_APP_SERVER_URL}/api/ins_save_connection_data`,
//           {
//             method: "POST",
//             body: JSON.stringify(updatedSelectedConnections),
//             headers: {
//               "Content-Type": "application/json",
//               Authorization: "Bearer " + String(authTokens.access),
//             },
//           }
//         );
//         let custom_query_Results = await custom_query_Request.json()
//         if (custom_query_Request.status === 201) {
//           Swal.fire({
//             icon: "success",
//             text: "Saved Successfully!",
//           }).then(function () {
//             if ("caches" in window) {
//               caches
//                 .delete("QueryBuilder")
//                 .then(function (res) {
//                   return res;
//                 });
//             }
//             setErrorCode()
//             setstepCount(1)
//           });
//         } else {
//           setErrorCode(fetchTablenResults)
//         }
//       }
//       else { setErrorCode(fetchTablenResults) }
//     }
//     else {


//       let custom_query_Request = await fetch(
//         `${process.env.REACT_APP_SERVER_URL}/api/ins_save_connection_data`,
//         {
//           method: "POST",
//           body: JSON.stringify(updatedSelectedConnections),
//           headers: {
//             "Content-Type": "application/json",
//             Authorization: "Bearer " + String(authTokens.access),
//           },
//         }
//       );
//       let custom_query_Results = await custom_query_Request.json()
//       if (custom_query_Request.status === 201) {
//         Swal.fire({
//           icon: "success",
//           text: "Saved Successfully!",
//         }).then(function () {
//           if ("caches" in window) {
//             caches
//               .delete("QueryBuilder")
//               .then(function (res) {
//                 return res;
//               });
//           }
//           setErrorCode()
//           setstepCount(1)
//         });
//       } else {
//         setErrorCode({ 'error': "Query can't be blank" })
//       }
//     }
//   }

//   //  Function for updating Connection details
//   const fnUpdateDetails = async (status) => {

//     let updatedSelectedConnections = { ...getselectedConnections };

//     updatedSelectedConnections.query_text = getquerydata.query_text;
//     updatedSelectedConnections.query_status = status;

//     setSelectedConnections(updatedSelectedConnections);

//     if (status) {
//       let fetchTableRequest = await fetch(
//         `${process.env.REACT_APP_SERVER_URL}/api/get_query_result`,
//         {
//           method: "POST",
//           body: JSON.stringify(updatedSelectedConnections),
//           headers: {
//             "Content-Type": "application/json",
//             Authorization: "Bearer " + String(authTokens.access),
//           },
//         }
//       );
//       let fetchTablenResults = await fetchTableRequest.json()

//       if (fetchTableRequest.status === 200) {
//         let res = await fetch(
//           `${process.env.REACT_APP_SERVER_URL}/api/upd_connection_data/${updatedSelectedConnections.id}/`,
//           {
//             method: "PUT",
//             body: JSON.stringify(updatedSelectedConnections),
//             headers: {
//               "Content-Type": "application/json",
//               Authorization: "Bearer " + String(authTokens.access),
//             },
//           }
//         );
//         let data = await res.json();
//         if (res.status === 201) {
//           Swal.fire({
//             icon: "success",
//             text: "Updated Successfully!",
//           }).then(function () {
//             if ("caches" in window) {
//               caches
//                 .delete("QueryBuilder")
//                 .then(function (resp) {
//                   return resp;
//                 });
//             }
//             setErrorCode();
//             setEdit(false);
//             setstepCount(1);
//           });
//         } else {
//           setErrorCode(fetchTablenResults)
//         }
//       } else {
//         setErrorCode(fetchTablenResults)
//       }
//     }

//     else {


//       let res = await fetch(
//         `${process.env.REACT_APP_SERVER_URL}/api/upd_connection_data/${updatedSelectedConnections.id}/`,
//         {
//           method: "PUT",
//           body: JSON.stringify(updatedSelectedConnections),
//           headers: {
//             "Content-Type": "application/json",
//             Authorization: "Bearer " + String(authTokens.access),
//           },
//         }
//       );
//       let custom_query_Results = await res.json()
//       if (res.status === 201) {
//         Swal.fire({
//           icon: "success",
//           text: "Updated Successfully!",
//         }).then(function () {
//           if ("caches" in window) {
//             caches
//               .delete("QueryBuilder")
//               .then(function (res) {
//                 return res;
//               });
//           }
//           setErrorCode();
//           setEdit(false);
//           setstepCount(1);
//         });
//       } else {
//         setErrorCode({ 'error': "Query can't be blank", custom_query_Results })
//       }
//     }
//   };

//   const handleselect = (id, table) => {
//     const textarea = textareaRef.current;

//     // Get the current cursor position
//     const cursorPosition = textarea.selectionStart;

//     // Split the query_text into two parts at the cursor position
//     const queryBeforeCursor = getquerydata.query_text.substring(0, cursorPosition);
//     const queryAfterCursor = getquerydata.query_text.substring(cursorPosition);

//     // Insert the selected table name at the cursor position
//     const updatedQuery = `${queryBeforeCursor} ${table} ${queryAfterCursor}`;

//     // Update the state with the new query_text
//     setQueryData((prevQueryData) => ({
//       ...prevQueryData,
//       query_text: updatedQuery,
//     }));

//     // Set the cursor position after the inserted table name
//     textarea.setSelectionRange(cursorPosition + table.length + 2, cursorPosition + table.length + 2);

//     // setQueryData((prevQueryData) => ({
//     //   ...prevQueryData,
//     //   query_text: `${prevQueryData.query_text} ${table}`,
//     // }));
//   }

//   let columns_to = [...getqueryresult.map((d) => d.columns)]
//   let newadata = [...getqueryresult.map((d) => d.data)]
//   const columns_type = [];
//   const date_columns = [];

//   let [sortcolumn, setSortColumn] = useState("");
//   let [sortorder, setSortOrder] = useState(true);

//   return (
//     <div>
//       {
//         etl ? 
//         <FnETLProcess
//           // data={etldata}
//           // columns={etlcolumns}
//           authTokens={authTokens}
//           getselectedConnections={getselectedConnections}
//           getquerydata={getquerydata}
//           etl={etl} setETL={setETL}
//         /> : 
//         <>
//           <div>
//             {/* <div className="d-flex gap-5">
//               <div className="w-75 sc_cl_label">Query Name : <span className="text-primary">{getselectedConnections.query_name}</span></div>
//               <div className="w-50 sc_cl_label">Available Tables</div>
//             </div> */}
//             <Form>
//               <Form.Group className={"d-flex gap-4 mx-4"}>
//               <div className="w-75 d-flex flex-column gap-1">
//                 <div className="sc_cl_label">Query Name : <span className="text-primary">{getalldata['Page1'].query_name}</span></div>
//                 <Form.Control
//                   ref={textareaRef}
//                   as={"textarea"} // Setting the type to "textarea"
//                   // style={{ resize: 'none' }}
//                   // placeholder={items.placeholder} // Placeholder text for the textarea
//                   value={getquerydata.query_text} // Value of the textarea taken from formData
//                   name={"query_text"} // Name of the textarea input
//                   onChange={(e) => setQueryData({ [e.target.name]: e.target.value })}
//                   disabled={false} // Whether the textarea should be disabled or not
//                   // className={} // Additional class for custom styling (optional)
//                   // size="sm" // Size of the textarea, e.g., "sm", "lg", etc.
//                   // maxLength={""} // Maximum character length for the textarea
//                   style={{ height: '300px', width: '600px!important' }}
//                   autoComplete="off" // Disable browser autoComplete for the textarea
//                 />
//               </div>
//               <div className="w-50 d-flex flex-column gap-1">
//                 <div className="w-50 sc_cl_label">Available Tables</div>
//                 <div className="qb_list_selector_container shadow-sm px-3 w-50" style={{ height: '300px', overflowX: 'auto', overflowY: 'auto' }}>
//                   <ul className="list-unstyled">
//                     {leftItems.map((item, tableIndex) => (
//                       <li
//                         key={item.id}
//                         onDoubleClick={(e) => handleselect(item.id, item.table_name)}
//                         className={getquerydata?.query_text?.includes(item.table_name) ? 'selected' : ''}
//                       >
//                         {item.table_name}
//                       </li>
//                     ))}
//                   </ul>
//                 </div>
//               </div>

//               </Form.Group>
//             </Form>

//             <span className={`${geterrorcode?.error ? "red" : "text-success"} sc_cl_span mx-4 my-3 small w-50`} >
//               {geterrorcode && geterrorcode.error ? geterrorcode.error : geterrorcode}
//             </span>
//             {geterrorcode && geterrorcode == "Query Executed Successfully" ?
//               <>
//                 <FnBtnComponent children={"Preview Result"} onClick={() => setBol_V(true)} classname={"sc_cl_submit_button mb-3 mx-2"} />
//                 <FnBtnComponent children={"Transform Data"} onClick={() => setETL(true)} classname={"sc_cl_submit_button mb-3"} />
//               </>
//               : ''
//             }

//             {/* <div className="align-items-center d-flex justify-content-start mt-2 sc_cl_div"> */}
//             <div className="d-flex mx-4 sc_cl_div">
//               <FnBtnComponent children={"Run"} onClick={() => handleValidateQuery()} classname={"sc_cl_submit_button"} />
//               <FnBtnComponent children={"Back"} onClick={() => handlePrev(getstepCount)} classname={"sc_cl_close_button"} />
//               {(getedit ? (
//                 <>
//                   <FnBtnComponent onClick={() => fnUpdateDetails(false)} classname={"sc_cl_submit_button ms-2"} children={"Update as Draft"} />

//                   <FnBtnComponent onClick={() => fnUpdateDetails(true)} classname={"sc_cl_submit_button ms-2"} children={"Update"} />
//                 </>
//               ) : (
//                 <div className="f-right">
//                   <FnBtnComponent children={"Save as Draft"} onClick={() => handleSaveQuery(false)} classname={"sc_cl_close_button ms-2"} />

//                   <FnBtnComponent children={"Save"} onClick={() => handleSaveQuery(true)} classname={"sc_cl_update_button ms-2"} />
//                 </div>
//               ))}
//             </div>

//           </div>

//           {bol_v ? (
//             <Card className="overflow-hidden border-0">
//               <div className="sc_cl_row card-header">
//                 <div className="sc_cl_div d-flex justify-content-end">
//                   <input
//                     type='text'
//                     className='sc_cl_Search px-3 me-2'
//                     placeholder='Search'
//                     value={search || ''}
//                     onChange={(e) => {
//                       setSearch(e.target.value)
//                     }}
//                   />

//                   <FnExportComponent
//                     data={newadata[0]}
//                     columns={columns_to[0]}
//                     csvdata={newadata[0]}
//                   />
//                 </div>
//               </div>

//               <div className="sc_cl_div">
//                 <FnTableComponent
//                   data={newadata[0]}
//                   csv_export={"csvdata"}
//                   data_length={Number(50)}
//                   page_size={PageSize}
//                   columns_in={columns_to[0]}
//                   date_columns={date_columns}
//                   columns_type={columns_type}
//                   start={setStartingindex}
//                   // close={setQueryDataResults}
//                   // updates={setQueryDataResults}
//                   // load={setQueryDataResults}
//                   // add={setQueryDataResults}
//                   // view={setQueryDataResults}
//                   menu_id={101}
//                   // diverts={setQueryDataResults}
//                   api_name={"del_currencies"}
//                   action={false}
//                   searchWord={search}
//                   pagination={false}
//                   custom_action={false}
//                   sortcolumn={sortcolumn}
//                   setSortColumn={setSortColumn}
//                   sortorder={sortorder}
//                   setSortOrder={setSortOrder}
//                   sorting={true}
//                 />
//               </div>

//             </Card>) :
//             ""}
//         </>
//       }

//     </div>
//   )
// }

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
      console.log("fetchTablenResults", fetchTablenResults)
      // setETLColumns(fetchTablenResults[0]["columns"])
      setETLData(fetchTablenResults[0]["data"])
      if(fetchTablenResults[0]["data"].length >= 1){
        setETLColumns(Object.keys(fetchTablenResults[0]["data"][1]).map(key => key))
      }
    }
    setLoading(false)
  }

  const fnLoadData = async(fun) => {
    console.log(adata)
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
      console.log("fetchTablenResults", fetchTablenResults)
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

  console.log("adata", adata)

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



const FnQueryResults = ({
  userSettings,
  authTokens,
  handleNext,
  setquerydatafullresults,
  setColumnWithTabeID,
  rows, getjoinrows, query,
  setOpenQueryGenerator, getopenquerygenerator,
  getSelectedColumn, setSelectedColumn,
  getselectedConnections, setSelectedConnections,
  getstepCount, setstepCount,
  setRightItems, rightItems,
  setSelectedItems, getselectedItems,
  getquerydata, setQueryData,
  getedit, setEdit,
  geteditquery, setEditQuery, setRows, setJoinRows, setActiveButtons,
  getcolumnalias, setColumnAlias, gettoastMessage, setToastMessage, setLeftItems, user, dynamic_get_api, shared_report,
  searchBar, exportBtn, addnewBtn,getalldata, setAlldata
}) => {


  const [getquerydefinition, setQueryDefinition] = useState([]);

  // To Export all Data for a Query State
  const [getexportall, setExportAll] = useState([]);

  const [getsharedquerydefinition, setSharedQueryDefinition] = useState([]);


  // ! revan State
  const [getqueryresult, setQueryResult] = useState([])

  const [getqueryview, setQueryView] = useState([])

  const [getquerydataresults, setQueryDataResults] = useState([])

  let [search, setSearch] = useState("");

  const [adatalength, setAdatalength] = useState(0);

  const [csvdata, setCsvdata] = useState([]);

  const [userdata, setuserData] = useState([]);

  const [getshareuser, setShareUser] = useState({
    permission_by: user.username,
    created_by: user.user_id,
    last_updated_by: user.user_id,
  });

  // let columns_to;
  const [bol_v, setBol_V] = useState(false)

  // Cache Show and Hide Popup Modal State
  const [preview, setPreview] = useState(false);

  // Cache Show and Hide Popup Modal State
  const [sharepreview, setSharePreview] = useState(false);

  const [getsharequeryedit, setShareQueryEdit] = useState([]);
  const [getsharequeryread, setShareQueryRead] = useState([]);

  const [getshareerrorcode, setShareErrorCode] = useState([]);

  // Read Show and Hide Popup Modal State
  const [readpreview, setReadPreview] = useState(false);

  const [getreadquery, setReadQuery] = useState([])

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const [startingIndex, setStartingindex] = useState(0);
  const PageSize =
    userSettings && userSettings.pagination
      ? userSettings.pagination
      : process.env.REACT_APP_PAGINATION;
  const endingIndex = startingIndex + Number(PageSize);

  let columns_to = ["query_name", "query_status", "query_type", "created_date", "created_user"]

  const [getexportcolumnsto, setExportColumnsTo] = useState([])

  const columns_type = ["str", "bol", "bol1", "date", "str"];
  const bol_labels = ["Complete", "In progress", "Custom", "Wizard"]
  const date_columns = [];

  const [sampleQuery, setSampleQuery] = useState([])

  const [getdefinitionData, setDefinitionData] = useState()

  let [sortcolumn, setSortColumn] = useState("");
  let [sortorder, setSortOrder] = useState(true);

  // ? YData Profile Model
  const [customshowmodel, setCustomShowModel] = useState({ status: false, data: '' });

  const [getActiveTab, setActiveTab] = useState(Number(1));

  const [getcustomstate, setCustomState] = useState([{ label: "Interaction", value: true,correlations:[{status:true},{status:true},{status:true},{status:true},{status:true},{status:true},{status:true}] },
  {
    id: 1, label: "Correlation", value: true,
    correlations: [
      { method: "Auto", status: true, about: " (It calculates the column pairwise correlation depending on the type schema)", disabled: true },
      { method: "Pearson", status: false, about: " (For assessing the strength and direction of a linear relationship between two variables)", disabled: false },
      { method: "Spearman", status: false, about: " (It assesses the strength and direction of monotonic links between variables, used for evaluating relations between categorical or ordinal variables)", disabled: false },
      { method: "Kendall", status: false, about: " (It is used to measure the ordinal association between two measured quantities)", disabled: false },
      { method: "Phi K", status: false, about: " (For Mixed-type variables or (un)expected correlation. To evaluate their statistical significance)", disabled: false },
      { method: "Cramers", status: false, about: " (To find theassociation between categorical variables when there is more than 2x2 contingency)", disabled: false },
    ]
  },
  { id: 2, label: "Missing Value", value: true, type: "",correlations:[{status:true},{status:true},{status:true},{status:true},{status:true},{status:true},{status:true}] },
  // { id: 3, label: "Duplicate", value: true },
  { id: 3, label: "Sample Data", value: true,correlations:[{status:true},{status:true},{status:true},{status:true},{status:true},{status:true},{status:true}] },
  { id: 4, label: "Time Series", value: false,correlations:[{status:true},{status:true},{status:true},{status:true},{status:true},{status:true},{status:true}] }]);

  const openActiveTab = (tabId) => {
    setActiveTab(tabId);
  };

  const handleCheckboxChange = (e, index, correlation_index) => {
    const updatedState = [...getcustomstate];
    if (e.target.name == "label_switch") {
      updatedState[index].value = !updatedState[index].value;
      // if(correlation_index != undefined){
      updatedState[index].correlations[0].status = !updatedState[index].correlations[0].status
      for(let i=1;i<=5;i++){
      updatedState[index].correlations[i].status = false
      }
    // }
    }
    if (e.target.name == "correlation_switch") {
      updatedState[index].correlations[correlation_index].status = !updatedState[index].correlations[correlation_index].status
    }
    setCustomState(updatedState);
  }


  const fnGetConnectionData = async (selected_data) => {
    let res = await fetch(
      `${process.env.REACT_APP_SERVER_URL}/api/get_rb_connect_definition_table/${selected_data.connection_id}/`,
      {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          Authorization: "Bearer " + String(authTokens.access),
        },
      }
    );
    let data = await res.json();
    if (res.status === 200) {
      setAlldata({...getalldata, ['Page1']:{...selected_data, savedConnectionItems: data[0]} })
      setSelectedConnections({ ...selected_data, savedConnectionItems: data[0] })
      setQueryData({ ...getquerydata, query_text: selected_data.query_text })
    } else {
      window.alert("Error")
    }
  }
  console.log("getalldata", getalldata)

  useEffect(() => {
    // fnGetQueryDetails()
    setToastMessage(false)
    fnGetQueryDefinitionDetails()


    // if (getedit) {
    //   fnGetConnectionData()
    //   setstepCount(getstepCount + 1)
    // } getedit,
  }, [startingIndex, PageSize, sortcolumn, sortorder])



  const fnGetQueryDefinitionDetails = async () => {
    const querydefinitionDataRequest = await fetch(
      `${process.env.REACT_APP_SERVER_URL}/api/${dynamic_get_api}/${startingIndex}/${endingIndex}/${user.username}/${sortcolumn ? sortorder ? "-" + sortcolumn : sortcolumn : 'delete_flag'}/${search}`,
      {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          Authorization: "Bearer " + String(authTokens.access),
        },

      }
    );

    const tableDataRequest = await fetch(
      `${process.env.REACT_APP_SERVER_URL}/api/get_save_table_data`,
      {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          Authorization: "Bearer " + String(authTokens.access),
        },

      }
    );

    const columnDataRequest = await fetch(
      `${process.env.REACT_APP_SERVER_URL}/api/get_save_column_data`,
      {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          Authorization: "Bearer " + String(authTokens.access),
        },

      }
    );

    const joinTableDataRequest = await fetch(
      `${process.env.REACT_APP_SERVER_URL}/api/get_join_table_data`,
      {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          Authorization: "Bearer " + String(authTokens.access),
        },

      }
    );

    const aggregateTableDataRequest = await fetch(
      `${process.env.REACT_APP_SERVER_URL}/api/get_aggregate_table_data`,
      {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          Authorization: "Bearer " + String(authTokens.access),
        },

      }
    );

    const userProfileDataRequest = await fetch(
      `${process.env.REACT_APP_SERVER_URL}/api/get_user_profile`,
      {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          Authorization: "Bearer " + String(authTokens.access),
        },

      }
    );

    let querydefinitionDataResult = await querydefinitionDataRequest.json();
    let tableDataResult = await tableDataRequest.json();
    let columnDataResult = await columnDataRequest.json();
    let joinTableDataResult = await joinTableDataRequest.json();
    let aggregateTableDataResult = await aggregateTableDataRequest.json();

    let userProfileDataResult = await userProfileDataRequest.json();
      console.log("querydefinitionDataResult", querydefinitionDataResult)
    setQueryDefinition(querydefinitionDataResult.data);
    setAdatalength(querydefinitionDataResult.data_length);
    setCsvdata(querydefinitionDataResult.csv_data);
    setuserData(userProfileDataResult)
    setSharedQueryDefinition(querydefinitionDataResult.shared_data)

  }

  // ! building Query from API with the passed parameters

  const fnSQLbuilder = (queryItems, tableDataResult, columnDataResult, joinTableDataResult, aggregateTableDataResult) => {
    // Extract columns and tables based on the query id
    const selectedColumns = columnDataResult
      .filter((columnItems) => columnItems.table_column_query_id === queryItems.id)
      .map((column) => {
        const isColumnJoin = joinTableDataResult.some((join) =>
          column.column_name === join.join_column_name1 || column.column_name === join.join_column_name2
        );

        const tableName = tableDataResult.find((table) => table.id === column.table_column_table_id).table_name;
        const columnName = column.column_name;

        let selectedColumn;

        if (isColumnJoin) {
          selectedColumn = `${tableName}.${columnName}`;
        } else {
          // Check if there is an alias for the column

          const aliasName = column.alias_name ? ` AS ${column.alias_name}` : '';

          const colFunction = column.col_function ? `${column.col_function}(` : '';
          const colFunctionClose = column.col_function ? ')' : '';


          // Check if there is an aggregate function for the column
          const aggregateData = aggregateTableDataResult.find(aggregate => aggregate.table_aggregate_column_id === column.id);


          if (aggregateData) {
            selectedColumn = `${aggregateData.agg_fun_name}(${colFunction}${tableName}.${columnName}${colFunctionClose})${aliasName}`;
          } else {
            selectedColumn = `${colFunction}${tableName}.${columnName}${colFunctionClose}${aliasName}`;
          }
        }

        return selectedColumn;
      });

    const selectedTables = tableDataResult
      .filter((table) => table.query_id === queryItems.id)
      .map((table) => `${table.table_name}`);

    // Build the SELECT clause
    const selectClause = `SELECT ${selectedColumns.length > 0 ? selectedColumns.join(', ') : "*"} FROM ${selectedTables[1]}`;

    // Build the JOIN clauses
    const joinClauses = joinTableDataResult
      .filter((join) => join.tab_join_query_id === queryItems.id)
      .map((join) => {
        const tableNameOne = tableDataResult.find((table) => table.id === join.tab_join_table_id_one).table_name;
        const tableNameTwo = tableDataResult.find((table) => table.id === join.tab_join_table_id_two).table_name;
        const columnNameOneObj = columnDataResult.find((column) => column.column_name === join.join_column_name1);
        const columnNameTwoObj = columnDataResult.find((column) => column.column_name === join.join_column_name2);


        const columnNameOne = columnNameOneObj ? columnNameOneObj.column_name : "id";
        const columnNameTwo = columnNameTwoObj ? columnNameTwoObj.column_name : "query_id"


        // Check for join type and conditions
        let joinType = join.join_type || "INNER JOIN"; // Default to INNER JOIN if not specified
        let condition = `${tableNameOne}.${columnNameOne} = ${tableNameTwo}.${columnNameTwo}`;

        return `${joinType} ${tableNameTwo} ON ${condition}`;
      });

    // Build the final SQL query
    const sqlQuery = `${selectClause} ${joinClauses.length > 0 ? joinClauses.join(' ') : ''}`;


    return {
      query_id: queryItems.id,
      query_name: queryItems.query_name,
      query: sqlQuery,
    };
  };


  // ? Update Query
  const fnUpdateDetails = async (data) => {
    console.log("fnUpdateDetails", data)
    setEditQuery(data);
    setEdit(true);
    fnGetConnectionData(data)
    setstepCount(getstepCount + 1)
    // handleReverseQuery(data)
  };


  const handleReverseQuery = async (reverseQuery) => {


    if (reverseQuery.id) {

      // Fetch query definition data

      let savedConnectionRequest = await fetch(
        `${process.env.REACT_APP_SERVER_URL}/api/get_rb_connect_definition_table`,
        {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
            Authorization: "Bearer " + String(authTokens.access),
          },
        }
      );


      const queryDefRequest = await fetch(
        `${process.env.REACT_APP_SERVER_URL}/api/get_connection_data/${reverseQuery.id}/`,
        {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
            Authorization: "Bearer " + String(authTokens.access),
          },
        }
      );

      // Fetch table data based on the query ID
      const tableDataRequest = await fetch(
        `${process.env.REACT_APP_SERVER_URL}/api/get_save_table_data/${reverseQuery.id}/`,
        {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
            Authorization: "Bearer " + String(authTokens.access),
          },
        }
      );

      // Fetch column data based on the query ID
      const columnDataRequest = await fetch(
        `${process.env.REACT_APP_SERVER_URL}/api/get_save_column_data/${reverseQuery.id}/`,
        {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
            Authorization: "Bearer " + String(authTokens.access),
          },
        }
      );

      // Fetch aggregate data based on the query ID
      const aggregateTableDataRequest = await fetch(
        `${process.env.REACT_APP_SERVER_URL}/api/get_aggregate_table_data/${reverseQuery.id}/`,
        {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
            Authorization: "Bearer " + String(authTokens.access),
          },

        }
      );

      // Fect Join
      const joinTableDataRequest = await fetch(
        `${process.env.REACT_APP_SERVER_URL}/api/get_join_table_data/${reverseQuery.id}/`,
        {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
            Authorization: "Bearer " + String(authTokens.access),
          },

        }
      );

      let savedConnectionResults = await savedConnectionRequest.json();
      const queryDefResult = await queryDefRequest.json();
      const tableDataResult = await tableDataRequest.json();
      const columnDataResult = await columnDataRequest.json();
      const aggregateTableDataResult = await aggregateTableDataRequest.json()
      const joinTableDataResult = await joinTableDataRequest.json()



      const connectionId = queryDefResult[0].connection_id;
      const matchedConnection = savedConnectionResults.find(conn => conn.id === connectionId);


      const processedData = {
        id: queryDefResult[0].id,
        query_name: queryDefResult[0].query_name,
        query_text: queryDefResult[0].query_text,
        created_user: queryDefResult[0].created_user,
        savedConnectionItems: [matchedConnection]
      };

      setSelectedConnections(processedData)



      setRightItems(tableDataResult)


      // Column Data

      const transformData = (tableData, columnData) => {
        const transformedData = [];

        // Iterate through tableData
        tableData.forEach((table) => {
          // Filter columnData based on table_id
          const columns = columnData.filter((column) => column.table_column_table_id === table.id);

          // Iterate through filtered columns
          columns.forEach((column) => {
            // Build the transformed object
            const transformedObject = {
              table_name: table.table_name,
              column: {
                id: column.id,
                columnName: column.column_name,
                dataType: 'varchar', // You may replace this with actual data type logic
                tableId: column.table_column_table_id,
              },
            };

            // Push the transformed object to the result array
            transformedData.push(transformedObject);
          });
        });

        return transformedData;
      };


      let result = transformData(tableDataResult, columnDataResult);


      setSelectedItems(result)


      let columnAliasEdit = columnDataResult.filter(aliasItems => aliasItems.alias_name !== null && aliasItems.col_function !== null).map(aliasItems => {
        const aliasTableName = tableDataResult.find(tableItems => tableItems.id == aliasItems.table_column_table_id)
        return {
          selectedTableName: aliasTableName.table_name,
          selectedColumnName: aliasItems.column_name,
          setAliasName: aliasItems.alias_name,
          setColumnFunction: aliasItems.col_function
        }
      })





      setColumnAlias(columnAliasEdit)



      // For Aggregation Data

      let columnaggregateEdit = aggregateTableDataResult.map(aggItem => {
        const tableItem = tableDataResult.find(table => table.id === aggItem.table_aggregate_table_id);
        const columnItem = columnDataResult.find(column => column.id === aggItem.table_aggregate_column_id);

        return {
          id: aggItem.id,
          selectedTable: tableItem.table_name,
          selectedColumn: columnItem.column_name,
          selectedAttribute: aggItem.agg_fun_name,
        };
      });



      setRows(columnaggregateEdit)


      // For Join

      let columnJoinEdit = joinTableDataResult.map(joinItems => {
        const tableItemNameone = tableDataResult.find(table => table.id === joinItems.tab_join_table_id_one);
        const tableItemNametwo = tableDataResult.find(table => table.id === joinItems.tab_join_table_id_two);
        const columnItemNameone = columnDataResult.find(column => column.id === joinItems.join_column_name1);
        const columnItemNametwo = columnDataResult.find(column => column.id === joinItems.join_column_name2);

        return {
          id: joinItems.id,
          selectedTable: tableItemNameone.table_name,
          // selectedColumn: columnItemNameone.column_name,
          selectedAttribute: joinItems.join_type,
          selectedTable2: tableItemNametwo.table_name,
          // selectedColumn2: columnItemNametwo.column_name,
        }
      })



      setJoinRows(columnJoinEdit)





      setstepCount(2)

    } else {
      window.alert("Failed to extract query ID from the reversed query.");
    }

  };

  // ? Readonly Query
  const fnReadDetails = async (data) => {
    setReadPreview(true);
    setReadQuery(data);
  };


  // ? Copy Query
  const fnCopyDetails = async (data) => {
    let copy_data = { ...data };
    delete copy_data.last_updated_by;
    delete copy_data.created_date;
    delete copy_data.delete_flag;
    delete copy_data.query_name;
    copy_data.created_by = user.user_id;
    copy_data.last_updated_by = user.user_id;
    copy_data.created_user = user.username;
    setEditQuery(copy_data)
    fnGetConnectionData(copy_data)
    setstepCount(getstepCount + 1)
  };

  // ? Share Query
  const fnShareDetails = async (data) => {
    setSharePreview(true);
    setShareUser({ ...getshareuser, query_id: data.id })

  };


  // ? View Query
  const fnPreviewDetails = async (data, bool) => {

    // let testSample = sampleQuery.filter(itm => itm.query_id == data.id)
    // setDefinitionData(testSample)
    setPreview(bool);

    let updatedSelectedConnections = { ...getselectedConnections };

    let res = await fetch(
      `${process.env.REACT_APP_SERVER_URL}/api/get_rb_connect_definition_table/${data.connection_id}/`,
      {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          Authorization: "Bearer " + String(authTokens.access),
        },
      }
    );
    let data_res = await res.json();

    if (res.status === 200) {
      updatedSelectedConnections = { ...data, savedConnectionItems: data_res[0] };

    } else {
      window.alert("Error API 1")
    }


    // let twoObjcts = { ...updatedSelectedConnections, query: testSample[0].query }


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
      setQueryView([{ "columns": fetchTablenResults[0]["columns"], "data": fetchTablenResults[0]["data"].slice(0, 10) }])
      setExportColumnsTo(fetchTablenResults[0]["columns"])
      setExportAll(fetchTablenResults[0]["data"])
    }
    else {
      window.alert(fetchTablenResults, "not")

    }
  };


  // ? Share Input Handle for Modal
  const handleInput = (e, editable) => {
    // setSharePermissionTo(Array.isArray(e) ? e.map(x => x.value) : [])
    // setShareUser({ ...getshareuser, permission_to: Array.isArray(e) ? e.map(x => x.value) : [] })

    if (editable) {
      setShareQueryEdit(Array.isArray(e) ? e.map(x => x.value) : [])
      setShareUser({ ...getshareuser, permission_to_edit: Array.isArray(e) ? e.map(x => x.value) : [] })
    }
    else {
      setShareQueryRead(Array.isArray(e) ? e.map(x => x.value) : [])
      setShareUser({ ...getshareuser, permission_to_view: Array.isArray(e) ? e.map(x => x.value) : [] })
    }
    // setShareUser({ ...getshareuser, permission_to: Array.isArray(e) ? e.map(x => x.value) : [] })
  }


  // ? Save Share Query
  const fnSaveSharedQuery = async () => {

    if (getsharequeryedit != 0 || getsharequeryread != 0) {
      let custom_query_Request = await fetch(
        `${process.env.REACT_APP_SERVER_URL}/api/ins_shared_query_definition`,
        {
          method: "POST",
          body: JSON.stringify(getshareuser),
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
          setSharePreview(!sharepreview)
          getsharequeryedit.length = 0
          getsharequeryread.length = 0
          setShareErrorCode()
          // setErrorCode()
          // setstepCount(1)
        });
      } else {
        setShareErrorCode({ 'error': "Please select from the above option's" })
      }
    }
    else {
      setShareErrorCode({ 'error': "Please select from the above option's" })
    }

  }


  const fnCustomDataProfiling = (status, data) => {
    setCustomShowModel({ status: status, data: data })

  }

  // ? YDATA PROFILING
  const fnGetDataProfiling = async (profilingdata, getcustomstate) => {
    let updatedSelectedConnections = { ...getselectedConnections };

    Swal.fire({
      icon: "info",
      title: "Initiate Data Profiling",
      text: "Are you sure you want to proceed?",
      showCancelButton: true,
      confirmButtonText: "Ok",
    }).then(async function (result) {
      if (result.isConfirmed) {



        Swal.fire({
          title: "In Progress",
          timerProgressBar: true,
          didOpen: () => {
            Swal.showLoading();
          },
          willClose: () => {
            // clearInterval();
          }
        })


        let res1 = await fetch(
          `${process.env.REACT_APP_SERVER_URL}/api/get_rb_connect_definition_table/${profilingdata.connection_id}/`,
          {
            method: "GET",
            headers: {
              "Content-Type": "application/json",
              Authorization: "Bearer " + String(authTokens.access),
            },
          }
        );
        let data_res = await res1.json();
        if (res1.status === 200) {
          updatedSelectedConnections = { ...profilingdata, savedConnectionItems: data_res[0], customdata: getcustomstate };
        } else {
          window.alert("Error API 1")
        }

        let res = await fetch(
          `${process.env.REACT_APP_SERVER_URL}/api/get_ydata_profiling_report`,
          {
            method: "PUT",
            body: JSON.stringify(updatedSelectedConnections),
            headers: {
              "Content-Type": "application/json",
              Authorization: "Bearer " + String(authTokens.access),
            },
          }
        );
        let data = await res.text();

        if (res.status === 200) {
          Swal.close();

          // Assuming that the server returns the URL of the HTML file
          const newWindow = window.open(`http://localhost:3000/data_profiling`, '_blank');

          // Render your React component in the new window
          const component = (
            <FnYDataProfiling datasource={data} />
          );

          // Serialize the React component to a string
          const componentString = ReactDOMServer.renderToString(component);

          // Inject the serialized component into the new window
          newWindow.document.write(componentString);
          newWindow.document.title = 'YData Profiling Report';

        } else {
          Swal.close();

          // Assuming that the server returns the URL of the HTML file
          const newWindow = window.open(`http://localhost:3000/data_profiling`, '_blank');

          // Render your React component in the new window
          const component = (
            <FnYDataProfiling datasource={data} />
          );

          // Serialize the React component to a string
          const componentString = ReactDOMServer.renderToString(component);

          // Inject the serialized component into the new window
          newWindow.document.write(componentString);
          newWindow.document.title = 'YData Profiling Report';
        }


      }

    });

  }

  let columns_to_preview = [...getqueryview.map((d) => d.columns)]
  let newadata_preview = [...getqueryview.map((d) => d.data)]
  const columns_type_preview = [];
  const date_columns_preview = [];


  return (
    <div className="query_container">
      <Card className="overflow-hidden border-0">
        <div className="sc_cl_row card-header">
          <div className="sc_cl_div d-flex justify-content-end">
            {
              searchBar ?
                <input
                  type='text'
                  className='sc_cl_Search me-2'
                  placeholder='Search'
                  value={search || ''}
                  onChange={(e) => {
                    setSearch(e.target.value)
                  }}
                /> : ''
            }

            {
              exportBtn ?
                <FnExportComponent
                  data={getquerydefinition}
                  columns={columns_to}
                  csvdata={getquerydefinition}
                /> : ''
            }

            {
              addnewBtn ?
              <FnBtnComponent
                onClick={() => {
                  handleNext('','',2);
                  setSelectedConnections({ ...getselectedConnections, savedConnectionItems: '', query_name: '' });
                  setQueryData({ query_text: '' })
                  setEdit(false)
                }}
                children={"New Query"}
                classname={"sc_cl_submit_button"} size={"sm"} /> : ''
            }
          </div>
        </div>

        <div className="sc_cl_div d-flex">
          {<FnTableComponent
            data={getquerydefinition}
            csv_export={csvdata}
            data_length={adatalength}
            page_size={PageSize}
            columns_in={columns_to}
            bol_labels={bol_labels}
            date_columns={date_columns}
            columns_type={columns_type}
            start={setStartingindex}
            close={setEdit}
            updates={setEditQuery}
            // load={setQueryDataResults}
            // add={setQueryDataResults}
            view={setEdit}
            menu_id={101}
            diverts={setEdit}
            api_name={"del_currencies"}
            action={false}
            searchWord={search}
            pagination={true}
            custom_action={true}
            sortcolumn={sortcolumn}
            setSortColumn={setSortColumn}
            sortorder={sortorder}
            setSortOrder={setSortOrder}
            sorting={true}
          />}

          <div className="sc_cl_div overflow-auto col-3">
            <Table
              className="sc_cl_table m-auto table-responsive"
              hover
            >
              <thead className="card-header text-left custom-cursor-pointer">
                <tr>
                  <th className="sc_cl_th">
                    <div className="d-flex align-items-center justify-content-center">
                      <div className="d-flex flex-column text-center">
                        Action
                      </div>

                      <div className="d-flex f-right flex-column">
                        <MdKeyboardArrowUp className="sc_cl_sortup sc_cl_visabilitynone" />
                        <MdKeyboardArrowDown className="sc_cl_sortdown sc_cl_visabilitynone" />
                      </div>
                    </div>
                  </th>
                </tr>
              </thead>
              <tbody className="sc_cl_tbody text-center">
                {getquerydefinition.length > 0 ?
                  <>{getquerydefinition.map((data, index) => (
                    <tr key={index}>
                      <td className="sc_cl_td align-items-center d-flex justify-content-center">
                        <button className="sc_cl_switch_button bg-white" >
                          {shared_report == false ?
                            (
                              <FiEdit
                                className="sc_cl_table_icons text-success"
                                onClick={() => fnUpdateDetails(data)}
                                size={17}
                              />
                            ) : (getsharedquerydefinition != undefined && getsharedquerydefinition.length > 0 &&
                              getsharedquerydefinition[index].permission_type === "Editable" ?
                              // .permission_to === user.username
                              (
                                <FiEdit
                                  className="sc_cl_table_icons text-success"
                                  onClick={() => fnUpdateDetails(data)}
                                  size={17}
                                />
                              ) : (
                                <FiEye
                                  className="sc_cl_table_icons text-success"
                                  onClick={() => fnReadDetails(data)}
                                  size={17} />))}

                          {shared_report == false ?
                            (<FiCopy
                              className="sc_cl_table_icons text-primary ms-2"
                              onClick={() => fnCopyDetails(data)}
                              size={17}
                            />
                            ) : (getsharedquerydefinition != undefined && getsharedquerydefinition.length > 0 &&
                              getsharedquerydefinition[index].permission_type === "Editable" ?
                              (
                                <FiCopy
                                  className="sc_cl_table_icons text-primary ms-2"
                                  onClick={() => fnCopyDetails(data)}
                                  size={17}
                                />
                              ) : (
                                <FiCopy
                                  className="sc_cl_table_icons text-primary opacity-50 ms-2"
                                  size={17}
                                  style={{ cursor: "not-allowed" }}
                                />
                              ))
                          }

                          {shared_report === false ?
                            (<FiShare2
                              className="sc_cl_table_icons text-info ms-2"
                              onClick={() => fnShareDetails(data)}
                              size={17}
                            />
                            ) : (
                              <FiShare2
                                className="sc_sc_table_icons text-info opacity-50 ms-2"
                                size={17}
                                style={{ cursor: "not-allowed" }}
                              // disabled={true}
                              />
                            )
                          }

                          {data.query_status === true ? (
                            <MdOutlinePreview
                              className="sc_cl_table_icons text-black ms-2"
                              onClick={() => fnPreviewDetails(data, true)}
                              size={18}
                            />
                          ) : (
                            <MdOutlinePreview
                              className="sc_cl_table_icons text-black opacity-50 ms-2"
                              size={18}
                              // onClick={() => fnPreviewDetails(data)}
                              style={{ cursor: "not-allowed" }}
                            />
                          )}

                          {data.query_status === true ? (
                            <MdOutlineAnalytics
                              className="sc_cl_table_icons text-warning ms-2"
                              onClick={() => { fnCustomDataProfiling(true, data); fnPreviewDetails(data, false) }}
                              size={18}
                            />
                          ) : (
                            <MdOutlineAnalytics
                              className="sc_cl_table_icons text-warning opacity-50 ms-2"
                              size={18}
                              style={{ cursor: "not-allowed" }}
                            />
                          )}
                        </button>
                      </td>

                    </tr>
                  ))}</> :
                  <tr></tr>}
              </tbody>

            </Table>
          </div>

        </div>

      </Card>

      <Modal show={preview} backdrop="static"
        size="xl"
        onHide={() => { setPreview(!preview) }}
        aria-labelledby="contained-modal-title-vcenter"
        centered>
        <Modal.Header closeButton>
          <Modal.Title>Query Preview</Modal.Title>
          <FnExportComponent
            data={getexportall}
            columns={getexportcolumnsto}
            csvdata={getexportall}
          />
        </Modal.Header>
        <Modal.Body>

          {/* {
            getdefinitionData && getdefinitionData.map((items, index) => {

              return (
                <p key={index}>{items.query}</p>
              )
            })
          }



          <Table bordered striped responsive>
            <thead>
              <tr>
                {
                  getquerydataresults[0]?.columns.map((headerItem, headerIndex) => (
                    <th key={headerIndex}>{headerItem}</th>
                  ))
                }
              </tr>
            </thead>

            <tbody>
              {getquerydataresults[0]?.data.map((dataItem, dataIndex) => (
                <tr key={dataIndex}>
                  {Object.values(dataItem).map((value, valueIndex) => (
                    <>
                      <td key={valueIndex}> {value}</td>
                    </>
                  ))}
                </tr>
              ))}
            </tbody>
          </Table> */}



          {newadata_preview.length > 0 ? (
            <div className="sc_cl_div">
              <FnTableComponent
                data={newadata_preview[0]}
                csv_export={''}
                data_length={Number(10)}
                page_size={PageSize}
                columns_in={columns_to_preview[0]}
                date_columns={date_columns_preview}
                columns_type={columns_type_preview}
                start={setStartingindex}
                menu_id={101}
                api_name={"del_currencies"}
                action={false}
                searchWord={search}
                pagination={false}
                custom_action={false}
                sortcolumn={sortcolumn}
                setSortColumn={setSortColumn}
                sortorder={sortorder}
                setSortOrder={setSortOrder}
                sorting={false}
              />
            </div>
          ) : ''}
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={() => setPreview(false)}>
            Close
          </Button>
        </Modal.Footer>

      </Modal>

      <Modal
        size="lg"
        show={sharepreview}
        onHide={() => { setSharePreview(!sharepreview); setShareErrorCode() }}
        // className="align-items-center d-flex justify-content-center"
        backdrop="static"
        centered
      // tabindex="-1"
      >
        <Modal.Header closeButton>
          <Modal.Title>Share Query</Modal.Title>
        </Modal.Header>

        <Modal.Body>
          <Col>
            <Form>
              <Form.Group className="">
                {/* justify-content-between d-flex  justify-content-center*/}
                <div className="col-10" >
                  <div className="gap-1">
                    <Form.Label className="sc_cl_input_label">
                      Select user's For Editable Permission
                    </Form.Label>

                    <React.Fragment>
                      {
                        (() => {
                          // Declare a variable
                          const resultArray = [];
                          let value_array = userdata.filter(item => item.username !== user.username).map((data, index) => data.username)

                          // Use a for loop
                          for (let i = 0; i < value_array.length; i++) {
                            resultArray.push({ value: value_array[i], label: value_array[i].toUpperCase() })
                          }

                          return (
                            <React.Fragment>
                              <Select
                                name={"permission_to"}
                                className='dropdown w-100'
                                placeholder="Select Option"
                                value={resultArray.filter(obj => getsharequeryedit.includes(obj.value))}
                                defaultValue={resultArray}
                                options={resultArray}
                                onChange={(e) => handleInput(e, true)}
                                isMulti
                                isClearable
                                isSearchable
                                size="sm"
                              />
                            </React.Fragment>
                          )
                        })()
                      }
                    </React.Fragment>
                  </div>
                </div>
                <span className={"sc_cl_span red"} >
                  {getshareerrorcode && getshareerrorcode.error ? getshareerrorcode.error : getshareerrorcode}
                </span>

              </Form.Group>

              <Form.Group className=" py-3">
                <div className="col-10" >
                  <div className="gap-1">
                    <Form.Label className="sc_cl_input_label">
                      Select user's For Read only Permission
                    </Form.Label>

                    <React.Fragment>
                      {
                        (() => {
                          // Declare a variable
                          const resultArray = [];
                          let value_array = userdata.filter(item => item.username !== user.username).map((data, index) => data.username)

                          // Use a for loop
                          for (let i = 0; i < value_array.length; i++) {
                            resultArray.push({ value: value_array[i], label: value_array[i].toUpperCase() })
                          }

                          return (
                            <React.Fragment>
                              <Select
                                name={"permission_to"}
                                className='dropdown w-100'
                                placeholder="Select Option"
                                value={resultArray.filter(obj => getsharequeryread.includes(obj.value))}
                                defaultValue={resultArray}
                                options={resultArray}
                                onChange={(e) => handleInput(e, false)}
                                isMulti
                                isClearable
                                isSearchable
                                size="sm"
                              />
                            </React.Fragment>
                          )
                        })()
                      }
                    </React.Fragment>
                  </div>
                </div>
                <span className={"sc_cl_span red"} >
                  {getshareerrorcode && getshareerrorcode.error ? getshareerrorcode.error : getshareerrorcode}
                </span>

              </Form.Group>

            </Form>
          </Col>
        </Modal.Body>

        <Modal.Footer>
          <FnBtnComponent
            onClick={fnSaveSharedQuery}
            classname={"sc_cl_submit_button m-2"}
            children={"Submit"}
          />

          <FnBtnComponent
            onClick={() => setSharePreview(!sharepreview)}
            classname={"sc_cl_close_button"}
            children={"Close"}
          />
        </Modal.Footer>
      </Modal>

      <Modal
        size="lg"
        show={readpreview}
        onHide={() => setReadPreview(!readpreview)}
        // className="align-items-center d-flex justify-content-center"
        backdrop="static"
        centered
      // tabindex="-1"
      >
        <Modal.Header closeButton>
          <Modal.Title>{getreadquery.query_name}</Modal.Title>
        </Modal.Header>

        <Modal.Body>
          {getreadquery.query_text}
        </Modal.Body>

        <Modal.Footer>
          <FnBtnComponent
            onClick={() => setReadPreview(!readpreview)}
            classname={"sc_cl_close_button m-2"}
            children={"Close"}
          />
        </Modal.Footer>
      </Modal>

      <Modal
        show={customshowmodel.status}
        centered
        className="custom-modal modal-xl"
        onHide={() => setCustomShowModel({ status: false, data: '' })}
      >
        <Modal.Header closeButton>
          <Modal.Title className="h5">Data Profile Customization</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <div className="d-flex">

            <div className="col-lg-2">
              <div className={`border d-block myTabContent tab-content h-100 border-end-0
                `}>

                <ul className="nav flex-column h-100" id="myTab" role="tablist">
                  <li className="d-flex flex-column justify-content-evenly nav-item w-100 h-100" role="presentation">
                    {getcustomstate.map((tabItem, index) => (
                      <div
                        className={`nav-link d-flex flex-row  align-items-center gap-2
                        ${getActiveTab === tabItem.id
                            ? "active text-primary bg-info bg-opacity-25 border shadow-sm border-info border-end-0"
                            : "text-secondary active-tab border-0 border-bottom-0 border-top-0"
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
                        <div className="mt-1 small child-label">{tabItem.label}</div>
                      </div>
                    ))}
                  </li>
                </ul>
              </div>
            </div>

            <div className="col-lg-10">
              <div
                className="border d-block tab-content myTabContent border-info"
              // id="myTabContent"
              // style={{ height: "350px" }}
              >
                {getcustomstate.map(
                  (tabOptions, index) =>
                    getActiveTab === tabOptions.id && (
                      <div
                        key={tabOptions.id}
                        className="tab-pane fade show active"
                        role="tabpanel"
                        aria-labelledby="home-tab"
                      >
                        <div className="d-flex p-2">
                          <label className="d-flex col-6"> {tabOptions.label}</label>
                          <div className="d-flex justify-content-end col-6">
                            <Form>
                              <Form.Check
                                type="switch"
                                id="custom-switch"
                                name="label_switch"
                                label={tabOptions.value ? 'Enabled' : 'Disabled'}
                                checked={tabOptions.value}
                                onClick={(e) => handleCheckboxChange(e, index)}
                              />
                            </Form>
                          </div>

                        </div>

                        <div className="d-flex flex-column px-3 py-1">
                          {tabOptions.label == "Correlation" &&
                            <>
                              <div className="border shadow-sm">
                                {tabOptions.correlations.map((item, correlation_index) =>
                                  <div className="d-flex col-12 p-2 border-bottom">
                                    <div className="d-flex justify-content-start align-items-center col-10 small gap-3">
                                      <div className="fw-bold d-flex col-1">{item.method}</div>
                                      <div className="d-flex col-11">{item.about}</div></div>
                                    <div className="d-flex justify-content-end col-2">
                                      <Form>
                                        <Form.Check
                                          className="small"
                                          type="switch"
                                          id="custom-switch"
                                          name="correlation_switch"
                                          // label={item.status ? 'Enabled' : 'Disabled'}
                                          checked={item.status}
                                          onChange={(e) => handleCheckboxChange(e, index, correlation_index)}
                                          disabled={item.disabled || !tabOptions.value}
                                        />
                                      </Form>
                                    </div>
                                  </div>)}

                              </div>
                            </>
                          }
                        </div>
                      </div>
                    )
                )}
              </div>
            </div>

          </div>


        </Modal.Body>
        <Modal.Footer className="">
          <FnBtnComponent
            onClick={() => { setCustomShowModel({ status: false, data: customshowmodel.data }); fnGetDataProfiling(customshowmodel.data, getcustomstate) }}
            children={"Proceed"}
            classname={"sc_cl_submit_button"}
          ></FnBtnComponent>
          <FnBtnComponent
            onClick={() => { setCustomShowModel({ status: false, data: '' }) }}
            children={"Close"}
            classname={"sc_cl_close_button"}
          ></FnBtnComponent>
        </Modal.Footer>
      </Modal>

    </div>
  )
}


const FnTabPage = ({
  userSettings,
  authTokens,
  handleNext,
  setquerydatafullresults,
  setColumnWithTabeID,
  rows, getjoinrows, query,
  setOpenQueryGenerator, getopenquerygenerator,
  getSelectedColumn, setSelectedColumn,
  getselectedConnections, setSelectedConnections,
  getstepCount, setstepCount,
  setRightItems, rightItems,
  setSelectedItems, getselectedItems,
  getquerydata, setQueryData,
  getedit, setEdit,
  geteditquery, setEditQuery, setRows, setJoinRows, setActiveButtons,
  getcolumnalias, setColumnAlias, gettoastMessage, setToastMessage, setLeftItems, user, getalldata, setAlldata
}) => {

  const tabOptions = [
    {
      id: 1,
      label: "My Reports",
      icon: <RiFileUserLine size={25} />,
      content: <FnQueryResults
        userSettings={userSettings}
        authTokens={authTokens}
        handleNext={handleNext}
        setquerydatafullresults={setquerydatafullresults}
        setColumnWithTabeID={setColumnWithTabeID}
        rows={rows} getjoinrows={getjoinrows} query={query}
        setOpenQueryGenerator={setOpenQueryGenerator} getopenquerygenerator={getopenquerygenerator}
        getSelectedColumn={getSelectedColumn} setSelectedColumn={setSelectedColumn}
        getselectedConnections={getselectedConnections} setSelectedConnections={setSelectedConnections}
        getstepCount={getstepCount} setstepCount={setstepCount}
        setRightItems={setRightItems} rightItems={rightItems}
        setSelectedItems={setSelectedItems} getselectedItems={getselectedItems}
        getquerydata={getquerydata} setQueryData={setQueryData} getedit={getedit} setEdit={setEdit} geteditquery={geteditquery}
        setEditQuery={setEditQuery}
        setRows={setRows} setJoinRows={setJoinRows}
        setActiveButtons={setActiveButtons} getcolumnalias={getcolumnalias} setColumnAlias={setColumnAlias}
        gettoastMessage={gettoastMessage} setToastMessage={setToastMessage}
        user={user} dynamic_get_api={"get_range_query_definition"} shared_report={false}
        searchBar={true}
        exportBtn={true}
        addnewBtn={true}
        getalldata={getalldata} setAlldata={setAlldata}
        />,
    },
    {
      id: 2,
      label: "Shared Reports",
      icon: <FaCreativeCommonsShare size={25} />,
      content: <FnQueryResults
        userSettings={userSettings}
        authTokens={authTokens}
        handleNext={handleNext}
        setquerydatafullresults={setquerydatafullresults}
        setColumnWithTabeID={setColumnWithTabeID}
        rows={rows} getjoinrows={getjoinrows} query={query}
        setOpenQueryGenerator={setOpenQueryGenerator} getopenquerygenerator={getopenquerygenerator}
        getSelectedColumn={getSelectedColumn} setSelectedColumn={setSelectedColumn}
        getselectedConnections={getselectedConnections} setSelectedConnections={setSelectedConnections}
        getstepCount={getstepCount} setstepCount={setstepCount}
        setRightItems={setRightItems} rightItems={rightItems}
        setSelectedItems={setSelectedItems} getselectedItems={getselectedItems}
        getquerydata={getquerydata} setQueryData={setQueryData} getedit={getedit} setEdit={setEdit} geteditquery={geteditquery}
        setEditQuery={setEditQuery}
        setRows={setRows} setJoinRows={setJoinRows}
        setActiveButtons={setActiveButtons} getcolumnalias={getcolumnalias} setColumnAlias={setColumnAlias}
        gettoastMessage={gettoastMessage} setToastMessage={setToastMessage}
        user={user} dynamic_get_api={"get_range_shared_query_definition"} shared_report={true}
        searchBar={true}
        exportBtn={true}
        addnewBtn={false}
      />,
    }
  ];

  return (
    <div>
      <FnTabComponent data={tabOptions} />
    </div>
  )
}



const FnFullQueryResults = ({ getquerydatafullresults, setquerydatafullresults, }) => {


  return (
    <div className="query_container">

      <div className="d-flex justify-content-end">
        <FnExportComponent
          data={getquerydatafullresults[0].data}
          columns={getquerydatafullresults[0].columns}
          csvdata={getquerydatafullresults[0].data}
        />
      </div>


      <div className="mt-3">
        <Table bordered striped responsive>
          <thead>
            <tr>
              {
                getquerydatafullresults[0]?.columns.map((headerItem, headerIndex) => (
                  <th key={headerIndex}>{headerItem}</th>
                ))
              }
            </tr>
          </thead>

          <tbody>
            {getquerydatafullresults[0]?.data.map((dataItem, dataIndex) => (
              <tr key={dataIndex}>
                {Object.values(dataItem).map((value, valueIndex) => (
                  <>
                    <td key={valueIndex}> {value}</td>
                  </>
                ))}
              </tr>
            ))}
          </tbody>
        </Table>
      </div>

    </div>
  )
}



export default FnStepReportBuilder