import * as React from "react";
import PropTypes from "prop-types";
import { alpha } from "@mui/material/styles";
import Box from "@mui/material/Box";
import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableCell from "@mui/material/TableCell";
import TableContainer from "@mui/material/TableContainer";
import TableHead from "@mui/material/TableHead";
import TablePagination from "@mui/material/TablePagination";
import TableRow from "@mui/material/TableRow";
import TableSortLabel from "@mui/material/TableSortLabel";
import Toolbar from "@mui/material/Toolbar";
import Typography from "@mui/material/Typography";
import Paper from "@mui/material/Paper";
import Checkbox from "@mui/material/Checkbox";
import IconButton from "@mui/material/IconButton";
import Tooltip from "@mui/material/Tooltip";
import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete";
import AddIcon from "@mui/icons-material/Add";
import { visuallyHidden } from "@mui/utils";
import "./PurchaseTable.css";

import Loader from "../Loader/Loader";
import { Button, ButtonGroup, TextField } from "@mui/material";
import PrintIcon from "@mui/icons-material/Print";
import CloseIcon from "@mui/icons-material/Close";

import SendIcon from "@mui/icons-material/Send";
import Stack from "@mui/material/Stack";
import {
  MDBBtn,
  MDBCheckbox,
  MDBCol,
  MDBIcon,
  MDBInput,
  MDBRow,
  MDBTextArea,
} from "mdb-react-ui-kit";
import "mdb-react-ui-kit/dist/css/mdb.min.css";
import "@fortawesome/fontawesome-free/css/all.min.css";
import { postDailyTask } from "../../api/ApiCall";
import Swal from "sweetalert2";

export default function Employee() {
  const iUser = Number(localStorage.getItem("userId"));
  const iEmployee = Number(localStorage.getItem("iEmployee"));
  const [open, setOpen] = React.useState(false);
  const [date, setDate] = React.useState(null);
  const [hour, setHour] = React.useState();
  const [start, setStart] = React.useState('00:00');
  const [end, setEnd] = React.useState('00:00');
  const [task, setTask] = React.useState('');

  const handleClose = () => {
    setOpen(false);
  };
  const handleOpen = () => {
    setOpen(true);
  };

  const newData=()=>{
    setDate('')
    setHour('')
    setStart('00:00')
    setEnd('00:00')
    setTask('')
  }

  const handleData = async(e)=>{
    e.preventDefault();
    const formattedDate = formatDate(date);
    Swal.fire({
      text: "Are you sure you want to continue?",
      showCancelButton: true,
      confirmButtonColor: "#3085d6",
      cancelButtonColor: "#d33",
      confirmButtonText: "Yes",
    }).then(async (result) => {
      if (result.value) {
        const response = await postDailyTask({
          iId: 0,
          iEmployee,
          sDate: formattedDate,
          sTask: task, 
          sStart_Time: start,
          sEnd_Time: end,
          NoOf_Hrs: hour,
          iUser
         })
          if(response?.Status === "Success"){
            Swal.fire({
              title: "Updated",
              text: "Task Updated!",
              icon: "success",
              showConfirmButton: false,
              timer: 1500,
            });
            newData()
          }
      }
    });
   
  }

  function formatDate(inputDate) {
    const dateObject = new Date(inputDate);
    
    const year = dateObject.getFullYear();
    const month = String(dateObject.getMonth() + 1).padStart(2, '0');
    const day = String(dateObject.getDate()).padStart(2, '0');
  
    return `${year}/${month}/${day}`;
  }

  return (
    <Box
      sx={{
        margin: 0,
        background: "#1b77e9",
        height: "200px",
        boxShadow: "0px 5px 15px rgba(0, 0, 0, 0.5)",
        display: "flex", // Make it a flex container
        alignItems: "center", // Center vertically
        justifyContent: "center", // Center horizontally
      }}
    >
      <Box
        sx={{
          width: "auto",
          zIndex: 1,
          textAlign: "center", // Center content within this Box
        }}
      >
        <Paper
          sx={{
            width: "100%",
            mt: 50,
            boxShadow: "0px 5px 15px rgba(0, 0, 0, 0.3)",
            textAlign: "center",
            display: "inline-block", // Add this to prevent the Paper from taking full width
          }}
        >
          <Box
            sx={{
              p: 5,
            }}
          >
            <form onSubmit={handleData}>
              <MDBRow className="mb-4">
                <MDBCol>
                  <MDBInput
                  required
                    id="form3Example1"
                    label="Date"
                    value={date}
                    onChange={(e) => setDate(e.target.value)}
                    type="date"
                  />
                </MDBCol>
                <MDBCol>
                  <MDBInput
                   required
                    id="form3Example2"
                    value={hour}
                    label="No of Hrs"
                    onChange={(e) => setHour(Number(e.target.value))}
                    type="number"
                  />
                </MDBCol>
              </MDBRow>
              <MDBRow className="mb-4">
                <MDBCol>
                  <MDBInput
                   required
                  value={start}
                    id="form3Example7"
                    label="Start Time"
                    onChange={(e) => setStart(e.target.value)}
                    type="time"
                  />
                </MDBCol>
                <MDBCol>
                  <MDBInput
                   required
                  value={end}
                    id="form3Example8"
                    label="End Time"
                    onChange={(e) => setEnd(e.target.value)}
                    type="time"
                  />
                </MDBCol>
              </MDBRow>
              <MDBTextArea
               required
              value={task}
                label="Task"
                id="textAreaExample"
                onChange={(e) => setTask(e.target.value)}
                rows={4}
              />

             

              <MDBBtn type="submit" className="mb-4 mt-4" block>
                Submit
              </MDBBtn>

              
            </form>
          </Box>
        </Paper>
      </Box>
      {/* <Loader open={open} handleClose={handleClose} /> */}
    </Box>
  );
}
