import React from "react";
import {
  Alert,
  Box,
  Typography,
  Grid,
  Button,
  Card,
  CardContent,
} from "@mui/material";
import { CheckCircleOutline, CancelOutlined } from "@mui/icons-material";

interface IExtensionInfo {
  installed: boolean;
  vendorConfigued: boolean;
  signedDataReceived: boolean;
  error?: string;
  removeData: () => void;
  devMode: boolean;
  handleCredSignin: () => void;
  signatureData: any;
  handleConfigExt: () => void;
}

const ExtensionInfo: React.FC<IExtensionInfo> = ({
  installed,
  vendorConfigued,
  signedDataReceived,
  error,
  removeData,
  devMode,
  handleCredSignin,
  signatureData,
  handleConfigExt,
}) => (
  <Grid
    container
    spacing={2}
    sx={{ borderRight: "1px solid grey", padding: "8px" }}
  >
    {installed === false && !vendorConfigued && (
      <Grid item xs={12} lg={12}>
        <Alert severity="error" variant="filled">
          <Typography variant="body2">
            Download / Install extension to connect
          </Typography>
        </Alert>
      </Grid>
    )}
    <Grid item xs={12}>
      <Typography variant="body1" fontWeight="bold">
        Please start by signing in with a secure extension.
      </Typography>
    </Grid>
    <Grid
      item
      xs={12}
      style={{
        marginBottom: "8px",
      }}
    >
      <Card elevation={2}>
        <CardContent>
          <Typography variant="body1" fontWeight="bold">
            Extension Config
          </Typography>
          <Typography
            variant="body2"
            style={{ display: "flex", columnGap: "8px" }}
          >
            Extension installed:{" "}
            {installed ? (
              <CheckCircleOutline color="success" fontSize="small" />
            ) : (
              <CancelOutlined color="error" fontSize="small" />
            )}
          </Typography>
          <Typography
            variant="body2"
            style={{ display: "flex", columnGap: "8px" }}
          >
            Vendor set:{" "}
            {vendorConfigued ? (
              <CheckCircleOutline color="success" fontSize="small" />
            ) : (
              <CancelOutlined color="error" fontSize="small" />
            )}
          </Typography>
          <Typography
            variant="body2"
            style={{ display: "flex", columnGap: "8px" }}
          >
            Signed data:{" "}
            {signedDataReceived ? (
              <CheckCircleOutline color="success" fontSize="small" />
            ) : (
              <CancelOutlined color="error" fontSize="small" />
            )}
          </Typography>
        </CardContent>
      </Card>
    </Grid>
    <Grid
      item
      xs={12}
      style={{
        marginBottom: "8px",
      }}
    >
      <Card elevation={2}>
        <CardContent>
          <Typography variant="body1" fontWeight="bold">
            Test credentials
          </Typography>
          <Typography variant="body2">
            Agent Url: http://localhost:3901
          </Typography>
          <Typography variant="body2">
            Boot Url: http://localhost:3903
          </Typography>
          <Typography variant="body2">
            Passcode: CGbMVe0SzH_aor_TmUweIN
          </Typography>
        </CardContent>
      </Card>
    </Grid>
    <Grid item xs={12}>
      <Box
        sx={{
          display: "flex",
          flexDirection: "row",
          columnGap: "8px",
          justifyContent: "flex-end",
        }}
      >
        {!vendorConfigued && !devMode && (
          <Button
            size="small"
            variant="contained"
            color="success"
            onClick={handleConfigExt}
          >
            Configure Extension
          </Button>
        )}
        {((vendorConfigued && !signatureData) || devMode) && (
          <Button
            size="small"
            variant="contained"
            color="success"
            onClick={handleCredSignin}
          >
            Sign-in w/ Credential
          </Button>
        )}
        <Button
          size="small"
          variant="contained"
          color="error"
          onClick={removeData}
        >
          Clear
        </Button>
      </Box>
    </Grid>
    <Grid item xs={12}>
      {error !== "" && (
        <Alert severity={error?.includes("agent") ? "error" : "warning"}>
          <Typography variant="body2">{error}</Typography>
        </Alert>
      )}
    </Grid>
  </Grid>
);

export default ExtensionInfo;
