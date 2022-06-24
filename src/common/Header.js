import * as React from "react";
import { Navigate, useLocation } from "react-router";
import {
  Button,
  Container,
  Grid,
  Hidden,
  Icon,
  IconButton,
  Tooltip,
  Drawer,
  Badge,
} from "@mui/material";
import { LOCALE } from "../properties/Locale";
import { AuthRepository } from "../repositories/AuthRepository";
import { useSelector } from "react-redux";
import jwtDecode from "jwt-decode";
import { NotificationsRepository } from "../repositories/NotificationsRepository";
import { MailBoxRepository } from "../repositories/MailboxRepository";
import FactCheckIcon from "@mui/icons-material/FactCheck";

export default function Header() {
  const [redirectTo, setRedirectTo] = React.useState();
  const [openDrawerMenu, setOpenDrawerMenu] = React.useState(false);
  const location = useLocation();
  const globalState = useSelector((state) => state);
  const [currentUser, setCurrentUser] = React.useState();
  const [notifications, setNotifications] = React.useState();
  const [open, setOpen] = React.useState(false);
  const unreadMails = React.useRef();
  let interval = null;

  const handleClickOpen = () => {
    setOpen(true);
  };
  const handleClose = () => {
    setOpen(false);
  };

  const handleChangeOpenDrawerMenu = (value) => {
    setOpenDrawerMenu(value);
  };

  const handleCloseDrawerMenu = () => {
    setOpenDrawerMenu(false);
  };

  React.useEffect(() => {
    checkUnreadMail();
    interval = setInterval(() => checkUnreadMail(), 60000);
    return () => {
      clearInterval(interval);
    };
  }, []);

  const checkUnreadMail = () => {
    MailBoxRepository.getAllUnreadMail().then((res) => {
      unreadMails.current = res.data;
    });
  };

  const getNotifications = () => {
    NotificationsRepository.get().then((res) => {
      setNotifications(res.data);
    });
  };

  React.useEffect(() => {
    loadCurrentUser();
  }, [globalState.triggerRerender]);

  React.useEffect(() => {
    setRedirectTo(undefined);
  }, [location]);

  const loadCurrentUser = () => {
    if (localStorage.getItem("jwt")) {
      setCurrentUser(jwtDecode(localStorage.getItem("jwt")));
    }
  };

  return (
    <React.Fragment>
      <div
        style={{
          backgroundColor: "#313132",
          width: "100%",
          height: "40px",
          marginBottom: "30px",
        }}
      >
        <Hidden xsDown>
          <Container maxWidth="xl" style={{ lineHeight: "2.3" }}>
            <Grid container>
              <Grid item md={11}></Grid>
            </Grid>
          </Container>
        </Hidden>
      </div>

      <Drawer
        onCloseHandler={handleCloseDrawerMenu}
        open={openDrawerMenu}
        anchor="left"
      />
    </React.Fragment>
  );
}
