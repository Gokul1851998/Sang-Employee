import React, { useEffect, useState } from "react";
import AddIcon from "@mui/icons-material/Add";
import MuiAlert from "@mui/material/Alert";
import CloseIcon from "@mui/icons-material/Close";
import SaveIcon from "@mui/icons-material/Save";
import {
  Autocomplete,
  Box,
  Button,
  CardContent,
  IconButton,
  Stack,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  TextField,
  Typography,
  Zoom,
} from "@mui/material";

import Swal from "sweetalert2";
import Loader from "../../Loader/Loader";
import ErrorMessage from "../../ErrorMessage/ErrorMessage";
import { getAllPayment, postAmount } from "../../../api/ApiCall";

export default function AddCash({ isOpen, handleCloseModal, data, type, handleSaveSubmit }) {
  const [open, setOpen] = React.useState(false);
  const [dataId, setDataId] = useState(0);
  const [modal, setModal] = useState(false);
  const [warning, setWarning] = useState(false);
  const [message, setMessage] = useState("");
  const [cash, setCash] = useState(0);
  const [error, setError] = useState(false);

  const modalStyle = {
    display: isOpen ? "block" : "none",
  };
  const iUser = Number(localStorage.getItem("userId"));

  const buttonStyle = {
    textTransform: "none",
    color: `#fff`,
    backgroundColor: `#1b77e9`,
    boxShadow: "0px 4px 12px rgba(0, 0, 0, 0.3)",
  };

  const fetchData = async () => {
    handleOpen();
    setModal(isOpen);
    // if (data !== 0) {

    // } else {
    //   handleClear();
    // }
    handleClose();
  };

  useEffect(() => {
    fetchData();
  }, [isOpen]);

  useEffect(() => {
    if (cash !== 0) {
      setError(false);
    }
  }, [cash]);

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
    setCash(0);
  };

  const handleAllClear = () => {
    handleCloseModal();
    handleClear();
    setModal(false);
  };

  const handleSave = async () => {
    if (cash === 0) {
      setError(true);
    } else {
      const response = await postAmount({
        iType: type,
        fAmount: cash,
        iUser,
      });
      if(response?.Status === "Success"){
        Swal.fire({
            title: "Added",
            text: "Amount Added Successfully!",
            icon: "success",
            showConfirmButton: false,
            timer: 1500,
          });
          handleSaveSubmit()
          handleAllClear()
      }
    }
  };

  return (
    <div>
      <div
        className={`modal-backdrop fade ${modal ? "show" : ""}`}
        style={{
          display: modal ? "block" : "none",
          backgroundColor: "rgba(0, 0, 0, 0.7)",
        }}
      ></div>

      <Zoom in={modal} timeout={modal ? 400 : 300}>
        <div
          className={`modal ${modal ? "modal-open" : ""}`}
          style={modalStyle}
        >
          <div className="modal-dialog modal-dialog-centered modal-sm">
            <div className="modal-content">
              <form>
                <Stack
                  direction="row"
                  margin={1}
                  justifyContent="space-between"
                >
                  <Typography
                    variant="h6"
                    id="tableTitle"
                    component="div"
                    sx={{
                      textAlign: "left",
                      padding: 1,
                      fontSize: "16px",
                      fontWeight: "semi",
                    }}
                  >
                    {type === 1 ? "Add Petty Cash " : "Add HR Amount "}
                  </Typography>
                  <IconButton onClick={handleAllClear}>
                    <CloseIcon sx={{ color: "#1b77e9" }} />
                  </IconButton>
                </Stack>
                <CardContent>
                  <Box
                    display="flex"
                    flexDirection="column"
                    alignItems="center"
                    justifyContent="center"
                    sx={{ width: "100%" }}
                  >
                    <TextField
                      size="small"
                      value={cash === 0 ? "" : cash}
                      onChange={(e) => setCash(Number(e.target.value))}
                      type="number"
                      id="search"
                      label="Amount"
                      error={error}
                      autoComplete="off"
                      autoFocus
                      sx={{
                        width: "100%",
                        zIndex: 0,
                        "& .MuiInputBase-root": {
                          height: 30, // Adjust the height of the input area
                        },
                        "& .MuiInputLabel-root": {
                          transform: "translate(10px, 5px) scale(0.9)", // Adjust label position when not focused
                        },
                        "& .MuiInputLabel-shrink": {
                          transform: "translate(14px, -9px) scale(0.75)", // Adjust label position when focused
                        },
                        "& .MuiInputBase-input": {
                          fontSize: "1rem", // Adjust the font size of the input text
                        },
                        "&.Mui-focused .MuiOutlinedInput-notchedOutline": {
                          borderColor: "currentColor", // Keeps the current border color
                        },
                      }}
                    />
                    <Button
                      size="small"
                      onClick={handleSave}
                      variant="contained"
                      sx={{ mt: 2 }} // Add margin-top for spacing
                      style={buttonStyle}
                    >
                      Add
                    </Button>
                  </Box>
                </CardContent>
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
