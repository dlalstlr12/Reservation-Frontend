import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Container, Row, Col, Form, Button, Card, Alert } from "react-bootstrap";
import { FaUser, FaLock } from "react-icons/fa";
import axios from "axios";
import "../styles/Auth.css";

const Login = ({ setIsLoggedIn, setMessage, onLogin }) => {
    const [formData, setFormData] = useState({ username: "", password: "" });
    const [error, setError] = useState("");
    const navigate = useNavigate();

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const response = await axios.post("http://localhost:8080/api/users/login", formData, {
                withCredentials: true,
            });

            if (response.data) {
                localStorage.setItem("userId", response.data.id);
                localStorage.setItem("username", response.data.username);
                localStorage.setItem("userRole", response.data.role);

                onLogin({
                    id: response.data.id,
                    role: response.data.role,
                });
                setIsLoggedIn(true);
            }
        } catch (error) {
            setError("Error: " + (error.response?.data?.message || error.message));
        }
    };

    return (
        <div className="auth-container">
            <Container>
                <Row className="justify-content-center align-items-center min-vh-100">
                    <Col xs={11} sm={9} md={7} lg={5} xl={4}>
                        <Card className="auth-card">
                            <Card.Body>
                                <h2 className="auth-title text-center">로그인</h2>

                                {error && (
                                    <Alert variant="danger" className="mb-4" onClose={() => setError("")} dismissible>
                                        {error}
                                    </Alert>
                                )}

                                <Form onSubmit={handleSubmit}>
                                    <Form.Group className="mb-4">
                                        <Form.Label>
                                            <FaUser className="me-2" />
                                            아이디
                                        </Form.Label>
                                        <Form.Control
                                            type="text"
                                            name="username"
                                            placeholder="아이디를 입력하세요"
                                            value={formData.username}
                                            onChange={handleChange}
                                            required
                                        />
                                    </Form.Group>

                                    <Form.Group className="mb-4">
                                        <Form.Label>
                                            <FaLock className="me-2" />
                                            비밀번호
                                        </Form.Label>
                                        <Form.Control
                                            type="password"
                                            name="password"
                                            placeholder="비밀번호를 입력하세요"
                                            value={formData.password}
                                            onChange={handleChange}
                                            required
                                        />
                                    </Form.Group>

                                    <div className="d-grid gap-2 mb-4">
                                        <Button variant="primary" type="submit" className="btn-auth">
                                            로그인
                                        </Button>
                                    </div>

                                    <div className="auth-divider">
                                        <span>또는</span>
                                    </div>

                                    <div className="text-center">
                                        <p className="mb-0">
                                            계정이 없으신가요?{" "}
                                            <Button
                                                variant="link"
                                                className="auth-link p-0"
                                                onClick={() => navigate("/register")}
                                            >
                                                회원가입
                                            </Button>
                                        </p>
                                    </div>
                                </Form>
                            </Card.Body>
                        </Card>
                    </Col>
                </Row>
            </Container>
        </div>
    );
};

export default Login;
