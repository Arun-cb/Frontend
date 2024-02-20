import React, { useState, useContext, useEffect } from "react";
import AuthContext from "../context/AuthContext";
import {
  Form,
  FormGroup,
  FormLabel,
  Row,
  Col
} from "react-bootstrap";
import Swal from "sweetalert2";
import FnBtnComponent from "../components/buttonComponent";

const FnSmtpConfiguration = () => {
  let { authTokens, user } = useContext(AuthContext);
  const [loader, setLoader] = useState(false);
  const [, setError] = useState({});
  const [inputs, setInputs] = useState([{
    created_by: user.user_id,
    last_updated_by: user.user_id,
    user_id: user.user_id,
    protocol: 'tls',
  }]);
  const [load, setLoad] = useState(false);

  const values = ["black", "red", "blue", "skyblue"];
  const labels = ["Black", "Red", "Blue", "Skyblue"];
  let i = 0;
  let options = [];

  for (i = 0; i < values.length; i++) {
    options.push({ value: values[i], label: labels[i] });
  }

  const fn_get_smtp = async () => {
    let res = await fetch(
      `${process.env.REACT_APP_SERVER_URL}/api/get_smtp`,
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
        // data.forEach((temp) => {
        //   tempobj[temp.variable_name] = { ...temp };
        // });
        setInputs(data);
      }
    }
  };

  const fn_submit_details = async () => {
    setLoader(true)
    let res = await fetch(
      `${process.env.REACT_APP_SERVER_URL}/api/ins_upt_smtp`,
      {
        method: "POST",
        body: JSON.stringify(inputs),
        headers: {
          "Content-Type": "application/json",
          Authorization: "Bearer " + String(authTokens.access),
        },
      }
    );
    let data = await res.json();
    if (res.status === 200) {
      Swal.fire({
        icon: 'success',
        // title: 'Updated',
        text: 'SMTP configuration is successfully done!',
      }).then(function () {
        setError()
        setLoad(true)
        setLoader(false)
      });
    } else {
      alert(data)
      setLoader(false)
      // setError(data);
    }
  };

  useEffect(() => {
    // if (load === false) {
    //   fn_get_smtp();
    // } else {
    //   setLoad();
    // }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [load]);

  const InputHandler = (e) => {
    if (inputs) {
      if (e.target.name === 'protocol') {
        if (e.target.value === '') {
          inputs[0] = { ...inputs[0], [e.target.name]: 'tls' }
        } else {
          inputs[0] = { ...inputs[0], [e.target.name]: e.target.value }
        }
      } else {
        inputs[0] = { ...inputs[0], [e.target.name]: e.target.value }
      }

      // inputs[0][e.target.name] = e.target.value
      // setInputs({...inputs, 'protocol': e.target.value})
    } else {
      inputs[0] = { ...inputs[0], [e.target.name]: e.target.value }
    }
    // setInputs({...inputs, 'protocol': e.target.value})
    setLoad(true)
    // if(e.target.name === 'tls'){
    //   console.log("tls")
    //   setInputs({...inputs, 'ssl': 'off'})
    // }else if(e.target.name === 'ssl'){
    //   setInputs({...inputs, 'tls': 'off'})
    // }
    // setInputs({...inputs, [e.target.name]: e.target.value})
    // inputs[temp.menu_id] = {...adata, menu_id: temp.menu_id,user_id:selectedid,[e.target.name]: e.target.value}
    // if (name === undefined) {
    //   if (!inputs[e.target.name]) {
    //     inputs[e.target.name] = {
    //       ...adata,
    //       variable_name: e.target.name,
    //       value: e.target.value,
    //     };
    //     setLoad(true);
    //   } else {
    //     inputs[e.target.name] = {
    //       ...inputs[e.target.name],
    //       value: e.target.value,
    //     };
    //     setLoad(true);
    //   }
    // } else {
    //   if (!inputs[name]) {
    //     inputs[name] = { ...adata, variable_name: name, value: e.value };
    //     setLoad(true);
    //   } else {
    //     inputs[name] = { ...inputs[name], value: e.value };
    //     setLoad(true);
    //   }
    // }
    // if(!inputs[e.target.name]){
    //         inputs[e.target.name] = {...adata, variable_name:e.target.name, value: e.target.value}
    //     setLoad(true)
    // }else{
    //     inputs[e.target.name] = {...inputs[e.target.name], value: e.target.value}
    //     setLoad(true)
    // }
  };

  
  return (
    inputs.map((temp, i) =>
      <div className="m-4" key={i}>
        {/* <div className="sc_cl_row">
          <h3 className="sc_cl_h3 m-0">SMTP Settings</h3>
        </div>

        <hr className="sc_cl_hr"></hr> */}

        <Row>
          <Col
            lg={6}
            sm={12}
          >
            <Form>
              <FormGroup className="align-items-lg-center d-flex flex-column flex-lg-row">
                <FormLabel className="col-lg-4 col-md-8 col-sm-12 form-label m-0 text-nowrap">SMTP SERVER</FormLabel>
                <Form.Control
                  size="sm"
                  name="server_name"
                  value={temp.server_name ? temp.server_name : ''}
                  onChange={InputHandler}
                />
              </FormGroup>

              <FormGroup className="align-items-lg-center d-flex flex-column flex-lg-row my-2">
                <FormLabel className="col-lg-4 col-md-8 col-sm-12 form-label m-0 text-nowrap">Email ID</FormLabel>
                <Form.Control
                  size="sm"
                  type="email"
                  name="username"
                  onChange={InputHandler}
                  value={temp.username ? temp.username : ''}
                />
              </FormGroup>


              <FormGroup className="align-items-lg-center d-flex flex-column flex-lg-row my-2">
                <FormLabel className="col-lg-4 col-md-8 col-sm-12 form-label m-0 text-nowrap">Password</FormLabel>
                <Form.Control
                  size="sm"
                  type="password"
                  name="password"
                  onChange={InputHandler}
                  value={temp.password ? temp.password : ''}
                />
              </FormGroup>

              <FormGroup className="align-items-lg-center d-flex flex-column flex-lg-row my-2">

                <FormLabel className="col-lg-4 col-md-8 col-sm-12 form-label m-0 text-nowrap">SSL</FormLabel>

                <Form.Check
                  value={temp.protocol === 'ssl' ? '' : 'ssl'}
                  checked={(temp.protocol && (temp.protocol === 'ssl' ? true : null)) || ''}
                  onChange={InputHandler}
                />
                <Form.Label className="m-0">(Check to include SSL)</Form.Label>
              </FormGroup>


              <FormGroup className="align-items-lg-center d-flex flex-column flex-lg-row my-2">
                <FormLabel className="col-lg-4 col-md-8 col-sm-12 form-label m-0 text-nowrap">Port</FormLabel>
                <Form.Control
                  size="sm"
                  type="number"
                  name="port"
                  onChange={InputHandler}
                  value={temp.port ? temp.port : ''}
                />
              </FormGroup>

            </Form>

          </Col>

        </Row>



        <div className="d-flex justify-content-between sc_cl_row">
          <div>
            <FnBtnComponent 
            classname={"sc_cl_submit_button"} 
            children={!loader ? temp.id ? 'Update' : 'Submit' : 'Loading....'} 
            onClick={fn_submit_details}
            disabled={loader ? true : false}
            />
          </div>
        </div>
      </div>
    )
  );
};

export default FnSmtpConfiguration;
