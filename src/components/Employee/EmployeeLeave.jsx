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
import EditIcon from "@mui/icons-material/Edit";
import {
  deleteLeaveApplication,
  getLeaveApplicationSummary,
  leaveAuthorization,
} from "../../api/ApiCall";
import Loader from "../Loader/Loader";
import {
  Autocomplete,
  Box,
  Button,
  IconButton,
  Stack,
  TextField,
  Toolbar,
  Tooltip,
  Typography,
} from "@mui/material";
import DeleteIcon from "@mui/icons-material/Delete";
import AutorenewIcon from "@mui/icons-material/Autorenew";
import LeaveForm from "./LeaveForm";
import DisabledByDefaultIcon from '@mui/icons-material/DisabledByDefault';
import Swal from "sweetalert2";

const buttonStyle = {
  textTransform: "none", // Set text transform to none for normal case
  color: ` #fff`, // Set text color
  backgroundColor: `#1b77e9`, // Set background color
  boxShadow: "0px 5px 15px rgba(0, 0, 0, 0.3)",
  fontSize: "12px",
  padding: "6px 10px",
};

export default function EmployeeLeave() {
  const iEmployee = Number(localStorage.getItem("iEmployee"));
  const userId = localStorage.getItem("userId");
  const currentDate = new Date();
  const currentYear = currentDate.getFullYear();
  const [year, setYear] = useState(0);
  const [data, setData] = useState([]);
  const [loader, setLoader] = React.useState(false);
  const [page, setPage] = React.useState(0);
  const [rowsPerPage, setRowsPerPage] = React.useState(10);
  const [searchQuery, setSearchQuery] = useState("");
  const [navigate, setNavigate] = useState(false);
  const [id, setId] = useState("");
  const getCurrentYear = new Date().getFullYear();
  const previousYears = Array.from(
    { length: 6 },
    (_, index) => getCurrentYear - index
  );
  const suggestionYear = previousYears.map((year) => ({ label: year }));

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
  }, [iEmployee, year, navigate]);

  useEffect(() => {
    if (!year) {
      setYear(0);
    }
  }, [year]);

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
        handleLoaderOpen();
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
        handleLoaderClose();
      }
    });
  };

  const handleEdit = (iId) => {
    setId(iId);
    setNavigate(true);
  };

  const handleNew = () => {
    setId(null);
    setNavigate(true);
  };


    const handleApprove = async (iAuth, status, iTransId) => {
      Swal.fire({
        title: "Remarks",
        input: "text",
        inputAttributes: {
          autocapitalize: "off",
          maxlength: 200, 
        },
        confirmButtonColor: "#3085d6",
        cancelButtonColor: "#d33",
        showCancelButton: true,
        confirmButtonText: `${status}`,
        showLoaderOnConfirm: true,
        preConfirm: async (login) => {
          if (iAuth === 2 && !login) {
            Swal.showValidationMessage("Remarks are mandatory for rejection");
            return;
          }
  
          const apiData = {
            sRemarks: login,
            iTransId,
            iUser:userId,
            iAuth,
          };
  
          const response = await leaveAuthorization(apiData);
  
          if (response.Status === "Success") {
            Swal.fire({
              title: `${status}`,
              text: `Leave request ${status}.`,
              icon: "success",
              showConfirmButton: false,
              timer: 1500,
            });
            fetchData();
          }
        },
      });
    };

  return (
    <>
      {navigate ? (
        <LeaveForm setChange={setNavigate} id={id} />
      ) : (
        <>
          <Box
            sx={{
              width: "auto",
              paddingLeft: 2,
              paddingRight: 2,
              paddingBottom: 8,
              zIndex: 1,
              minHeight: "590px",
            }}
          >
            <Stack
              direction="row"
              spacing={1}
              padding={1}
              justifyContent="flex-end"
            >
              <Autocomplete
                disablePortal
                id="combo-box-demo"
                size="small"
                options={suggestionYear}
                onChange={(event, newValue) => {
                  setYear(newValue?.label);
                }}
                getOptionLabel={(option) => option.label.toString()}
                sx={{ width: { xs: "100%", sm: 300 } }} // Adjust width for different screen sizes
                renderInput={(params) => (
                  <TextField
                    {...params}
                    label="Year"
                    size="small"
                    inputProps={{
                      ...params.inputProps,
                      autoComplete: "new-password",
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
                style={{ width: `150px` }}
              />
              <Button
                size="small"
                onClick={handleNew}
                variant="contained"
                sx={buttonStyle}
              >
                Add
              </Button>
            </Stack>
            <Box
              sx={{
                width: "auto",
                zIndex: 1,
                marginTop: 1,
              }}
            >
              <Paper
                sx={{
                  width: "100%",
                  mb: 2,
                  boxShadow: "0px 5px 15px rgba(0, 0, 0, 0.3)",
                }}
              >
                <Toolbar
                  sx={{
                    pl: { xs: 1, sm: 2 }, // Adjust left padding for different screen sizes
                    pr: { xs: 1, sm: 1 },
                    display: "flex",
                    flexDirection: { xs: "column", sm: "row" }, // Stack items vertically on small screens
                    justifyContent: "space-between",
                    alignItems: "center",
                  }}
                >
                  <div style={{ display: "flex", alignItems: "center" }}>
                    <Typography
                      variant="h6"
                      id="tableTitle"
                      component="div"
                      marginRight={{ xs: 0, sm: 2 }} // Adjust right margin for different screen sizes
                      marginBottom={{ xs: 2, sm: 0 }} // Adjust bottom margin for different screen sizes
                    >
                      Leave History
                    </Typography>
                  </div>

                  <div>
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
                    <TableContainer
                      component={Paper}
                      style={{
                        display: "block",
                        maxHeight: "calc(100vh - 300px)",
                        overflowY: "auto",
                        scrollbarWidth: "thin",
                        scrollbarColor: "#888 #f5f5f5",
                        scrollbarTrackColor: "#f5f5f5",
                        boxShadow: "0px 5px 15px rgba(0, 0, 0, 0.1)",
                      }}
                    >
                      <Table
                        sx={{ width: "100%" }}
                        size="small"
                        aria-label="a dense table"
                      >
                        <TableHead
                          style={{
                            backgroundColor: "#1b77e9",
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
                                    minWidth: "150px",
                                    maxWidth: "auto",
                                    whiteSpace: "nowrap",
                                    overflow: "hidden",
                                    textOverflow: "ellipsis",
                                  }}
                                  component="th"
                                  scope="row"
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
                                minWidth: "150px",
                                maxWidth: "auto",
                                whiteSpace: "nowrap",
                                overflow: "hidden",
                                textOverflow: "ellipsis",
                              }}
                              component="th"
                              scope="row"
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
                                        minWidth: "150px",
                                        maxWidth: "auto",
                                        whiteSpace: "nowrap",
                                        overflow: "hidden",
                                        textOverflow: "ellipsis",
                                      }}
                                      component="th"
                                      scope="row"
                                      padding="normal"
                                      align="center"
                                    >
                                      {header === "Authorization" ? (
                                        <>
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
                                        </>
                                      ) : (
                                        row[header]
                                      )}
                                    </TableCell>
                                  ) : null
                                )}
                                <TableCell
                                  component="th"
                                  scope="row"
                                  sx={{
                                    padding: "4px",
                                    border: "1px solid #ddd",
                                    minWidth: "150px",
                                    maxWidth: "auto",
                                    whiteSpace: "nowrap",
                                    overflow: "hidden",
                                    textOverflow: "ellipsis",
                                  }}
                                  padding="normal"
                                  align="center"
                                >
                                  {row?.Authorization === "Approved" ? (
                                    "---"
                                  ) : row?.Authorization === "Rejected" ? (
                                    <Tooltip title="Reapply" arrow>
                                      <IconButton
                                        onClick={() =>
                                          handleEdit(row?.iTransId)
                                        }
                                        aria-label="delete"
                                        size="small"
                                      >
                                        <AutorenewIcon
                                          fontSize="small"
                                          sx={{
                                            fontSize: 16,
                                            color: "#1b77e9",
                                          }}
                                        />
                                      </IconButton>
                                    </Tooltip>
                                  ) : row?.Authorization === "Pending" ? (
                                    <>
                                      <Tooltip title="Edit" arrow>
                                        <IconButton
                                          aria-label="edit"
                                          size="small"
                                          onClick={() =>
                                            handleEdit(row?.iTransId)
                                          }
                                        >
                                          <EditIcon
                                            fontSize="small"
                                            sx={{
                                              fontSize: 16,
                                              color: "#1b77e9",
                                            }}
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
                                            sx={{
                                              fontSize: 16,
                                              color: "#1b77e9",
                                            }}
                                          />
                                        </IconButton>
                                      </Tooltip>
                                      <Tooltip title="Reject" arrow>
                                        <IconButton
                                          aria-label="Reject"
                                          size="small"
                                          onClick={() =>
                                            handleApprove(
                                              2,
                                              "Reject",
                                              row.iTransId
                                            )
                                          }
                                        >
                                          <DisabledByDefaultIcon
                                            fontSize="small"
                                            sx={{
                                              fontSize: 16,
                                              color: "#1b77e9",
                                            }}
                                          />
                                        </IconButton>
                                      </Tooltip>
                                    </>
                                  ) : (
                                    "---"
                                  )}
                                </TableCell>
                              </TableRow>
                            ))}
                        </TableBody>
                      </Table>
                    </TableContainer>
                    <TablePagination
                      rowsPerPageOptions={[10, 25, 50, 100]}
                      component="div"
                      count={data.length}
                      rowsPerPage={rowsPerPage}
                      page={page}
                      onPageChange={handleChangePage}
                      onRowsPerPageChange={handleChangeRowsPerPage}
                      sx={{
                        display: "flex", // Use flexbox for the container
                        justifyContent: "space-between", // Space between the elements
                        alignItems: "center", // Center the elements vertically
                        ".MuiTablePagination-toolbar": {
                          justifyContent: "space-between",
                          alignItems: "center",
                          width: "100%", // Ensure the toolbar takes the full width
                        },
                        ".MuiTablePagination-spacer": {
                          flex: "1 1 100%", // Force the spacer to take up all available space
                        },
                        ".MuiTablePagination-selectLabel": {
                          margin: 0, // Adjust or remove margin as needed
                        },
                        ".MuiTablePagination-select": {
                          textAlign: "center", // Center the text inside the select input
                        },
                        ".MuiTablePagination-selectIcon": {},
                        ".MuiTablePagination-displayedRows": {
                          textAlign: "left", // Align the "1-4 of 4" text to the left
                          flexShrink: 0, // Prevent the text from shrinking
                          order: -1, // Place it at the beginning
                        },
                        ".MuiTablePagination-actions": {
                          flexShrink: 0, // Prevent the actions from shrinking
                        },
                        // Add other styles as needed
                      }}
                    />
                  </>
                ) : (
                  <>
                     <TableContainer
  sx={{ height: 100, display: "flex", alignItems: "center", justifyContent: "center" }}
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
    No Data
  </Typography>
</TableContainer>
                  </>
                )}
              </Paper>
            </Box>
          </Box>
        </>
      )}

      <Loader open={loader} handleClose={handleLoaderClose} />
    </>
  );
}
