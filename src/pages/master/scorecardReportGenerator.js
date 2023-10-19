/* ============================================================================================================================================================

   CITTABASE SOLUTIONS - All Rights Reserved.
   ------------------------------------------------------------------------------------------------------------------------------------------------------------
  
   08-Aug-2022  Arun R      Initial Version             V1
   
   ** This Page is to define org definition details  **
   
============================================================================================================================================================*/

import React, { useState, useContext, useEffect, useRef, createRef } from "react";
import AuthContext from "../../context/AuthContext";
import { Row, Card, Table, Form, Modal } from "react-bootstrap";
import { Link, useNavigate, useParams } from "react-router-dom";
import Swal from "sweetalert2";
import FnBtnComponent from "../../components/buttonComponent";
import Parser from 'html-react-parser';
import { jsPDF } from "jspdf";
import 'jspdf-autotable'
import html2canvas from "html2canvas"
import { DownloadTableExcel, useDownloadExcel } from "react-export-table-to-excel"
import FnExportExcel from "../../components/exportExcel";
import PreContext from "../../context/PreContext";
import FnBreadCrumbComponent from "../../components/breadCrumbComponent";
import logo from '../../Assets/Images/cittabase_logo.png'
import moment from "moment";
// import * as XLSX from 'xlsx-style';
// import { saveAs } from 'file-saver';
import { BiMessageRoundedError } from "react-icons/bi";

const FnScorecardReportGenerator = () => {
  let { authTokens, user } = useContext(AuthContext);
  const navigator = useNavigate();
  let { setisloading } = useContext(PreContext)
  let [adata, setAdata] = useState({
    // created_by: user.user_id,
    // last_updated_by: user.user_id,
  });

  const [error, setError] = useState({});
  const [getscorecard, setScoreCard] = useState([]);
  const [selectedscorecardid, setSelectedscorecardid] = useState('');
  const [getallscorecard, setAllScoreCard] = useState([]);
  const [defaultallscorecard, setDefaultAllScoreCard] = useState([]);
  const [org_indicators, setOrg_indicators] = useState([]);
  const [add, setAdd] = useState(false);
  const [view, setView] = useState();
  const [edit, setEdit] = useState(false);
  const [remove, setRemove] = useState(false);
  const [months, setMonths] = useState(0);
  let [actualmonth, setActualmonth] = useState([]);
  const { id } = useParams();
  const tableRef = useRef(null);;
  let get_all_months = []

  let breadcumb_menu = [
    { Label: "Home", Link: "/" },

    {
      Label: "YTD Summary Report",
    },
  ];

  async function fnGetScorecard() {
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
      setScoreCard(get_scorecard_data);
    }
  }

  const fnGetAllScorecardDetails = async () => {

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

    const actuals_score = await fetch(
      `${process.env.REACT_APP_SERVER_URL}/api/get_kpi_actuals_monthly_score`,
      {
        method: "GET",
        headers: {
          "Content-Type": "application/json",

          Authorization: "Bearer " + String(authTokens.access),
        },
      }
    );

    const org_definition_kpi_indicator_response = await fetch(
      `${process.env.REACT_APP_SERVER_URL}/api/get_org_definition_stop_light_indicators`,
      {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          Authorization: "Bearer " + String(authTokens.access),
        },
      }
    );



    let kpi_details = await kpidetails_response.json();
    let kpi_indicators_details = await kpi_indicator_response.json();

    let kpi_actuals_monthly_score = await actuals_score.json();
    let org_definition_kpi_details =
      await org_definition_kpi_indicator_response.json();
    setOrg_indicators(org_definition_kpi_details);

    const getByIndicators = (id) => {
      return kpi_indicators_details.filter((kpiItems) => kpiItems.kpi_id == id)
    }
    const getByScores = (id) => {
      return kpi_actuals_monthly_score.filter((score) => score.id == id && score.score !== null)
    }

    let getindicators = kpi_details.filter((kpiIdItems) => {
      return (
        (kpiIdItems["Indicators"] = getByIndicators(kpiIdItems.id))
      )
    })

    let getscores = kpi_details.filter((kpiIdItems) => {
      return (
        (kpiIdItems["Scores"] = getByScores(kpiIdItems.id))
      )
    })

    let score_data = []
    kpi_actuals_monthly_score.forEach((data, di) => {
      const alreadyexist = score_data.filter(exist => exist.scorecard_id === data.scorecard_id)
      if (alreadyexist.length === 0) {
        score_data.push({ scorecard_id: data.scorecard_id, scorecard_description: data.scorecard_description, perspective_id: data.perspective_id, objective_id: data.objective_id, ScoreCard_Details: [] })
      }
    });
    
    score_data.forEach((sd, sdi) => {
      kpi_actuals_monthly_score.forEach((sc, sci) => {
        const alreadyexistpers = sd.ScoreCard_Details.filter(exist => (sd.scorecard_id === sc.scorecard_id && sc.perspective_id === exist.perspective_id))
        if (alreadyexistpers.length === 0 && sd.scorecard_id === sc.scorecard_id) {
          sd.ScoreCard_Details.push({ scorecard_id: sc.scorecard_id, perspective_id: sc.perspective_id, perspective_description: sc.perspective_description, BusinessGoal: [] })
        }
      })
    })
    score_data.forEach((sd, sdi) => {
      sd.ScoreCard_Details.forEach((sp, spi) => {
        kpi_actuals_monthly_score.forEach((sp2, sp2i) => {
          const alreadyexistobj = sp.BusinessGoal.filter(exist => (sd.scorecard_id === sp2.scorecard_id && sp2.perspective_id === exist.perspective_id && sp2.objective_id === exist.objective_id))
          if (alreadyexistobj.length === 0 && sp.scorecard_id === sp2.scorecard_id && sp.perspective_id === sp2.perspective_id && sp2.objective_id !== null) {
            const getkpiitems = kpi_details.filter(exist => (sp2.scorecard_id === exist.scorecard_id && sp2.perspective_id === exist.perspective_id && sp2.objective_id === exist.objective_id))
            sp.BusinessGoal.push({ scorecard_id: sp2.scorecard_id, perspective_id: sp2.perspective_id, perspective_description: sp2.perspective_description, objective_id: sp2.objective_id, objective_description: sp2.objective_description, kpi_items: getkpiitems })

          }
        })
      })
    })

    
    setAllScoreCard(score_data);
    setDefaultAllScoreCard(score_data)
  };


  // get a permission for a user group
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
        setRemove(pdata[0].delete === "Y" ? true : false);
        setEdit(pdata[0].edit === "Y" ? true : false);
        setAdd(pdata[0].add === "Y" ? true : false);
        setView(pdata[0].view === "Y" ? true : false);
      }
    }
  };


  // const demo_months = ['Aug-22', 'Sep-22', 'Oct-22', 'Nov-22', 'Dec-22', 'Jan-23', 'Feb-23', 'Mar-23'];



  const ScoreIndicator = (data) => {
    let count_months = 0
    let count_actual_months = []
    let td = ''
    if (data.Scores.length !== 0) {
      get_all_months.map(m => {
        if(data.Scores.filter(psf => psf.actual_month === m).length !== 0){
          data.Scores.filter(sf => sf.actual_month === m).map(s => {
            if (s.score !== null) {
              count_months += 1;
              count_actual_months.push(s.actual_month)
              if (data.Indicators.length !== 0) {
                data.Indicators.map(indicate => {
                  if(s.score > 100 && indicate.stop_light_indicator_to == 100){
                    td = td + `<td style="text-align: center;color: white;vertical-align: middle;background:${indicate.stop_light_indicator};">
                              100
                              </td>`
                  }
                  if(s.score <= 0 && (indicate.stop_light_indicator_from === 1 || indicate.stop_light_indicator_from === 0)){
                    td = td + `<td style="text-align: center;color: white;vertical-align: middle;background:${indicate.stop_light_indicator};">
                              0
                              </td>`
                  }
                  if (s.score >= indicate.stop_light_indicator_from &&
                    s.score <= indicate.stop_light_indicator_to) {
                      td = td + `<td style="text-align: center;color: white;vertical-align: middle;background:${indicate.stop_light_indicator};">
                                  ${s.score}
                                </td>`
                  }
                })
              } else {
                org_indicators.map(indicate => {
                  // if(s.score > 100 && indicate.stop_light_indicator_to === 100){
                  //   td = td + `<td style="text-align: center;color: white;vertical-align: middle;background:${indicate.stop_light_indicator};">
                  //   ${s.score}
                  //   </td>`
                  // }
                  if(s.score > 100 && indicate.stop_light_indicator_to === 100){
                    td = td + `<td style="text-align: center;color: white;vertical-align: middle;background:${indicate.stop_light_indicator};">
                    100
                    </td>`
                  }
                  if(s.score <= 0 && (indicate.stop_light_indicator_from === 1 || indicate.stop_light_indicator_from === 0)){
                    td = td + `<td style="text-align: center;color: white;vertical-align: middle;background:${indicate.stop_light_indicator};">
                              0
                              </td>`
                  }
                  if (s.score >= indicate.stop_light_indicator_from &&
                    s.score <= indicate.stop_light_indicator_to) {
                    td = td + `<td style="text-align: center;color: white;vertical-align: middle;background:${indicate.stop_light_indicator};">
                              ${s.score}
                              </td>`
                  }
                })
              }
              // td = td+`<td style="color: white;background: lightgreen;">${s.jan_score}</td>`
            }
          })
        }else{
          td = td+`<td></td>`
        }
      })
    } else {
      for (let i = 0; i < [...new Set(actualmonth)].length; i++) {
        td = td + '<td style="text-align: center;color: lightgrey;">--</td>'
      }
    }
    count_actual_months.map(t => {
      actualmonth.push(t)
    })

    setMonths([...new Set(actualmonth)].length)
    // return Parser(td)
    return td
  }

  const FnScoreCard_Details = ({ data }) => {
    setMonths(0)
    let td = ''
    data.map(sd => {
      if (sd.BusinessGoal.length <= 1) {
        td = td + `<tr><td>${sd.perspective_description}</td>`
        sd.BusinessGoal.map(bg => {
          td = td + `<td>${bg.objective_description}</td>`
          if (bg.kpi_items.length <= 1) {
            bg.kpi_items.map(ki => {
              td = td + `<td>${ki.kpi}${ki.Indicators.length !== 0 ? ' *' : ''}</td>`
              td = td + ScoreIndicator(ki)
            })
          } else {
            let i = Number(bg.kpi_items.length) - 1
            bg.kpi_items.map((ki, index) => {
              td = td + `<td>${ki.kpi}${ki.Indicators.length !== 0 ? ' *' : ''}</td>`
              td = td + ScoreIndicator(ki)
              if (index < i) {
                // td = td + `<tr><td colSpan=${bg.kpi_items.length-1}></td>`
                td = td + `<tr><td colSpan=${2}></td>`
              }
            })
          }
        })
        td = td + `</tr>`
      } else {
        td = td + `<tr><td>${sd.perspective_description}</td>`
        let goals_index = Number(sd.BusinessGoal.length) - 1
        sd.BusinessGoal.map((bg, index) => {
          let sd_index = Number(sd.BusinessGoal.length) - 1
          td = td + `<td>${bg.objective_description}</td>`
          if (bg.kpi_items.length <= 1) {
            bg.kpi_items.map(ki => {
              td = td + `<td>${ki.kpi}${ki.Indicators.length !== 0 ? ' *' : ''}</td>`
              td = td + ScoreIndicator(ki)
            })
            if (index < sd_index) {
              td = td + `<tr><td></td>`
            }
          } else {
            let i = Number(bg.kpi_items.length) - 1
            bg.kpi_items.map((ki, index) => {
              td = td + `<td>${ki.kpi}${ki.Indicators.length !== 0 ? ' *' : ''}</td>`
              td = td + ScoreIndicator(ki)
              if (index < i) {
                td = td + `<tr><td></td><td></td>`
              } else {
                td = td + `<tr><td></td>`
              }
            })
          }

        })
        td = td + `</tr>`
      }
    }
      // td = td + `<tr><td>${sd.perp_code}</td></tr>`
    )
    // setActualmonth([...new Set(actualmonth)])
    return Parser(td)
  }


  const ExportToExcel = () => {
    let filename = getallscorecard.map(name => name.scorecard_description)
    return <DownloadTableExcel
      filename={filename}
      sheet="report"
      currentTableRef={tableRef.current}
    >

      <button className={`sc_cl_submit_button m-2`}> Export excel </button>

    </DownloadTableExcel>
  }


  const downloadPDF = () => {
    let filename = getallscorecard.map(name => name.scorecard_description)
    const pdf = new jsPDF({
      orientation: 'l',
      unit: 'mm',
      format: 'a4'
    });
    pdf.page = 1;
    pdf.autoTable({
      html: '#table1',
      theme: 'grid',  //grid,plain,striped
      styles: { halign: 'center' },
      rowStyles: {
        0: { halign: 'right', cellWidth: 100, cellHeight: 50, fillColor: [232, 252, 245] }
      },
      didDrawCell: function (data) {
        if (data.row.index === 0 && data.cell.section === 'head') {
          // pdf.setFillColor(67, 160, 71);
          data.cell.styles.fillColor = '#ffffff';
          var td = data.cell.raw;
          var img = td.getElementsByTagName('img')[0];
          // var ldim = data.cell.height - data.cell.padding('vertical');
          var ldim = data.cell.height - data.cell.padding('vertical');
          var wdim = 20;
          pdf.addImage(logo, data.cell.x, data.cell.y, wdim, ldim);
        }
      },
      didParseCell: function (data) {
        // if(data.row.index === 1 && data.cell.section === 'head'){
        //   data.cell.styles.fillColor = '#d3d3d3';
        //   data.cell.styles.textColor = '#000000';
        // }
        if (data.cell.section === 'body') {
          if (data.cell.text == 'Legends') {
            data.cell.styles.fillColor = '#d3d3d3';
            data.cell.styles.textColor = '#000000';
          }
          if (data.cell.text == '1% - 25%') {
            data.cell.styles.fillColor = 'red';
            data.cell.styles.textColor = '#ffffff';
          }
          if (data.cell.text == '26% - 50%') {
            data.cell.styles.fillColor = 'FF9900';
            data.cell.styles.textColor = '#ffffff';
          }
          if (data.cell.text == '51% - 75%') {
            data.cell.styles.fillColor = '99CC66';
            data.cell.styles.textColor = '#ffffff';
          }
          if (data.cell.text == '76% - 100%') {
            data.cell.styles.fillColor = '006633';
            data.cell.styles.textColor = '#ffffff';
          }
        }
        if (data.column.index >= 3 && data.cell.section === 'body') {
          if (String(data.cell.text) !== '') {
            org_indicators.map(indicate => {
              if(String(data.cell.text) > 100 && indicate.stop_light_indicator_to === 100){
                data.cell.styles.fillColor = indicate.stop_light_indicator;
                data.cell.styles.textColor = '#ffffff';
              }
              if(String(data.cell.text) <= 0 && indicate.stop_light_indicator_from === 1){
                data.cell.styles.fillColor = indicate.stop_light_indicator;
                data.cell.styles.textColor = '#ffffff';
              }
              if (String(data.cell.text) >= indicate.stop_light_indicator_from &&
                String(data.cell.text) <= indicate.stop_light_indicator_to) {
                data.cell.styles.fillColor = indicate.stop_light_indicator;
                data.cell.styles.textColor = '#ffffff';
              }
            })
          }
        }
        if (data.row.index === 0 && data.cell.section === 'head') {
          data.cell.styles.fillColor = '#ffffff';
        }
        if (data.row.index === 1 && data.cell.section === 'head') {
          data.cell.styles.fillColor = '#d3d3d3';
          data.cell.styles.textColor = '#000000';
          data.cell.styles.borderColor = '#000000';
        }
        if (data.row.index === 2 && data.cell.section === 'head') {
          data.cell.styles.fillColor = '#d3d3d3';
          data.cell.styles.textColor = '#000000';
        }
      },
      // set page number
      didDrawPage: function (data) {
        // console.log(pdf.lastAutoTable.finalY)
        pdf.setFontSize(10);
        // pdf.text('checking');
        pdf.text(150, 200, String(pdf.page)); //print number bottom right
        pdf.page++;
      }
    })
    pdf.setFontSize(10);
    pdf.text(15, pdf.lastAutoTable.finalY+10, "* - Indicator Parameter defined at Specific KPI")
    // pdf.output('dataurlnewwindow');  //preview to new tab
    pdf.save(filename + '.pdf')
  }

  useEffect(() => {
    fnGetPermissions();
    fnGetScorecard();
    fnGetAllScorecardDetails();
  }, []);
  const fnInputHandler = (e) => {
    setisloading(true)
    setActualmonth([])
    if (e.target.value !== '') {
      setSelectedscorecardid(e.target.value)
      setAllScoreCard(defaultallscorecard.filter(data => Number(data.scorecard_id) === Number(e.target.value)))
    } else {
      setAllScoreCard(defaultallscorecard)
    }
    setAdata({ ...adata, [e.target.name]: e.target.value });
    setError({ ...error, [e.target.name]: "" });
    setisloading(false)

  };
  

  if(getallscorecard.length === 1){
    getallscorecard.forEach(l1 => {
      l1.ScoreCard_Details && l1.ScoreCard_Details.forEach(l2 => {
        l2.BusinessGoal && l2.BusinessGoal.forEach(l3 => {
          l3.kpi_items.length > 0 && l3.kpi_items.forEach(l4 => {
            l4.Scores.length > 0 && l4.Scores.forEach(last => {
              get_all_months.push(last.actual_month)
            })
          })
        })
      })
    })
    get_all_months = [...new Set(get_all_months)].sort((a,b) => moment(a,'MMM-YY').format('YYYY-MM-DD') > moment(b,'MMM-YY').format('YYYY-MM-DD')  ? 1 : -1)
  }

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
            <h5 className="sc_cl_head m-0">YTD Summary Report</h5>
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
                {/* <label className="sc_cl_label">Scorecard</label> */}
                {/* <label className="py-2 strong h6">Filter Scorecard <sup className="text-danger">*</sup></label> */}
                <Form.Select
                  size="sm"
                  value={adata.scorecard_id}
                  onChange={(e) => fnInputHandler(e)}
                  name="scorecard_id"
                >
                    <option hidden>Select a Scorecard</option>
                  {/* <option value=''>Select All</option> */}
                  {getscorecard.length !== 0 ? (
                    getscorecard.map((scorecard_items, idx) => (
                      <option value={scorecard_items.id} key={idx}>
                        {scorecard_items.scorecard_description}
                      </option>
                    ))
                  ) : (
                    <option disabled>Scorecard not available</option>
                  )}

                </Form.Select>
              </div>
              {getallscorecard.length === 1 && <div className="col-12 col-lg-4 px-0 px-lg-2 sc_cl_div">
                <Table className="table-bordered tb_sc_legend ">
                  <tbody>
                    <tr>
                      <td className="bg_red"></td><td>1% - 25%</td>
                    </tr>
                    <tr>
                      <td className="bg_orange"></td><td>26% - 50%</td>
                    </tr>
                    <tr>
                      <td className="bg_green"></td><td>51% - 75%</td>
                    </tr>
                    <tr>
                      <td className="bg_darkgreen"></td><td>76% - 100%</td>
                    </tr>
                  </tbody>
                </Table>
                <p className="tb_sc_text_legend"><span className="hashkey">*</span> - Indicator Parameter defined at Specific KPI</p>
              </div>}
            </div>
          </Row>
          {
            getallscorecard.length === 1 &&
            selectedscorecardid !== '' &&
            <>
              <Row className="sc_cl_row py-0 py-lg-2">
                {/* <p className="sc_cl_div text-center"> Report</p> */}
                <div className="sc_cl_div mt-2 overflow-auto" style={{ maxHeight: '300px', fontSize: '10px' }} id="report" ref={tableRef}>
                  <div id="pdf-report">
                    <Table className="table table-bordered w-100 border" style={{ border: '1px solid black' }} id="table1">
                      {getallscorecard.map((a, i) =>
                        <>
                          <thead>
                            <tr>
                              <th className="text-center" colSpan={3+months} style={{ background: '#f7f7f7', color: '#141414' }}>{getallscorecard.map(name => name.scorecard_description)}</th>
                            </tr>
                            <tr style={{ background: '#f5f4f4', color: 'black' }} className="fw-semibold">
                              <td>Perspective</td>
                              <td>Objective</td>
                              <td>KPI</td>
                              {
                                [...new Set(actualmonth)].sort((a,b) => moment(a,'MMM-YY').format('YYYY-MM-DD') > moment(b,'MMM-YY').format('YYYY-MM-DD')  ? 1 : -1).map((m,i) => {
                                  return <th key={i} style={{whiteSpace : 'nowrap'}}>{m}</th>
                                })
                              }
                            </tr>
                          </thead>
                          <tbody>

                            <FnScoreCard_Details data={a.ScoreCard_Details} />

                          </tbody>
                        </>
                      )}
                      <tbody>
                        <tr></tr>
                        <tr></tr>
                      </tbody>
                      <tbody hidden>
                        <tr><td colSpan={3+months}></td></tr>
                        <tr><td colSpan={3+months}></td></tr>
                        <tr><th style={{ background: 'lightskyblue', color: 'black' }}>Legends</th></tr>
                        <tr>
                          <td style={{ background: 'red', minWidth: '20px', color: 'white', textAlign: 'center' }}>1% - 25%</td>
                        </tr>
                        <tr>
                          <td style={{ background: 'rgb(255, 165, 0)', minWidth: '20px', color: 'white', textAlign: 'center' }}>26% - 50%</td>
                        </tr>
                        <tr>
                          <td style={{ background: 'rgb(118, 185, 71)', minWidth: '20px', color: 'white', textAlign: 'center' }}>51% - 75%</td>
                        </tr>
                        <tr>
                          <td style={{ background: 'rgb(17, 101, 48)', minWidth: '20px', color: 'white', textAlign: 'center' }}>76% - 100%</td>
                        </tr>
                      </tbody>
                    </Table>
                    {/* <Table className="col-12 col-lg-4 table-bordered tb_sc_legend w-25" id="legend-table" style={{border:'1px solid black'}} hidden>
                    <tbody>
                      <tr><td colSpan={2} style={{textAlign:'center', background:'lightskyblue',color:'black'}}>Legends</td></tr>
                      <tr>
                        <td style={{background:'red',minWidth: '20px'}}></td><td>1% - 25%</td>
                      </tr>
                      <tr>
                        <td style={{background:'rgb(255, 165, 0)',minWidth: '20px'}}></td><td>26% - 50%</td>
                      </tr>
                      <tr>
                        <td style={{background:'rgb(118, 185, 71)',minWidth: '20px'}}></td><td>51% - 75%</td>
                      </tr>
                      <tr>
                        <td style={{background:'rgb(17, 101, 48)',minWidth: '20px'}}></td><td>76% - 100%</td>
                      </tr>
                    </tbody>
                  </Table> */}
                  </div>
                </div>
              </Row>
              <Row className="sc_cl_row py-2">
                <div className="sc_cl_div text-center">
                  <FnBtnComponent
                    onClick={downloadPDF}             //generatePDF
                    children={"Export to PDF"}
                    classname={`${add ? "" : "d-none"} sc_cl_submit_button m-2`}
                  />
                  <ExportToExcel />
                  {/* <button onClick={handleExport}>Export to Excel</button> */}
                </div>
              </Row>
            </>
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

export default FnScorecardReportGenerator;
