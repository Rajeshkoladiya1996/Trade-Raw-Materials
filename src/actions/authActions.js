// import { authenticationConstants } from '../constants';
import axiosApi, { setAuthHeader } from "./../axiosApi";
import { STORE_USER_DATA } from "./../constants";

//Store user data in redux
export const storeUserDetails = (payload) => ({
  type: STORE_USER_DATA,
  payload,
});

// Login
export const doLogin = (loginUserData) => (dispatch) => {
  return axiosApi({
    method: "post",
    url: "/auth/login",
    data: loginUserData,
  })
    .then(async (resp) => {
      if (resp) {
        const { data } = resp.data;
        localStorage.setItem("token", `Bearer ${data.token}`);
        setAuthHeader(`Bearer ${data.token}`);
        dispatch(storeUserDetails(data));
        return resp;
      }
    })
    .catch((error) => {
      return error;
    });
};

// get login userprofile
export const getProfile = (data) => (dispatch) => {
  return axiosApi({
    method: "get",
    url: "/auth/profile",
  })
    .then((resp) => {
      if (resp) {
        const { data } = resp.data;
        return resp.data;
      }
    })
    .catch((error) => {
      return error;
    });
};

// update login userprofile
export const updateProfile = (data) => (dispatch) => {
  return axiosApi({
    method: "post",
    url: "/auth/update-profile",
    data: data,
  })
    .then((resp) => {
      if (resp) {
        const { data } = resp.data;
        return resp.data;
      }
    })
    .catch((error) => {
      return error;
    });
};

// get login userdetails
export const getAuthDetails = (loginUserData) => (dispatch) => {
  return axiosApi({
    method: "post",
    url: "/auth/get-user",
  })
    .then(async (resp) => {
      if (resp) {
        const { data } = resp.data;
        dispatch(storeUserDetails(data));
        return resp;
      }
    })
    .catch((error) => {
      return error;
    });
};

// get login userdetails
export const changePassword = (data) => (dispatch) => {
  return axiosApi({
    method: "post",
    url: "/auth/change-password",
    data:data,
  })
    .then(async (resp) => {
      if (resp) {
        return resp.data;
      }
    })
    .catch((error) => {
      return error;
    });
};

//getNotification
export const getNotification = (id) => (dispatch) => {
  return axiosApi({
    method: "get",
    url: `/auth/notification-list`,
  }).then((resp) => {
    if (resp) {
      return resp && resp.data;
    }
  }).catch((error) => {
    const errMsg = error && error.response && error.response.data;
    return errMsg;
  });
}

// readNotification
export const readNotification = (id) => (dispatch) => {
  return axiosApi({
    method: "get",
    url: `/auth/notification-read`,
  }).then((resp) => {
    if (resp) {
      return resp && resp.data;
    }
  }).catch((error) => {
    const errMsg = error && error.response && error.response.data;
    return errMsg;
  });
}
export const updateSettings = (data) => (dispatch) => {
  return axiosApi({
    method: "post",
    url: "/auth/update-settings",
    data: data,
  })
    .then(async (resp) => {
      if (resp) {
        return resp.data;
      }
    })
    .catch((error) => {
      return error;
    });
};
export const settingsList = (data) => (dispatch) => {
  return axiosApi({
    method: "post",
    url: "/auth/settings-list",
    data: data,
  })
    .then(async (resp) => {
      if (resp) {
        return resp.data;
      }
    })
    .catch((error) => {
      return error;
    });
};

// forgot password
export const forgotPassword = (data) => (dispatch) => {
  return axiosApi({
    method: "post",
    url: "/auth/forget-password",
    data: data,
  })
    .then(async (resp) => {
      if (resp) {
        return resp.data;
      }
    })
    .catch((error) => {
      const errMsg = error && error.response && error.response.data;
      return errMsg;
    });
};

// verify otp
export const verifyOTP = (data) => (dispatch) => {
  return axiosApi({
    method: "post",
    url: "/auth/varify-otp",
    data: data,
  })
    .then(async (resp) => {
      if (resp) {
        return resp.data;
      }
    })
    .catch((error) => {
      const errMsg = error && error.response && error.response.data;
      return errMsg;
    });
};