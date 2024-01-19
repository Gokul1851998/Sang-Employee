import * as React from "react";
import PropTypes from "prop-types";
import { useTheme } from "@mui/material/styles";
import AppBar from "@mui/material/AppBar";
import Tabs from "@mui/material/Tabs";
import Tab from "@mui/material/Tab";
import Typography from "@mui/material/Typography";
import Zoom from "@mui/material/Zoom";
import Box from "@mui/material/Box";
import SuperAdminTask from "./SuperAdminTask";
import SuperAdminReport from "./SuperAdminReport";

function TabPanel(props) {
  const { children, value, index, ...other } = props;

  return (
    <Typography
      component="div"
      role="tabpanel"
      hidden={value !== index}
      id={`action-tabpanel-${index}`}
      aria-labelledby={`action-tab-${index}`}
      {...other}
    >
      {value === index && <Box sx={{ p: 3 }}>{children}</Box>}
    </Typography>
  );
}

TabPanel.propTypes = {
  children: PropTypes.node,
  index: PropTypes.number.isRequired,
  value: PropTypes.number.isRequired,
};

export default function SuperAdmin() {
  const theme = useTheme();
  const [value, setValue] = React.useState(0);

  const handleChange = (event, newValue) => {
    setValue(newValue);
  };

  const handleChangeIndex = (index) => {
    setValue(index);
  };

  const transitionDuration = {
    enter: theme.transitions.duration.enteringScreen,
    exit: theme.transitions.duration.leavingScreen,
  };

  const fabs = [
    {
      color: "",
      content: (
        <Box>
          <SuperAdminTask />
        </Box>
      ),
      label: "Task",
    },
    {
      color: "",
      content: (
        <Box sx={{ maxWidth: '100%', minHeight:'100%' }}>
        <SuperAdminReport />
      </Box>
      
      ),
      label: "Report",
    },
  ];

  return (
    <Box
      sx={{
        bgcolor: "background.paper",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
      }}
    >
      <AppBar position="static" color="default">
        <Tabs
          value={value}
          onChange={handleChange}
          indicatorColor="secondary"
          textColor="white"
          variant="fullWidth"
          aria-label="action tabs example"
        >
          <Tab
            label="Task"
            sx={{
              textTransform: "none",
              color: "#fff",
              backgroundColor: value === 0 ? "#74227a" : "#813587",
            }}
          />
          <Tab
            label="Reports"
            sx={{
              textTransform: "none",
              color: "#fff",
              backgroundColor: value === 1 ? "#74227a" : "#813587",
            }}
          />
        </Tabs>
      </AppBar>

      {fabs.map((fab, index) => (
        <Zoom
          key={fab.color}
          in={value === index}
          timeout={transitionDuration}
          style={{
            transitionDelay: `${
              value === index ? transitionDuration.exit : 0
            }ms`,
          }}
          unmountOnExit
        >
          {fab.content}
        </Zoom>
      ))}
    </Box>
  );
}
