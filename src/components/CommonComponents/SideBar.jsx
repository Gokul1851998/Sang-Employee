import * as React from 'react';
import Box from '@mui/material/Box';
import Drawer from '@mui/material/Drawer';
import Button from '@mui/material/Button';
import List from '@mui/material/List';
import Divider from '@mui/material/Divider';
import ListItem from '@mui/material/ListItem';
import ListItemButton from '@mui/material/ListItemButton';
import ListItemIcon from '@mui/material/ListItemIcon';
import ListItemText from '@mui/material/ListItemText';
import InboxIcon from '@mui/icons-material/MoveToInbox';
import MailIcon from '@mui/icons-material/Mail';
import ReportIcon from "@mui/icons-material/Report";
import TaskIcon from "@mui/icons-material/Task";
import CalendarMonthIcon from "@mui/icons-material/CalendarMonth";
import EventAvailableIcon from "@mui/icons-material/EventAvailable";
import AssignmentIcon from "@mui/icons-material/Assignment";
import QueueIcon from "@mui/icons-material/Queue";
import AdminPanelSettingsIcon from '@mui/icons-material/AdminPanelSettings';
import AddModeratorIcon from '@mui/icons-material/AddModerator';
import Header from '../CommonComponents/Header';
import { getMenuWeb } from '../../api/ApiCall';
import Loader from '../Loader/Loader';
import Employee from '../Employee/Employee';
import ComplaintsAuth from '../Employee/CompliantsAuth';
import SuperAdminReport from '../SuperAdmin/SuperAdminReport';
import EmployeeLeave from '../Employee/EmployeeLeave';
import LeaveAuth from '../Employee/LeaveAuth';
import ProjectMangement from '../Employee/ProjectMangement';
import ComplaintsReport from '../Employee/ComplaintsReport';
import ProjectManagementEMP from '../Employee/ProjectManagementEMP';
import ProjectMangementEMP from '../Employee/ProjectManagementEMP';
import AccountBalanceWalletIcon from '@mui/icons-material/AccountBalanceWallet';
import AccountBalanceIcon from '@mui/icons-material/AccountBalance';
import EmployeeExpense from '../Employee/Expense/EmployeeExpense';
import PaymentsIcon from '@mui/icons-material/Payments';
import Payments from '../Employee/Payments/Payments';

export default function SideBar() {
  const [open, setOpen] = React.useState(false);
  const [loader, setLoader] = React.useState(false);
  const [changes, setChanges] = React.useState([]);
  const [page, setPage] = React.useState(10)
  const userId = localStorage.getItem("userId");

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

  const handleLoaderClose = () => {
    setLoader(false);
  };

  const handleLoaderOpen = () => {
    setLoader(true);
  };

  const toggleDrawer = (newOpen) => () => {
    setOpen(newOpen);
  };

  const handlePages =(id)=>{
    setPage(id)
  }

  const DrawerList = (
    <>  
    <Box sx={{ width: 'auto', backgroundColor:"#1b77e9" , color:"white" }} role="presentation" onClick={toggleDrawer(false)}>
      <List>
        {changes.map((text, index) => (
          <ListItem key={text.iMenuId} disablePadding>
            <ListItemButton style={{background:text.iMenuId === page? "#0b59ad" : null}} onClick={()=>handlePages(text.iMenuId)}>
              <ListItemIcon sx={{ color:"white" }} >  {text.iMenuId === 0 ? (
                    <InboxIcon />
                  ) : text.iMenuId === 13 ? (
                    <AdminPanelSettingsIcon />
                  ) : text.iMenuId === 11 ? (
                    <ReportIcon />
                  ) : text.iMenuId === 10 ? (
                    <TaskIcon />
                  ) : text.iMenuId === 1 ? (
                    <CalendarMonthIcon />
                  ) : text.iMenuId === 3 ? (
                    <EventAvailableIcon />
                  ) : text.iMenuId === 14 ? (
                    <AssignmentIcon />
                  ) : text.iMenuId === 15 ? (
                    <QueueIcon />
                  ): text.iMenuId === 17 ? (
                    <AccountBalanceIcon />
                  ): text.iMenuId === 16 ? (
                    <AccountBalanceWalletIcon />
                  ): text.iMenuId === 18 ? (
                    <PaymentsIcon />
                  ) : (
                    <MailIcon />
                  )} </ListItemIcon>
              <ListItemText primary={text.sMenuName} />
            </ListItemButton>
          </ListItem>
        ))}
      </List>
  
    </Box>
    </>
  );

  return (
    <div>
      <Header actionDrawer={toggleDrawer} />
      <Drawer  open={open} onClose={toggleDrawer(false)} sx={{ '& .MuiDrawer-paper': { backgroundColor: '#1b77e9' } }}>
        {DrawerList}
      </Drawer>
       {page === 10? (
         <Employee />
       ): page === 12? (
        <ComplaintsReport />
       ) : page === 13? (
        <ComplaintsAuth />
       ) : page === 11? (
        <SuperAdminReport />
       ) : page === 1? (
        <EmployeeLeave />
       ) : page === 3? (
        <LeaveAuth />
       ) :  page === 14? (
        <ProjectMangement id={0} />
       ) :  page === 15? (
        <ProjectMangementEMP id={1} />
       ):  page === 16? (
        <EmployeeExpense  type={0} />
       ): page === 17 ? (
        <EmployeeExpense type={1} />
      ): page === 18 ? (
        <Payments />
      ): null}
      <Loader open={loader} handleClose={handleLoaderClose} />
    </div>
  );
}