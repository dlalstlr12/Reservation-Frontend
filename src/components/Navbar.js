import React from "react";
import { Navbar, Nav, Container } from "react-bootstrap";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";

const NavigationBar = ({ isLoggedIn, setIsLoggedIn }) => {
    const navigate = useNavigate();

    const handleLogout = async () => {
        try {
            await axios.post(
                "http://localhost:8080/api/users/logout",
                {},
                {
                    withCredentials: true,
                }
            );

            // 로컬 스토리지 클리어
            localStorage.removeItem("userId");
            localStorage.removeItem("username");

            // 로그인 상태 업데이트
            setIsLoggedIn(false);

            // 메인 페이지로 이동
            navigate("/");
        } catch (error) {
            console.error("로그아웃 실패:", error);
        }
    };

    return (
        <Navbar bg="light" expand="lg">
            <Container>
                <Navbar.Brand as={Link} to="/">
                    OTT 서비스
                </Navbar.Brand>
                <Navbar.Toggle aria-controls="basic-navbar-nav" />
                <Navbar.Collapse id="basic-navbar-nav">
                    <Nav className="me-auto">
                        <Nav.Link as={Link} to="/main">
                            홈
                        </Nav.Link>
                        <Nav.Link as={Link} to="/ott-list">
                            OTT 목록
                        </Nav.Link>
                    </Nav>
                    <Nav>
                        {isLoggedIn ? (
                            <>
                                <span className="navbar-text me-3">{localStorage.getItem("username")}님</span>
                                <Nav.Link onClick={handleLogout}>로그아웃</Nav.Link>
                            </>
                        ) : (
                            <>
                                <Nav.Link as={Link} to="/login">
                                    로그인
                                </Nav.Link>
                                <Nav.Link as={Link} to="/register">
                                    회원가입
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
