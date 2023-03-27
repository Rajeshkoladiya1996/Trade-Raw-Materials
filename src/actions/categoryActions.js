import axiosApi from "./../axiosApi";

// getAllCategoryList
export const getallCategoryList = (data) => (dispatch) => {
    data = (data === '') ? '' : '?' + data;
    return axiosApi({
        method: "get",
        url: `/category/list${data}`,
    }).then((resp) => {
        if (resp) {
            return resp && resp.data;
        }
    }).catch((error) => {
        return error;
    });
};

// category store
export const categoryAdd = (data) => (dispatch) => {
    return axiosApi({
        method: "post",
        url: "category/store",
        data: { name: data },
    }).then((resp) => {
        if (resp) {
            return resp;
        }
    }).catch((error) => {
        const errMsg = error && error.response && error.response;
        return errMsg;
    });
}

// category Get details
export const categoryDetail = (id) => (dispatch) => {
    return axiosApi({
        method: "get",
        url: `/category/show/${id}`,
    }).then((resp) => {
        if (resp) {
            return resp.data;
        }
    }).catch((error) => {
        const errMsg = error && error.response;
        return errMsg;
    });
}

//categoryUpdate
export const categoryUpdate = (data) => (dispatch) => {
    return axiosApi({
        method: "post",
        url: "/category/update",
        data: { id: data.cateId, name: data.name }
    }).then((resp) => {
        if (resp) {
            return resp.data;
        }
    }).catch((error) => {
        const errMsg = error && error.response;
        return errMsg;
    });
}

// categoryStatusChange
export const categoryStatusChange = (id) => (dispatch) => {
    return axiosApi({
        method: "get",
        url: "/category/status_change/" + id,
    }).then((resp) => {
        if (resp) {
            return resp.data;
        }
    }).catch((error) => {
        return error;
    });
}

// getcategoryList
export const getcategoryList = (data) => (dispatch) => {
    data = (data === '') ? '' : '?' + data;
    return axiosApi({
        method: "get",
        url: `/category/label_cat${data}`,
    }).then((resp) => {
        if (resp) {
            return resp && resp.data;
        }
    }).catch((error) => {
        return error;
    });
};

// category delete
export const categoryDetele = (id) => (dispatch) => {
    return axiosApi({
        method: "delete",
        url: "/category/destroy",
        data: { id: id }
    }).then((resp) => {
        if (resp) {
            return resp.data;
        }
    }).catch((error) => {
        return error;
    });
}