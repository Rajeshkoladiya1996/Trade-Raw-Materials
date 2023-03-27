import React from "react";
import { Form, Image } from "react-bootstrap";

const THInput = (props)=> {

    const inputChangeHandlers=(e)=>{
        props.inputChangeHandler(e);
    }
    const handleClick=()=>{
        props.handleClick();
    }

        return (
            <>
                <Form.Group controlId={props.id} className={props.className1}>
                    {
                        props.label && (
                            <Form.Label>{props.label}</Form.Label>
                        )
                    }
                    {
                        props.type==="text" || props.type==="email" || props.type==="password" ? (
                            <Form.Control type={props.type} 
                            placeholder={props.placeholder}
                            rows={props.rows}
                            name={props.name}
                            readOnly={props.readonly}
                            onChange={inputChangeHandlers}
                            value={props.datavalue}
                            className={props.className2}
                             />
                        )
                        :
                        (
                            <Form.Control type={props.type} 
                            placeholder={props.placeholder}
                            rows={props.rows}
                            as={props.type} 
                            name={props.name}
                            onChange={inputChangeHandlers}
                            value={props.datavalue}
                            className={props.className2}
                                />
                        )
                    }
                    
                <span className="error-msg">{props.errors_msg}</span>
                {
                    props.id==="password" && (
                    <span className="show-password" onClick={handleClick}>
                        {}
                        {props.type === "text" ? (
                            <Image
                            src="/assets/images/icons/hide-eye.svg"
                            width="24px"
                            height="24px"></Image>
                            ) : (
                                <Image
                                src="/assets/images/icons/eye.svg"
                                width="24px"
                                height="24px"></Image>
                                )}
                    </span>)
                }
                </Form.Group>
            </>
        );
    }

export default THInput;