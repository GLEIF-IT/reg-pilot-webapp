import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useIntl } from "react-intl";
import {
  Alert,
  Paper,
  IconButton,
  Typography,
  Button,
  Box,
  CircularProgress,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Fab,
  Grid,
  Collapse,
  Card,
  CardContent,
} from "@mui/material";
import KeyboardArrowDownIcon from "@mui/icons-material/KeyboardArrowDown";
import KeyboardArrowUpIcon from "@mui/icons-material/KeyboardArrowUp";
import AddIcon from "@mui/icons-material/Add";
import CollapseAlert from "../components/collapse-alert.tsx";
import { regService } from "../services/reg-server.ts";
import fakeCheckStatus from "../test/fakeCheckStatus.json";
import { useSnackbar } from "../context/snackbar.tsx";
import { useConfigMode } from "@context/configMode";

const StatusPage = ({
  selectedAid,
  serverUrl,
  statusPath,
  signatureData,
  aidName,
}) => {
  const navigate = useNavigate();
  const { formatMessage } = useIntl();
  const { openSnackbar } = useSnackbar();
  const { serverMode, extMode } = useConfigMode();
  const [data, setData] = useState<Array<any>>();
  const [loading, setLoading] = useState(false);
  const [hasError, setHasError] = useState("");

  // Function to perform the upload status request
  async function getStatus(_signatureData): Promise<any> {
    // Send signed request
    if (serverMode) {
      try {
        let sheads = new Headers();
        sheads.set("Content-Type", "application/json");
        const lRequest = {
          // headers: sheads,
          method: "GET",
          body: null,
        };
        const statusResp = await regService.getStatus(
          `${serverUrl}${statusPath}/${selectedAid}`,
          lRequest,
          extMode,
          aidName
        );

        const response_signed_data = await statusResp.json();
        if (statusResp.status >= 400) {
          throw new Error(
            `${response_signed_data?.msg ?? response_signed_data?.title}`
          );
        }
        console.log("response_signed_data", response_signed_data);
        return response_signed_data;
      } catch (error) {
        if (typeof error?.message === "string") {
          setHasError(error);
        } else {
          openSnackbar("Unable to connect with server", "error");
          setHasError({ message: "Unable to connect with server" });
        }
      }
    } else {
      const aid = "ECJLhLl1-xtrgi9SktH-8_Qc5yz2B24fT6fhdO9o3BdQ";
      if (Object.keys(fakeCheckStatus).includes(aid)) {
        const fakeStatueAid = fakeCheckStatus[aid] ?? [];
        return fakeStatueAid.map((ele) => JSON.parse(ele));
      } else {
        alert("check status fake data: no data found for aid: " + aid);
      }
    }
  }

  const getReportStatus = async (data) => {
    try {
      // Replace this with your actual fetch URL
      setLoading(true);
      let newData = await getStatus(data);
      console.log("newData");
      console.log(newData);
      setData(newData ?? []);
      setLoading(false);
    } catch (error) {
      setLoading(false);
      console.error("Error fetching data: ", error);
    }
  };

  // Simulating fetch request
  const populateReportStatus = async () => {
    if (signatureData) {
      getReportStatus(signatureData);
    } else {
      navigate("/?from=status");
      // setHasError({
      //   message: "Select Credential to Proceed",
      //   details: "Select a credential from extension to fetch report status",
      // });
    }
  };

  useEffect(() => {
    populateReportStatus();
    console.log("signatureData");
    console.log(signatureData);
  }, [signatureData]);

  return (
    <Grid container spacing={1} style={{ padding: "32px" }}>
      <Grid item xs={12}>
        <Typography variant="h3">
          {formatMessage({ id: "report.checkStatus" })}
        </Typography>
      </Grid>
      {loading && (
        <Grid item xs={12}>
          <CircularProgress
            sx={{
              margin: "auto",
            }}
          />
        </Grid>
      )}
      {hasError && (
        <Grid item xs={12}>
          <CollapseAlert
            message={
              typeof hasError === "string" ? hasError : hasError?.message
            }
            details={hasError?.details}
          />
        </Grid>
      )}
      {!hasError && (!data || data.length === 0) && !loading && (
        <Grid item xs={12}>
          <Alert
            severity="info"
            action={
              <Button
                color="inherit"
                size="small"
                onClick={() => {
                  navigate("/reports");
                }}
              >
                {formatMessage({ id: "report.uploadReport" })}
              </Button>
            }
          >
            {formatMessage({ id: "report.noReports" })}
          </Alert>
        </Grid>
      )}
      <Grid item xs={12}>
        <Box>
          {data && !loading && (
            <TableContainer component={Paper}>
              <Table aria-label="collapsible-status-table">
                <TableHead>
                  <TableRow>
                    <TableCell />
                    <TableCell>File</TableCell>
                    <TableCell>Size</TableCell>
                    <TableCell>Status</TableCell>
                    <TableCell>Message</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {data.map((item: any, index) => (
                    <Row key={`${item.filename}-${index}`} row={item} />
                  ))}
                </TableBody>
              </Table>
            </TableContainer>
          )}

          {!loading && (
            <Fab
              color="primary"
              aria-label="add"
              style={{ position: "fixed", bottom: "20px", right: "20px" }}
              onClick={() => {
                setData(
                  fakeCheckStatus[selectedAid]?.map((ele) => JSON.parse(ele)) ??
                    []
                );
              }}
            >
              <AddIcon />
            </Fab>
          )}
        </Box>{" "}
      </Grid>
    </Grid>
  );
};

function Row(props: { row: any }) {
  const { row } = props;
  const { formatMessage } = useIntl();
  const [open, setOpen] = React.useState(false);

  return (
    <React.Fragment>
      <TableRow sx={{ "& > *": { borderBottom: "unset" } }}>
        <TableCell>
          <IconButton
            aria-label="expand row"
            size="small"
            onClick={() => setOpen(!open)}
          >
            {open ? <KeyboardArrowUpIcon /> : <KeyboardArrowDownIcon />}
          </IconButton>
        </TableCell>
        <TableCell>
          {row.filename === undefined
            ? "unknown"
            : row.filename.substring(0, 75)}
        </TableCell>
        <TableCell>{row.size === undefined ? "unknown" : row.size}</TableCell>
        <TableCell
          style={
            row.status === "verified"
              ? { color: "green" }
              : row.status === "failed"
              ? { color: "red" }
              : { color: "yellow" }
          }
        >
          {row.status?.charAt(0).toUpperCase() + row.status?.slice(1)}
        </TableCell>
        <TableCell>
          {row.message === undefined ? "unknown" : row.message.substring(0, 75)}
        </TableCell>
      </TableRow>
      <TableRow>
        <TableCell style={{ paddingBottom: 0, paddingTop: 0 }} colSpan={6}>
          <Collapse in={open} timeout="auto" unmountOnExit>
            <Card sx={{ background: "lightgrey" }}>
              <CardContent>
                <Typography variant="h6" fontWeight="bold">
                  {formatMessage({ id: "report.details" })}
                </Typography>
                <Typography variant="body2" gutterBottom>
                  <strong>{formatMessage({ id: "report.filename" })}</strong>{" "}
                  {row["filename"]}
                </Typography>
                <Typography variant="body2" gutterBottom>
                  <strong>{formatMessage({ id: "report.size" })}</strong>{" "}
                  {row["size"]}
                </Typography>
                <Typography variant="body2" gutterBottom>
                  <strong>{formatMessage({ id: "report.status" })}</strong>{" "}
                  {row["status"]}
                </Typography>
                <Typography variant="body2" gutterBottom>
                  <strong>
                    {formatMessage({ id: "report.message" })}Message:
                  </strong>{" "}
                  {row["message"]}
                </Typography>
                <Typography variant="body2" gutterBottom>
                  <strong>
                    {formatMessage({ id: "report.submittedBy" })}Submitted by:
                  </strong>{" "}
                  {row["submitter"]}
                </Typography>
              </CardContent>
            </Card>
          </Collapse>
        </TableCell>
      </TableRow>
    </React.Fragment>
  );
}

export default StatusPage;
