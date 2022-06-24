import Axios from "axios";
import { SETTINGS } from "../properties/Settings";
import jwt_decode from "jwt-decode";

export const AuthRepository = {
  fetchToken: (user) => {
    return Axios({
      url: SETTINGS.API_URL + "auth/authenticate",
      method: "POST",
      data: user,
    });
  },

  getUserDetails: () => {
    if (window?.localStorage?.getItem("jwt")) {
      return jwt_decode(window?.localStorage?.getItem("jwt"));
    }
  },

  logout: (redirectTo) => {
    localStorage.removeItem("jwt");
    if (redirectTo) {
      window.location.href = redirectTo;
    } else {
      window.location.href = "/login";
    }
  },

  hasRole: (role) => {
    if (window?.localStorage?.getItem("jwt")) {
      var currentUser = jwt_decode(window?.localStorage?.getItem("jwt"));
      if (currentUser?.roles?.filter((r) => r.authority === role).length > 0) {
        return true;
      } else {
        return false;
      }
    } else {
      return false;
    }
  },
  hasAnyRole: (roles) => {
    if (window?.localStorage?.getItem("jwt")) {
      var currentUser = jwt_decode(window?.localStorage?.getItem("jwt"));
      if (
        currentUser?.roles?.filter((r) => roles.includes(r.authority)).length >
        0
      ) {
        return true;
      } else {
        return false;
      }
    } else {
      return false;
    }
  },
  getToken: () => {
    if (window?.localStorage?.getItem("jwt")) {
      return window?.localStorage?.getItem("jwt");
    }
  },
};
