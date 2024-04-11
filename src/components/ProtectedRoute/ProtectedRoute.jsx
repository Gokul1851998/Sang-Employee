import React, { useCallback, useEffect, useState } from "react";
import { Navigate, useLocation, useNavigate } from "react-router-dom";

const events = [
  "load",
  "mousemove",
  "mousedown",
  "click",
  "scroll",
  "keypress",
];
const idleTime = 10 * 60 * 1000;

const ProtectedRoute = (props) => {
  const userId = localStorage.getItem("userId")? Number(localStorage.getItem("userId")) : ""
  const userName = localStorage.getItem("userName");
  const iEmployee = Number(localStorage.getItem("iEmployee"));
  const location = useLocation();
  const navigate = useNavigate();
  const [isOnline, setIsOnline] = useState(window.navigator.onLine);
  const handleLogout = useCallback(() => {
    if (userId && userName) {
      localStorage.removeItem("userId");
      localStorage.removeItem("userName");
      localStorage.removeItem("iEmployee");
    }
  }, [userId, userName]);

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

  const onClickLog = () => {
    localStorage.removeItem("userId");
    localStorage.removeItem("userName");
    navigate("/");
  };

  useEffect(() => {
    if (!userId) {
      onClickLog();
    }
  }, [userId]);

  useEffect(() => {
    if (location.pathname === "/") {
      return; // Avoid logout action if the path is "/"
    }

    const data = localStorage.getItem("timeStamp");

    if (data && userName && userId > 0) {
      const currentTimestamp = new Date().getTime();
      const expirationTimestamp = parseInt(data, 10);

      if (currentTimestamp > expirationTimestamp) {
        handleLogout();
      }
    }

    const currentTime = new Date().getTime();
    const expirationTime = currentTime + idleTime;
    localStorage.setItem("timeStamp", expirationTime);

    let timer = setTimeout(handleLogout, idleTime);

    const resetTimer = () => {
      clearTimeout(timer);
    };

    const handleActivity = () => {
      resetTimer();
      timer = setTimeout(handleLogout, idleTime);
    };

    events.forEach((event) => window.addEventListener(event, handleActivity));

    return () => {
      clearTimeout(timer);
      events.forEach((event) =>
        window.removeEventListener(event, handleActivity)
      );
    };
  }, [handleLogout, location.pathname, userId, userName]);

  if (localStorage.getItem("userId")) {
    return props.children;
  } else {
    return <Navigate to={"/"} />;
  }
};

export default ProtectedRoute;
