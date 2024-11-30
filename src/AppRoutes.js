import React, { useState, useEffect } from "react";
import { Routes, Route, Navigate, useNavigate } from "react-router-dom";
import NavigationBar from "./components/Navbar";
import Home from "./pages/Home";
import Login from "./pages/Login";
import Register from "./pages/Register";
import Main from "./pages/Main";
import OttList from "./pages/OttList";
import Admin from "./pages/Admin";

function AppRoutes() {
    const [isLoggedIn, setIsLoggedIn] = useState(false);
    const [isAdmin, setIsAdmin] = useState(false);
    const navigate = useNavigate();

    useEffect(() => {
        const userId = localStorage.getItem("userId");
        const userRole = localStorage.getItem("userRole");

        if (userId) {
            setIsLoggedIn(true);
            setIsAdmin(userRole === "ADMIN");

            if (userRole === "ADMIN" && window.location.pathname !== "/admin") {
                navigate("/admin");
            } else if (userRole !== "ADMIN" && window.location.pathname === "/admin") {
                navigate("/main");
            }
        }
    }, [navigate]);

    const handleLogin = (userData) => {
        setIsLoggedIn(true);
        setIsAdmin(userData.role === "ADMIN");

        if (userData.role === "ADMIN") {
            navigate("/admin");
        } else {
            navigate("/main");
        }
    };

    // 보호된 라우트
    const ProtectedRoute = ({ children }) => {
        return isLoggedIn ? children : <Navigate to="/login" />;
    };

    return (
        <>
            <NavigationBar isLoggedIn={isLoggedIn} setIsLoggedIn={setIsLoggedIn} isAdmin={isAdmin} />
            <Routes>
                <Route
                    path="/"
                    element={isLoggedIn ? isAdmin ? <Navigate to="/admin" /> : <Navigate to="/main" /> : <Home />}
                />
                <Route
                    path="/login"
                    element={
                        isLoggedIn ? (
                            isAdmin ? (
                                <Navigate to="/admin" />
                            ) : (
                                <Navigate to="/main" />
                            )
                        ) : (
                            <Login setIsLoggedIn={setIsLoggedIn} onLogin={handleLogin} />
                        )
                    }
                />
                <Route path="/register" element={isLoggedIn ? <Navigate to="/main" /> : <Register />} />
                <Route
                    path="/main"
                    element={
                        <ProtectedRoute>
                            <Main />
                        </ProtectedRoute>
                    }
                />
                <Route
                    path="/ott-list"
                    element={
                        <ProtectedRoute>
                            <OttList />
                        </ProtectedRoute>
                    }
                />
                <Route
                    path="/admin"
                    element={<ProtectedRoute>{isAdmin ? <Admin /> : <Navigate to="/main" />}</ProtectedRoute>}
                />
            </Routes>
        </>
    );
}

export default AppRoutes;
