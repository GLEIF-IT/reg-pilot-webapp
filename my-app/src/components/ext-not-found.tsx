import React from "react";
import { useIntl } from "react-intl";
import { Box, Button, Typography } from "@mui/material";
import ItemNotAvailable from "../assets/img/item_not_available.png";

const ExtNotFound = () => {
  const { formatMessage } = useIntl();

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
      <Typography
        data-testid="extension--not-installed-message"
        variant="h6"
        fontWeight="bold"
      >
        {formatMessage({ id: "extInfo.notInstalled" })}
      </Typography>
      <Typography variant="body2">
        {formatMessage({ id: "extInfo.download" })}
      </Typography>
      <Button
        data-testid="webapp--reload"
        variant="contained"
        color="primary"
        size="small"
        onClick={handleReload}
      >
        {formatMessage({ id: "cta.reload" })}
      </Button>
    </Box>
  );
};

export default ExtNotFound;
