import { LOCALE } from "../properties/Locale";

export const ErrorMessageResolver = {
  resolve: (err) => {
    if (
      err.response &&
      err.response.data &&
      err.response.data &&
      err.response.data.error === "unauthorized"
    ) {
      if (err.response.data.error_description === "User not enabled") {
        return LOCALE.user_not_enabled;
      } else {
        return LOCALE.bad_credentials;
      }
    } else if (err.message === "Network Error") {
      return LOCALE.networkErrorMessage;
    }
    if (
      err?.response?.data?.message &&
      err?.response?.data?.message.includes("Could not get JDBC Connection;")
    ) {
      return LOCALE.JDBCConnectonError;
    } else if (
      err.response &&
      err.response.data &&
      err.response.data.error === "invalid_grant"
    ) {
      return LOCALE.bad_credentials;
    } else if (
      err.response &&
      err.response.data &&
      err.response.data.status === 401
    ) {
      if (LOCALE.getString(err.response?.data?.message)) {
        return LOCALE.getString(err.response?.data?.message);
      } else {
        return LOCALE.connection_error;
      }
    } else if (
      err.response &&
      err.response.data &&
      err.response.data.status === 404
    ) {
      return LOCALE.data_not_found;
    } else if (
      err.response &&
      err.response.data &&
      err.response.data.status === 403
    ) {
      return LOCALE.forbidden;
    } else if (
      err.response &&
      err.response.data &&
      err.response.data.status === 400
    ) {
      console.log(err.response?.data?.message);
      console.log(err.response?.data?.errors);

      var errorText = "";
      if (err?.response?.data?.errors) {
        err.response.data.errors.forEach((error) => {
          console.log(error);
          console.log(
            LOCALE.getString(error.field)
              ? LOCALE.getString(error.field)
              : error.field
          );
          var err =
            (LOCALE.getString(error.defaultMessage)
              ? LOCALE.getString(error.defaultMessage)
              : error.defaultMessage) +
            " " +
            (LOCALE.getString(error.field)
              ? LOCALE.getString(error.field)
              : error.field
            ).toUpperCase();
          console.log(err);
          errorText += err + ".\n\r ";
        });
      }

      console.log(errorText);
      if (errorText !== "") {
        return errorText;
      }

      if (LOCALE.getString(err.response?.data?.message)) {
        return LOCALE.getString(err.response?.data?.message);
      } else {
        return err.response?.data?.message;
      }
    } else if (
      err.response &&
      err.response.data &&
      err.response.data.status === 500
    ) {
      console.log(err.response?.data?.errors);
      if (LOCALE.getString(err.response?.data?.message)) {
        return LOCALE.getString(err.response?.data?.message);
      } else {
        return err.response?.data?.message;
      }
    } else {
      return LOCALE.connection_error;
    }
  },
};
