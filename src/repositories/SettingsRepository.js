import Axios from "axios";
import { SETTINGS } from "../properties/Settings";

export const SettingsRepository = {
  fetchAll: () => {
    return Axios.get(`${SETTINGS.API_URL}settings/props`);
  },
  fetchProbByKey: (key) => {
    return Axios({
      url: SETTINGS.API_URL + "settings/prop",
      method: "GET",
      params: {
        key: key,
      },
    });
  },
  isMfaEnabled: () => {
    return Axios({
      url: SETTINGS.API_URL + "settings/isMfaEnabled",
      method: "GET",
    });
  },
  update: (key, val) => {
    return Axios({
      url: `${SETTINGS.API_URL}settings/props`,
      method: "PUT",
      params: {
        key: key,
        val: val,
      },
    });
  },
};
