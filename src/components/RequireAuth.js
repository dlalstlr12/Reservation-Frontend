import React from "react";
import { Navigate } from "react-router-dom";

const RequireAuth = ({ isLoggedIn, children }) => {
    if (!isLoggedIn) {
        // 로그인되지 않은 경우 로그인 페이지로 리다이렉트
        return <Navigate to="/login" replace />;
    }
    return children;
};

export default RequireAuth;
