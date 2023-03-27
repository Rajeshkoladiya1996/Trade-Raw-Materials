import axiosApi  from "./../axiosApi";

// request list
export const getWalletRequest=(data)=>(dispatch)=>{
    return axiosApi({
        method: "get",
        url: `/wallet-request`,
    }).then((resp) => {
        if (resp) {
          return resp.data;
        }
    }).catch((error) => {
        const errMsg = error && error.response && error.response.data;
        return errMsg;
    });
}
export const confirmWalletRequest=(data)=>(dispatch)=>{
    return axiosApi({
        method: "post",
        url: `/wallet-request/confirm`,
        data:data,
    }).then((resp) => {
        if (resp) {
          return resp.data;
        }
    }).catch((error) => {
        const errMsg = error && error.response && error.response.data;
        return errMsg;
    });
}
export const getWalletDetail = (type) => (dispatch) => {
    return axiosApi({
        method: "get",
        url: `/wallet/get-wallet-details`,
    }).then((resp) => {
        if (resp) {
            return resp && resp.data;
        }
    }).catch((error) => {
        const errMsg = error && error.response && error.response.data;
        return errMsg;
    });
};