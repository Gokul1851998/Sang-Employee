import * as React from "react";
import AppBar from "@mui/material/AppBar";
import Box from "@mui/material/Box";
import Toolbar from "@mui/material/Toolbar";
import IconButton from "@mui/material/IconButton";
import Container from "@mui/material/Container";
import Avatar from "@mui/material/Avatar";
import { useLocation, useNavigate } from "react-router-dom";
import { Hidden, Stack, Tooltip, Typography } from "@mui/material";
import Menu from "@mui/material/Menu";
import MenuItem from "@mui/material/MenuItem";
import ListItemIcon from "@mui/material/ListItemIcon";
import Divider from "@mui/material/Divider";
import Logout from "@mui/icons-material/Logout";
import MenuIcon from "@mui/icons-material/Menu";
import sangImage from "../../assets/sangsolution.png";

function Header({actionDrawer}) {
  const navigate = useNavigate();
  const userName = localStorage.getItem("userName");
  const userId = localStorage.getItem("userId");
  const location = useLocation();

  const [anchorEl, setAnchorEl] = React.useState(null);
  const open = Boolean(anchorEl);
  const handleClick = (event) => {
    setAnchorEl(event.currentTarget);
  };
  const handleClose = () => {
    setAnchorEl(null);
  };

  const handleLogout = React.useCallback(() => {
    if (userId && userName) {
      localStorage.removeItem("userId");
      localStorage.removeItem("userName");
      localStorage.removeItem("iEmployee");
    }
  }, [userId, userName]);

  const onClickLog = () => {
    handleClose();
    localStorage.removeItem("userId");
    localStorage.removeItem("userName");
    localStorage.removeItem("iEmployee");
    navigate("/");
  };
  const truncatedName = userName ? userName.slice(0, 2) : "";

  return (
    <>
      <AppBar
        position="static"
        sx={{
          bgcolor: "#1b77e9",
          boxShadow: "0px 5px 15px rgba(0, 0, 0, 0.5)", // Changed the vertical offset to 5px
        }}
      >
        <Container maxWidth="xl">
          <Toolbar disableGutters>
          <IconButton
     
            color="inherit"
            aria-label="open drawer"
             onClick={actionDrawer(true)}
            edge="start"
            sx={{
              marginRight: 2,
            }}
          >
          
            <MenuIcon />
          </IconButton>
            <img
              alt="Logo"
              src={sangImage}
              style={{marginRight:10, width: 45, height: 50 }}
            />
            <Typography
              variant="h5"
              pt={2}
              gutterBottom
              sx={{
                fontWeight: "normal",
                fontFamily: "YourCustomFont, sans-serif",
              }}
            >
              Sang Solutions
            </Typography>

            <Box
              sx={{
                flexGrow: 1,
                display: { xs: "none", md: "flex" },
                alignItems: "center",
                justifyContent: "start",
              }}
            ></Box>

            <Hidden mdUp>
              {/* Render this box for small screens */}
              <Box sx={{ flexGrow: 1 }}></Box>
            </Hidden>

            {/* <Box sx={{ flexGrow: 0 }}>
              <PowerSettingsNewIcon
                sx={{ marginRight: { md: "20px" } }}
                onClick={onClickLog}
              />
            </Box> */}

            <Box sx={{ flexGrow: 0 }}>
              {/* Render this IconButton for small screens */}
              <IconButton onClick={handleClick} sx={{ p: 0 }}>
                <Tooltip title={userName} arrow>
                  <Stack direction="row" spacing={2}>
                  <Avatar sx={{background:"gray",boxShadow: "0px 5px 15px rgba(0, 0, 0, 0.5)",}} >{userName?.substring(0, 2)?.toUpperCase()}</Avatar>
                  </Stack>
                </Tooltip>
              </IconButton>
            </Box>
          </Toolbar>
        </Container>
      </AppBar>

      <Menu
        anchorEl={anchorEl}
        id="account-menu"
        open={open}
        onClose={handleClose}
        onClick={handleClose}
        PaperProps={{
          elevation: 0,
          sx: {
            overflow: "visible",
            filter: "drop-shadow(0px 2px 8px rgba(0,0,0,0.32))",
            mt: 1.5,
            "& .MuiAvatar-root": {
              width: 32,
              height: 32,
              ml: -0.5,
              mr: 1,
            },
            "&::before": {
              content: '""',
              display: "block",
              position: "absolute",
              top: 0,
              right: 14,
              width: 10,
              height: 10,
              bgcolor: "background.paper",
              transform: "translateY(-50%) rotate(45deg)",
              zIndex: 0,
            },
          },
        }}
        transformOrigin={{ horizontal: "right", vertical: "top" }}
        anchorOrigin={{ horizontal: "right", vertical: "bottom" }}
      >
        <Divider />

        <MenuItem onClick={onClickLog}>
          <ListItemIcon>
            <Logout fontSize="small" />
          </ListItemIcon>
          Logout
        </MenuItem>
      </Menu>
    </>
  );
}
export default Header;
