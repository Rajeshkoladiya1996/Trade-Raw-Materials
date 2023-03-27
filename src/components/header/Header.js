import { Navbar, Dropdown } from "react-bootstrap";
import { Link, useHistory } from "react-router-dom";
import PropTypes from "prop-types";
import { connect } from "react-redux";
import THImage from "../THImage/THImage";
import THLink from "../THLink/THLink";
import { getAuthDetails, getNotification,readNotification } from "./../../actions";
import "./Header.css";
import { useEffect, useState } from "react";

const Header = (props) => {
  const history = useHistory();
  const [notification, setNotification] = useState([]);
  const [notificationCount, setNotificationCount] = useState(0);

  useEffect(() => {
    
    const token = localStorage.getItem("token");
    if (token) {
      props.getAuthDetails();
      props.getNotification().then((resp) => {
        if(resp && resp.ResponseCode===1){
          setNotification(resp.data);
          setNotificationCount(resp.data.count);
        }

      });
    }

  }, []);
  
  useEffect(() => {
    document.getElementsByClassName("sidebar")[0].classList.remove('hide-side-bar');
  },[]);

  const readNotification = ()=>{
    props.readNotification().then((resp) => {
      if(resp && resp.ResponseCode===1){
        setNotificationCount(0);
       }
    });
  }
  const logout = () => {
    localStorage.removeItem("token");
    history.push("/login");
  };

  return (
    <header>
      <Navbar expand="lg">
        <h1 className="page-title mb-0">{props.title}</h1>
		<h3 className="project-title ms-auto"> Themis Admin</h3>
        <Dropdown onClick={readNotification}>
          <Dropdown.Toggle id="dropdown-basic"  >
            <i className="ri-notification-2-line"></i>
            <span className="notification-count">{notificationCount}</span>
          </Dropdown.Toggle>

          <Dropdown.Menu >
            <Dropdown.ItemText>Notification</Dropdown.ItemText>
            {notification && notification.data &&
              notification.data.map(
                (item, key) => (
				<Dropdown.Item href={item?.order?.uuid?`/order/detail/${item?.order?.uuid}`:'#'}>
					<div className="notif-content">
						<div className="notif-img">
							<img src={`${notification.imagePath}${item?.user?.profile_img}`}
							alt="" className="img-cover" />
						</div>
						<div className="notif-details">
							<h5>{item.title}</h5>
							<p>{item.message}</p>
						</div>
					</div>
				</Dropdown.Item>
             )
             )}
          </Dropdown.Menu>
        </Dropdown>

				<Dropdown>
					<Dropdown.Toggle className="profile-dropdown-btn">
						<THImage
							src={props?.userDetail?.profile_img}
							alt="User"
							class="img-cover"
						/>
					</Dropdown.Toggle>
					<Dropdown.Menu className="profile-dropdown-menu">
						<Dropdown.Item as="li" className="bg-transparent">
							Hello, {props?.userDetail?.first_name}
						</Dropdown.Item>
						<Dropdown.Item>
							<THLink labelName="Edit Profile" to="/profile" />
						</Dropdown.Item>
						<Dropdown.Item>
							<THLink
								labelName="Logout"
								to="#"
								type="logout"
								parentCallback={logout}
							/>
						</Dropdown.Item>
					</Dropdown.Menu>
				</Dropdown>
			</Navbar>
		</header>
	);
};
Header.propsType = {
	getUserDetails: PropTypes.func,
	getNotification: PropTypes.func,
  readNotification: PropTypes.func,
};
const mapDispatchToProps = (dispatch) => ({
	getAuthDetails: (loginUser) => dispatch(getAuthDetails(loginUser)),
	getNotification: (loginUser) => dispatch(getNotification(loginUser)),
  	readNotification:(data)=>(dispatch(readNotification(data))),
});
const mapStateToProps = (state) => ({
	userDetail: state.authenticate.user,
	userNotification: state,
});

export default connect(mapStateToProps, mapDispatchToProps)(Header);
