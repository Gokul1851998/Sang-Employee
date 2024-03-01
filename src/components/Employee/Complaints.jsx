import * as React from "react";
import Box from "@mui/material/Box";
import Paper from "@mui/material/Paper";
import "./PurchaseTable.css";
import Loader from "../Loader/Loader";
import {
  MDBBtn,
  MDBCol,
  MDBInput,
  MDBRow,
  MDBTextArea,
} from "mdb-react-ui-kit";
import "mdb-react-ui-kit/dist/css/mdb.min.css";
import SearchIcon from "@mui/icons-material/Search";
import CloseIcon from "@mui/icons-material/Close";
import "@fortawesome/fontawesome-free/css/all.min.css";
import {
  complaintSummary,
  getComplaintType,
  getCustomer,
  getDailyTaskReport,
  getTaskType,
  postComplaints,
  postDailyTask,
} from "../../api/ApiCall";
import WorkHistoryIcon from "@mui/icons-material/WorkHistory";
import Swal from "sweetalert2";
import {
  Autocomplete,
  Button,
  IconButton,
  Stack,
  TextField,
  Typography,
} from "@mui/material";
import ErrorMessage from "../ErrorMessage/ErrorMessage";
import { format } from "date-fns";
import AdminList from "../AdminHome/AdminList";
import ComplaintsReport from "./ComplaintsReport";

const buttonStyle = {
  textTransform: "none", // Set text transform to none for normal case
  color: "#FFFFFF", // Set text color
  backgroundColor: "#1b77e9", // Set background color
};

export default function Compliants() {
  const iUser = Number(localStorage.getItem("userId"));
  const iEmployee = Number(localStorage.getItem("iEmployee"));
  const userName = localStorage.getItem("userName");
  const [open, setOpen] = React.useState(false);
  const [history, setHistory] = React.useState(false);
  const [warning, setWarning] = React.useState(false);
  const [message, setMessage] = React.useState();
  const [type, setType] = React.useState("");
  const [remark, setRemark] = React.useState("");
  const [suggestionType, setSuggestionType] = React.useState([]);
  const [dataId, setDataId] = React.useState(0);

  const handleClose = () => {
    setOpen(false);
  };
  const handleOpen = () => {
    setOpen(true);
  };

  const handleWarningClose = () => {
    setWarning(false);
  };
  const handleWarningOpen = () => {
    setWarning(true);
  };

  const newData = () => {
    setType("");
    setRemark("");
  };

  const handleData = async (e) => {
    e.preventDefault();
    const saveData = {
      iId: dataId,
      iUser,
      sRemarks: remark,
      iType: type?.iId,
    };
    Swal.fire({
      text: "Are you sure you want to continue?",
      showCancelButton: true,
      confirmButtonColor: "#3085d6",
      cancelButtonColor: "#d33",
      confirmButtonText: "Yes",
    }).then(async (result) => {
      if (result.value) {
        handleOpen();
        const response = await postComplaints(saveData);
        if (response?.Status === "Success") {
          Swal.fire({
            title: "Saved",
            text: "Complaint Updated!",
            icon: "success",
            showConfirmButton: false,
            timer: 1500,
          });
          newData();
        }
        handleClose();
        handleClear()
      }
    });
  };

  React.useEffect(() => {
    const fetchData = async () => {
      handleOpen();
      const response1 = await getComplaintType();
      if (response1.Status === "Success") {
        const myObject1 = JSON.parse(response1.ResultData);
        setSuggestionType(myObject1);
      }
      handleClose();
    };
    fetchData();
  }, []);

  const handleChildData = (data) => {
    const newType = suggestionType.filter(
      (item) => item.iId === data.ComplaintType
    );
    setType(newType[0]);
    setRemark(data?.Remarks);
    setDataId(data?.iId);
    setHistory(true);
  };

  const handleClear = () => {
    setDataId(0)
    setType("");
    setRemark("");
    setHistory(false);
  };

  return (
    <>
      <div style={{ display: "flex", alignItems: "center" }}>
        {history ? (
          <Button
            size="small"
            onClick={handleClear}
            sx={{
              backgroundColor: "#3b71ca",
              color: "white",
              float: "right",
              pl: 1,
              pr: 1,
              ml: "auto",
              textTransform: "none", // Set to 'none' to avoid automatic capitalization
              "&:hover": {
                backgroundColor: "#1f4e8a", // Your desired hover color
              },
            }}
          >
            Back
          </Button>
        ) : (
          <Button
            size="small"
            onClick={() => setHistory(true)}
            sx={{
              backgroundColor: "#3b71ca",
              color: "white",
              float: "right",
              pl: 1,
              pr: 1,
              ml: "auto",
              textTransform: "none", // Set to 'none' to avoid automatic capitalization
              "&:hover": {
                backgroundColor: "#1f4e8a", // Your desired hover color
              },
            }}
          >
            Register
          </Button>
        )}
      </div>
      <Box
        sx={{
          width: "auto",
          zIndex: 1,
          textAlign: "center", // Center content within this Box
        }}
      >
        {history ? (
          <>
            <Paper
              sx={{
                width: "100%",
                mt: 2,
                boxShadow: "0px 5px 15px rgba(0, 0, 0, 0.3)",
                textAlign: "center",
                display: "inline-block", // Add this to prevent the Paper from taking full width
              }}
            >
              <Box
                sx={{
                  p: 5,
                }}
              >
                <form onSubmit={handleData}>
                  <MDBRow className="mb-4">
                    <MDBCol>
                      <Autocomplete
                        id={`size-small-filled-assetType`}
                        size="small"
                        value={type}
                        onChange={(event, newValue) => {
                          setType(newValue);
                        }}
                        options={suggestionType.map((data) => ({
                          ComplaintType: data.ComplaintType,
                          ComplaintTypeCode: data.ComplaintTypeCode,
                          iId: data.iId,
                        }))}
                        filterOptions={(options, { inputValue }) => {
                          return options.filter((option) =>
                            option.ComplaintType.toLowerCase().includes(
                              inputValue.toLowerCase()
                            )
                          );
                        }}
                        autoHighlight
                        getOptionLabel={(option) =>
                          option && option.ComplaintType
                            ? option.ComplaintType
                            : ""
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
                                {option.ComplaintType}
                              </Typography>
                            </div>
                          </li>
                        )}
                        renderInput={(params) => (
                          <TextField
                            required
                            label="Type"
                            {...params}
                            inputProps={{
                              ...params.inputProps,
                              autoComplete: "off", // disable autocomplete and autofill
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
                        style={{ width: `15rem` }}
                      />
                    </MDBCol>
                  </MDBRow>
                  <MDBTextArea
                    required
                    value={remark}
                    autoComplete="off"
                    label="Remark"
                    maxLength={300}
                    id="textAreaExample"
                    onChange={(e) => setRemark(e.target.value)}
                    rows={4}
                  />
                  <MDBBtn type="submit" className="mb-4 mt-4" block>
                    Submit
                  </MDBBtn>
                </form>
              </Box>
            </Paper>
          </>
        ) : (
          <>
            <ComplaintsReport
              name={userName}
              changes={history}
              handleChildData={handleChildData}
            />
          </>
        )}

        <Loader open={open} handleClose={handleClose} />
        <ErrorMessage
          open={warning}
          handleClose={handleWarningClose}
          message={message}
        />
      </Box>
    </>
  );
}
