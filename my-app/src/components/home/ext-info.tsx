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
import { useIntl } from "react-intl";
import { CheckCircleOutline, CancelOutlined } from "@mui/icons-material";
import { useConfigMode } from "@context/configMode";

interface IExtensionInfo {
  vendorConfigued: boolean;
  signedDataReceived: boolean;
  error?: string;
  removeData: () => void;
  handleCredSignin: (credType?: string) => void;
  requestCredentialOnce: () => void;
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
  handleCredSignin,
  signatureData,
  handleConfigExt,
  credLoading,
  requestCredentialOnce,
}) => {
  const { extMode } = useConfigMode();
  const { formatMessage } = useIntl();
  return (
    <Grid
      container
      spacing={2}
      sx={{ borderRight: "1px solid grey", padding: "8px" }}
    >
      <Grid item xs={12}>
        <Typography variant="body1" fontWeight="bold">
          {formatMessage({ id: "extInfo.heading" })}
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
              {formatMessage({ id: "extInfo.config" })}
            </Typography>
            <Typography
              variant="body2"
              style={{ display: "flex", columnGap: "8px" }}
            >
              {formatMessage({ id: "extInfo.vendorSet" })}
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
              {formatMessage({ id: "extInfo.signedData" })}{" "}
              {signedDataReceived ? (
                <CheckCircleOutline color="success" fontSize="small" />
              ) : (
                <CancelOutlined color="error" fontSize="small" />
              )}
            </Typography>
          </CardContent>
        </Card>
      </Grid>
      <Grid item xs={12}>
        <Box
          sx={{
            display: "flex",
            flexDirection: "column",
            rowGap: "8px",
            justifyContent: "flex-end",
          }}
        >
          {signatureData ? (
            <Button
              size="small"
              variant="contained"
              color="error"
              onClick={removeData}
            >
              {formatMessage({ id: "cta.clear" })}
            </Button>
          ) : (
            <>
              {extMode ? (
                <>
                  <Button
                    data-testid="login--configure--extn"
                    size="small"
                    variant="contained"
                    color="success"
                    onClick={handleConfigExt}
                  >
                    <Typography variant="body2" fontWeight="bold">
                      {formatMessage({ id: "cta.configureExtension" })}
                    </Typography>
                  </Button>
                  <Button
                    data-testid="login--select--cred"
                    size="small"
                    variant="contained"
                    color="success"
                    onClick={() => handleCredSignin()}
                    sx={{
                      display: "flex",
                      flexDirection: "row",
                      columnGap: "8px",
                    }}
                  >
                    <Typography variant="body2" fontWeight="bold">
                      {formatMessage({ id: "cta.selectCredential" })}
                    </Typography>

                    {credLoading && (
                      <CircularProgress
                        data-testid="login--progressbar"
                        color="inherit"
                        size="12px"
                      />
                    )}
                  </Button>
                  <Button
                    data-testid="login--one--time"
                    size="small"
                    variant="contained"
                    color="success"
                    onClick={requestCredentialOnce}
                    sx={{
                      display: "flex",
                      flexDirection: "row",
                      columnGap: "8px",
                    }}
                  >
                    <Typography variant="body2" fontWeight="bold">
                      One Time Credential Request
                    </Typography>
                  </Button>
                </>
              ) : (
                <>
                  <Button
                    size="small"
                    variant="contained"
                    color="warning"
                    onClick={() => handleCredSignin("valid-role")}
                    sx={{
                      display: "flex",
                      flexDirection: "row",
                      columnGap: "8px",
                    }}
                  >
                    <Typography variant="body2" fontWeight="bold">
                      Valid Role
                    </Typography>

                    {credLoading && (
                      <CircularProgress color="inherit" size="12px" />
                    )}
                  </Button>
                  <Button
                    size="small"
                    variant="contained"
                    color="warning"
                    onClick={() => handleCredSignin("invalid-role")}
                    sx={{
                      display: "flex",
                      flexDirection: "row",
                      columnGap: "8px",
                    }}
                  >
                    <Typography variant="body2" fontWeight="bold">
                      Invalid Role
                    </Typography>

                    {credLoading && (
                      <CircularProgress color="inherit" size="12px" />
                    )}
                  </Button>
                  <Button
                    size="small"
                    variant="contained"
                    color="warning"
                    onClick={() => handleCredSignin("invalid-schema")}
                    sx={{
                      display: "flex",
                      flexDirection: "row",
                      columnGap: "8px",
                    }}
                  >
                    <Typography variant="body2" fontWeight="bold">
                      Invalid Schema
                    </Typography>

                    {credLoading && (
                      <CircularProgress color="inherit" size="12px" />
                    )}
                  </Button>
                  <Button
                    size="small"
                    variant="contained"
                    color="warning"
                    onClick={() => handleCredSignin("invalid-crypt")}
                    sx={{
                      display: "flex",
                      flexDirection: "row",
                      columnGap: "8px",
                    }}
                  >
                    <Typography variant="body2" fontWeight="bold">
                      Invalid Crypt
                    </Typography>

                    {credLoading && (
                      <CircularProgress color="inherit" size="12px" />
                    )}
                  </Button>
                </>
              )}
            </>
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
};

export default ExtensionInfo;
