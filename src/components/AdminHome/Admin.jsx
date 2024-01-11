import * as React from "react";
import Box from "@mui/material/Box";
import Paper from "@mui/material/Paper";
import Loader from "../Loader/Loader";
import {
  Autocomplete,
  Button,
  ButtonGroup,
  IconButton,
  Stack,
  TextField,
} from "@mui/material";
import "mdb-react-ui-kit/dist/css/mdb.min.css";
import "@fortawesome/fontawesome-free/css/all.min.css";
import {
  getDailyTaskReport,
  getEmployee,
  postDailyTask,
} from "../../api/ApiCall";
import SearchIcon from "@mui/icons-material/Search";
import AdminList from "./AdminList";
import CloseIcon from "@mui/icons-material/Close";
import ErrorMessage from "../ErrorMessage/ErrorMessage";

export default function Admin() {
  const iUser = localStorage.getItem("userId");
  const [open, setOpen] = React.useState(false);
  const [message, setMessage] = React.useState();
  const [employee, setEmployee] = React.useState();
  const [employeeId, setEmployeeId] = React.useState(0);
  const [suggestionEmployee, setSuggestionEmployee] = React.useState([]);
  const [from, setFrom] = React.useState("");
  const [to, setTo] = React.useState("");
  const [data, setData] = React.useState([]);

  const buttonStyle = {
    textTransform: "none", // Set text transform to none for normal case
    color: "#FFFFFF", // Set text color
    backgroundColor: "#7581c6", // Set background color
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
      const response1 = await getEmployee({ iType: 1 });
      if (response1.Status === "Success") {
        const myObject1 = JSON.parse(response1.ResultData);
        setSuggestionEmployee(myObject1);
      }
    };
    fetchData();
  });

  const handleSubmit = async () => {
    if(from && to && employeeId !== 0){

    const FromDate = formatDate(from);
    const ToDate = formatDate(to);
    const response = await getDailyTaskReport({
      iEmployee: employeeId,
      FromDate,
      ToDate,
    });
    if (response.Status === "Success") {
      const myObject = JSON.parse(response.ResultData);
      setData(myObject.Table);
    }
            
}else{
    setMessage(`Fill all fields`);
    handleOpen();
}
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
  };

  return (
    <>
      <Box
        sx={{
          margin: 0,
          background: "#8c99e0",
          height: "150px",
          boxShadow: "0px 5px 15px rgba(0, 0, 0, 0.5)",
          display: "flex", // Make it a flex container
          alignItems: "center", // Center vertically
          justifyContent: "center", // Center horizontally
        }}
      >
        <Box
          sx={{
            width: "auto",
            zIndex: 1,
            textAlign: "center", // Center content within this Box
          }}
        >
          <Stack direction="row" paddingBottom={1} justifyContent="flex-end">
            <Button
              onClick={handleClear}
              variant="contained"
              startIcon={<CloseIcon />}
              style={buttonStyle}
            >
              Clear
            </Button>
          </Stack>
          <div
            style={{
              display: "flex", // Set display to flex
              alignItems: "center", // Center vertically
              justifyContent: "normal", // Space between components
              padding: "10px",
              boxShadow: "0px 5px 15px rgba(0, 0, 0, 0.3)",
              backgroundColor: "#ffff",
              // Make the div round
              overflow: "hidden", // Ensure content doesn't overflow
            }}
          >
            <Box
              component="form"
              sx={{
                "& > :not(style)": { m: 1, ml: 3, width: "35ch" },
              }}
              noValidate
              autoComplete="off"
            >
              <Autocomplete
                id="size-small-filled"
                size="small"
                value={employee || null}
                onChange={(event, newValue) => {
                  setEmployee(newValue || null);
                  setEmployeeId(newValue?.iId || 0);
                }}
                options={suggestionEmployee
                  .filter((data) => data !== undefined)
                  .map((data) => ({
                    sCode: data.sCode,
                    sName: data.sName,
                    iId: data.iId,
                  }))}
                filterOptions={(options, { inputValue }) => {
                  return options.filter(
                    (option) =>
                      option.sName
                        .toLowerCase()
                        .includes(inputValue.toLowerCase()) ||
                      option.sCode
                        .toLowerCase()
                        .includes(inputValue.toLowerCase())
                  );
                }}
                autoHighlight
                getOptionLabel={(option) =>
                  option && option.sName ? option.sName : ""
                }
                renderOption={(props, option) => (
                  <Box {...props}>
                    <p className="text-sm ">{option.sName}</p>
                    <p className="text-sm ml-auto pl-2">{option.sCode}</p>
                  </Box>
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
                  />
                )}
              />
            </Box>
            <Box
              readOnly
              component="form"
              sx={{
                "& > :not(style)": { m: 1, ml: 3, width: "35ch" },
              }}
              noValidate
              autoComplete="off"
            >
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
              />
            </Box>
            <Box
              component="form"
              sx={{
                "& > :not(style)": { m: 1, ml: 3, width: "35ch" },
              }}
              noValidate
              autoComplete="off"
            >
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
              />
            </Box>
            <Box
              readOnly
              component="form"
              sx={{
                "& > :not(style)": { m: 1, ml: 3 },
              }}
              noValidate
              autoComplete="off"
            >
              <IconButton
                onClick={handleSubmit}
                id="SearchVoucher"
                style={{ background: "#119def" }}
              >
                <SearchIcon />
              </IconButton>
            </Box>
          </div>
        </Box>

        {/* <Loader open={open} handleClose={handleClose} /> */}
      </Box>

      {data && data.length ? (
        <>
          <AdminList data={data} />
        </>
      ) : null}
      <ErrorMessage open={open} handleClose={handleClose} message={message} />
    </>
  );
}
