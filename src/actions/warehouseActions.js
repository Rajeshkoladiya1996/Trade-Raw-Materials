import axiosApi from "./../axiosApi";

// getWarehouseList
export const getWarehouseList = () => (dispatch) => {
    return axiosApi({
        method: "get",
        url: `/warehouse/list`,
    }).then((resp) => {
        if (resp) {
            return resp && resp.data;
        }
    }).catch((error) => {
        const errMsg = error && error.response && error.response.data;
        return errMsg;
    });
};
// warehouseStore 
export const warehouseStore = (data) => (dispatch) => {
    return axiosApi({
        method: "post",
        url: "/warehouse/store",
        data: data,
    }).then((resp) => {
        if (resp) {
            return resp.data;
        }
    }).catch((error) => {
        const errMsg = error && error.response && error.response.data;
        return errMsg;
    });
};

// getWarehouseDetail
export const getWarehouseDetail = (id) => (dispatch) => {
    return axiosApi({
        method: "get",
        url: "/warehouse/show/" + id,
    }).then((resp) => {
        if (resp) {
            return resp.data;
        }
    }).catch((error) => {
        const errMsg = error && error.response && error.response.data;
        return errMsg;
    });
}

// delete warehouse
export const warehouseDelete = (id) => (dispatch) => {
    return axiosApi({
        method: "delete",
        url: "/warehouse/destroy",
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

//warehouseUpdate
export const warehouseUpdate = (data) => (dispatch) => {
    return axiosApi({
        method: "post",
        url: "/warehouse/update",
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

// warehouse status change
export const warehouseStatusChange = (id) => (dispatch) => {
    return axiosApi({
        method: "get",
        url: "/warehouse/status_change/" + id,
    }).then((resp) => {
        if (resp) {
            return resp.data;
        }
    }).catch((error) => {
        const errMsg = error && error.response && error.response.data;
        return errMsg;
    });
}
