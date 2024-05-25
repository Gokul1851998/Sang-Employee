import * as React from "react";
import { styled } from "@mui/material/styles";
import Card from "@mui/material/Card";

import CardContent from "@mui/material/CardContent";
import CardActions from "@mui/material/CardActions";
import Collapse from "@mui/material/Collapse";

import IconButton from "@mui/material/IconButton";
import Typography from "@mui/material/Typography";

import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import {
  Button,
  Checkbox,
  Stack,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  TextField,
} from "@mui/material";
import PaymentModal from "./PaymentModal";
import ErrorMessage from "../../ErrorMessage/ErrorMessage";

const ExpandMore = styled((props) => {
  const { expand, ...other } = props;
  return <IconButton {...other} />;
})(({ theme, expand }) => ({
  transform: !expand ? "rotate(0deg)" : "rotate(180deg)",
  marginLeft: "auto",
  transition: theme.transitions.create("transform", {
    duration: theme.transitions.duration.shortest,
  }),
}));

const buttonStyle = {
  textTransform: "none", // Set text transform to none for normal case
  color: ` #fff`, // Set text color
  backgroundColor: `#1b77e9`, // Set background color
  boxShadow: "0px 5px 15px rgba(0, 0, 0, 0.3)",
  fontSize: "12px",
  padding: "6px 10px",
};

export default function PaymentList({ data, id, handleChildData, amount,setValue }) {
  const [expanded, setExpanded] = React.useState(true);
  const [modal, setModal] = React.useState(false);
  const [body, setBody] = React.useState([]);
  const [message, setMessage] = React.useState("");
  const [warning, setWarning] = React.useState(false);

  const handleWarningClose = () => {
    setWarning(false);
  };
  const handleWarningOpen = () => {
    setWarning(true);
  };

  React.useEffect(() => {
    setBody(data);
  }, [data]);

  React.useEffect(() => {
    if (id === 0 && body?.length) {
      let remainingAmount = amount;
      const updatedBody = body.map((payment) => {
        const maxFunds = Math.min(payment.BalanceAmount, remainingAmount);
        remainingAmount -= maxFunds;
        return {
          ...payment,
          fAmount: maxFunds,
        };
      });
      const sumOfAmount = updatedBody.reduce(
        (accumulator, item) => accumulator + item.fAmount,
        0
      );

        setBody(updatedBody);
   
   
    }
  }, [amount,id,modal]);
  
  
  

  const handleModalOpen = () => {
    setModal(true);
  };

  const handleModalClose = () => {
    setModal(false);
  };

  const handleExpandClick = () => {
    setExpanded(!expanded);
  };

  const headers =
    body && body.length > 0
      ? Object.keys(body[0]).filter(
          (key) => key !== "iId" && key !== "Employee"
        )
      : [];

  const handleAmount = (e, row) => {
     if(body[row].BalanceAmount >= Number(e.target.value)){
      let update = [...body];
      update[row].fAmount = Number(e.target.value);
      setBody(update);
     }else{
       setMessage("Amount greater than Balance amount")
       handleWarningOpen()
     }
  
  };

  React.useEffect(() => {
    const extractedData = body.map((item) => {
      return {
        iExpense: item.iId,
        fAmount: item.fAmount,
      };
    });
    handleChildData(extractedData);
  }, [body]);

  return (
    <>
      <Stack direction="row" paddingTop={1} justifyContent="flex-end">
        {id === 0 ? (
          <>
            {body && body.length ? null : (
              <Button
                onClick={handleModalOpen}
                size="small"
                variant="contained"
                style={buttonStyle}
              >
                Pendings
              </Button>
            )}
          </>
        ) : null}
      </Stack>
      {body && body.length ? (
      <Card sx={{ marginTop: 2, boxShadow: "0 4px 8px rgba(0, 0, 0, 0.3)" }}>
        <CardActions
          sx={{ padding: 0, background: "#1b77e9", color: "white" }}
          disableSpacing
        >
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
            Sub Payments
          </Typography>
          <ExpandMore
            expand={expanded}
            onClick={handleExpandClick}
            aria-expanded={expanded}
            aria-label="show more"
          >
            <ExpandMoreIcon sx={{ color: "white" }} />
          </ExpandMore>
        </CardActions>
        <Collapse in={expanded} timeout="auto" unmountOnExit>
          <CardContent
            sx={{
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              justifyContent: "center",
            }}
          >
         
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
                <Table aria-labelledby="tableTitle" size={"small"}>
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
                      {headers
                        .filter(
                          (header) =>
                            header !== "iId" &&
                            header !== "iExpense" &&
                            header !== "iCategory" &&
                            header !== "iDate"
                        )
                        .map((header, index) => (
                          <TableCell
                            sx={{
                              border: "1px solid #ddd",
                              cursor: "pointer",
                              padding: "4px",
                              color: "white",
                            }}
                            key={`${index}-${header}`}
                            align="left"
                            padding="normal"
                          >
                            {header}
                          </TableCell>
                        ))}
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {body.map((row, index) => {
                      const labelId = `enhanced-table-checkbox-${index}`;

                      return (
                        <TableRow
                          key={row.iId}
                          hover
                          role="checkbox"
                          className={`table-row `}
                          tabIndex={-1}
                          sx={{
                            cursor: "pointer",
                          }}
                        >
                          <TableCell
                            style={{
                              padding: "4px",
                              border: "1px solid #ddd",
                            }}
                            padding="checkbox"
                            align="center"
                          >
                            {index + 1}
                          </TableCell>
                          {Object.keys(body[0]).map((column, index2) => {
                            if (
                              column !== "iId" &&
                              column !== "iExpense" &&
                              column !== "iCategory" &&
                              column !== "iDate"
                            ) {
                              return (
                                <>
                                  {column === "fAmount" && id === 0 ? (
                                    <TableCell
                                      style={{
                                        padding: 0,
                                        border: "1px solid #ddd",
                                        whiteSpace: "nowrap",
                                        overflow: "hidden",
                                        textOverflow: "ellipsis",
                                        width: `calc(100% / 4)`,
                                        minWidth: "100px",
                                        maxWidth: 150,
                                      }}
                                      key={index2 + labelId}
                                      component="th"
                                      id={labelId}
                                      scope="row"
                                      align="left"
                                    >
                                      <TextField
                                        size="small"
                                        type="number"
                                        id="search"
                                        value={row[column] === 0 ? " " : row[column]}
                                        onChange={(e) => handleAmount(e, index)}
                                        autoComplete="off"
                                        autoFocus
                                        sx={{
                                          width: "100%",
                                          zIndex: 0,
                                          "& .MuiInputBase-root": {
                                            height: 30, // Adjust the height of the input area
                                          },
                                          "& .MuiInputLabel-root": {
                                            transform:
                                              "translate(10px, 5px) scale(0.9)", // Adjust label position when not focused
                                          },
                                          "& .MuiInputLabel-shrink": {
                                            transform:
                                              "translate(14px, -9px) scale(0.75)", // Adjust label position when focused
                                          },
                                          "& .MuiInputBase-input": {
                                            fontSize: "1rem", // Adjust the font size of the input text
                                          },
                                          "&.Mui-focused .MuiOutlinedInput-notchedOutline":
                                            {
                                              borderColor: "currentColor", // Keeps the current border color
                                            },
                                        }}
                                      />
                                    </TableCell>
                                  ) : (
                                    <TableCell
                                      style={{
                                        padding: "4px",
                                        border: "1px solid #ddd",
                                        whiteSpace: "nowrap",
                                        overflow: "hidden",
                                        textOverflow: "ellipsis",
                                        width: `calc(100% / 4)`,
                                        minWidth: "100px",
                                        maxWidth: 150,
                                      }}
                                      key={index2 + labelId}
                                      component="th"
                                      id={labelId}
                                      scope="row"
                                      padding="normal"
                                      align="left"
                                    >
                                      {row[column]}{" "}
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
           
          </CardContent>
        </Collapse>
        </Card>
      ) : null}
        <PaymentModal
          handleCloseModal={handleModalClose}
          isOpen={modal}
          setBody={setBody}
        />
      <ErrorMessage
        open={warning}
        handleClose={handleWarningClose}
        message={message}
      />
    </>
  );
}
