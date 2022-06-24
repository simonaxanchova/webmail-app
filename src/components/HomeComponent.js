import { Container } from "@mui/material";
import * as React from "react";
import { useNavigate } from "react-router-dom";
import { AuthRepository } from "../repositories/AuthRepository";

export default function HomeComponent() {
  const navigate = useNavigate();

  React.useEffect(() => {
    if (AuthRepository.hasAnyRole(["ROLE_CLIENT"])) {
      navigate("/client/newTicket");
    } else if (
      AuthRepository.hasAnyRole(["ROLE_ASTA_ADRIA_AGENT", "ROLE_ASTA_AGENT"])
    ) {
      navigate("/mailbox");
    } else if (AuthRepository.hasAnyRole(["ROLE_ADMINISTRATION"])) {
      navigate("/administration");
    }
  }, []);

  return (
    <>
      <Container maxWidth="xl"></Container>
    </>
  );
}
