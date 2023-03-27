import axiosApi from "./../axiosApi";

export const getDashboardDetail = (type) => (dispatch) => {
    return axiosApi({
        method: "get",
        url: `/dashboard/home`,
    }).then((resp) => {
        if (resp) {
            return resp && resp.data;
        }
    }).catch((error) => {
        const errMsg = error && error.response && error.response.data;
        return errMsg;
    });
};