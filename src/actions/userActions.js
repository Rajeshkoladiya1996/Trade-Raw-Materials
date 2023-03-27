import axiosApi  from "../axiosApi";

// getcategoryList
export const getUserList = (data) => (dispatch) => {
    data=(data==='')? '':'?'+data;    
    return axiosApi({
        method: "get",
        url: `/user/list${data}`,
    }).then((resp) => {
        if (resp) {
            return resp && resp.data;
        }
    }).catch((error) => {
        const errMsg = error && error.response && error.response.data;
        return errMsg;
    });
};

// userStatusChange

export const userStatusChange = (id)=>(dispatch)=>{
    return axiosApi({
        method: "get",
        url: `/user/status_change/${id}`,
    }).then((resp) => {
        if (resp) {
            return resp && resp.data;
        }
    }).catch((error) => {
        const errMsg = error && error.response && error.response.data;
        return errMsg;
    });
};

//getUserDetails
export const getUserDetails=(id)=>(dispatch)=>{
    return axiosApi({
        method: "get",
        url: `/user/profile/${id}`,
    }).then((resp) => {
        if (resp) {
            return resp && resp.data;
        }
    }).catch((error) => {
        const errMsg = error && error.response && error.response.data;
        return errMsg;
    });
} 

//user details update 
export const userProfileUpdate=(data)=>(dispatch)=>{
    return axiosApi({
        method: "POST",
        url: `/user/update-profile/`,
        data:data,
    }).then((resp) => {
        if (resp) {
            return resp && resp.data;
        }
    }).catch((error) => {
        const errMsg = error && error.response && error.response.data;
        return errMsg;
    });
} 
//user delete
export const userDelete=(id)=>(dispatch)=>{
    return axiosApi({
        method: "delete",
        url: "/user/destroy",
        data:{id:id}
      }).then((resp) => {
          if (resp) {
              return resp.data;
          }
      }).catch((error) => {
          const errMsg = error && error.response && error.response.data;
          return errMsg;
      });
} 

// transporter list
export const getTranspoterList= (data)=>(dispatch)=>{
    data=(data==='')? '':'?'+data; 
    return axiosApi({
        method :"get",
        url:`/user/transporter-list${data}`
    }).then((resp)=>{
        if (resp) {
            return resp && resp.data;
        }
    }).catch((error)=>{
        const errMsg = error && error.response && error.response.data;
        return errMsg;
    });
}

// analysis list
export const getAnalysisList= (data)=>(dispatch)=>{
    data=(data==='')? '':'?'+data; 
    return axiosApi({
        method :"get",
        url:`/user/analysis-list${data}`
    }).then((resp)=>{
        if (resp) {
            return resp && resp.data;
        }
    }).catch((error)=>{
        const errMsg = error && error.response && error.response.data;
        return errMsg;
    });
}