import {
  Accordion,
  Box,
  Button,
  Divider,
  Grid,
  Paper,
  Skeleton,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Typography,
} from "@mui/material";
import React, { useEffect } from "react";
import { FileIcon } from "react-file-icon";
import { moment } from "../../../App";
import { defaultStyles } from "react-file-icon";
import ReplyIcon from "@mui/icons-material/Reply";
import Avatar from "react-avatar";
import { LOCALE } from "../../../properties/Locale";
import { Tooltip } from "@material-ui/core";

export default function MailContent({
  currentMail,
  downloadAttachments,
  handleClickOpen,
  loading,
}) {
  return (
    <>
      <Grid item xs={12}>
        <Paper
          variant="outlined"
          sx={{
            display: "flex",
            overflow: "auto",
            height: "822px",
          }}
        >
          <TableContainer
            style={{
              margin: "10px",
            }}
          >
            <Table
              style={{
                tableLayout: "fixed",
                wordWrap: "break-word",
              }}
            >
              <TableBody>
                <br />

                {!loading ? (
                  <Grid container spacing={2}>
                    <Grid
                      item
                      xs={2}
                      style={{
                        display: "flex",
                        justifyContent: "center",
                        alignItems: "center",
                      }}
                    >
                      <Avatar
                        name={
                          currentMail?.sender?.startsWith('"')
                            ? currentMail?.sender?.substring(1)
                            : currentMail?.sender
                        }
                        maxInitials={1}
                        round={true}
                        size="50"
                      ></Avatar>
                    </Grid>
                    <Grid item xs={8}>
                      <Typography varinat="body2">
                        {currentMail?.sender?.split("<")[0]}{" "}
                      </Typography>
                      <Typography varinat="body2">
                        {currentMail?.subject}
                      </Typography>
                      {!loading && currentMail?.dateSent && (
                        <Typography
                          variant="caption"
                          style={{
                            color: "#adb5bd",
                          }}
                        >
                          {moment(currentMail?.dateSent)
                            .local()
                            .format("DD/MM/YY") +
                            " at " +
                            moment(currentMail?.dateSent)
                              .local()
                              .format("HH:mm") +
                            " (" +
                            moment(currentMail?.dateSent).local().fromNow() +
                            ")"}
                        </Typography>
                      )}
                    </Grid>
                    <Grid
                      item
                      md={2}
                      style={{
                        display: "flex",
                        justifyContent: "center",
                        alignItems: "center",
                      }}
                    >
                      {!loading &&
                        currentMail &&
                        currentMail?.newContent &&
                        handleClickOpen && (
                          <Button
                            size="small"
                            onClick={() => handleClickOpen(currentMail)}
                          >
                            <ReplyIcon
                              fontSize="small"
                              style={{
                                // marginRight: "5px",
                                marginBottom: 5,
                              }}
                            ></ReplyIcon>
                            Reply
                          </Button>
                        )}
                    </Grid>
                  </Grid>
                ) : (
                  <div>
                    <Skeleton variant="rect" width="100%" height={30} />
                    <br />
                    <Skeleton variant="rect" width="100%" height={30} />
                    <br />
                    <Skeleton variant="rect" width="100%" height={30} />
                  </div>
                )}

                {!loading && currentMail && (
                  <Divider
                    style={{
                      padding: "10px",
                    }}
                  />
                )}

                {!loading ? (
                  currentMail &&
                  currentMail?.newContent && (
                    <>
                      <TableRow>
                        <TableCell>
                          {currentMail?.attachments &&
                            currentMail?.attachments?.length > 0 && (
                              <Grid item xs={12}>
                                {currentMail?.attachments &&
                                  currentMail?.attachments?.length > 0 &&
                                  currentMail.attachments.map(
                                    (attachment, index) => (
                                      <>
                                        <Box
                                          className="download-attachment-box"
                                          onClick={() =>
                                            downloadAttachments(attachment)
                                          }
                                        >
                                          <svg
                                            xmlns="http://www.w3.org/2000/svg"
                                            viewBox="0 0 40 48"
                                            width="100%"
                                            style={{
                                              maxWidth: "6%",
                                            }}
                                          >
                                            <FileIcon
                                              size={16}
                                              labelColor={"#70C1C2"}
                                              extension={
                                                attachment.fileExtension
                                              }
                                              {...defaultStyles[
                                                attachment.fileExtension
                                              ]}
                                              style={{
                                                verticalAlign: "middle",
                                                marginTop: "10px",
                                              }}
                                            />
                                          </svg>
                                          <span
                                            style={{
                                              marginLeft: "10px",
                                              fontSize: "10",
                                              marginTop: "10px",
                                            }}
                                          >
                                            {attachment.fileName}
                                          </span>
                                        </Box>
                                      </>
                                    )
                                  )}
                              </Grid>
                            )}
                          <Typography
                            style={{
                              maxWidth: "100%",
                              wordWrap: "break-word",
                              whiteSpace: currentMail.newContent.startsWith("<")
                                ? "normal"
                                : "pre-wrap",
                            }}
                            variant="body1"
                            dangerouslySetInnerHTML={{
                              __html: currentMail?.newContent,
                            }}
                          ></Typography>
                        </TableCell>
                      </TableRow>
                    </>
                  )
                ) : (
                  <div>
                    <br />
                    <Skeleton variant="rect" width="100%" height={30} />
                    <br />
                    <Skeleton variant="rect" width="100%" height={30} />
                    <br />
                    <Skeleton variant="rect" width="100%" height={30} />
                    <br />
                    <Skeleton variant="rect" width="100%" height={30} />
                    <br />
                    <Skeleton variant="rect" width="100%" height={30} />
                    <br />
                    <Skeleton variant="rect" width="100%" height={30} />
                    <br />
                    <Skeleton variant="rect" width="100%" height={30} />
                    <br />
                    <Skeleton variant="rect" width="100%" height={30} />
                    <br />
                    <Skeleton variant="rect" width="100%" height={30} />
                    <br />
                    <Skeleton variant="rect" width="100%" height={30} />
                  </div>
                )}
              </TableBody>
            </Table>
          </TableContainer>
        </Paper>
      </Grid>
    </>
  );
}
