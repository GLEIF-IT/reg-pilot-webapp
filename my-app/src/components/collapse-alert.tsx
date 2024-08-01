import React, { useEffect, useState } from "react";
import { Alert, IconButton, Typography, Collapse } from "@mui/material";
import KeyboardArrowDownIcon from "@mui/icons-material/KeyboardArrowDown";
import KeyboardArrowUpIcon from "@mui/icons-material/KeyboardArrowUp";

const CollapseAlert = ({ severity = "error", message = "", details = "", dataTestId="" }) => {
  const [isOpen, setIsOpen] = useState(false);
  return (
    <Alert data-testid={dataTestId} severity={severity} sx={{ display: "flex", alignItems: "center" }}>
      {message}
      {details && (
        <IconButton
          aria-label="expand row"
          size="small"
          onClick={() => setIsOpen(!isOpen)}
        >
          {isOpen ? <KeyboardArrowUpIcon /> : <KeyboardArrowDownIcon />}
        </IconButton>
      )}
      {details && (
        <Collapse in={isOpen}>
          <Typography variant="h6">
            <strong>Details:</strong>
          </Typography>
          <Typography variant="body2">{details}</Typography>
        </Collapse>
      )}
    </Alert>
  );
};

export default CollapseAlert;
