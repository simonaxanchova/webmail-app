import ClearIcon from "@mui/icons-material/Clear";
import DirectionsBoatIcon from "@mui/icons-material/DirectionsBoat";
import EmailIcon from "@mui/icons-material/Email";
import SearchIcon from "@mui/icons-material/Search";
import { TabContext, TabList } from "@mui/lab";
import {
  Badge,
  Box,
  Breadcrumbs,
  Button,
  Card,
  CardContent,
  CardHeader,
  Container,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
  Divider,
  FormControl,
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
import Tab from "@mui/material/Tab";
import axios from "axios";
import { EditorState } from "draft-js";
import { stateToHTML } from "draft-js-export-html";
import moment from "moment";
import React, { useEffect, useState } from "react";
import Avatar from "react-avatar";
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
import { DestinationCitiesRepository } from "../../../repositories/DestinationCitiesRepository";
import { MailBoxRepository } from "../../../repositories/MailboxRepository";
import { OrganizationsRepository } from "../../../repositories/OrganizationsRepository";
import { PriceListRepository } from "../../../repositories/PriceListRepository";
import { VehicleCategoriesRepository } from "../../../repositories/VehicleCategoriesRepository";
// import CreateTicketFromMailbox from "../newTicket/CreateTicketFromMailbox";
import { LinkTicketsList } from "../tickets/LinkTicketsList";
import MailboxReplyDialog from "./MailboxReplyDialog";
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

export default function MailboxLinkTicketDialog({
  openDialog,
  setOpenDialog,
  currentMail,
  selectedTicket,
  setSelectedTicket,
  linkTicket,
}) {
  return (
    <>
      <Dialog
        open={openDialog}
        onClose={() => {
          setOpenDialog(false);
        }}
        maxWidth={"lg"}
      >
        <DialogTitle>{LOCALE.link_with_ticket}</DialogTitle>
        <DialogContent>
          <DialogContentText>
            <LinkTicketsList
              currentMail={currentMail}
              selectedTicket={selectedTicket}
              setSelectedTicket={setSelectedTicket}
            />
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button
            size="small"
            variant="contained"
            style={{
              backgroundColor: "#43aa8b",
              color: "white",
            }}
            onClick={() => {
              linkTicket();
            }}
            disabled={!selectedTicket}
          >
            Link
          </Button>
          <Button
            size="small"
            variant="contained"
            style={{
              backgroundColor: "#f94144",
              color: "white",
            }}
            onClick={() => {
              setOpenDialog(false);
              setSelectedTicket(null);
            }}
          >
            Close
          </Button>
        </DialogActions>
      </Dialog>
    </>
  );
}
