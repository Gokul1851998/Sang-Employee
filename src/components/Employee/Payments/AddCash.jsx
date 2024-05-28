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
  Tab,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Tabs,
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
  postSelfTransactions,
} from "../../../api/ApiCall";

export default function AddCash({
  isOpen,
  handleCloseModal,
  data,
  type,
  handleSaveSubmit,
}) {
  const [open, setOpen] = useState(false);
  const [dataId, setDataId] = useState(0);
  const [modal, setModal] = useState(false);
  const [warning, setWarning] = useState(false);
  const [message, setMessage] = useState("");
  const [cash, setCash] = useState(0);
  const [error, setError] = useState(false);
  const [table1, setTable1] = useState([]);
  const [table2, setTable2] = useState([]);
  const [value, setValue] = useState(0); // Default to the first tab

  const handleChange = (event, newValue) => {
    setValue(newValue);
  };

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
    fetchData2();
  }, [type, isOpen]);

  const fetchData2 = async () => {
    if (type === 3) {
      handleOpen();
      const response = await getSelfTransactions({ iUser: 0 });
      handleClose();
      if (response.Status === "Success") {
        const myObject = JSON.parse(response?.ResultData);
        setTable1(myObject?.Table);
        setTable2(myObject?.Table1);
      }
    }
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

  const headers1 =
    table1 && table1.length
      ? Object.keys(table1[0]).filter(
          (key) =>
            key !== "iId" &&
            key !== "iUser" &&
            key !== "iType" &&
            key !== "sType"
        )
      : [];

  const headers2 =
    table2 && table2.length
      ? Object.keys(table2[0]).filter(
          (key) =>
            key !== "iId" &&
            key !== "iUser" &&
            key !== "iType" &&
            key !== "sType"
        )
      : [];

  const handlePay = async (e, row, type) => {
    Swal.fire({
      text: "Are you sure you want to continue?",
      showCancelButton: true,
      confirmButtonColor: "#3085d6",
      cancelButtonColor: "#d33",
      confirmButtonText: "Yes",
    }).then(async (result) => {
      if (result.value) {
        handleOpen();
        const response = await postSelfTransactions({
          iType: type,
          iIds: row.iId,
          iUser,
        });
        handleClose();
        if (response?.Status === "Success") {
          Swal.fire({
            title: "Paid",
            text: "Amount has been Paid!",
            icon: "success",
            showConfirmButton: false,
            timer: 1500,
          });
          fetchData2()
     
        }
      }
    });
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
                    <Tabs
                      value={value}
                      onChange={handleChange}
                      aria-label="disabled tabs example"
                    >
                      <Tab sx={{ textTransform: "none" }} label="List" />
                      <Tab sx={{ textTransform: "none" }} label="Employee" />
                    </Tabs>
                    {value === 0 &&
                      (table1 && table1.length ? (
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
                                {headers1.map((header, index) => (
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
                              {table1.map((row, index) => {
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
                                    {Object.keys(table1[0]).map(
                                      (column, index) => {
                                        if (
                                          column !== "iId" &&
                                          column !== "iUser" &&
                                          column !== "iType" &&
                                          column !== "sType"
                                        ) {
                                          return (
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
                                          );
                                        }
                                      }
                                    )}
                                    <TableCell
                                      style={{
                                        padding: "0px",
                                        border: "1px solid #ddd",
                                      }}
                                      padding="checkbox"
                                      align="center"
                                    >
                                      <IconButton type="button">
                                        <Button
                                          onClick={(e) => handlePay(e, row, 1)}
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
                      ) : (
                        <TableContainer
                          sx={{
                            height: 50,
                            display: "flex",
                            alignItems: "center",
                            justifyContent: "center",
                          }}
                        >
                          <Typography
                            variant="h6"
                            id="tableTitle"
                            component="div"
                            sx={{
                              textAlign: "center",
                              margin: "0 auto", // Center the text horizontally
                              fontSize: "16px",
                              fontWeight: "semi",
                            }}
                          >
                            No Credits
                          </Typography>
                        </TableContainer>
                      ))}
                    {value === 1 &&
                      (table2 && table2.length ? (
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
                                {headers2.map((header, index) => (
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
                              {table2.map((row, index) => {
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
                                    {Object.keys(table2[0]).map(
                                      (column, index) => {
                                        if (
                                          column !== "iId" &&
                                          column !== "iUser" &&
                                          column !== "iType" &&
                                          column !== "sType"
                                        ) {
                                          return (
                                            <TableCell
                                              style={{
                                                padding: "4px",
                                                border: "1px solid #ddd",
                                                whiteSpace: "nowrap",
                                                overflow: "hidden",
                                                textOverflow: "ellipsis",
                                                width: `calc(100% / 3)`,
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
                                          );
                                        }
                                      }
                                    )}
                                    <TableCell
                                      style={{
                                        padding: "0px",
                                        border: "1px solid #ddd",
                                      }}
                                      padding="checkbox"
                                      align="center"
                                    >
                                      <IconButton type="button">
                                        <Button
                                          onClick={(e) => handlePay(e, row, 2)}
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
                      ) : (
                        <TableContainer
                          sx={{
                            height: 50,
                            display: "flex",
                            alignItems: "center",
                            justifyContent: "center",
                          }}
                        >
                          <Typography
                            variant="h6"
                            id="tableTitle"
                            component="div"
                            sx={{
                              textAlign: "center",
                              margin: "0 auto", // Center the text horizontally
                              fontSize: "16px",
                              fontWeight: "semi",
                            }}
                          >
                            No Credits
                          </Typography>
                        </TableContainer>
                      ))}
                  </CardContent>
                </form>
              </div>
            </div>
          ) : (
            <div className="modal-dialog modal-dialog-centered modal-sm">
              <div className="modal-content">
                <form>
                  <Stack direction="row" spacing={1} justifyContent="flex-end">
                    <IconButton onClick={handleAllClear}>
                      <CloseIcon sx={{ color: "#1b77e9" }} />
                    </IconButton>
                  </Stack>
                  <CardContent>
                    <Typography
                      gutterBottom
                      variant="h6"
                      component="div"
                      sx={{
                        textAlign: "center",
                      }}
                    >
                      Add Cash
                    </Typography>
                    {warning && (
                      <MuiAlert
                        elevation={6}
                        variant="filled"
                        onClose={handleCloseAlert}
                        severity="warning"
                        sx={{ mb: 2 }}
                      >
                        {message}
                      </MuiAlert>
                    )}
                    {error && (
                      <ErrorMessage message="Please add amount greater than 0" />
                    )}
                    <TextField
                      label="Enter Cash Amount"
                      type="number"
                      fullWidth
                      variant="outlined"
                      margin="normal"
                      value={cash === 0 ? "" : cash}
                      onChange={(e) => setCash(Number(e.target.value))}
                      error={error}
                      helperText={error && "Cash amount must be greater than 0"}
                      inputProps={{ min: 0 }} // Prevents entering negative values
                    />

                    <Stack
                      direction="row"
                      spacing={2}
                      justifyContent="center"
                      sx={{ mt: 2 }}
                    >
                      <Button
                        onClick={handleSave}
                        variant="contained"
                        sx={{ ...buttonStyle, width: "50%" }}
                      >
                        Save
                      </Button>
                      <Button
                        onClick={handleClear}
                        variant="contained"
                        sx={{ ...buttonStyle, width: "50%" }}
                      >
                        Clear
                      </Button>
                    </Stack>
                  </CardContent>
                </form>
              </div>
            </div>
          )}
        </div>
      </Zoom>
    </div>
  );
}
