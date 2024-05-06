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

const ApiWidget = ({ severity = "error", title, children }) => {
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
      <Box sx={{ display: "flex", columnGap: "8px", flexDirection: "row" }}>
        <IconButton
          aria-label="expand row"
          size="small"
          onClick={() => setIsOpen(!isOpen)}
        >
          {isOpen ? <KeyboardArrowUp /> : <KeyboardArrowDown />}
        </IconButton>
        {title}
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
            </Typography>
          }
          severity="info"
        >
          <Grid container spacing={1}>
            <Grid item xs={12}>
              <Box>
                <TextField
                  id="outlined-basic"
                  label="Ping server URl"
                  variant="outlined"
                  fullWidth
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
              <Box>
                <textarea
                  id="message"
                  rows={12}
                  className="textarea-data"
                  placeholder={"ping response"}
                  defaultValue={JSON.stringify(pingResponse, null, 2)}
                />
              </Box>
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
            </Typography>
          }
          severity="info"
        >
          <Box sx={{ display: "flex", columnGap: "8px" }}>
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
                Verify
              </Button>
            </Box>
          </Box>
          <Typography variant="body2">
            <strong>Request:</strong>
          </Typography>
          <textarea
            className="textarea-data"
            id="login-post"
            rows={12}
            placeholder={"login post"}
            value={JSON.stringify(loginRequest, null, 2)}
          />
          <Typography variant="body2">
            <strong>Response:</strong>
          </Typography>
          <textarea
            className="textarea-data"
            id="login-response"
            rows={12}
            placeholder={"login response"}
            value={JSON.stringify(loginResponse, null, 2)}
          />
        </ApiWidget>
      </Grid>
    </Grid>
  );
};

export default ServerInfo;
