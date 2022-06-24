import * as React from "react";

import Menu from "@mui/material/Menu";
import MenuItem from "@mui/material/MenuItem";
import IconButton from "@mui/material/IconButton";
import Typography from "@mui/material/Typography";
import Tooltip from "@mui/material/Tooltip";
import { Icon, Badge, Grid } from "@mui/material";
import { moment } from "../App";
import { NotificationsRepository } from "../repositories/NotificationsRepository";
import { useNavigate } from "react-router-dom";

export default function NotificationsMenu({ notifications, getNotifications }) {
  const [anchorEl, setAnchorEl] = React.useState(null);
  const open = Boolean(anchorEl);
  const navigate = useNavigate();

  const handleClick = (event) => {
    setAnchorEl(event.currentTarget);
  };
  const handleClose = () => {
    setAnchorEl(null);
  };

  const openNotification = (notification) => {
    NotificationsRepository.markAsRead(notification.id).then(() => {
      getNotifications();
    });
    navigate(
      `${resolveUrlByNotificationType(notification.type)}${notification.relId}`
    );
  };

  const calculateUnreadNotifications = () => {
    let unreadNotifications = 0;
    notifications &&
      notifications.forEach((notification) => {
        if (!notification.read) {
          unreadNotifications++;
        }
      });
    return unreadNotifications;
  };

  const resolveUrlByNotificationType = (type) => {
    if (type == "NEW_TICKET_CREATED_BY_CLIENT") {
      return "/agents/ticket/";
    } else if (type == "NEW_TICKET_CREATED_BY_AGENT") {
      return "/client/ticket/";
    } else if (type == "NEW_TICKET_MESSAGE_FROM_CLIENT") {
      return "/agents/ticket/";
    } else if (type == "NEW_TICKET_MESSAGE_FROM_AGENT") {
      return "/client/ticket/";
    } else if (type == "NEW_TICKET_SYSTEM_MESSAGE_FOR_CLIENT") {
      return "/client/ticket/";
    } else if (type == "NEW_TICKET_SYSTEM_MESSAGE_FOR_AGENT") {
      return "/agents/ticket/";
    }
  };
  return (
    <React.Fragment>
      <Tooltip title="Notifications">
        <IconButton onClick={handleClick} size="small">
          <Badge
            badgeContent={calculateUnreadNotifications()}
            color="secondary"
            // showZero
          >
            <Icon style={{ color: "white" }}>notifications</Icon>
          </Badge>
        </IconButton>
      </Tooltip>
      <Menu
        disableScrollLock
        anchorEl={anchorEl}
        open={open}
        onClose={handleClose}
        onClick={handleClose}
        PaperProps={{
          elevation: 0,
          sx: {
            overflow: "auto",
            overflowX: "hidden",
            maxHeight: "600px",
            filter: "drop-shadow(0px 2px 8px rgba(0,0,0,0.32))",
            mt: 1.5,
            "& .MuiAvatar-root": {
              width: 32,
              height: 32,
              ml: -0.5,
              mr: 1,
            },
            "&:before": {
              content: '""',
              display: "block",
              position: "absolute",
              top: 0,
              right: 14,
              width: 10,
              height: 10,
              bgcolor: "background.paper",
              transform: "translateY(-50%) rotate(45deg)",
              zIndex: 0,
            },
          },
        }}
        transformOrigin={{ horizontal: "right", vertical: "top" }}
        anchorOrigin={{ horizontal: "right", vertical: "bottom" }}
      >
        <Typography style={{ padding: "10px" }} variant={"subtitle2"}>
          Notifications
        </Typography>
        {notifications && notifications.length > 0 ? (
          notifications?.map((notification) => (
            <MenuItem
              key={notification.id}
              style={{
                width: "400px",
              }}
              onClick={() => {
                openNotification(notification);
              }}
            >
              <Grid container>
                <Grid item md={notification.read ? 12 : 11}>
                  <Typography
                    variant="body2"
                    style={{ whiteSpace: "pre-wrap" }}
                  >
                    {notification.content}
                  </Typography>
                  <Typography
                    variant="caption"
                    color={notification.read ? "" : "primary"}
                  >
                    {moment(notification.dateCreated).fromNow()}
                  </Typography>
                </Grid>
                {!notification.read && (
                  <Grid
                    item
                    md={1}
                    style={{
                      display: "flex",
                      justifyContent: "center",
                      alignItems: "center",
                    }}
                  >
                    <Badge
                      variant="dot"
                      color="primary"
                      sx={{
                        "& .MuiBadge-badge": {
                          height: 14,
                          width: 14,
                          borderRadius: "50%",
                        },
                      }}
                    />
                  </Grid>
                )}
              </Grid>
            </MenuItem>
          ))
        ) : (
          <MenuItem style={{ width: "400px" }}>
            <Typography variant="body2" style={{ whiteSpace: "pre-wrap" }}>
              There are no notifications
            </Typography>
          </MenuItem>
        )}
      </Menu>
    </React.Fragment>
  );
}
