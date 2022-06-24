import React from "react";
import {
  CircularProgress,
  TableRow,
  TableCell,
  Typography,
} from "@mui/material";
import { Box } from "@mui/system";

export const TableCircularProgress = ({ colSpan }) => {
  return (
    <>
      <TableRow>
        <TableCell colSpan={colSpan} style={{ textAlign: "center" }}>
          <Box display="flex" justifyContent="center" alignItems="center">
            <CircularProgress
              style={{ marginTop: "100px", marginBottom: "100px" }}
            />
            <Typography
              position="absolute"
              style={{ marginTop: 90, fontSize: 14 }}
            >
              Loading...
            </Typography>
          </Box>
        </TableCell>
      </TableRow>
    </>
  );
};
