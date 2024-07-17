import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  AppBar,
  Toolbar,
  IconButton,
  Button,
  List,
  ListItem,
  ListItemText,
  Drawer,
  Box,
  ListItemIcon,
} from "@mui/material";
import {
  Circle,
  FileUpload,
  Settings,
  Menu,
  GridView,
  Rule,
  WbCloudyOutlined,
  CloudOffOutlined,
  ExtensionOffOutlined,
  ExtensionOutlined,
} from "@mui/icons-material";
import { Config } from "../components/config";
import { useConfigMode } from "@context/configMode";

const SIDEBAR = [
  { path: "/", title: "Home", icon: <GridView /> },
  { path: "/status", title: "Status", icon: <Rule /> },
  { path: "/reports", title: "Reports", icon: <FileUpload /> },
  { path: "/settings", title: "Settings", icon: <Settings /> },
];

const AppLayout = () => {
  const navigate = useNavigate();
  const { devMode } = useConfigMode();
  const [drawerOpen, setDrawerOpen] = useState(false);

  const toggleDrawer = (open: any) => (event: any) => {
    if (
      event.type === "keydown" &&
      (event.key === "Tab" || event.key === "Shift")
    ) {
      return;
    }
    setDrawerOpen(open);
  };
  const moveToPage = (path: string) => {
    setDrawerOpen(false);
    navigate(path);
  };

  return (
    <>
      <AppBar
        position="fixed"
        sx={{ width: "100%", background: "white", color: "black" }}
      >
        <Toolbar
          sx={{
            display: "flex",
            justifyContent: "space-between",
          }}
        >
          <IconButton
            edge="start"
            color="inherit"
            aria-label="menu"
            onClick={toggleDrawer(!drawerOpen)}
          >
            <Menu />
          </IconButton>
          <Box
            onClick={toggleDrawer(!drawerOpen)}
            sx={{
              ":hover": {
                cursor: "pointer",
              },
            }}
          ></Box>
          <Box>
            <Button
              sx={{
                marginLeft: "auto",
                backgroundColor: "lightblue",
                color: "black",
                "&:hover": {
                  color: "white",
                  backgroundColor: "midnightblue",
                },
              }}
              size="small"
              variant="contained"
              startIcon={
                <Circle
                  sx={{
                    color: devMode ? "green" : "red",
                  }}
                />
              }
            >
              Dev Mode
            </Button>
            <Config />
          </Box>
        </Toolbar>
      </AppBar>
      <Drawer open={drawerOpen} onClose={toggleDrawer(false)}>
        <Box
          role="presentation"
          onClick={toggleDrawer(false)}
          onKeyDown={toggleDrawer(false)}
          sx={{ width: "300px" }}
        >
          <List>
            {SIDEBAR.map((element) => (
              <ListItem
                key={element.title}
                onClick={() => moveToPage(element.path)}
                sx={{
                  "&:hover": {
                    backgroundColor: "lightblue",
                    cursor: "pointer",
                  },
                }}
              >
                <ListItemIcon>{element.icon}</ListItemIcon>
                <ListItemText primary={element.title} />
              </ListItem>
            ))}
          </List>
        </Box>
      </Drawer>
    </>
  );
};

export default AppLayout;
