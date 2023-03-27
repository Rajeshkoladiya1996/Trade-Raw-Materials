import React from "react";
import { Modal, Button } from "react-bootstrap";
import "./THModal.css";

const THProductStatusModal = (props)=> {
	const {statustext} = props;
	return (
		<div>
			<Modal {...props} size="md" centered className="confirmation-modal">
				<Modal.Body>
					<div className="modal-title-bar">
						<Button
							className="close-btn ms-auto"
							variant="none"
							onClick={() => props.onHide(0)}>
							<i className="ri-close-line"></i>
						</Button>

						<Modal.Title id="productStatusModal">Change Status</Modal.Title>
					</div>
					<p className="modal-description">
						{statustext}
					</p>

					<div className="modal-action-wrap">
						<Button
							className="primary-btn danger"
							variant="none"
							onClick={()=>props.onHide(0)}>
							Cancel
						</Button>
						<Button className="primary-btn" 
							variant="none"
						 	onClick={()=>props.onHide(1)}>
							Yes
						</Button>
					</div>
				</Modal.Body>
			</Modal>
		</div>
	);
}

export default  THProductStatusModal;