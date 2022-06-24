import Axios from "axios";
import { SETTINGS } from "../properties/Settings";

export const NotificationsRepository = {
  get: () => {
    return Axios.get(`${SETTINGS.API_URL}notification/get`);
  },

  markAsRead: (id) => {
    return Axios.put(`${SETTINGS.API_URL}notification/${id}/read`);
  },
};
