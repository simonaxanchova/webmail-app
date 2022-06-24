import {
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  FormControl,
  FormControlLabel,
  Grid,
  LinearProgress,
  Paper,
  Radio,
  RadioGroup,
  Slide,
  Typography,
} from "@mui/material";
import Alert from "@mui/material/Alert";
import React from "react";
import { Editor } from "react-draft-wysiwyg";
import Draggable from "react-draggable";

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

export default function MailboxReplyDialog({
  open,
  handleClose,
  replyTo,
  selectedTicketForReply,
  setSelectedTicketForReply,
  currentMail,
  editorState,
  onEditorStateChange,
  loadingSentMail,
  sendReplyMail,
}) {
  React.useEffect(() => {
    console.log(open);
  }, [open]);
  return (
    <Dialog
      open={open}
      onClose={handleClose}
      PaperComponent={PaperComponent}
      replyTo={replyTo}
      fullWidth={true}
      maxWidth={"md"}
      TransitionComponent={Transition}
    >
      <DialogTitle
        style={{
          cursor: "move",
        }}
      >
        <Typography variant="body2">Reply to {replyTo?.sender}</Typography>
      </DialogTitle>
      <Alert severity="info">
        <Typography variant="body2">
          <b>Note:</b> Choose a ticket to whom the reply refers to and write a
          reply contet.
        </Typography>
      </Alert>

      <DialogContent>
        <FormControl size="small">
          <RadioGroup
            size="small"
            value={selectedTicketForReply}
            onChange={(e) => {
              setSelectedTicketForReply(e.target.value);
            }}
          >
            {currentMail?.mailboxTickets &&
              currentMail?.mailboxTickets?.map((mailboxTicket, index) => (
                <FormControlLabel
                  size="small"
                  value={mailboxTicket?.ticket?.id}
                  control={<Radio size="small" />}
                  label={
                    <Typography variant="body2">
                      {mailboxTicket?.ticket?.destination?.name +
                        ` (Truck plate number: ${mailboxTicket?.ticket?.truckPlateNumber})`}
                    </Typography>
                  }
                />
              ))}
          </RadioGroup>
        </FormControl>
        <br></br>
        <Grid item md={12} sm={12} xs={12}>
          <Editor
            editorState={editorState}
            onEditorStateChange={onEditorStateChange}
            wrapperClassName="demo-wrapper"
            editorClassName="demo-editor"
          />
        </Grid>
      </DialogContent>
      <DialogActions>
        {!loadingSentMail ? (
          <div align="right">
            <Button
              onClick={handleClose}
              color="secondary"
              variant="outlined"
              size="small"
              style={{ marginRight: "10px" }}
            >
              Cancel
            </Button>
            <Button
              color="primary"
              size="small"
              variant="outlined"
              onClick={() =>
                sendReplyMail(replyTo?.id, editorState, selectedTicketForReply)
              }
            >
              Send
            </Button>
          </div>
        ) : (
          <div style={{ width: "100%" }}>
            <LinearProgress color="secondary" />
          </div>
        )}
      </DialogActions>
    </Dialog>
  );
}
