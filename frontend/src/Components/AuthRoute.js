import React from "react";
import { Navigate, useLocation } from "react-router-dom";

const AuthRoute = ({ children }) => {
    const location = useLocation();
    const token = localStorage.getItem('auth-token');

    if (!token) {
        return <Navigate to={`/login?redirect=${location.pathname}`} />;
    }

    return children;
};

export default AuthRoute;
