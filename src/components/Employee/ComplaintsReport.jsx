import * as React from "react";
import PropTypes from "prop-types";
import Box from "@mui/material/Box";
import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableCell from "@mui/material/TableCell";
import TableContainer from "@mui/material/TableContainer";
import TableHead from "@mui/material/TableHead";
import AddIcon from "@mui/icons-material/Add";
import EditIcon from "@mui/icons-material/Edit";
import "@fortawesome/fontawesome-free/css/all.min.css";
import ZoomOutMapIcon from "@mui/icons-material/ZoomOutMap";
import ZoomInMapIcon from "@mui/icons-material/ZoomInMap";
import TablePagination from "@mui/material/TablePagination";
import TableRow from "@mui/material/TableRow";
import TableSortLabel from "@mui/material/TableSortLabel";
import Toolbar from "@mui/material/Toolbar";
import Typography from "@mui/material/Typography";
import Paper from "@mui/material/Paper";
import { visuallyHidden } from "@mui/utils";
import Loader from "../Loader/Loader";
import {
  Button,
  Checkbox,
  IconButton,
  Stack,
  TextField,
  Tooltip,
} from "@mui/material";
import SaveIcon from "@mui/icons-material/Save";
import { exportToExcel } from "../Excel/ExcelForm";
import empty from "../../assets/empty.png";
import {
  complaintSummary,
  deleteComplaints,
  getComplaints,
} from "../../api/ApiCall";
import DeleteIcon from "@mui/icons-material/Delete";
import Swal from "sweetalert2";
import ComplaintModal from "./ComplaintModal";

const buttonStyle = {
  textTransform: "none", // Set text transform to none for normal case
  color: ` #fff`, // Set text color
  backgroundColor: `#1b77e9`, // Set background color
  boxShadow: "0px 5px 15px rgba(0, 0, 0, 0.3)",
  fontSize: "12px",
  padding: "6px 10px",
};

const buttonStyle2 = {
  textTransform: "none", // Set text transform to none for normal case
  color: `#1b77e9`, // Set text color
  backgroundColor: `#fff`, // Set background color
  boxShadow: "0px 5px 15px rgba(0, 0, 0, 0.3)",
  fontSize: "12px",
  padding: "6px 10px",
};

function descendingComparator(a, b, orderBy) {
  if (b[orderBy] < a[orderBy]) {
    return -1;
  }
  if (b[orderBy] > a[orderBy]) {
    return 1;
  }
  return 0;
}

function getComparator(order, orderBy) {
  return order === "desc"
    ? (a, b) => descendingComparator(a, b, orderBy)
    : (a, b) => -descendingComparator(a, b, orderBy);
}

function stableSort(array, comparator) {
  const stabilizedThis = array.map((el, index) => [el, index]);
  stabilizedThis.sort((a, b) => {
    const order = comparator(a[0], b[0]);
    if (order !== 0) {
      return order;
    }
    return a[1] - b[1];
  });
  return stabilizedThis.map((el) => el[0]);
}

function EnhancedTableHead(props) {
  const { order, orderBy, rowCount, onRequestSort, rows } = props;
  const createSortHandler = (property) => (event) => {
    onRequestSort(event, property);
  };

  return (
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
        {rows.map((header, index) => {
          if (header !== "iId" && header !== "EmployeeName") {
            // Exclude "iId", "iAssetType", and "sAltName" from the header
            return (
              <TableCell
                sx={{
                  padding: "4px",
                  border: " 1px solid #ddd",
                  minWidth: "10px",
                  maxWidth: "20px",
                  whiteSpace: "nowrap",
                  overflow: "hidden",
                  textOverflow: "ellipsis",
                }}
                key={index}
                align="left" // Set the alignment to left
                padding="normal"
                sortDirection={orderBy === header ? order : false}
              >
                <TableSortLabel
                  className="text-white"
                  active={orderBy === header}
                  direction={orderBy === header ? order : "asc"}
                  onClick={createSortHandler(header)}
                >
                  {header}
                  {orderBy === header ? (
                    <Box component="span" sx={visuallyHidden}>
                      {order === "desc"
                        ? "sorted descending"
                        : "sorted ascending"}
                    </Box>
                  ) : null}
                </TableSortLabel>
              </TableCell>
            );
          }
        })}
      </TableRow>
    </TableHead>
  );
}

EnhancedTableHead.propTypes = {
  onRequestSort: PropTypes.func.isRequired,
  order: PropTypes.oneOf(["asc", "desc"]).isRequired,
  orderBy: PropTypes.string.isRequired,
  rowCount: PropTypes.number.isRequired,
};

function EnhancedTableToolbar(props) {
  const { numSelected, values, changes, action, data } = props;

  return (
    <Toolbar
      sx={{
        mt: 2,
      }}
    >
      <Typography
        sx={{ flex: "1 1 100%" }}
        variant="h6"
        id="tableTitle"
        component="div"
      >
        Complaints
      </Typography>
      {data && data.length ? (
        <>
          <TextField
            id="search"
            label="Search"
            variant="outlined"
            value={values}
            onChange={changes}
            size="small"
          />
        
        </>
      ) : null}
    </Toolbar>
  );
}

EnhancedTableToolbar.propTypes = {
  numSelected: PropTypes.number.isRequired,
};

export default function ComplaintsReport() {
  const iUser = localStorage.getItem("userId");
  const userName = localStorage.getItem("userName");
  const [order, setOrder] = React.useState("asc");
  const [orderBy, setOrderBy] = React.useState(0);
  const [selected, setSelected] = React.useState([]);
  const [data, setData] = React.useState([]);
  const [page, setPage] = React.useState(0);
  const [dense, setDense] = React.useState(true);
  const [searchQuery, setSearchQuery] = React.useState("");
  const [rowsPerPage, setRowsPerPage] = React.useState(10);
  const [open, setOpen] = React.useState(false);
  const [displayView, setDisplayView] = React.useState(false);
  const [isModalOpen, setIsModalOpen] = React.useState(false);
  const [dataId, setDataId] = React.useState(0);

  const handleOpenModal = () => {
    setDataId(0);
    setIsModalOpen(true);
  };
  const handleCloseModal = () => {
    setIsModalOpen(false);
    // setIsNewPage(false); // Reset the isNewPage state
  };
  const handleEdit = () => {
    const iId = selected.join();
    setDataId(Number(iId));
    setIsModalOpen(true);
  };

  const fetchData = async () => {
    handleOpen();
    const response = await complaintSummary({ iUser });
    handleClose();
    if (response.Status === "Success") {
      const myObject = JSON.parse(response.ResultData);
      if (myObject && myObject.Table.length) {
        setData(myObject.Table);
      } else {
        setData([]);
      }
    }
  };

  const handleDisplay = () => {
    setDisplayView(!displayView);
  };

  React.useEffect(() => {
    fetchData();
  }, []);

  const handleClose = () => {
    setOpen(false);
  };
  const handleOpen = () => {
    setOpen(true);
  };

  const handleRequestSort = (event, property) => {
    const isAsc = orderBy === property && order === "asc";
    setOrder(isAsc ? "desc" : "asc");
    setOrderBy(property);
  };

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

  // Avoid a layout jump when reaching the last page with empty rows.
  const isSelected = (id) => selected.indexOf(id) !== -1;
  const ignoredField = "iId";
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

  const visibleRows = React.useMemo(
    () =>
      stableSort(filteredRows, getComparator(order, orderBy)).slice(
        page * rowsPerPage,
        page * rowsPerPage + rowsPerPage
      ),
    [order, orderBy, page, rowsPerPage, filteredRows]
  );

  const handleExcel = () => {
    const Id = ["iId"];
    exportToExcel(data, `${userName ? userName : "Employee"} Report`, Id);
  };

  const handleDelete = async () => {
    const iId = selected.join();
    Swal.fire({
      text: "Are you sure you want to Delete?",
      showCancelButton: true,
      confirmButtonColor: "#3085d6",
      cancelButtonColor: "#d33",
      confirmButtonText: "Yes",
    }).then(async (result) => {
      if (result.value) {
        handleOpen();
        const response = await deleteComplaints({ iId, iUser });
        if (response?.Status === "Success") {
          Swal.fire({
            title: "Deleted",
            text: "Complaint Deleted!",
            icon: "success",
            showConfirmButton: false,
            timer: 1500,
          });
          fetchData();
        }
        handleClose();
      }
    });
  };

 const handleSaveSubmit = ()=>{
  fetchData()
 }

  const handleClick = (event, id) => {
    const selectedIndex = selected.indexOf(id);
    let newSelected = [];

    if (selectedIndex === -1) {
      newSelected = newSelected.concat(selected, id);
    } else if (selectedIndex === 0) {
      newSelected = newSelected.concat(selected.slice(1));
    } else if (selectedIndex === selected.length - 1) {
      newSelected = newSelected.concat(selected.slice(0, -1));
    } else if (selectedIndex > 0) {
      newSelected = newSelected.concat(
        selected.slice(0, selectedIndex),
        selected.slice(selectedIndex + 1)
      );
    }
    setSelected(newSelected);
  };
  return (
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
      <Stack direction="row" spacing={1} padding={1} justifyContent="flex-end">
        <Button
          size="small"
          disabled={data?.length === 0}
          onClick={handleDisplay}
          variant="contained"
          sx={data?.length? buttonStyle : buttonStyle2}
        >
          {displayView ? (
            <ZoomInMapIcon style={{ fontSize: "large" }} />
          ) : (
            <ZoomOutMapIcon style={{ fontSize: "large" }} />
          )}
        </Button>
        <Button
          size="small"
          onClick={handleOpenModal}
          variant="contained"
          startIcon={<AddIcon />}
          sx={buttonStyle}
        >
          Add
        </Button>
        <Button
          size="small"
          disabled={selected.length !== 1}
          onClick={handleEdit}
          variant="contained"
          startIcon={<EditIcon />}
          sx={selected.length === 1? buttonStyle : buttonStyle2}
        >
          Edit
        </Button>
        <Button
          size="small"
          disabled={data?.length === 0}
          onClick={handleExcel}
          variant="contained"
          startIcon={<SaveIcon />}
          sx={data?.length? buttonStyle : buttonStyle2}
        >
          Excel
        </Button>
        <Button
          size="small"
          disabled={selected.length !== 1}
          onClick={handleDelete}
          variant="contained"
          startIcon={<DeleteIcon />}
          sx={selected.length === 1? buttonStyle : buttonStyle2}
        >
          Delete
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
            boxShadow: "0px 5px 15px rgba(0, 0, 0, 0.3)",
          }}
        >
          <EnhancedTableToolbar
            action={handleExcel}
            numSelected={selected.length}
            values={searchQuery}
            changes={handleSearch}
            data={data}
          />

          {data && data.length > 0 ? (
            <>
              <TableContainer
                style={{
                  display: "block",
                  maxHeight: "calc(100vh - 400px)",
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
                  size={dense ? "small" : "medium"}
                >
                  <EnhancedTableHead
                    order={order}
                    orderBy={orderBy}
                    onRequestSort={handleRequestSort}
                    rowCount={filteredRows.length}
                    rows={Object.keys(data[0])}
                  />

                  <TableBody>
                    {visibleRows.map((row, index) => {
                      const isItemSelected = isSelected(row.iId);
                      const labelId = `enhanced-table-checkbox-${index}`;

                      const handleRowDoubleClick = async (event, iId) => {
                        setDataId(iId);
                        setIsModalOpen(true);
                      };
                      return (
                        <TableRow
                          key={row.iId}
                          hover
                          onClick={(event) => handleClick(event, row.iId)}
                          onDoubleClick={(event) =>
                            handleRowDoubleClick(event, row.iId)
                          }
                          role="checkbox"
                          aria-checked={isItemSelected}
                          className={`table-row `}
                          tabIndex={-1}
                          selected={isItemSelected}
                          sx={{ cursor: "pointer" }}
                        >
                          <TableCell padding="checkbox" align="center">
                            <Checkbox
                              color="primary"
                              checked={isItemSelected}
                              inputProps={{
                                "aria-labelledby": labelId,
                              }}
                            />
                          </TableCell>
                          {Object.keys(data[0]).map((column, index) => {
                            if (column !== "iId" && column !== "EmployeeName") {
                              return (
                                <>
                                  {displayView ? (
                                    <TableCell
                                      sx={{
                                        padding: "4px",
                                        border: "1px solid #ddd",
                                        whiteSpace: "nowrap",
                                        width: "calc(100% / 3)",
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
                                  ) : (
                                    <TableCell
                                      style={{
                                        padding: "4px",
                                        border: "1px solid #ddd",
                                        whiteSpace: "nowrap",
                                        overflow: "hidden",
                                        textOverflow: "ellipsis",
                                        width: "calc(100% / 3)",
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
                                  )}
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
              <TableContainer sx={{ marginBottom: 2 }} component={Paper}>
                <img
                  className="p-5"
                  srcSet={`${empty}`}
                  src={`${empty}`}
                  alt={empty}
                  loading="lazy"
                  style={{ width: "450px" }}
                />
              </TableContainer>
            </>
          )}
        </Paper>
        <Loader open={open} handleClose={handleClose} />
      </Box>
      <ComplaintModal
        isOpen={isModalOpen}
        handleCloseModal={handleCloseModal}
        data={dataId}
        handleSaveSubmit={handleSaveSubmit}
      />
    </Box>
  );
}
