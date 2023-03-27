import React from "react";
import {Modal,  Form} from "react-bootstrap";
import "./THModal.css";
import THInput from "../THInput/THInput";
import THButton from "../THButton/THButton";

const THModalForm = (props) => {
  const {CategoryModalText} = props;
  
  	const inputChangeHandler=(e)=>{
		props.inputChangeHandler(e);
	}

	const submitCategory = (e) => {
		props.submitCategory(e,CategoryModalText);
	};

  return (
    <div>
      	<Modal {...props} size="md" centered className="confirmation-modal">
			<Modal.Header className="position-relative border-0">
				<Modal.Title id="productStatusModal">{CategoryModalText}</Modal.Title>
				<THButton className="close-btn ms-auto" variant="none" onClickButton={() => props.onHideModal(0)} name={<i className="ri-close-line"></i>}/>
			</Modal.Header>
			<Form onSubmit={submitCategory}>
				<Modal.Body>
					<THInput 
						id="name"
						name="name"  
						label="Category Name"
						placeholder="Category Name" 
						type="text"
						className1="mb-0"
						inputChangeHandler={inputChangeHandler}
						errors_msg={props.errors_msg}
						datavalue={props.datavalue} />
				</Modal.Body>
				<Modal.Footer className="border-0">
				<div className="modal-action-wrap">
					<THButton className="primary-btn" variant="none" type="submit" name="Save"/>
					<THButton className="primary-btn danger" variant="none" onClickButton={() => props.onHideModal(0)} name="Cancel"/>
				</div>
				</Modal.Footer>
			</Form>
      </Modal>
    </div>
  );
}

export default  THModalForm;