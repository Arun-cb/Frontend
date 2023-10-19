import React, { useState, useContext, useEffect } from "react";
import AuthContext from "../context/AuthContext";
import {
  Form,
  FormGroup,
  FormLabel,
  Row,
  Col,
  FormText
} from "react-bootstrap";
import Swal from "sweetalert2";
import FnBtnComponent from "../components/buttonComponent";

const FnSessionConfiguration = () => {
  let { authTokens, user } = useContext(AuthContext);
  const [loader, setLoader] = useState(false);
  const [error, setError] = useState({});
  const [inputs, setInputs] = useState({
    created_by: user.user_id,
    last_updated_by: user.user_id,
  });
  const [load, setLoad] = useState(false);

  const values = ["black", "red", "blue", "skyblue"];
  const labels = ["Black", "Red", "Blue", "Skyblue"];
  let i = 0;
  let options = [];

  for (i = 0; i < values.length; i++) {
    options.push({ value: values[i], label: labels[i] });
  }

  const fn_get_session_configuration = async () => {
    let res = await fetch(
      `${process.env.REACT_APP_SERVER_URL}/api/getsessionconfig`,
      {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          Authorization: "Bearer " + String(authTokens.access),
        },
      }
    );
    let data = await res.json();
    // let tempobj = Object.create({});
    if (res.status === 200) {
      if (data.length > 0) {
        setInputs(...data);
      }
    }
  };

  const HandleValidation = () => {
    let temp_err = {}
    if(inputs.idle_time === ''){
      Object.assign(temp_err, {idle_time: "This field is required"})
      // setError({...error, idle_time: "This field is required"})
    }
    if(inputs.session_time === ''){
      Object.assign(temp_err, {session_time: "This field is required"})
    }
    if(Object.keys(temp_err).length > 0){
      setError(temp_err)
      return true
    }else{
      return false
    }
  }

  const fn_submit_details = async () => {
    if(!HandleValidation()){
      setLoader(true)
      let res = await fetch(
        `${process.env.REACT_APP_SERVER_URL}/api/ins_upd_session_config/${inputs && inputs.id ? inputs.id : 0}/`,
        {
          method: "POST",
          body: JSON.stringify(inputs),
          headers: {
            "Content-Type": "application/json",
            Authorization: "Bearer " + String(authTokens.access),
          },
        }
      );
      // let data = await res.json();
      if (res.status === 200 || res.status === 201) {
        Swal.fire({
          icon: 'success',
          // title: 'Updated',
          text: 'Session configuration is successfully done!',
        }).then(function () {
          setError()
          setLoad(true)
          setLoader(false)
        });
      } else {
        // alert(data)
        setLoader(false)
        // setError(data);
      }
    }
  };

  useEffect(() => {
    fn_get_session_configuration();
  }, []);

  const InputHandler = (e) => {
    if(error && error.idle_time || error && error.session_time){
      setError({...error, [e.target.name]: ''})
    }
    setInputs({...inputs, [e.target.name]: e.target.value})
  };

  
  return (
    // inputs.map((temp, i) =>
      <div className="m-4" key={i}>
        <Row>
          <Col
            lg={6}
            sm={12}
          >
            <Form>
              <div>
              <FormGroup className="align-items-lg-center d-flex flex-column flex-lg-row">
                <FormLabel className="col-lg-6 col-md-8 col-sm-12 form-label m-0 text-nowrap">Idle Timeout (min)</FormLabel>
                <Form.Control
                  size="sm"
                  type="number"
                  name="idle_time"
                  value={inputs.idle_time}
                  onChange={InputHandler}
                />
              </FormGroup>
              <div className="d-flex justify-content-end"><span className="sc_cl_span red">{error && error.idle_time}</span></div>
              </div>

              <div>
              <FormGroup className="align-items-lg-center d-flex flex-column flex-lg-row my-2">
                <FormLabel className="col-lg-6 col-md-8 col-sm-12 form-label m-0 text-nowrap">Session Timeout (min)</FormLabel>
                <Form.Control
                  size="sm"
                  type="number"
                  name="session_time"
                  onChange={InputHandler}
                  value={inputs.session_time}
                />
              </FormGroup>
              </div>
              <div className="d-flex justify-content-end"><span className="sc_cl_span red">{error && error.session_time}</span></div>
            </Form>

          </Col>

        </Row>



        <div className="d-flex justify-content-between sc_cl_row">
          <div>
            <FnBtnComponent 
            classname={"sc_cl_submit_button"} 
            children={!loader ? inputs.id ? 'Update' : 'Submit' : 'Loading....'} 
            onClick={fn_submit_details} 
            disabled={loader ? true : false}
            />
          </div>
        </div>
      </div>
    // )
  );
};

export default FnSessionConfiguration;
