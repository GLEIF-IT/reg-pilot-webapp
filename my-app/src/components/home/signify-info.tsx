import React, { useState } from "react";
import {
  Typography,
  Grid,
  Box,
  Card,
  CardContent,
  Switch,
  Button,
  Tooltip,
  Alert,
} from "@mui/material";
import { Beenhere, LockOpenRounded } from "@mui/icons-material";
import { regService } from "../../services/reg-server.ts";
import { useSnackbar } from "../../context/snackbar.tsx";

interface ISignifyInfo {
  selectedId: string;
  selectedAcdc: any;
  signatureData: any;
  loginUrl: string;
  devMode: boolean;
}

const SignifyInfo: React.FC<ISignifyInfo> = ({
  devMode,
  selectedId,
  selectedAcdc,
  signatureData,
  loginUrl,
}) => {
  const sigString = JSON.stringify(signatureData, null, 2);
  // const { openSnackbar } = useSnackbar();
  const [showRaw, setShowRaw] = useState(false);
  const [showAlert, setShowAlert] = useState(true);

  const { credential } = signatureData ?? {};

  // const handleLogin = async () => {
  //   let vlei_cesr = signatureData?.credential.cesr;

  //   const requestBody = {
  //     said: selectedAcdc?.sad?.d,
  //     vlei: vlei_cesr,
  //   };

  //   const lhead = new Headers();
  //   lhead.set("Content-Type", "application/json");

  //   const lRequest = {
  //     headers: lhead,
  //     method: "POST",
  //     body: JSON.stringify(requestBody),
  //   };

  //   if (devMode) {
  //     openSnackbar("<Devmode> Response received: Verified", "success");
  //     return;
  //   }

  //   try {
  //     const response = await regService.postLogin(loginUrl, {
  //       ...lRequest,
  //     });
  //     const responseData = await response.json();

  //     if (response.status >= 400) {
  //       throw new Error(responseData.msg);
  //     }
  //     if (!response) return;

  //     if (response.msg) {
  //       openSnackbar(response.msg, "success");
  //     }
  //   } catch (error) {
  //     if (typeof error?.message === "string")
  //       openSnackbar(error?.message, "error");
  //     else
  //       openSnackbar(`Unable to connect with server at ${loginUrl}`, "error");
  //   }
  // };
  return (
    <Grid container spacing={1}>
      <Grid item xs={12}>
        <Typography variant="h6" fontWeight="bold">
          Signify Information
        </Typography>
      </Grid>
      <Grid item xs={12}>
        <Typography variant="body2">
          <strong>AID:</strong> {selectedId}
        </Typography>
      </Grid>
      {showAlert && signatureData?.autoSignin ? (
        <Grid item xs={6}>
          <Alert
            severity="info"
            icon={<LockOpenRounded />}
            onClose={() => setShowAlert(false)}
          >
            <Typography variant="subtitle1" fontWeight="bold">
              What does auto signin mean?
            </Typography>
            <Typography variant="subtitle2">
              A credential will be used to sign subsequent network requests if
              it is designated as <strong>auto signin</strong>.
            </Typography>
          </Alert>
        </Grid>
      ) : (
        <></>
      )}
      <Grid item xs={12}>
        <Box
          sx={{
            display: "flex",
            flexDirection: "row",
            justifyContent: "space-between",
          }}
        >
          <Typography variant="body2">
            <strong>Credential:</strong>
          </Typography>
          <Box>
            <Typography variant="body2">
              <strong>Show Raw:</strong>
              <Switch
                checked={showRaw}
                onClick={() => setShowRaw(!showRaw)}
                size="small"
              />
            </Typography>
          </Box>
        </Box>
        <Grid container>
          {showRaw ? (
            <Grid item xs={12}>
              <textarea
                id="message"
                rows={12}
                cols={80}
                className="textarea-data"
                placeholder={sigString}
                defaultValue={sigString}
              />
            </Grid>
          ) : (
            <Grid item xs={6}>
              <Card elevation={2}>
                <CardContent
                  sx={{
                    display: "flex",
                    flexDirection: "column",
                    rowGap: "8px",
                  }}
                >
                  <Box
                    sx={{
                      display: "flex",
                      justifyContent: "space-between",
                      alignItems: "center",
                    }}
                  >
                    <Typography variant="caption">
                      <strong>{credential?.schema?.title}</strong>
                    </Typography>
                    <Box
                      sx={{
                        display: "flex",
                        flexDirection: "row",
                        columnGap: "8px",
                      }}
                    >
                      {signatureData?.autoSignin ? (
                        <Tooltip title="this credential is marked as auto signin">
                          <LockOpenRounded color="success" />
                        </Tooltip>
                      ) : (
                        <></>
                      )}
                      {credential?.status?.et === "iss" && (
                        <Tooltip title="credential is valid">
                          <Beenhere color="success" />
                        </Tooltip>
                      )}
                    </Box>
                  </Box>
                  <Typography variant="caption">
                    <strong>AID:</strong> {selectedId}
                  </Typography>
                  <Typography variant="caption">
                    {credential?.schema?.credentialType}
                  </Typography>
                  <Typography variant="caption">
                    {credential?.schema?.description}
                  </Typography>
                  {/* <Button
                    variant="contained"
                    color="primary"
                    size="small"
                    onClick={handleLogin}
                  >
                    Verify
                  </Button> */}
                </CardContent>
              </Card>
            </Grid>
          )}
        </Grid>
      </Grid>
    </Grid>
  );
};

export default SignifyInfo;
