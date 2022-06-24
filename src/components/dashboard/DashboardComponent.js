import {
  Button,
  Card,
  CardContent,
  Container,
  Grid,
  Icon,
  Typography,
} from "@mui/material";
import { Box } from "@mui/system";
import React, { useState, useEffect } from "react";
import { Navigate, useNavigate } from "react-router";

export default function DashboardComponent() {
  const navigate = useNavigate();

  return (
    <>
      <div>
        <Container maxWidth="xl">
          <Grid container spacing={3}></Grid>
        </Container>
      </div>
    </>
  );
}
