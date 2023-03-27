import axios from "axios";
import config from "./config";

const axiosApi = axios.create({
  baseURL: config.API_URL,
});

export const setAuthHeader = (token) => {
  axiosApi.defaults.headers.common.Authorization =
    token || localStorage.getItem("token");
};

axiosApi.defaults.headers.common.Authorization = localStorage.getItem("token");

//if a 401 happens, the user will be logged out
axiosApi.interceptors.response.use(
  function (response) {
    return response;
  },
  function (error) {
    if ((error && error.response && error.response.status === 401) || (error.response.status === 409) ) {
      localStorage.removeItem("token");
      localStorage.removeItem("user_detail");
    }
    return Promise.reject(error);
  }
);

// Set the initial header from storage or something (should surround with try catch in actual app)
setAuthHeader(localStorage.getItem("token"));

export default axiosApi;
