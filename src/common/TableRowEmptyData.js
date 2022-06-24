import { Icon, TableCell, TableRow } from "@mui/material";
import React from "react";

export const TableRowEmptyData = ({ colSpan }) => {
  return (
    <TableRow>
      <TableCell colSpan={colSpan}>
        <Icon
          style={{ verticalAlign: "middle", marginLeft: 30 }}
          color="warning"
        >
          warning
        </Icon>{" "}
        <b
          style={{
            font: "-moz-initial",
            color: "#adb5bd",
            fontWeight: "bold",
            fontSize: "13px",
            textTransform: "uppercase",
            marginLeft: 10,
            marginTop: 10,
          }}
        >
          No records found
        </b>
      </TableCell>
    </TableRow>
  );
};
