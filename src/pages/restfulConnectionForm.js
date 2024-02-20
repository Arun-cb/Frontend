/* ============================================================================================================================================================

   CITTABASE SOLUTIONS - All Rights Reserved.
   ------------------------------------------------------------------------------------------------------------------------------------------------------------

   23-Jan-2024 Dinesh J  Initial Version V1

   ** This Page is to define perspectives form  **

============================================================================================================================================================*/

import React, { useState, useContext, useEffect } from "react";
import { useParams } from "react-router-dom";
import AuthContext from "../context/AuthContext";
import { Form, FormLabel, Row } from "react-bootstrap";
import Swal from "sweetalert2";
import FnBtnComponent from "../components/buttonComponent";
import CryptoJS from "crypto-js";
import FnFormComponent from "../components/formComponent";
import { RiDeleteBin6Line } from "react-icons/ri";
import { IoAddCircleOutline } from "react-icons/io5";

const FnRestfulConnectionForm = ({
    data,
    close,
    viewvalue,
    diverts,
    setdiverts,
    configData
}) => {
    let { authTokens, user } = useContext(AuthContext);
    const [adata, setAdata] = useState({
        created_by: user.user_id,
        last_updated_by: user.user_id,
    });
    const [error, setError] = useState({});
    const [action, setAction] = useState(false);
    let a = [data];
    const { id } = useParams();
    const [helper, setHelper] = useState([]);
    const [testingConError, setTestingConError] = useState({
        'status': "",
        'msg': ""
    })
    const [connectionstatus, setConnectionStatus] = useState();
    const [authBody, setAuthBody] = useState([]);

    //formComp
    const fieldData = [
        { id: 1, name: 'connection_name', label: 'Connection Name', placeholder: 'Enter Connection Name', type: 'text', maxlen: '500', ismandatory: 'Y' },
        { id: 2, name: 'connection_type', label: 'Connection Type', placeholder: 'Enter Connection Type', type: 'select', maxlen: '500', ismandatory: 'Y' },
        { id: 3, name: 'auth_type', label: 'Auth Type', placeholder: 'Enter Auth Type', type: 'select', maxlen: '500', ismandatory: 'Y' },
    ]

    const fieldData1 = [
        { id: 4, name: 'user_id', label: 'User Id', placeholder: 'Enter User Id', type: 'text', maxlen: '100', ismandatory: 'Y' },
        { id: 5, name: 'password', label: 'Password', placeholder: 'Enter Password', type: 'password', maxlen: '200', ismandatory: 'Y' },
        { id: 6, name: 'data_enpoint_url', label: 'Data Endpoint URL', placeholder: 'Enter Data Endpoint URL', type: 'text', maxlen: '200', ismandatory: 'Y' },
        { id: 7, name: 'method', label: 'Method', placeholder: 'Enter Method', type: 'select', maxlen: '200', ismandatory: 'Y' },
    ]

    const fieldData2 = [
        { id: 4, name: 'auth_url', label: 'Auth URL', placeholder: 'Enter Auth URL', type: 'text', maxlen: '500', ismandatory: 'Y' },
        { id: 5, name: 'data_enpoint_url', label: 'Data Endpoint URL', placeholder: 'Enter Data Endpoint URL', type: 'text', maxlen: '200', ismandatory: 'Y' },
        { id: 6, name: 'method', label: 'Method', placeholder: 'Enter Method', type: 'select', maxlen: '200', ismandatory: 'Y' },
    ]

    const fieldData3 = [
        { id: 4, name: 'data_enpoint_url', label: 'Data Endpoint URL', placeholder: 'Enter Data Endpoint URL', type: 'text', maxlen: '200', ismandatory: 'Y' },
        { id: 5, name: 'method', label: 'Method', placeholder: 'Enter Method', type: 'select', maxlen: '200', ismandatory: 'Y' },
    ]


    let selectedData = {
        "connection_type": [
            {
                value: "Rest_api",
                label: "Rest api"
            }
        ],
        "auth_type": [
            {
                value: "NoAuth",
                label: "No Auth"
            },
            {
                value: "Basic",
                label: "Basic"
            },
            {
                value: "Token Based",
                label: "OAuth 2.0"
            },

        ],
        "method": [
            {
                value: "GET",
                label: "GET"
            },
            {
                value: "POST",
                label: "POST"
            },
        ]
    }

    const fnEncrypt = (data) => {
        const bytes = CryptoJS.AES.encrypt(JSON.stringify(data), process.env.REACT_APP_SECRET_KEY);
        let result = bytes.toString();
        return result
    }

    const fnDecrypt = (data) => {
        try {
            const bytes = CryptoJS.AES.decrypt(data, process.env.REACT_APP_SECRET_KEY);
            const decryptedData = JSON.parse(bytes.toString(CryptoJS.enc.Utf8));
            return decryptedData;
        } catch (error) {
            console.error('Error decrypting data:', error.message);
            return null; // Handle decryption error appropriately
        }
    }


    //  Function for updating perspective details
    const fnUpdateDetails = async () => {

        let SendingData = { ...adata, password: fnEncrypt(adata.password), body: JSON.stringify(authBody) }


        let res = await fetch(
            `${process.env.REACT_APP_SERVER_URL}/api/upd_rb_connect_definition_table/${adata.id}/`,
            {
                method: "PUT",
                body: JSON.stringify(SendingData),
                headers: {
                    "Content-Type": "application/json",
                    Authorization: "Bearer " + String(authTokens.access),
                },
            }
        );
        let data = await res.json();
        if (res.status === 200) {
            Swal.fire({
                icon: "success",
                text: "Updated Successfully!",
            }).then(function () {
                close(false);
            });
        } else {
            setError(data);
        }
    };

    //  Function for inserting perspective details
    const fnTestConnection = async () => {
        try {            

            let auth_token
            if (adata.auth_type === 'Token Based') {
                let authTestBody = {}
                for (let Itm of (authBody)){
                    authTestBody = {
                        ...authTestBody,
                        [Itm['key']] : Itm['pair'],
                    }
                }
                let auth_res = await fetch(
                    `${adata.auth_url}`,
                    {
                        method: "POST",
                        body: JSON.stringify(authTestBody),
                        headers: {
                            "Content-Type": "application/json",
                        },
                    }
                );

                auth_token = await auth_res.json();
                console.log('auth_token', auth_token)
                if (auth_res.status === 200) {
                    setError();
                } else {
                    setError(auth_token.details);
                    setConnectionStatus("error");
                }
            }

            
            let res;

            if(adata.auth_type === 'NoAuth'){
                res = await fetch(
                    `${adata.data_enpoint_url}`,
                    {
                        method: `GET`,
                    }
                );
            }else{
                const headers = {
                    "Content-Type": "application/json",
                    Authorization: adata.auth_type === 'Basic' ? "Basic " + btoa(adata.user_id + ":" + adata.password) : "Bearer " + String(auth_token.access),
                };
                res = await fetch(
                    `${adata.data_enpoint_url}`,
                    {
                        method: `${adata.method}`,
                        headers: headers,
                    }
                );
            }
            
            let data = await res.json();
            if (res.status === 200) {
                setError();
                setConnectionStatus("Connected");
            }

            else if (res.status === 500) {
                setConnectionStatus('error')
                setError();
                setTestingConError({
                    "status": res.status,
                    "Msg": data.message
                })
            }
            else {
                setError(data);
                setConnectionStatus('error')
                setTestingConError({
                    "status": res.status,
                    "Msg": data.message
                })
            }
        }

        catch (excep) {
            console.log("exp", excep)
            setConnectionStatus('error')
            setTestingConError({
                "status": "",
                "Msg": excep
            })
        }
    }

    //  Function for inserting perspective details
    const fnSubmitDetails = async () => {

        let SendingData = { ...adata, password: fnEncrypt(adata.password), body: JSON.stringify(authBody) }

        let res = await fetch(
            `${process.env.REACT_APP_SERVER_URL}/api/ins_rb_connect_definition_table`,
            {
                method: "POST",
                body: JSON.stringify(SendingData),
                headers: {
                    "Content-Type": "application/json",
                    Authorization: "Bearer " + String(authTokens.access),
                },
            }
        );

        let data = await res.json();
        if (res.status === 200) {
            setError();
            setAction();
            Swal.fire({
                icon: "success",
                text: "Created Successfully!",
            }).then(function () {
                close(false);
            });
        } else {
            setError(data);
        }
    };

    //  Used for rendering every time action done
    useEffect(() => {
        const fnGetDetails = async () => {
            let res_helper = await fetch(
                `${process.env.REACT_APP_SERVER_URL}/api/get_helper`,
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
        }
        fnGetDetails();
        if (diverts === true) {
            const newdata = a.map(
                ({
                    id,
                    connection_name,
                    connection_type,
                    auth_type,
                    connection_url,
                    auth_url,
                    body,
                    user_id,
                    password,
                    data_enpoint_url,
                    method,
                    client_id,
                    secret_code,
                    created_by,
                    last_updated_by,
                }) => ({
                    id,
                    connection_name,
                    connection_type,
                    auth_type,
                    connection_url,
                    auth_url,
                    body,
                    user_id,
                    password,
                    data_enpoint_url,
                    method,
                    client_id,
                    secret_code,
                    created_by,
                    last_updated_by,
                })
            );
            const ChangedNewData = [{ ...newdata[0], password: fnDecrypt(newdata[0].password) }]
            setAuthBody(JSON.parse(newdata[0].body))
            setAdata(...ChangedNewData);
            setAction(true);
            setdiverts(false);
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [action]);

    if (adata.last_updated_by !== user.user_id) {
        setAdata({ ...adata, last_updated_by: user.user_id });
    }

    // Onchange function
    const fnInputHandler = (name, value) => {
        setAdata((prevState) => ({
            ...prevState,
            [name]: value
        }))

        const errors = { ...error }
        setError(errors)
    };

    const help = helper.filter(user => String(user.page_no)
        .includes(String(id))).map((use) => use);

    return (
        <div className="sc_cl_div w-100 px-2">

            <Row className="mt-2 mt-lg-2 sc-cl-main-content">

                <FnFormComponent fields={fieldData} select={selectedData} formData={adata} onchange={fnInputHandler} onsubmit={fnSubmitDetails} errorcode={error} disablevalue={viewvalue} stylename={"sc_cl_input mb-2"} tooltipvalue={help} />
                {adata.auth_type === undefined ? <></> :
                    (adata.auth_type === 'Basic' ?
                        <FnFormComponent fields={fieldData1} select={selectedData} formData={adata} onchange={fnInputHandler} onsubmit={fnSubmitDetails} errorcode={error} disablevalue={viewvalue} stylename={"sc_cl_input mb-2"} tooltipvalue={help} />
                        : adata.auth_type === 'NoAuth' ?
                            <FnFormComponent fields={fieldData3} select={selectedData} formData={adata} onchange={fnInputHandler} onsubmit={fnSubmitDetails} errorcode={error} disablevalue={viewvalue} stylename={"sc_cl_input mb-2"} tooltipvalue={help} />
                            : <>
                                <FnFormComponent fields={fieldData2} select={selectedData} formData={adata} onchange={fnInputHandler} onsubmit={fnSubmitDetails} errorcode={error} disablevalue={viewvalue} stylename={"sc_cl_input mb-2"} tooltipvalue={help} />

                                <FormLabel className="sc_cl_label">Auth Body</FormLabel>
                                <table className="w-50 table-striped ">
                                    <thead className="text-black-50">
                                        <tr>
                                            <th>
                                                Key
                                            </th>
                                            <th>
                                                Pair
                                            </th>
                                            <th><FnBtnComponent onClick={() => { setAuthBody([...authBody, {}]) }} children={"Add"} classname={"sc_cl_submit_button "} /></th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {
                                            authBody.length > 0 && authBody.map((Itm, index) => {
                                                return (
                                                    <tr>
                                                        <td>
                                                            <Form.Control className="sc_cl_input mb-2" type="text" name="key" size="sm" value={Itm["key"] || ""} onChange={(e) => {
                                                                const updatedAuthBody = [...authBody];
                                                                updatedAuthBody[index]["key"] = e.target.value;
                                                                setAuthBody(updatedAuthBody);
                                                            }} />
                                                        </td>
                                                        <td>
                                                            <Form.Control className="sc_cl_input mb-2" type="text" name="pair" size="sm" value={Itm["pair"] || ""} onChange={(e) => {
                                                                const updatedAuthBody = [...authBody];
                                                                updatedAuthBody[index]["pair"] = e.target.value;
                                                                setAuthBody(updatedAuthBody);
                                                            }} />
                                                        </td>
                                                        <td>
                                                            {authBody && authBody.length > 1 ?

                                                                <RiDeleteBin6Line className="m-1" onClick={() => { const updatedAuthBody = [...authBody]; updatedAuthBody.splice(index, 1); setAuthBody(updatedAuthBody); }} />
                                                                : ""}
                                                        </td>
                                                    </tr>
                                                )
                                            })

                                        }
                                        

                                    </tbody>
                                </table>

                            </>
                    )
                }
                <div>
                    {connectionstatus &&
                        (<div className="d-flex flex-column">
                            <label>status :
                                <span className={`${connectionstatus && connectionstatus == "Connected" ? 'text-success' : 'text-danger'} small`}>
                                    {connectionstatus ? connectionstatus == "Connected" ? ' success' : ' failure' : ''}</span>
                            </label>

                            <label className={`${connectionstatus && connectionstatus === "Connected" ? 'd-none' : ''} `} >
                                <span className={`${connectionstatus && connectionstatus === "Connected" ? 'd-none' : 'text-danger'} small`}>
                                    {connectionstatus ? connectionstatus === "Connected" ? '' : `${testingConError.status} ${testingConError.Msg}` : ''}
                                    {/* {connectionstatus ? connectionstatus === "Connected" ? '' : "204 status code" : ''} */}
                                </span>
                            </label>
                        </div>)
                    }
                </div>
                <div className="align-items-center d-flex justify-content-start mt-2 sc_cl_div gap-2">
                    <FnBtnComponent onClick={fnTestConnection} children={"Test Connection"} classname={"sc_cl_close_button"} />
                    {viewvalue === false &&
                        (action ? (
                            <FnBtnComponent onClick={fnUpdateDetails} classname={"sc_cl_submit_button"} children={"Update"} />
                        ) : (
                            <FnBtnComponent onClick={fnSubmitDetails} children={"Submit"} classname={"sc_cl_submit_button"} />
                        ))}
                    <FnBtnComponent classname={"sc_cl_close_button"} children={"Back"} onClick={() => close(false)} />
                </div>
            </Row>
        </div>
    );
};

export default FnRestfulConnectionForm;