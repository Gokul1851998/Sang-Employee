import * as React from "react";
import PropTypes from "prop-types";
import { useTheme } from "@mui/material/styles";
import AppBar from "@mui/material/AppBar";
import Tabs from "@mui/material/Tabs";
import Tab from "@mui/material/Tab";
import Typography from "@mui/material/Typography";
import Zoom from "@mui/material/Zoom";
import Box from "@mui/material/Box";
import Employee from "./Employee";
import EmployeeLeave from "./EmployeeLeave";
import SuperAdminReport from "../SuperAdmin/SuperAdminReport";
import { getMenuWeb } from "../../api/ApiCall";
import LeaveAuth from "./LeaveAuth";
import Loader from "../Loader/Loader";
import CompliantsAuth from "./CompliantsAuth";
import ProjectEmp from "./ProjectEmp";
import ProjectMangement from "./ProjectMangement";

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

export default function EmployeePage() {
  const theme = useTheme();
  const [value, setValue] = React.useState(0);
  const [changes, setChanges] = React.useState([]);
  const [loader, setLoader] = React.useState(false);
  const userId = localStorage.getItem("userId");

  const handleLoaderClose = () => {
    setLoader(false);
  };

  const handleLoaderOpen = () => {
    setLoader(true);
  };
  React.useEffect(() => {
    const fetchData = async () => {
      handleLoaderOpen();
      const response = await getMenuWeb({ iUser: userId });
      if (response.Status === "Success") {
        const myObject = JSON.parse(response.ResultData);
        setChanges(myObject);
      } else {
        setChanges([]);
      }
      handleLoaderClose();
    };
    fetchData();
  }, []);

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

  const fabs = changes.map((change) => {
    let contentComponent;

    switch (change.sMenuName) {
      case "DailyTask":
        contentComponent = <Employee />;
        break;
      case "DailyReport":
        contentComponent = <SuperAdminReport />;
        break;
      case "Leave Application":
        contentComponent = <EmployeeLeave />;
        break;
      case "Leave Authorization":
        contentComponent = <LeaveAuth />;
        break;
    
      case "Complaint Leave Authorization":
        contentComponent = <CompliantsAuth />;
        break;
      case "ProjectManagement":
        contentComponent = <ProjectMangement />;
        break;
      case "ProjectMangement_EMP":
        contentComponent = <ProjectEmp />;
        break;
      default:
        contentComponent = null;
    }

    return {
      color: "",
      content: (
        <Box
          sx={{
            maxWidth: "100%",
            minHeight: "100%",
            padding: theme.spacing(2), // Add padding for responsiveness
          }}
        >
          {contentComponent}
        </Box>
      ),
      label: change.sMenuName,
    };
  });

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
          indicatorColor="primary"
          textColor="white"
          variant="fullWidth"
          aria-label="action tabs example"
        >
          {changes.map((change, index) => (
            <Tab
              key={change.iMenuId}
              label={change.sMenuName}
              sx={{
                textTransform: "none",
                color: "#fff",
                backgroundColor: value === index ? "#053fc7" : "#1b77e9",
              }}
            />
          ))}
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
      <Loader open={loader} handleClose={handleLoaderClose} />
    </Box>
  );
}
