import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Alert, Typography, Button, Box, Grid } from "@mui/material";
import { UploadFile } from "@mui/icons-material";

import fakeFileUpload from "../test/fakeFileUpload.json";

const uploadPath = "/upload";

const ReportsPage = ({ devMode, serverUrl, selectedId, selectedAcdc }) => {
  const navigate = useNavigate();

  const [selectedFile, setSelectedFile] = useState(null);
  const [errorUpload, setErrorUpload] = useState("");
  const [submitResult, setSubmitResult] = useState("");
  const setFile = (file: any) => {
    const acceptedTypes = [
      "application/zip",
      "application/x-zip-compressed",
      "multipart/x-zip",
      "application/zip-compressed",
      "application/octet-stream",
    ];

    if (!acceptedTypes.includes(file.type)) {
      setSelectedFile(null);
      setErrorUpload(
        `${file.name} is not a zip file. \n Please select a zip file.`
      );
      setSubmitResult("");
      alert("file is not a zip file");
      return;
    }
    setErrorUpload("");
    setSubmitResult("");
    setSelectedFile(file);
  };

  const handleFileSelect = (event: any) => {
    let file = event.target.files[0];
    setFile(file);
  };

  const handleDrop = (event: any) => {
    event.preventDefault();
    let file = event.dataTransfer.files[0];
    setFile(file);
  };

  const handleDragOver = (event: any) => {
    event.preventDefault();
  };

  // Function to perform the upload request
  async function upload(
    aid: string,
    name: string,
    said: string,
    report: string
  ): Promise<any> {
    const formData = new FormData();
    formData.append("upload", report);

    // // Send signed request
    console.log("Form data is", formData.get("upload"));

    if (!devMode) {
      const response_signed = await client.signedFetch(
        serverUrl,
        `${uploadPath}/${aid}/${said}`,
        "POST",
        formData,
        name
      );
      const response_signed_data = await response_signed.json();
      console.log("upload response", response_signed_data);

      // Return the response data
      return response_signed_data;
    } else {
      return fakeFileUpload;
    }
  }

  const handleSubmit = async () => {
    // alert("handling report submit")
    // Add your upload logic her
    setSubmitResult("uploading");
    //wait 2 seconds
    //await new Promise(r => setTimeout(r, 2000));
    await upload(
      selectedId,
      selectedAcdc.sad.a.personLegalName,
      selectedAcdc.anchor.pre,
      selectedFile
    );

    setSubmitResult(`done|${selectedFile?.name}`);
    // await new Promise(r => setTimeout(r, 2000));
    // setSubmitResult(`fail|${selectedFile.name}` )
    setSelectedFile(null);
  };

  return (
    <Grid container spacing={1} style={{ padding: "32px" }}>
      <Grid item xs={12}>
        <Typography variant="h3">Upload your report</Typography>
      </Grid>
      {errorUpload !== "" && (
        <Grid item xs={12}>
          <Alert severity="error">{errorUpload}</Alert>
        </Grid>
      )}
      {submitResult.split("|")[0] === "fail" && (
        <Grid item xs={12}>
          <Alert
            severity="error"
            action={
              <Button
                color="inherit"
                size="small"
                onClick={() => {
                  setSubmitResult("");
                  navigate("/status");
                }}
              >
                Check Status
              </Button>
            }
          >
            Failed submitted the report {submitResult.split("|")[1]}
          </Alert>
        </Grid>
      )}
      {submitResult.split("|")[0] === "done" && (
        <Grid item xs={12}>
          <Alert
            severity="success"
            action={
              <Button
                color="inherit"
                size="small"
                onClick={() => {
                  setSubmitResult("");
                  navigate("/status");
                }}
              >
                Check Status
              </Button>
            }
          >
            Successfuly submitted the report {submitResult.split("|")[1]}
          </Alert>
        </Grid>
      )}
      {submitResult === "uploading" && (
        <Grid item xs={12}>
          <Alert severity="info">Uploading {selectedFile.name}</Alert>
        </Grid>
      )}
      {errorUpload === "" && selectedFile !== null && submitResult === "" && (
        <Grid item xs={12}>
          <Alert severity="success">
            Succesfully loaded report {selectedFile.name}
            {<br />}
            Submit your report next.
          </Alert>
        </Grid>
      )}

      <Grid item xs={12}>
        <Box
          sx={{
            width: "100%",
            height: "200px",
            border: "2px dashed gray",
            borderRadius: "4px",
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            flexDirection: "column",
            p: 1,
          }}
          onDrop={handleDrop}
          onDragOver={handleDragOver}
        >
          {selectedFile ? (
            <>
              <UploadFile /> <p>Selected File: {selectedFile.name}</p>
            </>
          ) : (
            <>
              <UploadFile />
              <p>
                Drag and drop a file here or <br /> click the button to select a
                file.
              </p>
            </>
          )}
          <input
            type="file"
            id="file-input"
            style={{ display: "none" }}
            onChange={handleFileSelect}
          />
          <label htmlFor="file-input">
            <Button size="small" variant="contained" component="span">
              Select File
            </Button>
          </label>
        </Box>
        <Box>
          <Button
            variant="contained"
            color="primary"
            size="small"
            onClick={async () => {
              await handleSubmit();
            }}
            disabled={!selectedFile}
          >
            Submit Report
          </Button>
        </Box>
      </Grid>
    </Grid>
  );
};

export default ReportsPage;
