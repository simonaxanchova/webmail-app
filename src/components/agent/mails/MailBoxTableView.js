import ClearIcon from "@mui/icons-material/Clear";
import DirectionsBoatIcon from "@mui/icons-material/DirectionsBoat";
import EmailIcon from "@mui/icons-material/Email";
import SearchIcon from "@mui/icons-material/Search";
import {
  Badge,
  Breadcrumbs,
  Button,
  Container,
  Divider,
  FormControl,
  FormControlLabel,
  Grid,
  Icon,
  IconButton,
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
  TableHead,
  TablePagination,
  TableRow,
  TextField,
  Tooltip,
  Typography,
} from "@mui/material";
import Alert from "@mui/material/Alert";
import { createTheme, styled, ThemeProvider } from "@mui/material/styles";
import axios from "axios";
import { EditorState } from "draft-js";
import { stateToHTML } from "draft-js-export-html";
import moment from "moment";
import React, { useEffect, useState } from "react";
import ReactCountryFlag from "react-country-flag";
import Draggable from "react-draggable";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate, useParams } from "react-router-dom";
import {
  notifyShowErrorMessage,
  notifyShowSuccessMessage,
} from "../../../common/CommonActions";
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

export default function MailBoxTableView() {
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
  const [size, setSize] = useState(10);
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
  const [openDialog, setOpenDialog] = React.useState(false);
  const [selectedTicket, setSelectedTicket] = React.useState(null);
  const [activeIndex, setActiveIndex] = useState(false);
  const handleOnHover = (index) => {
    setActiveIndex(index);
  };
  const [step, setStep] = useState(0);
  const [hoveredMail, setHoveredMail] = useState(false);

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
    localStorage.setItem("mailboxType", "table");
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

  const reloadAfterCreatingTicket = () => {
    setLoading(true);
    MailBoxRepository.getById(params.id).then(
      (res) => {
        setCurrentMail(res.data);
        setSelectedMail(res.data);
      },
      (err) => {
        console.log("greshka");
        setLoading(false);
      }
    );
    setLoading(true);
    MailBoxRepository.all({
      page: params.page,
      size: size,
      orderBy: orderBy,
      orderDirection: orderDirection,
      searchParams: params.params,
    })
      .then((res) => {
        setMails(res.data);
        setLoading(false);
      })
      .catch((err) => {
        setLoading(false);
      });
  };

  useEffect(() => {
    if (params && params.id) {
      setLoading(true);
      MailBoxRepository.getById(params.id).then(
        (res) => {
          setCurrentMail(res.data);
          setSelectedMail(res.data);
        },
        (err) => {
          console.log("greshka");
          setLoading(false);
        }
      );
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
        `/mailboxTable/${0}/${size}/${JSON.stringify({ mailType: "INCOMING" })}`
      );
    } else {
      navigate(
        `/mailboxTable/${0}/${size}/${JSON.stringify({ mailType: "OUTGOING" })}`
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
        `/mailboxTable/${0}/${size}/${JSON.stringify({ mailType: "INCOMING" })}`
      );
    } else if (newValue == 2) {
      navigate(
        `/mailboxTable/${0}/${size}/${JSON.stringify({ mailType: "OUTGOING" })}`
      );
    } else {
      navigate(`/mailboxTable/${0}/${size}/${JSON.stringify({})}`);
    }
  };

  const linkTicket = () => {
    setLoading(true);
    MailBoxRepository.linkTicket(params.id, selectedTicket.id)
      .then((res) => {
        dispatch(
          notifyShowSuccessMessage(LOCALE.ticket_create_success_message)
        );
        reloadAfterCreatingTicket();
        setLoading(false);
        setOpenDialog(false);
        setSelectedTicket(null);
      })
      .catch((err) => {
        notifyShowErrorMessage(LOCALE.ticket_create_success_message);
        setLoading(false);
      });
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
      right: 5,
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
              <Stack spacing={2} direction="row">
                <Breadcrumbs
                  style={{ cursor: "pointer" }}
                  separator={<Icon fontSize="small">navigate_next</Icon>}
                >
                  <Typography
                    variant="h5"
                    key="2"
                    color="text.primary"
                    onClick={() => {
                      setStep(0);
                      setCurrentMail(null);
                    }}
                  >
                    {LOCALE.mailbox}
                  </Typography>
                  {step == 1 && (
                    <Typography variant="h5" key="2" color="text.primary">
                      {currentMail?.subject}
                    </Typography>
                  )}
                </Breadcrumbs>
              </Stack>
            </Grid>
            <Grid item xs={6} style={{ textAlign: "right" }}>
              <FormControlLabel
                control={
                  <Switch
                    checked={true}
                    onChange={() =>
                      navigate(
                        `/mailboxTable/${params?.page}/${5}/${JSON.stringify(
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
            {step == 0 && (
              <>
                <Grid item xs={1.5}></Grid>
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
                          `/mailboxTable/${0}/${size}/${JSON.stringify(
                            searchParams
                          )}`
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
                          `/mailboxTable/${0}/${size}/${JSON.stringify(
                            searchParams
                          )}`
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
                          `/mailboxTable/${0}/${size}/${JSON.stringify(
                            searchParams
                          )}`
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
                          `/mailboxTable/${0}/${size}/${JSON.stringify(
                            searchParams
                          )}`
                        );
                      }}
                    >
                      <SearchIcon style={{ color: "white" }}></SearchIcon>
                      <span style={{ color: "white", fontWeight: "bold" }}>
                        {LOCALE.search}
                      </span>
                    </Button>
                  </Tooltip>
                </Grid>
              </>
            )}

            <Divider />
            {step == 0 && (
              <Grid item xs={12} md={12} lg={12} xl={12}>
                <Paper variant="outlined">
                  <TableContainer>
                    <Table size="small">
                      {mails?.content ? (
                        <TableBody>
                          {mails?.content &&
                            mails?.content?.map((mail, index) => (
                              <TableRow
                                onMouseOver={() => {
                                  setHoveredMail(mail);
                                }}
                                onMouseLeave={() => {
                                  setHoveredMail(null);
                                }}
                                style={
                                  mail.read
                                    ? hoveredMail?.id === mail.id
                                      ? {
                                          boxShadow:
                                            "inset 2px 0 0 #dadce0, inset -2px 0 0 #dadce0, 0 2px 3px 0 rgb(60 64 67 / 30%), 0 2px 4px 2px rgb(60 64 67 / 30%)",
                                        }
                                      : {}
                                    : hoveredMail?.id === mail.id
                                    ? {
                                        boxShadow:
                                          "inset 2px 0 0 #dadce0, inset -2px 0 0 #dadce0, 0 2px 3px 0 rgb(60 64 67 / 30%), 0 2px 4px 2px rgb(60 64 67 / 30%)",
                                        backgroundColor: "#ECF0F1",
                                        borderLeft: "3px solid #70c1c2",
                                      }
                                    : {
                                        backgroundColor: "#ECF0F1",
                                        borderLeft: "3px solid #70c1c2",
                                      }
                                }
                              >
                                <TableCell
                                  style={{
                                    cursor: "pointer",
                                  }}
                                  onClick={() => {
                                    setStep(1);
                                    handleChangeCurrentMail(mail, index);
                                  }}
                                >
                                  <Typography
                                    variant="body1"
                                    style={
                                      mail.read
                                        ? {
                                            fontWeight: "normal",
                                            maxWidth: 250,
                                            whiteSpace: "nowrap",
                                            overflow: "hidden",
                                            textOverflow: "ellipsis",
                                          }
                                        : {
                                            fontWeight: "bold",
                                            maxWidth: 250,
                                            whiteSpace: "nowrap",
                                            overflow: "hidden",
                                            textOverflow: "ellipsis",
                                          }
                                    }
                                  >
                                    {mail?.sender}
                                  </Typography>
                                </TableCell>
                                <TableCell
                                  style={{
                                    cursor: "pointer",
                                  }}
                                  onClick={() => {
                                    setStep(1);
                                    handleChangeCurrentMail(mail, index);
                                  }}
                                >
                                  <div
                                    style={{
                                      display: "flex",
                                      whiteSpace: "nowrap",
                                      overflow: "hidden",
                                      textOverflow: "ellipsis",
                                      width: 950,
                                    }}
                                  >
                                    <Typography
                                      variant="body1"
                                      align="left"
                                      style={
                                        mail.read
                                          ? {
                                              color: "#202124",
                                              fontWeight: "normal",
                                            }
                                          : {
                                              color: "#202124",
                                              fontWeight: "bold",
                                            }
                                      }
                                    >
                                      {mail?.subject}&nbsp;
                                    </Typography>
                                    <Typography
                                      variant="body1"
                                      align="left"
                                      style={
                                        mail.read
                                          ? {
                                              fontWeight: "normal",
                                              color: "#5f6368",
                                              whiteSpace: "nowrap",
                                              overflow: "hidden",
                                              flexShrink: 1,
                                              flexGrowe: 1,
                                              textOverflow: "ellipsis",
                                            }
                                          : {
                                              fontWeight: "bold",
                                              color: "#5f6368",
                                              whiteSpace: "nowrap",
                                              overflow: "hidden",
                                              flexShrink: 1,
                                              flexGrowe: 1,
                                              textOverflow: "ellipsis",
                                            }
                                      }
                                    >
                                      {` - ${mail?.contentTextOnly}`}
                                    </Typography>
                                  </div>
                                </TableCell>
                                <TableCell
                                  align="right"
                                  size="small"
                                  style={{ width: 100 }}
                                >
                                  {hoveredMail?.id === mail.id ? (
                                    <>
                                      <Tooltip
                                        title="Archive"
                                        arrow
                                        placement="top"
                                      >
                                        <IconButton
                                          color="default"
                                          size="small"
                                        >
                                          <Icon size="small">archive</Icon>
                                        </IconButton>
                                      </Tooltip>
                                      {!mail.read ? (
                                        <Tooltip
                                          title="Mark as read"
                                          arrow
                                          placement="top"
                                        >
                                          <IconButton
                                            color="default"
                                            size="small"
                                          >
                                            <Icon size="small">
                                              mark_email_read
                                            </Icon>
                                          </IconButton>
                                        </Tooltip>
                                      ) : (
                                        <Tooltip
                                          title="Mark as unread"
                                          arrow
                                          placement="top"
                                        >
                                          <IconButton
                                            color="default"
                                            size="small"
                                          >
                                            <Icon size="small">
                                              mark_email_unread
                                            </Icon>
                                          </IconButton>
                                        </Tooltip>
                                      )}{" "}
                                    </>
                                  ) : (
                                    <Typography
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
                                      {moment(mail?.dateSent).isSame(
                                        moment(),
                                        "date"
                                      )
                                        ? moment(mail?.dateSent).format("HH:mm")
                                        : moment(mail?.dateSent).format(
                                            "MMMM Do"
                                          )}
                                    </Typography>
                                  )}
                                </TableCell>
                              </TableRow>
                            ))}
                        </TableBody>
                      ) : (
                        <div>
                          <Skeleton variant="react" width="100%" height={30} />
                          <br />
                          <Skeleton variant="react" width="100%" height={30} />
                          <br />
                          <Skeleton variant="react" width="100%" height={30} />
                          <br />
                          <Skeleton variant="react" width="100%" height={30} />
                          <br />
                          <Skeleton variant="react" width="100%" height={30} />
                          <br />
                          <Skeleton variant="react" width="100%" height={30} />
                          <br />
                          <Skeleton variant="react" width="100%" height={30} />
                          <br />
                          <Skeleton variant="react" width="100%" height={30} />
                          <br />
                          <Skeleton variant="react" width="100%" height={30} />
                          <br />
                          <Skeleton variant="react" width="100%" height={30} />
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
                                    `/mailboxTable/${value}/${size}/${JSON.stringify(
                                      JSON.parse(params.params)
                                    )}`
                                  );
                                }}
                                onRowsPerPageChange={(event, value) => {
                                  setSize(event.target.value);
                                  navigate(
                                    `/mailboxTable/${0}/${
                                      event.target.value
                                    }/${JSON.stringify(
                                      JSON.parse(params.params)
                                    )}`
                                  );
                                }}
                              />
                            )
                          ) : (
                            <Skeleton
                              variant="react"
                              width="100%"
                              height={50}
                            />
                          )}
                        </TableRow>
                      </TableFooter>
                    </Table>
                  </TableContainer>
                </Paper>
              </Grid>
            )}
            {step == 1 && (
              <Grid
                item
                xs={12}
                md={8}
                lg={8}
                xl={8}
                style={{
                  marginLeft: "auto",
                  marginRight: "auto",
                }}
              >
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
            )}
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
