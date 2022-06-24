import Axios from "axios";
import { SETTINGS } from "../properties/Settings";

export const DestinationCoordinatesRepository = {
  findByDestinationCityId: (destinationCityId) => {
    return Axios({
      url: SETTINGS.API_URL + "destinationCoordinates/" + destinationCityId,
      method: "GET",
    });
  },
};
