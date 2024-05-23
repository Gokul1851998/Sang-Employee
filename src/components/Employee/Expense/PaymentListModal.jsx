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
import { getAllPayment } from "../../../api/ApiCall";

export default function PaymentListModal({ isOpen, handleCloseModal, data }) {
  const [open, setOpen] = React.useState(false);
  const [dataId, setDataId] = useState(0);
  const [modal, setModal] = useState(false)
  const [warning, setWarning] = useState(false);
  const [message, setMessage] = useState("");
  const [tableData, setTableData] = useState([])
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
    if (data !== 0) {
        const response = await getAllPayment({ iId: data });
        if (response.Status === "Success") {
          setModal(isOpen)
          const myObject = JSON.parse(response.ResultData);
          setTableData(myObject)
        //   setDataId(myObject?.Table[0]?.iId);
        }else{
            handleCloseModal()
            setMessage(response?.MessageDescription)
            handleOpenAlert()
        }
    } else {
      handleClear();
    }
    handleClose();
  };

  useEffect(() => {
    fetchData();
  }, [isOpen]);



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

  const handleClear = () => {};

  const handleAllClear = () => {
    handleCloseModal();
    handleClear();
    setModal(false)
  };

  const headers = tableData && tableData.length ? Object.keys(tableData[0]).filter(
    (key) => key !== "iId" && key !== "Employee"
  ) : [];


  return (
    <div>
      <div
        className={`modal-backdrop fade ${modal  ? "show" : ""}`}
        style={{
          display: modal  ? "block" : "none",
          backgroundColor: "rgba(0, 0, 0, 0.7)",
        }}
      ></div>

      <Zoom in={modal} timeout={modal ? 400 : 300}>
        <div
          className={`modal ${modal  ? "modal-open" : ""}`}
          style={modalStyle}
        >
          <div className="modal-dialog modal-dialog-centered modal-lg">
            <div className="modal-content">
              <form>
                <Stack
                   direction="row"
                   spacing={1}
                 
                   justifyContent="flex-end"
                >
                
                  <IconButton onClick={handleAllClear}>
                    <CloseIcon sx={{color:"#1b77e9"}} />
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
              <TableCell
                className="text-white"
                sx={{
                  padding: "4px",
                  border: "1px solid #ddd",
                  whiteSpace: "nowrap",
                  cursor: "pointer",
                  minWidth: "80px",
                }}
                padding="checkbox"
              ></TableCell>
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
            </TableRow>
          </TableHead>
          <TableBody>
            {tableData.map((row, index) => {
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
                  <TableCell
                    style={{
                      padding: "4px",
                      border: "1px solid #ddd",
                    }}
                    padding="checkbox"
                    align="center"
                  > {index + 1}</TableCell>
                  {Object.keys(tableData[0]).map((column, index) => {
                    if (column !== "iId" && column !== "Employee") {
                      return (
                        <>
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
                        </>
                      );
                    }
                  })}
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
