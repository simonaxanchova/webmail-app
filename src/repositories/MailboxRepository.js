import Axios from "axios";
import { get } from "draft-js/lib/DefaultDraftBlockRenderMap";
import { SETTINGS } from "../properties/Settings";

export const MailBoxRepository = {
  checkMailbox: () => {
    return Axios({
      url: `${SETTINGS.API_URL}mailbox`,
      method: "GET",
    });
  },
  linkTicket: (ticketId, mailboxId) => {
    return Axios({
      url: `${SETTINGS.API_URL}mailbox/linkTicket`,
      method: "GET",
      params: {
        ticketId: ticketId,
        mailboxId: mailboxId,
      },
    });
  },
  getAllMail: (page, size) => {
    return Axios({
      url: `${SETTINGS.API_URL}mailbox/allMail`,
      method: "GET",
      params: {
        page: page,
        size: size,
      },
    });
  },

  getById: (id) => {
    return Axios.get(`${SETTINGS.API_URL}mailbox/${id}`);
  },

  getTicketById: (id) => {
    return Axios.get(`${SETTINGS.API_URL}mailbox/ticket/${id}`);
  },

  all: (payload) => {
    return Axios({
      url: `${SETTINGS.API_URL}mailbox/getAll`,
      method: "GET",
      params: {
        page: payload.page,
        size: payload.size,
        orderBy: payload.orderBy,
        orderDirection: payload.orderDirection,
        searchParams: payload.searchParams,
      },
    });
  },

  markAsRead: (id) => {
    return Axios({
      url: `${SETTINGS.API_URL}mailbox/${id}/read`,
      method: "PUT",
    });
  },

  getAllUnreadMail: () => {
    return Axios({
      url: `${SETTINGS.API_URL}mailbox/allUnreadMail`,
      method: "GET",
    });
  },

  sendReplyMail: (replyToID, content, ticketId) => {
    return Axios({
      url: `${SETTINGS.API_URL}mailbox/sendReplyMail`,
      method: "POST",
      params: {
        replyToID: replyToID,
        content: content,
        ticketId: ticketId,
      },
    });
  },

  sendReplyMailAndChangeStatus: (replyToID, content, ticketId) => {
    return Axios({
      url: `${SETTINGS.API_URL}mailbox/sendReplyMailAndChangeStatus`,
      method: "POST",
      params: {
        replyToID: replyToID,
        content: content,
        ticketId: ticketId,
      },
    });
  },

  markMailHasTicket: (id) => {
    return Axios({
      url: `${SETTINGS.API_URL}mailbox/${id}/markMailHasTicket`,
      method: "PUT",
    });
  },
};
