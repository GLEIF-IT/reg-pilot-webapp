import React, { useState } from "react";
import {
  Typography,
  Button,
  Box,
  Grid,
  TextField,
  Collapse,
  IconButton,
} from "@mui/material";
import { KeyboardArrowUp, KeyboardArrowDown } from "@mui/icons-material";

interface IServerInfo {
  serverUrl: string;
  setServerUrl: () => void;
  pingUrl: string;
  setPingUrl: () => void;
  handlePing: () => void;
  pingResponse: string;
  loginUrl: string;
  setLoginUrl: () => void;
  handleLogin: () => void;
  loginRequest: string;
  loginResponse: string;
}

const ApiWidget = ({ title, children }) => {
  const [isOpen, setIsOpen] = useState(false);
  return (
    <Box
      sx={{
        display: "flex",
        rowGap: "16px",
        flexDirection: "column",
        border: "1px solid grey",
        padding: "8px",
        borderRadius: "8px",
      }}
    >
      <Box
        sx={{
          display: "flex",
          columnGap: "8px",
          flexDirection: "row",
          justifyContent: "space-between",
        }}
      >
        {title}

        <IconButton
          aria-label="expand row"
          size="small"
          onClick={() => setIsOpen(!isOpen)}
        >
          {isOpen ? <KeyboardArrowUp /> : <KeyboardArrowDown />}
        </IconButton>
      </Box>
      {children && (
        <Collapse in={isOpen}>
          {" "}
          <Box sx={{ marginTop: "16px", paddingTop: "16px" }}>{children}</Box>
        </Collapse>
      )}
    </Box>
  );
};

const ServerInfo: React.FC<IServerInfo> = ({
  serverUrl,
  setServerUrl,
  pingUrl,
  setPingUrl,
  handlePing,
  pingResponse,
  loginUrl,
  setLoginUrl,
  handleLogin,
  loginRequest,
  loginResponse,
  verifyUrl,
  setVerifyUrl,
  verifyRequest,
  verifyResponse,
  handleVerify,
  statusUrl,
  setStatusUrl,
  statusRequest,
  statusResponse,
  handleStatus,
  reportUrl,
  setReportUrl,
  reportRequest,
  reportResponse,
  handleReportUpload,
}) => {
  return (
    <Grid container spacing={1}>
      <Grid item xs={12} lg={12}>
        <Typography variant="h6" fontWeight="bold">
          Verification Server Config
        </Typography>
      </Grid>
      <Grid item xs={12} lg={12}>
        <TextField
          id="outlined-basic"
          label="Verification server URl"
          variant="outlined"
          value={serverUrl}
          size="small"
          fullWidth
          onChange={(event: React.ChangeEvent<HTMLInputElement>) => {
            setServerUrl(event.target.value);
          }}
        />
      </Grid>
      <Grid item xs={12} lg={12}>
        <br />
      </Grid>
      <Grid item xs={12} lg={12}>
        <ApiWidget
          title={
            <Typography variant="h6">
              <strong>Ping</strong>{" "}
              <Typography variant="caption">Nudges server</Typography>
            </Typography>
          }
        >
          <Grid container spacing={1}>
            <Grid item xs={12}>
              <Box
                sx={{ display: "flex", flexDirection: "row", columnGap: "8px" }}
              >
                <TextField
                  id="outlined-basic"
                  label="Ping server URl"
                  variant="outlined"
                  fullWidth
                  prefix="https://"
                  size="small"
                  value={pingUrl}
                  onChange={(event: React.ChangeEvent<HTMLInputElement>) => {
                    setPingUrl(event.target.value);
                  }}
                />
                <Box>
                  <Button
                    variant="contained"
                    color="primary"
                    size="small"
                    onClick={handlePing}
                  >
                    Ping
                  </Button>
                </Box>
              </Box>
            </Grid>
            <Grid item xs={12}>
              <Typography variant="body2">
                <strong>Response:</strong>
              </Typography>
              <textarea
                id="message"
                rows={12}
                cols={120}
                className="textarea-data"
                placeholder={"ping response"}
                value={JSON.stringify(pingResponse, null, 2)}
              />
            </Grid>
          </Grid>
        </ApiWidget>
      </Grid>
      <Grid item xs={12}>
        <br />
      </Grid>
      <Grid item xs={12} lg={12}>
        <ApiWidget
          title={
            <Typography variant="h6">
              <strong>Verify</strong>{" "}
              <Typography variant="caption">
                Returns if the headers are properly signed
              </Typography>
            </Typography>
          }
        >
          <Grid container spacing={1}>
            <Grid item xs={12}>
              <Box
                sx={{ display: "flex", flexDirection: "row", columnGap: "8px" }}
              >
                <TextField
                  id="outlined-basic"
                  label="Verify URl"
                  variant="outlined"
                  fullWidth
                  size="small"
                  value={verifyUrl}
                  onChange={(event: React.ChangeEvent<HTMLInputElement>) => {
                    setVerifyUrl(event.target.value);
                  }}
                />
                <Box>
                  <Button
                    variant="contained"
                    color="primary"
                    size="small"
                    disabled={false}
                    onClick={handleVerify}
                  >
                    Verify
                  </Button>
                </Box>
              </Box>
            </Grid>
            <Grid item xs={12}>
              <Typography variant="body2">
                <strong>Request:</strong>
              </Typography>
              <textarea
                className="textarea-data"
                id="login-post"
                rows={12}
                cols={120}
                placeholder={"login post"}
                value={JSON.stringify(verifyRequest, null, 2)}
              />
            </Grid>
            <Grid item xs={12}>
              <Typography variant="body2">
                <strong>Response:</strong>
              </Typography>
              <textarea
                className="textarea-data"
                id="login-response"
                rows={12}
                cols={120}
                placeholder={"login response"}
                value={JSON.stringify(verifyResponse, null, 2)}
              />
            </Grid>
          </Grid>
        </ApiWidget>
      </Grid>
      <Grid item xs={12}>
        <br />
      </Grid>
      <Grid item xs={12} lg={12}>
        <ApiWidget
          title={
            <Typography variant="h6">
              <strong>Login</strong>{" "}
              <Typography variant="caption">
                Given an AID and vLEI, returns information about the login
              </Typography>
            </Typography>
          }
        >
          <Grid container spacing={1}>
            <Grid item xs={12}>
              <Box
                sx={{ display: "flex", flexDirection: "row", columnGap: "8px" }}
              >
                <TextField
                  id="outlined-basic"
                  label="Login server URl"
                  variant="outlined"
                  fullWidth
                  size="small"
                  value={loginUrl}
                  onChange={(event: React.ChangeEvent<HTMLInputElement>) => {
                    setLoginUrl(event.target.value);
                  }}
                />
                <Box>
                  <Button
                    variant="contained"
                    color="primary"
                    size="small"
                    disabled={false}
                    onClick={handleLogin}
                  >
                    Login
                  </Button>
                </Box>
              </Box>
            </Grid>
            <Grid item xs={12}>
              <Typography variant="body2">
                <strong>Request:</strong>
              </Typography>
              <textarea
                className="textarea-data"
                id="login-post"
                rows={12}
                cols={120}
                placeholder={"login post"}
                value={JSON.stringify(loginRequest, null, 2)}
              />
            </Grid>
            <Grid item xs={12}>
              <Typography variant="body2">
                <strong>Response:</strong>
              </Typography>
              <textarea
                className="textarea-data"
                id="login-response"
                rows={12}
                cols={120}
                placeholder={"login response"}
                value={JSON.stringify(loginResponse, null, 2)}
              />
            </Grid>
          </Grid>
        </ApiWidget>
      </Grid>
      <Grid item xs={12}>
        <br />
      </Grid>
      <Grid item xs={12} lg={12}>
        <ApiWidget
          title={
            <Typography variant="h6">
              <strong>Status</strong>{" "}
              <Typography variant="caption">
                Given an AID returns information about the upload status
              </Typography>
            </Typography>
          }
        >
          <Grid container spacing={1}>
            <Grid item xs={12}>
              <Box
                sx={{ display: "flex", flexDirection: "row", columnGap: "8px" }}
              >
                <TextField
                  id="outlined-basic"
                  label="Login server URl"
                  variant="outlined"
                  fullWidth
                  size="small"
                  value={statusUrl}
                  onChange={(event: React.ChangeEvent<HTMLInputElement>) => {
                    setStatusUrl(event.target.value);
                  }}
                />
                <Box>
                  <Button
                    variant="contained"
                    color="primary"
                    size="small"
                    disabled={false}
                    onClick={handleStatus}
                  >
                    Send
                  </Button>
                </Box>
              </Box>
            </Grid>
            <Grid item xs={12}>
              <Typography variant="body2">
                <strong>Request:</strong>
              </Typography>
              <textarea
                className="textarea-data"
                id="login-post"
                rows={12}
                cols={120}
                placeholder={"login post"}
                value={JSON.stringify(statusRequest, null, 2)}
              />
            </Grid>
            <Grid item xs={12}>
              <Typography variant="body2">
                <strong>Response:</strong>
              </Typography>
              <textarea
                className="textarea-data"
                id="login-response"
                rows={12}
                cols={120}
                placeholder={"login response"}
                value={JSON.stringify(statusResponse, null, 2)}
              />
            </Grid>
          </Grid>
        </ApiWidget>
      </Grid>
      <Grid item xs={12}>
        <br />
      </Grid>
      <Grid item xs={12} lg={12}>
        <ApiWidget
          title={
            <Typography variant="h6">
              <strong>Report</strong>{" "}
              <Typography variant="caption">
                Given an AID and DIG, returns information about the upload
              </Typography>
            </Typography>
          }
        >
          <Grid container spacing={1}>
            <Grid item xs={12}>
              <Box
                sx={{ display: "flex", flexDirection: "row", columnGap: "8px" }}
              >
                <TextField
                  id="outlined-basic"
                  label="Report upload server URl"
                  variant="outlined"
                  fullWidth
                  size="small"
                  value={reportUrl}
                  onChange={(event: React.ChangeEvent<HTMLInputElement>) => {
                    setReportUrl(event.target.value);
                  }}
                />
                <Box>
                  <Button
                    variant="contained"
                    color="primary"
                    size="small"
                    disabled={false}
                    onClick={handleReportUpload}
                  >
                    Send
                  </Button>
                </Box>
              </Box>
            </Grid>
            <Grid item xs={12}>
              <Typography variant="body2">
                <strong>Request:</strong>
              </Typography>
              <textarea
                className="textarea-data"
                id="login-post"
                rows={12}
                cols={120}
                placeholder={"login post"}
                value={JSON.stringify(reportRequest, null, 2)}
              />
            </Grid>
            <Grid item xs={12}>
              <Typography variant="body2">
                <strong>Response:</strong>
              </Typography>
              <textarea
                className="textarea-data"
                id="login-response"
                rows={12}
                cols={120}
                placeholder={"login response"}
                value={JSON.stringify(reportResponse, null, 2)}
              />
            </Grid>
          </Grid>
        </ApiWidget>
      </Grid>
    </Grid>
  );
};

export default ServerInfo;
