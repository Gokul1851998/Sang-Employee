import React, { useEffect, useState } from "react";
import AddIcon from "@mui/icons-material/Add";
import MuiAlert from "@mui/material/Alert";
import CloseIcon from "@mui/icons-material/Close";
import SaveIcon from "@mui/icons-material/Save";
import DoneIcon from '@mui/icons-material/Done';
import {
  Autocomplete,
  Box,
  Button,
  Stack,
  TextField,
  Typography,
  Zoom,
} from "@mui/material";

import { MDBRow, MDBCol, MDBInput, MDBTextArea } from "mdb-react-ui-kit";

import Loader from "../Loader/Loader";

import ErrorMessage from "../ErrorMessage/ErrorMessage";
import {
  getComplaintType,
  getComplaints,
  postComplaints,
} from "../../api/ApiCall";
import Swal from "sweetalert2";

export default function ProjectModal({
  isOpen,
  handleCloseModal,
  data,
  handleRowData,
  rowIndex,
}) {
  const [taskName, setTaskName] = useState("");
  const [day, setDay] = useState("");
  const [startDate, setStartDate] = useState("");
  const [cutOfDate, setCutOfDate] = useState("");
  const [suggestionType, setSuggestionType] = React.useState([]);
  const [open, setOpen] = React.useState(false);
  const [dataId, setDataId] = useState(0);
  const [warning, setWarning] = useState(false);
  const [message, setMessage] = useState("");
  const [newRowIndex, setNewRowIndex] = useState(0)
  const modalStyle = {
    display: isOpen ? "block" : "none",
  };

  const iUser = Number(localStorage.getItem("userId"));

  const buttonStyle = {
    textTransform: "none",
    color: `#fff`,
    backgroundColor: `#1b77e9`,
    boxShadow: "0px 5px 15px rgba(0, 0, 0, 0.3)",
  };

  const fetchData = async () => {
    handleOpen();
    if (data !== 0) {
      setNewRowIndex(rowIndex)
      setDataId(data?.iId);
      setTaskName(data?.TaskName);
      setDay(data?.Days);
      setCutOfDate(data?.CutOffDate?.substring(0, 10));
      setStartDate(data?.StartDate?.substring(0, 10));
    } else {
      handleClear();
    }
    handleClose();
  };

  useEffect(() => {
    fetchData();
  }, [isOpen]);

  React.useEffect(() => {
    const fetchData = async () => {
      // handleOpen();
      // const response1 = await getComplaintType();
      // if (response1.Status === "Success") {
      //   const myObject1 = JSON.parse(response1.ResultData);
      //   setSuggestionType(myObject1);
      // }
      // handleClose();
    };
    fetchData();
  }, []);

  const handleSave = (e) => {
    e.preventDefault();
    const emptyFields = [];
    if (!taskName) emptyFields.push("Task Name");
    if (!day) emptyFields.push("Days");
    if (!startDate) emptyFields.push("Start Date");
    if (!cutOfDate) emptyFields.push("Cut Off Date");

    if (emptyFields.length > 0) {
      handleOpenAlert();
      setMessage(`Please fill : ${emptyFields.join(", ")}.`);
      return;
    }
    const saveData = {
      iId: dataId,
      CutOffDate: cutOfDate,
      StartDate: startDate,
      Days: Number(day),
      sProgress:"",
      TaskName:taskName
    };
    Swal.fire({
      text: "Are you sure you want to continue?",
      showCancelButton: true,
      confirmButtonColor: "#3085d6",
      cancelButtonColor: "#d33",
      confirmButtonText: "Yes",
    }).then(async (result) => {
      if (result.value) {
        handleRowData(saveData, newRowIndex);
        handleAllClear();
      }
    });
  };

  const handleClose = () => {
    setOpen(false);
  };
  const handleOpen = () => {
    setOpen(true);
  };

  const handleCloseAlert = (event, reason) => {
    if (reason === "clickaway") {
      return;
    }
    setWarning(false);
  };

  const handleOpenAlert = () => {
    setWarning(true);
  };

  const handleClear = () => {
    const currentDate = new Date();
    const year = currentDate.getFullYear();
    const month = String(currentDate.getMonth() + 1).padStart(2, "0");
    const day = String(currentDate.getDate()).padStart(2, "0");
    const formattedDate = `${year}-${month}-${day}`;
    setNewRowIndex(-1)
    setDataId(0);
    setStartDate("");
    setCutOfDate("");
    setDay("");
    setTaskName("");
  };

  const handleAllClear = () => {
    handleCloseModal();
    handleClear();
  };

  const getCurrentDate = () => {
    const currentDate = new Date();
    const year = currentDate.getFullYear();
    let month = currentDate.getMonth() + 1;
    month = month < 10 ? `0${month}` : month;
    let day = currentDate.getDate();
    day = day < 10 ? `0${day}` : day;
    return `${year}-${month}-${day}`;
  };

  return (
    <div>
      <div
        className={`modal-backdrop fade ${isOpen ? "show" : ""}`}
        style={{
          display: isOpen ? "block" : "none",
          backgroundColor: "rgba(0, 0, 0, 0.7)",
        }}
      ></div>

      <Zoom in={isOpen} timeout={isOpen ? 400 : 300}>
        <div
          className={`modal ${isOpen ? "modal-open" : ""}`}
          style={modalStyle}
        >
          <div className="modal-dialog modal-dialog-centered modal-md">
            <div className="modal-content">
              <form>
                <Stack
                  direction="row"
                  spacing={1}
                  padding={2}
                  justifyContent="flex-end"
                >
                  <Button
                    onClick={handleSave}
                    variant="contained"
                    startIcon={<DoneIcon />}
                    style={buttonStyle}
                  >
                    Ok
                  </Button>
                  <Button
                    onClick={handleAllClear}
                    variant="contained"
                    startIcon={<CloseIcon />}
                    style={buttonStyle}
                  >
                    Close
                  </Button>
                </Stack>
                <Box
                  sx={{
                    width: "auto",
                    marginTop: 1,
                    padding: 3,
                    zIndex: 1,
                    backgroundColor: "#ffff",
                    borderRadius: 2,
                  }}
                >
                  <MDBRow className="mb-4">
                    <MDBCol>
                      <MDBInput
                        required
                        value={taskName}
                        id="form6Example3"
                        type="text"
                        label="Task Name"
                        onChange={(e) => setTaskName(e.target.value)}
                        labelStyle={{
                          fontSize: "15px",
                        }}
                        autoComplete="off"
                      />
                    </MDBCol>
                    <MDBCol>
                      <MDBInput
                        required
                        value={day}
                        id="form6Example6"
                        type="number"
                        label="Days"  
                        min={0}
                        onChange={(e) => setDay(e.target.value)}
                        labelStyle={{
                          fontSize: "15px",
                        }}
                        autoComplete="off"
                      />
                    </MDBCol>
                  </MDBRow>

                  <MDBRow className="mb-4">
                    <MDBCol>
                      <MDBInput
                        required
                        value={startDate}
                        id="form6Example3"
                        type="date"
                        label="Start Date"
                        onChange={(e) => setStartDate(e.target.value)}
                        labelStyle={{
                          fontSize: "15px",
                        }}
                        autoComplete="off"
                      />
                    </MDBCol>
                    <MDBCol>
                      <MDBInput
                        required
                        value={cutOfDate}
                        id="form6Example6"
                        type="date"
                        label="Cut Off Date"
                        onChange={(e) => setCutOfDate(e.target.value)}
                        labelStyle={{
                          fontSize: "15px",
                        }}
                        autoComplete="off"
                      />
                    </MDBCol>
                  </MDBRow>

                
                </Box>
              </form>
            </div>
          </div>
        </div>
      </Zoom>

      <Loader open={open} handleClose={handleClose} />
      <ErrorMessage
        open={warning}
        handleClose={handleCloseAlert}
        message={message}
      />
    </div>
  );
}
