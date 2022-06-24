import React from "react";
import { Icon } from "@mui/material";

export const getTicketSourceIcon = (src) => {
  if (src === "WEB") return <Icon>language</Icon>;
  else if (src === "PHONE") return <Icon>phone</Icon>;
  else if (src === "MAIL") return <Icon>mail</Icon>;
  else if (src === "SMS") return <Icon>sms</Icon>;
  else if (src === "VIBER") return <Icon>phone</Icon>;
  else if (src === "WHATS_APP") return <Icon>phone</Icon>;
  else if (src === "OTHER") return <Icon>device_unknown</Icon>;
  else return "";
};

export const getTicketStatusColor = (status) => {
  if (status === "PENDING") return "info";
  if (status === "IN_PROGRESS") return "secondary";
  if (status === "APPROVED") return "primary";
  if (status === "REJECTED") return "warning";
  if (status === "DONE") return "success";
  if (status === "CANCELLED") return "error";
  if (status == "ESCALATED") return "info";
  else return "primary";
};

export const getCommunicationStatusColor = (status, type) => {
  if (type == "agent") {
    if (status === "WAITING_FOR_CUSTOMER") return "default";
    if (status === "RECEIVED_RESPONSE") return "warning";
  } else if (type == "client") {
    if (status === "WAITING_FOR_CUSTOMER") return "warning";
    if (status === "RECEIVED_RESPONSE") return "default";
  } else return "primary";
};

export const getTicketPriorityColor = (priority) => {
  if (priority === "LOW") return "info";
  if (priority === "MEDIUM") return "default";
  if (priority === "HIGH") return "error";
  if (priority === "CRITICAL") return "error";
  else return "primary";
};
