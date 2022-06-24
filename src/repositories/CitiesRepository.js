import Axios from "axios";
import { SETTINGS } from "../properties/Settings";

export const CitiesRepository = {
  fetchAll: (payload) => {
    return Axios({
      url: SETTINGS.API_URL + "cities",
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
      url: SETTINGS.API_URL + "cities/all",
      method: "GET",
    });
  },

  fetchAllByCountryId: (id) => {
    return Axios({
      url: SETTINGS.API_URL + "cities/country/" + id,
      method: "GET",
    });
  },

  get: (id) => {
    return Axios.get(`${SETTINGS.API_URL}cities/${id}`);
  },

  create: (data) => {
    return Axios({
      url: `${SETTINGS.API_URL}cities`,
      method: "POST",
      data: data,
    });
  },
  update: (data) => {
    return Axios({
      url: `${SETTINGS.API_URL}cities`,
      method: "PUT",
      data: data,
    });
  },

  delete: (id) => {
    return Axios.delete(`${SETTINGS.API_URL}cities/${id}`);
  },
};
