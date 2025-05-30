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
import { IconButton, TextField, Tooltip } from "@mui/material";
import SaveIcon from "@mui/icons-material/Save";
import { exportToExcel } from "../Excel/ExcelForm";
import ZoomOutMapIcon from "@mui/icons-material/ZoomOutMap";
import ZoomInMapIcon from "@mui/icons-material/ZoomInMap";

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
  const { order, orderBy, rowCount, onRequestSort, rows, hideEmployee } = props;
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
          if (header !== "iId" && header!=="TransId" && header !== hideEmployee ?"Employee" : null) {
            // Exclude "iId", "iAssetType", and "sAltName" from the header
            return (
              <TableCell
                sx={{
                  padding: "4px",
                  border: " 1px solid #ddd",
                  minWidth: "10px",
                  maxWidth: "20px",
                  whiteSpace: "nowrap",
                  overflow: "hidden",
                  textOverflow: "ellipsis",
                }}
                key={index}
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
  const { numSelected, values, changes, action, expandAction, expand,name } = props;

  return (
    <Toolbar
      sx={{
        mt: 2,
      }}
    >
      <Typography
        sx={{ flex: "1 1 100%" }}
        variant="h6"
        id="tableTitle"
        component="div"
      >
       {name} Report
      </Typography>

      <TextField
        id="search"
        label="Search"
        variant="outlined"
        autoComplete="off"
        value={values}
        onChange={changes}
        size="small"
      />
      <Toolbar
        sx={{
          pl: { sm: 2 },
          pr: { xs: 1, sm: 1 },
        }}
      >
        <button onClick={expandAction} className="btn pl-1">
          {expand ? (
            <ZoomInMapIcon style={{ fontSize: "large" }} />
          ) : (
            <ZoomOutMapIcon style={{ fontSize: "large" }} />
          )}
        </button>
        {/* Add Tooltip to IconButton */}
        <Tooltip title="Excel" arrow>
          <IconButton onClick={action} aria-label="Excel">
            <SaveIcon />
          </IconButton>
        </Tooltip>
      </Toolbar>
    </Toolbar>
  );
}

EnhancedTableToolbar.propTypes = {
  numSelected: PropTypes.number.isRequired,
};

export default function AdminList({ data, name, count, hideEmployee  }) {
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
    exportToExcel(data, `${name ? name : "Employee"} Report`, Id);
  };

  const handleExpand = () => {
    setExpand(!expand);
  };

  return (
    <Box
      sx={{
        width: "auto",
        zIndex: 1,
        margin: 2,
      }}
    >
      <Paper
        sx={{
          width: "100%",
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
          name={name}
        />

        {data.length > 0 && (
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
                hideEmployee={hideEmployee}
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
                        if (column !== "iId" && column!=="TransId" && column !== hideEmployee ? "Employee" : null) {
                          return (
                            <>
                              {expand ? (
                                <TableCell
                                  sx={{
                                    padding: "4px",
                                    border: "1px solid #ddd",
                                    whiteSpace: "nowrap",
                                    width: `calc(100% / ${count})`,
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
                                    width: `calc(100% / ${count})`,
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
        )}

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
      </Paper>
      <Loader open={open} handleClose={handleClose} />
    </Box>
  );
}
