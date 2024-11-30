import React, { useState } from "react";
import { useNavigate } from "react-router-dom";

import axios from "axios";
const Login = ({ setIsLoggedIn, setMessage, onLogin }) => {
    const [formData, setFormData] = useState({ username: "", password: "" });
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
                localStorage.setItem("userRole", response.data.role); // role이 정확히 'ADMIN'으로 저장되는지 확인

                // 로그인 상태 업데이트

                onLogin({
                    id: response.data.id,
                    role: response.data.role,
                });
                setIsLoggedIn(true);
            }
        } catch (error) {
            setMessage("Error: " + (error.response?.data?.message || error.message));
        }
    };

    return (
        <div>
            <h2>Login</h2>
            <form onSubmit={handleSubmit}>
                <div>
                    <label>Username:</label>
                    <input type="text" name="username" value={formData.username} onChange={handleChange} required />
                </div>
                <div>
                    <label>Password:</label>
                    <input type="password" name="password" value={formData.password} onChange={handleChange} required />
                </div>
                <button type="submit">Login</button>
            </form>
        </div>
    );
};

export default Login;
