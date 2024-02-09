import {
  Autocomplete,
  Box,
  Button,
  Stack,
  TextField,
  Typography,
  Zoom,
} from "@mui/material";
import {
  MDBBtn,
  MDBCardHeader,
  MDBCol,
  MDBInput,
  MDBRow,
  MDBTextArea,
} from "mdb-react-ui-kit";
import React, { useEffect, useState } from "react";
import {
  getLeaveApplicationDetails,
  getLeave_Type,
  postLeaveApplication,
} from "../../api/ApiCall";
import CloudUploadIcon from "@mui/icons-material/CloudUpload";
import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableCell from "@mui/material/TableCell";
import TableContainer from "@mui/material/TableContainer";
import TableHead from "@mui/material/TableHead";
import TableRow from "@mui/material/TableRow";
import Paper from "@mui/material/Paper";
import Swal from "sweetalert2";
import ReplyIcon from "@mui/icons-material/Reply";
import Loader from "../Loader/Loader";

export default function LeaveForm({ setChange, id }) {
  const iUser = Number(localStorage.getItem("userId"));
  const iEmployee = Number(localStorage.getItem("iEmployee"));
  const [leaveType, setLeaveType] = useState("");
  const [suggestionLeave, setSuggestionLeave] = useState([]);
  const [start, setStart] = useState("");
  const [end, setEnd] = useState("");
  const [total, setTotal] = useState("");
  const [reason, setReason] = useState("");
  const [phone, setPhone] = useState();
  const [email, setEmail] = useState("");
  const [createdDate, setCreatedDate] = useState("");
  const [isOpen, setIsOpen] = useState(false);
  const [tableData, setTableData] = useState([]);
  const [iTransId, setITransId] = useState(0);
  const [loader, setLoader] = useState(false);

  const [selectedFile, setSelectedFile] = useState(null);
  const handleFileChange = (event) => {
    const file = event.target.files[0];
    setSelectedFile(file);
  };

  const handleUpload = () => {
    setSelectedFile(null);
  };

  const handleLoaderClose = () => {
    setLoader(false);
  };

  const handleLoaderOpen = () => {
    setLoader(true);
  };

  const dayType = [
    { sName: "Full Day", iId: 0 },
    { sName: "Half Day", iId: 1 },
  ];
  const sessionType = [
    { sName: "Morning", iId: 0 },
    { sName: "Afternoon", iId: 1 },
  ];

  useEffect(() => {
    const fetchData = async () => {
        handleLoaderOpen()
      if (id) {
        const response = await getLeaveApplicationDetails({ iTransId: id });
        if (response?.Status === "Success") {
          const myObject = JSON.parse(response?.ResultData);
          setTotal(myObject?.Table[0]?.fNoOfDays || "");
          setITransId(myObject?.Table[0]?.iTransId || 0);
          setReason(myObject?.Table[0]?.sReason || "");
          setEmail(myObject?.Table[0]?.sEmail || "");
          setStart(formatDate(myObject?.Table[0]?.sFromDate) || "");
          const newFileName = myObject?.Table[0]?.sFileName;
          if (newFileName) {
            setSelectedFile({ name: newFileName || null });
          }

          setEnd(formatDate(myObject?.Table[0]?.sToDate) || "");
          const foundObject = suggestionLeave.find(
            (item) => item.iid === myObject?.Table[0]?.iLeaveType
          );
          const { iid, ...newData } = foundObject;

          newData.iId = iid;

          setLeaveType(newData);
          setPhone(myObject?.Table[0]?.sMob || "");
          setCreatedDate(formatDate(myObject?.Table[0]?.CreatedDate) || "");
          setTableData(
            myObject.Table1.map(({ sDate, iType, iHalfDay }) => ({
              sDate,
              iType,
              iHalfDay,
            }))
          );
        }
      } else {
        const currentDate = new Date();
        const year = currentDate.getFullYear();
        const month = String(currentDate.getMonth() + 1).padStart(2, "0"); // Months are 0-based
        const day = String(currentDate.getDate()).padStart(2, "0");
        const formattedDate = `${year}-${month}-${day}`;
        setStart(formattedDate);
        setEnd(formattedDate);
        setCreatedDate(formattedDate);
      }
      handleLoaderClose()
    };
    fetchData();
  }, [suggestionLeave]);

  const formatDate = (inputDate) => {
    if (!inputDate) return "";

    const parts = inputDate.split("-");
    if (parts.length === 3) {
      const [day, month, year] = parts;
      return `${year}-${month}-${day}`;
    } else {
      return "";
    }
  };

  useEffect(() => {
    const fetchData = async () => {
        handleLoaderOpen()
      const response1 = await getLeave_Type();
      if (response1?.Status === "Success") {
        const myObject = JSON.parse(response1?.ResultData);
        setSuggestionLeave(myObject);
      } else {
        setSuggestionLeave([]);
      }
      handleLoaderClose()
    };
    fetchData();
  }, []);

  const handleModalOpen = () => {
    setIsOpen(true);
  };

  const handleModalClose = () => {
    setIsOpen(false);
  };

  const modalStyle = {
    display: isOpen ? "block" : "none",
  };

  useEffect(() => {
    const startDate = new Date(start);
    const endDate = new Date(end);
    const dateArray = [];

    for (
      let currentDate = new Date(startDate);
      currentDate <= endDate;
      currentDate.setDate(currentDate.getDate() + 1)
    ) {
      const formattedDate = currentDate.toISOString().split("T")[0]; // Get the ISO string and extract the date part
      dateArray.push({
        sDate: formattedDate,
        iHalfDay: 0,
        iType: 0,
      });
    }

    setTableData(dateArray);
  }, [start, end]);

  useEffect(()=>{
    let totalHalfDay = 0;

    tableData.forEach((entry) => {
      if (entry.iHalfDay === 1) {
        totalHalfDay += 0.5;
      } else if (entry.iHalfDay === 0) {
        totalHalfDay += 1;
      }
    });
    
    setTotal(totalHalfDay)
  },[tableData])

  const updateType = () => {
    handleModalClose();
  };

  const handleSave = async (e) => {
    e.preventDefault();

    let data = {
      iTransId: iTransId,
      iEmployee,
      iLeaveType: leaveType?.iId,
      sReason: reason,
      sFromDate: start,
      sToDate: end,
      fNoOfDays: total,
      sTelephone: phone,
      sMob: phone,
      sEmail: email,
      Body: tableData,
      iUser,
      //   CreatedDate: createdDate,
      sFileName: selectedFile?.name,
    };
    const formData = new FormData();
    formData.append("data", JSON.stringify(data));
    formData.append("imageFiles",selectedFile);

    Swal.fire({
      text: "Are you sure you want to continue?",
      showCancelButton: true,
      confirmButtonColor: "#3085d6",
      cancelButtonColor: "#d33",
      confirmButtonText: "Yes",
    }).then(async (result) => {
      if (result.value) {
        handleLoaderOpen()
        const response = await postLeaveApplication(formData);
        if (response?.Status === "Success") {
          Swal.fire({
            title: "Updated",
            text: "Task Updated!",
            icon: "success",
            showConfirmButton: false,
            timer: 1500,
          });
          setChange(false);
        } else {
          Swal.fire({
            icon: "error",
            title: `Already Exist`,
            text: `${response?.MessageDescription}`,
          });
        }
        handleLoaderClose()
      }
    });
  };

  const handleCloseLeave = () => {
    setChange(false);
  };

  const getCurrentDate = () => {
    const currentDate = new Date();
    const year = currentDate.getFullYear();
    let month = currentDate.getMonth() + 1;
    month = month < 10 ? `0${month}` : month;
    let day = currentDate.getDate();
    day = day < 10 ? `0${day}` : day;
    return `${year}-${month}-${day}`;
  };

  useEffect(()=>{
     if(total <= 0){
      setEnd(start)
     }
  },[total])
 
  return (
    <>
      <div style={{ display: "flex", alignItems: "center" }}>
        <Button
          onClick={handleCloseLeave}
          size="small"
          startIcon={<ReplyIcon />}
          style={{ backgroundColor: "#3b71ca", color: "white" }}
        ></Button>
        {/* Other content goes here */}
      </div>
      <Box
        sx={{
          p: 2,
        }}
      >
        <form onSubmit={handleSave}>
          
          <MDBRow className="mb-2">
            <MDBCol>
              <MDBInput
                required
                value={start}
                id="form3Example1"
                label="Start Date"
                onChange={(e) => setStart(e.target.value)}
                type="date"
                min={getCurrentDate()}
                style={{ marginBottom: 10 }}
              />
            </MDBCol>
            <MDBCol>
              <MDBInput
                required
                value={end}
                id="form3Example1"
                label="End Date"
                onChange={(e) => setEnd(e.target.value)}
                min={getCurrentDate()}
                type="date"
              />
            </MDBCol>
          </MDBRow>
          <MDBRow className="mb-3">
            <MDBCol>
              <Autocomplete
                id={`size-small-filled-assetType`}
                size="small"
                value={leaveType}
                onChange={(event, newValue) => {
                  setLeaveType(newValue);
                }}
                options={suggestionLeave.map((data) => ({
                  sName: data.sName,
                  sCode: data.sCode,
                  iId: data?.iid,
                }))}
                filterOptions={(options, { inputValue }) => {
                  return options.filter((option) =>
                    option.sName
                      .toLowerCase()
                      .includes(inputValue.toLowerCase())
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
                    label="Leave Type"
                    {...params}
                    inputProps={{
                      ...params.inputProps,
                      autoComplete: "new-password", // disable autocomplete and autofill
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
                style={{ width: `auto` }}
              />
            </MDBCol>
            <MDBCol>
              <MDBInput
                required
                id="form3Example2"
                value={total}
                label="Total Leave"
                onChange={(e) => setTotal(e.target.value)}
                type="number"
              />
            </MDBCol>
          </MDBRow>
          <MDBRow className="mb-3">
            <MDBCol>
              <MDBBtn
                onClick={handleModalOpen}
                type="button"
                size="sm"
                style={{ width: "50%" }}
              >
                View Leave
              </MDBBtn>
            </MDBCol>
          </MDBRow>
          <MDBRow className="mb-3">
            <MDBCol>
              <MDBTextArea
                required
                value={reason}
                label="Reason"
                maxLength={200}
                id="textAreaExample"
                onChange={(e) => setReason(e.target.value)}
                rows={2}
              />
            </MDBCol>
          </MDBRow>

          <MDBRow className="mb-3">
            <MDBCol>
              <div className="app">
                <div
                  className="parent"
                  style={{
                    width: "80%",
                    margin: "auto",
                    padding: "1rem",
                    background: "#ffffff",
                    borderRadius: "15px",
                    border: "1px solid #adacac",
                    maxWidth: "500px",
                  }}
                >
                  {selectedFile ? (
                    <>
                      <div>
                        <strong>Selected File:</strong> {selectedFile.name}
                      </div>
                      <Button
                        onClick={handleUpload}
                        type="button"
                        size="sm"
                        style={{ width: "50%" }}
                      >
                        Clear
                      </Button>
                    </>
                  ) : (
                    <div
                      className="file-upload-container"
                      style={{
                        textAlign: "center",
                        border: "3px dashed rgb(210, 227, 244)",
                        padding: "1rem",
                        position: "relative",
                        cursor: "pointer",
                      }}
                    >
                      <div>
                        <CloudUploadIcon style={{ color: "#adacac" }} />
                        <h3 style={{ fontSize: "1rem", color: "#adacac" }}>
                          Attachments
                        </h3>
                      </div>
                      <input
                        type="file"
                        aria-label="Choose a file to upload"
                        onChange={handleFileChange}
                        style={{
                          display: "block",
                          height: "100%",
                          width: "100%",
                          position: "absolute",
                          top: "0",
                          bottom: "0",
                          left: "0",
                          right: "0",
                          opacity: "0",
                          cursor: "pointer",
                        }}
                      />
                    </div>
                  )}
                </div>
              </div>
            </MDBCol>
          </MDBRow>
          <MDBRow className="mb-3">
            <MDBCardHeader
              style={{
                display: "flex",
                justifyContent: "center", // Align content center
              }}
            >
              <Typography
                variant="h6"
                component="h6"
                style={{
                  fontSize: "16px",
                  textAlign: "center",
                  fontWeight: "bold",
                }}
              >
                Empergency Contact Details
              </Typography>
            </MDBCardHeader>
          </MDBRow>
          <MDBRow className="mb-2">
            <MDBCol>
              <MDBInput
                required
                value={email}
                id="form3Example1"
                label="Email Id"
                onChange={(e) => setEmail(e.target.value)}
                type="email"
              />
            </MDBCol>
            <MDBCol>
              <MDBInput
                required
                id="form3Example2"
                value={phone}
                label="Mobile"
                onChange={(e) => setPhone(e.target.value)}
                type="tel"
              />
            </MDBCol>
          </MDBRow>
          <MDBBtn type="submit" className="mt-3" block>
            Submit
          </MDBBtn>
        </form>
      </Box>
      <div>
        <div
          className={`modal-backdrop fade ${isOpen ? "show" : ""}`}
          style={{
            display: isOpen ? "block" : "none",
            backgroundColor: "rgba(0, 0, 0, 0.7)",
          }}
        ></div>

        <Zoom in={isOpen} timeout={isOpen ? 400 : 300}>
          <div
            className={`modal ${isOpen ? "modal-open" : ""}`}
            style={modalStyle}
          >
            <div className="modal-dialog modal-dialog-centered modal-md">
              <div
                className="modal-content"
                style={{
                  maxHeight: "85vh", // Adjust the maximum height as needed
                  overflowY: "auto", // Add a scrollbar if the content exceeds the height
                }}
              >
                <form>
                  <Box
                    sx={{
                      width: "auto",
                      paddingBottom: 3,
                      paddingLeft: 1,
                      paddingRight: 1,
                      zIndex: 1,
                      backgroundColor: "#ffff",
                      borderRadius: 2,
                    }}
                  >
                    <Stack
                      direction="row"
                      spacing={1}
                      padding={2}
                      justifyContent="flex-end"
                    >
                      <MDBBtn
                        onClick={updateType}
                        type="button"
                        size="sm"
                        style={{ width: "20%" }}
                      >
                        Apply
                      </MDBBtn>
                    </Stack>

                    <TableContainer component={Paper}>
                      <Table size="small" aria-label="simple table">
                        <TableHead
                          style={{
                            position: "sticky",
                            top: 0,
                            zIndex: "0.5",
                          }}
                        >
                          <TableRow>
                            <TableCell
                              sx={{
                                border: "1px solid #ddd",
                                whiteSpace: "nowrap",
                              }}
                              component="th"
                              scope="row"
                              padding="normal"
                              align="center"
                            >
                              Date
                            </TableCell>
                            <TableCell
                              sx={{
                                border: "1px solid #ddd",
                                whiteSpace: "nowrap",
                              }}
                              component="th"
                              scope="row"
                              padding="normal"
                              align="center"
                            >
                              Day
                            </TableCell>
                            <TableCell
                              sx={{
                                border: "1px solid #ddd",
                                whiteSpace: "nowrap",
                              }}
                              component="th"
                              scope="row"
                              padding="normal"
                              align="center"
                            >
                              Session
                            </TableCell>
                          </TableRow>
                        </TableHead>
                        <TableBody>
                          {tableData &&
                            tableData.map((row, index) => (
                              <TableRow key={index}>
                                <TableCell
                                  sx={{
                                    border: "1px solid #ddd",
                                    whiteSpace: "nowrap",
                                    width: "100px",
                                  }}
                                  key={row.sDate}
                                  component="th"
                                  scope="row"
                                  padding="normal"
                                  align="center"
                                >
                                  {row.sDate}
                                </TableCell>
                                <TableCell
                                  sx={{
                                    border: "1px solid #ddd",
                                    whiteSpace: "nowrap",
                                    width: "120px",
                                  }}
                                  component="th"
                                  scope="row"
                                  padding="normal"
                                  align="center"
                                >
                                  <Autocomplete
                                    id={`size-small-filled-assetType`}
                                    size="small"
                                    value={
                                      row.iHalfDay == 0
                                        ? { sName: "Full Day" }
                                        : { sName: "Half Day" }
                                    }
                                    onChange={(event, newValue) => {
                                      const update = [...tableData];
                                      update[index].iHalfDay = newValue.iId;
                                      setTableData(update);
                                    }}
                                    options={dayType.map((data) => ({
                                      sName: data.sName,
                                      iId: data?.iId,
                                    }))}
                                    filterOptions={(
                                      options,
                                      { inputValue }
                                    ) => {
                                      return options.filter((option) =>
                                        option.sName
                                          .toLowerCase()
                                          .includes(inputValue.toLowerCase())
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
                                        {...params}
                                        inputProps={{
                                          ...params.inputProps,
                                          autoComplete: "new-password", // disable autocomplete and autofill
                                          style: {
                                            borderColor: "#ddd",
                                            borderRadius: "10px",
                                            fontSize: "15px",
                                            height: "15px",
                                          },
                                        }}
                                      />
                                    )}
                                  />
                                </TableCell>
                                <TableCell
                                  sx={{
                                    border: "1px solid #ddd",
                                    whiteSpace: "nowrap",
                                    width: "120px",
                                  }}
                                  key={row.Date}
                                  component="th"
                                  scope="row"
                                  padding="normal"
                                  align="center"
                                >
                                  {row.iHalfDay === 0 ? null : (
                                    <Autocomplete
                                      id={`size-small-filled-assetType`}
                                      size="small"
                                      value={
                                        row.iType == 0
                                          ? { sName: "Morning" }
                                          : { sName: "Afternoon" }
                                      }
                                      onChange={(event, newValue) => {
                                        const update = [...tableData];
                                        update[index].iType = newValue.iId;
                                        setTableData(update);
                                      }}
                                      options={sessionType.map((data) => ({
                                        sName: data.sName,
                                        iId: data?.iId,
                                      }))}
                                      filterOptions={(
                                        options,
                                        { inputValue }
                                      ) => {
                                        return options.filter((option) =>
                                          option.sName
                                            .toLowerCase()
                                            .includes(inputValue.toLowerCase())
                                        );
                                      }}
                                      autoHighlight
                                      getOptionLabel={(option) =>
                                        option && option.sName
                                          ? option.sName
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
                                              {option.sName}
                                            </Typography>
                                          </div>
                                        </li>
                                      )}
                                      renderInput={(params) => (
                                        <TextField
                                          required
                                          {...params}
                                          inputProps={{
                                            ...params.inputProps,
                                            autoComplete: "new-password", // disable autocomplete and autofill
                                            style: {
                                              borderColor: "#ddd",
                                              borderRadius: "10px",
                                              fontSize: "15px",
                                              height: "15px",
                                            },
                                          }}
                                        />
                                      )}
                                    />
                                  )}
                                </TableCell>
                              </TableRow>
                            ))}
                        </TableBody>
                      </Table>
                    </TableContainer>
                  </Box>
                </form>
              </div>
            </div>
          </div>
        </Zoom>
      </div>
      <Loader open={loader} handleClose={handleLoaderClose} />
    </>
  );
}
