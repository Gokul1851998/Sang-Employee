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
        <TableCell
          onClick={() => setDisplay(!display)}
          sx={{
            border: "1px solid #ddd",
            whiteSpace: "nowrap",
            color: "white",
            cursor: "pointer",
          }}
          component="th"
          scope="row"
          padding="normal"
          align="center"
        >
          Conditions
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

export default function ProjectTableList({ data, handleChildData }) {
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
  const [childData, setChildData] = React.useState();
  const [tableData, setTableData] = React.useState([]);
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

  const fetchData = async () => {
    if (Array.isArray(data) && data.length > 0) {
      setTableData(data);
    } else {
      setTableData([]);
      setPopup([]);
    }
  };

  React.useEffect(() => {
    fetchData();
  }, [data]);

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

  const handleRowData = (receive, index) => {
    if (index >= 0) {
      const update = [...tableData];
      update[index] = receive;
      setTableData(update);
    } else {
      setTableData((prevTableData) => [...prevTableData, receive]);
    }
    handleCloseModal();
  };

  React.useEffect(() => {
    handleChildData(tableData);
  }, [tableData]);

  const handleDeleteRow = (e, index) => {
    Swal.fire({
      title: "Are you sure?",
      text: "You want to delete this!",
      showCancelButton: true,
      confirmButtonColor: "#3085d6",
      cancelButtonColor: "#d33",
      confirmButtonText: "Yes",
    }).then(async (result) => {
      if (result.value) {
        const newDoc = [...tableData];
        newDoc.splice(index, 1);
        setTableData([...newDoc]);
        Swal.fire({
          title: "Deleted",
          text: "Your file has been deleted!",
          icon: "success",
          showConfirmButton: false,
          timer: 1500,
        });
      }
    });
  };

  const handleStatus = async (index) => {
    Swal.fire({
      text: "Enter Working Status",
      input: "text",
      inputAttributes: {
        autocapitalize: "off",
        maxlength: 200,
      },
      confirmButtonColor: "#3085d6",
      cancelButtonColor: "#d33",
      showCancelButton: true,
      confirmButtonText: `Update`,
      showLoaderOnConfirm: true,
      preConfirm: async (login) => {
        let update = [...tableData];
        update[index].sProgress = login;
        setTableData([...update]);
        Swal.fire({
          title: `Updated`,
          text: `Status Updated.`,
          icon: "success",
          showConfirmButton: false,
          timer: 1500,
        });
      },
    });
  };

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
          {tableData && tableData.length > 0 ? (
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
                            rowCount={tableData.length}
                            rows={Object.keys(tableData[0])}
                            setDisplay={setDisplay}
                            display={display}
                          />

                          <TableBody>
                            {tableData.map((row, index) => {
                              const labelId = `enhanced-table-checkbox-${row.iId}`;
                              const handleRowDoubleClick = async (
                                event,
                                iId
                              ) => {
                                handleEdit(event, row, index);
                              };
                              return (
                                <TableRow
                                  key={row.iId}
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
                                  <TableCell
                                    sx={{
                                      padding: 0.5,
                                      border: "1px solid #ddd",
                                      minWidth: "100px",
                                      whiteSpace: "nowrap",
                                      overflow: "hidden",
                                      textOverflow: "ellipsis",
                                      display: "flex",
                                      alignItems: "center",
                                      justifyContent: "center", // Center horizontally
                                    }}
                                    align="center"
                                  >
                                    <React.Fragment>
                                      <Tooltip title="Add row">
                                        <IconButton
                                          onClick={handleNewPage}
                                          size="small"
                                          style={{
                                            color: `#fff`, // Set text color
                                            backgroundColor: `#1b77e9`,
                                            marginRight: 2,
                                          }}
                                        >
                                          <AddIcon
                                            style={{ fontSize: "16px" }}
                                          />
                                        </IconButton>
                                      </Tooltip>
                                      {/* <Tooltip title="Edit row">
                                            <IconButton
                                              onClick={(e) =>
                                                handleEdit(e, row, index)
                                              }
                                              size="small"
                                              style={{
                                                color: `#fff`, // Set text color
                                                backgroundColor: `#1b77e9`,
                                                marginRight: 2,
                                              }}
                                            >
                                              <EditIcon
                                                style={{ fontSize: "16px" }}
                                              />
                                            </IconButton>
                                          </Tooltip> */}
                                      <Tooltip title="Delete row">
                                        <IconButton
                                          onClick={(e) =>
                                            handleDeleteRow(e, index)
                                          }
                                          size="small"
                                          style={{
                                            color: `#fff`, // Set text color
                                            backgroundColor: `#1b77e9`,
                                            marginRight: 2,
                                          }}
                                        >
                                          <DeleteIcon
                                            style={{ fontSize: "16px" }}
                                          />
                                        </IconButton>
                                      </Tooltip>
                                    </React.Fragment>
                                  </TableCell>
                                  {Object.keys(tableData[0]).map((column) => {
                                    if (column !== "iId") {
                                      return (
                                        <>
                                          {display ? (
                                            <TableCell
                                              sx={{
                                                border: "1px solid #ddd",
                                                whiteSpace: "nowrap",
                                              }}
                                              onClick={
                                                column === "sProgress"
                                                  ? () => handleStatus(index)
                                                  : null
                                              }
                                              key={row[column]}
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
                                              sx={{
                                                border: "1px solid #ddd",
                                                whiteSpace: "nowrap",
                                                overflow: "hidden",
                                                textOverflow: "ellipsis",
                                                width: "calc(100% / 6)",
                                                minWidth: "100px",
                                                maxWidth: 150,
                                              }}
                                              onClick={
                                                column === "sProgress"
                                                  ? () => handleStatus(index)
                                                  : null
                                              }
                                              key={row[column]}
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
      <ProjectModal
        isOpen={isModalOpen}
        data={isNewPage ? 0 : popup}
        handleCloseModal={handleCloseModal}
        handleRowData={handleRowData}
        rowIndex={rowIndex}
      />
      <Loader open={open} handleClose={handleClose} />
    </>
  );
}
