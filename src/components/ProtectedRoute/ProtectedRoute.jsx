import { Alert, Snackbar, Stack, IconButton, Button } from "@mui/material";
import React, { useCallback, useEffect, useState } from "react";
import { Navigate, useLocation, useNavigate } from "react-router-dom";
import ErrorMessage from "../ErrorMessage/ErrorMessage";
import RestoreIcon from "@mui/icons-material/Restore";


const buttonStyle = {
  textTransform: "none", // Set text transform to none for normal case
  color: ` #fff`, // Set text color
  backgroundColor: `#053fc7`, // Set background color
  fontSize: "10px",
  marginLeft:"20px"
};

const events = [
  "load",
  "mousemove",
  "mousedown",
  "click",
  "scroll",
  "keypress",
];
const idleTime = 10 * 60 * 1000;

// Placeholder for a custom dialog component
const TimedDialog = ({ onTimeout, onConfirm, isVisible }) => {
  const [countdown, setCountdown] = useState(10);

  useEffect(() => {
    if (!isVisible) return;

    const timer = setTimeout(() => {
      if (countdown > 0) {
        setCountdown(countdown - 1);
      } else {
        onTimeout();
      }
    }, 1000); // Update countdown every second

    return () => clearTimeout(timer);
  }, [isVisible, countdown, onTimeout]);

  if (!isVisible) return null;

  return (
    <Stack spacing={2} sx={{ width: "100%" }}>
      <Snackbar open={isVisible} onClose={onConfirm}>
        <Alert
          // onClose={onConfirm}
          variant="filled"
          severity="info"
          sx={{ width: "100%" }}
        >
          {`Your session expires in ${countdown} seconds .Click OK to continue`}
          {/* <IconButton type="button"
            style={{ padding: 0, margin: 0, color: "white", paddingLeft: 3 }}
            onClick={onConfirm}
            aria-label="Restart"
          >
           
          </IconButton> */}
          <Button  size="small"
              variant="contained"
             onClick={onConfirm}
              style={buttonStyle} >
       OK
      </Button>
        </Alert>
      </Snackbar>
    </Stack>
  );
};

const ProtectedRoute = (props) => {
  const userId = localStorage.getItem("userId")
    ? Number(localStorage.getItem("userId"))
    : "";
  const userName = localStorage.getItem("userName");
  const location = useLocation();
  const navigate = useNavigate();
  const [isOnline, setIsOnline] = useState(window.navigator.onLine);
  const [showDialog, setShowDialog] = useState(false);

  const handleLogout = useCallback(() => {
    // Changes here: instead of using confirm, we show the dialog
    setShowDialog(true);
  }, []);

  const handleDialogTimeout = () => {
    // Logic to remove user and navigate
    if (userId && userName) {
      localStorage.removeItem("userId");
      localStorage.removeItem("userName");
      localStorage.removeItem("iEmployee");
    }
    navigate("/");
  };
  const handleDialogConfirm = () => {
    setShowDialog(false); // Hide dialog
    // Set new timestamp to extend session
    const currentTime = new Date().getTime();
    const expirationTime = currentTime + idleTime;
    localStorage.setItem("timeStamp", expirationTime.toString());
  };

  //network errror
  useEffect(() => {
    const goOnline = () => {
      setIsOnline(true);
      // Optionally, reload the page
      //window.location.reload();
      alert(
        "Success is walking from failure to failure with no loss of enthusiam."
      );
    };

    const goOffline = () => {
      setIsOnline(false);
      alert("Please verify your network connection and try again.");
    };

    window.addEventListener("online", goOnline);
    window.addEventListener("offline", goOffline);

    return () => {
      window.removeEventListener("online", goOnline);
      window.removeEventListener("offline", goOffline);
    };
  }, []);

  // Automatic logout on missing userId
  useEffect(() => {
    if (!userId) {
      navigate("/");
    }
  }, [userId, navigate]);

  useEffect(() => {
    if (location.pathname === "/") {
      return; // Avoid logout action if the path is "/"
    }

    let timer = setTimeout(handleLogout, idleTime);

    const resetTimer = () => {
      clearTimeout(timer);
      timer = setTimeout(handleLogout, idleTime);
    };

    events.forEach((event) => window.addEventListener(event, resetTimer));

    return () => {
      clearTimeout(timer);
      events.forEach((event) => window.removeEventListener(event, resetTimer));
    };
  }, [handleLogout, location.pathname]);

  return (
    <>
      {showDialog && (
        <TimedDialog
          isVisible={showDialog}
          onTimeout={handleDialogTimeout}
          onConfirm={handleDialogConfirm}
        />
      )}
      {userId ? props.children : <Navigate to="/" />}
    </>
  );
};

export default ProtectedRoute;
