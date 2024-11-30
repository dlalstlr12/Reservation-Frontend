import React, { useState, useEffect } from "react";
import { BrowserRouter as Router, Route, Routes, Navigate } from "react-router-dom";
import Navbar from "./components/Navbar";
import RequireAuth from "./components/RequireAuth";
import Login from "./pages/Login";
import Profile from "./pages/Profile";
import Main from "./pages/Main";
import Register from "./pages/Register"; // 회원가입 페이지
import axios from "axios";
import Admin from "./pages/Admin";
import OttListPage from "./pages/OttList";
import OttList from "./pages/OttList";

function App() {
    const [isLoggedIn, setIsLoggedIn] = useState(false); // 로그인 상태 관리
    const [loading, setLoading] = useState(true);
    // 로그인 상태 확인 함수
    const checkAuthStatus = async () => {
        try {
            const response = await axios.get("http://localhost:8080/api/users/profile", {
                withCredentials: true, // HttpOnly 쿠키 포함
            });
            if (response.status === 200) {
                setIsLoggedIn(true); // 인증 성공 시 로그인 상태로 설정
            }
        } catch (error) {
            setIsLoggedIn(false); // 인증 실패 시 로그아웃 상태로 설정
        } finally {
            setLoading(false); // 로딩 완료
        }
    };

    // 앱 로드 시 로그인 상태 확인
    useEffect(() => {
        checkAuthStatus();
    }, []);
    if (loading) {
        return <div>Loading...</div>;
    }
    return (
        <Router>
            <div>
                <Navbar isLoggedIn={isLoggedIn} setIsLoggedIn={setIsLoggedIn} />
                <div style={{ padding: "20px" }}>
                    <Routes>
                        {/* 초기 페이지를 로그인 페이지로 설정 */}
                        <Route
                            path="/"
                            element={isLoggedIn ? <Navigate to="/main" replace /> : <Navigate to="/login" replace />}
                        />
                        <Route
                            path="/login"
                            element={
                                isLoggedIn ? <Navigate to="/main" replace /> : <Login setIsLoggedIn={setIsLoggedIn} />
                            }
                        />
                        <Route path="/register" element={<Register />} />
                        <Route
                            path="/main"
                            element={
                                <RequireAuth isLoggedIn={isLoggedIn}>
                                    <Main />
                                </RequireAuth>
                            }
                        />
                        <Route
                            path="/profile"
                            element={
                                <RequireAuth isLoggedIn={isLoggedIn}>
                                    <Profile />
                                </RequireAuth>
                            }
                        />
                        <Route
                            path="/admin"
                            element={
                                <RequireAuth isLoggedIn={isLoggedIn}>
                                    <Admin />
                                </RequireAuth>
                            }
                        />
                        <Route
                            path="/otts"
                            element={
                                <RequireAuth isLoggedIn={isLoggedIn}>
                                    <OttListPage />
                                </RequireAuth>
                            }
                        />
                        <Route
                            path="/ott-list"
                            element={
                                <RequireAuth isLoggedIn={isLoggedIn}>
                                    <OttList />
                                </RequireAuth>
                            }
                        />
                    </Routes>
                </div>
            </div>
        </Router>
    );
}

export default App;
