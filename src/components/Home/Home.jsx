import React from "react";
import Header from "../CommonComponents/Header";
import Employee from "../Employee/Employee";
import Admin from "../AdminHome/Admin";
import SuperAdmin from "../SuperAdmin/SuperAdmin";
import { useNavigate } from "react-router-dom";

export default function Home() {
  const navigate = useNavigate()
  const admin = localStorage.getItem("admin");
  console.log(admin);
  return (
    <>
      <Header />

      {/* {admin === 1 ? (
        <Admin />
      ) : admin === 0 ? (
        <Employee />
      ) : admin === 2 ? (
        <SuperAdmin />
      ) : navigate('/')} */}
    </>
  );
}
