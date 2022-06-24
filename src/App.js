import * as React from "react";
import { Routes, Route } from "react-router-dom";
import "./App.css";
import Header from "./common/Header";
import HomeComponent from "./components/HomeComponent";
import { useLocation } from "react-router";
import Login from "./components/Login";
import GlobalNotificationSnackbar from "./common/GlobalNotificationSnackbar";
import { LinearProgress } from "@mui/material";
import { useSelector } from "react-redux";
import { ThemeProvider, createTheme } from "@mui/material/styles";
import Mailbox from "./components/agent/mails/MailBox";
import DashboardComponent from "./components/dashboard/DashboardComponent";
// import DashboardRegionComponent from "./components/dashboard/DashboardRegionComponent";

import { AuthRepository } from "./repositories/AuthRepository";
import { useNavigate } from "react-router-dom";
import MailBoxTableView from "./components/agent/mails/MailBoxTableView";
const theme = createTheme({
  palette: {
    primary: {
      main: "#70c1c2",
    },
  },
});

const momentjs = require("moment");
export const moment = momentjs;

function App() {
  const location = useLocation();
  const globalState = useSelector((state) => state);
  const navigate = useNavigate();
  React.useEffect(() => {
    if (location.pathname !== "/login") {
      if (!AuthRepository.getToken()) {
        navigate("/login");
      }
    }
  }, [location]);

  return (
    <ThemeProvider theme={theme}>
      <div className="App">
        <div style={{ minHeight: "4px", position: "fixed", width: "100%" }}>
          {globalState.loading && <LinearProgress color="secondary" />}
        </div>
        <GlobalNotificationSnackbar />
        {!["/login", "/forgotPassword"].includes(location.pathname) &&
          !location.pathname.startsWith("/invitation") && <Header />}
        <Routes>
          <Route path="/" element={<HomeComponent />} />
          <Route path="/login" element={<Login />} />
          <Route path="/mailbox/:page/:size/:params" element={<Mailbox />}>
            <Route path=":id" element={<Mailbox />} />
          </Route>
          <Route
            path="/mailboxTable/:page/:size/:params"
            element={<MailBoxTableView />}
          >
            <Route path=":id" element={<MailBoxTableView />} />
          </Route>
        </Routes>
      </div>
    </ThemeProvider>
  );
}

export default App;
