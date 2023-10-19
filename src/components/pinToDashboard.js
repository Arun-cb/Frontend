import React, { useEffect, useState, useContext } from "react";
import AuthContext from "../context/AuthContext";
import { Row, Col, Card } from "react-bootstrap";
import { FiArrowUp, FiArrowDown } from "react-icons/fi";
import { BsDash } from "react-icons/bs"
import { CgLayoutGrid } from "react-icons/cg";

export default function FnPinToDashboard() {
    let { authTokens } = useContext(AuthContext);

    const [getkpipindata, setKpiPinData] = useState([])

    useEffect(() => {
        kpiPinFlagData()
    }, [])

    const kpiPinFlagData = async () => {

        let pinResponse = await fetch(
            `${process.env.REACT_APP_SERVER_URL}/api/get_curr_prev_actual_score/`, {
            method: "GET",
            headers: {
                "Content-Type": "application/json",

                Authorization: "Bearer " + String(authTokens.access),
            },
        });

        let scorecardnameResponse = await fetch(
            `${process.env.REACT_APP_SERVER_URL}/api/get_scorecard`, {
            method: "GET",
            headers: {
                "Content-Type": "application/json",
                Authorization: "Bearer " + String(authTokens.access),
            },
        });

        let indicatorsResponse = await fetch(
            `${process.env.REACT_APP_SERVER_URL}/api/get_kpi_stop_light_indicators`, {
            method: "GET",
            headers: {
                "Content-Type": "application/json",
                Authorization: "Bearer " + String(authTokens.access),
            },
        });

        let pinData = await pinResponse.json()

        
        let scorecardnameData = await scorecardnameResponse.json()

        let indicatorsData = await indicatorsResponse.json()

        const mergedData = pinData.map(items => {
            const smpl_obj = scorecardnameData.find(obj => obj.id === items.scorecard_id);
            return smpl_obj ? {
                ...items,
                scorecard_name: smpl_obj.scorecard_description,
            } : ''
        }).filter(Boolean)
        setKpiPinData(mergedData)

        const setByIndicators = (id)=>{
            return indicatorsData.filter((indicatorItems)=>indicatorItems.kpi_id == id)
        }

        let getByIndicators = mergedData.filter((indicatorIdItems)=>{
            return(
                indicatorIdItems["Indicators"] = setByIndicators(indicatorIdItems.id)
            )
        })

    }

    
    return (
        <div className="d-flex flex-column flex-lg-row">
            {
                getkpipindata.map((items, idx) => {
                    return (
                        <div className="col-lg-3 mt-2 mt-lg-0 p-0 px-lg-2 d-flex" key={idx}>
                            <Card className="border-0 card mx-2 mx-lg-0 sc_cl_card_shadow w-100" key={idx}>
                                <Card.Body>
                                    <div className="align-items-center d-flex justify-content-between">
                                        <div>
                                            <div className="mb-2">
                                                <p className="text-muted sc_cl_card_title">{items.scorecard_name}</p>
                                                <h6 className="sc_cl_card_head">{items.kpi_name}</h6>
                                            </div>

                                            <div>
                                                
                                                <p className="d-flex m-0 sc_cl_small_text text-muted">Previous Score
                                                <span className="d-flex">
                                                    {
                                                        items.kpi_score > items.prev_score ? <p className="m-0 ms-1 text-success">{items.prev_score}%</p>:<p className="m-0 ms-1 text-danger">{items.prev_score}%</p>
                                                    }
                                                    {
                                                        items.kpi_score === items.prev_score ?
                                                            <i> <BsDash /> </i> : items.kpi_score > items.prev_score ?
                                                                <i className="align-items-center d-flex sc_cl_default_icon ms-0 text-success">
                                                                     <FiArrowUp />
                                                                </i>
                                                                :
                                                                <i className="align-items-center d-flex sc_cl_default_icon ms-0 text-danger">
                                                                    <FiArrowDown />
                                                                </i>
                                                    }

                                                </span>
                                                </p>
                                                
                                                
                                                
                                            </div>
                                        </div>

                                        <div>
                                            <div className="align-items-center d-flex justify-content-center rounded-circle sc_cl_card_icon shadow-sm">
                                                <p className="m-0 fw-semibold">{items.curr_score}%</p>
                                            </div>
                                        </div>
                                    </div>
                                </Card.Body>
                            </Card>
                        </div>
                    )
                })
            }

        </div>
    )
}