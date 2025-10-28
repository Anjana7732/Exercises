import {useState, useEffect } from "react";
import axios from "axios";
import "./index.css";

const baseURL = "http://localhost:3001/api/persons";

const Notification = ({ message, type}) => {
  if (!message) return null;
  return (
    <div className={type==="error" ? "error" : "success"}>
      {message}
    </div>
  );
};

const App = ()