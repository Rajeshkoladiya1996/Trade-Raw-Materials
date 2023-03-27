import axiosApi  from "../axiosApi";

// getTariffList
export const getTranspoterTariffList = (id) => (dispatch) => {

	return axiosApi({
		method: "get",
		url: `/tariff/list/${id}`,
	}).then((resp) => {
		if (resp) {
			return resp && resp.data;
		}
	}).catch((error) => {
		const errMsg = error && error.response && error.response.data;
		return errMsg;
	});
};
// add tariff
export const doStoreTariff = (data) => (dispatch) => {

	return axiosApi({
		method: "post",
		url: `/tariff/store`,
		data: data,
	}).then((resp) => {
		if (resp) {
			return resp && resp.data;
		}
	}).catch((error) => {
		const errMsg = error && error.response && error.response.data;
		return errMsg;
	});
};

// get tariff detail
export const getTariffDetail = (id) => (dispatch) => {

	return axiosApi({
		method: "get",
		url: `/tariff/show/${id}`,

	}).then((resp) => {
		if (resp) {
			return resp && resp.data;
		}
	}).catch((error) => {
		const errMsg = error && error.response && error.response.data;
		return errMsg;
	});
};
// update tariff
export const updateTariff = (data) => (dispatch) => {

	return axiosApi({
		method: "post",
		url: `/tariff/update`,
		data: data,
	}).then((resp) => {
		if (resp) {
			return resp && resp.data;
		}
	}).catch((error) => {
		const errMsg = error && error.response && error.response.data;
		return errMsg;
	});
};


// delete  tariff
export const tariffDelete = (id) => (dispatch) => {
	return axiosApi({
		method: "delete",
		url: "/tariff/destroy",
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

// tariff status_change
export const tariffStatusChange = (id) => (dispatch) => {
	return axiosApi({
		method: "get",
		url: "/tariff/status_change/" + id,
	}).then((resp) => {
		if (resp) {
			return resp.data;
		}
	}).catch((error) => {
		const errMsg = error && error.response && error.response.data;
		return errMsg;
	});
}