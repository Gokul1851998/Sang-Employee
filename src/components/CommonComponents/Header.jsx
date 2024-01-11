import * as React from "react";
import AppBar from "@mui/material/AppBar";
import Box from "@mui/material/Box";
import Toolbar from "@mui/material/Toolbar";
import IconButton from "@mui/material/IconButton";
import Container from "@mui/material/Container";
import Avatar from "@mui/material/Avatar";
import PowerSettingsNewIcon from "@mui/icons-material/PowerSettingsNew";
import { useNavigate } from "react-router-dom";
import { Stack, Tooltip, Typography } from "@mui/material";

function Header() {
  const navigate = useNavigate();
  const userName = localStorage.getItem("userName");
  const admin = Number(localStorage.getItem("admin"));
  const [theme, setTheme] = React.useState("");
  const [title, setTitle] = React.useState("");
  React.useEffect(() => {
    if (admin === 1) {
      setTheme("#8c99e0");
      setTitle("Sang Admin");
    } else if (admin === 0) {
      setTheme("#1b77e9");
      setTitle("Sang Employee");
    } else if (admin === 2) {
      setTheme("#813587");
      setTitle("Sang Super Admin");
    }
  }, [admin]);

  const onClickLog = () => {
    localStorage.removeItem("userId");
    localStorage.removeItem("userName");
    localStorage.removeItem("admin");
    localStorage.removeItem("iEmployee");
    navigate("/");
  };
  const truncatedName = userName.slice(0, 2);
  return (
    <>
      <AppBar
        position="static"
        sx={{
          bgcolor: theme,
          boxShadow: "0px 5px 15px rgba(0, 0, 0, 0.5)", // Changed the vertical offset to 5px
        }}
      >
        <Container maxWidth="xl">
          <Toolbar disableGutters>
            <Avatar
              alt="Logo"
              src="http://103.120.178.195:82/Sang_solutions/assets/images/sang_logo.png"
              sx={{ mr: 2, width: 60, height: 60 }}
            />
            <Typography
              variant="h4"
              pt={2}
              gutterBottom
              sx={{
                fontWeight: "normal",
                fontFamily: "YourCustomFont, sans-serif",
              }}
            >
              {title}
            </Typography>

            <Box
              sx={{
                flexGrow: 1,
                display: { xs: "none", md: "flex" },
                alignItems: "center",
                justifyContent: "start",
              }}
            ></Box>

            <Box sx={{ flexGrow: 0 }}>
              <PowerSettingsNewIcon
                sx={{ marginRight: "20px" }}
                onClick={onClickLog}
              />
            </Box>

            <Box sx={{ flexGrow: 0 }}>
              <IconButton sx={{ p: 0 }}>
                <Tooltip title={userName} arrow>
                  <Stack direction="row" spacing={2}>
                    <Avatar>{truncatedName}</Avatar>
                  </Stack>
                </Tooltip>
              </IconButton>
            </Box>
          </Toolbar>
        </Container>
      </AppBar>
    </>
  );
}
export default Header;
