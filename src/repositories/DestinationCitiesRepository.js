import Axios from "axios";
import { SETTINGS } from "../properties/Settings";

export const DestinationCitiesRepository = {
  fetchAll: (payload) => {
    return Axios({
      url: SETTINGS.API_URL + "destinationCities",
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
      url: SETTINGS.API_URL + "destinationCities/all",
      method: "GET",
    });
  },

  fetchAllByCountryId: (id) => {
    return Axios({
      url: SETTINGS.API_URL + "destinationCities/country/" + id,
      method: "GET",
    });
  },

  get: (id) => {
    return Axios.get(`${SETTINGS.API_URL}destinationCities/${id}`);
  },

  create: (data) => {
    return Axios({
      url: `${SETTINGS.API_URL}destinationCities`,
      method: "POST",
      data: data,
    });
  },
  update: (data) => {
    return Axios({
      url: `${SETTINGS.API_URL}destinationCities`,
      method: "PUT",
      data: data,
    });
  },

  delete: (id) => {
    return Axios.delete(`${SETTINGS.API_URL}destinationCities/${id}`);
  },
};
