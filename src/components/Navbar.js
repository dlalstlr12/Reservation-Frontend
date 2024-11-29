import React from "react";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";

const Navbar = ({ isLoggedIn, setIsLoggedIn, setMessage }) => {
    const navigate = useNavigate();

    const handleLogout = async () => {
        try {
            // 로그아웃 API 호출
            await axios.post(
                "http://localhost:8080/api/users/logout",
                {},
                {
                    withCredentials: true, // 쿠키 포함
                }
            );

            // 로그인 상태 초기화
            setIsLoggedIn(false);
            setMessage("Logged out successfully!");
            navigate("/login"); // 로그인 페이지로 이동
        } catch (error) {
            setMessage("Error: " + (error.response?.data?.message || error.message));
        }
    };

    return (
        <nav style={{ padding: "10px", backgroundColor: "#f5f5f5", borderBottom: "1px solid #ddd" }}>
            <Link to="/main" style={{ marginRight: "10px" }}>
                Main
            </Link>
            <Link to="/profile" style={{ marginRight: "10px" }}>
                profile
            </Link>
            {isLoggedIn ? <button onClick={handleLogout}>Logout</button> : <Link to="/login">Login</Link>}
        </nav>
    );
};

export default Navbar;
