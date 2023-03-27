import axiosApi from "./../axiosApi";

// getproductList
export const getproductList = (data) => (dispatch) => {
    data = (data === '') ? '' : '?' + data;
    return axiosApi({
        method: "get",
        url: `/product/list${data}`,
    }).then((resp) => {
        if (resp) {
            return resp && resp.data;
        }
    }).catch((error) => {
        const errMsg = error && error.response && error.response.data;
        return errMsg;
    });
};
// productStore 
export const productStore = (data) => (dispatch) => {
    return axiosApi({
        method: "post",
        url: "/product/store",
        data: data,
    }).then((resp) => {
        if (resp) {
            return resp;
        }
    }).catch((error) => {
        const errMsg = error && error.response && error.response.data;
        return errMsg;
    });
};

// getproductDetail
export const getproductDetail = (id) => (dispatch) => {
    return axiosApi({
        method: "get",
        url: "/product/show/" + id,
    }).then((resp) => {
        if (resp) {
            return resp.data;
        }
    }).catch((error) => {
        const errMsg = error && error.response && error.response.data;
        return errMsg;
    });
}

// product status change
export const productStatusChange = (id) => (dispatch) => {
    return axiosApi({
        method: "get",
        url: "/product/status_change/" + id,
    }).then((resp) => {
        if (resp) {
            return resp.data;
        }
    }).catch((error) => {
        const errMsg = error && error.response && error.response.data;
        return errMsg;
    });
}

// delete product
export const productDetele = (id) => (dispatch) => {
    return axiosApi({
        method: "delete",
        url: "/product/destroy",
        data: { id: id }
    }).then((resp) => {
        if (resp) {
            return resp.data;
        }
    }).catch((error) => {
        const errMsg = error && error.response && error.response.data;
        return errMsg;
    });
}

//productUpdate
export const productUpdate = (data) => (dispatch) => {
    return axiosApi({
        method: "post",
        url: "/product/update",
        data: data
    }).then((resp) => {
        if (resp) {
            return resp.data;
        }
    }).catch((error) => {
        const errMsg = error && error.response && error.response.data;
        return errMsg;
    });
}