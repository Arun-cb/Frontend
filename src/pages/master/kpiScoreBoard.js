import React, { useState, useContext, useEffect } from "react";
import AuthContext from "../../context/AuthContext";
import PreContext from "../../context/PreContext";
import Swal from "sweetalert2";
import {
  Accordion,
  Card,
  Button,
  useAccordionButton,
  Modal,
  Form,
  FormGroup,
  Col,
  FormLabel,
  FormControl,
  Row,
  Table,
  FormSelect
} from "react-bootstrap";
import { BsFillPinFill, BsFillPinAngleFill } from "react-icons/bs";
import FnBtnComponent from "../../components/buttonComponent";
import FnSelectComponent from "../../components/selectComponent";
import FnBreadCrumbComponent from "../../components/breadCrumbComponent";
import { CgLayoutGrid } from "react-icons/cg";
import FnToastMessageComp from "../../components/toastMessageComponent";
import FnTooltipComponent from "../../components/tooltipComponent";
import { useParams, useNavigate } from "react-router-dom";
import { BiMessageRoundedError } from "react-icons/bi";
import moment from "moment";


const Fn_Kpi_Dashboard = () => {
  let { authTokens, user, setLoading } = useContext(AuthContext);
  const navigator = useNavigate();
  let { userSettings } = useContext(PreContext);
  let { setisloading } = useContext(PreContext);
  const [getsmpdata, setSmpData] = useState([]);
  const [view, setView] = useState();
  const [search, setSearch] = useState("");
  const [scorecard, setScoreCard] = useState([]);
  const [getShow, setShow] = useState(true);
  const [show, setModalShow] = useState(false);
  const [org_indicators, setOrg_indicators] = useState([]);
  const [search_scorecard, setSearchScoreCard] = useState([]);
  const [table_name_api_query, setTable_name_api_query] = useState("");
  const [helper, setHelper] = useState([]);
  const [selectedKpis, setSelectedKpis] = useState([]);
  const [orgindicator, setOrgIndicator] = useState([]);
  const [startingIndex, setStartingindex] = useState(0);
  const [searchError, SetSearchError] = useState();
  const PageSize =
    userSettings && userSettings.pagination
      ? userSettings.pagination
      : process.env.REACT_APP_PAGINATION;

  const endingIndex = startingIndex + Number(PageSize);
  const { id } = useParams();

  const [getSelectedPinnedKPI, setSelectedPinnedKPI] = useState([])
  const [getpinneddata, setPinnedData] = useState([])
  const [getUpdateMode, setUpdateMode] = useState(false)

  const [getToastMessage, setToastMessage] = useState([])

  let breadcumb_menu = [
    { Label: "Home", Link: "/" },
    {
      Label: "KPI Report",
    },
  ];


  const fn_get_sc_details_business = async () => {
    const get_scorecard_request = await fetch(
      `${process.env.REACT_APP_SERVER_URL}/api/get_scorecard`,
      {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          Authorization: "Bearer " + String(authTokens.access),
        },
      }
    );

    let get_scorecard_data = await get_scorecard_request.json();
    if (get_scorecard_request.status === 200) {
      setSearchScoreCard(get_scorecard_data);
    }
    // let res = await fetch(
    //   `${process.env.REACT_APP_SERVER_URL}/api/get_sc_dashboard_view`,
    //   // get_range_/${startingIndex}/${endingIndex}/`,
    //   {
    //     method: "GET",
    //     headers: {
    //       "Content-Type": "application/json",
    //       Authorization: "Bearer " + String(authTokens.access),
    //     },
    //   }
    // );


    // let data = await res.json();

    // const scorecard_detail_response = await fetch(
    //   `${process.env.REACT_APP_SERVER_URL}/api/get_sd_dashboard_view`,
    //   {
    //     method: "GET",
    //     headers: {
    //       "Content-Type": "application/json",
    //       Authorization: "Bearer " + String(authTokens.access),
    //     },
    //   }
    // );



    // const businessgoal_response = await fetch(
    //   `${process.env.REACT_APP_SERVER_URL}/api/get_obj_dashboard_view`,
    //   {
    //     method: "GET",
    //     headers: {
    //       "Content-Type": "application/json",
    //       Authorization: "Bearer " + String(authTokens.access),
    //     },
    //   }
    // );



    // const kpidetails_response = await fetch(
    //   `${process.env.REACT_APP_SERVER_URL}/api/get_kpi_dashboard_view`,
    //   {
    //     method: "GET",
    //     headers: {
    //       "Content-Type": "application/json",
    //       Authorization: "Bearer " + String(authTokens.access),
    //     },
    //   }
    // );



    const org_indicators = await fetch(
      `${process.env.REACT_APP_SERVER_URL}/api/get_org_definition_stop_light_indicators`,
      {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          Authorization: "Bearer " + String(authTokens.access),
        },
      }
    );



    // const prespective_response = await fetch(
    //   `${process.env.REACT_APP_SERVER_URL}/api/get_perspectives`,
    //   {
    //     method: "GET",
    //     headers: {
    //       "Content-Type": "application/json",
    //       Authorization: "Bearer " + String(authTokens.access),
    //     },
    //   }
    // );



    // const org_definition_kpi_indicator_response = await fetch(
    //   `${process.env.REACT_APP_SERVER_URL}/api/get_org_definition_stop_light_indicators`,
    //   {
    //     method: "GET",
    //     headers: {
    //       "Content-Type": "application/json",
    //       Authorization: "Bearer " + String(authTokens.access),
    //     },
    //   }
    // );

    // let scorecard_detail = await scorecard_detail_response.json();

    // let businessgoal = await businessgoal_response.json();

    // let kpi_details = await kpidetails_response.json();

    let org_indicators_details = await org_indicators.json();
    setOrgIndicator(org_indicators_details)

    // let prepspective_details = await prespective_response.json();

    // let org_definition_kpi_details =
    //   await org_definition_kpi_indicator_response.json();
    // setOrg_indicators(org_definition_kpi_details);

    // let scorecard_data = data;

    // // let merged_data = prepspective_details.map((items, idx) =>
    // //   Object.assign({}, items, scorecard_detail[idx])
    // // );
    // const merged_data = scorecard_detail
    //   .map((items) => {
    //     const smpl_obj = prepspective_details.find(
    //       (obj) => obj.id === items.perspective_id
    //     );
    //     return smpl_obj
    //       ? {
    //         ...items,
    //         perp_description: smpl_obj.description,
    //         perp_name: smpl_obj.perspective,
    //         perp_code: smpl_obj.perspective_code,
    //         ScObjective: true,
    //       }
    //       : "";
    //   })



    //   .filter(Boolean);



    // const getByKpiID = (id) => {
    //   return kpi_details.filter((kpiItems) => kpiItems.objective_id == id);
    // };



    // let getkpiId = businessgoal.filter((kpiIdItems) => {
    //   return (kpiIdItems["kpi_items"] = getByKpiID(kpiIdItems.id));
    // });



    // const getByIndicators = (id) => {
    //   return kpi_indicators_details.filter((kpiItems) => kpiItems.kpi_id == id);
    // };



    // let getindicators = kpi_details.filter((kpiIdItems) => {
    //   return (kpiIdItems["Indicators"] = getByIndicators(kpiIdItems.id));
    // });



    // let scoreCardData = scorecard_data.filter((items) => {
    //   let scorecard_details_obj = merged_data.filter(
    //     (obj) => obj.scorecard_id == items.id
    //   );
    //   scorecard_details_obj.map((detailsObj, idx) => {
    //     scorecard_details_obj[idx].BusinessGoal = getkpiId.filter(
    //       (innerobj) =>
    //         innerobj.scorecard_id == items.id &&
    //         innerobj.scorecard_details_id == detailsObj.id
    //     );
    //   });
    //   return (items.ScoreCard_Details = scorecard_details_obj);
    // });


    // let scoreCardData = data
    // console.log("data", scoreCardData)
    // const filter_sc_desc = scoreCardData.map(temp => temp.scorecard_description)
    // const filter_sc_desc_id = scoreCardData.map(temp => temp.id)

// console.log("filter_sc_desc", filter_sc_desc)

    // setScoreCard(scoreCardData);
    // setSearchScoreCard(filter_sc_desc)
    // setSearchScoreCardIds(filter_sc_desc_id)


    //Help Text

    let res_helper = await fetch(
      `${process.env.REACT_APP_SERVER_URL}/api/get_helper/${id}`,
      {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          Authorization: "Bearer " + String(authTokens.access),
        },
      }
    );
    let helper_data = await res_helper.json();
    if (res_helper.status === 200) {
      if (helper_data) {
        setHelper(helper_data);
      }
    }

  };


  const help = helper.filter(user => String(user.page_no).includes(String(id))).map((use) => use)

  useEffect(() => {
    async function fetchPinData() {
      let pinResponse = await fetch(
        `${process.env.REACT_APP_SERVER_URL}/api/get_kpi_pin_dashboard/${user.user_id}`, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          Authorization: "Bearer " + String(authTokens.access),
        },
      });

      let pinData = await pinResponse.json()

      if (pinResponse.status == 200) {
        setPinnedData(pinData)
      }
      else {
        alert("not happen")
      }

    }
    fetchPinData()
  }, [getUpdateMode])


  async function insKpiPinData(getobjData) {
    let res = await fetch(
      `${process.env.REACT_APP_SERVER_URL}/api/upd_kpi_pin_dashboard`,
      {
        method: "PUT",
        body: JSON.stringify(getobjData),
        headers: {
          "Content-Type": "application/json",
          Authorization: "Bearer " + String(authTokens.access),
        },
      }
    );
    let insertedDataResults = await res.json();
    if (res.status === 200) {
      setUpdateMode(!getUpdateMode)
      // setLoading(true)
    } else {

    }
  }

  async function removeKpiPinData(getobjData) {

    let removeDataResponse = await fetch(
      `${process.env.REACT_APP_SERVER_URL}/api/upd_kpi_pin_dashboard`, {
      method: "PUT",
      body: JSON.stringify(getobjData),
      headers: {
        "Content-Type": "application/json",
        Authorization: "Bearer " + String(authTokens.access)
      }
    }
    )
    let removeDataResults = await removeDataResponse.json()
    if (removeDataResponse.status === 200) {
      setUpdateMode(!getUpdateMode)
    } else {
    }
  }

  const inputHandler = (kpisend_data) => {

    const { id } = kpisend_data

    const selectedKpiItems = {
      kpi_name: kpisend_data.kpi,
      kpi_id: kpisend_data.id,
      kpi_score: kpisend_data.score,
      user_id: user.user_id,
      created_by: user.user_id,
      last_updated_by: user.user_id,
    };

    const isSelectedKPI = getpinneddata.some((pinnedItems) => pinnedItems.kpi_id === id)


    if (isSelectedKPI) {
      removeKpiPinData(selectedKpiItems)

      const toastMessage = `${selectedKpiItems.kpi_name} has unpinned to homepage`
      setToastMessage((prevToastMessages) => [...prevToastMessages, toastMessage]);

    }
    else {
      if (getSelectedPinnedKPI.length < 4) {

        const totalUserKPI = getpinneddata.filter((totalItems) => totalItems.user_id === user.user_id)

        if (totalUserKPI.length < 4) {

          setSelectedPinnedKPI([...getSelectedPinnedKPI, id]);
          insKpiPinData(selectedKpiItems)

          const toastMessage = `${selectedKpiItems.kpi_name} has pinned to homepage`
          setToastMessage((prevToastMessages) => [...prevToastMessages, toastMessage]);

        } else {

          alert("Maximum limit reached. Cannot select more than 4 KPIs user.");
        }
      } else {

        alert("Maximum limit reached")

      }
    }
  };

  const PerspectiveComp = ({ prep_data }) => {
    return (
      <>
        {prep_data.map((prespectiveItem, idx) => {
          return (
            <>
              <tr className="">
                <td>{prespectiveItem.description}</td>
                <td>{prespectiveItem.weight}</td>
                <td style={{color: prespectiveItem.indicator}} className="fw-bold">{prespectiveItem.score}</td>
              </tr>
              <tr>
                <td colSpan="3" className="ps-3 ms-3">
                  <Table bordered style={{ tableLayout: "fixed", width: "100%" }}>
                    <tbody>
                      {
                        prespectiveItem.objective.length > 0 ? (
                          <BusinessComp busniness_data={prespectiveItem.objective} />
                        ) : (
                          ""
                        )
                      }
                    </tbody>
                  </Table>
                </td>
              </tr>
            </>
          );
        })}
      </>
    );
  };


  const BusinessComp = ({ busniness_data }) => {
    return (
      <>
        {busniness_data.map((businessItem, idx) => {
          return (
            <>
              <tr>
                <td style={{ width: "64.3%" }}>{businessItem.objective_description}</td>
                <td>{businessItem.weight}</td>
                <td style={{ width: "15.5%", color: businessItem.indicator}} className="fw-bold">{businessItem.score}</td>
              </tr>
              <tr>
                <td colSpan={"3"}>
                  <Table bordered variant="secondary" className="ms-2" >
                    <tbody>
                      {
                        businessItem.kpi.length > 0 ?
                          (
                            <KpiComp kpisend_data={businessItem.kpi} />)
                          :
                          ("")
                      }
                    </tbody>
                  </Table>
                </td>
              </tr>
            </>
          );
        })}
      </>
    );
  };



  const KpiComp = ({ kpisend_data }) => {
    return (
      <>
        {
          kpisend_data.map((kpiItem, idx) => {
            const isPinned = getpinneddata.filter((temp) => temp.kpi_id === kpiItem.id)
            return (
              <>
                <tr>
                  <td style={{ width: "0%" }}>

                    <button onClick={() => { inputHandler(kpiItem) }} className="sc_cl_default_btn">
                      {
                        isPinned.length === 0 ? <BsFillPinAngleFill className="text-primary" /> : <BsFillPinFill className="text-success" />
                      } </button>

                  </td>
                  <td style={{ width: "61.8%" }}>{kpiItem.kpi}</td>
                  <td>{kpiItem.weight}</td>
                  <td style={{ width: "15.5%", color: kpiItem.indicator }}>
                    <span className="fw-bold">{kpiItem.score}</span>
                    <span className="float-end">{<ScoreIniative kpiItem={kpiItem} indItems={kpiItem.indicator} />}</span>
                  </td>
                </tr>
              </>
            );
          })}
      </>
    );
  };

  const ScoreIniative = ({ kpiItem, indItems }) => {
    const [ind_initiative, setInd_initative] = useState([]);
    const [error, setError] = useState({});
    const [modal, setModal] = useState(false);
    const [kpi_initiative, setKpi_initative] = useState([]);


    //On Change Function

    const InitiativeInputHandler = (e) => {
      setInd_initative({
        ...ind_initiative,
        [e.target.name]: e.target.value,
        ...kpi_initiative,
      });
      setError({ ...error, [e.target.name]: "" });
    };


    const validation_of_input = () => {
      let error = {};
      if (!ind_initiative.action_item) {
        error.action_item = "Please Enter Action Item.";
      }

      if (!ind_initiative.target_date) {
        error.target_date = "Please Enter Target.";
      }

      if (!ind_initiative.ownership) {
        error.ownership = "Please Enter Ownership.";
      }

      if (!ind_initiative.status) {
        setInd_initative({
          ...ind_initiative,
          status: 'not_started'})
        error.ownership = "Please Enter Ownership.";
      }

      if (Object.keys(error).length == 0) {
        setError(error);
        initiative();
      }
      else {
        setError(error);
      }
    };

    const toggle = async (kpidata) => {
      setModal(!modal);
      setKpi_initative({
        scorecard_description: getsmpdata[0]["scorecard_description"],
        scorecard_id: kpidata.scorecard_id,
        perspective_id: kpidata.perspective_id,
        objective_id: kpidata.objective_id,
        kpi_id: kpidata.id,
        created_by: user.user_id,
        last_updated_by: user.user_id,
      });
    };

    const initiative = async () => {
      let res = await fetch(
        `${process.env.REACT_APP_SERVER_URL}/api/ins_sc_initiative`,
        {
          method: "POST",
          body: JSON.stringify([ind_initiative]),
          headers: {
            "Content-Type": "application/json",
            Authorization: "Bearer " + String(authTokens.access),
          },
        }
      );

      let data = await res.json();

      if (res.status === 201) {
        setError();
        Swal.fire({
          icon: "success",
          text: "Created Successfully!",
        }).then(function () {
          setModal(!modal);
        });
      } else {
        setError(data);
      }
    };

    useEffect(() => {
      if(kpiItem.initiative){
        console.log(kpiItem.initiative)
        setInd_initative(...kpiItem.initiative)
      }
    }, [])

    return (
      <>
        {indItems !== "#116530" &&
          indItems !== "#76B947" ? (
          <a
            className="fw-semibold mt-2 mt-lg-0 w-auto text-decoration-underline sc_cl_cursor_pointer"
            onClick={(e) => {
              toggle(kpiItem);
            }}
          >
            Initiative
          </a>
        ) : (
          ""
        )}
        <Modal
          size="lg"
          show={modal}
          onHide={toggle}
          className="align-items-center d-flex justify-content-center"
          backdrop="static"
          tabindex="-1"
        >
          <Modal.Header closeButton>
            <Modal.Title>Initiative</Modal.Title>
          </Modal.Header>

          <Modal.Body>
            <Col>
              <Form>
                {/* className="col-12 d-flex flex-column flex-lg-row" */}
                <div className="sc_cl_div col-12 d-flex flex-column">
                  <FormGroup>
                    <FormLabel className="sc_cl_input_label">
                      Action Item
                      <sup className="text-danger">*</sup>
                      <FnTooltipComponent
                        label={helper.filter((user) => user.context_order === 4)
                          .map((use) => use.label)}
                        context={helper.filter((user) => user.context_order === 4)
                          .map((use) => use.help_context)}
                        classname={""}
                        placement="bottom"
                      />
                    </FormLabel>
                    <FormControl
                      as="textarea"
                      name="action_item"
                      rows="2"
                      cols="50"
                      value={ind_initiative && ind_initiative.action_item}
                      onChange={InitiativeInputHandler}
                      className="sc_cl_input"
                      size="sm"
                    />
                  </FormGroup>
                  <span className="sc_cl_span red">{error && error.action_item}</span>
                </div>

                <div className="col-12 d-flex flex-row gap-2 pb-2">
                  <div className="col-5">
                    <FormGroup>
                      <FormLabel className="sc_cl_input_label">
                        Target
                        <sup className="text-danger">*</sup>
                        <FnTooltipComponent
                          label={helper.filter((user) => user.context_order === 5)
                            .map((use) => use.label)}
                          context={helper.filter((user) => user.context_order === 5)
                            .map((use) => use.help_context)}
                          classname={""}
                          placement="bottom"
                        />
                      </FormLabel>
                      <FormControl
                        type="date"
                        name="target_date"
                        value={ind_initiative && ind_initiative.target_date}
                        onChange={InitiativeInputHandler}
                        className="sc_cl_input"
                        size="sm"
                      />
                    </FormGroup>
                    <span className="sc_cl_span red">{error && error.target_date}</span>
                  </div>
                  <div className="col-5">
                  <FormGroup>
                    <FormLabel className="sc_cl_input_label">
                      Status
                      <sup className="text-danger">*</sup>
                      <FnTooltipComponent
                        label={helper.filter((user) => user.context_order === 6)
                          .map((use) => use.label)}
                        context={helper.filter((user) => user.context_order === 6)
                          .map((use) => use.help_context)}
                        classname={""}
                        placement="bottom"
                      />
                    </FormLabel>
                    <FormSelect
                      size="sm"
                      name="status"
                      value={ind_initiative && ind_initiative.status}
                      onChange={InitiativeInputHandler}
                      className="sc_cl_select"
                    >
                      <option className="sc_cl_option" value='not_started' defaultChecked>Not Started</option>
                      <option className="sc_cl_option" value='in_progress'>In-Progress</option>
                      <option className="sc_cl_option" value='complete'>Complete</option>
                    </FormSelect>
                  </FormGroup>
                  <span className="sc_cl_span red">{error && error.status}</span>
                  </div>
                </div>

                <div className="sc_cl_div col-12 d-flex flex-column pb-2">
                  <FormGroup>
                    <FormLabel className="sc_cl_input_label">
                      Ownership (Name)
                      <sup className="text-danger">*</sup>
                      <FnTooltipComponent
                        label={helper.filter((user) => user.context_order === 6)
                          .map((use) => use.label)}
                        context={helper.filter((user) => user.context_order === 6)
                          .map((use) => use.help_context)}
                        classname={""}
                        placement="bottom"
                      />
                    </FormLabel>
                    <FormControl
                      type="text"
                      name="ownership"
                      value={ind_initiative && ind_initiative.ownership}
                      onChange={InitiativeInputHandler}
                      className="sc_cl_input"
                      size="sm"
                    />
                  </FormGroup>
                  <span className="sc_cl_span red">{error && error.ownership}</span>
                </div>

                <div className="sc_cl_div col-12 d-flex flex-column">
                  <FormGroup>
                    <FormLabel className="sc_cl_input_label">
                      Comments
                    </FormLabel>
                    <FormControl
                      type="text"
                      name="comments"
                      value={ind_initiative && ind_initiative.comments}
                      onChange={InitiativeInputHandler}
                      className="sc_cl_input"
                      size="sm"
                    />
                  </FormGroup>
                  <span className="sc_cl_span red">{error && error.comments}</span>
                </div>
              </Form>
            </Col>
          </Modal.Body>

          <Modal.Footer>
            <FnBtnComponent
              onClick={validation_of_input}
              classname={"sc_cl_submit_button m-2"}
              children={"Submit"}
            />
          </Modal.Footer>
        </Modal>
      </>
    );
  };


  const handleClose = () => setModalShow(false);

  const fnSearchScorecard = async (e) => {
    let search = e.target.value;
    setTable_name_api_query(search)
    if (search !== "") {
      setisloading(true)
      // let filter_response = await fetch(
      //   `${process.env.REACT_APP_SERVER_URL}/api/scorecard_description/?search=${search}`,
      //   {
      //     method: "GET",
      //     headers: {
      //       "Content-Type": "application/json",
      //       Authorization: "Bearer " + String(authTokens.access),
      //     },
      //   }
      // );

      let filter_response = await fetch(
        `${process.env.REACT_APP_SERVER_URL}/api/get_scorecard_details_yet_kpi/${search}/`,
        {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
            Authorization: "Bearer " + String(authTokens.access),
          },
        }
      );

      let filter_data = await filter_response.json();
      // const temp = filter_data.filter((items) => {
      //   return items.scorecard_description === search;
      // });

      // const temp_id = temp.map((items) => {
      //   return items.id;
      // });

      // let cl_temp = scorecard.filter((items, idx) => {
      //   return items.id === temp_id[0];
      // });
      setShow(!getShow);
      setModalShow(false);
      setSmpData(filter_data);
      setTimeout(() => {
        setisloading(false);
      }, 800);
    } else {
      SetSearchError("Please select anyone")
      setSmpData([]);
    }
  };



  const search_refresh = () => {
    // {
    //   show ? setModalShow(false) : setModalShow(true);
    // }
    // if (getShow) {
    //   setSearch();
    //   setShow(false);
    // }
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
    fn_get_sc_details_business();
    // search_refresh();
    // setModalShow(!show);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const current = new Date();
  const current_date = `${current.getFullYear()}-${(current.getMonth()+1 >= 10) ? current.getMonth()+1 : '0'+String(current.getMonth()+1)}-${current.getDate()}`;

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
                  <h5 className="sc_cl_head m-0">KPI Report </h5>
                </div>
                <div className="align-items-center col-12 col-lg-6 d-flex justify-content-lg-end py-2 text-center">
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
                            search_scorecard.map((items, idx) => (
                              <option value={items.id} key={idx}>
                                {items.scorecard_description}
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

                  {getsmpdata && getsmpdata.length > 0 ? (
                    <>
                      {getsmpdata.map((items, index) => {
                        return (
                          <div className="d-flex flex-column justify-content-around list-unstyled mt-5 fs-14">
                            <Accordion>
                              <Card className="sc_cl_border_class rounded-1 table-bordered">
                                <Card.Body className="p-0 py-2">
                                  <ul className="sc_cl_grid_four_cell list-unstyled px-2 m-0">
                                    <li className="text-nowrap">
                                      {/* <span className="fw-light text-muted"> */}
                                      <span className="fw-bold">
                                        Scorecard: </span>
                                      {items.scorecard_description}
                                    </li>

                                    <li className="text-lg-end text-start">
                                      <span className="fw-bold">From Date: </span>
                                      {items.from_date.split("T")[0]}
                                    </li>

                                    <li className="text-lg-end text-start">
                                      <span className="fw-bold">To Date: </span>
                                      {items.to_date.split("T")[0]}
                                    </li>

                                    <li className="text-lg-end text-start">
                                      <span className="fw-bold">As of Date: </span>
                                      {current_date}
                                    </li>
                                    <li className="text-lg-end text-start">
                                      <span className="fw-bold">Score:  </span>
                                      <span style={{color: items.indicator}} className="fw-bold">{items.score}</span>
                                    </li>
                                  </ul>
                                </Card.Body>
                              </Card>
                            </Accordion>

                            <Table striped bordered responsive className="mt-2">
                              <thead>
                                <tr>
                                  <th>Prespective/Business Goal/ KPI
                                    <FnTooltipComponent
                                      label={helper.filter((user) => user.context_order === 1)
                                        .map((use) => use.label)}
                                      context={helper.filter((user) => user.context_order === 1)
                                        .map((use) => use.help_context)}
                                      classname={""}
                                      placement="bottom"
                                    />
                                  </th>
                                  <th>Weight
                                    <FnTooltipComponent
                                      label={helper.filter((user) => user.context_order === 2)
                                        .map((use) => use.label)}
                                      context={helper.filter((user) => user.context_order === 2)
                                        .map((use) => use.help_context)}
                                      classname={""}
                                      placement="bottom"
                                    />
                                  </th>
                                  <th>Score
                                    <FnTooltipComponent
                                      label={helper.filter((user) => user.context_order === 3)
                                        .map((use) => use.label)}
                                      context={helper.filter((user) => user.context_order === 3)
                                        .map((use) => use.help_context)}
                                      classname={""}
                                      placement="bottom"
                                    />
                                  </th>
                                </tr>
                              </thead>
                              <tbody className="bg-white">
                                {
                                  items.scorecard_details.length > 0 ? (
                                    <PerspectiveComp prep_data={items.scorecard_details} />
                                  ) : (
                                    ""
                                  )
                                }
                              </tbody>
                            </Table>
                          </div>
                        );
                      })}
                    </>
                  ) :
                    (
                      <></>
                    )}
                  {getToastMessage.map((message, index) => (
                    <FnToastMessageComp key={index} message={message} duration={3000} Header={"KPI's"} />

                  ))
                  }
                </Card.Body>
              </Card>
            </div>
          )}
        </>
      }
    </>
  );
};

export default Fn_Kpi_Dashboard;