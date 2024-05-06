import React from "react";
import { Box, Button, Typography } from "@mui/material";
import ItemNotAvailable from "../assets/img/item_not_available.png";

const ExtNotFound = () => {
  const handleReload = () => {
    window.location.reload();
  };
  return (
    <Box
      display="flex"
      flexDirection="column"
      justifyContent="center"
      alignItems="center"
      rowGap="8px"
      sx={{ height: "100vh" }}
    >
      <Box>
        <img
          style={{ width: "600px" }}
          src={ItemNotAvailable}
          alt="item not available"
        />
      </Box>
      <Typography variant="h6" fontWeight="bold">
        Extension is not installed
      </Typography>
      <Typography variant="body2">
        Download/Install a secure extension to proceed
      </Typography>
      <Button
        variant="contained"
        color="primary"
        size="small"
        onClick={handleReload}
      >
        Reload
      </Button>
    </Box>
  );
};

export default ExtNotFound;
