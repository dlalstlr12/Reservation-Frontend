import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { loginUser } from "../services/api";
import axios from "axios";
const Login = ({ setIsLoggedIn, setMessage }) => {
    const [formData, setFormData] = useState({ username: "", password: "" });
    const navigate = useNavigate();

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            // 로그인 API 호출
            const response = await axios.post("http://localhost:8080/api/users/login", formData, {
                withCredentials: true, // 쿠키 전송 허용
            });

            setIsLoggedIn(true);
            navigate("/main");
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
