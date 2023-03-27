import axiosApi from "../axiosApi";

// bid-product list
export const getbidProductList = (data) => (dispatch) => {
    data = (data === '') ? '' : '?' + data;
    return axiosApi({
        method: "get",
        url: `/bid-product/list${data}`,
    }).then((resp) => {
        if (resp) {
            return resp && resp.data;
        }
    }).catch((error) => {
        const errMsg = error && error.response && error.response.data;
        return errMsg;
    });
};

// bid-product status_change
export const bidProductStatusChange = (id) => (dispatch) => {
    return axiosApi({
        method: "get",
        url: "/bid-product/status_change/" + id,
    }).then((resp) => {
        if (resp) {
            return resp.data;
        }
    }).catch((error) => {
        const errMsg = error && error.response && error.response.data;
        return errMsg;
    });
}

// bid-product destroy
export const bidProductDetele = (id) => (dispatch) => {
    return axiosApi({
        method: "delete",
        url: "/bid-product/destroy",
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

// bid-product show
export const getBidProductDetail = (id) => (dispatch) => {
    return axiosApi({
        method: "get",
        url: "/bid-product/show/" + id,
    }).then((resp) => {
        if (resp) {
            return resp.data;
        }
    }).catch((error) => {
        const errMsg = error && error.response && error.response.data;
        return errMsg;
    });
}

// bid-product update
export const bidProductUpdate = (data) => (dispatch) => {
    return axiosApi({
        method: "POST",
        url: "/bid-product/update",
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
