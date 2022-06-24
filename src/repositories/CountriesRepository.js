import Axios from "axios";
import { SETTINGS } from "../properties/Settings";

export const CountriesRepository = {
  fetchAll: (payload) => {
    return Axios({
      url: SETTINGS.API_URL + "countries",
      method: "GET",
      params: {
        page: payload.page,
        size: payload.size,
        orderBy: payload.orderBy,
        orderDirection: payload.orderDirection,
        searchParams: payload.searchParams,
      },
    });
  },
  fetchAllWithoutPaging: () => {
    return Axios({
      url: SETTINGS.API_URL + "countries/all",
      method: "GET",
    });
  },
  get: (id) => {
    return Axios.get(`${SETTINGS.API_URL}countries/${id}`);
  },

  create: (data) => {
    return Axios({
      url: `${SETTINGS.API_URL}countries`,
      method: "POST",
      data: data,
    });
  },
  update: (data) => {
    return Axios({
      url: `${SETTINGS.API_URL}countries`,
      method: "PUT",
      data: data,
    });
  },

  delete: (id) => {
    return Axios.delete(`${SETTINGS.API_URL}countries/${id}`);
  },
};
