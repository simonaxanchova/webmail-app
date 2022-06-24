import Axios from "axios";
import { SETTINGS } from "../properties/Settings";

export const MailRepository = {
  fetchAll: (page, size, filterStatus) => {
    return Axios({
      url: `${SETTINGS.API_URL}mail`,
      method: "GET",
      params: {
        page: page,
        size: size,
        filterStatus: filterStatus,
      },
    });
  },
  requeue: (mailMessageId) => {
    return Axios({
      url: `${SETTINGS.API_URL}mail/requeue/${mailMessageId}`,
      method: "PUT",
    });
  },
  cancel: (mailMessageId) => {
    return Axios({
      url: `${SETTINGS.API_URL}mail/cancel/${mailMessageId}`,
      method: "PUT",
    });
  },
  getAllMailTemplates: () => {
    return Axios({
      url: SETTINGS.API_URL + "mailTemplates",
      method: "GET",
    });
  },
  saveMailTemplate: (mailTemplate) => {
    return Axios({
      url: SETTINGS.API_URL + "mailTemplates",
      method: "PUT",
      data: mailTemplate,
      headers: {
        Authorization: SETTINGS.API_AUTHORIZATION_HEADER,
      },
    });
  },
  sendTestMail: (mailMessage, templateType, params) => {
    return Axios({
      url: `${SETTINGS.API_URL}mail/testMail/withTemplate`,
      method: "POST",
      data: mailMessage,
      params: {
        templateType: templateType,
        parameters: params,
      },
    });
  },
  sendRegularTestMail: (mailMessage) => {
    return Axios({
      url: `${SETTINGS.API_URL}mail/testMail/regular`,
      method: "POST",
      data: mailMessage,
    });
  },
};
