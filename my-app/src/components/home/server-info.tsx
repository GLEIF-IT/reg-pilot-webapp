import React from "react";
import {
  Typography,
  Button,
  Box,
  Grid,
  Divider,
  TextField,
} from "@mui/material";

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
        <br />
        <Divider />
      </Grid>
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
        <Box sx={{ display: "flex", columnGap: "8px" }}>
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
      </Grid>
      <Grid item xs={10}>
        <textarea
          id="message"
          rows={12}
          className="textarea-data"
          placeholder={"ping response"}
          defaultValue={JSON.stringify(pingResponse, null, 2)}
        />
      </Grid>
      <Grid item xs={12}>
        <br />
      </Grid>
      <Grid item xs={12} lg={12}>
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
      </Grid>
      <Grid item xs={10}>
      <Typography variant="body2"><strong>Request:</strong></Typography>
        <textarea
          className="textarea-data"
          id="login-post"
          rows={12}
          placeholder={"login post"}
          value={JSON.stringify(loginRequest, null, 2)}
        />
      </Grid>
      
      <Grid item xs={10}>
      <Typography variant="body2"><strong>Response:</strong></Typography>
        <textarea
          className="textarea-data"
          id="login-response"
          rows={12}
          placeholder={"login response"}
          value={JSON.stringify(loginResponse, null, 2)}
        />
      </Grid>
    </Grid>
  );
};

export default ServerInfo;
