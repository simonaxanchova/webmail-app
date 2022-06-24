import axios from "axios";
import { SETTINGS } from "../properties/Settings";

export const InvitationRegistrationRepository = {
  registerOrganization: (registration) => {
    return axios({
      url: `${SETTINGS.API_URL}register/organization/registerOrganizationByInvitation`,
      data: registration,
      method: "POST",
    });
  },

  getUserInvitation: (invitationCode) => {
    return axios({
      url: `${SETTINGS.API_URL}register/user/getUserInvitation/${invitationCode}`,
      method: "GET",
    });
  },

  registerUser: (registration) => {
    return axios({
      url: `${SETTINGS.API_URL}register/user/registerUserByInvitation`,
      data: registration,
      method: "POST",
    });
  },
};
