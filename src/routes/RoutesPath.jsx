import React from 'react'
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import Login from '../components/Login/Login';
import Home from '../components/Home/Home';

export default function RoutesPath() {
  return (
    <Routes>
    <Route path="/" element={<Login />} />
    <Route path="/home" element={<Home />} />
    </Routes>
  )
}
