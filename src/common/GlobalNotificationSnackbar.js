import { Alert, Icon, Snackbar, Typography } from "@mui/material";
import { useDispatch, useSelector } from "react-redux";
import { COMMON_ACTIONS } from "./CommonActions";
import React from "react";

export default function GlobalNotificationSnackbar() {
  const globalState = useSelector((state) => state);
  const dispatch = useDispatch();

  const handleClose = () => {
    if (globalState.open) {
      dispatch({
        type: COMMON_ACTIONS.CLEAR_NOTIFICATIONS,
        payload: null,
      });
    }
  };

  return (
    <React.Fragment>
      {globalState.open && (
        <Snackbar
          open={true}
          autoHideDuration={3000}
          onClose={handleClose}
          anchorOrigin={{ vertical: "bottom", horizontal: "right" }}
        >
          <Alert
            onClose={handleClose}
            severity={globalState.variant}
            sx={{ width: "100%" }}
          >
            <Typography variant="body2">{globalState.message}</Typography>
          </Alert>
        </Snackbar>
      )}
    </React.Fragment>
  );
}
