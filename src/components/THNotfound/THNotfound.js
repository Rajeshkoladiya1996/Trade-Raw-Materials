import React,{useEffect} from "react";
import { Link } from "react-router-dom";

const THNotFound = () => {
	useEffect(() => {
        document.getElementsByClassName("sidebar")[0].classList.add('hide-side-bar');
    },[]);

	return (
		<main className="page-error">
			<div className="page-error-img">
				<i class="ri-file-unknow-line"></i>
			</div>

			<h1>Error 404</h1>
			<h2>Page Not Found</h2>

			<div className="d-flex align-items-center mt-3">
				<Link to="/" className="action-link">
					Back to Home
				</Link>
			</div>
		</main>
	);
}
export default THNotFound;
