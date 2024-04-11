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
  const [suggestionTask, setSuggestionTask] = useState([]);
  const [project, setProject] = useState("");
  const [assigned, setAssigned] = useState("");
  const [suggestionAssiged, setSuggestionAssigned] = useState([]);
  const [start, setStart] = useState("");
  const [cutOff, setCutOff] = useState("");
  const [end, setEnd] = useState("");
  const [childData, setChildData] = useState();
  const [body, setBody] = useState([]);

  const fetchData = async () => {
    handleOpen();
    const response1 = await getEmployee({ iType: 1 });
    if (response1.Status === "Success") {
      const myObject1 = JSON.parse(response1.ResultData);
      setSuggestionAssigned(myObject1);
    } else {
      setSuggestionAssigned([]);
    }
    const response3 = await getTaskType();
    if (response3.Status === "Success") {
      const myObject3 = JSON.parse(response3.ResultData);
      setSuggestionTask(myObject3);
    } else {
      setSuggestionTask([]);
    }
    if (data !== 0) {
      const response = await getProjectDetails({ iId: data });
      if (response?.Status === "Success") {
        const myObject = JSON.parse(response?.ResultData);
        setProject(myObject?.Table[0]?.Project);
        setTask({sName:myObject?.Table[0]?.TaskName})
        setDataId(myObject?.Table[0]?.iId);
        setBody(myObject?.Table1);
        setStart(myObject?.Table[0]?.StartDate);
        setCutOff(myObject?.Table[0]?.CutOffDate);
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
        console.log(response);
        handleClose();
        if (response?.Status === "Success") {
          Swal.fire({
            title: "Saved",
            text: "Complaint Updated!",
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
    setAssigned("");
    setTask("");
    setBody([]);
  };

  const handleAllClear = () => {
    handleClear();
    handleNavigate();
  };

  const handleChildData = (data) => {
    setChildData(data);
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
                      onChange={(e) => setProject(e.target.value)}
                      maxLength={100}
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
                    <Autocomplete
                    readOnly
                      id="size-small-filled"
                      size="small"
                      value={task}
                      onChange={(event, newValue) => {
                        setTask(newValue);
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
                          label="Task Type"
                          className="form-control"
                          {...params}
                          inputProps={{
                            ...params.inputProps,
                            autoComplete: "off", // disable autocomplete and autofill
                            style: {
                              borderWidth: "1px",
                              borderColor: "#ddd",
                              borderRadius: "10px",
                              fontSize: "15px",
                              height: "20px",
                              paddingLeft: "6px",
                            },
                          }}
                          sx={{ minWidth: 200 }} // Set the width for Autocomplete
                        />
                      )}
                    />
                  </div>
                </MDBCol>
                <MDBCol lg="3" md="4" sm="6" xs="12">
                  <div className="mb-3">
                    <MDBInput
                      id={`form3Example`}
                      type="date"
                      size="small"
                      autoComplete="off"
                      label="Start Date"
                      value={start}
                      onChange={(e) => setStart(e.target.value)}
                      maxLength={100}
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
                      id={`form3Example`}
                      type="date"
                      size="small"
                      autoComplete="off"
                      label="Cut off Date"
                      value={cutOff}
                      onChange={(e) => setCutOff(e.target.value)}
                      maxLength={100}
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
