import React, { useEffect, useState } from "react";
import { Box, Grid } from "@mui/material";
import { trySettingVendorUrl } from "signify-polaris-web";
import { useSnackbar } from "../context/snackbar.tsx";
import fakeLoginResponse from "../test/fakeLoginResponse.json";
import Hero from "../components/home/hero.tsx";
import ExtensionInfo from "../components/home/ext-info.tsx";
import ServerInfo from "../components/home/server-info.tsx";
import SignifyInfo from "../components/home/signify-info.tsx";

const extConf = "https://api.npoint.io/52639f849bb31823a8c0";

const HomePage = ({
  devMode,
  selectedId,
  selectedAcdc,
  handleCredSignin,
  removeData,
  signatureData,
  extensionInstalled,
  serverUrl,
  setServerUrl,
}) => {
  const [vendorConf, setVendorConf] = useState(false);
  const [modalError, setModalError] = useState("");
  const { openSnackbar } = useSnackbar();

  // Define the endpoint paths
  const [pingUrl, setPingUrl] = useState("");
  const [pingResponse, setPingResponse] = useState("");

  const [loginUrl, setLoginUrl] = useState("");
  const [loginResponse, setLoginResponse] = useState<any>("");
  const [loginRequest, setLoginRequest] = useState<any>("");

  useEffect(() => {
    setPingUrl(serverUrl + "/ping");
    setLoginUrl(serverUrl + "/login");
  }, [serverUrl]);

  const handleSettingVendorUrl = async (url) => {
    await trySettingVendorUrl(url);
    setVendorConf(true);
  };

  // Function to perform the ping request
  async function handlePing() {
    // Make the API request using the fetch function
    try {
      const response = await fetch(pingUrl);
      if (response) {
        const responseData = await response.text();
        setPingResponse(responseData);
        return responseData;
      }
    } catch (error) {
      openSnackbar(`Unable to connect with server at ${pingUrl}`, "error");
    }
  }

  // Function to perform the login request
  async function postLogin(
    aid: string,
    said: string,
    vlei: string
  ): Promise<any> {
    console.log("Login url is", loginUrl);

    // Create the request body object
    const requestBody = {
      aid,
      said,
      vlei,
    };

    const lRequest = {
      method: "POST",
      headers: signatureData?.headers,
      body: requestBody,
    };
    setLoginRequest(lRequest);

    if (devMode) {
      setLoginResponse(fakeLoginResponse);
      return fakeLoginResponse;
    } else {
      try {
        const response = await fetch(loginUrl, {
          ...lRequest,
          body: JSON.stringify(requestBody, null, 2),
        });
        const responseData = await response.text();
        setLoginResponse(responseData);
        return responseData;
      } catch (error) {
        openSnackbar(`Unable to connect with server at ${loginUrl}`, "error");
      }
    }
  }

  const handleLogin = async () => {
    let vlei_cesr = signatureData?.credential;
    console.log("vlei cesr", vlei_cesr);
    console.log("signatureData", signatureData);
    let logged_in = await postLogin(
      selectedId,
      selectedAcdc?.sad.a.personLegalName,
      vlei_cesr
    );
    console.log("logged in result", logged_in);
    if (!logged_in) return;

    if (logged_in.aid === signatureData?.headers["signify-resource"]) {
      //   setCstatus("Connected");
      setModalError("");
      // await checkHeaderSignatures(getSelectedAid().prefix,getSelectedAid().name);
    } else if (JSON.stringify(logged_in).includes("Exception")) {
      //   setCstatus("Failed");
      setModalError("Login Failed. Please pick different credential");
    } else {
      // setStatus("Connecting");
      openSnackbar("Waiting for verificaiton", "warning");
    }
  };

  return (
    <Grid container spacing={1} style={{ padding: "32px" }}>
      <Grid item xs={12}>
        <Hero />
      </Grid>
      <Grid item xs={4}>
        <ExtensionInfo
          installed={extensionInstalled}
          signedDataReceived={Boolean(signatureData)}
          vendorConfigued={vendorConf}
          error={modalError}
          removeData={removeData}
          devMode={devMode}
          handleCredSignin={handleCredSignin}
          signatureData={signatureData}
          handleConfigExt={() => handleSettingVendorUrl(extConf)}
        />
      </Grid>
      <Grid item xs={8}>
        <Box sx={{ maxHeight: "500px", overflow: "scroll", paddingX: "32px" }}>
          {extensionInstalled ? (
            <>
              {(vendorConf || devMode) && signatureData && (
                <SignifyInfo
                  selectedId={selectedId}
                  signatureData={signatureData}
                />
              )}
              {(vendorConf || devMode) && signatureData && (
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

export default HomePage;
