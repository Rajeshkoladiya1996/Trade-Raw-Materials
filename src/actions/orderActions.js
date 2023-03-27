import axiosApi  from "./../axiosApi";

// order list
export const getOrderList=(data)=>(dispatch)=>{
    return axiosApi({
        method: "get",
        url: `/order/list?status=${data}`,
    }).then((resp) => {
        if (resp) {
          return resp.data;
        }
    }).catch((error) => {
        const errMsg = error && error.response && error.response.data;
        return errMsg;
    });
}

// get order detail
export const getOrderDetail=(id)=>(dispatch)=>{
    return axiosApi({
        method: "get",
        url: `/order/show/${id}`,
    }).then((resp) => {
        if (resp) {
          return resp.data;
        }
    }).catch((error) => {
        const errMsg = error && error.response && error.response.data;
        return errMsg;
    });
}

// order status change
export const orderStatusChange=(data)=>(dispatch)=>{
    return axiosApi({
        method: "post",
        url: `/order/status`,
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

// buyer order update
export const buyerOrderUpdate=(data)=>(dispatch)=>{
    return axiosApi({
        method: "post",
        url: `/order/buyer-order-update`,
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

// seller order update
export const sellerOrderUpdate=(data)=>(dispatch)=>{
    return axiosApi({
        method: "post",
        url: `/order/seller-order-update`,
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
// transporter order update
export const transportOrderUpdate=(data)=>(dispatch)=>{
    return axiosApi({
        method: "post",
        url: `/order/transport-order-update`,
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
// analysis order update
export const analysisOrderUpdate=(data)=>(dispatch)=>{
    return axiosApi({
        method: "post",
        url: `/order/analysis-order-update`,
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


export const getMessages = (id) => (dispatch) => {
    return axiosApi({
      method: "get",
      url: `/order/get-messages/${id}`,
    }) .then((resp) => {
        if (resp) {
          return resp && resp.data;
        }
      })
      .catch((error) => {
        const errMsg = error && error.response && error.response.data;
        return errMsg;
      });
  }