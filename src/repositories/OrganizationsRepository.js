import Axios from "axios";
import { SETTINGS } from "../properties/Settings";

export const OrganizationsRepository = {
  fetchAll: (payload) => {
    return Axios({
      url: SETTINGS.API_URL + "organizations",
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
  fetchAllWithoutPaging: () => {
    return Axios({
      url: SETTINGS.API_URL + "organizations/all",
      method: "GET",
    });
  },

  getAllResponsibleOffices: () => {
    return Axios({
      url: SETTINGS.API_URL + "organizations/responsibleOffices",
      method: "GET",
    });
  },

  get: (id) => {
    return Axios.get(`${SETTINGS.API_URL}organizations/${id}`);
  },

  createOrganization: (data) => {
    return Axios({
      url: `${SETTINGS.API_URL}organizations`,
      method: "POST",
      data: data,
    });
  },
  updateOrganization: (data) => {
    return Axios({
      url: `${SETTINGS.API_URL}organizations`,
      method: "PUT",
      data: data,
    });
  },

  deleteOrganization: (id) => {
    return Axios.delete(`${SETTINGS.API_URL}organizations/${id}`);
  },

  generateInvitationCode: (id) => {
    return Axios.post(
      `${SETTINGS.API_URL}organizations/${id}/generateInvitationCode`
    );
  },

  getOrganizationByInvitationCode: (code) => {
    return Axios.get(
      `${SETTINGS.API_URL}organizations/getByInvitationCode/${code}`
    );
  },

  sendInvitationalMails: (organizationEmailsInvitations) => {
    return Axios({
      url: `${SETTINGS.API_URL}organizations/sendMails`,
      method: "POST",
      data: organizationEmailsInvitations,
    });
  },

  findByEmail: (email) => {
    return Axios({
      url: `${SETTINGS.API_URL}organizations/findByEmail`,
      method: "GET",
      params: { email: email },
    });
  },
};
