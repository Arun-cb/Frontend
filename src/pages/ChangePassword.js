import React, { useContext, useEffect, useState } from "react"
import AuthContext from "../context/AuthContext";
import { Col, Row, Container, Table } from "react-bootstrap";
import { useNavigate } from "react-router-dom";
import FnBreadCrumbComponent from "../components/breadCrumbComponent";
import FnBtnComponent from "../components/buttonComponent";
import { FaLock, FaRegTimesCircle, FaRegCheckCircle, FaSoap } from 'react-icons/fa'
import Swal from "sweetalert2";

function ChangePassword() {
    let { authTokens, logoutUser, user } = useContext(AuthContext);
    const [inputs, setInputs] = useState({});

    const [getPasswordConfirmation, setPasswordConfirmation] = useState('');

    const [getPasswordStatus, setPasswordStatus] = useState({
        hasOneCaptialLetter: false,
        hasOneSpecialLetter: false,
        hasOneNumericValue: false,
        hasLengthValid: false,
    })
    const navigator = useNavigate();

    let breadcumb_menu = [
        { Label: "Home", Link: "/" },

        {
            Label: "Change Password",
        },
    ];

    const InputHandler = (e) => {
        // const { name, value } = e.target
        setInputs({ ...inputs, [e.target.name]: e.target.value })
        
        if (e.target.name === 'password') {
            setPasswordStatus({
                ...getPasswordStatus,
                hasOneCaptialLetter: e.target.value.split('').some((char) => char.match(/[A-Z]/)),
                hasOneSpecialLetter: e.target.value.split('').some((char) => char.match(/[!@#$%^&*()_+{}\[\]:;<>,.?~\-/\\]/)),
                hasOneNumericValue: e.target.value.split('').some((char) => char.match(/[0-9]/)),
                hasLengthValid: e.target.value.length >= 8,
            });
        }

        if (e.target.name === 'password2') {
            setPasswordConfirmation(e.target.value);
        }
    }

    const submitForm = async () => {

        if (inputs.password === getPasswordConfirmation) {

            let res = await fetch(`${process.env.REACT_APP_SERVER_URL}/api/change_password/${user.user_id}/`, {
                method: 'PUT',
                body: JSON.stringify(inputs),
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': 'Bearer ' + String(authTokens.access)
                },
            })
            let data = await res.json();
            if (res.status === 200) {
                Swal.fire({
                    icon: 'success',
                    title: 'Success',
                    text: 'Password Changed Successfully!',
                });
            }

        } else {
            Swal.fire({
                icon: 'error',
                title: 'Error',
                text: 'Password not matched!',
            });
        }
    }


    // const submitForm = async () => {
    //     let res = await fetch(`${process.env.REACT_APP_SERVER_URL}/api/change_password/${user.user_id}/`, {
    //         method: 'PUT',
    //         body: JSON.stringify(inputs),
    //         headers: {
    //             'Content-Type': 'application/json',
    //             'Authorization': 'Bearer ' + String(authTokens.access)
    //         },
    //     })

    //     console.log(res)
    //     let data = await res.json();
    //     console.log(data)
    //     if (res.status === 200) {
    //         Swal.fire({
    //             icon: 'success',
    //             title: 'Success',
    //             text: 'Password updated successfully!',
    //         });
    //     } else if (data.old_password) {
    //         console.log(data.old_password)
    //         Swal.fire({
    //             icon: 'error',
    //             title: 'Error2',
    //             text: `${data.old_password.old_password}`,
    //         });
    //     } else {
    //         Swal.fire({
    //             icon: 'error',
    //             title: 'Error2',
    //             text: `${data.password}`,
    //         });
    //     }

    // }


    return (
        <div className="cp-container-feild d-flex flex-column flex-lg-row">

            <Col
                lg={6}
                md={12}
                className="h-100"
            >
                <div className="cp_feild_contanier">
                    <div className="cp_feilds_holder gap-4">
                        <div>
                            <label>Old password</label>
                            <input
                                type="text"
                                name="old_password"
                                onChange={(e)=>InputHandler(e)}
                                autoComplete="off"
                            />
                            <i>{<FaLock />}</i>
                        </div>


                        <div>
                            <label>New password</label>
                            <input
                                type="password"
                                name="password"
                                onChange={(e)=>InputHandler(e)}
                                autoComplete="off"
                                minLength={8}
                                maxLength={12}
                                required
                            />
                            <i>{<FaLock />}</i>
                        </div>


                        <div>
                            <label>Confirm password</label>
                            <input type="text"
                                name="password2"
                                onChange={(e)=>InputHandler(e)}
                                autoComplete="off"
                                minLength={8}
                                maxLength={12}
                                required
                            />
                            <i>{<FaLock />}</i>
                        </div>
                        <div>
                            <FnBtnComponent children={"Change my Password"} classname={"sc_cl_submit_button"} onClick={submitForm} />
                            <FnBtnComponent children={"Close"} classname={'sc_cl_close_button ms-2'} onClick={() => navigator("/")} />
                        </div>
                    </div>
                </div>
            </Col>

            <Col
                className="px-3 px-lg-5 d-flex flex-column justify-content-center"
            >

                <p>
                    {
                        getPasswordStatus.hasLengthValid ? (<span>{<FaRegCheckCircle className="text-success me-2" />}</span>) : (<span>{<FaRegTimesCircle className="text-danger me-2" />}</span>)
                    }
                    <span className={`${getPasswordStatus.hasLengthValid ? 'text-success' : 'text-danger'}`} >
                        At least 8 characters
                    </span>
                </p>


                <p>
                    {
                        getPasswordStatus.hasOneNumericValue ? <span>{<FaRegCheckCircle className="text-success me-2" />}</span> : <span>{<FaRegTimesCircle className="text-danger me-2" />}</span>
                    }
                    <span className={`${getPasswordStatus.hasOneNumericValue ? 'text-success' : 'text-danger'}`} >Atleast one Numeric value </span>
                </p>


                <p>
                    {
                        getPasswordStatus.hasOneSpecialLetter ? <span>{<FaRegCheckCircle className="text-success me-2" />}</span> : <span>{<FaRegTimesCircle className="text-danger me-2" />}</span>
                    }
                    <span className={`${getPasswordStatus.hasOneSpecialLetter ? 'text-success' : 'text-danger'}`} >Atleast one Special character </span>
                </p>

                <p>
                    {
                        getPasswordStatus.hasOneCaptialLetter ? <span>{<FaRegCheckCircle className="text-success me-2" />}</span> : <span>{<FaRegTimesCircle className="text-danger me-2" />}</span>
                    }
                    <span className={`${getPasswordStatus.hasOneCaptialLetter ? 'text-success' : 'text-danger'}`} >Atleast one upper case letter (A-Z) </span>
                </p>

            </Col>
        </div>
    )
}

export default ChangePassword