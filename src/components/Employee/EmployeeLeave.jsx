import * as React from "react";
import { useEffect, useState } from "react";
import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableCell from "@mui/material/TableCell";
import TableContainer from "@mui/material/TableContainer";
import TableHead from "@mui/material/TableHead";
import TableRow from "@mui/material/TableRow";
import TablePagination from "@mui/material/TablePagination";
import Paper from "@mui/material/Paper";
import empty from "../../assets/empty.png";
import EditIcon from '@mui/icons-material/Edit';
import {
  deleteLeaveApplication,
  getLeaveApplicationSummary,
} from "../../api/ApiCall";
import Loader from "../Loader/Loader";
import {
  Box,
  Button,
  IconButton,
  TextField,
  Toolbar,
  Tooltip,
  Typography,
} from "@mui/material";
import DeleteIcon from "@mui/icons-material/Delete";
import AutorenewIcon from "@mui/icons-material/Autorenew";
import LeaveForm from "./LeaveForm";

const buttonStyle = {
  textTransform: "none", // Set text transform to none for normal case
  color: `#fff`, // Set text color
  backgroundColor: `#1b77e9 `, // Set background color
  boxShadow: "0px 5px 15px rgba(0, 0, 0, 0.1)",
  margin: 5,
};

export default function EnployeeLeave() {
  const iEmployee = Number(localStorage.getItem("iEmployee"));
  const userId = localStorage.getItem("userId");
  const currentDate = new Date();
  const currentYear = currentDate.getFullYear();
  const [year, setYear] = useState(currentYear);
  const [data, setData] = useState([]);
  const [loader, setLoader] = React.useState(false);
  const [page, setPage] = React.useState(0);
  const [rowsPerPage, setRowsPerPage] = React.useState(10);
  const [searchQuery, setSearchQuery] = useState("");
  const [navigate, setNavigate] = useState(false);
  const [id, setId] = useState("")

  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };

  const handleSearch = (event) => {
    setSearchQuery(event.target.value);
  };

  const handleLoaderClose = () => {
    setLoader(false);
  };

  const handleLoaderOpen = () => {
    setLoader(true);
  };

  const ignoredField = "TransId";
  const filteredRows = data.filter((row) =>
    Object.entries(row).some(([key, value]) => {
      // Ignore the specified field from filtering
      if (key === ignoredField) {
        return false;
      }

      if (typeof value === "string") {
        return value.toLowerCase().includes(searchQuery.toLowerCase());
      }

      if (typeof value === "number") {
        return value.toString().includes(searchQuery.toLowerCase());
      }

      return false; // Ignore other types
    })
  );

  const fetchData = async () => {
    handleLoaderOpen();
    const response = await getLeaveApplicationSummary({
      iEmployee,
      iYear: year,
    });
   
    if (response?.Status === "Success") {
      const myObject = JSON.parse(response?.ResultData);
      setData(myObject);
    } else {
      setData([]);
    }
    handleLoaderClose();
  };

  useEffect(() => {
    fetchData();
  }, [iEmployee, year,navigate]);

  const headers = data.length > 0 ? Object.keys(data[0]) : [];

  const handleDelete = async (id) => {
    Swal.fire({
      text: "Are you sure you want to continue?",
      showCancelButton: true,
      confirmButtonColor: "#3085d6",
      cancelButtonColor: "#d33",
      confirmButtonText: "Yes",
    }).then(async (result) => {
      if (result.value) {
        handleLoaderOpen()
        const response = await deleteLeaveApplication({
          iTransId: id,
          iUser: userId,
        });
        if (response.Status === "Success") {
          Swal.fire({
            title: "Updated",
            text: "Task Updated!",
            icon: "success",
            showConfirmButton: false,
            timer: 1500,
          });
          fetchData();
        }
        handleLoaderClose()
      }
    });
  };

  const handleEdit = (iId)=>{
    setId(iId)
    setNavigate(true)
  }

  const handleNew = ()=>{
    setId(null)
    setNavigate(true)
  }

  return (
    <>
      <Box
        sx={{
          width: "100%",
          padding: 2,
          zIndex: 1,
          textAlign: "center",
        }}
      >
        <Paper
          sx={{
            width: "100%",
            mb: 2,
            boxShadow: "0px 5px 15px rgba(0, 0, 0, 0.3)",
          }}
        >
          {navigate ? (
            <LeaveForm setChange={setNavigate} id={id} />
          ) : (
            <>
              <Toolbar
                sx={{
                  pl: { sm: 2 },
                  pr: { xs: 1, sm: 1 },
                  display: "flex",
                  justifyContent: "space-between", // Align items horizontally
                  alignItems: "center", // Align items vertically
                }}
              >
                <div>
                  <Typography variant="h6" id="tableTitle" component="div">
                    Leave History
                  </Typography>
                </div>

                <div>
                  <Button
                    onClick={handleNew}
                    variant="contained"
                    style={buttonStyle}
                    // startIcon={<AddIcon />}
                    size="small"
                  >
                    Leave Apply
                  </Button>
                  {data && data.length ? (
                    <TextField
                      id="search"
                      className="p"
                      label="Search"
                      variant="outlined"
                      value={searchQuery}
                      onChange={handleSearch}
                      size="small"
                    />
                  ) : null}
                </div>
              </Toolbar>
              {data && data.length > 0 ? (
                <>
                  <TableContainer component={Paper}>
                    <Table
                      sx={{ width: "100%" }}
                      size="small"
                      aria-label="a dense table"
                    >
                      <TableHead
                        style={{
                          backgroundColor: "#119def",
                          position: "sticky",
                          top: 0,
                          zIndex: "1",
                        }}
                      >
                        <TableRow>
                          {headers.map((header) =>
                            header !== "iTransId" ? (
                              <TableCell
                                key={header}
                                className="text-white"
                                sx={{
                                  padding: "4px",
                                  border: "1px solid #ddd",
                                  minWidth:
                                    header === "RejectedRemark"
                                      ? "300px"
                                      : "140px",
                                  maxWidth:
                                    header === "RejectedRemark"
                                      ? "400px"
                                      : "200px",
                                  whiteSpace: "nowrap",
                                  overflow: "hidden",
                                  textOverflow: "ellipsis",
                                }}
                                align="center"
                                padding="normal"
                              >
                                {header}
                              </TableCell>
                            ) : null
                          )}
                          <TableCell
                            className="text-white"
                            sx={{
                              padding: "4px",
                              border: "1px solid #ddd",
                              minWidth: "180px",
                              maxWidth: "100px",
                              whiteSpace: "nowrap",
                              overflow: "hidden",
                              textOverflow: "ellipsis",
                            }}
                            align="center"
                            padding="normal"
                          >
                            Action
                          </TableCell>
                        </TableRow>
                      </TableHead>
                      <TableBody>
                        {filteredRows
                          .slice(
                            page * rowsPerPage,
                            page * rowsPerPage + rowsPerPage
                          )
                          .map((row, rowIndex) => (
                            <TableRow key={rowIndex}>
                              {headers.map((header) =>
                                header !== "iTransId" ? (
                                  <TableCell
                                    key={header}
                                    sx={{
                                      padding: "4px",
                                      border: "1px solid #ddd",
                                      whiteSpace: "nowrap",
                                    }}
                                    component="th"
                                    scope="row"
                                    padding="normal"
                                    align="center"
                                  >
                                    {row[header] === "Approved" ? (
                                      <Typography
                                        sx={{
                                          flex: "1 1 100%",
                                          fontWeight: "bold",
                                        }}
                                        className="text-success"
                                        variant="p"
                                        id="tableTitle"
                                        component="div"
                                      >
                                        {row[header]}
                                      </Typography>
                                    ) : row[header] === "Rejected" ? (
                                      <Typography
                                        sx={{
                                          flex: "1 1 100%",
                                          fontWeight: "bold",
                                        }}
                                        className="text-danger"
                                        variant="p"
                                        id="tableTitle"
                                        component="div"
                                      >
                                        {row[header]}
                                      </Typography>
                                    ) : row[header] === "Pending" ? (
                                      <Typography
                                        sx={{
                                          flex: "1 1 100%",
                                          fontWeight: "bold",
                                        }}
                                        className="text-warning"
                                        variant="p"
                                        id="tableTitle"
                                        component="div"
                                      >
                                        {row[header]}
                                      </Typography>
                                    ) : (
                                      row[header]
                                    )}
                                  </TableCell>
                                ) : null
                              )}
                              <TableCell
                                sx={{
                                  padding: "4px",
                                  border: "1px solid #ddd",
                                  whiteSpace: "nowrap",
                                }}
                                component="th"
                                scope="row"
                                padding="normal"
                                align="center"
                              >
                                {row?.sAuth === "Approved" ? (
                                  "---"
                                ) : row?.sAuth === "Rejected" ? (
                                  <Tooltip title="Reapply" arrow>
                                    <IconButton onClick={()=>handleEdit(row?.iTransId)}
                                      aria-label="delete"
                                      size="small"
                                    >
                                      <AutorenewIcon
                                        fontSize="small"
                                        sx={{ fontSize: 16, color: "#1b77e9" }}
                                      />
                                    </IconButton>
                                  </Tooltip>
                                ) : row?.sAuth === "Pending" ? (
                                    <>
                                      <Tooltip title="Edit" arrow>
                                    <IconButton
                                      aria-label="edit"
                                      size="small"
                                     onClick={()=>handleEdit(row?.iTransId)}
                                    >
                                      <EditIcon
                                        fontSize="small"
                                        sx={{ fontSize: 16, color: "#1b77e9" }}
                                      />
                                    </IconButton>
                                  </Tooltip>
                                  <Tooltip title="Delete" arrow>
                                    <IconButton
                                      aria-label="delete"
                                      size="small"
                                      onClick={() =>
                                        handleDelete(row?.iTransId)
                                      }
                                    >
                                      <DeleteIcon
                                        fontSize="small"
                                        sx={{ fontSize: 16, color: "#1b77e9" }}
                                      />
                                    </IconButton>
                                  </Tooltip>
                                
                                  </>
                                ) : null}
                              </TableCell>
                            </TableRow>
                          ))}
                      </TableBody>
                    </Table>
                  </TableContainer>
                  <TablePagination
                    rowsPerPageOptions={[10, 25, 50, 100]}
                    component="div"
                    count={filteredRows.length}
                    rowsPerPage={rowsPerPage}
                    page={page}
                    onPageChange={handleChangePage}
                    onRowsPerPageChange={handleChangeRowsPerPage}
                  />
                </>
              ) : (
                <>
                  <TableContainer component={Paper}>
                    <img
                      className="p-5"
                      srcSet={`${empty}`}
                      src={`${empty}`}
                      alt={empty}
                      loading="lazy"
                      style={{ width: "500px" }}
                    />
                  </TableContainer>
                </>
              )}
            </>
          )}
        </Paper>
      </Box>

      <Loader open={loader} handleClose={handleLoaderClose} />
    </>
  );
}
