import React, {
  useState,
  useContext,
  useEffect,
  useRef,
  forwardRef,
} from "react";
import { useNavigate, useParams } from "react-router-dom";
import AuthContext from "../../context/AuthContext";
import {
  Row,
  Col,
  Accordion,
  Form,
  FormGroup,
  Card,
  Modal,
  FormLabel,
} from "react-bootstrap";
import "../../Assets/CSS/preloader.css";
import PreContext from "../../context/PreContext";
import { AiFillPlusCircle, AiFillMinusCircle } from "react-icons/ai";
import { MdDelete } from "react-icons/md";
import { RiEdit2Fill, RiAddCircleFill } from "react-icons/ri";
import { FcExpand, FcCollapse } from "react-icons/fc";
import FnBtnComponent from "../../components/buttonComponent";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import { IoCopy } from "react-icons/io5";
import moment from "moment";
import Swal from "sweetalert2";
import Select from "react-select";
import FnBreadCrumbComponent from "../../components/breadCrumbComponent";
import FnTooltipComponent from "../../components/tooltipComponent";
import { BiMessageRoundedError } from "react-icons/bi";
import { te } from "date-fns/locale";
import FnSelectComponent from "../../components/selectComponent";

const FnScorecardReport = () => {
  let { authTokens, user } = useContext(AuthContext);
  let { userSettings, isloading, setisloading } = useContext(PreContext);
  const { id } = useParams();
  const history = useNavigate();

  // Main Root State
  const [getsmpdata, setSmpData] = useState([]);


  const [isEditing, setIsEditing] = useState(false);
  const [isAdd, setIsAdd] = useState(false);
  const [adatalength, setAdatalength] = useState(0);
  const [scorecard, setScoreCard] = useState([]);
  const [getShow, setShow] = useState(false);
  const [hierarchyleveldata, SetHierarchyLevelData] = useState([]);
  const [odata, setOdata] = useState([]);
  const persRef = useRef(null);
  const [table_name_api_query, setTable_name_api_query] = useState("");
  const [Expand, setExpand] = useState(false);
  const [startingIndex, setStartingindex] = useState(0);
  const PageSize =
    userSettings && userSettings.pagination
      ? userSettings.pagination
      : process.env.REACT_APP_PAGINATION;
  const endingIndex = startingIndex + Number(PageSize);
  const [search_scorecard, setSearchScoreCard] = useState([]);
  const [error, setError] = useState({ ScDetails: [] });
  const [options, setOptions] = useState([]);
  const [buserror, setBusError] = useState([]);
  const [kpiError, setKpiError] = useState([]);
  const [slierror, setslierror] = useState([]);
  const [alluser, setAlluser] = useState([]);
  const [ScError, SetScError] = useState([]);
  const [searchError, SetSearchError] = useState();
  const [refresh, setRefresh] = useState(false);
  const [add, setAdd] = useState(false);
  const [view, setView] = useState();
  const [publish, setPblish] = useState(false);

  const [warnings, setWarnings] = useState([]);
  const [configdata, setConfigdata] = useState([]);
  const [helper, setHelper] = useState([]);
  // let val_error = {};

  let breadcumb_menu = [
    { Label: "Home", Link: "/" },

    {
      Label: "Scorecard Details",
    },
  ];

  const help = helper
    .filter((user) => String(user.page_no).includes(String(id)))
    .map((use) => use);

  const fnGetConfigCodesDetails = async () => {
    let res = await fetch(
      `${process.env.REACT_APP_SERVER_URL}/api/get_range_config_codes/${startingIndex}/${endingIndex}`,
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
      if (data.data_length > 0) {
        setConfigdata(data.csv_data);
      } else {
        console.log("config_code api error");
      }
    }
  };

  const fnGetWarnings = async () => {
    let res_warnings = await fetch(
      `${process.env.REACT_APP_SERVER_URL}/api/get_warnings`,
      {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          Authorization: "Bearer " + String(authTokens.access),
        },
      }
    );

    let warning_data = await res_warnings.json();
    if (res_warnings.status === 200) {
      if (warning_data) {
        setWarnings(warning_data);
      }
    }
  };

  let null_error_msg = warnings
    .filter(
      (items, index) =>
        items.error_code.includes("null") && items.error_from.includes("Client")
    )
    .map((data) => data.error_msg);

  let from_date_error_msg = warnings
    .filter(
      (items, index) =>
        items.error_code.includes("invalid from date") &&
        items.error_from.includes("Client")
    )
    .map((data) => data.error_msg);

  let to_date_error_msg = warnings
    .filter(
      (items, index) =>
        items.error_code.includes("invalid to date") &&
        items.error_from.includes("Client")
    )
    .map((data) => data.error_msg);

  let same_date_error_msg = warnings
    .filter(
      (items, index) =>
        items.error_code.includes("same date") &&
        items.error_from.includes("Client")
    )
    .map((data) => data.error_msg);

  let duplicate_error_msg = warnings
    .filter(
      (items, index) =>
        items.error_code.includes("unique") &&
        items.error_from.includes("Client")
    )
    .map((data) => data.error_msg);

  let exceed_error_msg = warnings
    .filter(
      (items, index) =>
        items.error_code.includes("exceed") &&
        items.error_from.includes("Client")
    )
    .map((data) => data.error_msg);

  let max_weight_error_msg = warnings
    .filter(
      (items, index) =>
        items.error_code.includes("max weight") &&
        items.error_from.includes("Client")
    )
    .map((data) => data.error_msg);

  // let blank_error_msg = warnings
  //   .filter(
  //     (items, index) =>
  //       items.error_code.includes("blank") &&
  //       items.error_from.includes("Client")
  //   )
  //   .map((data) => data.error_msg);

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
        setAdd(pdata[0].add === "Y" ? true : false);
        setView(pdata[0].view === "Y" ? true : false);
      }
    }

    let PublishResponse = await fetch(`${process.env.REACT_APP_SERVER_URL}/api/join_user_group_access/${user.user_id}/14/`,
      {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          Authorization: "Bearer " + String(authTokens.access),
        },
      }
    );

    let PublishData = await PublishResponse.json();
    if (PublishResponse.status === 200) {
      if (PublishData.length > 0) {
        let pdata = { ...PublishData };
        setPblish(pdata[0].add === "Y" ? true : false);
      }
    }
  };

  useEffect(() => {
    fnGetPermissions();
    fnGetWarnings();
    fnGetConfigCodesDetails();
    fn_get_org_funct_hierarchy();
    fn_get_sc_details_business();
    fn_get_scorecard();
    fn_get_perspective_details();
    getUserDetails();
    setError({ ScDetails: [] });
  }, []);

  useEffect(() => { }, [refresh]);

  const fn_get_org_funct_hierarchy = async () => {
    let org_funct_hierarchy_response = await fetch(
      `${process.env.REACT_APP_SERVER_URL}/api/get_org_functional_hierarchy`,
      {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          Authorization: "Bearer " + String(authTokens.access),
        },
      }
    );

    let org_funct_hierarchy_data = await org_funct_hierarchy_response.json();

    if (org_funct_hierarchy_response.status === 200) {
      SetHierarchyLevelData(org_funct_hierarchy_data);
    }
  };

  const getUserDetails = async () => {
    let res = await fetch(
      `${process.env.REACT_APP_SERVER_URL}/api/get_user_details`,
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
        setAlluser(data);
      }
    }

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

  let FoundKpiUser = (id) => {
    return alluser.filter((item) => item.id === id);
  };

  const fn_get_scorecard = async () => {
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

    const filter_sc_desc = data.map((temp) => temp.scorecard_description);

    // const filter_sc_desc_id = data.map((temp) => temp.id);

    setSearchScoreCard(filter_sc_desc);
  };

  const fn_get_sc_details_business = async () => {
    let res = await fetch(
      `${process.env.REACT_APP_SERVER_URL}/api/get_range_scorecard/${startingIndex}/${endingIndex}/`,
      {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          Authorization: "Bearer " + String(authTokens.access),
        },
      }
    );

    let data = await res.json();

    const scorecard_detail_response = await fetch(
      `${process.env.REACT_APP_SERVER_URL}/api/get_scorecard_details`,
      {
        method: "GET",
        headers: {
          "Content-Type": "application/json",

          Authorization: "Bearer " + String(authTokens.access),
        },
      }
    );

    const businessgoal_response = await fetch(
      `${process.env.REACT_APP_SERVER_URL}/api/get_bussniess_goal_objective`,
      {
        method: "GET",
        headers: {
          "Content-Type": "application/json",

          Authorization: "Bearer " + String(authTokens.access),
        },
      }
    );

    const kpidetails_response = await fetch(
      `${process.env.REACT_APP_SERVER_URL}/api/get_kpi_details`,
      {
        method: "GET",
        headers: {
          "Content-Type": "application/json",

          Authorization: "Bearer " + String(authTokens.access),
        },
      }
    );

    const kpi_indicator_response = await fetch(
      `${process.env.REACT_APP_SERVER_URL}/api/get_kpi_stop_light_indicators`,
      {
        method: "GET",
        headers: {
          "Content-Type": "application/json",

          Authorization: "Bearer " + String(authTokens.access),
        },
      }
    );

    const prespective_response = await fetch(
      `${process.env.REACT_APP_SERVER_URL}/api/get_perspectives`,
      {
        method: "GET",
        headers: {
          "Content-Type": "application/json",

          Authorization: "Bearer " + String(authTokens.access),
        },
      }
    );

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

    let alluser = await fetch(
      `${process.env.REACT_APP_SERVER_URL}/api/get_user_details`,
      {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          Authorization: "Bearer " + String(authTokens.access),
        },
      }
    );

    let scorecard_detail = await scorecard_detail_response.json();

    let businessgoal = await businessgoal_response.json();

    let kpi_details = await kpidetails_response.json();

    let kpi_indicators_details = await kpi_indicator_response.json();

    let prepspective_details = await prespective_response.json();

    let KpiUserdata = await kpiuser.json();

    let Userdata = await alluser.json();

    let scorecard_data = data.data;

    const get_samp_request = await fetch(
      `${process.env.REACT_APP_SERVER_URL}/api/get_kpi_actuals`,
      {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          Authorization: "Bearer " + String(authTokens.access),
        },
      }
    );

    let actuals_data = await get_samp_request.json();

    const merged_data = scorecard_detail
      .map((items) => {
        const smpl_obj = prepspective_details.find(
          (obj) => obj.id === items.perspective_id
        );
        return smpl_obj
          ? {
            ...items,
            perp_description: smpl_obj.description,
            perp_name: smpl_obj.perspective,
            perp_code: smpl_obj.perspective_code,
            ScObjective: false,
          }
          : "";
      })
      .filter(Boolean);

    const getUserName = (id) => {
      let userList = Userdata.filter((i) => {
        return i.id == id;
      });
      return userList[0].username;
    };

    const getKpiUser = (id, str) => {
      const kpiUserName = [];
      KpiUserdata.map((items) => {
        if (items.kpi_id === id && items.kpi_owner === str) {
          kpiUserName.push(items.user_id);
        }
      });
      return kpiUserName;
    };

    // let merged_data = scorecard_detail.map(item => ({ ...item, ...prepspective_details.find(i => i.id === item.perspective_id) }));

    const getByIndicators = (id) => {
      return kpi_indicators_details.filter((kpiItems) => kpiItems.kpi_id == id);
    };

    let getindicators = kpi_details.filter((kpiIdItems) => {
      return (kpiIdItems["Indicators"] = getByIndicators(kpiIdItems.id));
    });

    let getkpiactuals = (id) => {
      let data = actuals_data.filter((items) => items.kpi_id == id);

      if (data.length === 0) {
        return false;
      } else {
        return true;
      }
    };

    let getkpiactualsc = (id) => {
      let data = actuals_data.filter((items) => items.scorecard_id == id);

      if (data.length === 0) {
        return false;
      } else {
        return true;
      }
    };

    const getByKpiID = (id) => {
      let KpiData = getindicators.map((items) => {
        return {
          ...items,
          ScKpiDetails: false,
          ActulsPre: getkpiactuals(items.id),
          kpiOwner: getKpiUser(items.id, "Y"),
          kpiUser: getKpiUser(items.id, "N"),
        };
      });
      return KpiData.filter((kpiItems) => kpiItems.objective_id == id);
    };

    let getkpiId = businessgoal.filter((kpiIdItems) => {
      return (kpiIdItems["kpi_items"] = getByKpiID(kpiIdItems.id));
    });

    let BusinessData = getkpiId.map((Items) => {
      return { ...Items, ScKpi: false };
    });
    // ? note end

    let scoreCardData = scorecard_data.filter((items) => {
      let scorecard_details_obj = merged_data.filter(
        (obj) => obj.scorecard_id == items.id
      );
      scorecard_details_obj.map((detailsObj, idx) => {
        scorecard_details_obj[idx].BusinessGoal = BusinessData.filter(
          (innerobj) =>
            innerobj.scorecard_id == items.id &&
            innerobj.scorecard_details_id == detailsObj.id
        );
      });

      // let scorecard_details_obj_1=scorecard_details_obj.map((i)=>{
      //   return {
      //     ...i,
      //     ScKpi:false
      //   }
      // })

      return (items.ScoreCard_Details = scorecard_details_obj);
    });

    let ScoreCardData1 = scoreCardData.map((items) => {
      return {
        ...items,
        ScDetails: false,
      };
    });

    const filter_sc_desc = scoreCardData.map(
      (temp) => temp.scorecard_description
    );

    const filter_sc_desc_id = scoreCardData.map((temp) => temp.id);
    setScoreCard(ScoreCardData1);
    let userOpt = [];
    for (let i = 0; i < Userdata.length; i++) {
      userOpt.push({
        value: Userdata[i].id,
        label: Userdata[i].username.toUpperCase(),
      });
    }
    setOptions(userOpt);
    setAdatalength(ScoreCardData1.length);
  };

  const fnExpandAll = () => {
    let ScData = [...getsmpdata];
    ScData[0].ScDetails = !Expand;
    ScData[0].ScoreCard_Details.map((Items, PerIndex) => {
      ScData[0].ScoreCard_Details[PerIndex].ScObjective = !Expand;
      Items.BusinessGoal.map((BusItems, BusIndex) => {
        ScData[0].ScoreCard_Details[PerIndex].BusinessGoal[BusIndex].ScKpi =
          !Expand;
        BusItems.kpi_items.map((KpiItems, KpiIndex) => {
          ScData[0].ScoreCard_Details[PerIndex].BusinessGoal[
            BusIndex
          ].kpi_items[KpiIndex].ScKpiDetails = !Expand;
        });
      });
    });
    setSmpData(ScData);
    setExpand(!Expand);
  };

  const fnSearchScorecard = async (search) => {
    // let search = e.target.value;
    setTable_name_api_query(search);
    setError({ ScDetails: [] });
    setKpiError([]);
    setBusError([]);
    setslierror([]);
    setIsEditing(false);
    setIsAdd(false);
    if (search !== "") {
      setisloading(true);
      SetSearchError();
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
      const temp = filter_data.filter((items) => {
        return items.scorecard_description === search;
      });

      const temp_id = temp.map((items) => {
        return items.id;
      });

      let cl_temp = scorecard.filter((items, idx) => {
        return items.id === temp_id[0];
      });

      setShow(!getShow);
      setSmpData(cl_temp);
      setTimeout(() => {
        setisloading(false);
      }, 800);
    } else {
      SetSearchError("Please select anyone");
    }
  };

  const search_refresh = () => {
    setSmpData([]);
    setError({ ScDetails: [] });
    setKpiError([]);
    setslierror([]);
    setBusError([]);
    setIsEditing(false);
    setIsAdd(false);
    fn_get_scorecard();
    fn_get_sc_details_business();
    setTable_name_api_query("");
    // fn_get_scorecard()
  };

  const fn_get_perspective_details = async () => {
    let res = await fetch(
      `${process.env.REACT_APP_SERVER_URL}/api/get_perspectives`,
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
        setOdata(data);
      }
    }
  };

  // Use to add the scorcard
  const fnAddDetails = () => {
    let scorecard = [
      {
        functional_hierarchy_level: "",
        scorecard_description: "",
        from_date: "",
        to_date: "",
        ScoreCard_Details: [],
        created_by: user.user_id,
        last_updated_by: user.user_id,
      },
    ];
    setIsAdd(true);
    setSmpData(scorecard);
    setShow(true);
    setIsEditing(true);
  };

  const fnInputhandler = (e) => {
    setError({ ...error, [e.target.name]: "" });
    if (e.target.name === "from_date" || e.target.name === "to_date") {
      let temp = [...getsmpdata];
      if (e.target.value === null || e.target.value === undefined) {
        temp[0][e.target.name] = "";
      } else {
        temp[0][e.target.name] = moment(e.target.value).format("YYYY-MM-DD");
      }
      setSmpData(temp);
    } else {
      let temp = [...getsmpdata];
      temp[0][e.target.name] = e.target.value;
      setSmpData(temp);
    }
  };

  const fnAddNewPers = () => {
    let currLen = getsmpdata[0].ScoreCard_Details.length
      ? getsmpdata[0].ScoreCard_Details.length
      : 0;
    let perLen = odata.length ? odata.length : 0;
    if (currLen < perLen) {
      let scPer = getsmpdata[0].ScoreCard_Details;
      scPer.push({
        perspective_id: "",
        weight: "",
        BusinessGoal: [],
        created_by: user.user_id,
        last_updated_by: user.user_id,
      });

      const scData = [...getsmpdata];
      scData[0].ScoreCard_Details = scPer;
      scData[0].ScDetails = true;
      setSmpData(scData);
    } else {
      alert("can`t add new perspective");
    }
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

  function between(value, first, last) {
    let lower = Math.min(first, last),
      upper = Math.max(first, last);
    return value >= lower && value <= upper;
  }

  const fnUpdateScData = async (data) => {
    setisloading(true);
    const apiResponse = await fetch(
      `${process.env.REACT_APP_SERVER_URL}/api/api_scorecard_scorecard_details_objective_kpi`,
      {
        method: "PUT",
        body: JSON.stringify(data),
        headers: {
          "Content-Type": "application/json",
          Authorization: "Bearer " + String(authTokens.access),
        },
      }
    );

    let jsonData = await apiResponse.json();

    if (apiResponse.status === 200 || apiResponse.status === 201) {
      Swal.fire({
        icon: "success",
        text: "Scorecard Updated Successfuly",
      }).then(function () {
        search_refresh();
      });
    } else {
      Swal.fire({
        icon: "error",
        text: "Scorecard Updated failed",
      });
    }

    setisloading(false);
  };

  function compareLists(list1, list2) {
    if (!Array.isArray(list2) || list2.length === 0) {
      return false;
    }

    return list1.some((item) => list2.includes(item));
  }

  const fnValidateScorecard = () => {
    // Get the keys of the object
    var keys = Object.keys(getsmpdata[0]);
    let upd_keys = keys.map((element) => element.replace(/_/g, " "));
    let val_error = {};
    if (
      getsmpdata[0].scorecard_description.trim().length >= 0 &&
      !getsmpdata[0].id
    ) {
      scorecard.map((data) => {
        if (
          data.scorecard_description.trim() ===
          getsmpdata[0].scorecard_description.trim()
        ) {
          val_error.scorecard_description = duplicate_error_msg[0].replace(
            "%1",
            "scorecard description"
          );

          // "Already exist";
        }
      });
    }

    for (let i = 0; i < keys.length; i++) {
      if (
        keys[i] !== "ScoreCard_Details" &&
        keys[i] !== "ScDetails" &&
        getsmpdata[0][keys[i]] == ""
      ) {
        val_error[keys[i]] = null_error_msg[0].replace("%1", upd_keys[i]);
      } else if (
        getsmpdata[0].from_date.trim() != "" &&
        getsmpdata[0].to_date.trim() != "" &&
        getsmpdata[0].from_date.trim() === getsmpdata[0].to_date.trim()
      ) {
        val_error.from_date = same_date_error_msg[0]
          .replace("%1", upd_keys[2])
          .replace("%2", upd_keys[3]);
        val_error.to_date = same_date_error_msg[0]
          .replace("%1", upd_keys[3])
          .replace("%2", upd_keys[2]);
      } else if (
        getsmpdata[0].from_date.trim() != "" &&
        getsmpdata[0].to_date.trim() != "" &&
        getsmpdata[0].from_date.trim() >= getsmpdata[0].to_date.trim()
      ) {
        val_error.to_date = to_date_error_msg[0]
          .replace("%1", upd_keys[2])
          .replace("%2", upd_keys[3]);
        val_error.from_date = from_date_error_msg[0]
          .replace("%1", upd_keys[2])
          .replace("%2", upd_keys[3]);
      }
    }
    if (Object.keys(val_error).length === 0) {
      if (getsmpdata[0].ScoreCard_Details.length !== 0) {
        SetScError([]);
        let result = fnValidatePerspective(getsmpdata[0].ScoreCard_Details);
        return result;
      } else {
        return true;
      }
    } else {
      setError(val_error);
      return false;
    }
  };

  const fnValidatePerspective = (perData) => {
    let count_weight = 0;
    let last_index = 0;
    let nullfalg = false;
    let pererorvar = [];
    let errorVar = [];
    for (const [index, value] of perData.entries()) {
      if (value.isDeleted === undefined) {
        if (value.perspective_id == "" || value.perspective_id == null) {
          errorVar[index] = {
            ...errorVar[index],
            perspective_id: null_error_msg[0].replace("%1", "perspective"),
            //  "Can't be null"
          };
          // nullfalg=true;
        }
        // else {
        //   count_weight += Number(value.perspective_id);
        //   last_index = index;
        // }
        if (value.weight == "" || value.weight == null) {
          errorVar[index] = {
            ...errorVar[index],
            weight: null_error_msg[0].replace("%1", "weight"),
            // "This field is empty",
          };
          nullfalg = true;
        } else {
          count_weight += Number(value.weight);
          last_index = index;
        }
        let duplicate = 0;
        perData.map((curr, i) => {
          if (
            value.perspective_id != "" &&
            Number(value.perspective_id) === Number(curr.perspective_id)
          ) {
            duplicate += 1;
            if (duplicate > 1) {
              errorVar[i] = {
                ...errorVar[i],
                perspective_id: duplicate_error_msg[0].replace(
                  "%1",
                  "perpective"
                ),
                // "Already Exist",
              };

              let list = [...perData];
              list.splice(i, 1);
            }
          }
        });
      }
    }

    for (const [index, value] of perData.entries()) {
      if (value.isDeleted === undefined) {
        if (count_weight > 100 && nullfalg === false) {
          errorVar[index] = {
            ...errorVar[index],
            weight: exceed_error_msg[0].replace("%1", "weight"),
            // "Weight limit exceeds",
          };
        } else if (count_weight < 100 && nullfalg === false) {
          errorVar[index] = {
            ...errorVar[index],
            weight: max_weight_error_msg[0].replace("%1", "weight"),
            // "Weight limit has not equal to 100",
          };
        }
      }
    }

    if (errorVar.length === 0) {
      setBusError([]);
      setKpiError([]);
      let finresult = true;
      perData.map((items, index) => {
        if (items.BusinessGoal.length !== 0) {
          let result = fnValidateObjective(items.BusinessGoal, index);
          if (result === false) {
            finresult = result;
          }
        }
      });
      return finresult;
    } else {
      SetScError(errorVar);
      return false;
    }
  };

  const fnValidateObjective = (bussData, perspectiveIndex) => {
    let temp_err = [];
    let count_weight = 0;
    let nullfalg = false;
    let errorflag = false;
    bussData.map((data, i) => {
      if (data.isDeleted === undefined) {
        if (data.objective_code === "" || data.objective_code == null) {
          temp_err[i] = {
            ...temp_err[i],
            objective_code: null_error_msg[0].replace("%1", "objective code"),
          };
          nullfalg = true;
        }
        if (
          data.objective_description === "" ||
          data.objective_description == null
        ) {
          temp_err[i] = {
            ...temp_err[i],
            objective_description: null_error_msg[0].replace("%1", "objective"),
          };
          nullfalg = true;
        }
        if (data.weight === "" || data.weight == null) {
          temp_err[i] = {
            ...temp_err[i],
            weight: null_error_msg[0].replace("%1", "weight"),
          };
          nullfalg = true;
        } else {
          count_weight += Number(data.weight);
        }
      }
    });

    for (const [index, value] of bussData.entries()) {
      if (value.isDeleted === undefined) {
        if (count_weight > 100 && nullfalg === false) {
          temp_err[index] = {
            ...temp_err[index],
            weight: exceed_error_msg[0].replace("%1", "weight"),
            // "Weight limit exceeds",
          };
          errorflag = true;
        } else if (count_weight < 100 && nullfalg === false) {
          temp_err[index] = {
            ...temp_err[index],
            weight: max_weight_error_msg[0].replace("%1", "weight"),
            // "Weight limit has not equal to 100",
          };
          errorflag = true;
        } else {
          errorflag = false;
        }
      }
    }

    bussData.map((singlecount, index) => {
      if (singlecount.isDeleted === undefined) {
        let count = false;
        let cnt = 0;
        bussData.map((temp, index) => {
          if (nullfalg === false) {
            if (
              singlecount.objective_code == temp.objective_code &&
              temp.objective_code != "" &&
              singlecount.objective_code != ""
            ) {
              cnt = cnt + 1;
            }
            if (cnt >= 2) {
              count = true;
            } else {
              count = false;
            }

            if (count == true) {
              temp_err[index] = {
                ...temp_err[index],
                objective_code:
                  "The Fields Objective Code must make a unique set.",
              };
              errorflag = true;
            }
          }
        });
      }
    });

    if (temp_err.length === 0) {
      let finresult = true;
      bussData.map((items, index) => {
        if (items.kpi_items.length !== 0 && items.kpi_items !== undefined) {
          let result = fnValidateKpi(items.kpi_items, index, perspectiveIndex);
          // let result=fnValidateKpi(items.kpi_items,index,perspectiveIndex) && fnValidateIndicators(items.kpi_items)
          if (result === false) {
            finresult = result;
          }
        }
      });
      return finresult;
    } else {
      let temp = [...buserror];
      temp[perspectiveIndex] = temp_err;
      setBusError(temp);
      return false;
    }
  };

  const fnValidateKpi = (kpidata, businessIndex, perspectiveIndex) => {
    let errorVar = [];
    let nullflag = false;
    let count_weight = 0;
    for (const [index, value] of kpidata.entries()) {
      for (const key in value) {
        if (value.isDeleted === undefined) {
          if (
            value[key] === "" ||
            value[key] === undefined ||
            value[key] === null ||
            value[key].length === 0
          ) {
            if (
              key !== "Indicators" &&
              key !== "kpiUser" &&
              key !== "scorecard_id" &&
              key !== "perspective_id" &&
              key !== "scorecard_details_id" &&
              key !== "objective_id"
            ) {
              errorVar[index] = {
                ...errorVar[index],
                [key]: null_error_msg[0].replace("%1", key).replace(/_/g, " "),
                // "This field is empty",
              };
              nullflag = true;
            }
          }
        }
      }
      if (value.weight != undefined || value.weight != "") {
        count_weight += Number(value.weight);
      }
    }
    for (const [index, value] of kpidata.entries()) {
      if (value.isDeleted === undefined) {
        if (count_weight > 100 && nullflag === false) {
          errorVar[index] = {
            ...errorVar[index],
            weight: exceed_error_msg[0].replace("%1", "weight"),
            // "Weight limit exceeds",
          };
        } else if (count_weight < 100 && nullflag === false) {
          errorVar[index] = {
            ...errorVar[index],
            weight: max_weight_error_msg[0].replace("%1", "weight"),
            // "Weight limit has not equal to 100",
          };
        }
        // if (value.Indicators != undefined && value.Indicators != 0){
        //   fnValidateIndicators()
        // }
      }
    }

    for (const [index, value] of kpidata.entries()) {
      if (nullflag === false) {
        if (!between(value.baseline, value.min, value.max)) {
          errorVar[index] = {
            ...errorVar[index],
            baseline: exceed_error_msg[0].replace("%1", "baseline"),
            // "baseline limit exceds ",
          };
        }
        if (!between(value.target, value.min, value.max)) {
          errorVar[index] = {
            ...errorVar[index],
            target: exceed_error_msg[0].replace("%1", "target"),
            // "target limit exceds",
          };
        }
      }
    }

    for (const [index, value] of kpidata.entries()) {
      if (compareLists(value["kpiOwner"], value["kpiUser"])) {
        errorVar[index] = {
          ...errorVar[index],
          kpiOwner: "The unique users should be present in kpiOwner",
          user: "The unique users should be present in kpiUser",
        };
      }
    }

    if (errorVar.length === 0 || errorVar.length === undefined) {
      let finresult = true;
      kpidata.map((items, index) => {
        if (items.Indicators.length !== 0 && items.Indicators !== undefined) {
          let result = fnValidateIndicators(
            items.Indicators,
            index,
            businessIndex,
            perspectiveIndex
          );
          if (result === false) {
            finresult = result;
          }
        }
      });

      return finresult;
    } else {
      let temp = [];
      temp[businessIndex] = errorVar;
      let stage2 = [...kpiError];
      stage2[perspectiveIndex] = temp;
      setKpiError(stage2);
      setRefresh(!refresh);
      return false;
    }
  };

  const fnValidateIndicators = (
    slidata,
    kpiIndex,
    businessIndex,
    perspectiveIndex
  ) => {
    let error = [];

    slidata.map((itm, idx) => {
      if (
        itm.stop_light_indicator_from === "" ||
        itm.stop_light_indicator_from === undefined
      ) {
        error[idx] = {
          ...error[idx],
          stop_light_indicator_from: "This feild is Empty",
        };
      }
      if (
        itm.stop_light_indicator_to === "" ||
        itm.stop_light_indicator_to === undefined
      ) {
        error[idx] = {
          ...error[idx],
          stop_light_indicator_to: "This feild is Empty",
        };
      }
    });

    if (error.length === 0 || error.length === undefined) {
      return true;
    } else {
      let temp = [];
      temp[kpiIndex] = error;
      let temp2 = [];
      temp2[businessIndex] = temp;
      let stage2 = [...slierror];
      stage2[perspectiveIndex] = temp2;
      setslierror(stage2);
      setRefresh(!refresh);

      return false;
    }
  };

  const fnRootStateUpdateDraft = () => {
    let smpdataJSON = getsmpdata[0];
    smpdataJSON.publish_flag = "N";
    if (fnValidateScorecard()) {
      if (persRef.current !== null) {
        persRef.current.fnPerspectiveStateUpdate();
        if (!true) {
          console.log("failed");
        } else {
          fnUpdateScData(getsmpdata[0]);
        }
      } else {
        fnUpdateScData(getsmpdata[0]);
      }
    }
  };

  const fnRootStateUpdatePublish = () => {
    let smpdataJSON = getsmpdata[0];
    smpdataJSON.publish_flag = "Y";
    if (fnValidateScorecard()) {
      if (persRef.current !== null) {
        persRef.current.fnPerspectiveStateUpdate();
        if (!true) {
          // console.log("failed", getsmpdata[0]);
        } else {
          fnUpdateScData(getsmpdata[0]);
        }
      } else {
        fnUpdateScData(getsmpdata[0]);
      }
    }
  };

  //Component for copy scorecard
  const CopyComp = (props) => {

    const [SelecData, setSelecData] = useState({
      "isMetric": true,
      "scorecard_name": ''
    })

    const [status, setStatus] = useState(false);

    const fnCleanUpScoreCard = (data, isMetric) => {

      // ! Code For optimize object cleaning // --- Start ---

      // // Keys to remove from both parent and child objects
      // var keysToRemove = ['id'];

      // // Function to remove multiple keys from both parent and child objects
      // async function removeKeysFromObject(obj) {
      //   keysToRemove.forEach(key => {
      //     if (obj.hasOwnProperty(key)) {
      //       delete obj[key];
      //     }
      //   });

      //   if (obj.children && Array.isArray(obj.children)) {
      //     obj.children.forEach(child => {
      //       keysToRemove.forEach(key => {
      //         if (child.hasOwnProperty(key)) {
      //           delete child[key];
      //         }
      //       });
      //     });
      //   }

      //   return obj;
      // }

      // // Use Promise.all() to process objects in parallel
      // async function processObjectsParallel() {
      //   const updatedListOfObjects = await Promise.all(
      //     data.map(obj => removeKeysFromObject(obj))
      //   );
      //   return updatedListOfObjects;
      // }

      // // Call the function to process objects in parallel
      // processObjectsParallel().then(updatedListOfObjects => {
      //   // Print the updated list of objects
      //   console.log(updatedListOfObjects);
      // });

      // ! Code For optimize object cleaning // --- end ---


      // ? Code For object cleaning // --- start ---

      function removeKeysFromObjects(listOfObjects, keysToRemove) {
        return listOfObjects.map(obj => {
          // Recursively remove keys from the object
          function recursiveRemove(obj) {
            for (const key in obj) {
              if (keysToRemove.includes(key)) {
                delete obj[key];
              } else if (typeof obj[key] === 'object') {
                recursiveRemove(obj[key]);
              }
            }
          }
          recursiveRemove(obj);
          return obj;
        });
      }

      // Specify the keys to remove

      var keysToRemove = isMetric ? ['id', 'ActulsPre'] : ['id', 'frequency', 'measure', 'min', 'max', 'baseline', 'target', 'optimization', 'chart_type', 'period_type', 'ytd', 'kpiOwner', 'Indicators', 'ActulsPre'];

      // Call the function to remove keys dynamically
      var updatedListOfObjects = removeKeysFromObjects(data, keysToRemove);


      // return updated list of objects
      return updatedListOfObjects

      // ? Code For object cleaning // --- end ---

    }

    const scorecardCopy = async () => {

      if (SelecData.scorecard_name !== "") {

        let filter_response = await fetch(
          `${process.env.REACT_APP_SERVER_URL}/api/scorecard_description/?search=${SelecData.scorecard_name}`,
          {
            method: "GET",
            headers: {
              "Content-Type": "application/json",
              Authorization: "Bearer " + String(authTokens.access),
            },
          }
        );

        let filter_data = await filter_response.json();
        const temp = filter_data.filter((items) => {
          return items.scorecard_description === SelecData.scorecard_name;
        });

        const temp_id = temp.map((items) => {
          return items.id;
        });

        let ShwCopy = [...scorecard];

        let cl_temp = ShwCopy.filter((items, idx) => {
          return items.id === temp_id[0];
        });

        let tempScoreDetails = fnCleanUpScoreCard(cl_temp[0].ScoreCard_Details, SelecData.isMetric)

        // Expands the copyed scorecard
        tempScoreDetails.map((Items, PerIndex) => {
          tempScoreDetails[PerIndex].ScObjective = true;
          Items.BusinessGoal.map((BusItems, BusIndex) => {
            tempScoreDetails[PerIndex].BusinessGoal[BusIndex].ScKpi =
              true;
            BusItems.kpi_items.map((KpiItems, KpiIndex) => {
              tempScoreDetails[PerIndex].BusinessGoal[
                BusIndex
              ].kpi_items[KpiIndex].ScKpiDetails = true;
            });
          });
        });

        setSmpData((prevData) => {
          const updatedObject = {
            ...prevData[0], // Copy the existing object properties
            ScoreCard_Details: tempScoreDetails, // Update the ScoreCard_Details property
            ScDetails: true,
          };
          return [updatedObject]; // Wrap the updated object in an array
        });
        setExpand(true)
      }
      setStatus(false)
    }

    return (
      <>
        {!status ? (
          <IoCopy className="sc_cl_addRowIcon" onClick={() => { setStatus(true) }} />
        ) : (
          <Modal
            size="lg"
            show={status}
            onHide={() => { setStatus(false) }}
            className="align-items-center d-flex justify-content-center"
            backdrop="static"
            tabindex="-1"
          >
            <Modal.Header closeButton>
              <Modal.Title>Copy Scorecard</Modal.Title>
            </Modal.Header>

            <Modal.Body>
              <Col>
                <Form>
                  <div className="col-12 d-flex flex-column my-lg-4 flex-lg-row">
                    <FormGroup>

                      <Form.Select
                        size="sm"
                        value={SelecData.scorecard_name}
                        onChange={(e) => {
                          const { name, value } = e.target;
                          setSelecData((prevData) => ({
                            ...prevData,
                            [name]: value,
                          }));
                        }}
                        name="scorecard_name"
                      >
                        <option hidden>Select Scorecard</option>
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
                    </FormGroup>
                  </div>

                  <div className="col-12 d-flex flex-column my-lg-4 flex-lg-row">
                    <FormGroup>
                      <FormLabel className="sc_cl_input_label">
                        Include Metrics
                        <FnTooltipComponent
                          label={helper.filter((user) => user.context_order === 6)
                            .map((use) => use.label)}
                          context={helper.filter((user) => user.context_order === 6)
                            .map((use) => use.help_context)}
                          classname={""}
                          placement="bottom"
                        />
                      </FormLabel>

                      <Form.Check
                        type={'switch'}
                        name={'isMetric'}
                        onChange={(e) => {
                          const { name, checked } = e.target;
                          setSelecData((prevData) => ({
                            ...prevData,
                            [name]: checked,
                          }));
                        }}
                        checked={SelecData.isMetric}
                      />
                    </FormGroup>
                    <span className="sc_cl_user_err">{error && error.target_date}</span>
                  </div>
                </Form>
              </Col>
            </Modal.Body>

            <Modal.Footer>
              <FnBtnComponent
                onClick={scorecardCopy}
                // onClick={validation_of_input}
                classname={"sc_cl_submit_button m-2"}
                children={"Create"}
              />
            </Modal.Footer>
          </Modal>
        )}
      </>
    );
  };

  // perspective section of the scorecard:- Will be child of root section
  const PerspectiveComp = forwardRef(({ prep_data }, ref) => {
    const [perData, setperData] = useState(prep_data);
    const [add, setadd] = useState();
    const businessRef = useRef(null);

    const fnPerspectiveStateUpdate = () => {
      const scData = [...getsmpdata];
      scData[0].ScoreCard_Details = perData;
      setSmpData(scData);

      // if (fnValidatePerspective()) {
      //   const scData = [...getsmpdata];
      //   scData[0].ScoreCard_Details = perData;
      //   setSmpData(scData);
      //   if (businessRef.current !== null) {
      //     let result = businessRef.current.fnBusinessStateUpdate();
      //     return result;
      //   } else {
      //     return true;
      //   }
      // } else {
      //   return false;
      // }
    };

    React.useImperativeHandle(ref, () => ({
      fnPerspectiveStateUpdate,
    }));

    const fnAddNewBusiness = (data, idx) => {
      let scBusiness = data;
      scBusiness.push({
        kpi_items: [],
        objective_code: "",
        objective_description: "",
        weight: "",
        created_by: user.user_id,
        last_updated_by: user.user_id,
      });

      const scData = [...perData];
      scData[idx].BusinessGoal = scBusiness;
      scData[idx].ScObjective = true;
      setperData(scData);
      setadd(true);
    };

    const fnRemovePerspective = (i) => {
      let pertemp = [...perData];
      pertemp[i].weight = "";
      pertemp[i].perspective_id = "";
      pertemp[i].isDeleted = "Y";

      setperData(pertemp);
      // error[i] = ''
      // setError({ ...error, [i]: {} });
    };

    useEffect(() => { }, [add]);

    // ? let newPrep = [...getsmpdata];
    // ? newPrep[0].ScoreCard_Details[idx][e.target.name] = e.target.value;
    // ? setSmpData(newPrep);

    const fnOnChangeHandler = (e, idx) => {
      const newTemp = [...perData];
      newTemp[idx][e.target.name] = e.target.value;
      setperData(newTemp);
    };

    return (
      <Accordion>
        {perData.map((prespectiveItem, index) => {
          return (
            <React.Fragment key={index}>
              {!prespectiveItem.isDeleted ||
                prespectiveItem.isDeleted === "N" ? (
                <Card
                  className="accordian-card border-0 shadow rounded border-bottom-success"
                  key={index}
                >
                  <Card.Header className="d-flex flex-column flex-lg-row fw-normal">
                    <Col className="col-12 d-flex flex-column flex-lg-row">
                      <div className="p-1 d-flex align-items-center">
                        <i
                          onClick={() => {
                            let ScData = [...perData];
                            ScData[index].ScObjective =
                              !prespectiveItem.ScObjective;
                            setperData(ScData);
                          }}
                          className="opacity-75 sc_cl_table_i text-primary"
                        >
                          {!prespectiveItem.ScObjective ? (
                            <AiFillPlusCircle style={{ cursor: "pointer" }} />
                          ) : (
                            <AiFillMinusCircle style={{ cursor: "pointer" }} />
                          )}
                        </i>
                      </div>

                      <Form className="ms-2 col-11 d-flex flex-column flex-lg-row flex-sm-column justify-content-between text-black ">
                        <div className="sc_cl_div col-12 col-lg-3 d-flex flex-column ">
                          <FormGroup>
                            <Form.Label className=" ">
                              Perspective <sup className="text-danger">*</sup>
                              <FnTooltipComponent
                                label={help
                                  .filter(
                                    (user) => String(user.context_order) === "5"
                                  )

                                  .map((use) => use.label)}
                                context={help
                                  .filter(
                                    (user) => String(user.context_order) === "5"
                                  )

                                  .map((use) => use.help_context)}
                                classname={""}
                                placement="bottom"
                              />
                            </Form.Label>
                            {isEditing ? (
                              <Form.Select
                                className=""
                                name="perspective_id"
                                value={prespectiveItem.perspective_id || ""}
                                onChange={(e) => fnOnChangeHandler(e, index)}
                                size="sm"
                              >
                                <option hidden>--Select--</option>
                                {odata.map((temp) => {
                                  return (
                                    <option
                                      className="sc_cl_option"
                                      key={temp.id}
                                      value={temp.id}
                                    >
                                      {temp.perspective}
                                    </option>
                                  );
                                })}
                              </Form.Select>
                            ) : (
                              <small className="sc_cl_div col-12 col-lg-3 d-flex flex-column w-auto">
                                {prespectiveItem.perp_description}
                              </small>
                            )}
                          </FormGroup>
                          <span className="sc_cl_span red">
                            {ScError[index] && ScError[index].perspective_id}
                          </span>
                        </div>

                        <div className="sc_cl_div col-12 col-lg-3 d-flex flex-column ">
                          <FormGroup>
                            <Form.Label className=" ">
                              Weight <sup className="text-danger">*</sup>
                              <FnTooltipComponent
                                label={help
                                  .filter(
                                    (user) => String(user.context_order) === "6"
                                  )

                                  .map((use) => use.label)}
                                context={help
                                  .filter(
                                    (user) => String(user.context_order) === "6"
                                  )

                                  .map((use) => use.help_context)}
                                classname={""}
                                placement="bottom"
                              />
                            </Form.Label>
                            {isEditing ? (
                              <Form.Control
                                type="text"
                                className=" "
                                name="weight"
                                value={prespectiveItem.weight}
                                onChange={(e) => fnOnChangeHandler(e, index)}
                                size="sm"
                              />
                            ) : (
                              <small className="sc_cl_div col-12 col-lg-3 d-flex flex-column">
                                {prespectiveItem.weight}
                              </small>
                            )}
                          </FormGroup>
                          <span className="sc_cl_span red text-sm">
                            {ScError[index] && ScError[index].weight}
                          </span>
                        </div>

                        <div></div>
                      </Form>

                      <div
                        className={`${isEditing ? "" : "d-none"
                          } col-1 d-flex flex-column justify-content-evenly`}
                      >
                        <span
                          className="d-flex  px-2 sc_cl_icons text-success justify-content-center"
                          style={{ cursor: "pointer" }}
                        >
                          <RiAddCircleFill
                            className="sc_cl_addRowIcon"
                            onClick={() =>
                              fnAddNewBusiness(
                                prespectiveItem.BusinessGoal,
                                index
                              )
                            }
                          />
                        </span>
                        {perData.length > 1 && isEditing ? (
                          <span
                            className="text-danger sc_cl_remove_btn opacity-50 d-flex  px-2 sc_cl_icons justify-content-center"
                            style={{ cursor: "pointer" }}
                          >
                            <MdDelete
                              onClick={() => {
                                fnRemovePerspective(index);
                              }}
                            />
                          </span>
                        ) : (
                          ""
                        )}
                      </div>
                    </Col>
                  </Card.Header>

                  <Accordion
                    className={`collapse ${prespectiveItem.ScObjective ? "show" : ""
                      }`}
                  >
                    <Card.Body className="p-0 px-4 ">
                      {prespectiveItem.BusinessGoal.length > 0 ? (
                        <BusinessComp
                          ref={businessRef}
                          busniness_data={prespectiveItem.BusinessGoal}
                          perspectiveIndex={index}
                        />
                      ) : (
                        <></>
                      )}
                    </Card.Body>
                  </Accordion>
                </Card>
              ) : (
                <></>
              )}
            </React.Fragment>
          );
        })}
      </Accordion>
    );
  });

  // Objective section of the scorecard:- Will be child of PerspectiveComp
  const BusinessComp = forwardRef(
    ({ busniness_data, perspectiveIndex }, ref) => {
      const [bussData, setbussData] = useState(busniness_data);
      const [add, setadd] = useState();
      const kpi_items = {
        created_by: user.user_id,
        last_updated_by: user.user_id,
        // scorecard_id: 1,
        // perspective_id: 1,
        // scorecard_details_id: 1,
        // objective_id: 1,
        scorecard_id: "",
        perspective_id: "",
        scorecard_details_id: "",
        objective_id: "",
        kpi_code: "",
        kpi: "",
        frequency: "",
        weight: "",
        measure: "",
        min: "",
        max: "",
        baseline: "",
        target: "",
        optimization: "",
        chart_type: "",
        period_type: "",
        ytd: "",
        kpiOwner: [],
        Indicators: [],
      };
      const kpiRef = useRef(null);

      useEffect(() => { }, [add]);

      const fnBusinessStateUpdate = () => {
        // setBusError([]);
        const newScore = [...getsmpdata];
        newScore[0].ScoreCard_Details[perspectiveIndex].BusinessGoal = bussData;
        setSmpData(newScore);
        // if (fnValidateObjective()) {
        //   const newScore = [...getsmpdata];
        //   newScore[0].ScoreCard_Details[perspectiveIndex].BusinessGoal =
        //     bussData;
        //   setSmpData(newScore);
        //   if (kpiRef.current !== null) {
        //     let result = kpiRef.current.fnKpiStateUpdate();
        //     return result;
        //   } else {
        //     return true;
        //   }
        // } else {
        //   return false;
        // }
      };

      React.useImperativeHandle(ref, () => ({
        fnBusinessStateUpdate,
      }));

      const fnAddKpi = (idx) => {
        const newScore = [...bussData];
        newScore[idx].kpi_items.push(kpi_items);
        newScore[idx].ScKpi = true;
        setbussData(newScore);
        setadd(true);
      };

      const inputhandler = (e, idx) => {
        const newTemp = [...bussData];
        newTemp[idx][e.target.name] = e.target.value;
        setbussData(newTemp);
      };

      const fnRemoveBusiness = (i) => {
        let busstemp = [...bussData];
        busstemp[i].weight = 0;
        busstemp[i].isDeleted = "Y";

        setbussData(busstemp);
        // setError({ ...error, [i]: {} });
      };

      return (
        <Accordion>
          {bussData.map((businessItem, idx) => {
            return (
              <React.Fragment key={idx}>
                {!businessItem.isDeleted || businessItem.isDeleted === "N" ? (
                  <Card
                    className="accordian-card border-0 shadow rounded border-bottom-success"
                    key={idx}
                  >
                    <Card.Header className="d-flex flex-column flex-lg-row fw-normal">
                      <div className="p-1 d-flex align-items-center">
                        <i
                          onClick={() => {
                            let ScData = [...bussData];
                            ScData[idx].ScKpi = !businessItem.ScKpi;
                            setbussData(ScData);
                          }}
                          className="opacity-75 sc_cl_table_i text-primary"
                        >
                          {!businessItem.ScKpi ? (
                            <AiFillPlusCircle style={{ cursor: "pointer" }} />
                          ) : (
                            <AiFillMinusCircle style={{ cursor: "pointer" }} />
                          )}
                        </i>
                      </div>

                      <Form className="ms-2 text-black col-11 d-flex flex-column flex-lg-row flex-sm-column justify-content-between text-black ">
                        {/* {isEditing ? ( */}
                        <div className="sc_cl_div col-12 col-lg-3 d-flex flex-column w-auto">
                          <FormGroup>
                            <Form.Label className=" ">
                              Objective Code{" "}
                              <sup className="text-danger">*</sup>
                              <FnTooltipComponent
                                label={help
                                  .filter(
                                    (user) => String(user.context_order) === "7"
                                  )

                                  .map((use) => use.label)}
                                context={help
                                  .filter(
                                    (user) => String(user.context_order) === "7"
                                  )

                                  .map((use) => use.help_context)}
                                classname={""}
                                placement="bottom"
                              />
                            </Form.Label>
                            {isEditing ? (
                              <Form.Control
                                type="text"
                                name="objective_code"
                                className=" "
                                value={businessItem.objective_code}
                                onChange={(e) => inputhandler(e, idx)}
                                size="sm"
                              />
                            ) : (
                              <small className="sc_cl_div col-12 col-lg-3 d-flex flex-column w-auto">
                                {businessItem.objective_code}
                              </small>
                            )}
                          </FormGroup>

                          <span className="sc_cl_span red">
                            {buserror[perspectiveIndex] &&
                              buserror[perspectiveIndex][idx] &&
                              buserror[perspectiveIndex][idx].objective_code}
                          </span>
                        </div>

                        <div className="sc_cl_div col-12 col-lg-3 d-flex flex-column">
                          <FormGroup>
                            <Form.Label className=" ">
                              Objective <sup className="text-danger">*</sup>
                              <FnTooltipComponent
                                label={help
                                  .filter(
                                    (user) => String(user.context_order) === "8"
                                  )

                                  .map((use) => use.label)}
                                context={help
                                  .filter(
                                    (user) => String(user.context_order) === "8"
                                  )

                                  .map((use) => use.help_context)}
                                classname={""}
                                placement="bottom"
                              />
                            </Form.Label>
                            {isEditing ? (
                              <Form.Control
                                type="text"
                                name="objective_description"
                                className=" "
                                value={businessItem.objective_description}
                                onChange={(e) => inputhandler(e, idx)}
                                size="sm"
                              />
                            ) : (
                              <small className="sc_cl_div col-12 col-lg-3 d-flex flex-column w-auto">
                                {businessItem.objective_description}
                              </small>
                            )}
                          </FormGroup>

                          <span className="sc_cl_span red">
                            {buserror[perspectiveIndex] &&
                              buserror[perspectiveIndex][idx] &&
                              buserror[perspectiveIndex][idx]
                                .objective_description}
                          </span>
                        </div>

                        <div className="sc_cl_div col-12 col-lg-3 d-flex flex-column">
                          <FormGroup>
                            <Form.Label className=" ">
                              Weight <sup className="text-danger">*</sup>
                              <FnTooltipComponent
                                label={help
                                  .filter(
                                    (user) => String(user.context_order) === "9"
                                  )

                                  .map((use) => use.label)}
                                context={help
                                  .filter(
                                    (user) => String(user.context_order) === "9"
                                  )

                                  .map((use) => use.help_context)}
                                classname={""}
                                placement="bottom"
                              />
                            </Form.Label>
                            {isEditing ? (
                              <Form.Control
                                className=" "
                                type="text"
                                name="weight"
                                value={businessItem.weight}
                                onChange={(e) => inputhandler(e, idx)}
                                size="sm"
                              />
                            ) : (
                              <small className="sc_cl_div col-12 col-lg-3 d-flex flex-column">
                                {businessItem.weight}
                              </small>
                            )}
                          </FormGroup>
                          <span className="sc_cl_span red">
                            {buserror[perspectiveIndex] &&
                              buserror[perspectiveIndex][idx] &&
                              buserror[perspectiveIndex][idx].weight}
                          </span>
                        </div>
                      </Form>

                      <div
                        className={`${isEditing ? "" : "d-none"
                          } col-1 d-flex flex-column justify-content-evenly`}
                      >
                        <span
                          className="d-flex  px-2 sc_cl_icons text-success justify-content-center"
                          style={{ cursor: "pointer" }}
                        >
                          <RiAddCircleFill
                            className="sc_cl_addRowIcon"
                            onClick={() => {
                              fnAddKpi(idx);
                            }}
                          />
                        </span>
                        {bussData.length > 1 && isEditing ? (
                          <span className="text-danger sc_cl_remove_btn opacity-50 d-flex  px-2 sc_cl_icons justify-content-center">
                            <MdDelete
                              onClick={() => {
                                fnRemoveBusiness(idx);
                              }}
                            />
                          </span>
                        ) : (
                          ""
                        )}
                      </div>
                    </Card.Header>

                    <Accordion
                      className={`collapse ${businessItem.ScKpi ? "show" : ""}`}
                    >
                      <Card.Body className="p-0 px-4 ">
                        {businessItem.kpi_items.length > 0 ? (
                          <KpiComp
                            ref={kpiRef}
                            kpisend_data={businessItem.kpi_items}
                            perspectiveIndex={perspectiveIndex}
                            businessIndex={idx}
                          />
                        ) : (
                          // <p className="m-0 text-danger">
                          //   <strong>No BusinessGoal</strong>
                          // </p>
                          ""
                          // <Fn_Kpi_add sample_data={businessItem.kpi_items} />
                        )}
                      </Card.Body>
                    </Accordion>
                  </Card>
                ) : (
                  <></>
                )}
              </React.Fragment>
            );
          })}
        </Accordion>
      );
    }
  );

  // Kpi section of the scorecard(Contains Kpi Details and kpi sli):- Will be child of BusinessComp
  const KpiComp = forwardRef(
    ({ kpisend_data, perspectiveIndex, businessIndex }, ref) => {
      const [kpidata, setKpiData] = useState(kpisend_data);
      const [user_per, setUser_per] = useState(false);

      const fnKpiStateUpdate = () => {
        const newTemp = [...getsmpdata];
        newTemp[0].ScoreCard_Details[perspectiveIndex].BusinessGoal[
          businessIndex
        ].kpi_items = kpidata;
        setSmpData(newTemp);
        // if (fnValidateKpi() && fnValidateIndicators()) {
        //   const newTemp = [...getsmpdata];
        //   newTemp[0].ScoreCard_Details[perspectiveIndex].BusinessGoal[
        //     businessIndex
        //   ].kpi_items = kpidata;
        //   setSmpData(newTemp);
        //   return true;
        // } else {
        //   return false;
        // }
      };

      React.useImperativeHandle(ref, () => ({
        fnKpiStateUpdate,
      }));

      const inputhandler = (e, idx) => {
        const newTemp = [...kpisend_data];
        newTemp[idx][e.target.name] = e.target.value;
        setKpiData(newTemp);
      };

      const fnIndicatorsinputhandler = (e, idx, kpiIndex) => {
        const newTemp = [...kpisend_data];
        newTemp[kpiIndex].Indicators[idx][e.target.name] = e.target.value;
        setKpiData(newTemp);
      };

      const fnRemoveKpi = (i) => {
        let kptemp = [...kpidata];
        kptemp[i].weight = 0;
        kptemp[i].isDeleted = "Y";

        setKpiData(kptemp);
        // setError({ ...error, [i]: {} });
      };

      const fnIndicators = (index) => {
        let tempData = [...kpidata];

        tempData[index].Indicators = [
          {
            stop_light_indicator: "#FF0000",
            created_by: user.user_id,
            last_updated_by: user.user_id,
          },
          {
            stop_light_indicator: "#FFA500",
            created_by: user.user_id,
            last_updated_by: user.user_id,
          },
          {
            stop_light_indicator: "#76B947",
            created_by: user.user_id,
            last_updated_by: user.user_id,
          },
          {
            stop_light_indicator: "#116530",
            created_by: user.user_id,
            last_updated_by: user.user_id,
          },
        ];
        setKpiData(tempData);
      };

      useEffect(() => { }, [user_per]);

      const userinputhandler = (e, queryIdx, key) => {
        let tempkpidata = kpidata;
        let listtest = [];
        if (Array.isArray(e)) {
          e.map((x) => listtest.push(x.value));
        }
        tempkpidata[queryIdx][key] = listtest;
        setKpiData(tempkpidata);
        setUser_per(!user_per);
      };

      return (
        <Accordion>
          {kpidata.map((kpiItem, idx) => {
            return (
              <React.Fragment key={idx}>
                {!kpiItem.isDeleted || kpiItem.isDeleted === "N" ? (
                  <Card className="mt-1" key={idx}>
                    <Card.Header className="align-items-center d-flex fw-normal">
                      <div className="p-1 d-flex align-items-center">
                        {/* <PlusBtnCmp eventKey={idx}></PlusBtnCmp> */}

                        <i
                          onClick={() => {
                            let ScData = [...kpidata];
                            ScData[idx].ScKpiDetails = !kpiItem.ScKpiDetails;
                            setKpiData(ScData);
                          }}
                          className="opacity-75 sc_cl_table_i text-primary"
                        >
                          {!kpiItem.ScKpiDetails ? (
                            <FcExpand style={{ cursor: "pointer" }} />
                          ) : (
                            <FcCollapse style={{ cursor: "pointer" }} />
                          )}
                        </i>
                      </div>

                      <Form className="ms-2 col-11 d-flex flex-column flex-lg-row flex-sm-column justify-content-between text-black">
                        <div className="col-12 col-lg-3 d-flex flex-column w-auto">
                          <FormGroup>
                            <Form.Label className=" ">
                              KPI Code <sup className="text-danger">*</sup>
                              <FnTooltipComponent
                                label={help
                                  .filter(
                                    (user) =>
                                      String(user.context_order) === "10"
                                  )

                                  .map((use) => use.label)}
                                context={help
                                  .filter(
                                    (user) =>
                                      String(user.context_order) === "10"
                                  )

                                  .map((use) => use.help_context)}
                                classname={""}
                                placement="bottom"
                              />
                            </Form.Label>
                            {isEditing ? (
                              <Form.Control
                                type="text"
                                name="kpi_code"
                                className=""
                                value={kpiItem.kpi_code}
                                onChange={(e) => inputhandler(e, idx)}
                                size="sm"
                              />
                            ) : (
                              <small className="sc_cl_div col-12 col-lg-3 d-flex flex-column w-auto">
                                {kpiItem.kpi_code}
                              </small>
                            )}
                          </FormGroup>
                          <span className="sc_cl_span red">
                            {kpiError &&
                              kpiError[perspectiveIndex] &&
                              kpiError[perspectiveIndex][businessIndex] &&
                              kpiError[perspectiveIndex][businessIndex][idx] &&
                              kpiError[perspectiveIndex][businessIndex][idx]
                                .kpi_code}
                          </span>
                        </div>

                        <div className="col-12 col-lg-3 d-flex flex-column">
                          <FormGroup>
                            <Form.Label className="  ">
                              KPI <sup className="text-danger">*</sup>
                              <FnTooltipComponent
                                label={help
                                  .filter(
                                    (user) =>
                                      String(user.context_order) === "11"
                                  )

                                  .map((use) => use.label)}
                                context={help
                                  .filter(
                                    (user) =>
                                      String(user.context_order) === "11"
                                  )

                                  .map((use) => use.help_context)}
                                classname={""}
                                placement="bottom"
                              />
                            </Form.Label>
                            {isEditing ? (
                              <Form.Control
                                type="text"
                                className=""
                                name="kpi"
                                value={kpiItem.kpi}
                                onChange={(e) => inputhandler(e, idx)}
                                size="sm"
                              />
                            ) : (
                              <small className="sc_cl_div col-12 col-lg-3 d-flex flex-column w-auto">
                                {kpiItem.kpi}
                              </small>
                            )}
                          </FormGroup>

                          <span className="sc_cl_span red">
                            {kpiError &&
                              kpiError[perspectiveIndex] &&
                              kpiError[perspectiveIndex][businessIndex] &&
                              kpiError[perspectiveIndex][businessIndex][idx] &&
                              kpiError[perspectiveIndex][businessIndex][idx]
                                .kpi}
                          </span>
                        </div>

                        <div className="col-12 col-lg-3 d-flex flex-column">
                          <FormGroup>
                            <Form.Label className="  ">
                              Weight <sup className="text-danger">*</sup>
                              <FnTooltipComponent
                                label={help
                                  .filter(
                                    (user) =>
                                      String(user.context_order) === "12"
                                  )

                                  .map((use) => use.label)}
                                context={help
                                  .filter(
                                    (user) =>
                                      String(user.context_order) === "12"
                                  )

                                  .map((use) => use.help_context)}
                                classname={""}
                                placement="bottom"
                              />
                            </Form.Label>
                            {isEditing ? (
                              <Form.Control
                                type="number"
                                className=""
                                name="weight"
                                value={kpiItem.weight}
                                onChange={(e) => inputhandler(e, idx)}
                                size="sm"
                              />
                            ) : (
                              <small className="sc_cl_div col-12 col-lg-3 d-flex flex-column">
                                {kpiItem.weight}
                              </small>
                            )}
                          </FormGroup>

                          <span className="sc_cl_span red">
                            {kpiError &&
                              kpiError[perspectiveIndex] &&
                              kpiError[perspectiveIndex][businessIndex] &&
                              kpiError[perspectiveIndex][businessIndex][idx] &&
                              kpiError[perspectiveIndex][businessIndex][idx]
                                .weight}
                          </span>
                        </div>
                      </Form>

                      <div
                        className={`${isEditing ? "" : "d-none"
                          } col-1 d-flex flex-column justify-content-evenly`}
                      >
                        {kpidata.length > 0 && isEditing ? (
                          <span className="text-danger sc_cl_remove_btn opacity-50 d-flex  px-2 sc_cl_icons justify-content-center">
                            {kpidata.length > 1 && isEditing ? (
                              <MdDelete
                                onClick={() => {
                                  fnRemoveKpi(idx);
                                }}
                              />
                            ) : (
                              <></>
                            )}
                          </span>
                        ) : (
                          ""
                        )}
                      </div>
                    </Card.Header>

                    <Accordion
                      className={`collapse ${kpiItem.ScKpiDetails ? "show" : ""
                        }`}
                    >
                      <Card.Body className="p-0 px-4 py-2">
                        {
                          <div className=" m-0">
                            <Row className="d-flex flex-column flex-lg-row  my-1">
                              <div className="col-12 col-lg-4 d-flex flex-column">
                                <FormGroup>
                                  <Form.Label className="  ">
                                    Frequency
                                    <sup className="text-danger">*</sup>
                                    <FnTooltipComponent
                                      label={help
                                        .filter(
                                          (user) =>
                                            String(user.context_order) === "13"
                                        )

                                        .map((use) => use.label)}
                                      context={help
                                        .filter(
                                          (user) =>
                                            String(user.context_order) === "13"
                                        )

                                        .map((use) => use.help_context)}
                                      classname={""}
                                      placement="bottom"
                                    />
                                  </Form.Label>

                                  {isEditing ? (
                                    <Form.Select
                                      className={``}
                                      name="frequency"
                                      value={kpiItem.frequency}
                                      size="sm"
                                      onChange={(e) => inputhandler(e, idx)}
                                      disabled={kpiItem.ActulsPre}
                                    >
                                      <option hidden>Select Option</option>
                                      {configdata
                                        .filter(
                                          (data) =>
                                            data.config_type.includes(
                                              "Frequency"
                                            ) && data.is_active
                                        )
                                        .map((temp) => {
                                          return (
                                            <option
                                              className="sc_cl_option"
                                              key={temp.id}
                                              value={temp.config_value}
                                            >
                                              {temp.config_code}
                                            </option>
                                          );
                                        })}
                                    </Form.Select>
                                  ) : (
                                    <small className="sc_cl_div col-12 col-lg-3 d-flex flex-column w-auto">
                                      {kpiItem.frequency}
                                    </small>
                                  )}
                                </FormGroup>
                                <span className="sc_cl_span red">
                                  {kpiError &&
                                    kpiError[perspectiveIndex] &&
                                    kpiError[perspectiveIndex][businessIndex] &&
                                    kpiError[perspectiveIndex][businessIndex][
                                    idx
                                    ] &&
                                    kpiError[perspectiveIndex][businessIndex][
                                      idx
                                    ].frequency}
                                </span>
                              </div>

                              <div className=" col-12 col-lg-4 d-flex flex-column">
                                <Form.Label className="  ">
                                  Period Type{" "}
                                  <sup className="text-danger">*</sup>
                                  <FnTooltipComponent
                                    label={help
                                      .filter(
                                        (user) =>
                                          String(user.context_order) === "14"
                                      )

                                      .map((use) => use.label)}
                                    context={help
                                      .filter(
                                        (user) =>
                                          String(user.context_order) === "14"
                                      )

                                      .map((use) => use.help_context)}
                                    classname={""}
                                    placement="bottom"
                                  />
                                </Form.Label>
                                {isEditing ? (
                                  <Form.Select
                                    className=""
                                    name="period_type"
                                    size="sm"
                                    value={kpiItem.period_type}
                                    onChange={(e) => inputhandler(e, idx)}
                                    disabled={kpiItem.ActulsPre}
                                  >
                                    <option hidden>Select Option</option>
                                    {configdata
                                      .filter(
                                        (data) =>
                                          data.config_type.includes(
                                            "Period Type"
                                          ) && data.is_active
                                      )
                                      .map((temp) => {
                                        return (
                                          <option
                                            className="sc_cl_option"
                                            key={temp.id}
                                            value={temp.config_value}
                                          >
                                            {temp.config_code}
                                          </option>
                                        );
                                      })}
                                  </Form.Select>
                                ) : (
                                  <small className="sc_cl_div col-12 col-lg-3 d-flex flex-column w-auto">
                                    {kpiItem.period_type}
                                  </small>
                                )}
                                <span className="sc_cl_span red">
                                  {kpiError &&
                                    kpiError[perspectiveIndex] &&
                                    kpiError[perspectiveIndex][businessIndex] &&
                                    kpiError[perspectiveIndex][businessIndex][
                                    idx
                                    ] &&
                                    kpiError[perspectiveIndex][businessIndex][
                                      idx
                                    ].period_type}
                                </span>
                              </div>

                              <div className=" col-12 col-lg-4 d-flex flex-column">
                                <Form.Label className="  ">
                                  Measure <sup className="text-danger">*</sup>
                                  <FnTooltipComponent
                                    label={help
                                      .filter(
                                        (user) =>
                                          String(user.context_order) === "15"
                                      )

                                      .map((use) => use.label)}
                                    context={help
                                      .filter(
                                        (user) =>
                                          String(user.context_order) === "15"
                                      )

                                      .map((use) => use.help_context)}
                                    classname={""}
                                    placement="bottom"
                                  />
                                </Form.Label>
                                {isEditing ? (
                                  <Form.Select
                                    className=""
                                    name="measure"
                                    value={kpiItem.measure}
                                    size="sm"
                                    onChange={(e) => inputhandler(e, idx)}
                                    disabled={kpiItem.ActulsPre}
                                  >
                                    <option hidden>Select Option</option>
                                    {configdata
                                      .filter(
                                        (data) =>
                                          data.config_type.includes(
                                            "Measure"
                                          ) && data.is_active
                                      )
                                      .map((temp) => {
                                        return (
                                          <option
                                            className="sc_cl_option"
                                            key={temp.id}
                                            value={temp.config_value}
                                          >
                                            {temp.config_code}
                                          </option>
                                        );
                                      })}
                                  </Form.Select>
                                ) : (
                                  <small className="sc_cl_div col-12 col-lg-3 d-flex flex-column w-auto">
                                    {kpiItem.measure}
                                  </small>
                                )}
                                <span className="sc_cl_span red">
                                  {kpiError &&
                                    kpiError[perspectiveIndex] &&
                                    kpiError[perspectiveIndex][businessIndex] &&
                                    kpiError[perspectiveIndex][businessIndex][
                                    idx
                                    ] &&
                                    kpiError[perspectiveIndex][businessIndex][
                                      idx
                                    ].measure}
                                </span>
                              </div>
                            </Row>

                            <Row className="d-flex flex-column flex-lg-row  my-1">
                              <div className=" col-12 col-lg-4 d-flex flex-column">
                                <Form.Label className="  ">
                                  Baseline <sup className="text-danger">*</sup>
                                  <FnTooltipComponent
                                    label={help
                                      .filter(
                                        (user) =>
                                          String(user.context_order) === "16"
                                      )

                                      .map((use) => use.label)}
                                    context={help
                                      .filter(
                                        (user) =>
                                          String(user.context_order) === "16"
                                      )

                                      .map((use) => use.help_context)}
                                    classname={""}
                                    placement="bottom"
                                  />
                                </Form.Label>
                                {isEditing ? (
                                  <Form.Control
                                    type="number"
                                    className=""
                                    name="baseline"
                                    size="sm"
                                    value={kpiItem.baseline}
                                    onChange={(e) => inputhandler(e, idx)}
                                    disabled={kpiItem.ActulsPre}
                                  />
                                ) : (
                                  <small className="sc_cl_div col-12 col-lg-3 d-flex flex-column w-auto">
                                    {kpiItem.baseline}
                                  </small>
                                )}
                                <span className="sc_cl_span red">
                                  {kpiError &&
                                    kpiError[perspectiveIndex] &&
                                    kpiError[perspectiveIndex][businessIndex] &&
                                    kpiError[perspectiveIndex][businessIndex][
                                    idx
                                    ] &&
                                    kpiError[perspectiveIndex][businessIndex][
                                      idx
                                    ].baseline}
                                </span>
                              </div>

                              <div className=" col-12 col-lg-4 d-flex flex-column">
                                <Form.Label className="  ">
                                  Target <sup className="text-danger">*</sup>
                                  <FnTooltipComponent
                                    label={help
                                      .filter(
                                        (user) =>
                                          String(user.context_order) === "17"
                                      )

                                      .map((use) => use.label)}
                                    context={help
                                      .filter(
                                        (user) =>
                                          String(user.context_order) === "17"
                                      )

                                      .map((use) => use.help_context)}
                                    classname={""}
                                    placement="bottom"
                                  />
                                </Form.Label>
                                {isEditing ? (
                                  <Form.Control
                                    type="number"
                                    className=""
                                    name="target"
                                    size="sm"
                                    value={kpiItem.target}
                                    onChange={(e) => inputhandler(e, idx)}
                                    disabled={kpiItem.ActulsPre}
                                  />
                                ) : (
                                  <small className="sc_cl_div col-12 col-lg-3 d-flex flex-column w-auto">
                                    {kpiItem.target}
                                  </small>
                                )}
                                <span className="sc_cl_span red">
                                  {kpiError &&
                                    kpiError[perspectiveIndex] &&
                                    kpiError[perspectiveIndex][businessIndex] &&
                                    kpiError[perspectiveIndex][businessIndex][
                                    idx
                                    ] &&
                                    kpiError[perspectiveIndex][businessIndex][
                                      idx
                                    ].target}
                                </span>
                              </div>

                              <div className=" col-12 col-lg-4 d-flex flex-column">
                                <Form.Label className="  ">
                                  Minimum <sup className="text-danger">*</sup>
                                  <FnTooltipComponent
                                    label={help
                                      .filter(
                                        (user) =>
                                          String(user.context_order) === "18"
                                      )

                                      .map((use) => use.label)}
                                    context={help
                                      .filter(
                                        (user) =>
                                          String(user.context_order) === "18"
                                      )

                                      .map((use) => use.help_context)}
                                    classname={""}
                                    placement="bottom"
                                  />
                                </Form.Label>
                                {isEditing ? (
                                  <Form.Control
                                    type="number"
                                    className=""
                                    size="sm"
                                    name="min"
                                    value={kpiItem.min}
                                    onChange={(e) => inputhandler(e, idx)}
                                    disabled={kpiItem.ActulsPre}
                                  />
                                ) : (
                                  <small className="sc_cl_div col-12 col-lg-3 d-flex flex-column w-auto">
                                    {kpiItem.min}
                                  </small>
                                )}
                                <span className="sc_cl_span red">
                                  {kpiError &&
                                    kpiError[perspectiveIndex] &&
                                    kpiError[perspectiveIndex][businessIndex] &&
                                    kpiError[perspectiveIndex][businessIndex][
                                    idx
                                    ] &&
                                    kpiError[perspectiveIndex][businessIndex][
                                      idx
                                    ].min}
                                </span>
                              </div>
                            </Row>

                            <Row className="d-flex flex-column flex-lg-row  my-1">
                              <div className=" col-12 col-lg-4 d-flex flex-column">
                                <Form.Label className="  ">
                                  Maximum <sup className="text-danger">*</sup>
                                  <FnTooltipComponent
                                    label={help
                                      .filter(
                                        (user) =>
                                          String(user.context_order) === "19"
                                      )

                                      .map((use) => use.label)}
                                    context={help
                                      .filter(
                                        (user) =>
                                          String(user.context_order) === "19"
                                      )

                                      .map((use) => use.help_context)}
                                    classname={""}
                                    placement="bottom"
                                  />
                                </Form.Label>
                                {isEditing ? (
                                  <Form.Control
                                    type="number"
                                    className=""
                                    size="sm"
                                    name="max"
                                    value={kpiItem.max}
                                    onChange={(e) => inputhandler(e, idx)}
                                    disabled={kpiItem.ActulsPre}
                                  />
                                ) : (
                                  <small className="sc_cl_div col-12 col-lg-3 d-flex flex-column w-auto">
                                    {kpiItem.max}
                                  </small>
                                )}
                                <span className="sc_cl_span red">
                                  {kpiError &&
                                    kpiError[perspectiveIndex] &&
                                    kpiError[perspectiveIndex][businessIndex] &&
                                    kpiError[perspectiveIndex][businessIndex][
                                    idx
                                    ] &&
                                    kpiError[perspectiveIndex][businessIndex][
                                      idx
                                    ].max}
                                </span>
                              </div>

                              <div className=" col-12 col-lg-4 d-flex flex-column">
                                <Form.Label className="  ">
                                  Optimization{" "}
                                  <sup className="text-danger">*</sup>
                                  <FnTooltipComponent
                                    label={help
                                      .filter(
                                        (user) =>
                                          String(user.context_order) === "20"
                                      )

                                      .map((use) => use.label)}
                                    context={help
                                      .filter(
                                        (user) =>
                                          String(user.context_order) === "20"
                                      )

                                      .map((use) => use.help_context)}
                                    classname={""}
                                    placement="bottom"
                                  />
                                </Form.Label>
                                {isEditing ? (
                                  <Form.Select
                                    className=""
                                    size="sm"
                                    name="optimization"
                                    value={kpiItem.optimization}
                                    onChange={(e) => inputhandler(e, idx)}
                                    disabled={kpiItem.ActulsPre}
                                  >
                                    <option hidden>Select Option</option>
                                    {configdata
                                      .filter(
                                        (data) =>
                                          data.config_type.includes(
                                            "Optimization"
                                          ) && data.is_active
                                      )
                                      .map((temp) => {
                                        return (
                                          <option
                                            className="sc_cl_option"
                                            key={temp.id}
                                            value={temp.config_value}
                                          >
                                            {temp.config_code}
                                          </option>
                                        );
                                      })}
                                  </Form.Select>
                                ) : (
                                  <small className="sc_cl_div col-12 col-lg-3 d-flex flex-column w-auto">
                                    {kpiItem.optimization}
                                  </small>
                                )}
                                <span className="sc_cl_span red">
                                  {kpiError &&
                                    kpiError[perspectiveIndex] &&
                                    kpiError[perspectiveIndex][businessIndex] &&
                                    kpiError[perspectiveIndex][businessIndex][
                                    idx
                                    ] &&
                                    kpiError[perspectiveIndex][businessIndex][
                                      idx
                                    ].optimization}
                                </span>
                              </div>

                              <div className=" col-12 col-lg-4 d-flex flex-column">
                                <Form.Label className="  ">
                                  Chart Type{" "}
                                  <sup className="text-danger">*</sup>
                                  <FnTooltipComponent
                                    label={help
                                      .filter(
                                        (user) =>
                                          String(user.context_order) === "21"
                                      )

                                      .map((use) => use.label)}
                                    context={help
                                      .filter(
                                        (user) =>
                                          String(user.context_order) === "21"
                                      )

                                      .map((use) => use.help_context)}
                                    classname={""}
                                    placement="bottom"
                                  />
                                </Form.Label>
                                {isEditing ? (
                                  <Form.Select
                                    className=""
                                    name="chart_type"
                                    size="sm"
                                    value={kpiItem.chart_type}
                                    onChange={(e) => inputhandler(e, idx)}
                                    disabled={kpiItem.ActulsPre}
                                  >
                                    <option hidden>Select Option</option>
                                    {configdata
                                      .filter(
                                        (data) =>
                                          data.config_type.includes(
                                            "Chart Type"
                                          ) && data.is_active
                                      )
                                      .map((temp) => {
                                        return (
                                          <option
                                            className="sc_cl_option"
                                            key={temp.id}
                                            value={temp.config_value}
                                          >
                                            {temp.config_code}
                                          </option>
                                        );
                                      })}
                                  </Form.Select>
                                ) : (
                                  <small className="sc_cl_div col-12 col-lg-3 d-flex flex-column w-auto">
                                    {kpiItem.chart_type}
                                  </small>
                                )}
                                <span className="sc_cl_span red">
                                  {kpiError &&
                                    kpiError[perspectiveIndex] &&
                                    kpiError[perspectiveIndex][businessIndex] &&
                                    kpiError[perspectiveIndex][businessIndex][
                                    idx
                                    ] &&
                                    kpiError[perspectiveIndex][businessIndex][
                                      idx
                                    ].chart_type}
                                </span>
                              </div>
                            </Row>

                            <Row className="d-flex flex-column flex-lg-row my-1">
                              <div className=" col-12 col-lg-4 d-flex flex-column">
                                <Form.Label className="  ">
                                  YTD <sup className="text-danger">*</sup>
                                  <FnTooltipComponent
                                    label={help
                                      .filter(
                                        (user) =>
                                          String(user.context_order) === "22"
                                      )

                                      .map((use) => use.label)}
                                    context={help
                                      .filter(
                                        (user) =>
                                          String(user.context_order) === "22"
                                      )

                                      .map((use) => use.help_context)}
                                    classname={""}
                                    placement="bottom"
                                  />
                                </Form.Label>
                                {isEditing ? (
                                  <Form.Select
                                    className=""
                                    size="sm"
                                    name="ytd"
                                    value={kpiItem.ytd}
                                    onChange={(e) => inputhandler(e, idx)}
                                    disabled={kpiItem.ActulsPre}
                                  >
                                    <option hidden>Select Option</option>
                                    {configdata
                                      .filter(
                                        (data) =>
                                          data.config_type.includes("YTD") &&
                                          data.is_active
                                      )
                                      .map((temp) => {
                                        return (
                                          <option
                                            className="sc_cl_option"
                                            key={temp.id}
                                            value={temp.config_value}
                                          >
                                            {temp.config_code}
                                          </option>
                                        );
                                      })}
                                  </Form.Select>
                                ) : (
                                  <small className="sc_cl_div col-12 col-lg-3 d-flex flex-column w-auto">
                                    {kpiItem.ytd}
                                  </small>
                                )}
                                <span className="sc_cl_span red">
                                  {kpiError &&
                                    kpiError[perspectiveIndex] &&
                                    kpiError[perspectiveIndex][businessIndex] &&
                                    kpiError[perspectiveIndex][businessIndex][
                                    idx
                                    ] &&
                                    kpiError[perspectiveIndex][businessIndex][
                                      idx
                                    ].ytd}
                                </span>
                              </div>

                              <div className=" col-12 col-lg-4 d-flex flex-column">
                                <Form.Label className="  ">
                                  KPI Owner
                                  <sup className="text-danger">*</sup>
                                  <FnTooltipComponent
                                    label={help
                                      .filter(
                                        (user) =>
                                          String(user.context_order) === "23"
                                      )

                                      .map((use) => use.label)}
                                    context={help
                                      .filter(
                                        (user) =>
                                          String(user.context_order) === "23"
                                      )

                                      .map((use) => use.help_context)}
                                    classname={""}
                                    placement="bottom"
                                  />
                                </Form.Label>
                                {isEditing ? (
                                  <Select
                                    className="dropdown"
                                    placeholder="Select Option"
                                    value={options.filter((obj) =>
                                      kpiItem.kpiOwner
                                        ? kpiItem.kpiOwner.includes(obj.value)
                                        : [].includes(obj.value)
                                    )} //
                                    defaultValue={options}
                                    options={options}
                                    onChange={(e) =>
                                      userinputhandler(e, idx, "kpiOwner")
                                    }
                                    isMulti
                                    isClearable
                                    isSearchable
                                  />
                                ) : (
                                  <small className="sc_cl_div col-12 col-lg-3 d-flex flex-column w-auto">
                                    {kpiItem.kpiOwner &&
                                      kpiItem.kpiOwner.length >= 1
                                      ? kpiItem.kpiOwner.map(
                                        (itm) => FoundKpiUser(itm)[0].username
                                      )
                                      : "nill"}
                                  </small>
                                )}

                                <span className="sc_cl_span red">
                                  {kpiError &&
                                    kpiError[perspectiveIndex] &&
                                    kpiError[perspectiveIndex][businessIndex] &&
                                    kpiError[perspectiveIndex][businessIndex][
                                    idx
                                    ] &&
                                    kpiError[perspectiveIndex][businessIndex][
                                      idx
                                    ].kpiOwner}
                                </span>
                              </div>

                              <div className=" col-12 col-lg-4 d-flex flex-column">
                                <Form.Label className=" ">
                                  KPI User
                                  <FnTooltipComponent
                                    label={help
                                      .filter(
                                        (user) => user.context_order === 24
                                      )

                                      .map((use) => use.label)}
                                    context={help
                                      .filter(
                                        (user) =>
                                          String(user.context_order) === "24"
                                      )

                                      .map((use) => use.help_context)}
                                    classname={""}
                                    placement="bottom"
                                  />
                                </Form.Label>
                                {isEditing ? (
                                  <Select
                                    className="dropdown"
                                    placeholder="Select Option"
                                    value={options.filter((obj) =>
                                      kpiItem.kpiUser
                                        ? kpiItem.kpiUser.includes(obj.value)
                                        : [].includes(obj.value)
                                    )}
                                    defaultValue={options}
                                    options={options}
                                    onChange={(e) =>
                                      userinputhandler(e, idx, "kpiUser")
                                    }
                                    isMulti
                                    isClearable
                                    isSearchable
                                  />
                                ) : (
                                  <small className="sc_cl_div col-12 col-lg-3 d-flex flex-column w-auto">
                                    {kpiItem.kpiUser &&
                                      kpiItem.kpiUser.length >= 1
                                      ? kpiItem.kpiUser.map(
                                        (itm) => FoundKpiUser(itm)[0].username
                                      )
                                      : "nill"}
                                  </small>
                                )}
                                <span className="sc_cl_span red d-flex">
                                  {kpiError &&
                                    kpiError[perspectiveIndex] &&
                                    kpiError[perspectiveIndex][businessIndex] &&
                                    kpiError[perspectiveIndex][businessIndex][
                                    idx
                                    ] &&
                                    kpiError[perspectiveIndex][businessIndex][
                                      idx
                                    ].user}
                                </span>
                              </div>
                            </Row>
                          </div>
                        }

                        {
                          <Col>
                            <hr></hr>

                            <div className="sc_cl_indicator_content col-lg-12 col-sm-12 py-2">
                              {kpiItem.Indicators &&
                                kpiItem.Indicators.length !== 0 ? (
                                ""
                              ) : (
                                <>
                                  {isEditing ? (
                                    <div className="element-wrapper d-flex justify-content-end">
                                      <FnBtnComponent
                                        classname="sc_cl_submit_button m-2"
                                        children={"Add Indicators"}
                                        onClick={() => {
                                          fnIndicators(idx);
                                        }}
                                      />
                                    </div>
                                  ) : (
                                    <></>
                                  )}
                                </>
                              )}
                              <div className="sc_cl_indicator_content_inner border col-lg-10">
                                <div>
                                  {kpiItem.Indicators &&
                                    kpiItem.Indicators.length !== 0 ? (
                                    <div className="sc_cl_div col-lg-12 d-flex flex-column flex-lg-row flex-sm-column p-2">
                                      <div className="col-12 col-lg-2 d-flex justify-content-center px-0 px-lg-2 sc_cl_div align-items-center">
                                        Indicators
                                        <span>
                                          <FnTooltipComponent
                                            label={help
                                              .filter(
                                                (user) =>
                                                  String(user.context_order) ===
                                                  "25"
                                              )
                                              .map((use) => use.label)}
                                            context={help
                                              .filter(
                                                (user) =>
                                                  String(user.context_order) ===
                                                  "25"
                                              )
                                              .map((use) => use.help_context)}
                                            classname={""}
                                            placement="bottom"
                                          />
                                        </span>
                                      </div>

                                      <div className="col-12 col-lg-5 d-flex justify-content-center px-0 px-lg-2 align-items-center">
                                        Start
                                        <span>
                                          <FnTooltipComponent
                                            label={help
                                              .filter(
                                                (user) =>
                                                  String(user.context_order) ===
                                                  "26"
                                              )
                                              .map((use) => use.label)}
                                            context={help
                                              .filter(
                                                (user) =>
                                                  String(user.context_order) ===
                                                  "26"
                                              )
                                              .map((use) => use.help_context)}
                                            classname={""}
                                            placement="bottom"
                                          />
                                        </span>
                                      </div>

                                      <div className="col-12 col-lg-5 d-flex justify-content-center px-0 px-lg-2 align-items-center">
                                        End
                                        <span>
                                          <FnTooltipComponent
                                            label={help
                                              .filter(
                                                (user) =>
                                                  String(user.context_order) ===
                                                  "27"
                                              )
                                              .map((use) => use.label)}
                                            context={help
                                              .filter(
                                                (user) =>
                                                  String(user.context_order) ===
                                                  "27"
                                              )
                                              .map((use) => use.help_context)}
                                            classname={""}
                                            placement="bottom"
                                          />
                                        </span>
                                      </div>
                                    </div>
                                  ) : (
                                    ""
                                  )}
                                  {kpiItem.Indicators &&
                                    kpiItem.Indicators.map((kpiItem, indx) => {
                                      return (
                                        <>
                                          <div
                                            className="sc_cl_div col-lg-12 d-flex flex-column flex-lg-row flex-sm-column"
                                            key={indx}
                                          >
                                            <div className="col-12 col-lg-2 d-flex flex-column px-0 px-lg-2 align-items-center sc_cl_div">
                                              <input
                                                type="color"
                                                style={{ background: "none" }}
                                                name="stop_light_indicator"
                                                className="border-0 form-control-sm"
                                                value={
                                                  kpiItem.stop_light_indicator
                                                }
                                                disabled
                                              />
                                            </div>

                                            <div className="col-12 col-lg-5 d-flex flex-column px-0 px-lg-2 sc_cl_div">
                                              <input
                                                type="number"
                                                style={{
                                                  borderColor:
                                                    kpiItem.stop_light_indicator,
                                                }}
                                                name="stop_light_indicator_from"
                                                className="sc_cl_input w-75 m-auto form-control-sm"
                                                value={
                                                  kpiItem.stop_light_indicator_from
                                                }
                                                onChange={(e) =>
                                                  fnIndicatorsinputhandler(
                                                    e,
                                                    indx,
                                                    idx
                                                  )
                                                }
                                                disabled={!isEditing}
                                              />

                                              <span className="sc_cl_span red">
                                                {slierror &&
                                                  slierror[perspectiveIndex] &&
                                                  slierror[perspectiveIndex][
                                                  businessIndex
                                                  ] &&
                                                  slierror[perspectiveIndex][
                                                  businessIndex
                                                  ][idx] &&
                                                  slierror[perspectiveIndex][
                                                  businessIndex
                                                  ][idx][indx] &&
                                                  slierror[perspectiveIndex][
                                                    businessIndex
                                                  ][idx][indx]
                                                    .stop_light_indicator_from}
                                              </span>
                                            </div>

                                            <div className="col-12 col-lg-5 d-flex flex-column px-0 px-lg-2 sc_cl_div">
                                              <input
                                                type="number"
                                                style={{
                                                  borderColor:
                                                    kpiItem.stop_light_indicator,
                                                }}
                                                name="stop_light_indicator_to"
                                                className="sc_cl_input w-75 m-auto form-control-sm"
                                                value={
                                                  kpiItem.stop_light_indicator_to
                                                }
                                                onChange={(e) =>
                                                  fnIndicatorsinputhandler(
                                                    e,
                                                    indx,
                                                    idx
                                                  )
                                                }
                                                disabled={!isEditing}
                                              />
                                              <span className="sc_cl_span red">
                                                {slierror &&
                                                  slierror[perspectiveIndex] &&
                                                  slierror[perspectiveIndex][
                                                  businessIndex
                                                  ] &&
                                                  slierror[perspectiveIndex][
                                                  businessIndex
                                                  ][idx] &&
                                                  slierror[perspectiveIndex][
                                                  businessIndex
                                                  ][idx][indx] &&
                                                  slierror[perspectiveIndex][
                                                    businessIndex
                                                  ][idx][indx]
                                                    .stop_light_indicator_to}
                                              </span>
                                            </div>
                                          </div>
                                        </>
                                      );
                                    })}
                                </div>
                              </div>
                            </div>
                          </Col>
                        }

                        {/* } */}
                      </Card.Body>
                    </Accordion>
                  </Card>
                ) : (
                  <></>
                )}
              </React.Fragment>
            );
          })}
        </Accordion>
      );
    }
  );

  // Root section of the scorecard
  return (
    <>
      {view === undefined ? (
        ""
      ) : (
        <>
          {view === false ? (
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
                  onClick={() => history("/")}
                  children={"Close"}
                  classname={"sc_cl_close_button"}
                ></FnBtnComponent>
              </Modal.Footer>
            </Modal>
          ) : (
            <>
              <div className="sc_cl_div w-100 px-2">
                <div className="d-flex flex-column flex-lg-row sc_cl_row sc_cl_page_header">
                  <div className="align-items-center col-12 col-lg-6 d-flex py-2 text-center">
                    <h5 className="sc_cl_head m-0">Scorecard Details</h5>
                  </div>

                  <div className="align-items-center col-12 col-lg-6 d-flex justify-content-lg-end py-2 text-center">
                    <FnBreadCrumbComponent
                      seperator_symbol={" >"}
                      nav_items={breadcumb_menu}
                    />
                  </div>
                </div>

                <Card className="border-0 shadow-sm w-100 mt-2">
                  <Card.Body>
                    {/* <Row className="sc_cl_row ">
                      <div className="sc_cl_div col-lg-12 d-flex flex-column flex-lg-row flex-sm-column justify-content-between">
                        <div className="col-12 col-lg-4 d-flex flex-column px-0 px-lg-2 sc_cl_div">
                          <Form.Select
                            size="sm"
                            value={table_name_api_query}
                            onChange={(e) => fnSearchScorecard(e)}
                            name="scorecard_name"
                          >
                            <option hidden>Select Scorecard</option>
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
                    </Row> */}

                    <Row className="sc_cl_row">
                      <div className="sc_cl_div col-lg-12 d-flex flex-column flex-lg-row flex-sm-column ">
                        <div className="col-12 col-lg-4 d-flex flex-column px-0 px-lg-2 sc_cl_div">
                          <FnSelectComponent
                            values={search_scorecard}
                            labels={search_scorecard}
                            query={table_name_api_query}
                            setQuery={setTable_name_api_query}
                            PlaceHolder={'Select Scorecard'}
                            multiselect={false}
                            error={SetSearchError}
                          />
                        </div>
                        <div className="d-flex">
                          <FnBtnComponent
                            children={"Filter"}
                            classname={"sc_cl_submit_button m-2"}
                            onClick={() => fnSearchScorecard(table_name_api_query)}
                          />
                          <FnBtnComponent
                            classname={`${getsmpdata.length === 1 ? "d-block" : "d-none"
                              } sc_cl_close_button m-2`}
                            children={"Reset"}
                            onClick={search_refresh}
                          />
                        </div>
                      </div>
                    </Row>

                    <Row className="sc_cl_row d-flex ">
                      <Col className="d-flex flex-column flex-lg-row justify-content-between px-0 px-2 sc_cl_div">
                        <div className="py-4 px-1">
                          <FnBtnComponent
                            children={"Add New Scorecard"}
                            classname={`${add ? "" : "d-none"
                              }  sc_cl_submit_button`}
                            onClick={fnAddDetails}
                          />
                        </div>

                        <div className={`${getsmpdata.length > 0 ? "d-block" : "d-none"
                          } py-4 px-1`}>
                          <span className={`${getsmpdata.length > 0 && getsmpdata[0].publish_flag ? "" : "d-none"}`}>
                            {getsmpdata.length > 0 && getsmpdata[0].publish_flag === 'Y' ?
                              <button className="sc_cl_switch_button float-start bg-opacity-50 bg-success border-0 fw-semibold text-opacity-100 text-success mx-2" disabled>{"Published"}</button>
                              : <button className="sc_cl_switch_button float-start bg-opacity-10 bg-secondary border-0 fw-semibold text-opacity-75 text-secondary mx-2" disabled>{"Drafted"}</button>}
                          </span>
                          <FnBtnComponent
                            children={"Expand All/Collapse All"}
                            classname={`sc_cl_submit_button`}
                            onClick={fnExpandAll}
                          />
                        </div>
                      </Col>
                    </Row>

                    {getsmpdata && getsmpdata.length === 1 && (
                      <Accordion
                        className={`${getsmpdata.length > 0 ? "d-block" : "d-none"
                          }`}
                      >
                        {getsmpdata.map((items, index) => {
                          return (
                            <Card
                              className="border-0 shadow rounded border-bottom-success "
                              key={index}
                            >
                              <Card.Header className="d-flex flex-column flex-lg-row fw-normal">
                                <Col className="col-12 d-flex flex-column flex-lg-row">
                                  <div className="p-1 d-flex align-items-center">
                                    <i
                                      onClick={() => {
                                        let ScData = [...getsmpdata];
                                        ScData[0].ScDetails = !items.ScDetails;
                                        setSmpData(ScData);
                                      }}
                                      className="opacity-75 sc_cl_table_i text-primary"
                                    >
                                      {!items.ScDetails ? (
                                        <AiFillPlusCircle
                                          style={{ cursor: "pointer" }}
                                        />
                                      ) : (
                                        <AiFillMinusCircle
                                          style={{ cursor: "pointer" }}
                                        />
                                      )}
                                    </i>
                                  </div>

                                  <Form className="ms-2 col-11 d-flex flex-column flex-lg-row flex-sm-column justify-content-between text-black ">
                                    <div className="sc_cl_div col-12 col-lg-3 d-flex flex-column w-auto">
                                      <Form.Label className="  aa">
                                        Functional Hierarchy Level{" "}
                                        <sup className="text-danger">*</sup>
                                        <FnTooltipComponent
                                          label={help
                                            .filter(
                                              (user) =>
                                                String(user.context_order) ===
                                                "1"
                                            )

                                            .map((use) => use.label)}
                                          context={help
                                            .filter(
                                              (user) =>
                                                String(user.context_order) ===
                                                "1"
                                            )

                                            .map((use) => use.help_context)}
                                          classname={""}
                                          placement="bottom"
                                        />
                                      </Form.Label>

                                      {isEditing ? (
                                        <Form.Select
                                          onChange={fnInputhandler}
                                          name="functional_hierarchy_level"
                                          className={""}
                                          value={
                                            items.functional_hierarchy_level
                                          }
                                          size="sm"
                                        // disabled={!isEditing}
                                        >
                                          <option hidden>--Select--</option>

                                          {hierarchyleveldata.map(
                                            (level_items, index) => {
                                              return (
                                                <option
                                                  key={index}
                                                  value={
                                                    level_items.functional_level_id
                                                  }
                                                  className="border-0"
                                                >
                                                  {
                                                    level_items.functional_level_code
                                                  }
                                                </option>
                                              );
                                            }
                                          )}
                                        </Form.Select>
                                      ) : (
                                        <small className="sc_cl_div col-12 col-lg-3 d-flex flex-column w-auto">
                                          {hierarchyleveldata.map(
                                            (level_items, index) => {
                                              if (
                                                level_items.functional_level_id ==
                                                items.functional_hierarchy_level
                                              ) {
                                                return level_items.functional_level_code;
                                              } else {
                                              }
                                            }
                                          )}
                                        </small>
                                      )}
                                      <span className="sc_cl_span red">
                                        {error &&
                                          error.functional_hierarchy_level}
                                      </span>
                                    </div>

                                    <div className="sc_cl_div col-12 col-lg-3 d-flex flex-column w-auto">
                                      <FormGroup>
                                        <Form.Label className=" ">
                                          Scorecard Description
                                          <sup className="text-danger">*</sup>
                                          <FnTooltipComponent
                                            label={help
                                              .filter(
                                                (user) =>
                                                  String(user.context_order) ===
                                                  "2"
                                              )

                                              .map((use) => use.label)}
                                            context={help
                                              .filter(
                                                (user) =>
                                                  String(user.context_order) ===
                                                  "2"
                                              )

                                              .map((use) => use.help_context)}
                                            classname={""}
                                            placement="bottom"
                                          />
                                        </Form.Label>
                                        {isEditing ? (
                                          <Form.Control
                                            className=" "
                                            type="text"
                                            name="scorecard_description"
                                            value={
                                              items.scorecard_description || ""
                                            }
                                            onChange={fnInputhandler}
                                            size="sm"
                                          // disabled={!isEditing}
                                          />
                                        ) : (
                                          <small className="sc_cl_div col-12 col-lg-3 d-flex flex-column w-auto">
                                            {items.scorecard_description}
                                          </small>
                                        )}
                                      </FormGroup>

                                      <span className="sc_cl_span red">
                                        {error && error.scorecard_description}
                                      </span>
                                    </div>

                                    <div className="sc_cl_div col-12 col-lg-3 d-flex flex-column w-auto">
                                      <Form.Label className="  mr-2">
                                        From Date{" "}
                                        <sup className="text-danger">*</sup>
                                        <FnTooltipComponent
                                          label={help
                                            .filter(
                                              (user) =>
                                                String(user.context_order) ===
                                                "3"
                                            )

                                            .map((use) => use.label)}
                                          context={help
                                            .filter(
                                              (user) =>
                                                String(user.context_order) ===
                                                "3"
                                            )

                                            .map((use) => use.help_context)}
                                          classname={""}
                                          placement="bottom"
                                        />
                                      </Form.Label>
                                      {isEditing ? (
                                        <>
                                          <DatePicker
                                            className="form-control form-control-sm"
                                            placeholderText={
                                              userSettings && userSettings.date
                                                ? userSettings.date
                                                : process.env
                                                  .REACT_APP_DATE_FORMAT
                                            }
                                            name="from_date"
                                            selected={
                                              items.from_date != ""
                                                ? typeof items.from_date ===
                                                  "string"
                                                  ? formatTime(
                                                    items.from_date,
                                                    "from_date"
                                                  )
                                                  : items.from_date
                                                : "" || ""
                                            }
                                            onChange={(e) =>
                                              fnInputhandler({
                                                target: {
                                                  name: "from_date",
                                                  value: e,
                                                },
                                              })
                                            }
                                            dateFormat={
                                              userSettings && userSettings.date
                                                ? userSettings.date.replace(
                                                  "Do",
                                                  "do"
                                                )
                                                : process.env.REACT_APP_DATE_FORMAT.replace(
                                                  "DD",
                                                  "dd"
                                                ).replace("YYYY", "yyyy")
                                            }
                                            size="sm"
                                          />
                                        </>
                                      ) : (
                                        <small className="sc_cl_div col-12 col-lg-3 d-flex flex-column w-auto">
                                          {moment(items.from_date).format(
                                            "DD-MM-yyyy"
                                          )}
                                        </small>
                                      )}
                                      <span className="sc_cl_span red">
                                        {error && error.from_date}
                                      </span>
                                    </div>

                                    <div className="sc_cl_div col-12 col-lg-3 d-flex flex-column w-auto">
                                      <Form.Label className="  d-inline">
                                        To Date{" "}
                                        <sup className="text-danger">*</sup>
                                        <FnTooltipComponent
                                          label={help
                                            .filter(
                                              (user) =>
                                                String(user.context_order) ===
                                                "4"
                                            )

                                            .map((use) => use.label)}
                                          context={help
                                            .filter(
                                              (user) =>
                                                String(user.context_order) ===
                                                "4"
                                            )

                                            .map((use) => use.help_context)}
                                          classname={""}
                                          placement="bottom"
                                        />
                                      </Form.Label>
                                      {isEditing ? (
                                        <DatePicker
                                          className="form-control form-control-sm"
                                          placeholderText={
                                            userSettings && userSettings.date
                                              ? userSettings.date
                                              : process.env
                                                .REACT_APP_DATE_FORMAT
                                          }
                                          name="to_date"
                                          selected={
                                            items.to_date != ""
                                              ? typeof items.to_date ===
                                                "string"
                                                ? formatTime(
                                                  items.to_date,
                                                  "from_date"
                                                )
                                                : items.to_date
                                              : "" || ""
                                          }
                                          onChange={(e) =>
                                            fnInputhandler({
                                              target: {
                                                name: "to_date",
                                                value: e,
                                              },
                                            })
                                          }
                                          dateFormat={
                                            userSettings && userSettings.date
                                              ? userSettings.date.replace(
                                                "Do",
                                                "do"
                                              )
                                              : process.env.REACT_APP_DATE_FORMAT.replace(
                                                "DD",
                                                "dd"
                                              ).replace("YYYY", "yyyy")
                                          }
                                        // disabled={!isEditing}
                                        />
                                      ) : (
                                        <small className="sc_cl_div col-12 col-lg-3 d-flex flex-column w-auto">
                                          {moment(items.to_date).format(
                                            "DD-MM-yyyy"
                                          )}
                                        </small>
                                      )}
                                      <span className="sc_cl_span red">
                                        {error && error.to_date}
                                      </span>
                                    </div>
                                  </Form>

                                  <div className="col-1 d-flex flex-column justify-content-evenly">
                                    <span
                                      className={`${publish || (getsmpdata && (getsmpdata[0].publish_flag === 'N' || getsmpdata[0].publish_flag === undefined)) ? "d-flex px-2 sc_cl_icons text-success justify-content-center" : "d-none"}`}
                                      style={{ cursor: "pointer" }}
                                    >
                                      <RiEdit2Fill
                                        onClick={() => {
                                          setIsEditing(true);
                                        }}
                                      />
                                    </span>
                                    <span
                                      className={`${isEditing ? "" : "d-none"
                                        } d-flex  px-2 sc_cl_icons text-success justify-content-center`}
                                      style={{ cursor: "pointer" }}
                                    >
                                      <RiAddCircleFill
                                        className="sc_cl_addRowIcon"
                                        onClick={fnAddNewPers}
                                      />
                                    </span>
                                    <span
                                      className={`${isAdd ? "" : "d-none"
                                        } d-flex  px-2 sc_cl_icons text-success justify-content-center`}
                                      style={{ cursor: "pointer" }}
                                    >
                                      {/* <IoCopy
                                        className="sc_cl_addRowIcon"
                                        onClick={fnAddNewPers}
                                      /> */}
                                      <CopyComp />
                                    </span>
                                  </div>
                                </Col>
                              </Card.Header>

                              <Accordion
                                className={`collapse  ${items.ScDetails ? "show" : ""
                                  }`}
                              >
                                <Card.Body className="p-0 px-4">
                                  {items.ScoreCard_Details.length > 0 ? (
                                    <PerspectiveComp
                                      ref={persRef}
                                      idx1={index}
                                      prep_data={items.ScoreCard_Details}
                                    />
                                  ) : (
                                    <></>
                                  )}
                                </Card.Body>
                              </Accordion>
                            </Card>
                          );
                        })}
                      </Accordion>
                    )}

                    <div className="d-flex justify-content-end border-1 p-1">
                      {getsmpdata && getsmpdata.length === 1 ? (
                        <div>
                          <div>
                            <FnBtnComponent
                              children={"Save as Draft"}
                              onClick={fnRootStateUpdateDraft}
                              classname={`${isEditing ? `${getsmpdata && getsmpdata[0].publish_flag === 'Y' ? "d-none" : ""}` : "d-none"
                                } sc_cl_submit_button m-1`}
                            />
                            <FnBtnComponent
                              children={"Save And Publish"}
                              onClick={fnRootStateUpdatePublish}
                              classname={`${isEditing ? `${publish ? "" : "d-none"}` : "d-none"
                                } sc_cl_submit_button m-1`}
                            />
                          </div>
                        </div>
                      ) : (
                        ""
                      )}
                    </div>
                  </Card.Body>
                </Card>
              </div>
            </>
          )}
        </>
      )}
    </>
  );
};

export default FnScorecardReport;