import React, { useEffect } from "react";
import Header from "../CommonComponents/Header";
import Employee from "../Employee/Employee";
import Admin from "../AdminHome/Admin";
import SuperAdmin from "../SuperAdmin/SuperAdmin";
import { useNavigate } from "react-router-dom";
import EmployeePage from "../Employee/EmployeePage";

export default function Home() {
  const navigate = useNavigate()
  const admin = localStorage.getItem("admin");
   useEffect(()=>{
     if(admin === null){
      navigate('/')
     }
   },[admin])
  return (
    <>
      <Header />
      {admin === "1"? (
        <Admin />
      ) : admin === "0" ? (
        <EmployeePage />
      ) : admin === "2" ? (
        <SuperAdmin />
      ) : null}
    </>
  );
}
