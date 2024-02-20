import React, { useState, useContext, useEffect } from 'react'
import AuthContext from "../context/AuthContext";
import { Col, Container, Row } from 'react-bootstrap';

import { useNavigate } from 'react-router-dom';
import FnFormComponent from '../components/formComponent';
import FnBtnComponent from '../components/buttonComponent';
import FnBreadCrumbComponent from "../components/breadCrumbComponent";

const FnNavigationMenuForm = () => {
    let { authTokens, user } = useContext(AuthContext);
    const [adata, setAdata] = useState({ "created_by": user.user_id, "last_updated_by": user.user_id, "parent_menu_id": '0' })
    const [parent, setParent] = useState([])
    const [error, setError] = useState({})
    // const [redirect, setRedirect] = useState(false)
    const navigator = useNavigate()

    const sampleData = [
        { id: 1, name: 'menu_name', label: 'Menu Name', placeholder: 'Enter Menu Name', type: 'text' },
        { id: 2, name: 'parent_menu_id', label: 'Parent Menu', placeholder: 'Enter Menu Name', type: 'select' },
        { id: 3, name: 'url', label: 'URL', placeholder: 'Enter URL', type: 'text' }
    ]

    let breadcumb_menu = [
        { Label: "Home", Link: "/" },
    
        {
          Label: "Navigation Menu",
        },
      ];

    const selectedValue = {
        parent_menu_id:
            parent.map((items) => ({
                value: items.id,
                label: items.menu_name
            }))
    }

    const getDetails = async () => {
        let res = await fetch(`${process.env.REACT_APP_SERVER_URL}/api/get_navigation_menu_details`, {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': 'Bearer ' + String(authTokens.access)
            },
        })
        let data = await res.json();
        if (res.status === 200) {
            if (data.length > 0) {
                setParent(data)
            }
        }
    }

    const fn_submit_details = async () => {
        let res = await fetch(`${process.env.REACT_APP_SERVER_URL}/api/ins_navigation_menu_details`, {
            method: 'POST',
            body: JSON.stringify([adata]),
            headers: {
                'Content-Type': 'application/json',
                'Authorization': 'Bearer ' + String(authTokens.access)
            },
        })
        let data = await res.json();
        if (res.status === 201) {
            setError()
            alert("Menu Added Successfully...")
            setAdata({ "created_by": user.user_id, "last_updated_by": user.user_id, "parent_menu_id": '0' })
        } else {
            setError(data)
        }
    }

    useEffect(() => {
        getDetails()
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [adata])

    const fnInputHandler = (name, value) => {
        setAdata((prevState) => ({
            ...prevState,
            [name]: value
        }))

        const errors = { ...error }
        setError(errors)
    };

    return (
        <div className="sc_cl_div w-100 px-2">

        <div className="d-flex flex-column flex-lg-row sc_cl_row">
          <div className="align-items-center col-12 col-lg-6 d-flex py-2 text-center">
            <h5 className="sc_cl_head m-0">Navigation Menu</h5>
          </div>

          <div className="align-items-center col-12 col-lg-6 d-flex justify-content-lg-end py-2 text-center">
            <FnBreadCrumbComponent seperator_symbol={" >"} nav_items={breadcumb_menu} />
          </div>
        </div>

        <hr></hr>

            <div>
                <FnFormComponent fields={sampleData} formData={adata} select={selectedValue} errorcode={error} onchange={fnInputHandler} stylename={"sc_cl_input"}/>
            </div>

            <Row>
                <Col className='col mt-5'>
                    <FnBtnComponent children={'Submit'} classname={"sc_cl_submit_button"} onClick={fn_submit_details}/>
                    <FnBtnComponent children={'Close'} classname={"sc_cl_close_button ms-2"} onClick={() => navigator('/')}/>

                </Col>
            </Row>

        </div>
    )
}

export default FnNavigationMenuForm