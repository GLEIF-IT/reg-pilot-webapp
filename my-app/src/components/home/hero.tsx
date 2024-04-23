import React from "react";
import { Typography, Grid, Divider } from "@mui/material";

const Hero: React.FC = () => (
  <Grid container spacing={1}>
    <Grid item xs={12}>
      <Typography variant="h3">Customer portal</Typography>
      <br />
      <Divider />
      <br />
      <br />
    </Grid>
  </Grid>
);

export default Hero;
