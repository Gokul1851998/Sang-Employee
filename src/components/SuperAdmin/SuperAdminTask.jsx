import * as React from "react";
import Box from "@mui/material/Box";
import Paper from "@mui/material/Paper";
import {
  MDBBtn,
  MDBCol,
  MDBInput,
  MDBRow,
  MDBTextArea,
} from "mdb-react-ui-kit";
import "mdb-react-ui-kit/dist/css/mdb.min.css";
import "@fortawesome/fontawesome-free/css/all.min.css";
import { postDailyTask } from "../../api/ApiCall";
import Swal from "sweetalert2";

export default function SuperAdminTask() {
  const iUser = Number(localStorage.getItem("userId"));
  const iEmployee = Number(localStorage.getItem("iEmployee"));
  const [open, setOpen] = React.useState(false);
  const [date, setDate] = React.useState(null);
  const [hour, setHour] = React.useState(0.0);
  const [start, setStart] = React.useState("00:00");
  const [end, setEnd] = React.useState("00:00");
  const [task, setTask] = React.useState("");
  const [status, setStatus] = React.useState(false);

  const handleClose = () => {
    setOpen(false);
  };
  const handleOpen = () => {
    setOpen(true);
  };

  const newData = () => {
    setDate("");
    setHour(0.0);
    setStart("00:00");
    setEnd("00:00");
    setTask("");
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
          NoOf_Hrs: Number(hour),
          iUser,
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
      }
    });
  };

  function formatDate(inputDate) {
    const dateObject = new Date(inputDate);

    const year = dateObject.getFullYear();
    const month = String(dateObject.getMonth() + 1).padStart(2, "0");
    const day = String(dateObject.getDate()).padStart(2, "0");

    return `${year}/${month}/${day}`;
  }

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
  }, [start, end]);

  function getCurrentDate() {
    const today = new Date();
    const year = today.getFullYear();
    let month = today.getMonth() + 1; // Months are zero-indexed
    let day = today.getDate();

    // Ensure month and day are always two digits
    if (month < 10) {
      month = `0${month}`;
    }
    if (day < 10) {
      day = `0${day}`;
    }

    return `${year}-${month}-${day}`;
  }

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
                  id="form3Example1"
                  label="Date"
                  value={date}
                  onChange={(e) => setDate(e.target.value)}
                  type="date"
                  max={getCurrentDate()} // Set the max attribute to the current date
                />
              </MDBCol>
              <MDBCol>
                <MDBInput
                  required
                  id="form3Example2"
                  value={hour}
                  label="No of Hrs"
                  readOnly
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
              maxLength={300}
              label="Task"
              id="textAreaExample"
              onChange={(e) => setTask(e.target.value)}
              rows={4}
            />

            <MDBBtn
              type="submit"
              className="mb-4 mt-4"
              block
              style={{ backgroundColor: "#74227a", color: "#ffffff" }}
            >
              Submit
            </MDBBtn>
          </form>
          {/* <Loader open={open} handleClose={handleClose} /> */}
        </Box>
      </Paper>
    </Box>
  );
}
