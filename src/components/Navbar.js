import React from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import axios from "axios";

const Navbar = ({ isLoggedIn, setIsLoggedIn, setMessage }) => {
    const navigate = useNavigate();
    const location = useLocation(); // 현재 경로 확인

    const handleLogout = async () => {
        try {
            await axios.post(
                "http://localhost:8080/api/users/logout",
                {},
                {
                    withCredentials: true,
                }
            );
            setIsLoggedIn(false);
            navigate("/login");
        } catch (error) {
            setMessage("Error: " + (error.response?.data?.message || error.message));
        }
    };

    // Register 페이지에서만 로그인 버튼만 보이게 처리
    if (location.pathname === "/register") {
        return (
            <nav style={{ padding: "10px", backgroundColor: "#f5f5f5", borderBottom: "1px solid #ddd" }}>
                <Link to="/login">Login</Link> {/* 로그인 버튼만 표시 */}
            </nav>
        );
    }

    return (
        <nav style={{ padding: "10px", backgroundColor: "#f5f5f5", borderBottom: "1px solid #ddd" }}>
            {isLoggedIn ? (
                <>
                    <Link to="/main" style={{ marginRight: "10px" }}>
                        Main
                    </Link>
                    <Link to="/profile" style={{ marginRight: "10px" }}>
                        Profile
                    </Link>
                    <Link to="/ott-list" style={{ marginRight: "10px" }}>
                        OttList
                    </Link>
                    <button onClick={handleLogout}>Logout</button>
                </>
            ) : (
                <Link to="/register">Register</Link> // 로그인 상태가 아닐 때 회원가입 버튼
            )}
        </nav>
    );
};

export default Navbar;
