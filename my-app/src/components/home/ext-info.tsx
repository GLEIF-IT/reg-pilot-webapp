import React from "react";
import {
  Alert,
  Box,
  Typography,
  Grid,
  Button,
  Card,
  CardContent,
  CircularProgress,
} from "@mui/material";
import { CheckCircleOutline, CancelOutlined } from "@mui/icons-material";

interface IExtensionInfo {
  vendorConfigued: boolean;
  signedDataReceived: boolean;
  error?: string;
  removeData: () => void;
  devMode: boolean;
  handleCredSignin: () => void;
  handleAutoSignin: () => void;
  handleAidSignin: () => void;
  signatureData: any;
  handleConfigExt: () => void;
  aidLoading?: boolean;
  credLoading?: boolean;
  autoCredLoading?: boolean;
}

const ExtensionInfo: React.FC<IExtensionInfo> = ({
  vendorConfigued,
  signedDataReceived,
  error,
  removeData,
  devMode,
  handleCredSignin,
  handleAutoSignin,
  handleAidSignin,
  signatureData,
  handleConfigExt,
  aidLoading,
  credLoading,
  autoCredLoading,
}) => (
  <Grid
    container
    spacing={2}
    sx={{ borderRight: "1px solid grey", padding: "8px" }}
  >
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
    {/* <Grid
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
    </Grid> */}
    <Grid item xs={12}>
      <Box
        sx={{
          display: "flex",
          flexDirection: "column",
          rowGap: "8px",
          justifyContent: "flex-end",
        }}
      >
        {!devMode && !signatureData && (
          <Button
            size="small"
            variant="contained"
            color="success"
            onClick={handleConfigExt}
          >
            Configure Extension
          </Button>
        )}
        {(!signatureData || devMode) && (
          <Button
            size="small"
            variant="contained"
            color="success"
            onClick={handleAidSignin}
            sx={{ display: "flex", flexDirection: "row", columnGap: "8px" }}
          >
            <Typography variant="body2" fontWeight="bold">
              Select AID
            </Typography>
            {aidLoading && <CircularProgress color="inherit" size="12px" />}
          </Button>
        )}
        {(!signatureData || devMode) && (
          <Button
            size="small"
            variant="contained"
            color="success"
            onClick={handleCredSignin}
            sx={{ display: "flex", flexDirection: "row", columnGap: "8px" }}
          >
            <Typography variant="body2" fontWeight="bold">
              Select Credential
            </Typography>

            {credLoading && <CircularProgress color="inherit" size="12px" />}
          </Button>
        )}
        {(!signatureData || devMode) && (
          <Button
            size="small"
            variant="contained"
            color="success"
            onClick={handleAutoSignin}
            sx={{ display: "flex", flexDirection: "row", columnGap: "8px" }}
          >
            <Typography variant="body2" fontWeight="bold">
              Auto Sign-in Credential
            </Typography>
            {autoCredLoading && (
              <CircularProgress color="inherit" size="12px" />
            )}
          </Button>
        )}
        {signatureData && (
          <Button
            size="small"
            variant="contained"
            color="error"
            onClick={removeData}
          >
            Clear
          </Button>
        )}
      </Box>
    </Grid>
    <Grid item xs={12}>
      {error && (
        <Alert severity={error?.includes("agent") ? "error" : "warning"}>
          <Typography variant="body2">{error}</Typography>
        </Alert>
      )}
    </Grid>
  </Grid>
);

export default ExtensionInfo;
