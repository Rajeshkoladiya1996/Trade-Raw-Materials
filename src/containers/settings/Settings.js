import React from "react";
import { Link } from "react-router-dom";
import Header from "../../components/header/Header";
import {updateSettings,settingsList} from "../../actions";
import THToggleButton from "../../components/THToggleButton/THToggleButton";
import { connect } from "react-redux";
import "./Setting.css";
import PropTypes from "prop-types";
import { toast } from "react-toastify";

class Settings extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      checked: false,
      checkList: [],
    };
    this.onToggleSwitchChange = this.onToggleSwitchChange.bind(this);
  }
  componentDidMount() {
    this.getSettings();
  }
  getSettings=()=>{
    this.props.settingsList().then((response) => {
      if(response && response.data &&  response.data.settings){
        response.data.settings.map((setting)=>{
          this.setState({
            checkList: { ...this.state.checkList, ['notification_'+setting.notification_type]: setting.status },
          });
        })
        this.setState({
          checkList: { ...this.state.checkList, 'vacation_mode': response?.data?.vacation_mode },
        });
      }
    });
  }
  onToggleSwitchChange(e, value,type) {
    
    let { id } = e.target;
    this.setState({
      checkList: { ...this.state.checkList, [id]: !value },
    },()=>{
      let status=value?0:1;
      let settingsData={status:status,notification_type:type};
      this.updateSettings(settingsData);
    });
  }
  updateSettings = async (settingsData) => {
    this.props.updateSettings(settingsData).then((response) => {
      if (response && response.ResponseCode === 1) {
      } else {
        toast.error("Something went wrong");
      }
    });
  }

  render() {
    const { checkList } = this.state;
    const { userDetail } = this.props;
    return (
      <main className="page-content setting-page">
        <Header title="Settings" />
        <div className="main-content">
          <div className="setting-grid">
            <section className="profile">
              <div className="title-bar">
                <h2>Profile</h2>
                <Link to="/profile" className="action-link">
                  Edit
                </Link>
              </div>
              <div className="profile-detail">
                <div className="profile-detail-top">
                  <div className="profile-img">
                    <img
                      className="img-cover"
                      src="/assets/images/users/user-1.png"
                      alt="Order"
                    />
                  </div>
                  <div className="profile-info-wrap">
                    <h4 className="mb-0">{`${userDetail?.first_name}${userDetail?.last_name}`}</h4>
                    <p className="mb-0">
                      <small>{userDetail?.email}</small>
                    </p>
                  </div>
                </div>
              </div>
            </section>
            <section>
              <div className="row gx-3">
                <div className="col">
                  <div className="reset-password me-1">
                    <div className="title-bar m-0">
                      <h2 className="m-0 w-50">Reset Password</h2>
                      <Link to="/reset-password" className="btn secondary-btn">
                        RESET
                      </Link>
                    </div>
                  </div>
                </div>
                <div className="col">
                  <div className="vacation-mode">
                    <div className="title-bar m-0 ">
                      <h2 className="m-0 w-50">Vacation Mode</h2>
                      <THToggleButton
                        name="vacation_mode"
                        id="vacation_mode"
                        checked={checkList.vacation_mode}
                        dataValue="vacation"
                        onToggleSwitchChange={(e, value,type) =>
                          this.onToggleSwitchChange(e, value,type)
                        }
                      />
                    </div>
                  </div>
                </div>
              </div>
            </section>
            <section className="notification">
              <div className="title-bar">
                <h2 className="m-0">Buying Notification</h2>
              </div>
              <div className="notification-block">
                <div className="">
                  <h5>Bidding, New Lowest Ask</h5>
                  <p className="mb-0">
                    Sent when a new Lowest Ask is placed on an item you’re
                    bidding on.
                  </p>
                </div>
                <THToggleButton
                  name="notification_0"
                  id="notification_0"
                  checked={checkList.notification_0}
                  dataValue={0}
                  onToggleSwitchChange={(e, value,type) =>
                    this.onToggleSwitchChange(e, value,type)
                  }
                />
              </div>
              <div className="notification-block">
                <div className="">
                  <h5>Bidding, New Highest Bid</h5>
                  <p className="mb-0">
                    Sent when a new Lowest Ask is placed on an item you’re
                    bidding on.
                  </p>
                </div>
                <THToggleButton
                  name="notification_1"
                  id="notification_1"
                  checked={checkList.notification_1}
                  dataValue={1}
                  onToggleSwitchChange={(e, value,type) =>
                    this.onToggleSwitchChange(e, value,type)
                  }
                />
              </div>
              <div className="notification-block">
                <div className="">
                  <h5>Bid Expired</h5>
                  <p className="mb-0">Sent when your Bid has expired.</p>
                </div>
                <THToggleButton
                  name="notification_2"
                  id="notification_2"
                  checked={checkList.notification_2}
                  dataValue={2}
                  onToggleSwitchChange={(e, value,type) =>
                    this.onToggleSwitchChange(e, value,type)
                  }
                />
              </div>
              <div className="notification-block">
                <div className="">
                  <h5>Bid Accepted</h5>
                  <p className="mb-0">Your bid has been accepted.</p>
                </div>
                <THToggleButton
                  name="notification_3"
                  id="notification_3"
                  checked={checkList.notification_3}
                  dataValue={3}
                  onToggleSwitchChange={(e, value,type) =>
                    this.onToggleSwitchChange(e, value,type)
                  }
                />
              </div>
              <div className="notification-block">
                <div className="">
                  <h5>Buyer Nearby Match</h5>
                  <p className="mb-0">
                    Sent if a seller lists an Ask at the same price, or lower,
                    within 1/2 size of your existing Bid.
                  </p>
                </div>
                <THToggleButton
                  name="notification_4"
                  id="notification_4"
                  checked={checkList.notification_4}
                  dataValue={4}
                  onToggleSwitchChange={(e, value,type) =>
                    this.onToggleSwitchChange(e, value,type)
                  }
                />
              </div>
            </section>

            <section className="notification">
              <div className="title-bar">
                <h2 className="m-0">Selling Notification</h2>
              </div>
              <div className="notification-block">
                <div className="">
                  <h5>Bidding, New Lowest Ask</h5>
                  <p className="mb-0">
                    Sent when a new Lowest Ask is placed on an item you’re
                    bidding on.
                  </p>
                </div>
                <THToggleButton
                  name="notification_5"
                  id="notification_5"
                  checked={checkList.notification_5}
                  dataValue={5}
                  onToggleSwitchChange={(e, value,type) =>
                    this.onToggleSwitchChange(e, value,type)
                  }
                />
              </div>
              <div className="notification-block">
                <div className="">
                  <h5>Bidding, New Highest Bid</h5>
                  <p className="mb-0">
                    Sent when a new Lowest Ask is placed on an item you’re
                    bidding on.
                  </p>
                </div>
                <THToggleButton
                  name="notification_6"
                  id="notification_6"
                  checked={checkList.notification_6}
                  dataValue={6}
                  onToggleSwitchChange={(e, value,type) =>
                    this.onToggleSwitchChange(e, value,type)
                  }
                />
              </div>
              <div className="notification-block">
                <div className="">
                  <h5>Item Sold</h5>
                  <p className="mb-0">Your item has sold.</p>
                </div>
                <THToggleButton
                  name="notification_7"
                  id="notification_7"
                  checked={checkList.notification_7}
                  dataValue={7}
                  onToggleSwitchChange={(e, value,type) =>
                    this.onToggleSwitchChange(e, value,type)
                  }
                />
              </div>
              <div className="notification-block">
                <div className="">
                  <h5>Ask Expiring</h5>
                  <p className="mb-0">
                    Sent 24 hours before your active Ask expires.
                  </p>
                </div>
                <THToggleButton
                  name="notification_8"
                  id="notification_8"
                  checked={checkList.notification_8}
                  dataValue={8}
                  onToggleSwitchChange={(e, value,type) =>
                    this.onToggleSwitchChange(e, value,type)
                  }
                />
              </div>
              <div className="notification-block">
                <div className="">
                  <h5>Seller Nearby Match</h5>
                  <p className="mb-0">
                    Sent if a Buyer lists an Bid at the same price, or lower,
                    within 1/2 size of your existing Ask.
                  </p>
                </div>
                <THToggleButton
                  name="notification_9"
                  id="notification_9"
                  checked={checkList.notification_9}
                  dataValue={9}
                  onToggleSwitchChange={(e, value,type) =>
                    this.onToggleSwitchChange(e, value,type)
                  }
                />
              </div>
            </section>
          </div>
        </div>
      </main>
    );
  }
}
Settings.propsType = {
	updateSettings: PropTypes.func,
  settingsList: PropTypes.func,
};
const mapDispatchToProps = (dispatch) => ({
	updateSettings: (data) => dispatch(updateSettings(data)),
  settingsList: (data) => dispatch(settingsList(data)),
});


const mapStateToProps = (state) => ({
  userDetail: state.authenticate.user,
});
export default connect(mapStateToProps, mapDispatchToProps)(Settings);
