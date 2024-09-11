import React from "react";
import { Navigate } from "react-router-dom";

const PrivateRoute = ({ element: Component, role }) => {
  const token = localStorage.getItem("token");
  const userRole = localStorage.getItem("role");

  if (!token || (role && userRole !== role)) {
    return <Navigate to="/mainadmin-login" />;
  }

  return <Component />;
};

export default PrivateRoute;
