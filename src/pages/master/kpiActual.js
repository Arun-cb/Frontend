import React, { useState, useEffect, useContext } from "react";
import "bootstrap/dist/css/bootstrap.min.css";
import PreContext from "../../context/PreContext";
import DatePicker from "react-datepicker";
import moment from "moment";
import AuthContext from "../../context/AuthContext";
import { Form, FormGroup, Row, Col, FormControl, Table, Modal } from "react-bootstrap";
import FnBtnComponent from "../../components/buttonComponent";
import { MdDelete } from "react-icons/md";
import { AiFillPlusCircle } from "react-icons/ai";
import FnBreadCrumbComponent from "../../components/breadCrumbComponent";
import Swal from "sweetalert2";
import { useNavigate } from "react-router-dom";
import { BiMessageRoundedError } from "react-icons/bi";

const FnKpiActual = () => {
  let { userSettings } = useContext(PreContext);
  const navigator = useNavigate();
  let { kpiId, navigateact, setNavigateAct } = useContext(AuthContext);
  const [showgroup, setShowGroup] = useState(false);
  const [getkpidetails, setKpiDettails] = useState([]);
  const [getscorecard, setScoreCard] = useState([]);
  const [getperspective, setPerspective] = useState([]);
  const [getbusinessobj, setBusinessObj] = useState([]);
  let { authTokens, user } = useContext(AuthContext);
  const [add, setAdd] = useState(false);
  const [view, setView] = useState();
  const [edit, setEdit] = useState(false);
  const [, setRemove] = useState(false);
  const [visibleadd, setVisibleadd] = useState(false);
  const [error, setError] = useState({});
  const [getkpiactual, setKpiActual] = useState([]);
  const [shownbtn, setShowBtn] = useState(false);
  const [getsamp, setSamp] = useState({
    created_by: user.user_id,
    last_updated_by: user.user_id,
    scorecard_id: "",
    perspective_id: "",
    objective_id: "",
    kpi_id: "",
  });
  const [kpiuser, setKpiUsers] = useState([]);
  const [test, setTest] = useState(false);
  const [count, setCount] = useState(0);

  let found = getkpidetails.find(function (element) {
    return element.id === Number(getsamp.kpi_id);
  });

  let key =
    found && found.measure === "Boolean"
      ? "actuals_boolean"
      : found && found.measure === "Date"
      ? "actuals_date"
      : "actuals";

  let scData = getscorecard.find(function (ele) {
    return ele.id === Number(getsamp.scorecard_id);
  });

  let breadcumb_menu = [
    { Label: "Home", Link: "/" },

    {
      Label: "KPI Actuals",
    },
  ];

  async function get_scorecard() {
    const get_scorecard_request = await fetch(
      `${process.env.REACT_APP_SERVER_URL}/api/get_published_scorecard`,
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
      setScoreCard(get_scorecard_data);
    }
  }

  async function get_prespective(id) {
    const get_prespective_request = await fetch(
      `${process.env.REACT_APP_SERVER_URL}/api/get_perspectives/${id}/`,
      {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          Authorization: "Bearer " + String(authTokens.access),
        },
      }
    );

    let get_prespective_data = await get_prespective_request.json();
    if (get_prespective_request.status === 200) {
      const newData = get_prespective_data
        .map((e) => ({
          id: e.id,
          perspective_code: e.perspective_id.perspective_code,
          perspective_name: e.perspective_id.description,
        }))
        .flat();

      setPerspective(newData);
    }
  }

  async function get_business_obj(sid, pid) {
    const get_business_obj_request = await fetch(
      `${process.env.REACT_APP_SERVER_URL}/api/get_bussniess_goal_objective/${sid}/${pid}/`,
      {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          Authorization: "Bearer " + String(authTokens.access),
        },
      }
    );

    let get_business_obj_data = await get_business_obj_request.json();

    if (get_business_obj_request.status === 200) {
      setBusinessObj(get_business_obj_data);
    }
  }

  async function get_kpi_details(sid, pid, oid) {
    const get_kpi_details_request = await fetch(
      `${process.env.REACT_APP_SERVER_URL}/api/get_kpi_details/${sid}/${pid}/${oid}/`,
      {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          Authorization: "Bearer " + String(authTokens.access),
        },
      }
    );

    let get_kpi_details_data = await get_kpi_details_request.json();

    if (get_kpi_details_request.status === 200) {
      let kpi_data = [];
      kpiuser.map((i) => {
        get_kpi_details_data.map((items) => {
          if (i.kpi_id === items.id && i.user_id === user.user_id) {
            kpi_data.push(items);
          }
        });
        var distinctSet = new Set(kpi_data);
        var distinctList = [...distinctSet];
        setKpiDettails(distinctList);
      });
    }
  }

  async function get_kpi_user() {
    let kpiuser = await fetch(
      `${process.env.REACT_APP_SERVER_URL}/api/get_kpi_user_access`,
      {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          Authorization: "Bearer " + String(authTokens.access),
        },
      }
    );

    let KpiUserdata = await kpiuser.json();

    // const getByIndicators = KpiUserdata.filter((kpiItems) => kpiItems.kpi_id === Number(getsamp.kpi_id))

    setKpiUsers(KpiUserdata);
  }

  const FormValidation = () => {
    Object.keys(getsamp).forEach((data, i) => {
      if (getsamp.kpi_id === "") {
        setError({ ...error, kpi_id: "Please select anyone..." });
      }
      if (getsamp.objective_id === "") {
        setError({ ...error, objective_id: "Please select anyone..." });
      }
      if (getsamp.perspective_id === "") {
        setError({ ...error, perspective_id: "Please select anyone..." });
      }
      if (getsamp.scorecard_id === "") {
        setError({ ...error, scorecard_id: "Please select anyone..." });
      }
    });
  };

  const fn_prev_date = (frequency) => {
    const PrevDate = new Date();
    if (frequency === "Daily") {
      PrevDate.setDate(PrevDate.getDate() - 1);
    }
    // weekly
    else if (frequency === "Weekly") {
      // const genWeek = new Date(specifiedDate.getTime() + 86400000);

      PrevDate.setDate(PrevDate.getDate() - 7);
    }
    // Fortnigtly
    else if (frequency === "Fortnightly") {
      PrevDate.setDate(PrevDate.getDate() - 14);
    }
    // Montly
    else if (frequency === "Monthly") {
      PrevDate.setMonth(PrevDate.getMonth() - 1);
    }
    // Quaterly
    else if (frequency === "Quaterly") {
      PrevDate.setMonth(PrevDate.getMonth() - 3);
    }
    // Half Yearly
    else if (frequency === "Half-yearly") {
      // calculate the start and end dates of the half-year

      PrevDate.setMonth(PrevDate.getMonth() - 6);
    }
    // Annualy
    else if (frequency === "Annualy") {
      // calculate the start and end dates of the year

      PrevDate.setFullYear(PrevDate.getFullYear() - 1);
    }
    return PrevDate;
  };

  const fn_isEditable = (specificDate, frequency) => {
    // let gendate = fn_periodCalculation(specifiedDate, frequency);
    const specifiedDate = new Date(specificDate);
    let retuner = true;
    kpiuser.map((i) => {
      if (
        i.kpi_id === found.id &&
        i.user_id === user.user_id &&
        i.kpi_owner === "Y"
      ) {
        retuner = false;
      }
    });

    let PrevDate = fn_prev_date(frequency);
    if (frequency === "Daily") {
      if (
        specifiedDate.getFullYear() <= PrevDate.getFullYear()
          ? specifiedDate.getMonth() === PrevDate.getMonth()
            ? specifiedDate.getDate() < PrevDate.getDate()
            : true
          : false
      ) {
        return retuner;
      } else {
        return false;
      }
    }
    // weekly
    else if (frequency === "Weekly") {
      const dayOfWeek = specifiedDate.getDay() - 7;
      const startDate = new Date(specifiedDate);
      startDate.setDate(specifiedDate.getDate() - dayOfWeek);
      const endDate = new Date(specifiedDate);
      const currDate = new Date();
      endDate.setDate(specifiedDate.getDate() + (6 - dayOfWeek));
      if (
        specifiedDate.getFullYear() <= PrevDate.getFullYear()
          ? specifiedDate.getMonth() <= PrevDate.getMonth()
            ? !(startDate <= currDate && endDate >= currDate)
            : false
          : false
      ) {
        return retuner;
      } else {
        return false;
      }
    }
    // Fortnigtly
    else if (frequency === "Fortnightly") {
      const dayOfWeek = specifiedDate.getDay();
      const startDate = new Date(specifiedDate);
      startDate.setDate(specifiedDate.getDate() - dayOfWeek);
      const endDate = new Date(specifiedDate);
      endDate.setDate(specifiedDate.getDate() + (6 - dayOfWeek) + 7);
      if (
        specifiedDate.getFullYear() <= PrevDate.getFullYear()
          ? specifiedDate.getMonth() <= PrevDate.getMonth()
            ? !(startDate <= PrevDate && endDate >= PrevDate)
            : false
          : false
      ) {
        return retuner;
      } else {
        return false;
      }
    }
    // Montly
    else if (frequency === "Monthly") {
      if (
        specifiedDate.getFullYear() <= PrevDate.getFullYear()
          ? specifiedDate.getMonth() < PrevDate.getMonth()
          : false
      ) {
        return retuner;
      } else {
        return false;
      }
    }
    // Quaterly
    else if (frequency === "Quaterly") {
      const month = specifiedDate.getMonth();
      const quarterStartMonth = Math.floor(month / 3) * 3;
      const startDate = new Date(
        specifiedDate.getFullYear(),
        quarterStartMonth,
        1
      );
      const endDate = new Date(
        specifiedDate.getFullYear(),
        quarterStartMonth + 2,
        31
      );
      if (
        specifiedDate.getFullYear() <= PrevDate.getFullYear()
          ? !(startDate <= PrevDate && endDate >= PrevDate)
          : false
      ) {
        return retuner;
      } else {
        return false;
      }
    }
    // Half Yearly
    else if (frequency === "Half-yearly") {
      // calculate the start and end dates of the half-year
      const month = specifiedDate.getMonth();
      const startDate = new Date(
        specifiedDate.getFullYear(),
        month < 6 ? 0 : 6,
        1
      );
      const endDate = new Date(
        specifiedDate.getFullYear(),
        month < 6 ? 5 : 11,
        31
      );

      if (
        specifiedDate.getFullYear() <= PrevDate.getFullYear()
          ? !(startDate <= PrevDate && endDate >= PrevDate)
          : false
      ) {
        return retuner;
      } else {
        // kpiuser.map((i)=>{
        //   if (i.user_id === user.user_id){
        //     retuner = false
        //   }
        // })
        return false;
      }
    }
    // Annualy
    else if (frequency === "Annualy") {
      // calculate the start and end dates of the year
      if (specifiedDate.getFullYear() < PrevDate.getFullYear()) {
        return retuner;
      } else {
        // kpiuser.map((i)=>{
        //   if (i.user_id === user.user_id){
        //     retuner = false
        //   }
        // })
        return false;
      }
    }
    // return true
  };

  async function get_samp_ids() {
    let samp = getsamp;
    const get_samp_request = await fetch(
      `${process.env.REACT_APP_SERVER_URL}/api/smp_get_kpi/${
        samp.kpi_id ? samp.kpi_id : 0
      }/${samp.scorecard_id ? samp.scorecard_id : 0}/${
        samp.perspective_id ? samp.perspective_id : 0
      }/${samp.objective_id ? samp.objective_id : 0}`,
      {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          Authorization: "Bearer " + String(authTokens.access),
        },
      }
    );

    let get_samp_data = await get_samp_request.json();
    if (get_samp_request.status === 200) {
      setShowBtn(true);
      setShowGroup(true);
      let kpiactuals = get_samp_data.map((items) => {
        let editable = fn_isEditable(items.period, found && found.frequency);

        return {
          ...items,
          isEditable: editable,
        };
      });
      setKpiActual(kpiactuals);
    }
  }

  async function get_kpi_details_kid() {
    const get_kpi_request = await fetch(
      `${process.env.REACT_APP_SERVER_URL}/api/get_kpi_details_Kid/${
        navigateact ? kpiId : 0
      }`,
      {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          Authorization: "Bearer " + String(authTokens.access),
        },
      }
    );

    let get_kpi_details_kid = await get_kpi_request.json();
    if (get_kpi_request.status === 200) {
      get_prespective(get_kpi_details_kid[0].scorecard_id);
      get_business_obj(
        get_kpi_details_kid[0].scorecard_id,
        get_kpi_details_kid[0].scorecard_details_id
      );
      get_kpi_details(
        get_kpi_details_kid[0].scorecard_id,
        get_kpi_details_kid[0].scorecard_details_id,
        get_kpi_details_kid[0].objective_id
      );
      setSamp({
        ...getsamp,
        scorecard_id: get_kpi_details_kid[0].scorecard_id,
        perspective_id: get_kpi_details_kid[0].scorecard_details_id,
        objective_id: get_kpi_details_kid[0].objective_id,
        kpi_id: kpiId,
      });
      setTest(true);
      // setNavigateAct(false)
    }
  }

  async function filter_kpi_actuals() {
    FormValidation();
    if (
      getsamp.scorecard_id !== "" &&
      getsamp.perspective_id !== "" &&
      getsamp.objective_id !== "" &&
      getsamp.kpi_id !== ""
    ) {
      get_samp_ids();
      setVisibleadd(true);
      if (count === 2) {
        setNavigateAct(false);
      } else {
        setCount(count + 1);
      }
    } else {
      setKpiActual("");
      setVisibleadd(false);
    }
  }

  async function clear_kpi() {
    setSamp({
      created_by: user.user_id,
      last_updated_by: user.user_id,
      scorecard_id: "",
      perspective_id: "",
      objective_id: "",
      kpi_id: "",
    });
    setKpiActual([]);
    setKpiDettails([]);
    setPerspective([]);
    setBusinessObj([]);
    setVisibleadd(false);
  }

  async function add_kpi_actuals() {
    let temp_var = [...getkpiactual];
    getkpiactual.forEach((items_samp, idx) => {
      Object.keys(getsamp).forEach((temp1, idx1) => {
        temp_var[idx][Object.keys(getsamp)[idx1]] =
          Object.values(getsamp)[idx1];
      });
    });
    let samp = Object.assign({}, ...temp_var);
    const add_kpi_actual_request = await fetch(
      `${process.env.REACT_APP_SERVER_URL}/api/upd_kpi_actuals/${samp.scorecard_id}/`,
      {
        method: "PUT",
        body: JSON.stringify(temp_var),
        headers: {
          "Content-Type": "application/json",
          Authorization: "Bearer " + String(authTokens.access),
        },
      }
    );

    if (add_kpi_actual_request.status === 200) {
      Swal.fire({
        icon: "success",
        text: "Actuals Updated Successfuly",
      }).then(function () {});
    } else {
      alert("Not done").then(function () {});
    }
  }

  // Can add dynamic feilds and calculate period
  const addkpifelds = () => {
    setShowGroup(true);
    
    let period =
      getkpiactual[getkpiactual.length - 1] &&
      getkpiactual[getkpiactual.length - 1].period !== ""
        ? fn_periodCalculation(
            getkpiactual[getkpiactual.length - 1].period,
            found && found.frequency
          )
        : found && found.period_type === 'Beginning' ? 
        moment(scData && scData.from_date, 'YYYY-MM-DD').startOf('month').format() :
        moment(scData && scData.from_date, 'YYYY-MM-DD').endOf('month').format();
    

    
    if(moment(scData.to_date).format("YYYY-MM-DD") > moment(period).format("YYYY-MM-DD")){
      var useFlag = getkpiactual.find(function (element) {
        return element.period === moment(period).format("YYYY-MM-DD");
      });
  
      const date = fn_prev_date(found && found.frequency);
  
      if (
        (useFlag && useFlag[key] === null) ||
        (getkpiactual[getkpiactual.length - 1] &&
          getkpiactual[getkpiactual.length - 1][key] === null)
      ) {
        Swal.fire({
          icon: "warning",
          text: "Add previous Actuals",
        });
      } else if (period > date) {
        Swal.fire({
          icon: "warning",
          text: "Current period does not completed",
        });
        // alert("Current period does not completed");
      }else if(getkpiactual[getkpiactual.length - 1] &&
        getkpiactual[getkpiactual.length - 1][key] === null){

      }else {
        setKpiActual([
          ...getkpiactual,
          {
            actuals_date: null,
            actuals_boolean: null,
            actuals: null,
            summery: null,
            period: moment(period).format("YYYY-MM-DD"),
          },
        ]);
      }
    }else{
      Swal.fire({
        icon: "warning",
        text: "Actual date exceed to todate.",
      });
    }
  };

  // get a permission for a user group
  const fn_get_permissions = async () => {
    let res = await fetch(
      `${process.env.REACT_APP_SERVER_URL}/api/join_user_group_access/${user.user_id}/5/`,
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
        setRemove(pdata[0].delete === "Y" ? true : false);
        setEdit(pdata[0].edit === "Y" ? true : false);
        setAdd(pdata[0].add === "Y" ? true : false);
        setView(pdata[0].view === "Y" ? true : false);
      }
    }
  };

  let IdHandler = (e) => {
    if (e.target.name === "scorecard_id") {
      setSamp({
        ...getsamp,
        [e.target.name]: e.target.value,
        perspective_id: "",
        objective_id: "",
        kpi_id: "",
      });
      setBusinessObj([]);
      setKpiDettails([]);
    } else if (e.target.name === "perspective_id") {
      setSamp({
        ...getsamp,
        [e.target.name]: e.target.value,
        objective_id: "",
        kpi_id: "",
      });
      setBusinessObj([]);
      setKpiDettails([]);
    } else if (e.target.name === "objective_id") {
      setSamp({ ...getsamp, [e.target.name]: e.target.value, kpi_id: "" });
      setKpiDettails([]);
    } else {
      setSamp({ ...getsamp, [e.target.name]: e.target.value });
    }
    setKpiActual([]);
    setVisibleadd(false);
    setError({ ...error, [e.target.name]: "" });
  };

  let InputHandler = (evt, idx) => {
    let samp_actual = [...getkpiactual];
    samp_actual[idx][evt.target.name] = evt.target.value;
    setKpiActual(samp_actual);
  };

  let fnNavigateActuals = () => {
    get_kpi_details_kid();
  };

  useEffect(() => {
    get_scorecard();
    fn_get_permissions();
    get_kpi_user();
    if (navigateact === true) {
      fnNavigateActuals();
    }
    if (test) {
      filter_kpi_actuals();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [getsamp, kpiId, navigateact]);

  const DateHandler = (e, idx) => {
    let samp_actual = [...getkpiactual];

    samp_actual[idx][e.target.name] = moment(e.target.value).format(
      "YYYY-MM-DD"
    );

    setKpiActual(samp_actual);
  };

  const formatTime = (time, name) => {
    let d = moment(time, "DD-MM-YYYY", true);
    if (d.isValid()) {
      let temp = d.format("MM-DD-yyyy");
      let date = new Date(temp);
      return date;
    } else {
      let temp = moment(time).format("MM-DD-yyyy");
      let date = new Date(temp);
      return date;
    }
  };

  const fn_remove_actuals = () => {
    let last_index = getkpiactual.length - 1;
    let temp = getkpiactual.slice(0, last_index);

    setKpiActual(temp);
  };

  // period calculation
  const fn_periodCalculation = (data, frequency) => {
    const specifiedDate = new Date(data);
    let period;
    // Daily
    if (frequency === "Daily") {
      const generatedDate = new Date(specifiedDate.getTime() + 86400000);
      period = generatedDate;
    }
    // weekly
    else if (frequency === "Weekly") {
      // const genWeek = new Date(specifiedDate.getTime() + 86400000);
      const dayOfWeek = specifiedDate.getDay() - 7;
      const startDate = new Date(specifiedDate);
      startDate.setDate(specifiedDate.getDate() - dayOfWeek);
      const endDate = new Date(specifiedDate);
      endDate.setDate(specifiedDate.getDate() + (6 - dayOfWeek));
      period = found.period_type === "Beginning" ? startDate : endDate;
    }
    // Fortnigtly
    else if (frequency === "Fortnightly") {
      const dayOfWeek = specifiedDate.getDay();
      const startDate = new Date(specifiedDate);
      startDate.setDate(specifiedDate.getDate() - dayOfWeek);
      const endDate = new Date(specifiedDate);
      endDate.setDate(specifiedDate.getDate() + (6 - dayOfWeek) + 7);
      // log the start and end dates of the fortnight

      period = found.period_type === "Beginning" ? startDate : endDate;
    }
    // Montly
    else if (frequency === "Monthly") {
      const year = specifiedDate.getFullYear();
      const month = specifiedDate.getMonth() + 1;
      const startDate = new Date(year, month, 1);
      const endDate = new Date(year, month + 1, 0);

      period = found.period_type === "Beginning" ? startDate : endDate;
    }
    // Quaterly
    else if (frequency === "Quarterly") {
      period = found.period_type === "Beginning" ? 
                moment(data, 'YYYY-MM-DD').add(3, 'months').startOf('month').format() :
                moment(data, 'YYYY-MM-DD').add(3, 'months').endOf('month').format();

    }
    // Half Yearly
    else if (frequency === "Half-yearly") {
      period = found.period_type === "Beginning" ? 
                moment(data, 'YYYY-MM-DD').add(6, 'months').startOf('month').format() :
                moment(data, 'YYYY-MM-DD').add(6, 'months').endOf('month').format();
    }
    // Annualy
    else if (frequency === "Annualy") {
      period = found.period_type === "Beginning" ? 
                moment(data, 'YYYY-MM-DD').add(12, 'months').startOf('month').format() :
                moment(data, 'YYYY-MM-DD').add(12, 'months').endOf('month').format();
    }

    return period;
  };

  return (
    <>
    {view === undefined ?
    '' 
  :<>
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
      ) :  (
    <div className="sc_cl_div w-100 px-2">
      <div className="d-flex flex-column flex-lg-row sc_cl_row sc_cl_page_header">
        <div className="align-items-center col-12 col-lg-6 d-flex py-2 text-center">
          <h5 className="sc_cl_head m-0">KPI Actuals</h5>
        </div>

        <div className="align-items-center col-12 col-lg-6 d-flex justify-content-lg-end py-2 text-center">
          <FnBreadCrumbComponent
            seperator_symbol={" >"}
            nav_items={breadcumb_menu}
          />
        </div>
      </div>

      {/* <hr></hr> */}

      <Row className="mt-lg-2 sc-cl-main-content">
        <div className="sc_cl_div col-lg-12 d-flex flex-column flex-lg-row flex-sm-column justify-content-between">
          <div className="sc_cl_div col-12 col-lg-3 d-flex flex-column">
            <label className="sc_cl_label h6">
              Scorecard <sup className="text-danger">*</sup>
            </label>
            <select
              className=" form-select"
              size="sm"
              value={getsamp.scorecard_id}
              onChange={(e) => {
                IdHandler(e);
                get_prespective(e.target.value);
              }}
              name="scorecard_id"
            >
              <option hidden>Select an Option</option>
              {getscorecard.length !== 0 ? (
                getscorecard.map((scorecard_items, idx) => (
                  <option value={scorecard_items.id} key={idx}>
                    {scorecard_items.scorecard_description}
                  </option>
                ))
              ) : (
                <option disabled>Scorecard not available</option>
              )}
            </select>
            <span className="red">{error && error.scorecard_id}</span>
          </div>

          <div className="sc_cl_div col-12 col-lg-3 d-flex flex-column">
            <label className="sc_cl_label h6">
              Perspective <sup className="text-danger">*</sup>
            </label>
            <select
              className=" form-select w-100"
              size="sm"
              value={getsamp.perspective_id}
              onChange={(e) => {
                IdHandler(e);
                get_business_obj(getsamp.scorecard_id, e.target.value);
              }}
              name="perspective_id"
            >
              <option className="sc_cl_option" hidden>
                Select an Option
              </option>
              {getperspective.length !== 0 ? (
                getperspective.map((preps_items, idx) => {
                  return (
                    <option
                      className="sc_cl_option"
                      value={preps_items.id || ""}
                      key={idx}
                    >
                      {preps_items.perspective_name}
                    </option>
                  );
                })
              ) : (
                <option className="sc_cl_option" disabled>
                  Prespective not available
                </option>
              )}
            </select>
            <span className="red">{error && error.perspective_id}</span>
          </div>

          <div className="sc_cl_div col-12 col-lg-3 d-flex flex-column">
            <label className="sc_cl_label h6">
              Objective <sup className="text-danger">*</sup>
            </label>
            <select
              className=" form-select"
              size="sm"
              value={getsamp.objective_id}
              onChange={(e) => {
                IdHandler(e);
                get_kpi_details(
                  getsamp.scorecard_id,
                  getsamp.perspective_id,
                  e.target.value
                );
              }}
              name="objective_id"
            >
              <option className="sc_cl_option" hidden>
                Select an Option
              </option>
              {getbusinessobj.length !== 0 ? (
                getbusinessobj.map((business_obj_items, idx) => {
                  return (
                    <option
                      className="sc_cl_option"
                      value={business_obj_items.id}
                      key={idx}
                    >
                      {business_obj_items.objective_description}
                    </option>
                  );
                })
              ) : (
                <option className="sc_cl_option" disabled>
                  Objective not available
                </option>
              )}
            </select>
            <span className="red">{error && error.objective_id}</span>
          </div>

          <div className="sc_cl_div col-12 col-lg-3 d-flex flex-column">
            <label className="sc_cl_label h6">
              KPI <sup className="text-danger">*</sup>
            </label>
            <select
              className=" form-select w-100"
              size="sm"
              value={getsamp.kpi_id}
              onChange={IdHandler}
              name="kpi_id"
            >
              <option hidden>Select an Option</option>
              {getkpidetails.length !== 0 ? (
                getkpidetails.map((kpi_items, idx) => {
                  return (
                    <option value={kpi_items.id || ""} key={idx}>
                      {kpi_items.kpi}
                    </option>
                  );
                })
              ) : (
                <option disabled>KPI not available</option>
              )}
            </select>
            <span className="red">{error && error.kpi_id}</span>
          </div>
        </div>

        <div className="sc_cl_div align-items-center d-flex justify-content-evenly mt-4 w-auto">
          <FnBtnComponent
            onClick={() => filter_kpi_actuals()}
            classname={"sc_cl_submit_button"}
            children={"Filter"}
          />

          <FnBtnComponent
            onClick={() => clear_kpi()}
            classname={"sc_cl_close_button ms-2"}
            children={"Clear"}
          />
        </div>
      </Row>

      <Row className="col-lg-12 d-flex mt-2 ms-0">
      {getkpiactual.length > 0 ? (
        <div className="p-0">
          <Table
            className="d-flex flex-column col-lg-12"
            striped
            bordered
            responsive
          >
            <thead className="table_thead col-lg-12">
              <tr className="d-flex col-lg-12 table_tr">
                <th className="col-lg-3">
                  Period <sup className="text-danger">*</sup>
                </th>
                <th className="col-lg-3">
                  Actuals <sup className="text-danger">*</sup>
                </th>
                <th className="col-lg-6">Comments</th>
                {/* <th className="col-lg-1 border-0"></th> */}
              </tr>
            </thead>
            <tbody>
              
                <>
                  {getkpiactual.map((kpi_actual_items, idx) => {
                    return showgroup ? (
                      <tr key={idx} className="table_tr d-flex col-lg-12">
                        <td className="table_td col-lg-3">
                          <Form>
                            <FormGroup>
                              <DatePicker
                                className=" form-control m-0"
                                placeholderText={
                                  userSettings && userSettings.date
                                    ? userSettings.date
                                    : process.env.REACT_APP_DATE_FORMAT
                                }
                                name="period"
                                selected={
                                  kpi_actual_items.period !== ""
                                    ? typeof kpi_actual_items.period ===
                                      "string"
                                      ? formatTime(
                                          kpi_actual_items.period,
                                          "period"
                                        )
                                      : kpi_actual_items.period
                                    : ""
                                }
                                onChange={(e) =>
                                  DateHandler(
                                    {
                                      target: {
                                        name: "period",
                                        value: e,
                                      },
                                    },
                                    idx
                                  )
                                }
                                dateFormat={
                                  userSettings && userSettings.date
                                    ? userSettings.date.replace("Do", "do")
                                    : process.env.REACT_APP_DATE_FORMAT.replace(
                                        "DD",
                                        "dd"
                                      ).replace("YYYY", "yyyy")
                                }
                                disabled
                              />
                              {/* <span>{kpi_actual_items.period || ""}</span> */}
                              {/* {periodCalculation(!kpi_actual_items.period)} */}
                            </FormGroup>
                          </Form>
                        </td>

                        <td className="table_td col-lg-3">
                          <Form>
                            <FormGroup>
                              {found && found.measure === "Date" ? (
                                <DatePicker
                                  className="form-control m-0"
                                  placeholderText={
                                    userSettings && userSettings.date
                                      ? userSettings.date
                                      : process.env.REACT_APP_DATE_FORMAT
                                  }
                                  name="actuals_date"
                                  selected={
                                    kpi_actual_items.actuals_date !== ""
                                      ? typeof kpi_actual_items.actuals_date ===
                                        "string"
                                        ? formatTime(
                                            kpi_actual_items.actuals_date,
                                            "actuals_date"
                                          )
                                        : kpi_actual_items.actuals_date
                                      : ""
                                  }
                                  onChange={(e) =>
                                    DateHandler(
                                      {
                                        target: {
                                          name: "actuals_date",
                                          value: e,
                                        },
                                      },
                                      idx
                                    )
                                  }
                                  dateFormat={
                                    userSettings && userSettings.date
                                      ? userSettings.date.replace("Do", "do")
                                      : process.env.REACT_APP_DATE_FORMAT.replace(
                                          "DD",
                                          "dd"
                                        ).replace("YYYY", "yyyy")
                                  }
                                  keyboard={false}
                                  disabled={kpi_actual_items.isEditable}
                                />
                              ) : found && found.measure === "Boolean" ? (
                                <Form.Select
                                  onChange={(e) => InputHandler(e, idx)}
                                  className="m-0"
                                  name="actuals_boolean"
                                  disabled={kpi_actual_items.isEditable}
                                  value={kpi_actual_items.actuals_boolean}
                                >
                                  <option hidden>Select a value</option>
                                  <option value={true}>YES</option>
                                  <option value={false}>NO</option>
                                </Form.Select>
                              ) : (
                                <Form.Control
                                  type="number"
                                  placeholder="e.g. 123, 1234,..."
                                  onChange={(e) => InputHandler(e, idx)}
                                  className="m-0"
                                  name="actuals"
                                  disabled={kpi_actual_items.isEditable}
                                  value={kpi_actual_items.actuals || kpi_actual_items.actuals === 0 ? kpi_actual_items.actuals : ""}
                                />
                              )}
                            </FormGroup>
                          </Form>
                        </td>

                        <td className="table_td col-lg-6">
                          <Form>
                            <FormGroup>
                              <FormControl
                                className="m-0"
                                onChange={(e) => InputHandler(e, idx)}
                                name="summery"
                                value={kpi_actual_items.summery}
                                disabled={kpi_actual_items.isEditable}
                              />
                            </FormGroup>
                          </Form>
                        </td>
                      </tr>
                    ) : (
                      ""
                    );
                  })}
                </>
              
            </tbody>
          </Table>
        </div>
        ) : (
          ''
        )}

        {add && visibleadd ? (
          <div className="align-items-center flex-column justify-content-end p-0 text-success">
            <div>
              <AiFillPlusCircle
                className="sc_cl_addRowIcon"
                onClick={addkpifelds}
              />
              {getkpiactual[getkpiactual.length - 1] &&
              (getkpiactual[getkpiactual.length - 1][key] === null ||
                getkpiactual[getkpiactual.length - 1][key] === "") ? (
                <MdDelete
                  className="sc_cl_addRowIcon text-danger"
                  onClick={fn_remove_actuals}
                />
              ) : (
                <></>
              )}
            </div>
          </div>
        ) : (
          ""
        )}
      </Row>

      <Row className="mt-2">
        <Col className="align-items-center d-flex justify-content-between ">
          {shownbtn ? (
            <div className="d-flex">
              {getkpiactual.length > 0 && edit ? (
                <div>
                  <FnBtnComponent
                    children={"Update"}
                    classname={"sc_cl_submit_button"}
                    onClick={add_kpi_actuals}
                  />
                </div>
              ) : (
                ""
              )}
            </div>
          ) : (
            ""
          )}
          {/* <button className="px-4 py-2 rounded-2 shadow text-white sc_cl_kpi_actual_update_btn">Update</button> */}
        </Col>
      </Row>
    </div>
    )}
    </>
}
  </>
  );
};

export default FnKpiActual;
