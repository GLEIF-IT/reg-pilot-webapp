import React, { useEffect, useState } from "react";
import { Box, Grid } from "@mui/material";
import { useSnackbar } from "../context/snackbar.tsx";
import fakeLoginResponse from "../test/fakeLoginResponse.json";
import ServerInfo from "../components/home/server-info.tsx";
import { regService } from "../services/reg-server.ts";

const SettingsPage = ({
  devMode,
  selectedId,
  selectedAcdc,
  signatureData,
  extensionInstalled,
  serverUrl,
  setServerUrl,
  pingUrl,
  setPingUrl,
  loginUrl,
  setLoginUrl
}) => {
  const { openSnackbar } = useSnackbar();

  // Define the endpoint paths
  const [pingResponse, setPingResponse] = useState("");

  const [loginResponse, setLoginResponse] = useState<any>("");
  const [loginRequest, setLoginRequest] = useState<any>("");

  

  async function handlePing() {
    if (devMode) {
      openSnackbar(`<Devmode> Response received: PONG`, "success");
      return;
    }

    // Make the API request using the fetch function
    try {
      const response = (await regService.ping(pingUrl)) as string;
      setPingResponse(response);
    } catch (error) {
      openSnackbar(`Unable to connect with server at ${pingUrl}`, "error");
    }
  }

  const handleLogin = async () => {
    let vlei_cesr = signatureData?.credential;
    console.log("vlei cesr", vlei_cesr);
    console.log("signatureData", signatureData);
    console.log("Login url is", loginUrl);
    // Create the request body object
    const requestBody = {
      aid: selectedId,
      said: selectedAcdc?.sad.a.personLegalName,
      vlei: vlei_cesr,
    };

    const lRequest = {
      method: "POST",
      headers: signatureData?.headers,
      body: requestBody,
    };
    setLoginRequest(lRequest);

    if (devMode) {
      setLoginResponse(fakeLoginResponse);
      openSnackbar("<Devmode> Response received!", "success");
    } else {
      try {
        const response = await regService.postLogin(loginUrl, {
          ...lRequest,
          body: JSON.stringify(requestBody, null, 2),
        });
        setLoginResponse(response);
        console.log("logged in result", response);
        if (!response) return;

        if (response.aid === signatureData?.headers["signify-resource"]) {
        } else if (JSON.stringify(response).includes("Exception")) {
          openSnackbar(
            "Login Failed. Please pick different credential",
            "error"
          );
        } else {
          openSnackbar("Waiting for verificaiton", "warning");
        }
      } catch (error) {
        openSnackbar(`Unable to connect with server at ${loginUrl}`, "error");
      }
    }
  };

  return (
    <Grid container spacing={1} style={{ padding: "32px" }}>
      <Grid item xs={12}>
        <Box sx={{ maxHeight: "500px", overflow: "scroll", paddingX: "32px" }}>
          {extensionInstalled ? (
            <>
              {signatureData && (
                <ServerInfo
                  serverUrl={serverUrl}
                  pingUrl={pingUrl}
                  handlePing={handlePing}
                  pingResponse={pingResponse}
                  loginUrl={loginUrl}
                  handleLogin={handleLogin}
                  loginRequest={loginRequest}
                  loginResponse={loginResponse}
                  setServerUrl={setServerUrl}
                  setPingUrl={setPingUrl}
                  setLoginUrl={setLoginUrl}
                />
              )}
            </>
          ) : (
            <></>
          )}
        </Box>
      </Grid>
    </Grid>
  );
};

export default SettingsPage;
