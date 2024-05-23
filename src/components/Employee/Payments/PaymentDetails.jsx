import React, { useEffect, useState } from "react";
import {
  Autocomplete,
  Box,
  Button,
  Grid,
  ListSubheader,
  Stack,
  TextField,
  Typography,
} from "@mui/material";
import AddIcon from "@mui/icons-material/Add";
import {
  MDBCard,
  MDBCardBody,
  MDBCardHeader,
  MDBCol,
  MDBInput,
  MDBRow,
} from "mdb-react-ui-kit";
import CloseIcon from "@mui/icons-material/Close";
import SaveIcon from "@mui/icons-material/Save";
import Swal from "sweetalert2";
import Loader from "../../Loader/Loader";
import DeleteIcon from "@mui/icons-material/Delete";
import DoDisturbIcon from "@mui/icons-material/DoDisturb";
import {
  deletePayment,
  getCategory,
  getDeleteExpense,
  getExpenseDetails,
  getPaymentDetails,
  getPaymentType,
  getSuspendExpense,
  postExpense,
  postPayment,
} from "../../../api/ApiCall";
import CloudUploadIcon from "@mui/icons-material/CloudUpload";
import ErrorMessage from "../../ErrorMessage/ErrorMessage";
import PaymentList from "./PaymentList";

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

export default function PaymentDetails({
  handleNavigate,
  data,
  type,
  setSelected,
}) {
  const iUser = Number(localStorage.getItem("userId"));
  const [open, setOpen] = React.useState(false);
  const [paymentType, setPaymentType] = useState("");
  const [suggestionPaymentType, setSuggestionPaymentType] = useState([]);
  const [amount, setAmount] = useState("");
  const [date, setDate] = useState(null);
  const [id, setId] = useState(0);
  const [remark, setRemark] = useState("");
  const [childData, setChildData] = useState();
  const [selectedFile, setSelectedFile] = useState(null);
  const [selectView, setSelectView] = useState(null);
  const [message, setMessage] = React.useState("");
  const [warning, setWarning] = React.useState(false);
  const [suspend, setSuspend] = useState(false);
  const [body, setBody] = useState([]);

  const handleFileChange = (event) => {
    const file = event.target.files[0];
    setSelectedFile(file);
  };

  const fetchData = async () => {
    handleClear();
    if (data !== 0) {
      handleOpen();
      setId(data);
      const response = await getPaymentDetails({ iId: data });
      handleClose();
      if (response?.Status === "Success") {
        const myObject = JSON.parse(response.ResultData);
       
        setAmount(myObject?.Table[0]?.fAmount);
        setPaymentType({
          sType: myObject?.Table[0]?.sType,
          iId: myObject?.Table[0]?.iPaymentType,
        });
        setDate(myObject?.Table[0]?.iDate);
        setRemark(myObject?.Table[0]?.sRemarks);
        setBody(myObject.Table1);
        const sPath = myObject?.Table[0]?.sPath?.replace(/\/$/, "");
        const sAttachment = myObject?.Table[0]?.sAttachment;

        if (sPath && sAttachment) {
          setSelectView(`${sPath}/${sAttachment}`);
        } else {
          setSelectView(null);
        }
      } else {
        handleClear();
      }
    } else {
      handleClear();
    }
  };
  useEffect(() => {
    fetchData();
  }, [data]);

  useEffect(() => {
    const fetchData = async () => {
      const response = await getPaymentType();
      if (response?.Status === "Success") {
        const myObject = JSON.parse(response?.ResultData);
        setSuggestionPaymentType(myObject);
      }
    };
    fetchData();
  }, []);

  useEffect(() => {
    const sumOfAmount = childData?.reduce(
      (accumulator, item) => accumulator + item.fAmount,
      0
    );
    setAmount(sumOfAmount);
  }, [childData]);

  const handleClose = () => {
    setOpen(false);
  };
  const handleOpen = () => {
    setOpen(true);
  };

  const handleDelete = async () => {
    Swal.fire({
      text: "Are you sure you want to Delete?",
      showCancelButton: true,
      confirmButtonColor: "#3085d6",
      cancelButtonColor: "#d33",
      confirmButtonText: "Yes",
    }).then(async (result) => {
      if (result.value) {
        handleOpen();
        const response = await deletePayment({
          iIds: id,
          iUser,
        });
        handleClose();
        if (response?.Status === "Success") {
          Swal.fire({
            title: "Deleted",
            text: "Expense Deleted!",
            icon: "success",
            showConfirmButton: false,
            timer: 1500,
          });
          handleAllClear();
        } else {
          setMessage("Can't delete");
          handleWarningOpen();
        }
      }
    });
  };

  const handleSuspend = async () => {
    Swal.fire({
      text: "Are you sure you want to Delete?",
      showCancelButton: true,
      confirmButtonColor: "#3085d6",
      cancelButtonColor: "#d33",
      confirmButtonText: "Yes",
    }).then(async (result) => {
      if (result.value) {
        handleOpen();
        const response = await getSuspendExpense({
          iIds: id,
          iUser,
          iType: suspend ? 2 : 1,
        });

        handleClose();
        if (response?.Status === "Success") {
          Swal.fire({
            title: "Suspended",
            text: "Expense Suspended!",
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

  const handleWarningClose = () => {
    setWarning(false);
  };
  const handleWarningOpen = () => {
    setWarning(true);
  };

  const handleSave = async (e) => {
    e.preventDefault();
    const isValidIdPresent = childData.some(
      (item) => item.fAmount !== 0 && item.fAmount !== ""
    );
    const sumOfAmount = childData.reduce(
      (accumulator, item) => accumulator + item.fAmount,
      0
    );
    const emptyFields = [];
    if (!childData.length) emptyFields.push("Fill atleast one pending payment");
    if (!isValidIdPresent) emptyFields.push("Fill all Amount");
    if (amount !== sumOfAmount)
      emptyFields.push("Total amount is not equal to the given amount");

    if (emptyFields.length > 0) {
      handleWarningOpen();
      setMessage(`${emptyFields[0]}.`);
      return;
    }
    const saveData = {
      iUser,
      iId: id,
      iType: paymentType?.iId,
      fAmount: amount,
      iDate: date,
      sRemarks: remark,
      sAttachment: selectedFile?.name ? selectedFile?.name : "",
      Body: childData,
    };
    const formData = new FormData();
    formData.append("data", JSON.stringify(saveData));
    formData.append("imageFiles", selectedFile);
    Swal.fire({
      text: "Are you sure you want to continue?",
      showCancelButton: true,
      confirmButtonColor: "#3085d6",
      cancelButtonColor: "#d33",
      confirmButtonText: "Yes",
    }).then(async (result) => {
      if (result.value) {
        handleOpen();
        const response = await postPayment(formData);
 
        handleClose();
        if (response?.Status === "Success") {
          Swal.fire({
            title: "Saved",
            text: "Project Updated!",
            icon: "success",
            showConfirmButton: false,
            timer: 1500,
          });

          handleAllClear();
        } else {
          setMessage(
            response?.MessageDescription
              ? response?.MessageDescription
              : "Something went wrong"
          );
          handleWarningOpen();
        }
      }
    });
  };

  const handleClear = () => {
    setId(0);
    setAmount("");
    setPaymentType("");
    setDate(getCurrentDate);
    setRemark("");
    setSelectedFile(null);
    setSelectView(null);
    setSuspend(null);
    setBody([]);
    setSelected([]);
  };

  const handleAllClear = () => {
    handleClear();
    handleNavigate();
  };

  const handleChildData = (data) => {
    setChildData(data);
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

  const handleUpload = () => {
    setSelectedFile(null);
    setSelectView(null);
  };

  const handleDownload = () => {
    if (selectView) {
      const imageExtensions = [
        "jpg",
        "jpeg",
        "png",
        "gif",
        "bmp",
        "webp",
        "xlsx",
      ];
      const fileNameParts = selectView.split("/").pop();
      const extension = fileNameParts[fileNameParts.length - 1].toLowerCase();

      if (imageExtensions.includes(extension)) {
        // Handle images: display in a new tab
        const htmlContent = `<html>
                               <head><title>Image Viewer</title></head>
                               <body><img src="${selectView}" style="max-width: 100%; height: auto;"></body>
                             </html>`;
        const blob = new Blob([htmlContent], { type: "text/html" });
        const url = URL.createObjectURL(blob);
        window.open(url, "_blank");
      } else {
        // It's an existing file, download it from the URL
        const link = document.createElement("a");
        link.href = selectView;
        link.download = selectView.split("/").pop();
        link.target = "_blank";
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
      }
    } else if (selectedFile) {
      const url = window.URL.createObjectURL(selectedFile);
      const link = document.createElement("a");
      link.href = url;
      link.download = selectedFile.name;
      document.body.appendChild(link);
      link.click();
      window.URL.revokeObjectURL(url);
      document.body.removeChild(link);
    }
  };

  return (
    <form onSubmit={handleSave}>
      <Grid container spacing={1} padding={1} alignItems="center">
        <Grid item xs={6}>
          <Typography
            variant="h6"
            id="tableTitle"
            component="div"
            sx={{
              textAlign: "left",
              paddingLeft: 2,
              fontSize: "16px",
              fontWeight: "semi",
            }}
          >
            Payments
          </Typography>
        </Grid>
        <Grid item xs={6}>
          <Stack direction="row" spacing={1} justifyContent="flex-end">
            <Button
              onClick={handleClear}
              size="small"
              variant="contained"
              startIcon={<AddIcon />}
              style={buttonStyle}
            >
              New
            </Button>
            <Button
              disabled={id !== 0}
              size="small"
              type="submit"
              variant="contained"
              startIcon={<SaveIcon />}
              style={id === 0 ? buttonStyle : buttonStyle2}
            >
              Save
            </Button>
            {type === 1 && (
              <Button
                onClick={handleSuspend}
                size="small"
                variant="contained"
                startIcon={<DoDisturbIcon />}
                style={buttonStyle}
              >
                {suspend ? "Unsuspend" : "Suspend"}
              </Button>
            )}
            <Button
              size="small"
              onClick={handleDelete}
              variant="contained"
              startIcon={<DeleteIcon />}
              style={buttonStyle}
            >
              Delete
            </Button>
          </Stack>
        </Grid>
      </Grid>
      <MDBCard
        className="text-center"
        style={{
          boxShadow: "0 4px 8px rgba(0, 0, 0, 0.3)",
          zIndex: 1,
          borderRadius: 2,
        }}
      >
        <>
          <div>
            <MDBCardBody>
              <MDBRow>
                <MDBCol lg="3" md="4" sm="6" xs="12">
                  <div className="mb-3">
                    <Autocomplete
                      readOnly={id !== 0}
                      id={`size-small-filled-assetType`}
                      size="small"
                      value={paymentType}
                      onChange={(event, newValue) => {
                        setPaymentType(newValue);
                      }}
                      options={suggestionPaymentType.map((data) => ({
                        sType: data.sType,
                        iId: data.iId,
                      }))}
                      filterOptions={(options, { inputValue }) => {
                        return options.filter((option) =>
                          option.sType
                            .toLowerCase()
                            .includes(inputValue.toLowerCase())
                        );
                      }}
                      autoHighlight
                      getOptionLabel={(option) =>
                        option && option.sType ? option.sType : ""
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
                              {option.sType}
                            </Typography>
                          </div>
                        </li>
                      )}
                      renderInput={(params) => (
                        <TextField
                          required
                          label="Payment Type"
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
                            },
                          }}
                        />
                      )}
                    />
                  </div>
                </MDBCol>

                <MDBCol lg="3" md="4" sm="6" xs="12">
                  <div className="mb-3">
                    <MDBInput
                      readOnly={id !== 0}
                      required
                      id={`form3Example`}
                      type="number"
                      size="small"
                      autoComplete="off"
                      label="Amount *"
                      value={amount == 0 ? "" : amount}
                      onChange={(e) => setAmount(Number(e.target.value))}
                      labelStyle={{
                        fontSize: "15px",
                      }}
                      style={{
                        cursor: "text",
                        color: "inherit",
                        backgroundColor: "transparent",
                        border: "none",
                        borderBottom: "1px solid #ced4da",
                      }}
                    />
                  </div>
                </MDBCol>
                <MDBCol lg="3" md="4" sm="6" xs="12">
                  <div className="mb-3">
                    <MDBInput
                      readOnly={id !== 0}
                      required
                      id={`form3Example`}
                      type="date"
                      size="small"
                      autoComplete="off"
                      label="Date *"
                      value={date}
                      onChange={(e) => setDate(e.target.value)}
                      //   min={getCurrentDate()}
                      labelStyle={{
                        fontSize: "15px",
                      }}
                      style={{
                        cursor: "text",
                        color: "inherit",
                        backgroundColor: "transparent",
                        border: "none",
                        borderBottom: "1px solid #ced4da",
                      }}
                    />
                  </div>
                </MDBCol>
                <MDBCol lg="3" md="4" sm="6" xs="12">
                  <div className="mb-3">
                    <MDBInput
                      readOnly={id !== 0}
                      id={`form3Example`}
                      type="text"
                      size="small"
                      autoComplete="off"
                      label="Remark"
                      value={remark}
                      onChange={(e) => setRemark(e.target.value)}
                      labelStyle={{
                        fontSize: "15px",
                      }}
                      style={{
                        cursor: "text",
                        color: "inherit",
                        backgroundColor: "transparent",
                        border: "none",
                        borderBottom: "1px solid #ced4da",
                      }}
                    />
                  </div>
                </MDBCol>
              </MDBRow>
              <MDBRow>
                <MDBCol>
                  <div>
                    {selectedFile || selectView ? (
                      <>
                        <div>
                          <div>
                            <strong>Selected File:</strong>{" "}
                            {selectedFile?.name
                              ? selectedFile.name
                              : selectView.split("/").pop()}
                          </div>
                          <Button
                            onClick={handleDownload}
                            type="button"
                            size="sm"
                          >
                            View
                          </Button>
                          <Button
                            onClick={handleUpload}
                            type="button"
                            size="sm"
                          >
                            Clear
                          </Button>
                        </div>
                      </>
                    ) : (
                      <div
                        className="file-upload-container"
                        style={{
                          textAlign: "center",
                          border: "3px dashed rgb(210, 227, 244)",

                          position: "relative",
                          cursor: "pointer",
                          height: "50px",
                        }}
                      >
                        <div>
                          <CloudUploadIcon style={{ color: "#adacac" }} />
                          <h3 style={{ fontSize: "0.75rem", color: "#adacac" }}>
                            Attachments
                          </h3>
                        </div>
                        <input
                          type="file"
                          aria-label="Choose a file to upload"
                          onChange={handleFileChange}
                          style={{
                            display: "block",

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
                </MDBCol>
              </MDBRow>

              <PaymentList
                data={body}
                id={id}
                handleChildData={handleChildData}
              />
            </MDBCardBody>
          </div>
        </>
      </MDBCard>

      {/* <ProjectTableList data={body} handleChildData={handleChildData} /> */}

      <Loader open={open} handleClose={handleClose} />
      <ErrorMessage
        open={warning}
        handleClose={handleWarningClose}
        message={message}
      />
    </form>
  );
}
