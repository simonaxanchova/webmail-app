import React, { useState } from "react";
import { Button, Grid, TextField } from "@mui/material";
import Alert from "@mui/material/Alert";
import { Navigate } from "react-router";
import { LOCALE } from "../properties/Locale";
import { AuthRepository } from "../repositories/AuthRepository";
import { useDispatch } from "react-redux";
import { triggerRerender } from "../common/CommonActions";
import Backdrop from "@mui/material/Backdrop";
import CircularProgress from "@mui/material/CircularProgress";

export default function Login() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [redirectTo, setRedirectTo] = useState();
  const [globalFormError, setGlobalFormError] = React.useState();
  const [loading, setLoading] = useState();

  const dispatch = useDispatch();

  const handleLogin = () => {
    setLoading(true);
    AuthRepository.fetchToken({ username: username, password: password }).then(
      (res) => {
        window.localStorage.setItem("jwt", res?.data?.jwt);
        dispatch(triggerRerender());
        setRedirectTo("/");
        setLoading(false);
      },
      (err) => {
        console.log(err);
        console.log(err.response);
        setGlobalFormError(err.response?.data);
        setLoading(false);
      }
    );
  };

  return (
    <>
      {redirectTo && <Navigate to={redirectTo} push />}
      <Grid container>
        <Grid item xs={12} md={5}></Grid>
        <Grid
          item
          xs={12}
          md={2}
          style={{
            marginTop: "180px",
          }}
        >
          <Grid container spacing={2}>
            <Grid item xs={12} style={{ textAlign: "center" }}>
              <img
                alt=""
                src={require("../assets/img/logo.png")}
                width="250px"
                onClick={() => setRedirectTo("/")}
                style={{ cursor: "pointer", marginLeft: "-10px" }}
              ></img>{" "}
            </Grid>
            {globalFormError && (
              <Grid item xs={12}>
                <Alert severity="error">{globalFormError}</Alert>
              </Grid>
            )}
            <Grid item xs={12}>
              <TextField
                fullWidth
                size="small"
                label={LOCALE.username}
                value={username}
                onKeyPress={(e) => {
                  if (e.key === "Enter") {
                    handleLogin();
                  }
                }}
                onChange={(e) => setUsername(e.target.value)}
              />
            </Grid>
            <Grid item xs={12}>
              <TextField
                fullWidth
                size="small"
                label={LOCALE.password}
                type="password"
                onKeyPress={(e) => {
                  if (e.key === "Enter") {
                    handleLogin();
                  }
                }}
                onChange={(e) => setPassword(e.target.value)}
                value={password}
              />
            </Grid>

            <Grid item xs={12}>
              <Button
                onClick={() => {
                  handleLogin();
                }}
                fullWidth
                variant="contained"
                color="primary"
              >
                {LOCALE.login}
              </Button>
            </Grid>
            <Grid item xs={12} style={{ textAlign: "center" }}>
              <a href="#">{LOCALE.forgotPassword}</a>
            </Grid>
            <Grid
              item
              xs={12}
              style={{ marginTop: "20px", textAlign: "center" }}
            >
              &copy; Asta Adria 2022
            </Grid>
          </Grid>
        </Grid>
      </Grid>
      <Backdrop
        sx={{ color: "#fff", zIndex: (theme) => theme.zIndex.drawer + 1 }}
        open={loading}
      >
        <CircularProgress color="inherit" />
      </Backdrop>
    </>
  );
}
