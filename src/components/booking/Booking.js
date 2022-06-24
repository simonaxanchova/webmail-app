import { Grid, Button, Paper } from "@mui/material";
import * as React from "react";
import { LOCALE } from "../../properties/Locale";
import _ from "lodash";

import { TicketRepository } from "../../repositories/TicketRepository";
import { useDispatch } from "react-redux";
import {
  notifyShowErrorMessage,
  notifyShowSuccessMessage,
} from "../../common/CommonActions";
import { AuthRepository } from "../../repositories/AuthRepository";
import TicketDestinationDetails from "../client/TicketDestinationDetails";

export default function Booking() {
  const [data, setData] = React.useState({
    loaded: "2",
    dangerousGoods: false,
    electricPlugin: false,
    liveAnimals: false,
    source: "WEB",
    showPrice: false,
  });

  const [loading, setLoading] = React.useState(false);
  const dispatch = useDispatch();

  React.useEffect(() => {
    if (AuthRepository.getUserDetails()?.organization?.showPrice) {
      let tmp = { ...data };
      tmp.showPrice = true;
      setData(tmp);
    }
  }, []);

  const handleChangeData = (name, value) => {
    setData(_.set({ ...data }, name, value));
  };

  return (
    <>
      <Paper
        elevation={3}
        className="roundedBorder"
        style={{ padding: "20px" }}
      >
        <Grid container spacing={2}>
          <TicketDestinationDetails
            handleChangeData={handleChangeData}
            setData={setData}
            data={data}
            handleSubmit={handleSubmit}
          ></TicketDestinationDetails>
          <br></br>
        </Grid>
      </Paper>
    </>
  );
}
