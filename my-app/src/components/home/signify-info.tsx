import React from "react";
import { Typography, Grid, Divider } from "@mui/material";

interface ISignifyInfo {
  selectedId: string;
  signatureData: string;
}

const SignifyInfo: React.FC<ISignifyInfo> = ({
  selectedId,
  signatureData,
}) => {
  const sigString = JSON.stringify(signatureData, null, 2);  
  return (
    <Grid container spacing={1}>
      <Grid item xs={12} lg={12}>
        <Typography variant="h6" fontWeight="bold">Signify Information</Typography>
      </Grid>
      <Grid item xs={12} lg={12}>
        <Typography variant="body2"><strong>AID:</strong> {selectedId}</Typography>
      </Grid>
      <Grid item xs={10}>
      <Typography variant="body2"><strong>Credential:</strong></Typography>
        <textarea
          id="message"
          rows={12}
          className="textarea-data"
          placeholder={sigString}
          defaultValue={sigString}
        />
      </Grid>
    </Grid>
  );
};

export default SignifyInfo;
