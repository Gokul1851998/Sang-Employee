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
import SearchIcon from "@mui/icons-material/Search";
import CloseIcon from "@mui/icons-material/Close";
import "@fortawesome/fontawesome-free/css/all.min.css";
import {
  getCustomer,
  getDailyTaskReport,
  getTaskType,
  postDailyTask,
} from "../../api/ApiCall";
import WorkHistoryIcon from "@mui/icons-material/WorkHistory";
import Swal from "sweetalert2";
import {
  Autocomplete,
  Button,
  IconButton,
  Stack,
  TextField,
  Typography,
} from "@mui/material";
import ErrorMessage from "../ErrorMessage/ErrorMessage";
import { format } from "date-fns";
import AdminList from "../AdminHome/AdminList";

const buttonStyle = {
  textTransform: "none", // Set text transform to none for normal case
  color: "#FFFFFF", // Set text color
  backgroundColor: "#1b77e9", // Set background color
};

export default function Employee() {
  const iUser = Number(localStorage.getItem("userId"));
  const iEmployee = Number(localStorage.getItem("iEmployee"));
  const userName = localStorage.getItem("userName");
  const [open, setOpen] = React.useState(false);
  const [date, setDate] = React.useState(null);
  const [hour, setHour] = React.useState(0.0);
  const [start, setStart] = React.useState("00:00");
  const [end, setEnd] = React.useState("00:00");
  const [task, setTask] = React.useState("");
  const [history, setHistory] = React.useState(false);
  const [suggestionTask, setSuggestionTask] = React.useState([]);
  const [suggestionCustomer, setSuggestionCustomer] = React.useState([]);
  const [taskId, setTaskId] = React.useState(0);
  const [taskName, setTaskName] = React.useState({});
  const [customerId, setCustomerId] = React.useState(0);
  const [customer, setCustomer] = React.useState({});
  const [from, setFrom] = React.useState("");
  const [to, setTo] = React.useState("");
  const [data, setData] = React.useState([]);
  const [taskId2, setTaskId2] = React.useState(0);
  const [taskName2, setTaskName2] = React.useState({});
  const [customerId2, setCustomerId2] = React.useState(0);
  const [customer2, setCustomer2] = React.useState({});
  const [warning, setWarning] = React.useState(false);
  const [message, setMessage] = React.useState();

  const handleClose = () => {
    setOpen(false);
  };
  const handleOpen = () => {
    setOpen(true);
  };

  const handleWarningClose = () => {
    setWarning(false);
  };
  const handleWarningOpen = () => {
    setWarning(true);
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
        handleOpen();
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
        handleClose();
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
      handleOpen();
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
      handleClose();
      const currentDate = new Date();
      const year = currentDate.getFullYear();
      const month = String(currentDate.getMonth() + 1).padStart(2, "0"); // Months are 0-based
      const day = String(currentDate.getDate()).padStart(2, "0");
      const formattedDate = `${year}-${month}-${day}`;
      setFrom(formattedDate);
      setTo(formattedDate);
    };
    fetchData();
  }, []);

  React.useEffect(() => {
    setData([]);
  }, [history]);

  const handleSubmit = async () => {
    handleOpen();
    if (from && to && iEmployee) {
      const FromDate = formatDate(from);
      const ToDate = formatDate(to);
      const response = await getDailyTaskReport({
        iEmployee: iEmployee,
        FromDate,
        ToDate,
        iCustomer: customerId2,
        iTaskType: taskId2,
      });
      if (response.Status === "Success") {
        const myObject = JSON.parse(response.ResultData);
        if (myObject && myObject.Table.length) {
          setData(myObject.Table);
        } else {
          setMessage(`No data found`);
          handleWarningOpen();
          setData([]);
        }
      }
    } else {
      setMessage(`Something went wrong`);
      handleWarningOpen();
    }
    handleClose();
  };

  function formatDate(inputDate) {
    const dateObject = new Date(inputDate);

    const year = dateObject.getFullYear();
    const month = String(dateObject.getMonth() + 1).padStart(2, "0");
    const day = String(dateObject.getDate()).padStart(2, "0");

    return `${year}/${month}/${day}`;
  }

  const handleClear = async () => {
    setData([]);
    const currentDate = new Date();
    const year = currentDate.getFullYear();
    const month = String(currentDate.getMonth() + 1).padStart(2, "0"); // Months are 0-based
    const day = String(currentDate.getDate()).padStart(2, "0");
    const formattedDate = `${year}-${month}-${day}`;
    setFrom(formattedDate);
    setTo(formattedDate);
    setCustomer2({});
    setCustomerId2(0);
    setTaskName2({});
    setTaskId2(0);
  };

  return (
    <Box
      sx={{
        width: "auto",
        zIndex: 1,
        textAlign: "center", // Center content within this Box
        margin: 2,
      }}
    >
      {!history ? (
        <>
          <Button
            size="small"
            onClick={() => setHistory(true)}
            sx={{
              backgroundColor: "#3b71ca",
              color: "white",
              float: "right",
              pl: 1,
              pr: 1,
              textTransform: "none", // Set to 'none' to avoid automatic capitalization
              "&:hover": {
                backgroundColor: "#1f4e8a", // Your desired hover color
              },
            }}
          >
            Task History
          </Button>
          <Paper
            sx={{
              width: "100%",
              mt: 2,
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
                      style={{
                        cursor: "text",
                        color: "inherit",
                        backgroundColor: "transparent",
                        border: "none",
                        borderBottom: "1px solid #ced4da",
                      }}
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
                        setCustomerId(newValue?.iId || 0),
                          setCustomer(newValue);
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
        </>
      ) : (
        <>
          <Stack
            direction={{ xs: "column", md: "row" }}
            alignItems="center"
            spacing={2}
            padding={2}
            sx={{
              mx: "auto", // Centers the stack by setting the left and right margins to auto
              boxShadow: "0px 5px 15px rgba(0, 0, 0, 0.3)",
              bgcolor: "#ffff",
              borderRadius: 2,
              overflow: "hidden",
              width: { xs: "100%", sm: 1150 }, // Here you set the fixed width for small devices and up
              maxWidth: "100%", // Ensures the stack does not exceed the width of its container
            }}
          >
            <TextField
              required
              type="date"
              size="small"
              className="form-control"
              value={from}
              inputProps={{
                maxLength: 150,
              }}
              onChange={(e) => {
                const inputValue = e.target.value;
                setFrom(inputValue);
              }}
              label="From Date"
              variant="outlined"
              InputLabelProps={{
                shrink: true, // Set shrink to true when there is a value
              }}
              InputProps={{
                inputProps: {
                  max: format(new Date(), "yyyy-MM-dd"), // Set max to the current date
                },
              }}
              sx={{
                width: 200, // Specify a fixed width
                minWidth: 200, // Ensure it doesn't shrink below this width
              }}
            />
            <TextField
              required
              type="date"
              size="small"
              className="form-control"
              value={to}
              onChange={(e) => {
                const inputValue = e.target.value;
                setTo(inputValue);
              }}
              label="To Date"
              variant="outlined"
              InputLabelProps={{
                shrink: true, // Set shrink to true when there is a value
              }}
              InputProps={{
                inputProps: {
                  max: format(new Date(), "yyyy-MM-dd"), // Set max to the current date
                },
              }}
              sx={{
                width: 200, // Specify a fixed width
                minWidth: 200, // Ensure it doesn't shrink below this width
              }}
            />
            <Autocomplete
              id="size-small-filled"
              size="small"
              value={taskName2}
              onChange={(event, newValue) => {
                setTaskId2(newValue?.iId || 0), setTaskName2(newValue);
              }}
              options={suggestionTask.map((data) => ({
                sName: data.sName,
                sCode: data.sCode,
                iId: data?.iId,
              }))}
              filterOptions={(options, { inputValue }) => {
                return options.filter((option) =>
                  option.sName.toLowerCase().includes(inputValue.toLowerCase())
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
                  className="form-control"
                  {...params}
                  inputProps={{
                    ...params.inputProps,
                    autoComplete: "new-password", // disable autocomplete and autofill
                  }}
                  sx={{ minWidth: 200 }} // Set the width for Autocomplete
                />
              )}
            />

            <Autocomplete
              id="size-small-filled"
              size="small"
              value={customer2}
              onChange={(event, newValue) => {
                setCustomerId2(newValue?.iId || 0), setCustomer2(newValue);
              }}
              options={suggestionCustomer.map((data) => ({
                sName: data.sName,
                sCode: data.sCode,
                iId: data?.iId,
              }))}
              filterOptions={(options, { inputValue }) => {
                return options.filter((option) =>
                  option.sName.toLowerCase().includes(inputValue.toLowerCase())
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
                  className="form-control"
                  {...params}
                  inputProps={{
                    ...params.inputProps,
                    autoComplete: "new-password", // disable autocomplete and autofill
                  }}
                  sx={{ minWidth: 200 }} // Set the width for Autocomplete
                />
              )}
            />

            <Button
              size="small"
              onClick={handleSubmit}
              sx={{
                backgroundColor: "#3b71ca",
                color: "white",
                float: "right",
                pl: 1,
                pr: 1,
                textTransform: "none", // Set to 'none' to avoid automatic capitalization
                "&:hover": {
                  backgroundColor: "#1f4e8a", // Your desired hover color
                },
              }}
            >
              <SearchIcon sx={{ fontSize: "1.4rem" }} />
            </Button>

            <Button
              size="small"
              onClick={handleClear}
              sx={{
                backgroundColor: "#3b71ca",
                color: "white",
                float: "right",
                pl: 1,
                pr: 1,
                textTransform: "none", // Set to 'none' to avoid automatic capitalization
                "&:hover": {
                  backgroundColor: "#1f4e8a", // Your desired hover color
                },
              }}
            >
              Clear
            </Button>
            <Button
              size="small"
              onClick={() => setHistory(false)}
              sx={{
                backgroundColor: "#3b71ca",
                color: "white",

                pl: 1,
                pr: 1,
                mb: 2,

                textTransform: "none", // Set to 'none' to avoid automatic capitalization
                "&:hover": {
                  backgroundColor: "#1f4e8a", // Your desired hover color
                },
              }}
            >
              Back
            </Button>
          </Stack>
          {data && data.length ? (
            <>
              <AdminList data={data} name={userName} />
            </>
          ) : null}
        </>
      )}

      <Loader open={open} handleClose={handleClose} />
      <ErrorMessage
        open={warning}
        handleClose={handleWarningClose}
        message={message}
      />
    </Box>
  );
}
