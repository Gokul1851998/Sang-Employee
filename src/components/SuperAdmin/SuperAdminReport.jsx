import * as React from "react";
import Box from "@mui/material/Box";
import PropTypes from "prop-types";
import Loader from "../Loader/Loader";
import {
  Autocomplete,
  Button,
  Grid,
  IconButton,
  Paper,
  Stack,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TablePagination,
  TableRow,
  TableSortLabel,
  TextField,
  Toolbar,
  Typography,
} from "@mui/material";
import "mdb-react-ui-kit/dist/css/mdb.min.css";
import "@fortawesome/fontawesome-free/css/all.min.css";
import {
  getCustomer,
  getDailyTaskReport,
  getEmployee,
  getTaskType,
} from "../../api/ApiCall";
import SearchIcon from "@mui/icons-material/Search";
import CloseIcon from "@mui/icons-material/Close";
import ErrorMessage from "../ErrorMessage/ErrorMessage";
import AdminList from "../AdminHome/AdminList";

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
    <TableHead>
      <TableRow>
        <TableCell padding="checkbox"></TableCell>
        {rows.map((header, index) => {
          if (header !== "iId") {
            // Exclude "iId", "iAssetType", and "sAltName" from the header
            return (
              <TableCell
                sx={{ border: "1px solid #ddd" }}
                key={index}
                align="left" // Set the alignment to left
                padding="normal"
                sortDirection={orderBy === header ? order : false}
              >
                <TableSortLabel
                  className="text-dark"
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
  const { numSelected, values, changes } = props;

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
        Report
      </Typography>

      <TextField
        id="search"
        label="Search"
        variant="outlined"
        value={values}
        onChange={changes}
        size="small"
      />
    </Toolbar>
  );
}

EnhancedTableToolbar.propTypes = {
  numSelected: PropTypes.number.isRequired,
};

export default function SuperAdminReport() {
  const iUser = localStorage.getItem("userId");
  const [open, setOpen] = React.useState(false);
  const [message, setMessage] = React.useState();
  const [employee, setEmployee] = React.useState();
  const [employeeId, setEmployeeId] = React.useState(0);
  const [suggestionEmployee, setSuggestionEmployee] = React.useState([]);
  const [from, setFrom] = React.useState("");
  const [to, setTo] = React.useState("");
  const [data, setData] = React.useState([]);
  const [loader, setLoader] = React.useState(false);
  const [suggestionTask, setSuggestionTask] = React.useState([]);
  const [suggestionCustomer, setSuggestionCustomer] = React.useState([]);
  const [taskId, setTaskId] = React.useState(0);
  const [taskName, setTaskName] = React.useState({});
  const [customerId, setCustomerId] = React.useState(0);
  const [customer, setCustomer] = React.useState({});

  const handleLoaderClose = () => {
    setLoader(false);
  };
  const handleLoaderOpen = () => {
    setLoader(true);
  };

  const buttonStyle = {
    textTransform: "none", // Set text transform to none for normal case
    color: "#FFFFFF", // Set text color
    backgroundColor: "#74227a", // Set background color
  };

  const handleClose = (event, reason) => {
    if (reason === "clickaway") {
      return;
    }
    setOpen(false);
  };
  const handleOpen = () => {
    setOpen(true);
  };

  React.useEffect(() => {
    const fetchData = async () => {
      handleLoaderOpen();
      const response1 = await getEmployee({ iType: 1 });
      if (response1.Status === "Success") {
        const myObject1 = JSON.parse(response1.ResultData);
        setSuggestionEmployee(myObject1);
      }
      const response3 = await getTaskType();
      if (response3.Status === "Success") {
        const myObject3 = JSON.parse(response3.ResultData);
        setSuggestionTask(myObject3);
      }
      const response2 = await getCustomer();
      if (response2.Status === "Success") {
        const myObject2 = JSON.parse(response2.ResultData);
        setSuggestionCustomer(myObject2);
      }
      handleLoaderClose();
      const currentDate = new Date();
      const year = currentDate.getFullYear();
      const month = String(currentDate.getMonth() + 1).padStart(2, "0"); // Months are 0-based
      const day = String(currentDate.getDate()).padStart(2, "0");
      const formattedDate = `${year}-${month}-${day}`;
      setFrom(formattedDate);
      setTo(formattedDate)
    };
    fetchData();
  }, []);

  const handleSubmit = async () => {
    handleLoaderOpen();
    if (from && to) {
      const FromDate = formatDate(from);
      const ToDate = formatDate(to);
      const response = await getDailyTaskReport({
        iEmployee: employeeId,
        FromDate,
        ToDate,
        iCustomer: customerId,
        iTaskType: taskId,
      });
      if (response.Status === "Success") {
        const myObject = JSON.parse(response.ResultData);
        if (myObject && myObject.Table.length) {
          setData(myObject.Table);
        } else {
          setMessage(`No data found`);
          handleOpen();
          setData([]);
        }
      }
    } else {
      setMessage(`Fill both From & To date`);
      handleOpen();
    }
    handleLoaderClose();
  };

  function formatDate(inputDate) {
    const dateObject = new Date(inputDate);

    const year = dateObject.getFullYear();
    const month = String(dateObject.getMonth() + 1).padStart(2, "0");
    const day = String(dateObject.getDate()).padStart(2, "0");

    return `${year}/${month}/${day}`;
  }

  const handleClear = async () => {
    setData([]);
    setEmployee();
    setEmployeeId(0);
    setFrom("");
    setTo("");
    setCustomer({});
    setCustomerId(0);
    setTaskName({});
    setTaskId(0);
  };

  return (
    <>
      <Box
        sx={{
          width: "auto",
          padding: 2,
          zIndex: 1,
          textAlign: "center",
        }}
      >
        <Stack
         sx={{
          maxWidth: 1300,
          textAlign: 'center', // Center the content horizontally
          margin: 'auto', // Center the content vertically
          '@media (max-width: 750px)': {
            margin: '10px', // Adjust the margin for smaller screens
           // Adjust the padding for smaller screens
          },
        }}
        direction={{ xs: 'column', md:'column', lg:'row' }}
        alignItems="center"
        spacing={2}
        padding={2}
        boxShadow="0px 5px 15px rgba(0, 0, 0, 0.3)"
        bgcolor="#ffff"
        borderRadius={2}
        overflow="hidden"
        >
          <Autocomplete
            id="size-small-filled"
            size="small"
            value={employee || ""}
            onChange={(event, newValue) => {
              setEmployee(newValue);
              setEmployeeId(newValue?.iId || 0);
            }}
            options={suggestionEmployee}
            getOptionLabel={(option) => (option ? option.sName : "")}
            filterOptions={(options, { inputValue }) => {
              return options.filter(
                (option) =>
                  option.sName
                    .toLowerCase()
                    .includes(inputValue.toLowerCase()) ||
                  option.sCode.toLowerCase().includes(inputValue.toLowerCase())
              );
            }}
            isOptionEqualToValue={(option, value) => option?.iId === value?.iId}
            autoHighlight
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
                  <Typography
                    style={{
                      marginLeft: "auto",
                      fontSize: "12px",
                      fontWeight: "normal",
                    }}
                  >
                    {option.sCode}
                  </Typography>
                </div>
              </li>
            )}
            renderInput={(params) => (
              <TextField
                required
                label="Employee"
                className="form-control"
                {...params}
                inputProps={{
                  ...params.inputProps,
                  autoComplete: "new-password", // disable autocomplete and autofill
                }}
                sx={{ minWidth: 200, flex: 1 }} // Set the width for Autocomplete and make it flexible
              />
            )}
          />

          <TextField
            required
            type="date"
            size="small"
            className="form-control"
            value={from}
            inputProps={{
              maxLength: 150,
            }}
            onChange={(e) => {
              const inputValue = e.target.value;
              setFrom(inputValue);
            }}
            label="From Date"
            variant="outlined"
            InputLabelProps={{
              shrink: true, // Set shrink to true when there is a value
            }}
            sx={{ minWidth: 200, flex: 1 }} // Set the width for TextField
          />
          <TextField
            required
            type="date"
            size="small"
            className="form-control"
            value={to}
            onChange={(e) => {
              const inputValue = e.target.value;
              setTo(inputValue);
            }}
            label="To Date"
            variant="outlined"
            InputLabelProps={{
              shrink: true, // Set shrink to true when there is a value
            }}
            sx={{ minWidth: 200, flex: 1 }} // Set the width for TextField
          />

          <Autocomplete
            id="size-small-filled"
            size="small"
            value={taskName}
            onChange={(event, newValue) => {
              setTaskId(newValue?.iId || 0), setTaskName(newValue);
            }}
            options={suggestionTask.map((data) => ({
              sName: data.sName,
              sCode: data.sCode,
              iId: data?.iId,
            }))}
            filterOptions={(options, { inputValue }) => {
              return options.filter((option) =>
                option.sName.toLowerCase().includes(inputValue.toLowerCase())
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
                label="Task Type"
                className="form-control"
                {...params}
                inputProps={{
                  ...params.inputProps,
                  autoComplete: "new-password", // disable autocomplete and autofill
                }}
                sx={{ minWidth: 200 }} // Set the width for Autocomplete
              />
            )}
          />

          <Autocomplete
            id="size-small-filled"
            size="small"
            value={customer}
            onChange={(event, newValue) => {
              setCustomerId(newValue?.iId || 0), setCustomer(newValue);
            }}
            options={suggestionCustomer.map((data) => ({
              sName: data.sName,
              sCode: data.sCode,
              iId: data?.iId,
            }))}
            filterOptions={(options, { inputValue }) => {
              return options.filter((option) =>
                option.sName.toLowerCase().includes(inputValue.toLowerCase())
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
                label="Customer"
                className="form-control"
                {...params}
                inputProps={{
                  ...params.inputProps,
                  autoComplete: "new-password", // disable autocomplete and autofill
                }}
                sx={{ minWidth: 200 }} // Set the width for Autocomplete
              />
            )}
          />
          <IconButton
            onClick={handleSubmit}
            id="SearchVoucher"
            style={{ background: "#74227a" }}
          >
            <SearchIcon style={{ color: "#ffffff" }} />
          </IconButton>
          <Button
            sx={{ margin: 1 }}
            onClick={handleClear}
            variant="contained"
            startIcon={<CloseIcon />}
            style={buttonStyle}
          >
            Clear
          </Button>
        </Stack>
      </Box>
      {data && data.length ? (
        <>
          <AdminList data={data} name={employee?.sName} />
        </>
      ) : null}
      {/* <Loader open={open} handleClose={handleClose} /> */}
      <Loader open={loader} handleClose={handleLoaderClose} />
      <ErrorMessage open={open} handleClose={handleClose} message={message} />
    </>
  );
}
