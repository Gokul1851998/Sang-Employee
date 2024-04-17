import * as React from "react";
import PropTypes from "prop-types";
import { alpha, styled } from "@mui/material/styles";
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
import Paper from "@mui/material/Paper";
import Checkbox from "@mui/material/Checkbox";
import IconButton from "@mui/material/IconButton";
import Tooltip, { tooltipClasses } from "@mui/material/Tooltip";
import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete";
import SettingsIcon from "@mui/icons-material/Settings";
import AddIcon from "@mui/icons-material/Add";
import PrintIcon from "@mui/icons-material/Print";
import CloseIcon from "@mui/icons-material/Close";
import { visuallyHidden } from "@mui/utils";
import Loader from "../Loader/Loader";
import {
  Accordion,
  AccordionDetails,
  AccordionSummary,
  Avatar,
  Button,
  ButtonGroup,
  TextField,
} from "@mui/material";
import SendIcon from "@mui/icons-material/Send";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import Stack from "@mui/material/Stack";
import { useLocation } from "react-router-dom";
import Swal from "sweetalert2";
import PhotoIcon from "@mui/icons-material/Photo";
import { MDBCardHeader } from "mdb-react-ui-kit";
import ProjectModal from "./ProjectModal";

function EnhancedTableHead(props) {
  const {
    rowCount,

    rows,
    setDisplay,
    display,
  } = props;

  return (
    <TableHead
      style={{
        background: `#1b77e9`,
        position: "sticky",
        top: 0,
        zIndex: "1",
      }}
    >
      <TableRow>
        <TableCell
          onClick={() => setDisplay(!display)}
          sx={{
            border: "1px solid #ddd",
            whiteSpace: "nowrap",
            color: "white",
            cursor: "pointer",
          }}
          align="center" // Set the alignment to left
        >
          Sl No
        </TableCell>

        {rows.map((header, index) => {
          if (header !== "iId") {
            // Exclude "iId", "iAssetType", and "sAltName" from the header
            return (
              <TableCell
                sx={{
                  border: "1px solid #ddd",
                  color: "white",
                  whiteSpace: "nowrap",
                  cursor: "pointer",
                }}
                key={index + header}
                align="left" // Set the alignment to left
                padding="normal"
                onClick={() => setDisplay(!display)}
              >
                {header === "sProgress" ? "Status" : header}
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
  rowCount: PropTypes.number.isRequired,
};

export default function ProjectEMPTable({ data, handleChildData }) {
  const iUser = localStorage.getItem("userId");
  const location = useLocation();
  const details = location.state;

  const [page, setPage] = React.useState(0);
  const [dense, setDense] = React.useState(true);
  const [open, setOpen] = React.useState(false);
  const [navigate, setNavigate] = React.useState(false);
  const [isModalOpen, setIsModalOpen] = React.useState(false);
  const [popup, setPopup] = React.useState();
  const [isNewPage, setIsNewPage] = React.useState(false);
  const [rowIndex, setRowIndex] = React.useState(-1);
  const [display, setDisplay] = React.useState(false);

  const buttonStyle = {
    textTransform: "none", // Set text transform to none for normal case
    color: `#fff`, // Set text color
    backgroundColor: `#1b77e9`, // Set background color
    boxShadow: "0px 5px 15px rgba(0, 0, 0, 0.3)",
  };

  const buttonStyle2 = {
    textTransform: "none", // Set text transform to none for normal case
    color: ` #1b77e9`, // Set text color
    backgroundColor: `#fff`, // Set background color
    boxShadow: "0px 5px 15px rgba(0, 0, 0, 0.3)",
  };
  const handleClose = () => {
    setOpen(false);
  };
  const handleOpen = () => {
    setOpen(true);
  };

  const suggestionRistLevel = [
    { iId: 1, sName: "Low" },
    { iId: 2, sName: "Medium" },
    { iId: 3, sName: "High" },
  ];

  React.useEffect(() => {}, [data]);

  const handleOpenModal = () => {
    setIsModalOpen(true);
  };

  const handleEdit = async (e, row, index) => {
    setPopup(row);
    setIsModalOpen(true);
    setRowIndex(index);
  };

  const handleNewPage = () => {
    setRowIndex(-1);
    setIsNewPage(true);
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setIsNewPage(false); // Reset the isNewPage state
  };

  const HtmlTooltip = styled(({ className, ...props }) => (
    <Tooltip {...props} classes={{ popper: className }} />
  ))(({ theme }) => ({
    [`& .${tooltipClasses.tooltip}`]: {
      backgroundColor: "#f5f5f9",
      color: "rgba(0, 0, 0, 0.87)",
      maxWidth: "auto",
      fontSize: theme.typography.pxToRem(12),
      border: "1px solid #dadde9",
    },
  }));

  return (
    <>
      <>
        <Box
          sx={{
            width: "auto",
            marginTop: 3,
            zIndex: 1,
            backgroundColor: "#ffff",
            borderRadius: 2,
            boxShadow: "0px 5px 15px rgba(0, 0, 0, 0.3)",
          }}
        >
          {data && data.length > 0 ? (
            <>
              <div>
                <Accordion defaultExpanded sx={{ padding: 0, margin: 0 }}>
                  <AccordionSummary
                    sx={{ paddingBottom: 0, marginLeft: 1 }}
                    expandIcon={<ExpandMoreIcon />}
                  >
                    <MDBCardHeader
                      style={{
                        display: "flex",
                        justifyContent: "flex-start",
                        paddingBottom: 0,
                      }}
                    >
                      <Typography
                        variant="h6"
                        component="h6"
                        style={{ fontSize: "16px" }}
                      >
                        Sub Task
                      </Typography>
                    </MDBCardHeader>
                  </AccordionSummary>
                  <AccordionDetails style={{ padding: 0, margin: 0 }}>
                    <Paper
                      sx={{
                        width: "100%",
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
                        }}
                      >
                        <Table
                          sx={{ minWidth: 750 }}
                          aria-labelledby="tableTitle"
                          size={dense ? "small" : "medium"}
                        >
                          <EnhancedTableHead
                            rowCount={data.length}
                            rows={Object.keys(data[0])}
                            setDisplay={setDisplay}
                            display={display}
                          />

                          <TableBody>
                            {data.map((row, index) => {
                              const labelId = `enhanced-table-checkbox-${row.iTransDtId}`;

                              return (
                                <TableRow
                                  key={row.iTransDtId}
                                  hover
                                  className={`table-row `}
                                  role="checkbox"
                                  tabIndex={-1}
                                  sx={{ cursor: "pointer" }}
                                >
                                  <TableCell
                                    sx={{
                                      border: "1px solid #ddd",
                                      whiteSpace: "nowrap",
                                    }}
                                    align="center"
                                  >
                                    {index + 1}
                                  </TableCell>

                                  {Object.keys(data[0]).map((column, index) => {
                                    if (column !== "iId") {
                                      return (
                                        <>
                                          {display ? (
                                            <TableCell
                                              sx={{
                                                border: "1px solid #ddd",
                                                whiteSpace: "nowrap",
                                              }}
                                              key={row[column]}
                                              component="th"
                                              id={labelId}
                                              scope="row"
                                              padding="normal"
                                              align="left"
                                            >
                                              {column === "iRiskLevel"
                                                ? suggestionRistLevel.find(
                                                    (item) =>
                                                      item.iId === row[column]
                                                  )?.sName || "Unknown"
                                                : row[column]}
                                            </TableCell>
                                          ) : (
                                            <TableCell
                                              sx={{
                                                border: "1px solid #ddd",
                                                whiteSpace: "nowrap",
                                                overflow: "hidden",
                                                textOverflow: "ellipsis",
                                                width: "calc(100% / 5)",
                                                minWidth: "100px",
                                                maxWidth: 150,
                                              }}
                                              key={row[column]}
                                              component="th"
                                              id={labelId}
                                              scope="row"
                                              padding="normal"
                                              align="left"
                                            >
                                              {column === "iRiskLevel"
                                                ? suggestionRistLevel.find(
                                                    (item) =>
                                                      item.iId === row[column]
                                                  )?.sName || "Unknown"
                                                : row[column]}
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
                    </Paper>
                  </AccordionDetails>
                </Accordion>
              </div>
            </>
          ) : (
            <>
              {/* <Stack
                direction="row"
                spacing={1}
                padding={1}
                justifyContent="flex-center"
              >
                <Button
                  onClick={handleOpenModal}
                  variant="contained"
                  startIcon={<AddIcon />}
                  style={buttonStyle}
                >
                  Add
                </Button>
              </Stack> */}
              <div
                className="file-upload-container"
                onClick={handleOpenModal}
                style={{
                  textAlign: "center",
                  border: "3px dashed rgb(210, 227, 244)",
                  padding: "0.2rem",
                  position: "relative",
                  cursor: "pointer",
                  borderRadius: 10,
                }}
              >
                <Button component="label">
                  <div>
                    <AddIcon style={{ color: "#4f4f4f" }} />
                    <h3
                      style={{
                        fontSize: "0.6rem",
                        color: "#4f4f4f",
                      }}
                    >
                      Add Sub Task
                    </h3>
                  </div>
                </Button>
              </div>
            </>
          )}
        </Box>
      </>

      <Loader open={open} handleClose={handleClose} />
    </>
  );
}
