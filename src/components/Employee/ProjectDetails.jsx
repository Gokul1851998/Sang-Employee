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
import { getAssignedProject } from "../../api/ApiCall";
import CloseIcon from "@mui/icons-material/Close";

const buttonStyle = {
  textTransform: "none", // Set text transform to none for normal case
  color: ` #fff`, // Set text color
  backgroundColor: `#1b77e9`, // Set background color
  boxShadow: "0px 5px 15px rgba(0, 0, 0, 0.3)",
  fontSize: "12px",
  padding: "6px 10px",
};

export default function ProjectDetails({ handleNavigate }) {
  const iUser = localStorage.getItem("userId");
  const [open, setOpen] = React.useState(false);
  const [dataId, setDataId] = useState(0);
  const [project, setProject] = useState("");
  const [suggestionProject, setSuggestionProject] = useState([]);
  const [startDate, setStartDate] = useState("");
  const [cutOfDate, setCutOfDate] = useState("");

  useEffect(() => {
    const fetchData = async () => {
      const response = await getAssignedProject({ iUser });
      if (response.Status === "Success") {
        const myObject = JSON.parse(response.ResultData);
        setSuggestionProject(myObject);
      } else {
        setSuggestionProject([]);
      }
    };
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
  };

  const handleClear = () => {
    const currentDate = new Date();
    const year = currentDate.getFullYear();
    const month = String(currentDate.getMonth() + 1).padStart(2, "0");
    const day = String(currentDate.getDate()).padStart(2, "0");
    const formattedDate = `${year}-${month}-${day}`;
    setDataId(0);
    setStartDate(formattedDate);
    setCutOfDate(formattedDate);
    setProject("");
  };
  return (
    <form onSubmit={handleSave}>
      <Stack direction="row" spacing={1} padding={1} justifyContent="flex-end">
        <Button
          onClick={handleClear}
          size="small"
          variant="contained"
          startIcon={<AddIcon />}
          style={buttonStyle}
        >
          New
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
                  fontWeight: "bold",
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
                      required
                      id={`form3Example`}
                      type="text"
                      size="small"
                      autoComplete="off"
                      label="Start Date"
                      value={startDate}
                      onChange={(e) => setStartDate(e.target.value)}
                      maxLength={100}
                      labelStyle={{
                        fontSize: "15px",
                      }}
                    />
                  </div>
                </MDBCol>
                <MDBCol lg="3" md="4" sm="6" xs="12">
                  <div className="mb-3">
                    <MDBInput
                      required
                      id={`form3Example`}
                      type="date"
                      autoComplete="off"
                      label="Cut of Date"
                      value={cutOfDate}
                      onChange={(e) => setCutOfDate(e.target.value)}
                      maxLength={80}
                      size="small"
                      labelStyle={{
                        fontSize: "15px",
                      }}
                    />
                  </div>
                </MDBCol>
                <MDBCol lg="3" md="4" sm="6" xs="12">
                  <Autocomplete
                    id={`size-small-filled-assetType`}
                    size="small"
                    value={project}
                    onChange={(event, newValue) => {
                      setProject(newValue);
                    }}
                    options={suggestionProject.map((data) => ({
                      sName: data.sProject,
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
                        label="Project"
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
            </MDBCardBody>
          </div>
        </>
      </MDBCard>

      {/* <DetailsTable data={body} handleChildData={handleChildData} /> */}

      <Loader open={open} handleClose={handleClose} />
    </form>
  );
}
