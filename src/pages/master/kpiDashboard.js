/* ============================================================================================================================================================

   CITTABASE SOLUTIONS - All Rights Reserved.
   ------------------------------------------------------------------------------------------------------------------------------------------------------------

   03-Aug-2022   Revan Rufus S   Initial Version V1

   ** This Page is to define Home Page of the Application   **

============================================================================================================================================================*/

import React, { useState, useContext, useRef, useEffect } from "react";
import AuthContext from "../../context/AuthContext";
import PreContext from "../../context/PreContext";
import { Row, Tabs, Tab, Button, Modal, Card, Form } from "react-bootstrap";
import FnBtnComponent from "../../components/buttonComponent";
import FnSelectComponent from "../../components/selectComponent";
import FnBreadCrumbComponent from "../../components/breadCrumbComponent";
import FnChartCheckComponent from "../../components/chartCheckComponent";
import FnToastMessageComp from "../../components/toastMessageComponent";
import { CgChevronDoubleLeft, CgChevronDoubleRight } from 'react-icons/cg'
import { useNavigate, useParams } from "react-router-dom";
import { BiMessageRoundedError } from "react-icons/bi";
import jwtDecode from "jwt-decode";

const FnKpiDashboard = () => {
  const authTokens = JSON.parse(localStorage.getItem('authTokens'))
  let user = jwtDecode(localStorage.getItem("authTokens"))
  // let { user } = useContext(AuthContext);
  const { id } = useParams();
  const navigator = useNavigate();
  // let { setisloading } = useContext(PreContext);
  const [getsmpdata, setSmpData] = useState([]);
  const [view, setView] = useState();
  const [scorecard, setScoreCard] = useState([]);
  const [search_scorecard, setSearchScoreCard] = useState([]);
  const [table_name_api_query, setTable_name_api_query] = useState("");
  const [searchError, SetSearchError] = useState();


  const [getscorecarddata, setScoreCardData] = useState([])
  const [getperspective, setPerspective] = useState([])
  const [getkpidetails, setKpiDetails] = useState([])
  const [getkpiactuals, setKpiActuals] = useState([])

  let breadcumb_menu = [
    { Label: "Home", Link: "/" },

    {
      Label: " KPI Dashboard",
    },
  ];

  const fn_get_sc_details_business = async () => {
    let res = await fetch(
      `${process.env.REACT_APP_SERVER_URL}/api/get_scorecard`,
      {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          Authorization: "Bearer " + String(authTokens.access),
        },
      }
    );

    let data = await res.json();

    let scorecard_data = data;
    let scorecard_name = scorecard_data.map(temp => temp.scorecard_description)

    setSearchScoreCard(scorecard_name)
  }


  const fnChartData = async () => {

    let scorecard_request = await fetch(
      `${process.env.REACT_APP_SERVER_URL}/api/get_scorecard`,
      {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          Authorization: "Bearer " + String(authTokens.access),
        },
      }
    );

    const perspective_request = await fetch(
      `${process.env.REACT_APP_SERVER_URL}/api/get_perspectives`,
      {
        method: "GET",
        headers: {
          "Content-Type": "application/json",

          Authorization: "Bearer " + String(authTokens.access),
        },
      }
    );

    const kpidetails_request = await fetch(
      `${process.env.REACT_APP_SERVER_URL}/api/get_kpi_details`,
      {
        method: "GET",
        headers: {
          "Content-Type": "application/json",

          Authorization: "Bearer " + String(authTokens.access),
        },
      }
    );


    const kpiactual_request = await fetch(
      `${process.env.REACT_APP_SERVER_URL}/api/get_kpi_actuals`,
      {
        method: "GET",
        headers: {
          "Content-Type": "application/json",

          Authorization: "Bearer " + String(authTokens.access),
        },
      }
    );


    let scorecard_response = await scorecard_request.json()

    let perspective_response = await perspective_request.json()

    let kpidetails_response = await kpidetails_request.json()

    let kpiactual_response = await kpiactual_request.json()

    const scorecardObj = scorecard_response.map(({ id, scorecard_description }) => ({ id, scorecard_description }));

    const perspectiveObj = perspective_response.map(({ id, perspective, description }) => ({ id, perspective, description }))



    const updatedPerspectiveObj = perspectiveObj.map((item) => ({
      ...item,
      perspective: item.perspective.replace(' Perspective', ''),
    }));

    const kpidetailsObj = kpidetails_response.map(({ id, kpi, max, min, target, chart_type, frequency, measure, baseline, scorecard_id, perspective_id }) => ({ id, kpi, max, min, target, chart_type, frequency, measure, baseline, scorecard_id, perspective_id }));
    const kpiactualObj = kpiactual_response.map(({ id, period, actuals, kpi_id }) => ({ id, period, actuals, kpi_id }));

    // const mergedKpiDetailsAndActual = kpidetailsObj.map((KpiDetailObject) => {
    //   const mergedKpiObject = kpiactualObj.find((KpiActualObject) => KpiActualObject.kpi_id == KpiDetailObject.id)
    //   return mergedKpiObject ?{
    //     ...KpiDetailObject,
    //     period : mergedKpiObject.period,
    //     actuals : mergedKpiObject.actuals
    //   }:''
    // }).filter(Boolean)



    let scoreCardData = scorecardObj.map((item) => {
      let perspective_object = updatedPerspectiveObj
        .filter((prepItem) => {
          return kpidetailsObj.some(
            (kpi) =>
              kpi.scorecard_id === item.id &&
              kpi.perspective_id === prepItem.id
          );
        })
        .map((prepItem) => {
          let perspectiveItem = { ...prepItem };
          perspectiveItem.kpiDetails = kpidetailsObj
            .filter(
              (kpi) =>
                kpi.scorecard_id === item.id &&
                kpi.perspective_id === prepItem.id
            )
            .map((actualObj) => {
              let kpiActuals = kpiactualObj.filter(
                (act) => act.kpi_id === actualObj.id
              );
              return { ...actualObj, kpiActual: kpiActuals };
            });
          return perspectiveItem;
        });
      item.Perspective_level = perspective_object;
      return item;
    });


    setScoreCard(scoreCardData)


  }

  const fnSearchScorecard = async (e) => {
    let search = e.target.value;
    setTable_name_api_query(search)
    if (search !== "") {
      // setisloading(true)
      let filter_response = await fetch(
        `${process.env.REACT_APP_SERVER_URL}/api/scorecard_description/?search=${search}`,
        {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
            Authorization: "Bearer " + String(authTokens.access),
          },
        }
      );

      let filter_data = await filter_response.json();

      const temp = () =>
        filter_data.map((items, idx) => {
          return items.id;
        });

      let cl_temp = scorecard.filter((items, idx) => {
        return items.id == temp();
      });
      setSmpData(cl_temp);
      // setisloading(false)
    } else {
      SetSearchError("Please select anyone")
      setSmpData([]);
    }
  };

  const search_refresh = () => {
    setTable_name_api_query('')
    setSmpData([])
  };

  const fnGetPermissions = async () => {
    let res = await fetch(
      `${process.env.REACT_APP_SERVER_URL}/api/join_user_group_access/${user.user_id}/${id}/`,
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
      if (data.length > 0) {
        let pdata = { ...data };
        // setRemove(pdata[0].delete === "Y" ? true : false);
        // setEdit(pdata[0].edit === "Y" ? true : false);
        // setAdd(pdata[0].add === "Y" ? true : false);
        setView(pdata[0].view === "Y" ? true : false);
      }
    }
  };


  useEffect(() => {
    fnGetPermissions();
    fnChartData()
    fn_get_sc_details_business();
    // search_refresh();
    // setModalShow(!show);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // Tab layout respective to prespective

  const PerspectiveTabs = ({ data }) => {
    const [getActiveTab, setActiveTab] = useState(data[0].id)

    const overFlowDivRef = useRef(null)

    const openActiveTab = (tabId) => {
      setActiveTab(tabId)
    }

    const overFlowNextTabButton = () => {
      const currentIndex = data.findIndex((tab) => tab.id === getActiveTab);
      const nextIndex = (currentIndex + 1) % data.length;
      const nextTabId = data[nextIndex].id;
      setActiveTab(nextTabId);

      const tabContainer = overFlowDivRef.current;

      const fullTabWidth = tabContainer.offsetWidth

      tabContainer.scrollTo({
        right: tabContainer.scrollLeft + fullTabWidth,
        behavior: 'smooth',
      });

    }

    const overFlowPreviousTabButton = () => {
      const currentIndex = data.findIndex((tab) => tab.id === getActiveTab);
      const prevIndex = (currentIndex - 1) % data.length;
      const prevTabId = data[prevIndex].id;
      setActiveTab(prevTabId);

      const tabContainer = overFlowDivRef.current;
      const fullTabWidth = tabContainer.offsetWidth
      tabContainer.scrollTo({
        left: tabContainer.scrollLeft - 1080,
        behavior: 'smooth',
      });
    }



    return (
      <div className="tab-container mt-5">
        <div className="align-items-center d-flex justify-content-between m-0 px-1 tab">
          <div>
            <p className={`${getActiveTab == data[0].id ? 'd-none' : ' d-block'} m-0 text-dark sc_cl_tab_icon`} onClick={overFlowPreviousTabButton}>{<CgChevronDoubleLeft />}</p>
          </div>

          <div className="d-flex justify-content-between mx-2 overflow-hidden w-100 gap-1">
            {data.map((tabItem) => (
              <button
                key={tabItem.id}
                className={`text-nowrap gap-1 ${getActiveTab === tabItem.id ? 'active' : ''}`}
                onClick={() => openActiveTab(tabItem.id)}
              >
                {tabItem.perspective}
              </button>
            ))}
          </div>

          <div>
            <p className={`${getActiveTab == data[data.length - 1].id ? 'd-none' : ' d-block'} m-0 text-dark sc_cl_tab_icon`} onClick={overFlowNextTabButton} >{<CgChevronDoubleRight />}</p>
          </div>

        </div>

        <div className="mx-3 tab-content">
          {data.map((tabChartItem) => (
            getActiveTab === tabChartItem.id && (
              <FnChartCheckComponent kpiData={tabChartItem.kpiDetails} />
            )
          ))}
        </div>

      </div>
    );
  };
  return (
    <>
      {view === undefined ?
        ''
        : <>
          {view === false ? (
            // <FnAccessRestricted />
            <Modal
              show={true}
              centered
              style={{ padding: "20px", textAlign: "center" }}
            >
              <Modal.Header className="justify-content-center text-danger">
                <BiMessageRoundedError size={70} />
              </Modal.Header>
              <Modal.Body>
                <h2>{"User Restricted"}</h2>
                <h5> {"You don't have access!"}</h5>
              </Modal.Body>
              <Modal.Footer className="justify-content-center">
                <FnBtnComponent
                  onClick={() => navigator("/")}
                  children={"Close"}
                  classname={"sc_cl_close_button"}
                ></FnBtnComponent>
              </Modal.Footer>
            </Modal>
          ) : (
            <div className="sc_cl_div w-100 px-2">

              <div className="d-flex flex-column flex-lg-row sc_cl_row sc_cl_page_header">
                <div className="align-items-center col-12 col-lg-6 d-flex py-2 text-center">
                  <h5 className="sc_cl_head m-0">KPI Dashboard</h5>
                </div>

                <div className="align-items-center col-12 col-lg-6 d-flex justify-content-lg-end px-2 py-2 text-center">
                  <FnBreadCrumbComponent seperator_symbol={" >"} nav_items={breadcumb_menu} />
                </div>
              </div>

              {/* <hr></hr> */}

              <Card className="border-0 shadow-sm w-100 mt-2">
                <Card.Body>
                  <Row className="sc_cl_row ">
                    <div className="sc_cl_div col-lg-12 d-flex flex-column flex-lg-row flex-sm-column justify-content-between">
                      <div className="col-12 col-lg-4 d-flex flex-column px-0 px-lg-2 sc_cl_div">
                        <Form.Select
                          size="sm"
                          value={table_name_api_query}
                          onChange={(e) => fnSearchScorecard(e)}
                          name="scorecard_name"
                        >
                          <option hidden>Select a Scorecard</option>
                          {search_scorecard.length !== 0 ? (
                            search_scorecard.map((scorecard_items, idx) => (
                              <option value={scorecard_items} key={idx}>
                                {scorecard_items}
                              </option>
                            ))
                          ) : (
                            <option disabled>Scorecard not available</option>
                          )}

                        </Form.Select>
                      </div>
                    </div>
                  </Row>
                  {/* <Row className="d-flex flex-column flex-lg-row sc_cl_row">
        <label className="py-2 strong h6">Filter Scorecard</label>
        <div className="sc_cl_div col-lg-12 d-flex flex-column flex-lg-row flex-sm-column justify-content-between">
          <div className="sc_cl_div col-6 d-flex flex-column">
            <FnSelectComponent values={search_scorecard} labels={search_scorecard} query={table_name_api_query} setQuery={setTable_name_api_query} multiselect={false} error={SetSearchError} />
            <span className="sc_cl_span red">
              {searchError}
            </span>
          </div>
          <div className="sc_cl_div col-6 d-flex">
            <FnBtnComponent children={"Filter"} classname={"sc_cl_submit_button m-2"} onClick={() => fnSearchScorecard(table_name_api_query)} />
            <FnBtnComponent classname={`${getsmpdata.length === 1 ? 'd-block' : 'd-none'} sc_cl_close_button m-2`} children={"Reset"} onClick={search_refresh} />

          </div>
        </div>
      </Row> */}
                  <div>
                    {
                      // getsmpdata.length > 0 ? 
                      getsmpdata.map((items, idx) => {
                        return (
                          <>
                            <PerspectiveTabs data={items.Perspective_level} />
                          </>
                        )
                      })
                    }
                  </div>
                </Card.Body>
              </Card>
            </div>
          )}
        </>
      }
    </>
  );
};

export default FnKpiDashboard;
