import ClearIcon from "@mui/icons-material/Clear";
import EmailIcon from "@mui/icons-material/Email";
import SearchIcon from "@mui/icons-material/Search";
import { TabContext, TabList } from "@mui/lab";
import {
  Badge,
  Box,
  Breadcrumbs,
  Button,
  Container,
  Divider,
  FormControl,
  FormControlLabel,
  Grid,
  Icon,
  InputLabel,
  MenuItem,
  Paper,
  Select,
  Skeleton,
  Slide,
  Snackbar,
  Stack,
  Switch,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableFooter,
  TablePagination,
  TableRow,
  TextField,
  Tooltip,
  Typography,
} from "@mui/material";
import Alert from "@mui/material/Alert";
import { createTheme, styled, ThemeProvider } from "@mui/material/styles";
import Tab from "@mui/material/Tab";
import axios from "axios";
import { EditorState } from "draft-js";
import { stateToHTML } from "draft-js-export-html";
import moment from "moment";
import React, { useEffect, useState } from "react";
import Avatar from "react-avatar";
import Draggable from "react-draggable";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate, useParams } from "react-router-dom";
import { getMimeTypeByFileExtension } from "../../../common/MimeTypesHelper";
import { LOCALE } from "../../../properties/Locale";
import { SETTINGS } from "../../../properties/Settings";
import { AuthRepository } from "../../../repositories/AuthRepository";
import { MailBoxRepository } from "../../../repositories/MailboxRepository";
import MailContent from "./MailContent";

function PaperComponent(props) {
  return (
    <Draggable
      handle="#draggable-dialog-title"
      cancel={'[class*="MuiDialogContent-root"]'}
    >
      <Paper {...props} />
    </Draggable>
  );
}

const Transition = React.forwardRef(function Transition(props, ref) {
  return <Slide direction="up" ref={ref} {...props} />;
});

export default function Mailbox() {
  const [data, setData] = useState({
    loaded: "1",
    numberOfDrivers: 1,
    dangerousGoods: false,
    electricPlugin: false,
    liveAnimals: false,
    cargoWeight: 0.0,
    source: "MAIL",
    departureDay: moment(),
    showPrice: AuthRepository.getUserDetails()?.organization?.showPrice
      ? true
      : false,
  });
  const [editorState, setEditorState] = useState(EditorState.createEmpty());
  const [mails, setMails] = useState([]);
  const [currentMail, setCurrentMail] = useState();
  const [loading, setLoading] = useState(false);
  const dispatch = useDispatch();
  const [size, setSize] = useState(5);
  const globalState = useSelector((state) => state);
  const params = useParams();
  const navigate = useNavigate();
  const [searchParams, setSearchParams] = useState({ mailType: "INCOMING" });
  const [orderBy, setOrderBy] = useState("dateCreated");
  const [orderDirection, setOrderDirection] = useState("DESC");
  const [selectedMail, setSelectedMail] = useState();
  const [unreadMailNumber, setUnreadMailNumber] = useState(0);
  const [open, setOpen] = React.useState(false);
  const [replyTo, setReplyTo] = useState();
  const [successMailSent, setSuccessMailSent] = useState(false);
  const [errorMailSent, setErrorMailSent] = useState(false);
  const [loadingSentMail, setLoadingSentMail] = useState(false);
  const [value, setValue] = React.useState("1");
  const onEditorStateChange = (editorState) => {
    setEditorState(editorState);
  };
  const [activeIndex, setActiveIndex] = useState(false);
  const handleOnHover = (index) => {
    setActiveIndex(index);
  };

  const handleClickOpen = (currentMail) => {
    setOpen(true);
    setReplyTo(currentMail);
  };

  const handleClose = () => {
    setOpen(false);
    setReplyTo(null);
    setEditorState();
    setSuccessMailSent(false);
    setErrorMailSent(false);
  };
  var _ = require("lodash");

  React.useEffect(() => {
    localStorage.setItem("mailboxType", "mailbox");
    let tmp = { ...data };
    setData(tmp);
  }, []);

  const handleChangeData = (name, value) => {
    setData(_.set({ ...data }, name, value));
  };

  const handleChangeCurrentMail = (mailMessage, index) => {
    setLoading(true);
    let tmp = [...mails.content];
    let mailTmp = tmp[index];
    mailTmp["read"] = true;
    tmp[index] = mailTmp;
    setMails(_.set({ ...mails }, "content", tmp));
    navigate(mailMessage.id);
    setSelectedMail(mailMessage);
    MailBoxRepository.markAsRead(mailMessage.id)
      .then(() => {
        setLoading(false);
      })
      .catch((err) => {
        setLoading(false);
        console.log(err);
      });
  };

  useEffect(() => {
    if (params && params.id) {
      setLoading(true);
      MailBoxRepository.getById(params.id).then((res) => {
        setCurrentMail(res.data);
        setSelectedMail(res.data);
      });
    }
  }, [params.id]);

  useEffect(() => {
    if (params && params.page && params.size) {
      searchAll(params.page, params.size, params.params);
    }
    setSearchParams(JSON.parse(params.params));
  }, [params.page, params.size, params.params]);

  const downloadAttachments = (attachment) => {
    axios({
      url: `${SETTINGS.API_URL}mailbox/attachments/${attachment.id}`,
      method: "GET",
      responseType: "blob",
    })
      .then((res) => {
        let file;
        file = new Blob([res.data], {
          type: getMimeTypeByFileExtension(attachment.fileExtension),
        });
        const fileURL = URL.createObjectURL(file);
        window.open(fileURL, "_blank");
      })
      .catch((err) => {
        console.log(err);
      });
  };

  const searchAll = (page, size, filterParams) => {
    setCurrentMail(null);
    setMails([]);
    setLoading(true);
    MailBoxRepository.all({
      page: page,
      size: size,
      orderBy: orderBy,
      orderDirection: orderDirection,
      searchParams: filterParams,
    })
      .then((res) => {
        setMails(res.data);
        setLoading(false);
      })
      .catch((err) => {
        setLoading(false);
      });
  };

  const removeFilters = () => {
    if (value == 1) {
      navigate(
        `/mailbox/${0}/${size}/${JSON.stringify({ mailType: "INCOMING" })}`
      );
    } else {
      navigate(
        `/mailbox/${0}/${size}/${JSON.stringify({ mailType: "OUTGOING" })}`
      );
    }
  };

  const handleChange = (name, value) => {
    let tmp = { ...searchParams };
    tmp[name] = value;
    setSearchParams(tmp);
  };
  const handleChangeTabs = (event, newValue) => {
    setValue(newValue);
    if (newValue == 1) {
      navigate(
        `/mailbox/${0}/${size}/${JSON.stringify({ mailType: "INCOMING" })}`
      );
    } else if (newValue == 2) {
      navigate(
        `/mailbox/${0}/${size}/${JSON.stringify({ mailType: "OUTGOING" })}`
      );
    } else {
      navigate(`/mailbox/${0}/${size}/${JSON.stringify({})}`);
    }
  };

  const getAllUnreadMail = () => {
    MailBoxRepository.getAllUnreadMail()
      .then((res) => {
        setUnreadMailNumber(res.data);
      })
      .catch((err) => console.log(err));
  };
  useEffect(() => {
    getAllUnreadMail();
  }, [mails]);

  const StyledBadge = styled(Badge)(({ theme }) => ({
    "& .MuiBadge-badge": {
      right: -3,
      top: 13,
      border: `2px solid ${theme.palette.background.paper}`,
      padding: "0 4px",
      color: "white",
    },
  }));

  const theme = createTheme({
    palette: {
      grey: {
        main: "#64748B",
        contrastText: "#fff",
      },
    },
  });

  return (
    <>
      <div>
        <Container maxWidth="xl">
          <Grid container spacing={2}>
            <Grid item xs={6}>
              <Stack spacing={2}>
                <Breadcrumbs
                  style={{ cursor: "pointer" }}
                  separator={<Icon fontSize="small">navigate_next</Icon>}
                >
                  <Typography variant="h5" key="2" color="text.primary">
                    {LOCALE.mailbox}
                  </Typography>
                </Breadcrumbs>
              </Stack>
            </Grid>
            <Grid item xs={6} style={{ textAlign: "right" }}>
              <FormControlLabel
                control={
                  <Switch
                    checked={false}
                    onChange={() =>
                      navigate(
                        `/mailboxTable/${params?.page}/${10}/${JSON.stringify(
                          searchParams
                        )}`
                      )
                    }
                    inputProps={{ "aria-label": "secondary checkbox" }}
                  />
                }
                labelPlacement="start"
                label="Table view"
              />
            </Grid>
            <Grid item xs={2}></Grid>
            <Grid item xs={1.5}>
              <FormControl fullWidth variant="outlined" size="small">
                <InputLabel>
                  <EmailIcon />
                </InputLabel>
                <Select
                  label="Select"
                  value={searchParams?.read ? searchParams?.read : ""}
                  onChange={(e) => handleChange("read", e.target.value)}
                >
                  <MenuItem
                    value=""
                    style={{ textTransform: "uppercase", fontSize: "13px" }}
                  >
                    All
                  </MenuItem>
                  <MenuItem
                    value={"true"}
                    style={{ textTransform: "uppercase", fontSize: "13px" }}
                  >
                    Read
                  </MenuItem>
                  <MenuItem
                    value={"false"}
                    style={{ textTransform: "uppercase", fontSize: "13px" }}
                  >
                    Unread
                  </MenuItem>
                </Select>
              </FormControl>
            </Grid>

            <Grid item xs={2}>
              <TextField
                fullWidth
                variant="outlined"
                label="Filter by sender"
                size="small"
                onChange={(e) => handleChange("sender", e.target.value)}
                value={searchParams["sender"] ? searchParams["sender"] : ""}
                onKeyPress={(e) => {
                  if (e.key === "Enter") {
                    navigate(
                      `/mailbox/${0}/${size}/${JSON.stringify(searchParams)}`
                    );
                  }
                }}
              ></TextField>
            </Grid>
            <Grid item xs={2}>
              <TextField
                fullWidth
                variant="outlined"
                label="Filter by subject"
                size="small"
                onChange={(e) => handleChange("subject", e.target.value)}
                value={searchParams?.subject ? searchParams.subject : ""}
                onKeyPress={(e) => {
                  if (e.key === "Enter") {
                    navigate(
                      `/mailbox/${0}/${size}/${JSON.stringify(searchParams)}`
                    );
                  }
                }}
              ></TextField>
            </Grid>
            <Grid item xs={2}>
              <TextField
                fullWidth
                variant="outlined"
                label="Filter by content"
                size="small"
                onChange={(e) =>
                  handleChange("contentTextOnly", e.target.value)
                }
                value={
                  searchParams?.contentTextOnly
                    ? searchParams.contentTextOnly
                    : ""
                }
                onKeyPress={(e) => {
                  if (e.key === "Enter") {
                    navigate(
                      `/mailbox/${0}/${size}/${JSON.stringify(searchParams)}`
                    );
                  }
                }}
              ></TextField>
            </Grid>
            <Grid item xs={0.5}>
              <ThemeProvider theme={theme}>
                <Tooltip title="Remove filters">
                  <Button
                    fullWidth
                    color="grey"
                    variant="contained"
                    style={{ color: "white" }}
                    onClick={() => {
                      removeFilters();
                    }}
                  >
                    <ClearIcon></ClearIcon>
                  </Button>
                </Tooltip>
              </ThemeProvider>
            </Grid>
            <Grid item xs={0.1}></Grid>
            <Grid item xs={0.5}>
              <Tooltip title="Search by filters">
                <Button
                  fullWidth
                  variant="contained"
                  onClick={() => {
                    navigate(
                      `/mailbox/${0}/${size}/${JSON.stringify(searchParams)}`
                    );
                  }}
                >
                  <SearchIcon style={{ color: "white" }}></SearchIcon>
                </Button>
              </Tooltip>
            </Grid>

            <Divider />

            <Grid item xs={12} md={4} lg={4} xl={4}>
              <Paper
                variant="outlined"
                sx={{
                  display: "flex",
                  width: "100%",
                }}
              >
                <TableContainer style={{ margin: "10px" }}>
                  {mails?.content ? (
                    <TabContext value={value}>
                      <Box>
                        <TabList
                          onChange={handleChangeTabs}
                          indicatorColor="primary"
                          textColor="inherit"
                          variant="fullWidth"
                        >
                          <Tab
                            label={
                              <Badge
                                style={{ paddingRight: "20px" }}
                                badgeContent={unreadMailNumber}
                                max={99}
                                color="secondary"
                              >
                                Inbox
                              </Badge>
                            }
                            value="1"
                          ></Tab>
                          <Tab label="Sent" value="2"></Tab>
                        </TabList>
                      </Box>
                    </TabContext>
                  ) : (
                    <Skeleton
                      variant="rect"
                      width="100%"
                      height={40}
                      style={{
                        marginBottom: "30px",
                        marginTop: "20px",
                      }}
                    />
                  )}
                  <Table>
                    {mails?.content ? (
                      <TableBody>
                        {mails?.content &&
                          mails?.content?.map((mail, index) => (
                            <TableRow
                              onClick={() =>
                                handleChangeCurrentMail(mail, index)
                              }
                              style={
                                selectedMail?.id === mail?.id
                                  ? {
                                      backgroundColor: "#ECF0F1",
                                      borderLeft: "3px solid #70c1c2",
                                    }
                                  : {}
                              }
                            >
                              <TableCell>
                                <Avatar
                                  name={
                                    mail?.sender?.startsWith('"')
                                      ? mail?.sender?.substring(1)
                                      : mail?.sender
                                  }
                                  maxInitials={1}
                                  round={true}
                                  size="40"
                                  color="#bdbdbd"
                                  style={{
                                    cursor: "pointer",
                                    fontFamily: "Verdana, Geneva, sans-serif",
                                  }}
                                ></Avatar>
                              </TableCell>
                              <TableCell
                                style={{
                                  cursor: "pointer",
                                }}
                              >
                                <Typography
                                  variant="body2"
                                  style={
                                    mail.read
                                      ? {
                                          fontWeight: "normal",
                                          font: "-moz-initial",
                                          color: "#57585A",
                                        }
                                      : {
                                          fontWeight: "bold",
                                          font: "-moz-initial",
                                          color: "#57585A",
                                        }
                                  }
                                >
                                  {mail?.sender}
                                </Typography>

                                <Typography
                                  variant="body2"
                                  style={
                                    mail.read
                                      ? {
                                          fontWeight: "normal",
                                          font: "-moz-initial",
                                          color: "#57585A",
                                        }
                                      : {
                                          fontWeight: "bold",
                                          font: "-moz-initial",
                                          color: "#57585A",
                                        }
                                  }
                                >
                                  {mail?.subject}
                                </Typography>
                                {/* <Typography
                                  variant="caption"
                                  style={
                                    mail.read
                                      ? {
                                          fontWeight: "normal",
                                          font: "-moz-initial",
                                          color: "#B2B1B2",
                                        }
                                      : {
                                          fontWeight: "bold",
                                          font: "-moz-initial",
                                          color: "#B2B1B2",
                                        }
                                  }
                                >
                                  {moment(mail?.dateSent).format(
                                    "DD/MM/YYYY HH:mm"
                                  )}
                                  {mail.mailboxTickets?.length == 0 ? (
                                    ""
                                  ) : (
                                    <StyledBadge
                                      badgeContent={mail.mailboxTickets?.length}
                                      color="primary"
                                      style={{
                                        float: "right",
                                        color: "#70C1C2",
                                      }}
                                    >
                                      <DirectionsBoatIcon
                                        fontSize="medium"
                                        style={{
                                          color: "#70C1C2",
                                          marginBottom: "-7px",
                                          float: "right",
                                        }}
                                      />
                                    </StyledBadge>
                                  )}
                                </Typography> */}
                              </TableCell>
                              <TableCell></TableCell>
                            </TableRow>
                          ))}
                      </TableBody>
                    ) : (
                      <div>
                        <Skeleton variant="react" width="100%" height={90} />
                        <br />
                        <Skeleton variant="react" width="100%" height={90} />
                        <br />
                        <Skeleton variant="react" width="100%" height={90} />
                        <br />
                        <Skeleton variant="react" width="100%" height={90} />
                        <br />
                        <Skeleton variant="react" width="100%" height={90} />
                        <br />
                      </div>
                    )}
                    <TableFooter>
                      <TableRow>
                        {mails ? (
                          mails?.content && (
                            <TablePagination
                              count={mails?.totalElements}
                              rowsPerPageOptions={[5, 10, 25]}
                              rowsPerPage={size}
                              page={mails?.number}
                              labelRowsPerPage={LOCALE.rows_per_page}
                              SelectProps={{
                                inputProps: {
                                  "aria-label": LOCALE.rows_per_page,
                                },
                                native: true,
                              }}
                              onPageChange={(event, value) => {
                                navigate(
                                  `/mailbox/${value}/${size}/${JSON.stringify(
                                    JSON.parse(params.params)
                                  )}`
                                );
                              }}
                              onRowsPerPageChange={(event, value) => {
                                navigate(
                                  `/mailbox/${0}/${
                                    event.target.value
                                  }/${JSON.stringify(
                                    JSON.parse(params.params)
                                  )}`
                                );
                              }}
                            />
                          )
                        ) : (
                          <Skeleton variant="react" width="100%" height={50} />
                        )}
                      </TableRow>
                    </TableFooter>
                  </Table>
                </TableContainer>
              </Paper>
            </Grid>

            <Grid item xs={12} md={8} lg={8} xl={8}>
              <Grid container spacing={2}>
                {!currentMail && (
                  <Grid item xs={12}>
                    <Paper
                      variant="outlined"
                      sx={{
                        display: "flex",
                        overflow: "auto",
                        width: "100%",
                      }}
                    >
                      <TableContainer
                        style={{
                          margin: "10px",
                        }}
                      >
                        {!loading ? (
                          <Typography
                            style={{
                              marginTop: 20,
                              height: "40px",
                              color: "#B2B1B2",
                              textAlign: "center",
                            }}
                          >
                            <span>{LOCALE.no_mail_selected}</span>
                          </Typography>
                        ) : (
                          <Skeleton
                            variant="react"
                            width="100%"
                            height={60}
                            style={{ marginTop: "-15px" }}
                          />
                        )}
                      </TableContainer>
                    </Paper>
                  </Grid>
                )}
                {currentMail && (
                  <Grid item xs={12}>
                    <MailContent
                      currentMail={currentMail}
                      handleClickOpen={handleClickOpen}
                      downloadAttachments={downloadAttachments}
                      loading={loading}
                    ></MailContent>
                  </Grid>
                )}
              </Grid>
            </Grid>

            {successMailSent && (
              <div align="right">
                <Snackbar open={open} autoHideDuration={6000}>
                  <Alert severity="success" sx={{ width: "100%" }}>
                    Your mail has been successfully sent!
                  </Alert>
                </Snackbar>
              </div>
            )}
            {errorMailSent && (
              <div align="right">
                <Snackbar open={open} autoHideDuration={6000}>
                  <Alert severity="error" sx={{ width: "100%" }}>
                    Your mail was not sent!
                  </Alert>
                </Snackbar>
              </div>
            )}
            <Grid item xs={12}></Grid>
          </Grid>
        </Container>
      </div>
    </>
  );
}
