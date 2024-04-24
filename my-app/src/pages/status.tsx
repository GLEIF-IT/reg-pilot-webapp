import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
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
import fakeCheckStatus from "../test/fakeCheckStatus.json";
import { useSnackbar } from "../context/snackbar.tsx";

const StatusPage = ({
  selectedAid,
  selectedAcdc,
  devMode,
  serverUrl,
  statusPath,
}) => {
  const navigate = useNavigate();
  const { openSnackbar } = useSnackbar();
  const [data, setData] = useState<Array<any>>();
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    // Simulating fetch request
    const tblData = async () => {
      try {
        // Replace this with your actual fetch URL
        setLoading(true);
        // alert("Selected aid is " + selectedAid)
        // alert("Selected aid name is " + JSON.stringify(selectedAcdc.sad.a.personLegalName))
        let newData = await checkUpload(
          selectedAid,
          selectedAcdc.sad.a.personLegalName
        );
        console.log(
          "New data converted type and data",
          typeof newData,
          newData
        );
        setData(newData ?? []);
        setLoading(false);
      } catch (error) {
        console.error("Error fetching data: ", error);
      }
    };

    if (!selectedAcdc || !selectedAid) {
      openSnackbar("No credential selected! redirecting to Home...", "warning");
      navigate("/");
    } else {
      tblData();
    }
  }, []);

  // Function to perform the upload request
  async function checkUpload(aid, name): Promise<any> {
    // Send signed request
    if (!devMode) {
      try {
        const response_signed = await client.signedFetch(
          serverUrl,
          `${statusPath}/${aid}`,
          "GET",
          null,
          name
        );
        const response_signed_data = await response_signed.json();
        console.log(response_signed_data);
        return response_signed_data;
      } catch (error) {
        openSnackbar("Unable to connect with server", "error");
      }
    } else {
      if (Object.keys(fakeCheckStatus).includes(aid)) {
        const fakeStatueAid = fakeCheckStatus[aid] ?? [];
        return fakeStatueAid.map((ele) => JSON.parse(ele));
      } else {
        alert("check status fake data: no data found for aid: " + aid);
      }
    }
  }

  return (
    <Grid container spacing={1} style={{ padding: "32px" }}>
      <Grid item xs={12}>
        <Typography variant="h3">Check Status</Typography>
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
      {(!data || data.length === 0) && !loading && (
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
                Upload Report
              </Button>
            }
          >
            You don't have any reports yet.
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
                  {data.map((item: any) => (
                    <Row key={item.filename} row={item} />
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
                  Report Details
                </Typography>
                <Typography variant="body2" gutterBottom>
                  <strong>Filename:</strong> {row["filename"]}
                </Typography>
                <Typography variant="body2" gutterBottom>
                  <strong>Size:</strong> {row["size"]}
                </Typography>
                <Typography variant="body2" gutterBottom>
                  <strong>Status:</strong> {row["status"]}
                </Typography>
                <Typography variant="body2" gutterBottom>
                  <strong>Message:</strong> {row["message"]}
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
