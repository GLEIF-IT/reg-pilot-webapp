import React, { useState } from "react";
import { useIntl } from "react-intl";
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

interface ISignifyInfo {
  selectedId: string;
  selectedAcdc: any;
  signatureData: any;
  loginUrl: string;
}

const SignifyInfo: React.FC<ISignifyInfo> = ({ selectedId, signatureData }) => {
  const sigString = JSON.stringify(signatureData, null, 2);
  const { formatMessage } = useIntl();
  const [showRaw, setShowRaw] = useState(false);
  const [showAlert, setShowAlert] = useState(true);

  const { credential } = signatureData ?? {};

  return (
    <Grid container spacing={1}>
      <Grid item xs={12}>
        <Typography variant="h6" fontWeight="bold">
          {formatMessage({ id: "credential.heading" })}
        </Typography>
      </Grid>
      {/* <Grid item xs={12}>
        <Typography variant="body2">
          <strong>AID:</strong> {selectedId}
        </Typography>
      </Grid> */}
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
            {/* <strong>Credential:</strong> */}
          </Typography>
          <Box>
            <Typography variant="body2">
              <strong>{formatMessage({ id: "credential.showRaw" })}</strong>
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
                      <strong>{credential?.raw?.schema?.title}</strong>
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
                      {credential?.raw?.status?.et === "iss" && (
                        <Tooltip title="credential is valid">
                          <Beenhere color="success" />
                        </Tooltip>
                      )}
                    </Box>
                  </Box>
                  <Typography variant="caption">
                    <strong>{formatMessage({ id: "credential.aid" })}</strong>{" "}
                    {selectedId}
                  </Typography>
                  <Typography variant="caption">
                    {credential?.raw?.schema?.credentialType}
                  </Typography>
                  <Typography variant="caption">
                    {credential?.raw?.schema?.description}
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
