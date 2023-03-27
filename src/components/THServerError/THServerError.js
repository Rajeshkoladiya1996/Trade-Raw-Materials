import React from "react";
import { Link } from "react-router-dom";

export default function THServerError() {
	return (
		<main className="page-error">
			<div className="page-error-img">
				<i class="ri-error-warning-line"></i>
			</div>

			<h1>Oops</h1>
			<h2>Something Went Wrong!</h2>

			<div className="d-flex align-items-center mt-3">
				<Link to="/" className="action-link">
					Back to Home
				</Link>
			</div>
		</main>
	);
}
