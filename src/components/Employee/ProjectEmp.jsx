import React, { useEffect, useState } from "react";
import Loader from "../Loader/Loader";
import {
  Autocomplete,
  Box,
  Button,
  Stack,
  TextField,
  Typography,
} from "@mui/material";
import AddIcon from "@mui/icons-material/Add";
import {
  MDBCard,
  MDBCardBody,
  MDBCardHeader,
  MDBCol,
  MDBInput,
  MDBRow,
} from "mdb-react-ui-kit";
import {
  getEmployee,
  getProjectDetails,
  getTaskType,
  postProject,
  postSubTask,
} from "../../api/ApiCall";
import CloseIcon from "@mui/icons-material/Close";
import ProjectTableList from "./ProjectTableList";
import ProjectEMPTable from "./ProjectEMPTable";
import SaveIcon from "@mui/icons-material/Save";
import Swal from "sweetalert2";

const buttonStyle = {
  textTransform: "none", // Set text transform to none for normal case
  color: ` #fff`, // Set text color
  backgroundColor: `#1b77e9`, // Set background color
  boxShadow: "0px 5px 15px rgba(0, 0, 0, 0.3)",
  fontSize: "12px",
  padding: "6px 10px",
};

export default function ProjectEmp({ handleNavigate, data }) {
  const iUser = Number(localStorage.getItem("userId"));
  const [open, setOpen] = React.useState(false);
  const [dataId, setDataId] = useState(0);
  const [task, setTask] = useState("");
  const [project, setProject] = useState("");;
  const [start, setStart] = useState("");
  const [cutOff, setCutOff] = useState("");
  const [dateChange, setDateChange] = useState(false);
  const [childData, setChildData] = useState();
  const [body, setBody] = useState([]);

  const fetchData = async () => {
    handleOpen();
    // const response1 = await getEmployee({ iType: 1 });
    // if (response1.Status === "Success") {
    //   const myObject1 = JSON.parse(response1.ResultData);
    //   setSuggestionAssigned(myObject1);
    // } else {
    //   setSuggestionAssigned([]);
    // }
    // const response3 = await getTaskType();
    // if (response3.Status === "Success") {
    //   const myObject3 = JSON.parse(response3.ResultData);
    //   setSuggestionTask(myObject3);
    // } else {
    //   setSuggestionTask([]);
    // }
    if (data !== 0) {
      const response = await getProjectDetails({ iId: data });
      if (response?.Status === "Success") {
        const myObject = JSON.parse(response?.ResultData);
        setProject(myObject?.Table[0]?.Project);
        setTask(myObject?.Table[0]?.TaskName)
        setDataId(myObject?.Table[0]?.iId);
        setBody(myObject?.Table1);
        setStart(myObject?.Table[0]?.StartDate);
        setCutOff(myObject?.Table[0]?.CutOffDate);
        setDateChange(myObject?.Table[0]?.dateUpdation)
      }
    } else {
      handleClear();
    }
    handleClose();
  };

  useEffect(() => {
    fetchData();
  }, []);

  const handleClose = () => {
    setOpen(false);
  };
  const handleOpen = () => {
    setOpen(true);
  };

  const handleSave = async (e) => {
    e.preventDefault();
    const saveData = {
      StartDate: start,
      CutOffDate: cutOff,
      iProject: dataId,
      iUser,
      Details: childData,
    };
    Swal.fire({
      text: "Are you sure you want to continue?",
      showCancelButton: true,
      confirmButtonColor: "#3085d6",
      cancelButtonColor: "#d33",
      confirmButtonText: "Yes",
    }).then(async (result) => {
      if (result.value) {
        handleOpen();
        const response = await postSubTask(saveData);
        handleClose();
        if (response?.Status === "Success") {
          Swal.fire({
            title: "Saved",
            text: "Project Updated!",
            icon: "success",
            showConfirmButton: false,
            timer: 1500,
          });

          handleAllClear();
        }
      }
    });
  };

  const handleClear = () => {
    setDataId(0);
    setProject("");
    setTask("");
    setBody([]);
    setDateChange(false)
  };

  const handleAllClear = () => {
    handleClear();
    handleNavigate();
  };

  const handleChildData = (data) => {
    setChildData(data);
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
    <form onSubmit={handleSave}>
      <Stack direction="row" spacing={1} padding={1} justifyContent="flex-end">
        <Button
          size="small"
          type="submit"
          variant="contained"
          startIcon={<SaveIcon />}
          style={buttonStyle}
        >
          Save
        </Button>
        <Button
          onClick={handleNavigate}
          size="small"
          variant="contained"
          startIcon={<CloseIcon />}
          style={buttonStyle}
        >
          Close
        </Button>
      </Stack>
      <MDBCard
        className="text-center"
        style={{ boxShadow: "0 4px 8px rgba(0, 0, 0, 0.3)", zIndex: 1 }}
      >
        <>
          <div>
            <MDBCardHeader
              style={{ padding: 5, margin: 0, backgroundColor: `#1b77e9` }}
            >
              <Typography
                variant="p"
                id="tableTitle"
                component="div"
                sx={{
                  textAlign: "left",
                  paddingLeft: 2,
                  color: "white",
                  fontSize: "16px",
                  fontWeight: "semi",
                }} // Align content to the left
              >
                Project Details
              </Typography>
            </MDBCardHeader>

            <MDBCardBody>
              <MDBRow className="g-2">
                <MDBCol lg="3" md="4" sm="6" xs="12">
                  <div className="mb-3">
                    <MDBInput
                      readOnly
                      id={`form3Example`}
                      type="text"
                      size="small"
                      autoComplete="off"
                      label="Project"
                      value={project}
                      labelStyle={{
                        fontSize: "15px",
                      }}
                      style={{
                        cursor: "text",
                        color: "inherit",
                        backgroundColor: "transparent",
                        border: "none",
                        borderBottom: "1px solid #ced4da",
                      }}
                    />
                  </div>
                </MDBCol>

               
                <MDBCol lg="3" md="4" sm="6" xs="12">
                <div className="mb-3">
                    <MDBInput
                      readOnly
                      id={`form3Example`}
                      type="text"
                      size="small"
                      autoComplete="off"
                      label="Task Type"
                      value={task}
                      labelStyle={{
                        fontSize: "15px",
                      }}
                      style={{
                        cursor: "text",
                        color: "inherit",
                        backgroundColor: "transparent",
                        border: "none",
                        borderBottom: "1px solid #ced4da",
                      }}
                    />
                  </div>
                </MDBCol>
                <MDBCol lg="3" md="4" sm="6" xs="12">
                  <div className="mb-3">
                    <MDBInput
                      readOnly={!dateChange}
                      required
                      id={`form3Example`}
                      type="date"
                      size="small"
                      autoComplete="off"
                      label="Start Date"
                      value={start}
                      onChange={(e) => setStart(e.target.value)}
                      min={getCurrentDate()}
                      labelStyle={{
                        fontSize: "15px",
                      }}
                      style={{
                        cursor: "text",
                        color: "inherit",
                        backgroundColor: "transparent",
                        border: "none",
                        borderBottom: "1px solid #ced4da",
                      }}
                    />
                  </div>
                </MDBCol>
                <MDBCol lg="3" md="4" sm="6" xs="12">
                  <div className="mb-3">
                    <MDBInput
                    readOnly={!dateChange}
                    required
                      id={`form3Example`}
                      type="date"
                      size="small"
                      autoComplete="off"
                      label="Cut off Date"
                      value={cutOff}
                      onChange={(e) => setCutOff(e.target.value)}
                      min={getCurrentDate()}
                      labelStyle={{
                        fontSize: "15px",
                      }}
                      style={{
                        cursor: "text",
                        color: "inherit",
                        backgroundColor: "transparent",
                        border: "none",
                        borderBottom: "1px solid #ced4da",
                      }}
                    />
                  </div>
                </MDBCol>
              </MDBRow>
            </MDBCardBody>
          </div>
        </>
      </MDBCard>
     
        <ProjectTableList data={body} handleChildData={handleChildData} />
  

      <Loader open={open} handleClose={handleClose} />
    </form>
  );
}
