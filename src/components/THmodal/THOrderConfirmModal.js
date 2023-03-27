import React from "react";
import { Modal, Button } from "react-bootstrap";
import "./THModal.css";

const THOrderConfirmModal=(props)=> {
	return (
		<div>
			<Modal {...props} size="md" centered className="confirmation-modal">
				<Modal.Body>
					<div className="modal-title-bar">
						<Button
							className="close-btn ms-auto"
							variant="none"
							onClick={()=>props.onHide(0)}>
							<i className="ri-close-line"></i>
						</Button>

						<Modal.Title id="productStatusModal">{props.title}</Modal.Title>
					</div>
					<p className="modal-description">{props.description}</p>

					<div className="modal-action-wrap">
						<Button
							className="primary-btn danger"
							variant="none"
							onClick={()=>props.onHide(props.reject)}>
							Reject
						</Button>
						<Button className="primary-btn" 
							variant="none" 
							onClick={()=>props.onHide(props.confirm)}>
							Accept
						</Button>
					</div>
				</Modal.Body>
			</Modal>
		</div>
	);
}

export default THOrderConfirmModal;