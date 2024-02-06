import { Autocomplete, Box, TextField, Typography } from "@mui/material";
import {
  MDBBtn,
  MDBCardHeader,
  MDBCol,
  MDBInput,
  MDBRow,
  MDBTextArea,
} from "mdb-react-ui-kit";
import React, { useEffect, useState } from "react";
import { getLeave_Type } from "../../api/ApiCall";
import CloudUploadIcon from "@mui/icons-material/CloudUpload";
import { IconButton } from "rsuite";

export default function LeaveForm() {
  const [leaveType, setLeaveType] = useState("");
  const [suggestionLeave, setSuggestionLeave] = useState([]);
  const [start, setStart] = useState("");
  const [end, setEnd] = useState("");
  const [total, setTotal] = useState("");
  const [reason, setReason] = useState("");
  const [phone, setPhone] = useState()
  const [email, setEmail] =useState("")
  useEffect(() => {
    const fetchData = async () => {
      // const response = await getLeaveApplicationDetails({})
      const response1 = await getLeave_Type();
      if (response1?.Status === "Success") {
        const myObject = JSON.parse(response1?.ResultData);
        setSuggestionLeave(myObject);
      } else {
        setSuggestionLeave([]);
      }
      const currentDate = new Date();
      const year = currentDate.getFullYear();
      const month = String(currentDate.getMonth() + 1).padStart(2, "0"); // Months are 0-based
      const day = String(currentDate.getDate()).padStart(2, "0");
      const formattedDate = `${year}-${month}-${day}`;
      setStart(formattedDate);
      setEnd(formattedDate);
    };
    fetchData();
  }, []);

  return (
    <Box
      sx={{
        p: 5,
      }}
    >
      <form>
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
              value={start}
              id="form3Example8"
              label="Start Date"
              onChange={(e) => setStart(e.target.value)}
              type="date"
            />
          </MDBCol>
        </MDBRow>
        <MDBRow className="mb-3">
          <MDBCol>
            <MDBInput
              required
              value={end}
              id="form3Example1"
              label="End Date"
              onChange={(e) => setEnd(e.target.value)}
              type="date"
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
            <MDBTextArea
              required
              value={reason}
              label="Reason"
              maxLength={300}
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
                  width: "80%", // Adjust width as needed
                  margin: "auto",
                  padding: "1rem",
                  background: "#ffffff",
                  borderRadius: "15px", // Reduced border radius
                  border: "1px solid #adacac",
                  maxWidth: "500px", // Maximum width for responsiveness
                }}
              >
                <div
                  className="file-upload"
                  style={{
                    textAlign: "center",
                    border: "3px dashed rgb(210, 227, 244)",
                    padding: "1rem", // Adjusted padding
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
              style={{ fontSize: "12px", textAlign: "center", fontWeight:"normal" }}
            >
              Empergency Contact Details
            </Typography>
          </MDBCardHeader>
        </MDBRow>
        <MDBRow className="mb-3">
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
        <MDBBtn type="submit" className="mb-4 mt-4" block>
          Submit
        </MDBBtn>
      </form>
    </Box>
  );
}
