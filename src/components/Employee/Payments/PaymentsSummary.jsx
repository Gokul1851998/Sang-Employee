import * as React from "react";
import PropTypes from "prop-types";
import Box from "@mui/material/Box";
import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableCell from "@mui/material/TableCell";
import TableContainer from "@mui/material/TableContainer";
import TableHead from "@mui/material/TableHead";
import TablePagination from "@mui/material/TablePagination";
import TableRow from "@mui/material/TableRow";
import TableSortLabel from "@mui/material/TableSortLabel";
import Toolbar from "@mui/material/Toolbar";
import Typography from "@mui/material/Typography";
import EditIcon from "@mui/icons-material/Edit";
import CloseIcon from "@mui/icons-material/Close";
import DeleteIcon from "@mui/icons-material/Delete";
import Paper from "@mui/material/Paper";
import { visuallyHidden } from "@mui/utils";
import {
  Autocomplete,
  Button,
  Checkbox,
  IconButton,
  Stack,
  TextField,
  ThemeProvider,
  Tooltip,
  createTheme,
} from "@mui/material";
import SaveIcon from "@mui/icons-material/Save";
import ZoomOutMapIcon from "@mui/icons-material/ZoomOutMap";
import ZoomInMapIcon from "@mui/icons-material/ZoomInMap";
import empty from "../../../assets/empty.png";
import AddIcon from "@mui/icons-material/Add";
import Loader from "../../Loader/Loader";
import { exportToExcel } from "../../Excel/ExcelForm";
import {
  getBalance,
  getDeleteExpense,
  getExpenseSummary,
  getPaymentSmmary,
  getSuspendExpense,
} from "../../../api/ApiCall";
import Swal from "sweetalert2";
import DoDisturbIcon from "@mui/icons-material/DoDisturb";
import ErrorMessage from "../../ErrorMessage/ErrorMessage";
import AccountBalanceWalletIcon from "@mui/icons-material/AccountBalanceWallet";
import PaymentDetails from "./PaymentDetails";

const theme = createTheme({
  palette: {
    primary: {
      main: "#7f437f",
      dark: "#9a589a",
    },
    secondary: {
      main: "#008bb6",
      dark: "#54abc6",
    },
  },
});

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
  color: ` #1b77e9`, // Set text color
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
          if (header !== "iId" && header !== "Employee") {
            // Exclude "iId", "iAssetType", and "sAltName" from the header
            return (
              <TableCell
                sx={{ border: "1px solid #ddd", cursor: "pointer" }}
                key={`${index}-${header}`}
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
  const { numSelected, values, changes, action, expandAction, expand } = props;

  return (
    <Toolbar
      sx={{
        mt: 2,
        flexDirection: { xs: "column", sm: "row" },
        alignItems: { xs: "start", sm: "center" },
      }}
    >
      <Box
        sx={{
          display: "flex",
          alignItems: "center",
          marginRight: { xs: 0, sm: 2 },
          marginBottom: { xs: 2, sm: 0 },
        }}
      >
        <Typography variant="h6" id="tableTitle" component="div">
          Payments
        </Typography>
      </Box>

      <Box
        sx={{
          flex: { xs: "auto", sm: "1" },
          display: "flex",
          justifyContent: "flex-end",
          gap: "10px",
        }}
      >
        <TextField
          id="search"
          label="Search"
          variant="outlined"
          value={values}
          onChange={changes}
          size="small"
          sx={{ marginRight: { xs: 0, sm: 1 } }} // Adjust margin for responsiveness
        />
      </Box>
    </Toolbar>
  );
}

EnhancedTableToolbar.propTypes = {
  numSelected: PropTypes.number.isRequired,
};

export default function PaymentsSummary({ id, type }) {
  const iUser = localStorage.getItem("userId");
  const iEmployee = Number(localStorage.getItem("iEmployee"));
  const [order, setOrder] = React.useState("asc");
  const [orderBy, setOrderBy] = React.useState(0);
  const [selected, setSelected] = React.useState([]);
  const [page, setPage] = React.useState(0);
  const [dense, setDense] = React.useState(true);
  const [searchQuery, setSearchQuery] = React.useState("");
  const [rowsPerPage, setRowsPerPage] = React.useState(10);
  const [open, setOpen] = React.useState(false);
  const [expand, setExpand] = React.useState(false);
  const [data, setData] = React.useState([]);
  const [details, setDetails] = React.useState(false);
  const [dataId, setDataId] = React.useState(0);
  const [message, setMessage] = React.useState("");
  const [warning, setWarning] = React.useState(false);
  const [pettyCash, setPettyCash] = React.useState(null);
  const [hrAmount, setHrAmount] = React.useState(null);
  const [cashType, setCashType] = React.useState(0)

  const handleWarningClose = () => {
    setWarning(false);
  };
  const handleWarningOpen = () => {
    setWarning(true);
  };

  const handleAdd = () => {
    setDataId(0);
    setDetails(true);
    setSelected([]);
  };
  const handleNavigate = () => {
    setDetails(false);
    fetchData();
  };
  const handleEdit = () => {
    const iId = selected.join();
    setDataId(iId);
    setDetails(true);
    setSelected([]);
  };

  const handleDelete = async () => {
    const iIds = selected.join();
    Swal.fire({
      text: "Are you sure you want to Delete?",
      showCancelButton: true,
      confirmButtonColor: "#3085d6",
      cancelButtonColor: "#d33",
      confirmButtonText: "Yes",
    }).then(async (result) => {
      if (result.value) {
        handleOpen();
        const response = await getDeleteExpense({ iIds, iUser });
        handleClose();
        if (response?.Status === "Success") {
          Swal.fire({
            title: "Deleted",
            text: "Expense Deleted!",
            icon: "success",
            showConfirmButton: false,
            timer: 1500,
          });
          fetchData();
        } else {
          setMessage("Can't delete");
          handleWarningOpen();
        }
      }
    });
  };

  React.useEffect(() => {
    fetchData();
  }, [id]);

  React.useEffect(() => {
    const fetchData = async () => {
      const response1 = await getBalance({ iType: 1 });
      if (response1.Status === "Success") {
        const myObject = JSON.parse(response1?.ResultData);
        setPettyCash(myObject[0]);
      }
      const response2 = await getBalance({ iType: 2 });
      if (response2.Status === "Success") {
        const myObject = JSON.parse(response2?.ResultData);
      
        setHrAmount(myObject[0]);
      }
    };
    fetchData();
  }, []);

  const fetchData = async () => {
    setSelected([]);
    setDetails(false);
    handleOpen();
    const response = await getPaymentSmmary({ iUser });
    handleClose();
    if (response.Status === "Success") {
      const myObject = JSON.parse(response.ResultData);
      setData(myObject);
    }
  };

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
    exportToExcel(data, `Expense Report`, Id);
  };

  const handleExpand = () => {
    setExpand(!expand);
  };

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

  const handleBalance = async (type) => {

  };

  return (
    <Box
      sx={{
        width: "auto",
        paddingLeft: 2,
        paddingRight: 2,
        paddingBottom: 2,
        zIndex: 1,
        minHeight: "590px",
        
      }}
    >
      <PaymentDetails />
      {details ? null : ( // <EmployeeExpenseDetails handleNavigate={handleNavigate} data={dataId} type={type} />
        <>
          <Stack
            direction="row"
            spacing={1}
            padding={1}
            justifyContent="flex-end"
          >
            <Button
              onClick={handleExpand}
              size="small"
              variant="contained"
              style={buttonStyle}
            >
              {expand ? (
                <ZoomInMapIcon style={{ fontSize: "large" }} />
              ) : (
                <ZoomOutMapIcon style={{ fontSize: "large" }} />
              )}
            </Button>
            <Button
              size="small"
              variant="contained"
              onClick={handleAdd}
              startIcon={<AddIcon />}
              style={buttonStyle}
            >
              Add
            </Button>
            <Button
              size="small"
              disabled={selected.length !== 1}
              variant="contained"
              onClick={handleEdit}
              startIcon={<EditIcon />}
              style={selected.length === 1 ? buttonStyle : buttonStyle2}
            >
              Edit
            </Button>

            <Button
              size="small"
              disabled={selected.length === 0}
              variant="contained"
              onClick={handleDelete}
              startIcon={<DeleteIcon />}
              style={selected.length !== 0 ? buttonStyle : buttonStyle2}
            >
              Delete
            </Button>
            <Button
              size="small"
              disabled={data.length === 0}
              variant="contained"
              onClick={handleExcel}
              startIcon={<SaveIcon />}
              style={data.length !== 0 ? buttonStyle : buttonStyle2}
            >
              Excel
            </Button>
            {/* <Button
              size="small"
              variant="contained"
              onClick={handleNavigate}
              startIcon={<CloseIcon />}
              style={buttonStyle}
            >
              Close
            </Button> */}
          </Stack>
          <Paper
            sx={{
              width: "100%",
              boxShadow: "0px 5px 15px rgba(0, 0, 0, 0.3)",
            }}
          >
            <EnhancedTableToolbar
              numSelected={selected.length}
              values={searchQuery}
              changes={handleSearch}
              expand={expand}
              expandAction={handleExpand}
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
                          setDetails(true);
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
                            sx={{
                              cursor: "pointer",
                              backgroundColor:
                                row.Suspended == "True" ? "#a5d0fc" : null,
                            }}
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
                              if (column !== "iId" && column !== "Employee") {
                                return (
                                  <>
                                    {expand ? (
                                      <TableCell
                                        sx={{
                                          padding: "4px",
                                          border: "1px solid #ddd",
                                          whiteSpace: "nowrap",
                                          width: `calc(100% / 6)`,
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
                                          width: `calc(100% / 6)`,
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
          {type === 1 && (
              <ThemeProvider theme={theme}>
              <Box
                sx={{
                  display: "flex",
                  justifyContent: "center",
                  alignItems: "center",
                  paddingTop: 2,
                  gap: 2, // Add gap between the boxes
                }}
              >
                <Box
                  sx={{
                    width: 200,
                    height: 100,
                    borderRadius: 1,
                    bgcolor: "primary.main",
                    display: "flex",
                    flexDirection: "column",
                    padding: 1,
                    paddingLeft: 2,
                    "&:hover": {
                      bgcolor: "secondary.dark",
                    },
                    cursor: "pointer", // Optional: Changes cursor to pointer to indicate it's clickable
                  }}
                  onClick={() => handleBalance(1)} // Add the onClick handler here
                >
                  <Typography variant="p" color="white">
                    {pettyCash?.sType}
                  </Typography>
                  <Box
                    sx={{
                      display: "flex",
                      justifyContent: "space-between",
                      alignItems: "center",
                    }}
                  >
                    <Typography variant="h6" color="white">
                      {pettyCash?.fAmount}/-
                    </Typography>
  
                    <AccountBalanceWalletIcon
                      style={{
                        fontSize: 50,
                        color: "#692969",
                      }}
                    />
                  </Box>
                </Box>
  
                <Box
                  sx={{
                    width: 200,
                    height: 100,
                    borderRadius: 1,
                    bgcolor: "secondary.main",
                    display: "flex",
                    flexDirection: "column",
                    padding: 1,
                    paddingLeft: 2,
                    "&:hover": {
                      bgcolor: "secondary.dark",
                    },
                    cursor: "pointer", // Optional: Changes cursor to pointer to indicate it's clickable
                  }}
                  onClick={() => handleBalance(2)} // Add the onClick handler here
                >
                  <Typography variant="p" color="white">
                    {hrAmount?.sType}
                  </Typography>
                  <Box
                    sx={{
                      display: "flex",
                      justifyContent: "space-between",
                      alignItems: "center",
                    }}
                  >
                    <Typography variant="h6" color="white">
                      {hrAmount?.fAmount}/-
                    </Typography>
  
                    <AccountBalanceWalletIcon
                      style={{
                        fontSize: 50,
                        color: "#026989",
                      }}
                    />
                  </Box>
                </Box>
              </Box>
            </ThemeProvider>
           )}
        
        </>
      )}
      <Loader open={open} handleClose={handleClose} />
      <ErrorMessage
        open={warning}
        handleClose={handleWarningClose}
        message={message}
      />
    </Box>
  );
}
