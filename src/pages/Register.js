import React, { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom"; // useNavigate 임포트

const Register = () => {
    const [formData, setFormData] = useState({ username: "", password: "" });
    const [message, setMessage] = useState("");
    const navigate = useNavigate(); // useNavigate 초기화

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            await axios.post("http://localhost:8080/api/users/register", formData);
            setMessage("Registration successful! Redirecting to login...");

            // 회원가입 성공 시 로그인 페이지로 이동
            setTimeout(() => {
                navigate("/login"); // '/login' 경로로 리다이렉트
            }, 2000); // 2초 후 이동
        } catch (error) {
            setMessage("Error: " + (error.response?.data?.message || error.message));
        }
    };

    return (
        <div>
            <h2>Register</h2>
            <form onSubmit={handleSubmit}>
                <div>
                    <label>Username:</label>
                    <input type="text" name="username" value={formData.username} onChange={handleChange} required />
                </div>
                <div>
                    <label>Password:</label>
                    <input type="password" name="password" value={formData.password} onChange={handleChange} required />
                </div>
                <button type="submit">Register</button>
            </form>
            <p>{message}</p>
        </div>
    );
};

export default Register;
