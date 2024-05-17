import React, { useCallback, useEffect, useState } from "react";
import { Navigate, useLocation, useNavigate } from "react-router-dom";
import {
  Alert,
  Snackbar,
  Stack,
  IconButton,
  Button,
  Typography,
} from "@mui/material";
import RestoreIcon from "@mui/icons-material/Restore";

const buttonStyle = {
  textTransform: "none",
  color: "#fff",
  backgroundColor: "#053fc7",
  fontSize: "10px",
  marginLeft: "20px",
};

const events = ["load", "mousemove", "mousedown", "click", "scroll", "keypress"];
const idleTime = 10 * 60 * 1000; // 10 minutes

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
    }, 1000);

    return () => clearTimeout(timer);
  }, [isVisible, countdown, onTimeout]);

  if (!isVisible) return null;

  return (
    <Stack spacing={2} sx={{ width: "100%" }}>
      <Snackbar open={isVisible} onClose={onConfirm}>
        <Alert variant="filled" severity="info" sx={{ width: "100%" }}>
          <Stack direction="row" justifyContent="space-between" alignItems="center">
            <Typography variant="body2">
              {`Your session expires in ${countdown} seconds. Click OK to continue`}
            </Typography>
            <Button
              size="small"
              variant="contained"
              onClick={onConfirm}
              style={buttonStyle}
            >
              OK
            </Button>
          </Stack>
        </Alert>
      </Snackbar>
    </Stack>
  );
};

const ProtectedRoute = (props) => {
  const userId = Number(localStorage.getItem("userId"));
  const userName = localStorage.getItem("userName");
  const location = useLocation();
  const navigate = useNavigate();
  const [isOnline, setIsOnline] = useState(window.navigator.onLine);
  const [showDialog, setShowDialog] = useState(false);

  const handleLogout = useCallback(() => {
    setShowDialog(true);
  }, []);

  const handleDialogTimeout = () => {
    if (userId && userName) {
      localStorage.removeItem("userId");
      localStorage.removeItem("userName");
      localStorage.removeItem("iEmployee");
    }
    navigate("/");
  };

  const handleDialogConfirm = () => {
    setShowDialog(false);
    const currentTime = new Date().getTime();
    const expirationTime = currentTime + idleTime;
    localStorage.setItem("timeStamp", expirationTime.toString());
  };

  useEffect(() => {
    const goOnline = () => {
      setIsOnline(true);
      alert("Success is walking from failure to failure with no loss of enthusiasm.");
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

  useEffect(() => {
    if (!userId) {
      navigate("/");
    }
  }, [userId, navigate]);

  useEffect(() => {
    if (location.pathname === "/") {
      return;
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
