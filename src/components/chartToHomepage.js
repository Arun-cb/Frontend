import React, { useEffect, useState } from "react";
import { Card } from "react-bootstrap";
import moment from "moment";
import { DragDropContext, Draggable, Droppable } from "react-beautiful-dnd";
import FnLineChartComponent from "./chart_components/lineChartComponent";
import FnBarChartComponent from "./chart_components/barChartComponent";
import FnPieChartComponent from "./chart_components/pieChartComponent";
import FnGaugeChartComponent from "./chart_components/gaugeChartComponent";
import FnScatterChartComponent from "./chart_components/scatterChartComponent";
import FnAreaChartComponent from "./chart_components/areaChartComponent";
import { RiEdit2Fill, RiSave2Fill } from "react-icons/ri";
import Tooltip from "react-bootstrap/Tooltip";
import OverlayTrigger from "react-bootstrap/OverlayTrigger";
import FnPinToDashboard from "./pinToDashboard";
import jwtDecode from "jwt-decode";

export default function FnChartToHomepage() {
  let user = jwtDecode(localStorage.getItem("authTokens"))
  let [authTokens, setAuthTokens] = useState(() =>
    localStorage.getItem("authTokens")
      ? JSON.parse(localStorage.getItem("authTokens"))
      : null
  );

  const [getchartpindata, setChartPinData] = useState([]);
  const [getrender, setRender] = useState([]);

  const [getChartOrder, setChartOrder] = useState([]);

  const [getDragEnabled, setDragEnabled] = useState(false);

  const fngetAndMerge = async () => {
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

    const pinChart_request = await fetch(
      `${process.env.REACT_APP_SERVER_URL}/api/get_pin_chart_homepage/${user.user_id}`,
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

    let kpiactual_response = await kpiactual_request.json();

    let pinChart_response = await pinChart_request.json();

    let kpidetails_response = await kpidetails_request.json();

    const combinedData = pinChart_response.map((data) => {
      const kpiName = kpidetails_response.find(
        (item) => item.id === data.kpi_id
      );
      return {
        ...data,
        kpi: kpiName.kpi,
        max: kpiName.max,
        min: kpiName.min,
        frequency: kpiName.frequency,
        target: kpiName.target,
        measure: kpiName.measure,
        id: kpiName.id,
      };
    });

    const finalMergedData = combinedData.map((items) => {
      const matchedActual = kpiactual_response.filter(
        (data) => data.kpi_id == items.id
      );
      return {
        ...items,
        kpiActualData: matchedActual,
      };
    });

    const reorderChats = finalMergedData.sort(
      (a, b) => a.order_no - b.order_no
    );

    setChartPinData(finalMergedData);
    setRender(reorderChats);
  };

  useEffect(() => {
    fngetAndMerge();

    fetch(`${process.env.REACT_APP_SERVER_URL}/api/get_pin_chart_homepage/${user.user_id}`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        Authorization: "Bearer " + String(authTokens.access),
      },
    })
      .then((response) => response.json())
      .then((data) => {
        setChartOrder(data);
      });
  }, []);

  function handleDragEnd(resultDrag) {
    if (!resultDrag.destination) return;

    const dragChart = Array.from(getrender);

    const sourceOrderNo = dragChart[resultDrag.source.index].order_no;
    const destinationOrderNo = dragChart[resultDrag.destination.index].order_no;

    const sourceItem = dragChart.find(
      (item) => item.order_no === sourceOrderNo
    );
    const destinationItem = dragChart.find(
      (item) => item.order_no === destinationOrderNo
    );

    sourceItem.order_no = destinationOrderNo;
    destinationItem.order_no = sourceOrderNo;

    dragChart.sort((a, b) => a.order_no - b.order_no);

    setRender(dragChart);

    let reorderedChartsOrderNo = dragChart.map(({ kpi_id, order_no }) => ({
      kpi_id,
      order_no,
    }));

    fetch(`${process.env.REACT_APP_SERVER_URL}/api/upd_order_no`, {
      method: "PUT",
      body: JSON.stringify(reorderedChartsOrderNo),
      headers: {
        "Content-Type": "application/json",
        Authorization: "Bearer " + String(authTokens.access),
      },
    });
  }

  const LineChartComp = ({ data, kpiName, kpiMax, measure, kpiFrequency, kpiTarget }) => {

    const formattedDate = formatPeriodToMonthNames(data);
    return (
      <FnLineChartComponent
        kpi={formattedDate}
        max={kpiMax}
        kpiname={kpiName}
        measure={measure}
        exportRestrict={true}
        target={kpiTarget}
        frequency={kpiFrequency}
      />
    );
  };

  const BarChartComp = ({ barData, kpiName, kpiMax, measure, kpiTarget, kpiFrequency }) => {
    const formattedBarChartData = formatPeriodToMonthNames(barData);
    return (
      <FnBarChartComponent
        kpi={formattedBarChartData}
        max={kpiMax}
        kpiname={kpiName}
        measure={measure}
        exportRestrict={true}
        target={kpiTarget}
        frequency={kpiFrequency}
      />
    );
  };

  const PieChartComp = ({ pieChartData, kpiName, measure }) => {
    const formattedPieChartData = formatPeriodToMonthNames(pieChartData);
    return (
      <FnPieChartComponent
        kpi={formattedPieChartData}
        kpiname={kpiName}
        measure={measure}
        exportRestrict={true}
      />
    );
  };

  const GuageChartComp = ({ guageChartData, kpiName, kpiMax, kpiMin, kpiTarget, kpiid, measure }) => {
    const formattedPieChartData = formatPeriodToMonthNames(guageChartData);
    return (
      <FnGaugeChartComponent
        kpi={formattedPieChartData}
        kpiname={kpiName}
        // max={kpiMax}
        exportRestrict={true}
        id={kpiid}
        target={kpiTarget}
        // min={kpiMin}
        measure={measure}
      />
    );
  };

  const ScatterChartComp = ({ scatterChartData, kpiName, kpiMax, measure, kpiTarget, kpiFrequency }) => {
    const formattedScatterChartData =
      formatPeriodToMonthNames(scatterChartData);
    return (
      <FnScatterChartComponent
        kpi={formattedScatterChartData}
        kpiname={kpiName}
        max={kpiMax}
        target={kpiTarget}
        measure={measure}
        exportRestrict={true}
        frequency={kpiFrequency}
      />
    );
  };

  const AreaChartComp = ({ areaChartData, kpiName, kpiMax, measure, kpiTarget, kpiFrequency }) => {
    const formattedScatterChartData = formatPeriodToMonthNames(areaChartData);
    return (
      <FnAreaChartComponent
        kpi={formattedScatterChartData}
        kpiname={kpiName}
        max={kpiMax}
        target={kpiTarget}
        measure={measure}
        exportRestrict={true}
        frequency={kpiFrequency}
      />
    );
  };

  const formatPeriodToMonthNames = (data) => {
    return data.map((item) => {
      const monthDate = moment(item.period).format("DD");
      const monthName = moment(item.period).format("MMM");
      const yearValue = item.period.substring(0, 4);
      return {
        ...item,
        period_date: monthDate,
        period_month: monthName,
        period_year: yearValue,
      };
    });
  };

  const handleButtonClick = () => {
    setDragEnabled((prevIsDragEnabled) => !prevIsDragEnabled);
  };

  return (
    <div>
      <div className="d-flex justify-content-end">
        {getrender.length > 1 ? (
          <button
            onClick={handleButtonClick}
            className="bg-transparent border-0 text-decoration-underline text-primary"
          >
            {!!getDragEnabled ? (
              <OverlayTrigger
                placement={"left"}
                overlay={
                  <Tooltip>
                    <i>{"Save Layout"}</i>
                  </Tooltip>
                }
              >
                <i className="ms-1">
                  <RiSave2Fill className="sc_cl_addRowIcon" />
                </i>
              </OverlayTrigger>
            ) : (
              <OverlayTrigger
                placement={"left"}
                overlay={
                  <Tooltip>

                    <i>{"Edit Layout"}</i>
                  </Tooltip>
                }
              >
                <i className="ms-1">
                  <RiEdit2Fill className="hovercls" />
                </i>
              </OverlayTrigger>
            )}
          </button>
        ) : null}
      </div>
      <div>
        <FnPinToDashboard />
      </div>
      {!getDragEnabled ? (
        <div className=" sc_cl_chart_alignment mt-2">
          {getrender.map((items, index) => {
            switch (items.chart_type) {
              case "Bar":
                return (
                  <div key={index}>
                    <BarChartComp
                      barData={items.kpiActualData}
                      kpiName={items.kpi}
                      kpiMax={items.max}
                      measure={items.measure}
                      kpiTarget={items.target}
                      kpiFrequency={items.frequency}
                    />
                  </div>
                );

              case "Pie":
                return (
                  <div key={index}>
                    <PieChartComp
                      pieChartData={items.kpiActualData}
                      kpiName={items.kpi}
                      kpiMax={items.max}
                      measure={items.measure}
                    />
                  </div>
                );

              case "Gauge":
                return (
                  <div key={index}>
                    <GuageChartComp
                      guageChartData={items.kpiActualData}
                      kpiName={items.kpi}
                      kpiMax={items.max}
                      kpiMin={items.min}
                      kpiid={items.id}
                      kpiTarget={items.target}
                      measure={items.measure}
                    />
                  </div>
                );

              case "Scatter":
                return (
                  <div key={index}>
                    <ScatterChartComp
                      scatterChartData={items.kpiActualData}
                      kpiName={items.kpi}
                      kpiMax={items.max}
                      kpiTarget={items.target}
                      measure={items.measure}
                      kpiFrequency={items.frequency}
                    />
                  </div>
                );

              case "Area":
                return (
                  <div key={index}>
                    <AreaChartComp
                      areaChartData={items.kpiActualData}
                      kpiName={items.kpi}
                      kpiMax={items.max}
                      kpiTarget={items.target}
                      measure={items.measure}
                      kpiFrequency={items.frequency}
                    />
                  </div>
                );

              default:
                return (
                  <div key={index}>
                    <LineChartComp
                      data={items.kpiActualData}
                      kpiName={items.kpi}
                      kpiMax={items.max}
                      measure={items.measure}
                      kpiTarget={items.target}
                      kpiFrequency={items.frequency}
                    />
                  </div>
                );
            }
          })}
        </div>
      ) : (
        <DragDropContext onDragEnd={handleDragEnd}>
          <Droppable droppableId="id">
            {(provided) => (
              <div
                {...provided.droppableProps}
                ref={provided.innerRef}
                className="sc_cl_chart_alignment mt-2"
              >
                {getrender.map(
                  ({ id, kpi_id, kpi, kpiActualData, chart_type, frequency, measure, max, min, target }, index) => {
                    switch (chart_type) {
                      case "Bar":
                        return (
                          <Draggable
                            key={id}
                            draggableId={kpi_id.toString()}
                            index={index}
                          >
                            {(provided) => (

                              <div
                                style={{ height: "500px" }}
                                ref={provided.innerRef}
                                {...provided.draggableProps}
                                {...provided.dragHandleProps}
                              >
                                <BarChartComp
                                  barData={kpiActualData}
                                  kpiName={kpi}
                                  measure={measure}
                                  max={max}
                                  target={target}
                                  frequency={frequency}
                                />
                              </div>

                            )}
                          </Draggable>
                        );

                      case "Pie":
                        return (
                          <Draggable
                            key={id}
                            draggableId={kpi_id.toString()}
                            index={index}
                          >
                            {(provided) => (
                              <div style={{ height: "500px" }}
                                ref={provided.innerRef}
                                {...provided.draggableProps}
                                {...provided.dragHandleProps}
                              >
                                <PieChartComp
                                  pieChartData={kpiActualData}
                                  kpiName={kpi}
                                  measure={measure}
                                />
                              </div>
                            )}
                          </Draggable>
                        );

                      case "Gauge":
                        return (
                          <Draggable
                            key={id}
                            draggableId={kpi_id.toString()}
                            index={index}
                          >
                            {(provided) => (
                              <div style={{ height: "500px" }}
                                ref={provided.innerRef}
                                {...provided.draggableProps}
                                {...provided.dragHandleProps}
                              >
                                <GuageChartComp
                                  guageChartData={kpiActualData}
                                  kpiName={kpi}
                                  measure={measure}
                                  min={min}
                                  max={max}
                                  target={target}
                                />
                              </div>
                            )}
                          </Draggable>
                        );

                      case "Scatter":
                        return (
                          <Draggable
                            key={id}
                            draggableId={kpi_id.toString()}
                            index={index}
                          >
                            {(provided) => (
                              <div style={{ height: "500px" }}
                                ref={provided.innerRef}
                                {...provided.draggableProps}
                                {...provided.dragHandleProps}
                              >
                                <ScatterChartComp
                                  scatterChartData={kpiActualData}
                                  kpiName={kpi}
                                  measure={measure}
                                  max={max}
                                  target={target}
                                  frequency={frequency}
                                />
                              </div>
                            )}
                          </Draggable>
                        );

                      case "Area":
                        return (
                          <Draggable
                            key={id}
                            draggableId={kpi_id.toString()}
                            index={index}
                          >
                            {(provided) => (
                              <div style={{ height: "500px" }}
                                ref={provided.innerRef}
                                {...provided.draggableProps}
                                {...provided.dragHandleProps}
                              >
                                <AreaChartComp
                                  areaChartData={kpiActualData}
                                  kpiName={kpi}
                                  measure={measure}
                                  max={max}
                                  target={target}
                                  frequency={frequency}
                                />
                              </div>
                            )}
                          </Draggable>
                        );

                      default:
                        return (
                          <Draggable
                            key={id}
                            draggableId={id.toString()}
                            index={index}
                          >
                            {(provided) => (
                              <div style={{ height: "500px" }}
                              ref={provided.innerRef}
                              {...provided.draggableProps}
                              {...provided.dragHandleProps}
                              >
                                <LineChartComp
                                  data={kpiActualData}
                                  kpiName={kpi}
                                  measure={measure}
                                  max={max}
                                  target={target}
                                  frequency={frequency}
                                />
                              </div>
                            )}
                          </Draggable>
                        );
                    }
                  }
                )}
                {provided.placeholder}
              </div>
            )}
          </Droppable>
        </DragDropContext>
      )}
    </div>
  );
}

