import React, { Children, useContext, useEffect, useState } from "react";
import {
  Button,
  Card,
  Col,
  Dropdown,
  Form,
  FormGroup,
  InputGroup,
  Modal,
  NavItem,
} from "react-bootstrap";
import AuthContext from "../../context/AuthContext";
import { Container, Row } from "react-bootstrap";
import "bootstrap/dist/css/bootstrap.min.css";
import Fn_Select_Component from "../../components/selectComponent";
import { RiEdit2Fill } from "react-icons/ri";
import FnFormComponent from "../../components/formComponent";

const Fn_Kpi_add = ({
  sc_id,
  obj_id,
  per_id,
  sc_details_id,
  update_data,
  flag,
  tot,
  setGetkpi,
  allgetkpi,
  sample_data,
  reload,
}) => {
  const [showmodal, setModal] = useState(false);
  let { authTokens, user } = useContext(AuthContext);
  let [errors, setErrors] = useState([]);
  const [alluser, setAlluser] = useState([]);
  const [user_per, setUser_per] = useState([]);
  const [KpiId, setKpiId] = useState(1);
  const [MesureDisable, setMesureDisable] = useState(false);
  // * from error
  const [frerror, setFrerror] = useState([{}, {}, {}, {}]);

  // * to error
  const [toerror, setToerror] = useState([{}, {}, {}, {}]);

  const [query, setQuery] = useState([
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
  ]);


  const [showdiv, setShowDiv] = useState(false);

  const fn_showdiv = () => {
    setShowDiv(true);
  };

  function range(start, end) {
    let ans = [];
    for (let i = start; i <= end; i++) {
      ans.push(i);
    }
    return ans;
  }

  const [getkpi, setKpi] = useState([
    {
      created_by: user.user_id,
      last_updated_by: user.user_id,
      scorecard_id:
        sample_data && sample_data.scorecard_id
          ? sample_data.scorecard_id
          : sc_id,
      perspective_id:
        sample_data && sample_data.scorecard_details_id
          ? sample_data.scorecard_details_id
          : per_id,
      scorecard_details_id:
        sample_data && sample_data.scorecard_details_id
          ? sample_data.scorecard_details_id
          : sc_details_id,
      objective_id: sample_data && sample_data.id ? sample_data.id : obj_id,
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
      YTD: "",
      indicators: [],
    },
  ]);

  const KpiInputHandler = (e,i) => {
    // name, value
    let newformValues = [...getkpi];
    newformValues[i][e.target.name] = e.target.value;
    setKpi(newformValues);
    e.preventDefault();
    // setKpi((prevState) => ({
    //   ...prevState,
    //   [name]: value
    // }))

    // const kpierrors = { ...errors }
    // setErrors(kpierrors)
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
  };

  const getUserAccessDetails = async (id) => {
    let res = await fetch(
      `${process.env.REACT_APP_SERVER_URL}/api/get_kpi_user_access`,
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
        let list = [];
        let temp_kpi_user = data.filter((item) => item.kpi_id == id);
        temp_kpi_user.map((item) => {
          list.push(item.user_id);
        });
        getkpi[0]["access_users"] = list;
        setUser_per(list);
      }
    } else {
      alert("errors", data);
    }
  };

  const get_kpi_indicators = async (id) => {
    let res1 = await fetch(
      `${process.env.REACT_APP_SERVER_URL}/api/get_kpi_stop_light_indicators_id/${id}/`,
      {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          Authorization: "Bearer " + String(authTokens.access),
        },
      }
    );
    let data1 = await res1.json();
    if (res1.status === 200) {
      if (data1.length > 0) {
        getkpi[0]["indicators"] = data1;
        setQuery(data1);
      }
    }
  };

  useEffect(() => {
    if (update_data) {
      setKpi([update_data]);
      if (update_data.id) {
        getUserAccessDetails(update_data.id);
        get_kpi_indicators(update_data.id);
      }
      if (update_data.indicators) {
        setQuery([...update_data.indicators]);
      }
      if (update_data.access_users > 0) {
        setUser_per([...update_data.access_users]);
        setErrors({ ...errors, user_permission: "" });
      }
    } else {
      setUser_per([]);
    }
    getUserDetails();
  }, []);

  useEffect(() => {
    if (!showmodal && !update_data) {
      setKpi([
        {
          created_by: user.user_id,
          last_updated_by: user.user_id,
          scorecard_id:
            sample_data && sample_data.scorecard_id
              ? sample_data.scorecard_id
              : sc_id,
          perspective_id:
            sample_data && sample_data.scorecard_details_id
              ? sample_data.scorecard_details_id
              : per_id,
          scorecard_details_id:
            sample_data && sample_data.scorecard_details_id
              ? sample_data.scorecard_details_id
              : sc_details_id,
          objective_id: sample_data && sample_data.id ? sample_data.id : obj_id,
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
          indicators: [],
        },
      ]);
      setQuery([
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
      ]);
      setUser_per([]);
      setErrors([]);
    }
    fnGetActualsData(getkpi[0]);
  }, [showmodal]);

  function between(value, first, last) {
    let lower = Math.min(first, last),
      upper = Math.max(first, last);
    return value >= lower && value <= upper;
  }

  async function fn_user_access_details() {
    let list1 = [];

    user_per.length > 0
      ? update_data
        ? user_per.map((users, index) => {
          list1.push({
            created_by: user.user_id,
            last_updated_by: user.user_id,
            user_id: users,
            kpi_id: update_data.id,
          });
        })
        : user_per.map((users, index) => {
          list1.push({
            created_by: user.user_id,
            last_updated_by: user.user_id,
            user_id: users,
            kpi_id: KpiId,
          });
        })
      : user_per.map((users, index) => {
        list1.push({
          created_by: user.user_id,
          last_updated_by: user.user_id,
          user_id: users,
          kpi_id: update_data.id,
        });
      });

    const kpi_user_access_response = await fetch(
      `${process.env.REACT_APP_SERVER_URL}/api/ins_kpi_user_access`,
      {
        method: "POST",
        body: JSON.stringify(list1),
        headers: {
          "Content-Type": "application/json",
          Authorization: "Bearer " + String(authTokens.access),
        },
      }
    );
    let data = await kpi_user_access_response.json();
    if (
      kpi_user_access_response.status === 200 ||
      kpi_user_access_response.status === 201
    ) {
      if (data.length > 0) {
        alert("KPI success");
      }
    } else {
      alert("errors", data);
    }
  }

  async function fn_submit_kpi() {
    let null_flag = true;
    let null_flag_lt = true;
    let null_flag_range = false;
    let null_start = true;

    // ! null parent
    for (let i = 0; i < query.length; i++) {
      if (
        Number.isNaN(Number(query[i]["stop_light_indicator_from"])) === true ||
        Number(query[i]["stop_light_indicator_from"]) === 0
      ) {
        null_start = true;
        // break;
      } else {
        null_start = false;
        break;
      }

      if (
        Number.isNaN(Number(query[i]["stop_light_indicator_to"])) === true ||
        Number(query[i]["stop_light_indicator_to"]) === 0
      ) {
        null_start = true;
        // break;
      } else {
        null_start = false;
        break;
      }
    }

    if (null_start === false) {
      // todo null
      for (let i = 0; i < query.length; i++) {
        if (
          Number(query[i]["stop_light_indicator_from"]) === null ||
          Number.isNaN(Number(query[i]["stop_light_indicator_from"])) === true
        ) {
          let list = [...frerror];
          list[i]["stop_light_indicator_from"] = "Can`t be null value";
          setFrerror(list);
          null_flag = true;
          break;
        } else {
          let list = [...frerror];
          list[i]["stop_light_indicator_from"] = "";
          setFrerror(list);
          null_flag = false;
        }

        if (
          Number(query[i]["stop_light_indicator_to"]) == null ||
          Number.isNaN(Number(query[i]["stop_light_indicator_to"])) === true
        ) {
          let list = [...toerror];
          list[i]["stop_light_indicator_to"] = "Can`t be null value";
          setToerror(list);
          null_flag = true;
          break;
        } else {
          let list = [...toerror];
          list[i]["stop_light_indicator_to"] = "";
          setToerror(list);
          null_flag = false;
        }
      }
      // todo end

      // todo From > To and max
      if (null_flag === false) {
        for (let i = 0; i < query.length; i++) {
          if (
            Number(query[i]["stop_light_indicator_from"]) <
            Number(query[i]["stop_light_indicator_to"]) &&
            Number(query[i]["stop_light_indicator_from"]) >= 0 &&
            Number(query[i]["stop_light_indicator_from"]) <= 100
          ) {
            let list = [...frerror];
            list[i]["stop_light_indicator_from"] = "";
            setFrerror(list);
            null_flag_lt = false;
            if (
              Number(query[i]["stop_light_indicator_to"]) >
              Number(query[i]["stop_light_indicator_from"]) &&
              Number(query[i]["stop_light_indicator_to"]) >= 0 &&
              Number(query[i]["stop_light_indicator_to"]) <= 100
            ) {
              let list = [...toerror];
              list[i]["stop_light_indicator_to"] = "";
              setToerror(list);
              null_flag_lt = false;
            } else {
              let list = [...toerror];
              list[i]["stop_light_indicator_to"] =
                "To should be greater than from and between 0 to 100";
              setToerror(list);
              null_flag_lt = true;
              break;
            }
          } else {
            let list = [...frerror];
            list[i]["stop_light_indicator_from"] =
              "From should be Lesser than to and between 0 to 100";
            setFrerror(list);
            null_flag_lt = true;
            // break;
            if (
              Number(query[i]["stop_light_indicator_to"]) >
              Number(query[i]["stop_light_indicator_from"]) &&
              Number(query[i]["stop_light_indicator_to"]) >= 0 &&
              Number(query[i]["stop_light_indicator_to"]) <= 100
            ) {
              let list = [...toerror];
              list[i]["stop_light_indicator_to"] = "";
              setToerror(list);
              null_flag_lt = false;
            } else {
              let list = [...toerror];
              list[i]["stop_light_indicator_to"] =
                "To should be greater than from and between 0 to 100";
              setToerror(list);
              null_flag_lt = true;
              break;
            }
          }
        }
      }
      // todo end

      // todo range
      if (null_flag === false && null_flag_lt === false) {
        let ar = [];
        for (let i = 0; i < query.length; i++) {
          ar.push(
            range(
              Number(query[i]["stop_light_indicator_from"]),
              Number(query[i]["stop_light_indicator_to"])
            )
          );
        }
        let new_ar;
        for (let i = ar.length - 1; i >= 0; i--) {
          for (let j = i - 1; j >= 0; j--) {
            new_ar = ar[i].filter((x) => ar[j].includes(x));
            if (new_ar.length > 0) {
              let list_fr = [...frerror];
              list_fr[i]["stop_light_indicator_from"] =
                "Enter a valid from value";
              setFrerror(list_fr);
              null_flag_range = true;

              let list_to = [...toerror];
              list_to[i]["stop_light_indicator_to"] = "Enter a valid to value";
              setToerror(list_to);
              null_flag_range = true;
              break;
            } else {
              let list_fr = [...frerror];
              list_fr[i]["stop_light_indicator_from"] = "";
              setFrerror(list_fr);

              let list_to = [...toerror];
              list_to[i]["stop_light_indicator_to"] = "";
              setToerror(list_to);
            }
          }
        }
      }
      // todo range end
    }

    // if (
    //   null_flag === false &&
    //   null_flag_lt === false &&
    //   null_flag_range === false
    //  &&
    // null_start === false
    // true
    // ) {
    let red_flag = false;
    let baseline, weight, target, user_permission;

    if (
      between(getkpi[0].baseline, getkpi[0].min, getkpi[0].max) ||
      getkpi[0].baseline == undefined
    ) {
      baseline = " ";
      red_flag = true;
    } else {
      baseline = "baseline limit exceds";
      red_flag = false;
    }

    if (
      between(getkpi[0].target, getkpi[0].min, getkpi[0].max) ||
      getkpi[0].target == undefined
    ) {
      target = " ";
      red_flag ? (red_flag = true) : (red_flag = false);
    } else {
      target = " target limit exceds";
      red_flag = false;
    }

    if (
      getkpi[0].weight <= 100 ||
      100 - tot - getkpi[0].weight >= 0 ||
      getkpi[0].weight == undefined
    ) {
      weight = " ";
      red_flag ? (red_flag = true) : (red_flag = false);
    } else {
      weight = " weight limits exceds";
      red_flag = false;
    }

    if (user_per.length > 0) {
      user_permission = " ";
      red_flag ? (red_flag = true) : (red_flag = false);
    } else {
      user_permission = " Feild is required ";
      red_flag = false;
    }

    if (red_flag === false) {
      setErrors({ ...errors, weight, baseline, target, user_permission });
    } else if (red_flag === true && null_start === true) {
      setErrors({ ...errors, weight, baseline, target });

      // getkpi[0]['indicators'] = query
      query.forEach((element) => {
        if (Object.keys(element).length > 3) {
          getkpi[0]["indicators"] = query;
        }
      });
      getkpi[0]["access_users"] = user_per;

      if (!update_data) {
        setGetkpi([...allgetkpi, ...getkpi]);
      }

      reload(true);
      setModal(false);
    } else if (
      red_flag === true &&
      null_start === false &&
      null_flag === false &&
      null_flag_lt === false &&
      null_flag_range === false
    ) {
      setErrors({ ...errors, weight, baseline, target });

      // getkpi[0]['indicators'] = query
      query.forEach((element) => {
        if (Object.keys(element).length > 3) {
          getkpi[0]["indicators"] = query;
        }
      });
      getkpi[0]["access_users"] = user_per;

      if (!update_data) {
        setGetkpi([...allgetkpi, ...getkpi]);
      }

      reload(true);
      setModal(false);
    }

    // }
  }

  const InputHandler2 = (e, i) => {
    let newformValues = [...query];
    newformValues[i][e.target.name] = e.target.value;
    setQuery(newformValues);
  };

  const fnGetActualsData = async (data) => {
    let samp = data;
    const get_samp_request = await fetch(
      `${process.env.REACT_APP_SERVER_URL}/api/smp_get_kpi/${samp.id ? samp.id : 0
      }/${samp.scorecard_id ? samp.scorecard_id : 0}/${samp.perspective_id ? samp.perspective_id : 0
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
      if (get_samp_data.length > 0) {
        setMesureDisable(true);
      } else {
        setMesureDisable(false);
      }
      // setKpiDettails(get_kpi_details_data)
    }
  };

  return (
    <div className="d-flex">
      {update_data ? (
        <div>
          <p
            onClick={() => setModal(true)}
            className="d-flex m-0 px-2 sc_cl_icons text-success"
            style={{ cursor: "pointer" }}
          >
            <RiEdit2Fill />
          </p>
        </div>
      ) : (
        <div>
          <p
            onClick={() => {
              setModal(true);
            }}
            className="d-flex m-0 px-2 py-1 text-decoration-underline text-primary fw-semibold"
            style={{ cursor: "pointer" }}
          >
            Add New KPI+
          </p>
        </div>
      )}

      <Modal
        show={showmodal}
        onHide={() => setModal(false)}
        backdrop="static"
        size="lg"
      >
        <Modal.Header closeButton>
          <h4>KPI Details</h4>
        </Modal.Header>
        <Modal.Body>
          <Container>
            <Row className="d-flex flex-row justify-content-between px-1 py-2">
              <div>
                <label>
                  Users<sup className="text-danger">*</sup>
                </label>
                <div className="w-50">
                  <Fn_Select_Component
                    values={alluser.map((e) => e.id)}
                    labels={alluser.map((e) => e.username)}
                    query={user_per}
                    setQuery={setUser_per}
                    multiselect={true}
                  />
                </div>
                <span className="sc_cl_span red">
                  {errors && errors.user_permission}
                </span>
              </div>
            </Row>
            {getkpi
              ? getkpi.map((kpi_items, kpi_index) => (
                <Row>
                  <Card className="border mt-2" key={kpi_index}>
                    <Card.Body className="d-flex flex-column px-0 py-1">
                      {/* <FnFormComponent fields={kpiFeildData} select={selectedValue} errorcode={errors} formData ={getkpi} onchange={KpiInputHandler}/> */}
                      <Col key={kpi_index}>
                        <Form className="d-flex flex-column flex-lg-row justify-content-between w-100 ">
                          <div className="col-12 col-lg-3">
                            <FormGroup>
                              <Form.Label className="m-0">
                                KPI Code<sup className="text-danger">*</sup>
                              </Form.Label>

                              <Form.Control
                                size="sm"
                                name="kpi_code"
                                value={kpi_items.kpi_code}
                                onChange={(e) =>
                                  KpiInputHandler(kpi_index, e)
                                }
                              />
                            </FormGroup>
                            <span className="sc_cl_span red">
                              {errors && errors.kpi_code}
                            </span>
                          </div>
                          <div className="col-12 col-lg-3">
                            <FormGroup>
                              <Form.Label className="m-0">
                                KPI<sup className="text-danger">*</sup>
                              </Form.Label>
                              <Form.Control
                                size="sm"
                                name="kpi"
                                value={kpi_items.kpi || ""}
                                onChange={(e) =>
                                  KpiInputHandler(kpi_index, e)
                                }
                              />
                            </FormGroup>
                            <span className="sc_cl_span red">
                              {errors && errors.kpi}
                            </span>
                          </div>
                          <div className="col-12 col-lg-3">
                            <FormGroup>
                              <Form.Label>
                                Frequency
                                <sup className="text-danger">*</sup>
                              </Form.Label>
                              <Form.Select
                                size="sm"
                                onChange={(e) =>
                                  KpiInputHandler(kpi_index, e)
                                }
                                name="frequency"
                                value={kpi_items.frequency || ""}
                              >
                                <option hidden>Select Option</option>
                                <option value={kpi_items.daily}>Daily</option>
                                <option value={kpi_items.weekly}>
                                  Weekly
                                </option>
                                <option value={kpi_items.fortnightly}>
                                  Fortnightly
                                </option>
                                <option value={kpi_items.monthly}>
                                  Monthly
                                </option>
                                <option value={kpi_items.quarterly}>
                                  Quarterly
                                </option>
                                <option value={kpi_items.halfyearly}>
                                  Half-yearly
                                </option>
                                <option value={kpi_items.annualy}>
                                  Annualy
                                </option>
                              </Form.Select>
                            </FormGroup>
                            <span className="sc_cl_span red">
                              {errors && errors.frequency}
                            </span>
                          </div>
                        </Form>
                      </Col>
                      <Col className="mt-2">
                        <Form className="d-flex flex-column flex-lg-row justify-content-between w-100 ">
                          <div className="col-12 col-lg-3">
                            <FormGroup>
                              <Form.Label>
                                Period Type
                                <sup className="text-danger">*</sup>
                              </Form.Label>
                              <Form.Select
                                size="sm"
                                onChange={(e) =>
                                  KpiInputHandler(kpi_index, e)
                                }
                                name="period_type"
                                value={kpi_items.period_type}
                              >
                                <option hidden>Select Option</option>
                                <option value={getkpi.beginning}>
                                  Beginning
                                </option>
                                <option value={getkpi.end}>End</option>
                              </Form.Select>
                            </FormGroup>
                            <span className="sc_cl_span red">
                              {errors && errors.period_type}
                            </span>
                          </div>

                          <div className="col-12 col-lg-3 d-flex">
                            <FormGroup className="w-100">
                              <div>
                                <Form.Label className="m-0">
                                  YTD<sup className="text-danger">*</sup>
                                </Form.Label>
                                <Form.Select
                                  size="sm"
                                  onChange={(e) =>
                                    KpiInputHandler(kpi_index, e)
                                  }
                                  name="ytd"
                                  value={kpi_items.ytd}
                                >
                                  <option hidden>Select Option</option>
                                  <option value={"Avg"}>Average</option>
                                  <option value={"Sum"}>Sum</option>
                                  <option value={"Min"}>Minimum</option>
                                  <option value={"Max"}>Maximum</option>
                                </Form.Select>
                              </div>
                              <div>
                                <span className="sc_cl_span red">
                                  {errors && errors.YTD}
                                </span>
                              </div>
                            </FormGroup>
                          </div>

                          <div className="col-12 col-lg-3">
                            <FormGroup>
                              <Form.Label>
                                Measure<sup className="text-danger">*</sup>
                              </Form.Label>
                              <Form.Select
                                size="sm"
                                onChange={(e) =>
                                  KpiInputHandler(kpi_index, e)
                                }
                                name="measure"
                                value={kpi_items.measure}
                                disabled={MesureDisable}
                              >
                                <option hidden>Select Option</option>
                                <option value={getkpi.number}>Number</option>
                                <option value={getkpi.precentage}>
                                  Precentage
                                </option>
                                <option value={getkpi.boolean}>
                                  Boolean
                                </option>
                                <option value={getkpi.Date}>Date</option>
                              </Form.Select>
                            </FormGroup>
                            <span className="sc_cl_span red">
                              {errors && errors.measure}
                            </span>
                          </div>
                        </Form>
                      </Col>

                      <Col className="mt-2">
                        <Form className="d-flex flex-column flex-lg-row justify-content-between w-100 ">
                          <div className="col-12 col-lg-3">
                            <FormGroup>
                              <div>
                                <Form.Label>
                                  Optimization
                                  <sup className="text-danger">*</sup>
                                </Form.Label>
                                <Form.Select
                                  size="sm"
                                  onChange={(e) =>
                                    KpiInputHandler(kpi_index, e)
                                  }
                                  name="optimization"
                                  value={kpi_items.optimization}
                                >
                                  <option hidden>Select Option</option>
                                  <option value={getkpi.minimum}>
                                    Minimum
                                  </option>
                                  <option value={getkpi.maximum}>
                                    Maximum
                                  </option>
                                </Form.Select>
                              </div>
                              <div>
                                <span className="sc_cl_span red">
                                  {errors && errors.optimization}
                                </span>
                              </div>
                            </FormGroup>
                          </div>
                          <div className="col-12 col-lg-3 d-flex">
                            <FormGroup className="w-100">
                              <div>
                                <Form.Label className="m-0">
                                  Min<sup className="text-danger">*</sup>
                                </Form.Label>
                                <Form.Control
                                  size="sm"
                                  type="number"
                                  name="min"
                                  value={kpi_items.min}
                                  onChange={(e) =>
                                    KpiInputHandler(kpi_index, e)
                                  }
                                />
                              </div>
                              <div>
                                <span className="sc_cl_span red">
                                  {errors && errors.min}
                                </span>
                              </div>
                            </FormGroup>
                          </div>
                          <div className="col-12 col-lg-3 d-flex">
                            <FormGroup className="w-100">
                              <div>
                                <Form.Label className="m-0">
                                  Max<sup className="text-danger">*</sup>
                                </Form.Label>
                                <Form.Control
                                  size="sm"
                                  type="number"
                                  name="max"
                                  value={kpi_items.max}
                                  onChange={(e) =>
                                    KpiInputHandler(kpi_index, e)
                                  }
                                />
                              </div>
                              <div>
                                <span className="sc_cl_span red">
                                  {errors && errors.max}
                                </span>
                              </div>
                            </FormGroup>
                          </div>
                        </Form>
                      </Col>

                      <Col className="mt-2 my-1">
                        <Form className="d-flex flex-column flex-lg-row justify-content-between w-100 ">
                          <div className="col-12 col-lg-3 d-flex">
                            <FormGroup className="w-100">
                              <div>
                                <Form.Label className="m-0">
                                  Baseline
                                  <sup className="text-danger">*</sup>
                                </Form.Label>
                                <Form.Control
                                  size="sm"
                                  type="number"
                                  name="baseline"
                                  value={kpi_items.baseline}
                                  onChange={(e) =>
                                    KpiInputHandler(kpi_index, e)
                                  }
                                />
                              </div>
                              <div>
                                <span className="sc_cl_span red">
                                  {errors && errors.baseline}
                                </span>
                              </div>
                            </FormGroup>
                          </div>
                          <div className="col-12 col-lg-3 d-flex">
                            <FormGroup className="w-100">
                              <div>
                                <Form.Label className="m-0">
                                  Target<sup className="text-danger">*</sup>
                                </Form.Label>
                                <Form.Control
                                  size="sm"
                                  type="number"
                                  name="target"
                                  value={kpi_items.target}
                                  onChange={(e) =>
                                    KpiInputHandler(kpi_index, e)
                                  }
                                />
                              </div>
                              <div>
                                <span className="sc_cl_span red">
                                  {errors && errors.target}
                                </span>
                              </div>
                            </FormGroup>
                          </div>

                          <div className="col-12 col-lg-3 d-flex">
                            <FormGroup className="w-100">
                              <div>
                                <Form.Label className="m-0">
                                  Chart Type
                                  <sup className="text-danger">*</sup>
                                </Form.Label>
                                <Form.Select
                                  size="sm"
                                  onChange={(e) =>
                                    KpiInputHandler(kpi_index, e)
                                  }
                                  name="chart_type"
                                  value={kpi_items.chart_type}
                                >
                                  <option hidden>Select Option</option>
                                  <option value={"graph"}>Graph</option>
                                  <option value={"line"}>Line Chart</option>
                                  <option value={"bar"}>Bar Chart</option>
                                  <option value={"doughnut"}>
                                    Doughnut Chart
                                  </option>
                                  <option value={"pie"}>Pie Chart</option>
                                  <option value={"area"}>Area Chart</option>
                                  <option value={"scatter"}>
                                    Scatter Chart
                                  </option>
                                </Form.Select>
                              </div>
                              <div>
                                <span className="sc_cl_span red">
                                  {errors && errors.chart_type}
                                </span>
                              </div>
                            </FormGroup>
                          </div>
                        </Form>
                      </Col>
                      <Col>
                        <div className="col-12 d-flex flex-column flex-lg-row justify-content-start mt-2">
                          <p
                            className={`m-0 text-primary ${showdiv ? "d-none" : "d-block"
                              }`}
                            onClick={fn_showdiv}
                          >
                            + Add/Edit KPI Indicators
                          </p>
                        </div>
                        {showdiv ? (
                          <Row className="sc_cl_row py-0 py-lg-2">
                            <div className="sc_cl_div col-lg-12 d-flex flex-column flex-lg-row flex-sm-column ">
                              <label className="form-label col-12 col-lg-4 d-flex flex-column px-0 px-lg-2 align-items-center">
                                Indicators
                              </label>

                              <label className="form-label col-12 col-lg-4 d-flex flex-column px-0 px-lg-2 align-items-center">
                                Start
                              </label>

                              <label className="form-label col-12 col-lg-4 d-flex flex-column px-0 px-lg-2 align-items-center">
                                End
                              </label>
                            </div>

                            {query.map((temp, i) => {
                              return (
                                <Row className="sc_cl_row py-2" key={i}>
                                  <div className="sc_cl_div col-lg-12 d-flex flex-column flex-lg-row flex-sm-column justify-content-between">
                                    <div className="col-12 col-lg-4 d-flex flex-column px-0 px-lg-2 align-items-center sc_cl_div">
                                      <input
                                        type="color"
                                        name="stop_light_indicator"
                                        className="border-0"
                                        value={
                                          temp.stop_light_indicator || ""
                                        }
                                        onChange={(e) => InputHandler2(e, i)}
                                        disabled
                                      />
                                    </div>

                                    <div className="col-12 col-lg-4 d-flex flex-column px-0 px-lg-2 sc_cl_div">
                                      <input
                                        type="number"
                                        name="stop_light_indicator_from"
                                        className="sc_cl_input w-100"
                                        value={
                                          temp.stop_light_indicator_from || ""
                                        }
                                        onChange={(e) => InputHandler2(e, i)}
                                        placeholder="Enter From value"
                                      />
                                      <span className="red" key={i}>
                                        {
                                          frerror[i][
                                          "stop_light_indicator_from"
                                          ]
                                        }
                                      </span>
                                    </div>

                                    <div className="col-12 col-lg-4 d-flex flex-column px-0 px-lg-2 sc_cl_div">
                                      <input
                                        type="number"
                                        name="stop_light_indicator_to"
                                        className="sc_cl_input w-100"
                                        value={
                                          temp.stop_light_indicator_to || ""
                                        }
                                        onChange={(e) => InputHandler2(e, i)}
                                        placeholder="Enter To value"
                                      />
                                      <span className="red">
                                        {
                                          toerror[i][
                                          "stop_light_indicator_to"
                                          ]
                                        }
                                        { }
                                      </span>
                                    </div>
                                  </div>
                                </Row>
                              );
                            })}
                          </Row>
                        ) : (
                          ""
                        )}
                      </Col>
                    </Card.Body>
                  </Card>
                </Row>
              ))
              : ""}
          </Container>
        </Modal.Body>
        <Modal.Footer>
          {update_data ? (
            <button onClick={fn_submit_kpi} className="btn btn-success shadow">
              Update KPI
            </button>
          ) : (
            <button onClick={fn_submit_kpi} className="btn btn-primary shadow">
              Save KPI
            </button>
          )}

          <Button
            variant="secondary"
            onClick={() => {
              setModal(false);
            }}
            className="shadow"
          >
            close
          </Button>
        </Modal.Footer>
      </Modal>
    </div>
  );
};

export default Fn_Kpi_add;
