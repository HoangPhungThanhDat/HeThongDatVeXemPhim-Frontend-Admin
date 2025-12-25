import React from "react";
const logout = () => {
  localStorage.removeItem("token");
  localStorage.removeItem("role");
  window.location.href = "http://localhost:3000/login";
};


export default logout;
