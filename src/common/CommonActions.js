export const COMMON_ACTIONS = {
  API_CALL_START: "API_CALL_START",
  API_CALL_FINISH: "API_CALL_FINISH",
  CLEAR_NOTIFICATIONS: "CLEAR_NOTIFICATIONS",
  SHOW_MESSAGE: "SHOW_MESSAGE",
  CLEAR_NOTIFY_MESSAGES: "CLEAR_NOTIFY_MESSAGES",
  SET_CURRENT_USER: "SET_CURRENT_USER",
  RERENDER: "RERENDER",
};

export const notifyLoaderApiCallStart = () => {
  return { type: COMMON_ACTIONS.API_CALL_START };
};

export const notifyLoaderApiCallFinish = () => {
  return { type: COMMON_ACTIONS.API_CALL_FINISH };
};

export const notifyFormValidationFailedMessage = (validationResponse) => {
  if (validationResponse.valid === true) return;
  let errorMessage = "";
  validationResponse.reasons.forEach((reason) => {
    errorMessage += reason + "\r\n";
  });
  return {
    type: COMMON_ACTIONS.SHOW_MESSAGE,
    payload: {
      open: true,
      variant: "error",
      message: errorMessage,
    },
  };
};

export const notifyShowSuccessMessage = (message) => {
  return {
    type: COMMON_ACTIONS.SHOW_MESSAGE,
    payload: {
      open: true,
      variant: "success",
      message: message,
    },
  };
};

export const notifyShowErrorMessage = (message) => {
  return {
    type: COMMON_ACTIONS.SHOW_MESSAGE,
    payload: {
      open: true,
      variant: "error",
      message: message,
    },
  };
};

export const notifyShowWarningMessage = (message) => {
  return {
    type: COMMON_ACTIONS.SHOW_MESSAGE,
    payload: {
      open: true,
      variant: "warning",
      message: message,
    },
  };
};

export const notifyShowInfoMessage = (message) => {
  return {
    type: COMMON_ACTIONS.SHOW_MESSAGE,
    payload: {
      open: true,
      variant: "info",
      message: message,
    },
  };
};

export const triggerRerender = () => {
  return {
    type: COMMON_ACTIONS.RERENDER,
    payload: {
      triggerRerender: true,
    },
  };
};
