import React, { useState } from "react";
import { Form, FormGroup } from "react-bootstrap";
import FnTooltipComponent from "./tooltipComponent";
import { VscEye, VscEyeClosed } from "react-icons/vsc";

export default function FnFormComponent({ fields, select, stylename, onchange, formData, errorcode, disablevalue, tooltipvalue, client_error_msg }) {

    const [isSwitchOn, setIsSwitchOn] = useState(false);
    const [client_error_msg1, setClientErrorMsg1] = useState({client_error_msg});
    const [passwordType, setPasswordType] = useState("password");
    const handleInput = (evt) => {
        const { name, value,files } = evt.target
        const checkValue = evt.target.type === "checkbox" ? setIsSwitchOn(!isSwitchOn) : ""
        const fileValue = evt.target.type === "file" ? files[0]: 
        evt.target.type === "checkbox" ? evt.target.checked :value
        onchange(name, fileValue)

        // Update client_error_msg state
    setClientErrorMsg1((prevClientErrorMsg) => ({
        ...prevClientErrorMsg,
        [evt.target.name]: "",
    }));
        // client_error_msg[evt.target.name] = "";
    }

    const togglePassword = () => {
        if (passwordType === "password") {
          setPasswordType("text");
          return;
        }
        setPasswordType("password");
      };

        
    return (
        <Form>
            <Form.Group className="sc_cl_form_alignment">
                {
                    fields.map((items, index) => {
                        return (
                            <div key={index} className="sc_cl_field_alignment" >
                                <div className="gap-1">
                                    <Form.Label className="sc_cl_label" htmlFor={items.name}>{items.label}{items.ismandatory == 'Y' ? <sup className="text-danger fs-6">*</sup> :''}
                                    {
                                        tooltipvalue  ? (
                                            <FnTooltipComponent
                                            label={tooltipvalue.filter(user => user.context_order === items.id).map((use) => use.label)}
                                            context={tooltipvalue.filter(user => user.context_order === items.id).map((use) => use.help_context)}
                                            classname={""}
                                            placement="bottom"
                                        />
                                        )
                                        :
                                        (<></>)
                                    }
                                        
                                    </Form.Label>
                                    {
                                        items.type == 'select' ?
                                            (<Form.Select
                                                value={formData[items.name]}
                                                name={items.name}
                                                onChange={handleInput}
                                                disabled={disablevalue}
                                                size="sm"
                                            >
                                                <option hidden>Select Option</option>
                                                {
                                                    select[items.name].map((items,index) => (
                                                        <option key={index} value={items.value}>{items.label}</option>
                                                    ))
                                                }

                                            </Form.Select>)
                                            : items.type == 'file' ?
                                                (<Form.Control
                                                    name={items.name}
                                                    size="sm"
                                                    type={items.type}
                                                    onChange={handleInput}
                                                    autoComplete="off"
                                                />)
                                                : items.type == 'switch' ?
                                                    (<Form.Check 
                                                        type={items.type}
                                                        // id="custom-switch"
                                                        name={items.name}
                                                        onChange={handleInput}
                                                        disabled={disablevalue}
                                                        // label="Check this switch"
                                                        // value={formData[items.name]}
                                                        checked={formData[items.name]}
                                                    />
                                                  )
                                                  :items.type == 'textarea' ?
                                                  (<Form.Control
                                                    as={items.type} // Setting the type to "textarea"
                                                    style={{resize: 'none'}}
                                                    placeholder={items.placeholder} // Placeholder text for the textarea
                                                    value={formData[items.name]} // Value of the textarea taken from formData
                                                    name={items.name} // Name of the textarea input
                                                    onChange={handleInput} // Event handler for textarea value changes
                                                    disabled={disablevalue} // Whether the textarea should be disabled or not
                                                    className={stylename} // Additional class for custom styling (optional)
                                                    size="sm" // Size of the textarea, e.g., "sm", "lg", etc.
                                                    maxLength={items.maxlen} // Maximum character length for the textarea
                                                    autoComplete="off" // Disable browser autoComplete for the textarea
                                                  />)
                                                
                                                :items.type == 'password' ?
                                                (<>
                                                <div className="password-input-container">
                                                <Form.Control
                                                    type={passwordType}
                                                    placeholder={items.placeholder}
                                                    onChange={handleInput}
                                                    value={formData[items.name]}
                                                    name={items.name}
                                                    disabled={disablevalue}
                                                    className={stylename}
                                                    autoComplete="off"
                                                    size="sm"
                                                  />
                                                  <i className="password-toggle-icon" onClick={togglePassword}>{passwordType === "password" ? <VscEyeClosed /> : <VscEye />}</i>
                                                  </div>
                                                  </>)
                                                
                                                :

                                                (<Form.Control
                                                    type={items.type}
                                                    placeholder={items.placeholder}
                                                    value={formData[items.name]}// !== null ? formData[items.name] : ''}
                                                    name={items.name}
                                                    onChange={handleInput}
                                                    disabled={disablevalue}
                                                    className={stylename}
                                                    size="sm"
                                                    maxLength={items.maxlen}
                                                    max={items.maxval}
                                                    min={items.minval}
                                                    autoComplete="off"
                                                />)
                                    }
                                </div>
                                {/* <span className="sc_cl_span red">
                                    {errorcode && errorcode[0][items.name] ? errorcode[1][items.name] : ''}
                                </span> */}
                                <span className="sc_cl_span red" key={index}>
                                    {client_error_msg && client_error_msg ? client_error_msg[items.name] :
                                     errorcode && errorcode[index] && errorcode[index][items.name] ? errorcode[index][items.name] 
                                    : errorcode && errorcode[items.name] ? 
                                    errorcode[items.name]
                                    : ''}
                                </span>
                            </div>
                        )
                    })
                }

            </Form.Group>
        </Form>
    )
}