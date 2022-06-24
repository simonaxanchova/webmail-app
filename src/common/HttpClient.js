import Axios from "axios";
import { AuthRepository } from "../repositories/AuthRepository";
import {
  notifyLoaderApiCallFinish,
  notifyLoaderApiCallStart,
  notifyShowErrorMessage,
} from "./CommonActions";

export default {
  setupInterceptors: (store) => {
    // Add a request interceptor
    Axios.interceptors.request.use(
      function (config) {
        if (
          !config.url.includes("/sync") &&
          !config.url.includes("/notification")
        ) {
          store.dispatch(notifyLoaderApiCallStart());
        }

        // Do something before request is sent
        if (window.localStorage.getItem("jwt")) {
          config.headers[
            "Authorization"
          ] = `Bearer ${window.localStorage.getItem("jwt")}`;
        }
        return config;
      },
      function (error) {
        // Do something with request error
        return Promise.reject(error);
      }
    );
    // Add a response interceptor
    Axios.interceptors.response.use(
      function (response) {
        // Any status code that lie within the range of 2xx cause this function to trigger
        // Do something with response data
        store.dispatch(notifyLoaderApiCallFinish());
        return response;
      },
      function (err) {
        store.dispatch(notifyLoaderApiCallFinish());
        if (err?.response?.data?.error) {
          if (err.response.data.error.includes("Unauthorized")) {
            AuthRepository.logout("/login");
          }
        } else if (err?.response?.data?.message) {
          if (err.response.data.message.includes("JWT expired at")) {
            AuthRepository.logout("/login");
          }

          if (err.response.data.message == "Access Denied") {
            AuthRepository.logout("/");
          }
        } else if (err?.message) {
          if (err.message.includes("Network Error")) {
            store.dispatch(notifyShowErrorMessage(err.message));
          }
        }

        return Promise.reject(err);
      }
    );
  },
};
