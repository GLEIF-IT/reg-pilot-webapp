import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useIntl } from "react-intl";
import { Alert, Typography, Button, Box, Grid } from "@mui/material";
import { UploadFile } from "@mui/icons-material";
import { regService } from "../services/reg-server.ts";
import { useSnackbar } from "../context/snackbar.tsx";
import { useConfigMode } from "@context/configMode";
import { generateFileDigest } from "@services/utils.ts";
import fakeFileUpload from "../test/fakeFileUpload.json";

const uploadPath = "/upload";
const acceptedTypes = [
  "application/zip",
  "application/x-zip-compressed",
  "multipart/x-zip",
  "application/zip-compressed",
  "application/octet-stream",
];

type TSubmitStatus = "loading" | "success" | "error" | "";

const getFakeFileResponse = async () => {
  return new Promise((resolve, reject) => {
    setTimeout(() => {
      resolve(fakeFileUpload);
    }, 3000);
  });
};

const ReportsPage = ({ serverUrl, selectedAid, selectedAcdc, aidName, logger, setLogger }) => {
  const { formatMessage } = useIntl();
  const { serverMode, extMode } = useConfigMode();
  const navigate = useNavigate();
  const { openSnackbar } = useSnackbar();

  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [error, setError] = useState("");
  const [filename, setFilename] = useState("");
  const [submitStatus, setSubmitStatus] = useState<TSubmitStatus>("");

  const setFile = (file: File) => {
    if (!file) {
      setSelectedFile(null);
      return;
    }
    if (!acceptedTypes.includes(file.type)) {
      setSelectedFile(null);
      setError(`${file.name} is not a zip file. \n Please select a zip file.`);
      return;
    }
    setError("");
    setSubmitStatus("");
    setSelectedFile(file);
    setFilename(file.name);
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
  async function upload(aid: string, said: string, report: File): Promise<any> {
    if (!serverMode) {
      const fakeFile = await getFakeFileResponse();
      setSubmitStatus("success");
      return fakeFile;
    }

    const reader = new FileReader();
    reader.onload = async function () {
      const signedZipBuf = reader?.result as ArrayBuffer;
      const signedZipDig = await generateFileDigest(signedZipBuf);
      const formData = new FormData();
      const ctype = "application/zip";
      const blob = new Blob([signedZipBuf], { type: ctype });
      formData.append("upload", blob, report.name);
      const lRequest = {
        method: "POST",
        body: formData,
      };
      const report_url = `${serverUrl}${uploadPath}/${aid}/${signedZipDig}`;
      try {
        const response = await regService.postReport(report_url, lRequest, extMode, aidName);
        const response_signed_data = await response.json();
        console.log("upload response", response_signed_data);

        if (response.status >= 400) {
          setLogger([
            ...logger,
            {
              origin: report_url,
              req: lRequest,
              res: response_signed_data,
              success: false,
              msg: response_signed_data?.detail ?? response_signed_data?.title,
              time: new Date().toLocaleString(),
            },
          ]);
          throw new Error(`${response_signed_data?.detail ?? response_signed_data?.title}`);
        }
        setLogger([
          ...logger,
          {
            origin: report_url,
            req: lRequest,
            res: response_signed_data,
            success: response_signed_data?.status === "failed" ? false : true,
            msg: response_signed_data?.message,
            time: new Date().toLocaleString(),
          },
        ]);
        openSnackbar(
          response_signed_data?.message,
          response_signed_data?.status === "failed" ? "warning" : "success",
          "reports--upload-msg"
        );
        setSubmitStatus("success");
        return response_signed_data;
      } catch (error) {
        console.error("Error uploading report", error);
        setLogger([
          ...logger,
          {
            origin: report_url,
            req: lRequest,
            res: error,
            success: false,
            msg: error?.message,
            time: new Date().toLocaleString(),
          },
        ]);
        openSnackbar(error?.message, "error", "reports--upload-msg");
        setSubmitStatus("error");
        setSelectedFile(null);
      }
    };
    reader.onerror = function (error) {
      console.error("Error reading file:", error);
      openSnackbar(error?.message, "error", "reports--upload-msg");
    };
    reader.readAsArrayBuffer(report);
  }

  const handleSubmit = async () => {
    setSubmitStatus("loading");

    await upload(selectedAid, selectedAcdc, selectedFile!);
  };

  return (
    <Grid container spacing={1} style={{ padding: "32px" }}>
      <Grid item xs={12}>
        <Typography variant="h3">{formatMessage({ id: "report.upload" })}</Typography>
      </Grid>
      {error && (
        <Grid item xs={12}>
          <Alert severity="error">{error}</Alert>
        </Grid>
      )}
      {submitStatus === "error" && (
        <Grid item xs={12}>
          <Alert
            severity="error"
            data-testid="reports--upload-error-msg"
            action={
              <Button
                color="inherit"
                size="small"
                onClick={() => {
                  navigate("/status");
                }}
              >
                {formatMessage({ id: "report.checkStatus" })}
              </Button>
            }
          >
            {formatMessage({ id: "report.failed" })} {filename}
          </Alert>
        </Grid>
      )}
      {submitStatus === "success" && (
        <Grid item xs={12}>
          <Alert
            severity="success"
            data-testid="reports--upload-success-msg"
            action={
              <Button
                color="inherit"
                size="small"
                data-testid="check--status"
                onClick={() => {
                  navigate("/status");
                }}
              >
                {formatMessage({ id: "report.checkStatus" })}
              </Button>
            }
          >
            {formatMessage({ id: "report.success" })} {filename}
          </Alert>
        </Grid>
      )}
      {submitStatus === "loading" && (
        <Grid item xs={12}>
          <Alert severity="info">
            {formatMessage({ id: "status.uploading" })} {selectedFile.name}
          </Alert>
        </Grid>
      )}
      {!error && selectedFile && !submitStatus && (
        <Grid item xs={12}>
          <Alert data-testid="reports--load-success-msg" severity="success">
            Succesfully loaded report {filename}
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
                Drag and drop a file here or <br /> click the button to select a file.
              </p>
            </>
          )}
          <input
            type="file"
            id="file-input"
            style={{ display: "none" }}
            data-testid="reports--file-input"
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
            data-testid="reports--submit"
            variant="contained"
            color="primary"
            size="small"
            onClick={handleSubmit}
            disabled={!selectedFile}
          >
            {formatMessage({ id: "report.submit" })}
          </Button>
        </Box>
      </Grid>
    </Grid>
  );
};

export default ReportsPage;
