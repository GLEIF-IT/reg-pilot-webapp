import React from "react";
import { useIntl } from "react-intl";
import { Typography, Grid, Divider } from "@mui/material";

const Hero: React.FC = () => {
  const { formatMessage } = useIntl();
  return (
    <Grid container spacing={1}>
      <Grid item xs={12}>
        <Typography variant="h3" data-testid="webapp--header">
          {formatMessage({ id: "hero.heading" })}
        </Typography>
        <br />
        <Divider />
        <br />
        <br />
      </Grid>
    </Grid>
  );
};

export default Hero;
