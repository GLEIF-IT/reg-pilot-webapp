import React, { useState, useEffect } from "react";
import { Box, Grid } from "@mui/material";
import { useSnackbar } from "../context/snackbar.tsx";
import fakeLoginResponse from "../test/fakeLoginResponse.json";
import ServerInfo from "../components/home/server-info.tsx";
import { regService } from "../services/reg-server.ts";
import fakeCheckStatus from "../test/fakeCheckStatus.json";
import fakeFileUpload from "../test/fakeFileUpload.json";

const getFakeFileResponse = async () => {
  return new Promise((resolve, reject) => {
    setTimeout(() => {
      resolve(fakeFileUpload);
    }, 2000);
  });
};

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
  setLoginUrl,
}) => {
  const { openSnackbar } = useSnackbar();

  // Define the endpoint paths
  const [pingResponse, setPingResponse] = useState("");

  const [loginRequest, setLoginRequest] = useState<any>("");
  const [loginResponse, setLoginResponse] = useState<any>("");

  const [verifyUrl, setVerifyUrl] = useState(`${serverUrl}/verify/headers`);
  const [verifyRequest, setVerifyRequest] = useState<any>("");
  const [verifyResponse, setVerifyResponse] = useState<any>("");

  const [statusUrl, setStatusUrl] = useState(`${serverUrl}/status/${selectedId}`);
  const [statusRequest, setStatusRequest] = useState<any>("");
  const [statusResponse, setStatusResponse] = useState<any>("");

  const [reportUrl, setReportUrl] = useState(`${serverUrl}/upload/${selectedId}/${selectedAcdc?.anchor?.pre}`);
  const [reportRequest, setReportRequest] = useState<any>("");
  const [reportResponse, setReportResponse] = useState<any>("");
  
  useEffect(() => {
    handleSetRequests();
  }, [])

  const handleSetRequests = () => {
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
    setVerifyRequest({method: "GET", headers: signatureData?.headers});
    setStatusRequest({method: "GET", headers: signatureData?.headers});
    setReportRequest({method: "POST", headers: signatureData?.headers});
  };

  async function handlePing() {
    if (devMode) {
      setPingResponse("PONG");
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
    if (devMode) {
      setLoginResponse(fakeLoginResponse);
      openSnackbar("<Devmode> Response received!", "success");
      return;
    }

    try {
      const response = await regService.postLogin(loginUrl, {
        ...loginRequest,
        body: JSON.stringify(loginRequest.body, null, 2),
      });
      setLoginResponse(response);
      console.log("logged in result", response);
      if (!response) return;

      if (
        response?.aid !== signatureData?.headers["signify-resource"] ||
        JSON.stringify(response).includes("Exception")
      ) {
        openSnackbar("Login Failed. Please pick different credential", "error");
      } else {
        openSnackbar("Credential verified!", "success");
      }
    } catch (error) {
      openSnackbar(`Unable to connect with server at ${loginUrl}`, "error");
    }
  };

  const handleVerify = async () => {
    if (devMode) {
      setVerifyResponse("");
      openSnackbar("<Devmode> Response received!", "success");
      return;
    }

    // try {
    //   const response = await regService.postLogin(loginUrl, {
    //     ...loginRequest,
    //     body: JSON.stringify(loginRequest.body, null, 2),
    //   });
    //   setLoginResponse(response);
    //   console.log("logged in result", response);
    //   if (!response) return;

    //   if (
    //     response?.aid !== signatureData?.headers["signify-resource"] ||
    //     JSON.stringify(response).includes("Exception")
    //   ) {
    //     openSnackbar("Login Failed. Please pick different credential", "error");
    //   } else {
    //     openSnackbar("Credential verified!", "success");
    //   }
    // } catch (error) {
    //   openSnackbar(`Unable to connect with server at ${loginUrl}`, "error");
    // }
  };

  const handleStatus = async () => {
    if (devMode) {
      const aid = "ECJLhLl1-xtrgi9SktH-8_Qc5yz2B24fT6fhdO9o3BdQ";
      if (Object.keys(fakeCheckStatus).includes(aid)) {
        const fakeStatueAid = fakeCheckStatus[aid] ?? [];
        setStatusResponse(fakeStatueAid.map((ele) => JSON.parse(ele)));
      } else {
        alert("check status fake data: no data found for aid: " + aid);
      }
      openSnackbar("<Devmode> Response received!", "success");
      return;
    }

    // try {
    //   const response = await regService.postLogin(loginUrl, {
    //     ...loginRequest,
    //     body: JSON.stringify(loginRequest.body, null, 2),
    //   });
    //   setLoginResponse(response);
    //   console.log("logged in result", response);
    //   if (!response) return;

    //   if (
    //     response?.aid !== signatureData?.headers["signify-resource"] ||
    //     JSON.stringify(response).includes("Exception")
    //   ) {
    //     openSnackbar("Login Failed. Please pick different credential", "error");
    //   } else {
    //     openSnackbar("Credential verified!", "success");
    //   }
    // } catch (error) {
    //   openSnackbar(`Unable to connect with server at ${loginUrl}`, "error");
    // }
  };

  const handleReportUpload = async () => {
    if (devMode) {
      const fakeFile = await getFakeFileResponse();
      setReportResponse(fakeFile);
    }

    // try {
    //   const response = await regService.postLogin(loginUrl, {
    //     ...loginRequest,
    //     body: JSON.stringify(loginRequest.body, null, 2),
    //   });
    //   setLoginResponse(response);
    //   console.log("logged in result", response);
    //   if (!response) return;

    //   if (
    //     response?.aid !== signatureData?.headers["signify-resource"] ||
    //     JSON.stringify(response).includes("Exception")
    //   ) {
    //     openSnackbar("Login Failed. Please pick different credential", "error");
    //   } else {
    //     openSnackbar("Credential verified!", "success");
    //   }
    // } catch (error) {
    //   openSnackbar(`Unable to connect with server at ${loginUrl}`, "error");
    // }
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
                  verifyUrl={verifyUrl}
                  setVerifyUrl={setVerifyUrl}
                  verifyRequest={verifyRequest}
                  verifyResponse={verifyResponse}
                  handleVerify={handleVerify}
                  statusUrl={statusUrl}
                  setStatusUrl={setStatusUrl}
                  statusRequest={statusRequest}
                  statusResponse={statusResponse}
                  handleStatus={handleStatus}
                  reportUrl={reportUrl}
                  setReportUrl={setReportUrl}
                  reportRequest={reportRequest}
                  reportResponse={reportResponse}
                  handleReportUpload={handleReportUpload}
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
