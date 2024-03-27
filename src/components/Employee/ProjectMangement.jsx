import * as React from "react";
import PropTypes from "prop-types";
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
import { visuallyHidden } from "@mui/utils";
import Loader from "../Loader/Loader";
import {
  Autocomplete,
  Button,
  IconButton,
  Stack,
  TextField,
  Tooltip,
} from "@mui/material";
import SaveIcon from "@mui/icons-material/Save";
import { exportToExcel } from "../Excel/ExcelForm";
import ZoomOutMapIcon from "@mui/icons-material/ZoomOutMap";
import ZoomInMapIcon from "@mui/icons-material/ZoomInMap";
import { getProjectSummary, getTaskType } from "../../api/ApiCall";
import empty from "../../assets/empty.png";
import ProjectModal from "./ProjectModal";
import ProjectDetails from "./ProjectDetails";
import AddIcon from "@mui/icons-material/Add";

const buttonStyle = {
    textTransform: "none", // Set text transform to none for normal case
    color: ` #fff`, // Set text color
    backgroundColor: `#1b77e9`, // Set background color
    boxShadow: "0px 5px 15px rgba(0, 0, 0, 0.3)",
    fontSize: "12px",
    padding: "6px 10px",
  };

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
    <TableHead
      style={{
        background: `#1976d2`,
        position: "sticky",
        top: 0,
        zIndex: "5",
      }}
    >
      <TableRow>
        {rows.map((header, index) => {
          if (header !== "iId") {
            // Exclude "iId", "iAssetType", and "sAltName" from the header
            return (
              <TableCell
                sx={{ border: "1px solid #ddd", cursor: "pointer" }}
                key={`${index}-${header}`}
                align="left" // Set the alignment to left
                padding="normal"
                sortDirection={orderBy === header ? order : false}
              >
                <TableSortLabel
                  className="text-white"
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
  const {
    numSelected,
    values,
    changes,
    action,
    expandAction,
    expand,
    setTypeName,
    typeName,
    suggestionTask,
  } = props;

  return (
    <Toolbar sx={{ mt: 2 }}>
      <Box sx={{ display: "flex", alignItems: "center" }}>
        <Box sx={{ marginRight: 2 }}>
          {" "}
          {/* Add marginRight for space */}
          <Typography variant="h6" id="tableTitle" component="div">
            Project Management
          </Typography>
        </Box>
        <Box sx={{ marginRight: 2 }}> {/* Add marginRight for space */}</Box>
      </Box>

      <Box
        sx={{
          flex: "1",
          display: "flex",
          justifyContent: "flex-end",
          paddingRight: 2,
        }}
      >
        <TextField
          id="search"
          label="Search"
          variant="outlined"
          value={values}
          onChange={changes}
          size="small"
          sx={{ marginRight: 1 }} // Add margin to create space
        />
        <Box sx={{ display: "flex", alignItems: "center" }}>
          <Tooltip title="Excel" arrow>
            <IconButton onClick={action} aria-label="Excel">
              <SaveIcon />
            </IconButton>
          </Tooltip>
        </Box>
      </Box>
    </Toolbar>
  );
}

EnhancedTableToolbar.propTypes = {
  numSelected: PropTypes.number.isRequired,
};

export default function ProjectMangement() {
  const iUser = localStorage.getItem("userId");
  const [order, setOrder] = React.useState("asc");
  const [orderBy, setOrderBy] = React.useState(0);
  const [selected, setSelected] = React.useState([]);
  const [page, setPage] = React.useState(0);
  const [dense, setDense] = React.useState(true);
  const [searchQuery, setSearchQuery] = React.useState("");
  const [rowsPerPage, setRowsPerPage] = React.useState(10);
  const [open, setOpen] = React.useState(false);
  const [expand, setExpand] = React.useState(false);
  const [data, setData] = React.useState([]);
  const [type, setType] = React.useState([]);
  const [typeName, setTypeName] = React.useState("");
  const [details, setDetails] = React.useState(false);
  const [dataId, setDataId] = React.useState(0);

  const handleAdd = () => {
    setDataId(0);
    setDetails(true);
  };
  const handleNavigate = () => {
    setDetails(false);
    // setIsNewPage(false); // Reset the isNewPage state
  };
  const handleEdit = () => {
    const iId = selected.join();
    setDataId(Number(iId));
    setDetails(true);
  };

  React.useEffect(() => {   
    const fetchData = async () => {
      const response = await getTaskType();
      if (response.Status === "Success") {
        const myObject = JSON.parse(response.ResultData);
        setType(myObject);
      }
    };
    fetchData();
  }, []);

  React.useEffect(() => {
    fetchData();
  }, [typeName]);

  const fetchData = async () => {
    const response = await getProjectSummary({
      iUser,
      iTaskType: type?.iId ? type?.iId : 0,
    });
    console.log(response);
  };

  const handleClose = () => {
    setOpen(false);
  };
  const handleOpen = () => {
    setOpen(true);
  };

  const handleRequestSort = (event, property) => {
    const isAsc = orderBy === property && order === "asc";
    setOrder(isAsc ? "desc" : "asc");
    setOrderBy(property);
  };

  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };

  const handleSearch = (event) => {
    setSearchQuery(event.target.value);
  };

  // Avoid a layout jump when reaching the last page with empty rows.
  const ignoredField = "iId";
  const filteredRows = data.filter((row) =>
    Object.entries(row).some(([key, value]) => {
      // Ignore the specified field from filtering
      if (key === ignoredField) {
        return false;
      }

      if (typeof value === "string") {
        return value.toLowerCase().includes(searchQuery.toLowerCase());
      }

      if (typeof value === "number") {
        return value.toString().includes(searchQuery.toLowerCase());
      }

      return false; // Ignore other types
    })
  );

  const visibleRows = React.useMemo(
    () =>
      stableSort(filteredRows, getComparator(order, orderBy)).slice(
        page * rowsPerPage,
        page * rowsPerPage + rowsPerPage
      ),
    [order, orderBy, page, rowsPerPage, filteredRows]
  );

  const handleExcel = () => {
    const Id = ["iId"];
    // exportToExcel(data, `${name ? name : "Employee"} Report`, Id);
  };

  const handleExpand = () => {
    setExpand(!expand);
  };

  const handleSaveSubmit = () => {};

  return (
    <Box
      sx={{
        width: "auto",
        zIndex: 1,
        margin: 2,
      }}
    >
      {details ? (
        <ProjectDetails handleNavigate={handleNavigate} />
      ) : (
        <>
           <Stack direction="row" spacing={1} padding={1} justifyContent="flex-end">
            <Autocomplete
              id={`size-small-filled-assetType`}
              size="small"
              value={typeName}
              onChange={(event, newValue) => {
                setTypeName(newValue);
              }}
              options={type.map((data) => ({
                sName: data?.sName,
                sCode: data?.sCode,
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
              style={{ width: `200px` }}
            />
            <Button
              onClick={handleExpand}
              size="small"
              variant="contained"
     
              style={buttonStyle}
            >
              {expand ? (
                <ZoomInMapIcon style={{ fontSize: "large" }} />
              ) : (
                <ZoomOutMapIcon style={{ fontSize: "large" }} />
              )}
            </Button>
            <Button
              size="small"
              variant="contained"
              onClick={handleAdd}
              startIcon={<AddIcon />}
              style={buttonStyle}
            >
              Add
            </Button>
          </Stack>
          <Paper
            sx={{
              width: "100%",
              paddingLeft: 2,
              paddingRight: 2,
              boxShadow: "0px 5px 15px rgba(0, 0, 0, 0.3)",
            }}
          >
            <EnhancedTableToolbar
              action={handleExcel}
              numSelected={selected.length}
              values={searchQuery}
              changes={handleSearch}
              expand={expand}
              expandAction={handleExpand}
              setTypeName={setTypeName}
              typeName={typeName}
            />

            {data && data.length > 0 ? (
              <>
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
                  <Table
                    sx={{ minWidth: 750 }}
                    aria-labelledby="tableTitle"
                    size={dense ? "small" : "medium"}
                  >
                    <EnhancedTableHead
                      order={order}
                      orderBy={orderBy}
                      onRequestSort={handleRequestSort}
                      rowCount={filteredRows.length}
                      rows={Object.keys(data[0])}
                    />

                    <TableBody>
                      {visibleRows.map((row, index) => {
                        const labelId = `enhanced-table-checkbox-${index}`;

                        return (
                          <TableRow
                            key={row.iId}
                            hover
                            className={`table-row `}
                            tabIndex={-1}
                            sx={{ cursor: "pointer" }}
                          >
                            {Object.keys(data[0]).map((column, index) => {
                              if (column !== "iId") {
                                return (
                                  <>
                                    {expand ? (
                                      <TableCell
                                        sx={{
                                          padding: "4px",
                                          border: "1px solid #ddd",
                                          whiteSpace: "nowrap",
                                          width: `calc(100% / 5)`,
                                        }}
                                        key={index + labelId}
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
                                        style={{
                                          padding: "4px",
                                          border: "1px solid #ddd",
                                          whiteSpace: "nowrap",
                                          overflow: "hidden",
                                          textOverflow: "ellipsis",
                                          width: `calc(100% / 5)`,
                                          minWidth: "100px",
                                          maxWidth: 150,
                                        }}
                                        key={index + labelId}
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
                <TablePagination
                  rowsPerPageOptions={[10, 25, 50, 100]}
                  component="div"
                  count={data.length}
                  rowsPerPage={rowsPerPage}
                  page={page}
                  onPageChange={handleChangePage}
                  onRowsPerPageChange={handleChangeRowsPerPage}
                  sx={{
                    display: "flex", // Use flexbox for the container
                    justifyContent: "space-between", // Space between the elements
                    alignItems: "center", // Center the elements vertically
                    ".MuiTablePagination-toolbar": {
                      justifyContent: "space-between",
                      alignItems: "center",
                      width: "100%", // Ensure the toolbar takes the full width
                    },
                    ".MuiTablePagination-spacer": {
                      flex: "1 1 100%", // Force the spacer to take up all available space
                    },
                    ".MuiTablePagination-selectLabel": {
                      margin: 0, // Adjust or remove margin as needed
                    },
                    ".MuiTablePagination-select": {
                      textAlign: "center", // Center the text inside the select input
                    },
                    ".MuiTablePagination-selectIcon": {},
                    ".MuiTablePagination-displayedRows": {
                      textAlign: "left", // Align the "1-4 of 4" text to the left
                      flexShrink: 0, // Prevent the text from shrinking
                      order: -1, // Place it at the beginning
                    },
                    ".MuiTablePagination-actions": {
                      flexShrink: 0, // Prevent the actions from shrinking
                    },
                    // Add other styles as needed
                  }}
                />
              </>
            ) : (
              <>
                <TableContainer sx={{ marginBottom: 2 }} component={Paper}>
                  <img
                    className="p-5"
                    srcSet={`${empty}`}
                    src={`${empty}`}
                    alt={empty}
                    loading="lazy"
                    style={{ width: "450px" }}
                  />
                </TableContainer>
              </>
            )}
          </Paper>
        </>
      )}
      <Loader open={open} handleClose={handleClose} />
    </Box>
  );
}
