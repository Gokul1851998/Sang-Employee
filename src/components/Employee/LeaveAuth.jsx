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
import {
  getLeaveAuthorizationSummary,
  leaveAuthorization,
} from "../../api/ApiCall";
import EditIcon from "@mui/icons-material/Edit";
import { Button } from "rsuite";
import CheckBoxIcon from "@mui/icons-material/CheckBox";
import DisabledByDefaultIcon from "@mui/icons-material/DisabledByDefault";
import Swal from "sweetalert2";
import PreviewIcon from "@mui/icons-material/Preview";
import { useNavigate } from "react-router-dom";

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
  const { order, orderBy, rowCount, onRequestSort, rows, expand } = props;
  const createSortHandler = (property) => (event) => {
    onRequestSort(event, property);
  };

  return (
    <TableHead
      style={{
        backgroundColor: "#119def",
        position: "sticky",
        top: 0,
        zIndex: "1",
      }}
    >
      <TableRow>
        {rows.map((header, index) => {
          if (
            header !== "iId" &&
            header !== "iTransId" &&
            header !== "iEmployee" &&
            header !== "iLeaveType" &&
            header !== "sFileName" &&
            header !== "sTelephone"
          ) {
            // Exclude "iId", "iAssetType", and "sAltName" from the header
            return (
              <TableCell
                sx={{
                  border: "1px solid #ddd",
                  minWidth: !expand ? "50px" : "20px", // Adjust the values as needed
                  maxWidth: !expand ? "200px" : "50px", // Adjust the values as needed
                }}
                key={index}
                align="center"
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
  expand: PropTypes.bool.isRequired, // or the appropriate PropTypes type
};

function EnhancedTableToolbar(props) {
  const { numSelected, values, changes, expandAction, expand } = props;

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
        Leave Requests
      </Typography>

      <TextField
        id="search"
        label="Search"
        variant="outlined"
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
      </Toolbar>
    </Toolbar>
  );
}

EnhancedTableToolbar.propTypes = {
  numSelected: PropTypes.number.isRequired,
};

export default function LeaveAuth() {
  const iUser = Number(localStorage.getItem("userId"));
  const navigate = useNavigate();
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

  const handleClose = () => {
    setOpen(false);
  };
  const handleOpen = () => {
    setOpen(true);
  };

  React.useEffect(() => {
    const fetchData = async () => {
        handleOpen()
      const response = await getLeaveAuthorizationSummary({ iUser: 0 });
      if (response.Status === "Success") {
        const myObject = JSON.parse(response.ResultData);
        console.log(myObject);
        setData(myObject);
      }else{
        setData([])
      }
      handleClose()
    };
    fetchData();
  }, []);

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

  const handleExpand = () => {
    setExpand(!expand);
  };

  const handleApprove = async (iAuth,status, iTransId) => {
    Swal.fire({
      title: "Remarks",
      input: "text",
      inputAttributes: {
        autocapitalize: "off",
      },
      confirmButtonColor: "#3085d6",
      cancelButtonColor: "#d33",
      showCancelButton: true,
      confirmButtonText: `${status}`,
      showLoaderOnConfirm: true,
      preConfirm: async (login) => {
        const apiData = {
            sRemarks:login,
            iTransId,
            iUser,
            iAuth
        }
        const response = await leaveAuthorization(apiData);
        console.log(response,'---');
        // if (!response.ok) {
        //   return Swal.showValidationMessage(`
        //     ${JSON.stringify(await response.json())}
        //   `);
        // }

        // return response.json();
      },
      allowOutsideClick: () => !Swal.isLoading(),
      customClass: {
        cancelButton: "swal-button swal-button--danger",
      },
      confirmButtonClass: "swal-button--success",
    }).then((result) => {
      if (result.isConfirmed) {
        Swal.fire({
          title: `${result.value.login}'s avatar`,
          imageUrl: result.value.avatar_url,
        });
      }
    });
  };

  return (
    <Box
      sx={{
        width: "auto",
        paddingLeft: 5,
        paddingRight: 5,
        zIndex: 1,
      }}
    >
      <Paper
        sx={{
          width: "100%",
          paddingLeft: 2,
          paddingRight: 2,
          boxShadow: "0px 5px 15px rgba(0, 0, 0, 0.3)",
        }}
      >
        <EnhancedTableToolbar
          numSelected={selected.length}
          values={searchQuery}
          changes={handleSearch}
          expand={expand}
          expandAction={handleExpand}
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
              sx={{ minWidth: 1600 }}
              aria-labelledby="tableTitle"
              size={dense ? "small" : "medium"}
            >
              <EnhancedTableHead
                order={order}
                orderBy={orderBy}
                onRequestSort={handleRequestSort}
                rowCount={filteredRows.length}
                rows={Object.keys(data[0])}
                expand={expand}
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
                        if (
                          column !== "iId" &&
                          column !== "iTransId" &&
                          column !== "iEmployee" &&
                          column !== "iLeaveType" &&
                          column !== "sFileName" &&
                          column !== "sTelephone"
                        ) {
                          return (
                            <>
                              {expand ? (
                                <TableCell
                                  sx={{
                                    padding: "4px",
                                    border: "1px solid #ddd",
                                    overflow: "hidden",
                                    whiteSpace: "normal",
                                  }}
                                  key={index + labelId}
                                  component="th"
                                  id={labelId}
                                  scope="row"
                                  padding="normal"
                                  align="center"
                                >
                                  {column === "link" ? (
                                    <Tooltip title="View" arrow>
                                      <IconButton
                                        aria-label="edit"
                                        size="small"
                                        onClick={() => window.open(row[column], '_blank')}
                                      >
                                        <PreviewIcon
                                          fontSize="small"
                                          sx={{
                                            fontSize: 18,
                                            color: "#ffb400",
                                          }}
                                        />
                                      </IconButton>
                                    </Tooltip>
                                  ) : row[column] === "Pending" ? (
                                    <>
                                      <Tooltip title="Approve" arrow>
                                        <IconButton
                                          aria-label="edit"
                                          size="small"
                                          onClick={() =>
                                            handleApprove(
                                             1, "Approve",
                                              row.iTransId
                                            )
                                          }
                                        >
                                          <CheckBoxIcon
                                            fontSize="small"
                                            sx={{
                                              fontSize: 18,
                                              color: "#01a34f",
                                            }}
                                          />
                                        </IconButton>
                                      </Tooltip>
                                      <Tooltip title="Reject" arrow>
                                        <IconButton
                                          onClick={() =>
                                            handleApprove(
                                                2,
                                              "Reject",
                                              row.iTransId
                                            )
                                          }
                                          aria-label="edit"
                                          size="small"
                                        >
                                          <DisabledByDefaultIcon
                                            fontSize="small"
                                            sx={{
                                              fontSize: 18,
                                              color: "#ed1d26",
                                            }}
                                          />
                                        </IconButton>
                                      </Tooltip>
                                    </>
                                  ) : (
                                    row[column]
                                  )}
                                </TableCell>
                              ) : (
                                <TableCell
                                  scope="row"
                                  padding="normal"
                                  align="center"
                                  sx={{
                                    border: "1px solid #ddd",
                                    padding: "4px",
                                    overflow: "hidden",
                                    whiteSpace: "nowrap "
                                  }}
                                  key={index + labelId}
                                >
                                  {column === "link" ? (
                                    <Tooltip title="View" arrow>
                                      <IconButton
                                        aria-label="edit"
                                        size="small"
                                        onClick={() => window.open(row[column], '_blank')}
                                      >
                                        <PreviewIcon
                                          fontSize="small"
                                          sx={{
                                            fontSize: 18,
                                            color: "#ffb400",
                                          }}
                                        />
                                      </IconButton>
                                    </Tooltip>
                                  ) : row[column] === "Pending" ? (
                                    <>
                                      <Tooltip title="Approve" arrow>
                                        <IconButton
                                          aria-label="edit"
                                          size="small"
                                          onClick={() =>
                                            handleApprove(
                                             1, "Approve",
                                              row.iTransId
                                            )
                                          }
                                        >
                                          <CheckBoxIcon
                                            fontSize="small"
                                            sx={{
                                              fontSize: 18,
                                              color: "#01a34f",
                                            }}
                                          />
                                        </IconButton>
                                      </Tooltip>
                                      <Tooltip title="Reject" arrow>
                                        <IconButton
                                          onClick={() =>
                                            handleApprove(
                                                2,
                                              "Reject",
                                              row.iTransId
                                            )
                                          }
                                          aria-label="edit"
                                          size="small"
                                        >
                                          <DisabledByDefaultIcon
                                            fontSize="small"
                                            sx={{
                                              fontSize: 18,
                                              color: "#ed1d26",
                                            }}
                                          />
                                        </IconButton>
                                      </Tooltip>
                                    </>
                                  ) : (
                                    row[column]
                                  )}
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
        <div
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "flex-end",
          }}
        >
          <TablePagination
            rowsPerPageOptions={[10, 25, 50, 100]}
            component="div"
            count={data.length}
            rowsPerPage={rowsPerPage}
            page={page}
            onPageChange={handleChangePage}
            onRowsPerPageChange={handleChangeRowsPerPage}
          />
        </div>
      </Paper>
      <Loader open={open} handleClose={handleClose} />
    </Box>
  );
}
