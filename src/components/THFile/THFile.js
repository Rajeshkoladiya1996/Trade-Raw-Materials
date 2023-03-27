import { Form } from "react-bootstrap";

const THFile = (props)=> {

	const previewImage = (e) => {
		props.perentImageCallback(e);
	};

	return (
		<Form.Group>
			<Form.Label>{props.labelName}</Form.Label>
			<div className="themis-custom-file">
				<label htmlFor={props.id} className="themis-img-preview">
					<img
						src={props.src}
						alt="not found"
						className="img-fluid img-contain"
					/>
					<span className="themis-lbl-text">{props.labelName}</span>
				</label>
				<div className="themis-file-inputbox">
					<input
						id={props.id}
						name={props.name}
						type={props.type}
						title={props.title}
						accept={props.accept}
						onChange={previewImage}
					/>
				</div>
			</div>
			<span className="error-message">{props.errorMessage}</span>
		</Form.Group>
	);
}

export default THFile;
