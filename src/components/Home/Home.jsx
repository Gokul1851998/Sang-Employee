import React, { useEffect } from "react";
import Header from "../CommonComponents/Header";
import { useNavigate } from "react-router-dom";
import EmployeePage from "../Employee/EmployeePage";

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
