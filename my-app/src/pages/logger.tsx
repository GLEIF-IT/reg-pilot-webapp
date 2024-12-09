import React from "react";
import { useIntl } from "react-intl";
import {
  Alert,
  Paper,
  IconButton,
  Typography,
  Box,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Grid,
  Collapse,
  Card,
  CardContent,
} from "@mui/material";
import KeyboardArrowDownIcon from "@mui/icons-material/KeyboardArrowDown";
import KeyboardArrowUpIcon from "@mui/icons-material/KeyboardArrowUp";

const Logger = ({ logger }) => {
  return (
    <Grid container spacing={1} style={{ padding: "4px 16px" }}>
      <Grid item xs={12}>
        <Typography variant="h3">{"Session Info"}</Typography>
      </Grid>

      <Grid item xs={12}>
        <Box>
          {logger?.length ? (
            <TableContainer component={Paper} data-testid="logger--grid">
              <Table aria-label="collapsible-status-table">
                <TableHead>
                  <TableRow>
                    <TableCell />
                    <TableCell>Origin</TableCell>
                    <TableCell>Time</TableCell>
                    <TableCell>Status</TableCell>
                    <TableCell>Message</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {logger.map((item: any, index) => (
                    <Row key={`${item.time}-${index}`} row={item} />
                  ))}
                </TableBody>
              </Table>
            </TableContainer>
          ) : null}
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
            data-testid="status--details"
            aria-label="expand row"
            size="small"
            onClick={() => setOpen(!open)}
          >
            {open ? <KeyboardArrowUpIcon /> : <KeyboardArrowDownIcon />}
          </IconButton>
        </TableCell>
        <TableCell>
          {row.origin === undefined ? "unknown" : row.origin}
        </TableCell>
        <TableCell>{row.time === undefined ? "unknown" : row.time}</TableCell>
        <TableCell style={row.success ? { color: "green" } : { color: "red" }}>
          {row.success ? "Success" : "Error"}
        </TableCell>
        <TableCell>
          {row.msg === undefined ? "unknown" : row.msg.substring(0, 75)}
        </TableCell>
      </TableRow>
      <TableRow>
        <TableCell style={{ paddingBottom: 0, paddingTop: 0 }} colSpan={6}>
          <Collapse in={open} timeout="auto" unmountOnExit>
            <Alert severity={row.success ? "success" : "error"}>
              {row?.origin ? (
                <>
                  <Typography variant="body2">
                    <strong>{"Origin"}</strong>
                  </Typography>
                  <Typography variant="body2">
                    {row.origin}
                  </Typography>
                </>
              ) : null}
              {row?.req ? (
                <>
                  <Typography variant="body2">
                    <strong>{"Request"}</strong>
                  </Typography>
                  <Typography variant="body2">
                    {JSON.stringify(row["req"])}
                  </Typography>
                </>
              ) : null}
              {row?.msg ? (
                <>
                  <Typography variant="body2">
                    <strong>{"Message"}</strong>
                  </Typography>
                  <Typography variant="body2">
                    {row.msg}
                  </Typography>
                </>
              ) : null}
              {row?.res ? (
                <>
                  <Typography variant="body2">
                    <strong>{"Response"}</strong>
                  </Typography>
                  <Typography variant="body2">
                    {JSON.stringify(row["res"], undefined, 6)}
                  </Typography>
                </>
              ) : null}
            </Alert>
          </Collapse>
        </TableCell>
      </TableRow>
    </React.Fragment>
  );
}

export default Logger;
