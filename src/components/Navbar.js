import React from "react";
import { Navbar, Nav, Container } from "react-bootstrap";
import { Link, useNavigate } from "react-router-dom";
import { FaHome, FaList, FaSignInAlt, FaUserPlus, FaSignOutAlt, FaUser } from "react-icons/fa";
import axios from "axios";
import "../styles/Navbar.css";

const NavigationBar = ({ isLoggedIn, setIsLoggedIn }) => {
    const navigate = useNavigate();

    const handleLogout = async () => {
        try {
            await axios.post("http://localhost:8080/api/users/logout", {}, { withCredentials: true });

            localStorage.removeItem("userId");
            localStorage.removeItem("username");
            setIsLoggedIn(false);
            navigate("/");
        } catch (error) {
            console.error("로그아웃 실패:", error);
        }
    };

    return (
        <Navbar className="custom-navbar" expand="lg" fixed="top">
            <Container>
                <Navbar.Brand as={Link} to="/" className="brand-text">
                    OTT 서비스
                </Navbar.Brand>
                <Navbar.Toggle aria-controls="basic-navbar-nav" />
                <Navbar.Collapse id="basic-navbar-nav">
                    <Nav className="me-auto">
                        <Nav.Link as={Link} to="/main" className="nav-link-custom">
                            <FaHome className="nav-icon" /> 홈
                        </Nav.Link>
                        <Nav.Link as={Link} to="/ott-list" className="nav-link-custom">
                            <FaList className="nav-icon" /> OTT 목록
                        </Nav.Link>
                    </Nav>
                    <Nav>
                        {isLoggedIn ? (
                            <>
                                <span className="navbar-text me-3">
                                    <FaUser className="nav-icon" />
                                    {localStorage.getItem("username")}님
                                </span>
                                <Nav.Link onClick={handleLogout} className="nav-link-custom logout-btn">
                                    <FaSignOutAlt className="nav-icon" /> 로그아웃
                                </Nav.Link>
                            </>
                        ) : (
                            <>
                                <Nav.Link as={Link} to="/login" className="nav-link-custom">
                                    <FaSignInAlt className="nav-icon" /> 로그인
                                </Nav.Link>
                                <Nav.Link as={Link} to="/register" className="nav-link-custom register-btn">
                                    <FaUserPlus className="nav-icon" /> 회원가입
                                </Nav.Link>
                            </>
                        )}
                    </Nav>
                </Navbar.Collapse>
            </Container>
        </Navbar>
    );
};

export default NavigationBar;
