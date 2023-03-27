import React, { useState,useEffect }  from "react";
import { Form } from "react-bootstrap";
import GooglePlacesAutocomplete from "react-google-places-autocomplete";

const GOOGLE_MAPS_API_KEY = process.env.REACT_APP_GOOGLE_MAPS_API_KEY;

const THGoogleAddress = (props) => {
	const [value, setValue] = useState();
	useEffect(() => {
		if (props.dataValue) {
			let address = {
				label: props.dataValue,
				value: {
					place_id: ""
				}
			};
			setValue(address);
		}
	}, [props])
	const inputHandleChange = (value) => {
		setValue(value);
		props.handleCallbackGoogle(value);
	};


  	return (
		<>
			<Form.Group controlId={props.controlId} className={props.classGroup}>
				{props.isLable && <Form.Label htmlFor="">{props.labelName}</Form.Label>}
				<GooglePlacesAutocomplete
					apiKey={GOOGLE_MAPS_API_KEY}
					selectProps={{
						value,
						isClearable:true,
						onChange: (val) => {
							inputHandleChange(val);
						},
						className: "themis-google-select",
						classNamePrefix: "themis-select",
					}}
				/>
				<span className="error-msg">{props.errorMessage}</span>
			</Form.Group>
		</>
  	);
};

export default THGoogleAddress;
