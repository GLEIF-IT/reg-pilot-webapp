import * as React from "react";
import { useIntl } from "react-intl";
import Popover from "@mui/material/Popover";
import Box from "@mui/material/Box";
import IconButton from "@mui/material/IconButton";
import Typography from "@mui/material/Typography";
import ButtonGroup from "@mui/material/ButtonGroup";
import {
  WbCloudyOutlined,
  CloudOffOutlined,
  ExtensionOffOutlined,
  ExtensionOutlined,
  InfoOutlined,
} from "@mui/icons-material";
import { useConfigMode } from "@context/configMode";

export function Config() {
  const { formatMessage } = useIntl();
  const { serverMode, toggleServerMode, extMode, toggleExtMode } =
    useConfigMode();
  const [anchorEl, setAnchorEl] = React.useState<HTMLButtonElement | null>(
    null
  );

  const handleClick = (event: React.MouseEvent<HTMLButtonElement>) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  const open = Boolean(anchorEl);
  const id = open ? "config-popover" : undefined;

  return (
    <div>
      <ButtonGroup
        sx={{ border: "1px solid midnightblue", backgroundColor: "mintcream" }}
        variant="outlined"
        aria-label="Basic button group"
      >
        <IconButton data-testid="demo--extension-mode" onClick={toggleExtMode}>
          {extMode ? (
            <ExtensionOutlined color="success" />
          ) : (
            <ExtensionOffOutlined color="warning" />
          )}
        </IconButton>
        <IconButton onClick={toggleServerMode}>
          {serverMode ? (
            <WbCloudyOutlined color="success" />
          ) : (
            <CloudOffOutlined color="warning" />
          )}
        </IconButton>
        <IconButton aria-describedby={id} onClick={handleClick} size="small">
          <InfoOutlined color="info" />
        </IconButton>
      </ButtonGroup>

      <Popover
        id={id}
        open={open}
        anchorEl={anchorEl}
        onClose={handleClose}
        anchorOrigin={{
          vertical: "bottom",
          horizontal: "left",
        }}
      >
        <Box sx={{ p: 2 }}>
          <Box>
            <Typography fontWeight="bold">
              {formatMessage({ id: "comm.heading" })}
            </Typography>
          </Box>
          <Typography>
            <CloudOffOutlined color="warning" />{" "}
            {formatMessage({ id: "comm.serverDisabled" })}
          </Typography>
          <Typography>
            <WbCloudyOutlined color="success" />{" "}
            {formatMessage({ id: "comm.serverEnabled" })}
          </Typography>
          <Typography>
            <ExtensionOffOutlined color="warning" />{" "}
            {formatMessage({ id: "comm.extEnabled" })}
          </Typography>
          <Typography>
            <ExtensionOutlined color="success" />{" "}
            {formatMessage({ id: "comm.extDisabled" })}
          </Typography>
        </Box>
      </Popover>
    </div>
  );
}
