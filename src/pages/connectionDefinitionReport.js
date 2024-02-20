import React, { useContext, useEffect, useState } from "react";
import { useParams, useNavigate, Link } from "react-router-dom";

import AuthContext from "../context/AuthContext";
import PreContext from "../context/PreContext";

import Swal from "sweetalert2";
import FnDatabaseConnectionForm from "./databaseconnectionForm";
import FnExportComponent from "../components/ExportComponent";
import FnTableComponent from "../components/tableComponent";
import FnBtnComponent from "../components/buttonComponent";
import FnRestfulConnectionForm from "./restfulConnectionForm";



import { TbSql, TbApi } from "react-icons/tb";
import { SiMysql, SiOracle, SiSnowflake } from "react-icons/si";
import { PiFileCsvThin } from "react-icons/pi";
import { GrScorecard } from "react-icons/gr";


import { Card, Modal } from "react-bootstrap";

const FnConnectionDefinition = () => {
    let { authTokens, user } = useContext(AuthContext);
    let { userSettings } = useContext(PreContext);
    const [adata, setAdata] = useState([]);
    const [csvdata, setCsvdata] = useState([]);
    const [mode, setMode] = useState(false);
    const [update, setUpdate] = useState(false);
    const [btnclassglb, setBtnClassglb] = useState(["sc_cl_nav_button_active"]);
    const [selectedSection, setSelectedSection] = useState('database');
    const [divert, setDivert] = useState(false);
    const [updatedata, setUpdatedata] = useState();
    const [add, setAdd] = useState(false);
    const [view, setView] = useState(false);
    const [configData, setConfigData] = useState();
    const [selectedSrc, setSelectedSrc] = useState([]);

    const [selectedComponent, setSelectedComponent] = useState(null);
    const [showModel, setshowModel] = useState(false)

    const { id } = useParams();
    const navigator = useNavigate();
    const [adatalength, setAdatalength] = useState(0);
    const [startingIndex, setStartingindex] = useState(0);
    const [viewpage, setViewPage] = useState();
    const PageSize =
        userSettings && userSettings.pagination
            ? userSettings.pagination
            : process.env.REACT_APP_PAGINATION;
    const endingIndex = startingIndex + Number(PageSize);

    const columns_to = ["connection_name", "connection_type"];
    const columns_type = ["str", "str"];

    const date_columns = [];

    const tabDetails = [
        {
            menu_id: 1,
            url: "",
            Icon: <GrScorecard />,
            menu_name: "Database",
            src_name: 'database'


        },
        {
            menu_id: 2,
            url: "",
            Icon: <GrScorecard />,
            menu_name: "Online Services",
            src_name: 'onlineConn'

        },
        {
            menu_id: 3,
            url: "",
            Icon: <GrScorecard />,
            menu_name: "Files",
            src_name: 'directFile'

        }
    ]

    const connectionTabDetails = {
        database: [
            {
                sourceName: "SQL",
                icon: <TbSql />,
                comp: <FnDatabaseConnectionForm
                    data={updatedata}
                    close={setMode}
                    viewvalue={view}
                    diverts={divert}
                    setdiverts={setDivert}
                    configData={configData}
                    typeItem={"sql"}
                />
            },
            {
                sourceName: "MYSQL",
                icon: <SiMysql />,
                comp: <FnDatabaseConnectionForm
                    data={updatedata}
                    close={setMode}
                    viewvalue={view}
                    diverts={divert}
                    setdiverts={setDivert}
                    configData={configData}
                    typeItem={"MYSQL"}

                />
            },
            {
                sourceName: "Oracle",
                icon: <SiOracle />,
                comp: <FnDatabaseConnectionForm
                    data={updatedata}
                    close={setMode}
                    viewvalue={view}
                    diverts={divert}
                    setdiverts={setDivert}
                    configData={configData}
                    typeItem={"Oracle"}

                />
            },
        ],
        onlineConn: [
            {
                sourceName: "REST Api",
                icon: <TbApi />,
                comp: <FnRestfulConnectionForm
                    data={updatedata}
                    close={setMode}
                    viewvalue={view}
                    diverts={divert}
                    setdiverts={setDivert}
                    configData={configData}
                />
            },
            {
                sourceName: "Snowflake",
                icon: <SiSnowflake />,
                comp: <FnDatabaseConnectionForm
                    data={updatedata}
                    close={setMode}
                    viewvalue={view}
                    diverts={divert}
                    setdiverts={setDivert}
                    configData={configData}
                    typeItem={"Snowflake"}

                />
            },
        ],
        directFile: [
            {
                sourceName: "CSV",
                icon: <PiFileCsvThin />,
                comp: <FnDatabaseConnectionForm
                    data={updatedata}
                    close={setMode}
                    viewvalue={view}
                    diverts={divert}
                    setdiverts={setDivert}
                    configData={configData}
                />
            },
        ],
    }

    function Fn_active(index, itemGroup) {
        let stage2 = [];
        stage2[index] = "sc_cl_nav_button_active"
        setBtnClassglb(stage2);
        setSelectedSection(itemGroup)
    }

    const newadata = adata.map(
        ({
            id,
            connection_type,
            connection_name,
            database_name,
            host_id,
            port,
            user_name,
            password,
            service_name_or_SID,    
            account_id,
            schema_name,
            warehouse_id,
            role,
            auth_type,
            connection_url,
            auth_url,
            body,
            user_id,
            data_enpoint_url,
            method,
            client_id,
            secret_code,
            created_by,
            last_updated_by,
        }) => ({
            id,
            connection_type,
            connection_name,
            database_name,
            host_id,
            port,
            user_name,
            password,
            service_name_or_SID,            
            account_id,
            schema_name,
            warehouse_id,
            role,
            auth_type,
            connection_url,
            auth_url,
            body,
            user_id,
            data_enpoint_url,
            method,
            client_id,
            secret_code,
            created_by,
            last_updated_by,
        })
    );

    const fnAddDetails = () => {
        setUpdatedata();
        setshowModel(true)
    };


    const fnGetDetails = async () => {
        // API call to Get Individual user details
        let res = await fetch(
            `${process.env.REACT_APP_SERVER_URL}/api/get_range_rb_connect_definition_table/${startingIndex}/${endingIndex}/`,
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
                setAdata(data.data);
                setCsvdata(data.csv_data);
                setAdatalength(data.data_length);
                setUpdate(true);
            } else {
                setAdata([]);
                setAdatalength(0);
                setUpdate(false);
            }
        }
    };

    const fnselectsrc = (index, item, component) => {
        let tempVar = []
        tempVar[index] = item
        setSelectedSrc(tempVar)
        setSelectedComponent(component);
        // setUpdatedata()
    }

    const fnChangeComp = () => {
        console.log('updatedata', updatedata)

        if (updatedata && updatedata.connection_type === 'Rest_api') {
            console.log('Rest_api')
            setSelectedComponent(
                <FnRestfulConnectionForm
                    data={updatedata}
                    close={setMode}
                    viewvalue={view}
                    diverts={divert}
                    setdiverts={setDivert}
                    configData={configData}
                />
                )
            } else {
                console.log('else')
                setSelectedComponent(
                    <FnDatabaseConnectionForm
                        data={updatedata}
                        close={setMode}
                        viewvalue={view}
                        diverts={divert}
                        setdiverts={setDivert}
                        configData={configData}
                    />
                    )
        }
    }

    useEffect(() => {
        fnGetDetails();
        fnChangeComp();
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [update, mode, startingIndex, PageSize]); //imageUrl

    // useEffect(() => {
    //     fnChangeComp();
    //     // eslint-disable-next-line react-hooks/exhaustive-deps
    // }, [update])


    return (
        <div>
            {mode ? (
                <>
                    {selectedComponent}
                </>
            ) : (
                <div className="sc_cl_div w-100 px-2">
                    {/* <hr></hr> */}

                    <Card className="overflow-hidden border-0 mt-lg-2">
                        <div className="sc_cl_div card-header">
                            <div className="sc_cl_div d-flex justify-content-end ">

                                {add && (
                                    <FnBtnComponent
                                        children={"New Connection"}
                                        classname={"sc_cl_submit_button"}
                                        onClick={fnAddDetails}
                                    />
                                )}
                            </div>
                        </div>

                        <div className="sc_cl_div">

                            <FnTableComponent
                                data={newadata}
                                csv_export={csvdata}
                                data_length={adatalength}
                                page_size={PageSize}
                                columns_in={columns_to}
                                date_columns={date_columns}
                                columns_type={columns_type}
                                start={setStartingindex}
                                close={setMode}
                                updates={setUpdatedata}
                                load={setUpdate}
                                api_name={"del_rb_connect_definition_table"}
                                diverts={setDivert}
                                add={setAdd}
                                view={setView}
                                menu_id={id}
                                pagination={true}
                                custom_action={false}
                                action={true}
                            />
                        </div>
                    </Card>
                    <Modal
                        show={showModel}
                        centered
                        className="custom-modal modal-lg"
                    >
                        <Modal.Body>
                            <h6 className="feedback__question">{"Get Data"}</h6>
                            <div className="d-flex col-lg-12 " style={{ height: '25rem' }}>

                                <div className="borderRight col-lg-4">
                                    {tabDetails.map((item, index) => {
                                        return (
                                            <div className="sc_cl_nav_group" key={index}>
                                                <span
                                                    to={{ pathname: `${item.url}/${item.menu_id}` }}
                                                    id={item.menu_id}
                                                    className={`${btnclassglb[index] !== undefined
                                                        ? btnclassglb[index]
                                                        : "sc_cl_nav_button"
                                                        } gap-3 p-2 my-1`}
                                                    onClick={() => {
                                                        Fn_active(index, item.src_name);
                                                        setSelectedSrc([])
                                                    }}
                                                >
                                                    <span className="" style={{ font_weight: "600" }}>
                                                        {item.menu_name}
                                                    </span>
                                                </span>

                                            </div>)
                                    })}
                                </div>

                                <div className="feedback col-lg-8">
                                    <div class="feedback_header">
                                        <h6 class="feedback__question">{"Source"}</h6>
                                    </div>
                                    <div className="connectionContent row-lg-12">

                                        {connectionTabDetails[selectedSection] && connectionTabDetails[selectedSection].map((item, index) => {
                                            return (
                                                <div class="burmanRadio" key={index}>
                                                    <input type="radio" class="burmanRadio__input" id={index} name="burmanRadio" checked={selectedSrc && selectedSrc[index] ? true : false} />
                                                    <label for={index} class="burmanRadio__label" onClick={() => { fnselectsrc(index, item, item.comp) }}>
                                                        <i className="" style={{ fontSize: '1.5rem' }}>
                                                            {item.icon}
                                                        </i>
                                                        <span className="ps-1">
                                                            {item.sourceName}
                                                        </span>
                                                    </label>
                                                </div>
                                            )
                                        })
                                        }

                                    </div>
                                </div>
                            </div>
                        </Modal.Body>
                        <Modal.Footer className="">
                            <FnBtnComponent
                                onClick={() => { setMode(true); setshowModel(false); setSelectedSrc([]); setSelectedSection("database"); setBtnClassglb(["sc_cl_nav_button_active"]) }}
                                children={"Connect"}
                                classname={"sc_cl_submit_button"}
                            ></FnBtnComponent>
                            <FnBtnComponent
                                onClick={() => { setshowModel(false); setSelectedSrc([]); setSelectedSection("database"); setBtnClassglb(["sc_cl_nav_button_active"]) }}
                                children={"Close"}
                                classname={"sc_cl_close_button"}
                            ></FnBtnComponent>
                        </Modal.Footer>
                    </Modal>
                </div>
            )}
        </div>
    );
};

export default FnConnectionDefinition;
