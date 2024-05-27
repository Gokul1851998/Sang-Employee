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
import {
  getAllPayment,
  getSelfTransactions,
  postAmount,
} from "../../../api/ApiCall";

export default function AddCash({
  isOpen,
  handleCloseModal,
  data,
  type,
  handleSaveSubmit,
}) {
  const [open, setOpen] = React.useState(false);
  const [dataId, setDataId] = useState(0);
  const [modal, setModal] = useState(false);
  const [warning, setWarning] = useState(false);
  const [message, setMessage] = useState("");
  const [cash, setCash] = useState(0);
  const [error, setError] = useState(false);
  const [table, setTable] = useState([]);

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
    setModal(isOpen);
  };

  useEffect(() => {
    fetchData();
  }, [isOpen]);

  useEffect(() => {
    if (cash !== 0) {
      setError(false);
    }
  }, [cash]);

  useEffect(() => {
    const fetchData = async () => {
      if (type === 3) {
        handleOpen();
        const response = await getSelfTransactions({ iUser: 0 });
        handleClose();
        if (response.Status === "Success") {
          const myObject = JSON.parse(response?.ResultData);
          setTable(myObject);
        }
      }
    };
    fetchData();
  }, [type]);

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
      if (response?.Status === "Success") {
        Swal.fire({
          title: "Added",
          text: "Amount Added Successfully!",
          icon: "success",
          showConfirmButton: false,
          timer: 1500,
        });
        handleSaveSubmit();
        handleAllClear();
      }
    }
  };

  const headers =
    table && table.length
      ? Object.keys(table[0]).filter(
          (key) => key !== "iId" && key !== "Employee"
        )
      : [];

      const handlePay = async(e,id)=>{
          console.log(id);
      }

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
          {type === 3 ? (
            <div className="modal-dialog modal-dialog-centered modal-lg">
              <div className="modal-content">
                <form>
                  <Stack direction="row" spacing={1} justifyContent="flex-end">
                    <IconButton onClick={handleAllClear}>
                      <CloseIcon sx={{ color: "#1b77e9" }} />
                    </IconButton>
                  </Stack>
                  <CardContent>
                    <TableContainer
                      style={{
                        display: "block",
                        maxHeight: "calc(100vh - 200px)",
                        overflowY: "auto",
                        scrollbarWidth: "thin",
                        scrollbarColor: "#888 #f5f5f5",
                        scrollbarTrackColor: "#f5f5f5",
                        boxShadow: "0px 5px 15px rgba(0, 0, 0, 0.1)",
                      }}
                    >
                      <Table
                        sx={{ minWidth: 750 }}
                        aria-labelledby="tableTitle"
                        size={"small"}
                      >
                        <TableHead
                          style={{
                            background: `#1b77e9`,
                            position: "sticky",
                            top: 0,
                            zIndex: "5",
                          }}
                        >
                          <TableRow>
                            {headers.map((header, index) => (
                              <TableCell
                                sx={{
                                  border: "1px solid #ddd",
                                  cursor: "pointer",
                                  padding: "4px",
                                  color: "white",
                                }}
                                key={`${index}-${header}`}
                                align="left"
                                padding="normal"
                              >
                                {header}
                              </TableCell>
                            ))}
                            <TableCell
                              sx={{
                                border: "1px solid #ddd",
                                cursor: "pointer",
                                padding: "4px",
                                color: "white",
                              }}
                              align="center"
                              padding="normal"
                            >
                              Payment
                            </TableCell>
                          </TableRow>
                        </TableHead>
                        <TableBody>
                          {table.map((row, index) => {
                            const labelId = `enhanced-table-checkbox-${index}`;

                            return (
                              <TableRow
                                key={row.iId}
                                hover
                                role="checkbox"
                                className={`table-row `}
                                tabIndex={-1}
                                sx={{
                                  cursor: "pointer",
                                }}
                              >
                                {Object.keys(table[0]).map((column, index) => {
                                  if (
                                    column !== "iId" &&
                                    column !== "Employee"
                                  ) {
                                    return (
                                      <>
                                        <TableCell
                                          style={{
                                            padding: "4px",
                                            border: "1px solid #ddd",
                                            whiteSpace: "nowrap",
                                            overflow: "hidden",
                                            textOverflow: "ellipsis",
                                            width: `calc(100% / 4)`,
                                            minWidth: "100px",
                                            maxWidth: 150,
                                          }}
                                          key={index + labelId}
                                          component="th"
                                          id={labelId}
                                          scope="row"
                                          padding="normal"
                                          align="left"
                                        >
                                          {row[column]}
                                        </TableCell>
                                      </>
                                    );
                                  }
                                })}
                                <TableCell
                                  style={{
                                    padding: "0px",
                                    border: "1px solid #ddd",
                                  }}
                                  padding="checkbox"
                                  align="center"
                                >
                                  <IconButton type="button">
                                    <Button onClick={(e)=>handlePay(e,row)}
                                      sx={{
                                        ...buttonStyle,
                                        fontSize: "10px",
                                        padding: "4px 8px",
                                      
                                      }}
                                      variant="contained"
                                    >
                                      Pay
                                    </Button>
                                  </IconButton>
                                </TableCell>
                              </TableRow>
                            );
                          })}
                        </TableBody>
                      </Table>
                    </TableContainer>
                  </CardContent>
                </form>
              </div>
            </div>
          ) : (
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
                      {type === 1
                        ? "Add Petty Cash "
                        : type === 2
                        ? "Add HR Amount "
                        : null}
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
          )}
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
