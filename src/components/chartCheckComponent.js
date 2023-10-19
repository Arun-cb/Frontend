import moment from "moment";
import React, { useContext, useState, useEffect } from "react";
import { Card, Form } from "react-bootstrap";
import AuthContext from "../context/AuthContext";
import FnToastMessageComp from "./toastMessageComponent";
import { BsFillPinFill, BsFillPinAngleFill } from "react-icons/bs";
import jwtDecode from "jwt-decode";
import FnLineChartComponent from "./chart_components/lineChartComponent";
import FnBarChartComponent from "./chart_components/barChartComponent";
import FnAreaChartComponent from "./chart_components/areaChartComponent";
import FnGaugeChartComponent from "./chart_components/gaugeChartComponent";
import FnPieChartComponent from "./chart_components/pieChartComponent";
import FnScatterChartComponent from "./chart_components/scatterChartComponent";

export default function FnChartCheckComponent({ kpiData }) {
    const authTokens = JSON.parse(localStorage.getItem('authTokens'))
    let user = jwtDecode(authTokens.access)
    // let { user } = useContext(AuthContext)
    const [getPinnedChart, setPinnedChart] = useState([]);
    const [pinnedCharts, setPinnedCharts] = useState([])
    const [getmode, setMode] = useState(false)
    const [toastMessages, setToastMessages] = useState([]);

    const [getUpdatedChartData, setUpdatedChartData] = useState(false)

    const [getExportChart, setExportChart] = useState(false)


    // insert the pinned chart data to db

    async function insChartPinToHomepage(chartData) {
        let chartPinResponse = await fetch(
            `${process.env.REACT_APP_SERVER_URL}/api/upd_pin_chart_homepage`,
            {
                method: "PUT",
                body: JSON.stringify({
                    kpi_id: chartData.kpi_id,
                    user_id: chartData.user,
                    chart_type: chartData.chart_type,
                    created_by: chartData.created_by,
                    last_updated_by: chartData.last_updated_by,
                    pin_flag: "Y"
                }),
                headers: {
                    "Content-Type": "application/json",
                    Authorization: "Bearer " + String(authTokens.access),
                },
            }
        );
        let chartPinData = await chartPinResponse.json();
        if (chartPinResponse.status === 200) {
            setUpdatedChartData(!getUpdatedChartData)
            setPinnedCharts((prevPinnedCharts) => [...prevPinnedCharts, chartData]);
            setMode(true)
        }
    }

    useEffect(() => {
        getChartPinToHomepage()
    }, [getUpdatedChartData])


    async function getChartPinToHomepage() {
        let getchartPinResponse = await fetch(
            `${process.env.REACT_APP_SERVER_URL}/api/get_pin_chart_homepage/${user.user_id}`,
            {
                method: "GET",
                headers: {
                    "Content-Type": "application/json",
                    Authorization: "Bearer " + String(authTokens.access),
                },
            }
        );
        let getchartPinData = await getchartPinResponse.json();
        console.log({ getchartPinData })
        if (getchartPinResponse.status === 200) {
            setPinnedChart(getchartPinData)
        }
    }

    // removes(hard delete from db) the pinned charts

    async function deleteChartPinToHomepage(chartData) {
        let updchartPinResponse = await fetch(
            `${process.env.REACT_APP_SERVER_URL}/api/upd_pin_chart_homepage`,
            {
                method: "PUT",
                body: JSON.stringify(
                    {
                        kpi_id: chartData.kpi_id,
                        user_id: chartData.user,
                        chart_type: chartData.chart_type,
                        created_by: chartData.created_by,
                        last_updated_by: chartData.last_updated_by,
                        pin_flag: "N"
                    }
                ),

                headers: {
                    "Content-Type": "application/json",
                    Authorization: "Bearer " + String(authTokens.access),
                },
            }
        );
        let updchartPinData = await updchartPinResponse.json();
        if (updchartPinResponse.status === 200) {
            setUpdatedChartData(!getUpdatedChartData)
            setPinnedChart((prevPinnedCharts) => prevPinnedCharts.filter((pinnedChart) => pinnedChart.kpi_id !== chartData.kpi_id))
        }
    }

    // handles the pinned and unpinned charts by displaying tooltip

    const handleCheck = (kpiDataItems) => {

        const { id } = kpiDataItems

        let chartDataItems = [kpiDataItems]
        const selectedChartData = chartDataItems.find(itemsFind => itemsFind.id === id)

        const selectChart = {
            kpi_id: selectedChartData.id,
            chart_type: selectedChartData.chart_type,
            user: user.user_id,
            created_by: user.user_id,
            last_updated_by: user.user_id
        }

        const isPinned = getPinnedChart.some((pinItems) => pinItems.kpi_id === id)


        if (isPinned) {
            deleteChartPinToHomepage(selectChart)

            const toastMessage = `${selectedChartData.kpi} - ${selectedChartData.chart_type} chart removed to homepage`;
            setToastMessages((prevToastMessages) => [...prevToastMessages, toastMessage]);
        } else {
            insChartPinToHomepage(selectChart)
            setPinnedCharts((prevPinnedCharts) => [...prevPinnedCharts, selectedChartData]);

            const toastMessage = `${selectedChartData.kpi} - ${selectedChartData.chart_type} chart added to homepage`;
            setToastMessages((prevToastMessages) => [...prevToastMessages, toastMessage]);
        }

    }

    const formatPeriodToMonthNames = (data) => {
        return data.map(item => {
            const monthDate = moment(item.period).format("DD");
            const monthName = moment(item.period).format('MMM');
            const yearValue = item.period.substring(0, 4)
            return {
                ...item,
                period_date: monthDate,
                period_month: monthName,
                periodYear: yearValue
            };
        });
    };

    const LineChartComp = ({ data, measure, target, frequency, kname }) => {
        const formattedDate = formatPeriodToMonthNames(data)
        return (
            <>
                <FnLineChartComponent kpi={formattedDate} measure={measure} exportRestrict={getExportChart} target={target} frequency={frequency} kpiname={kname} />
            </>

        )
    }

    const BarChartComp = ({ barData, measure, target, frequency, kname }) => {
        const formattedDate = formatPeriodToMonthNames(barData)
        return (
            <>
                <FnBarChartComponent kpi={formattedDate} measure={measure} exportRestrict={getExportChart} target={target} frequency={frequency} kpiname={kname} />
            </>
        )
    }

    const PieChartComp = ({ pieChartData, measure, target, kname }) => {
        const formattedDate = formatPeriodToMonthNames(pieChartData)
        return (
            <>
                <FnPieChartComponent kpi={formattedDate} measure={measure} exportRestrict={getExportChart} target={target} kpiname={kname} />
            </>
        )

    }

    const AreaChartComp = ({ areaChartData, measure, target, frequency, kname }) => {
        const formattedDate = formatPeriodToMonthNames(areaChartData)
        return (
            <>
                <FnAreaChartComponent kpi={formattedDate} measure={measure} exportRestrict={getExportChart} target={target} frequency={frequency} kpiname={kname} />
            </>
        )
    }

    const GauageChartComp = ({id, guageChartData, measure, target, kname }) => {
        const formattedDate = formatPeriodToMonthNames(guageChartData)
        return (
            <>
                <FnGaugeChartComponent id={id} kpi={formattedDate} measure={measure} exportRestrict={getExportChart} target={target} kpiname={kname} />
            </>
        )

    }

    const ScatterChartComp = ({ scatterChartData, measure, target, frequency, kname }) => {
        const formattedDate = formatPeriodToMonthNames(scatterChartData)
        return (
            <>
                <FnScatterChartComponent kpi={formattedDate} measure={measure} exportRestrict={getExportChart} target={target} frequency={frequency} kpiname={kname} />
            </>
        )
    }



    return (
        <>
            {
                kpiData.map((items) => {
                    const isPinned = getPinnedChart.some((pinItems) => pinItems.kpi_id === items.id)
                    switch (items.chart_type) {
                        case "Bar":
                            return (
                                <div className="sc_cl_kpi_dashboard_chart_container m-2">
                                    <div className="sc_cl_kpi_dashboard_chart_pin_icon p-1">
                                        <button onClick={() => handleCheck(items, items.kpiActual)} className="sc_cl_default_btn">
                                            {isPinned ? <BsFillPinFill className="text-success" /> : <BsFillPinAngleFill className="text-danger" />}
                                        </button>
                                    </div>

                                    <div className="shadow rounded">
                                        <BarChartComp barData={items.kpiActual} measure={items.measure} target={items.target} frequency={items.frequency} kname={items.kpi} />
                                    </div>

                                </div>
                            )

                        case "Pie":
                            return (

                                <div className="sc_cl_kpi_dashboard_chart_container m-2">
                                    <div className="sc_cl_kpi_dashboard_chart_pin_icon p-1">
                                        <button onClick={() => handleCheck(items, items.kpiActual)} className="sc_cl_default_btn">
                                            {isPinned ? <BsFillPinFill className="text-success" /> : <BsFillPinAngleFill className="text-danger" />}
                                        </button>
                                    </div>

                                    <div className="shadow rounded">
                                        <PieChartComp pieChartData={items.kpiActual} measure={items.measure} target={items.target} kname={items.kpi} />
                                    </div>
                                </div>
                            )

                        case "Area":
                            return (
                                <div className="sc_cl_kpi_dashboard_chart_container m-2">
                                    <div className="sc_cl_kpi_dashboard_chart_pin_icon p-1">
                                        <button onClick={() => handleCheck(items, items.kpiActual)} className="sc_cl_default_btn">
                                            {isPinned ? <BsFillPinFill className="text-success" /> : <BsFillPinAngleFill className="text-danger" />}
                                        </button>
                                    </div>

                                    <div className="shadow rounded">
                                        <AreaChartComp areaChartData={items.kpiActual} measure={items.measure} target={items.target} frequency={items.frequency} kname={items.kpi} />
                                    </div>
                                </div>
                            )

                        case "Scatter":
                            return (
                                <div className="sc_cl_kpi_dashboard_chart_container m-2">
                                    <div className="sc_cl_kpi_dashboard_chart_pin_icon p-1">
                                        <button onClick={() => handleCheck(items, items.kpiActual)} className="sc_cl_default_btn">
                                            {isPinned ? <BsFillPinFill className="text-success" /> : <BsFillPinAngleFill className="text-danger" />}
                                        </button>
                                    </div>

                                    <div className="shadow rounded">
                                        <ScatterChartComp scatterChartData={items.kpiActual} measure={items.measure} target={items.target} frequency={items.frequency} kname={items.kpi} />
                                    </div>
                                </div>
                            )

                        case "Gauge":
                            return (
                                <div className="sc_cl_kpi_dashboard_chart_container m-2">
                                    <div className="sc_cl_kpi_dashboard_chart_pin_icon p-1">
                                        <button onClick={() => handleCheck(items, items.kpiActual)} className="sc_cl_default_btn">
                                            {isPinned ? <BsFillPinFill className="text-success" /> : <BsFillPinAngleFill className="text-danger" />}
                                        </button>
                                    </div>

                                    <div className="shadow rounded">
                                        <GauageChartComp id={items.id} guageChartData={items.kpiActual} measure={items.measure} target={items.target} kname={items.kpi}  />
                                    </div>
                                </div>
                            )

                        default:
                            return (
                                <div className="sc_cl_kpi_dashboard_chart_container m-2">
                                    <div className="sc_cl_kpi_dashboard_chart_pin_icon p-1">
                                        <button onClick={() => handleCheck(items, items.kpiActual)} className="sc_cl_default_btn">
                                            {isPinned ? <BsFillPinFill className="text-success" /> : <BsFillPinAngleFill className="text-danger" />}
                                        </button>
                                    </div>

                                    <div className="shadow rounded">
                                        <LineChartComp data={items.kpiActual} measure={items.measure} target={items.target} frequency={items.frequency} kname={items.kpi} />
                                    </div>
                                </div>
                            )

                    }
                })
            }

            {
                toastMessages.map((message, index) => (
                    <FnToastMessageComp key={index} message={message} duration={3000} Header={"KPI Charts"} />
                ))

            }
        </>
    )
}