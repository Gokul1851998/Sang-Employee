import React, { useEffect, useState } from "react";
import AddIcon from "@mui/icons-material/Add";
import MuiAlert from "@mui/material/Alert";
import CloseIcon from "@mui/icons-material/Close";
import SaveIcon from "@mui/icons-material/Save";
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

export default function ComplaintModal({ isOpen, handleCloseModal, data, handleSaveSubmit }) {
  const [type, setType] = useState("");
  const [remark, setRemark] = React.useState("");
  const [suggestionType, setSuggestionType] = React.useState([]);
  const [open, setOpen] = React.useState(false);
  const [dataId, setDataId] = useState(0);
  const [warning, setWarning] = useState(false);
  const [message, setMessage] = useState("");
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
      const response = await getComplaints({ iId: data });
      if (response.Status === "Success") {
        const myObject = JSON.parse(response.ResultData);
        setDataId(myObject?.Table[0]?.iId)  
        setType({
            ComplaintType: myObject?.Table[0]?.sComplaintType,
          iId: myObject?.Table[0]?.ComplaintType,
        });
        setRemark(myObject?.Table[0]?.Remarks);
      }
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
      handleOpen();
      const response1 = await getComplaintType();
      if (response1.Status === "Success") {
        const myObject1 = JSON.parse(response1.ResultData);
        setSuggestionType(myObject1);
      }
      handleClose();
    };
    fetchData();
  }, []);

  const handleSave = (e) => {
    e.preventDefault();
    const emptyFields = [];
    if (!type.iId) emptyFields.push("Type");
    if (!remark) emptyFields.push("Remark");

    if (emptyFields.length > 0) {
      handleOpenAlert();
      setMessage(`Please fill : ${emptyFields.join(", ")}.`);
      return;
    }
    const saveData = {
      iId: dataId,
      iUser,
      sRemarks: remark,
      iType: type?.iId,
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
        const response = await postComplaints(saveData);
  
        handleClose();
        if (response?.Status === "Success"){
          Swal.fire({
            title: "Saved",
            text: "Complaint Updated!",
            icon: "success",
            showConfirmButton: false,
            timer: 1500,
          });
          handleSaveSubmit()
          handleAllClear();
        }
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
    setDataId(0);
    setType("");
    setRemark("");
  };

  const handleAllClear = () => {
    handleCloseModal();
    handleClear();
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
          <div className="modal-dialog modal-dialog-centered modal-sm">
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
                    startIcon={<SaveIcon />}
                    style={buttonStyle}
                  >
                    Save
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
                      <Autocomplete
                        id={`size-small-filled-assetType`}
                        size="small"
                        value={type}
                        onChange={(event, newValue) => {
                          setType(newValue);
                        }}
                        options={suggestionType.map((data) => ({
                          ComplaintType: data.ComplaintType,
                          iId: data.iId,
                        }))}
                        filterOptions={(options, { inputValue }) => {
                          return options.filter((option) =>
                            option.ComplaintType.toLowerCase().includes(
                              inputValue.toLowerCase()
                            )
                          );
                        }}
                        autoHighlight
                        getOptionLabel={(option) =>
                          option && option.ComplaintType
                            ? option.ComplaintType
                            : ""
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
                                {option.ComplaintType}
                              </Typography>
                            </div>
                          </li>
                        )}
                        renderInput={(params) => (
                          <TextField
                            required
                            label="Type"
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
                              },
                            }}
                          />
                        )}
                        style={{ width: `15.8rem` }}
                      />
                    </MDBCol>
                  </MDBRow>
                  <MDBRow className="mb-4">
                    <MDBCol>
                      <MDBTextArea
                        required
                        value={remark}
                        autoComplete="off"
                        label="Remark"
                        maxLength={300}
                        id="textAreaExample"
                        onChange={(e) => setRemark(e.target.value)}
                        rows={4}
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
