import Axios from "axios";
import { SETTINGS } from "../properties/Settings";

export const DestinationsRepository = {
  fetchAll: (payload) => {
    return Axios({
      url: SETTINGS.API_URL + "destinations",
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

  fetchAllWithoutPaging: (payload) => {
    return Axios({
      url: SETTINGS.API_URL + "destinations/all",
      method: "GET",
    });
  },

  getAllAvailableCountryDestination: (payload) => {
    return Axios({
      url: SETTINGS.API_URL + "destinations/available/countries",
      method: "GET",
      params: {
        searchParams: payload.searchParams,
      },
    });
  },

  getAllAvailableCityDestination: (payload) => {
    return Axios({
      url: SETTINGS.API_URL + "destinations/available/cities",
      method: "GET",
      params: {
        searchParams: payload.searchParams,
      },
    });
  },
  get: (id) => {
    return Axios.get(`${SETTINGS.API_URL}destinations/${id}`);
  },

  create: (data) => {
    return Axios({
      url: `${SETTINGS.API_URL}destinations`,
      method: "POST",
      data: data,
    });
  },
  update: (data) => {
    return Axios({
      url: `${SETTINGS.API_URL}destinations`,
      method: "PUT",
      data: data,
    });
  },

  delete: (id) => {
    return Axios.delete(`${SETTINGS.API_URL}destinations/${id}`);
  },
};
