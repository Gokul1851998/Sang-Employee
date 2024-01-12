import * as React from "react";
import Box from "@mui/material/Box";
import Loader from "../Loader/Loader";
import {
  Autocomplete,
  Button,
  IconButton,
  Stack,
  TextField,
  Typography,
} from "@mui/material";
import "mdb-react-ui-kit/dist/css/mdb.min.css";
import "@fortawesome/fontawesome-free/css/all.min.css";
import { getDailyTaskReport, getEmployee } from "../../api/ApiCall";
import SearchIcon from "@mui/icons-material/Search";
import AdminList from "./AdminList";
import CloseIcon from "@mui/icons-material/Close";
import ErrorMessage from "../ErrorMessage/ErrorMessage";

export default function Admin() {
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
    if (from && to && employeeId !== 0) {
      const FromDate = formatDate(from);
      const ToDate = formatDate(to);
      const response = await getDailyTaskReport({
        iEmployee: employeeId,
        FromDate,
        ToDate,
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
          height: "auto", // Set height to "auto"
          boxShadow: "0px 5px 15px rgba(0, 0, 0, 0.5)",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
        }}
      >
        <Box
          sx={{
            width: "auto",
            padding: 2,
            zIndex: 1,
            textAlign: "center",
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
          <Stack
            direction={{ xs: "column", md: "row" }}
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
              value={employee || null}
              onChange={(event, newValue) => {
                setEmployee(newValue);
                setEmployeeId(newValue?.iId || null);
              }}
              options={suggestionEmployee}
              getOptionLabel={(option) => (option ? option.sName : "")}
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
              isOptionEqualToValue={(option, value) =>
                option?.iId === value?.iId
              }
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
                  sx={{ minWidth: 200 }} // Set the width for Autocomplete
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
              sx={{ minWidth: 200 }} // Set the width for TextField
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
              sx={{ minWidth: 200 }} // Set the width for TextField
            />
            <IconButton
              onClick={handleSubmit}
              id="SearchVoucher"
              style={{ background: "#8c99e0" }}
            >
              <SearchIcon style={{ color: "#ffffff" }} />
            </IconButton>
          </Stack>
        </Box>
      </Box>

      {data && data.length ? (
        <>
          <AdminList data={data} name={employee?.sName} />
        </>
      ) : null}
      <ErrorMessage open={open} handleClose={handleClose} message={message} />
    </>
  );
}
