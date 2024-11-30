import React, { useState, useEffect } from "react";
import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
import "bootstrap/dist/css/bootstrap.min.css";
import NavigationBar from "./components/Navbar";
import Home from "./pages/Home";
import Login from "./pages/Login";
import Register from "./pages/Register";
import Main from "./pages/Main";
import OttList from "./pages/OttList";

function App() {
    const [isLoggedIn, setIsLoggedIn] = useState(false);

    // 페이지 로드 시 로그인 상태 확인
    useEffect(() => {
        const userId = localStorage.getItem("userId");
        setIsLoggedIn(!!userId);
    }, []);

    // 보호된 라우트 컴포넌트
    const ProtectedRoute = ({ children }) => {
        return isLoggedIn ? children : <Navigate to="/login" />;
    };

    return (
        <Router>
            <NavigationBar isLoggedIn={isLoggedIn} setIsLoggedIn={setIsLoggedIn} />
            <Routes>
                <Route path="/" element={<Home />} />
                <Route path="/login" element={<Login setIsLoggedIn={setIsLoggedIn} />} />
                <Route path="/register" element={<Register />} />
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
            </Routes>
        </Router>
    );
}

export default App;
