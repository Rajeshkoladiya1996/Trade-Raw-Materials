import axiosApi from "../axiosApi";

// seller-product list
export const getsellProductList = (data) => (dispatch) => {
    // data = (data === '') ? '' : '?' + data;
    return axiosApi({
        method: "get",
        url: `/sell-product/list?status=${data}`,
    }).then((resp) => {
        if (resp) {
            return resp && resp.data;
        }
    }).catch((error) => {
        const errMsg = error && error.response && error.response.data;
        return errMsg;
    });
};

//seller-product status_change
export const sellProductStatusChange = (id) => (dispatch) => {
    return axiosApi({
        method: "get",
        url: "/sell-product/status_change/" + id,
    }).then((resp) => {
        if (resp) {
            return resp.data;
        }
    }).catch((error) => {
        const errMsg = error && error.response && error.response.data;
        return errMsg;
    });
}
export const getSellProductDetail = (id) => (dispatch) => {
    return axiosApi({
        method: "get",
        url: "/sell-product/show/" + id,
    }).then((resp) => {
        if (resp) {
            return resp.data;
        }
    }).catch((error) => {
        const errMsg = error && error.response && error.response.data;
        return errMsg;
    });
}

// sell-product destroy
export const sellProductDetele = (id) => (dispatch) => {
    return axiosApi({
        method: "delete",
        url: "/sell-product/destroy",
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
// sell-product update
export const sellProductUpdate = (data) => (dispatch) => {
    return axiosApi({
        method: "POST",
        url: "/sell-product/update",
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

// warehouse-product destroy
export const warehouseProductDelete = (id) => (dispatch) => {
    return axiosApi({
        method: "delete",
        url: "/warehouse/seller-products/destroy",
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

//seller-product status_change
export const wareProductStatusChange = (id) => (dispatch) => {
    return axiosApi({
        method: "get",
        url: "/warehouse/sell-products/status_change/" + id,
    }).then((resp) => {
        if (resp) {
            return resp.data;
        }
    }).catch((error) => {
        const errMsg = error && error.response && error.response.data;
        return errMsg;
    });
}

export const getWareProductDetail = (id) => (dispatch) => {
    return axiosApi({
        method: "get",
        url: "/warehouse/sell-products/show/" + id,
    }).then((resp) => {
        if (resp) {
            return resp.data;
        }
    }).catch((error) => {
        const errMsg = error && error.response && error.response.data;
        return errMsg;
    });
}
// sell-product update
export const warehouseProductUpdate = (data) => (dispatch) => {
    return axiosApi({
        method: "POST",
        url: "/warehouse/sell-product/update",
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