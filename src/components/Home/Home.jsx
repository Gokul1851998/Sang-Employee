import React, { useEffect } from "react";
import Header from "../CommonComponents/Header";
import Employee from "../Employee/Employee";
import Admin from "../AdminHome/Admin";
import SuperAdmin from "../SuperAdmin/SuperAdmin";
import { useNavigate } from "react-router-dom";
import EmployeePage from "../Employee/EmployeePage";
import { getMenuWeb } from "../../api/ApiCall";

export default function Home() {
  const navigate = useNavigate()
  const userId = localStorage.getItem("userId");
  useEffect(()=>{
     if(!userId){
       navigate("/")
     }
  },[userId])
  return (
    <>
      <Header />

      <EmployeePage />
    </>
  );
}
