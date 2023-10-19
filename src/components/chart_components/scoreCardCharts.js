/* ============================================================================================================================================================

   CITTABASE SOLUTIONS - All Rights Reserved.
   ------------------------------------------------------------------------------------------------------------------------------------------------------------

   29-Oct-2022   Priya S      Initial Version             V1

   ** This Page is to define Reusable gauge chart component   **

============================================================================================================================================================*/

import React, { useState, useEffect, useContext } from "react";
import { jsPDF } from "jspdf";
import { Col, Row } from "react-bootstrap";
import { BsFillFilePdfFill } from "react-icons/bs";
import AuthContext from "../../context/AuthContext";
import FnLineChartComponent from "./lineChartComponent";
import FnBarChartComponent from "./barChartComponent";
import FnAreaChartComponent from "./areaChartComponent";
import FnScatterChartComponent from "./scatterChartComponent";
import FnPieChartComponent from "./pieChartComponent";
import FnGaugeChartComponent from "./gaugeChartComponent";
import domtoimage from "dom-to-image";
import moment from "moment";

const FnScoreCardCharts = () => {
  let { authTokens } = useContext(AuthContext);
  const [kpiview, setKpiview] = useState([]);

  let fn_get_kpi_details = async () => {
    let res = await fetch(`${process.env.REACT_APP_SERVER_URL}/api/get_kpi_with_actuals/`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        Authorization: "Bearer " + String(authTokens.access),
      },
    });

    let view_data = await res.json();

    if (res.status === 200) {
      if (view_data.length > 0) {
        setKpiview(view_data);
      }
    }
  };

  let kpiview_all = Object.create(null);

  kpiview.forEach((temp) => {
    kpiview_all[temp.id] = {
      kpi_id: temp.id,
      ctype: temp.chart_type,
      min: temp.min,
      max: temp.max,
      target: temp.target,
      kpiname: temp.kpi,
      frequency: temp.frequency,
      period: temp.period.substring(0, 4),
      data: [],
    };
    
  });
  kpiview.forEach((temp) => {
    if (kpiview_all[temp.id].kpi_id === temp.id) {
      kpiview_all[temp.id].data.push({
        ...temp,
        period_date: moment(temp.period).format("DD"),
        period_month: moment(temp.period).format("MMM"),
        period_year: temp.period.substring(0, 4),
         
      });
    }

    kpiview_all[temp.id].data.sort((a, b) => (a.period > b.period ? 1 : -1));
   
  });

  let kpidata = Object.values(kpiview_all);

  // console.log(kpidata,"kpidata")


  useEffect(() => {
    fn_get_kpi_details();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // console.log("kpiview", kpidata.length, kpidata);
  
  function pngDownload() {
    domtoimage
      .toPng(document.getElementById("allcharts"), { bgcolor: "white" })
      .then(function (dataUrl) {
        const pdf = new jsPDF();
        pdf.setFontSize(20);
        pdf.addImage(dataUrl, "png", 22.5, 20, 170, 200);
        pdf.save(`Allcharts.pdf`);
      });
  }

  return (
    <>
      <Row>
        {kpidata.length > 1 && (
          <Row>
            <div className="d-flex justify-content-end mt-3 px-1">
              <BsFillFilePdfFill />
              <button
                className="bg-white border-0 small text-decoration-underline"
                onClick={pngDownload}
              >
                Export ALL(PDF)
              </button>
            </div>
          </Row>
        )}
      </Row>
      <Row id="allcharts">
        {kpidata.map((cd, i) => {
          switch (cd.ctype) {
            case "Bar":
              return (
                <Col
                  key={i}
                  lg={6}
                  sm={12}
                  className="d-flex justify-content-center mb-2"
                >
                  <FnBarChartComponent
                    kpi={cd.data}
                    min={cd.min}
                    max={cd.max}
                    id={cd.kpi_id}
                    kpiname={cd.kpiname}
                  />
                </Col>
              );
            case "Line":
              return (
                <Col
                  key={i}
                  lg={6}
                  sm={12}
                  className="d-flex justify-content-center mb-2"
                >
                  <FnLineChartComponent
                    kpi={cd.data}
                    min={cd.min}
                    max={cd.max}
                    id={cd.kpi_id}
                    kpiname={cd.kpiname}
                  />
                </Col>
              );
            case "Area":
              return (
                <Col
                  key={i}
                  lg={6}
                  sm={12}
                  className="d-flex justify-content-center mb-2"
                >
                  <FnAreaChartComponent
                    kpi={cd.data}
                    min={cd.min}
                    max={cd.max}
                    id={cd.kpi_id}
                    kpiname={cd.kpiname}
                  />
                </Col>
              );
            case "Scatter":
              return (
                <Col
                  key={i}
                  lg={6}
                  sm={12}
                  className="d-flex justify-content-center mb-2"
                >
                  <FnScatterChartComponent
                    kpi={cd.data}
                    min={cd.min}
                    max={cd.max}
                    id={cd.kpi_id}
                    kpiname={cd.kpiname}
                  />
                </Col>
              );
            case "Pie":
              return (
                <Col
                  key={i}
                  lg={6}
                  sm={12}
                  className="d-flex justify-content-center mb-2"
                >
                  <FnPieChartComponent
                    kpi={cd.data}
                    min={cd.min}
                    max={cd.max}
                    id={cd.kpi_id}
                    kpiname={cd.kpiname}
                    period={cd.period}
                  />
                </Col>
              );
            case "Gauge":
              return (
                <Col
                  key={i}
                  lg={6}
                  sm={12}
                  className="d-flex justify-content-center mb-2"
                >
                  <FnGaugeChartComponent
                    kpi={cd.data}
                    min={cd.min}
                    max={cd.max}
                    target={cd.target}
                    id={cd.kpi_id}
                    kpiname={cd.kpiname}
                    period={cd.period}
                  />
                </Col>
              );
              default:
                return (
                  <Col
                    key={i}
                    lg={6}
                    sm={12}
                    className="col-lg-6 justify-content-center p-2"
                  >
                    <FnLineChartComponent
                    kpi={cd.data}
                    min={cd.min}
                    max={cd.max}
                    id={cd.kpi_id}
                    kpiname={cd.kpiname}
                  />
                  </Col>
                );
          }
        })}
      </Row>
    </>
  );
};
export default FnScoreCardCharts;
