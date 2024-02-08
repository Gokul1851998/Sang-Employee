import * as React from "react";
import Box from "@mui/material/Box";
import Paper from "@mui/material/Paper";
import "./PurchaseTable.css";
import Loader from "../Loader/Loader";
import {
  MDBBtn,
  MDBCol,
  MDBInput,
  MDBRow,
  MDBTextArea,
} from "mdb-react-ui-kit";
import "mdb-react-ui-kit/dist/css/mdb.min.css";
import "@fortawesome/fontawesome-free/css/all.min.css";
import { getCustomer, getTaskType, postDailyTask } from "../../api/ApiCall";
import Swal from "sweetalert2";
import { Autocomplete, TextField, Typography } from "@mui/material";

export default function Employee() {
  const iUser = Number(localStorage.getItem("userId"));
  const iEmployee = Number(localStorage.getItem("iEmployee"));
  const [open, setOpen] = React.useState(false);
  const [date, setDate] = React.useState(null);
  const [hour, setHour] = React.useState(0.0);
  const [start, setStart] = React.useState("00:00");
  const [end, setEnd] = React.useState("00:00");
  const [task, setTask] = React.useState("");
  const [status, setStatus] = React.useState(false);
  const [suggestionTask, setSuggestionTask] = React.useState([]);
  const [suggestionCustomer, setSuggestionCustomer] = React.useState([]);
  const [taskId, setTaskId] = React.useState(0);
  const [taskName, setTaskName] = React.useState({});
  const [customerId, setCustomerId] = React.useState(0);
  const [customer, setCustomer] = React.useState({});

  const handleClose = () => {
    setOpen(false);
  };
  const handleOpen = () => {
    setOpen(true);
  };

  const newData = () => {
    setHour(0.0);
    setStart("00:00");
    setEnd("00:00");
    setTask("");
    setTaskId(0);
    setCustomerId(0);
    setCustomer({});
    setTaskName({});
  };

  const handleData = async (e) => {
    e.preventDefault();
    const startTime = new Date(`2000-01-01 ${start}`);
    const endTime = new Date(`2000-01-01 ${end}`);
    if (startTime >= endTime) {
      Swal.fire({
        icon: "error",
        title: "Invalid Time Range",
        text: "End Time must be greater than Start Time",
      });
      return;
    }
    Swal.fire({
      text: "Are you sure you want to continue?",
      showCancelButton: true,
      confirmButtonColor: "#3085d6",
      cancelButtonColor: "#d33",
      confirmButtonText: "Yes",
    }).then(async (result) => {
      if (result.value) {
        handleOpen()
        const response = await postDailyTask({
          iId: 0,
          iEmployee,
          sDate: date,
          sTask: task,
          sStart_Time: start,
          sEnd_Time: end,
          NoOf_Hrs: Number(hour),
          iUser,
          iTaskType: taskId,
          iCustomer: customerId,
        });
        if (response?.Status === "Success") {
          Swal.fire({
            title: "Updated",
            text: "Task Updated!",
            icon: "success",
            showConfirmButton: false,
            timer: 1500,
          });
          newData();
        }
        handleClose()
      }
    });
  };

  const calculateHours = () => {
    // Calculate the time difference between start and end
    const startTime = new Date(`2000-01-01 ${start}`);
    const endTime = new Date(`2000-01-01 ${end}`);
    const timeDiff = endTime - startTime;
    const hours = timeDiff / 1000 / 60 / 60;
    return hours > 0 ? hours : 0;
  };

  React.useEffect(() => {
    if (start !== "" && end !== "") {
      const calculatedHours = calculateHours();
      let timeInHour = calculatedHours.toFixed(2);

      if (timeInHour !== 0) {
        setHour(timeInHour);
      } else {
        setHour(0.0);
      }
    }
    const currentDate = new Date();
    const year = currentDate.getFullYear();
    const month = String(currentDate.getMonth() + 1).padStart(2, "0"); // Months are 0-based
    const day = String(currentDate.getDate()).padStart(2, "0");
    const formattedDate = `${year}-${month}-${day}`;
    setDate(formattedDate);
  }, [start, end]);

  React.useEffect(() => {
    const fetchData = async () => {
      handleOpen()
      const response1 = await getTaskType();
      if (response1.Status === "Success") {
        const myObject1 = JSON.parse(response1.ResultData);
        setSuggestionTask(myObject1);
      }
      const response2 = await getCustomer();
      if (response2.Status === "Success") {
        const myObject2 = JSON.parse(response2.ResultData);
        setSuggestionCustomer(myObject2);
      }
      handleClose()
    };
    fetchData();
  }, []);
  return (
 
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
        mt: 5,
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
                    value={start}
                    id="form3Example7"
                    label="Start Time"
                    onChange={(e) => setStart(e.target.value)}
                    type="time"
                  />
                </MDBCol>
                <MDBCol>
                  <MDBInput
                    value={end}
                    id="form3Example8"
                    label="End Time"
                    onChange={(e) => setEnd(e.target.value)}
                    type="time"
                  />
                </MDBCol>
              </MDBRow>
              <MDBRow className="mb-4">
                <MDBCol>
                  <MDBInput
                    required
                    id="form3Example1"
                    label="Date"
                    value={date}
                    type="date"
                    readOnly
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
                  <Autocomplete
                    id={`size-small-filled-assetType`}
                    size="small"
                    value={taskName}
                    onChange={(event, newValue) => {
                      setTaskId(newValue?.iId || 0), setTaskName(newValue);
                    }}
                    options={suggestionTask.map((data) => ({
                      sName: data.sName,
                      sCode: data.sCode,
                      iId: data?.iId,
                    }))}
                    filterOptions={(options, { inputValue }) => {
                      return options.filter((option) =>
                        option.sName
                          .toLowerCase()
                          .includes(inputValue.toLowerCase())
                      );
                    }}
                    autoHighlight
                    getOptionLabel={(option) =>
                      option && option.sName ? option.sName : ""
                    }
                    renderOption={(props, option) => (
                      <li {...props}>
                        <div
                          className=""
                          style={{
                            display: "flex",
                            justifyContent: "space-between",
                            width: "100%",
                          }}
                        >
                          <Typography
                            style={{
                              marginRight: "auto",
                              fontSize: "12px",
                              fontWeight: "normal",
                            }}
                          >
                            {option.sName}
                          </Typography>
                        </div>
                      </li>
                    )}
                    renderInput={(params) => (
                      <TextField
                        required
                        label="Task Type"
                        {...params}
                        inputProps={{
                          ...params.inputProps,
                          autoComplete: "new-password", // disable autocomplete and autofill
                          style: {
                            borderWidth: "1px",
                            borderColor: "#ddd",
                            borderRadius: "10px",
                            fontSize: "15px",
                            height: "20px",
                            paddingLeft: "6px",
                          },
                        }}
                        
                      />
                    )}
                    style={{ width: `auto` }}
                  />
                </MDBCol>
                <MDBCol>
                  <Autocomplete
                    id={`size-small-filled-assetType`}
                    size="small"
                    value={customer}
                    onChange={(event, newValue) => {
                      setCustomerId(newValue?.iId || 0), setCustomer(newValue);
                    }}
                    options={suggestionCustomer.map((data) => ({
                      sName: data.sName,
                      sCode: data.sCode,
                      iId: data?.iId,
                    }))}
                    filterOptions={(options, { inputValue }) => {
                      return options.filter((option) =>
                        option.sName
                          .toLowerCase()
                          .includes(inputValue.toLowerCase())
                      );
                    }}
                    autoHighlight
                    getOptionLabel={(option) =>
                      option && option.sName ? option.sName : ""
                    }
                    renderOption={(props, option) => (
                      <li {...props}>
                        <div
                          className=""
                          style={{
                            display: "flex",
                            justifyContent: "space-between",
                            width: "100%",
                          }}
                        >
                          <Typography
                            style={{
                              marginRight: "auto",
                              fontSize: "12px",
                              fontWeight: "normal",
                            }}
                          >
                            {option.sName}
                          </Typography>
                        </div>
                      </li>
                    )}
                    renderInput={(params) => (
                      <TextField
                        required
                        label="Customer"
                        {...params}
                        inputProps={{
                          ...params.inputProps,
                          autoComplete: "new-password", // disable autocomplete and autofill
                          style: {
                            borderWidth: "1px",
                            borderColor: "#ddd",
                            borderRadius: "10px",
                            fontSize: "15px",

                            height: "20px",
                            paddingLeft: "6px",
                          },
                        }}
                      />
                    )}
                    style={{ width: `auto` }}
                  />
                </MDBCol>
              </MDBRow>
              <MDBTextArea
                required
                value={task}
                label="Task"
                maxLength={300}
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
  
      <Loader open={open} handleClose={handleClose} />
    </Box>
  );
}
