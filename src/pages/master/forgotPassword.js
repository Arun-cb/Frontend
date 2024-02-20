/* ============================================================================================================================================================

   CITTABASE SOLUTIONS - All Rights Reserved.
   ------------------------------------------------------------------------------------------------------------------------------------------------------------

   03-Apr-2023   Arun R      Initial Version             V1

   ** This Page is to define Forgot Password   **

============================================================================================================================================================*/

import React, { useEffect, useState } from "react";
import { Button, Row, Modal, Form } from 'react-bootstrap';
import Swal from "sweetalert2";

const FnForgotPassword = () => {

    const [getshow, setShow] = useState(false)
    const [loader, setLoader] = useState(false);
    const [getEmail, setEmail] = useState("")
    const [checksmtp, setCheckSmtp] = useState(true)
    const [error, setError] = useState({})

    const fnCheckSMTP = async() => {
        let res = await fetch(`${process.env.REACT_APP_SERVER_URL}/api/get_smtp`,
        {
            method: "GET",
            headers: {
            "Content-Type": "application/json",
            },
        });
        let data = await res.json();
        if (res.status === 200) {
            if(data.length === 1){
              setCheckSmtp(false)
            }
        }
    }

    const fnSubmitDetails = async () => {
        if(getEmail){
            setLoader(true)
            let res = await fetch(
                `${process.env.REACT_APP_SERVER_URL}/api/forgot_password`,
                {
                  method: "POST",
                  body: JSON.stringify(getEmail),
                  headers: {
                    "Content-Type": "application/json",
                  },
                }
              );
              if (res.status === 200) {
                Swal.fire({
                    icon: 'success',
                    // title: 'Upated',
                    text: 'Your password updated successfully. Please check your mail',
                }).then(function () {
                    setEmail("")
                    setError()
                    setLoader(false)
                    setShow(false)
                });
              } else {
                setLoader(false)
                setError({'email': 'Please enter Registered e-mail address'})
              }
        }else{
            setError({'email': 'Please fill the field'})
        }
    }

    useEffect(() => {
        fnCheckSMTP();
    }, [])



    return (
        <Row>
            <div>
                <p onClick={() => setShow(true)} className="text-primary mt-4 sc_cl_cursor_pointer">Forgot Password</p>
            </div>
            <Modal show={getshow}>
                <Modal.Header closeButton onClick={() => {setShow(false); setError({}); setEmail(); }} >
                    <Modal.Title>Forgot Password</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    {checksmtp ? 
                        <span>SMTP Configuration is not defined. You're not able to change your password. Please contect your's admin</span>
                     : 
                        <Form className="d-flex flex-column">
                            <input 
                                type='email' 
                                value={getEmail} 
                                onChange={(evt) => {setError({}); setEmail(evt.target.value) }} 
                                placeholder="Enter registered mail here"
                            />
                            <span className="red">{error && error.email}</span>
                            <Button
                                size="sm"
                                type="submit"
                                className={`btn-success mt-2 ${!loader ? '' : 'disabled'}`}
                                onClick={fnSubmitDetails}
                                >
                                {
                                    !loader ? 'Send Password' : 'Loading....'
                                } 
                            </Button>
                        </Form>
                    }
                </Modal.Body>
            </Modal>

        </Row>

    )
}

export default FnForgotPassword