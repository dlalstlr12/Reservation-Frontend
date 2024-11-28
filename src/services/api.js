import axios from "axios";

const API = axios.create({
    baseURL: "http://localhost:8080/api/users",
});

export const registerUser = async (userData) => {
    const response = await API.post("/register", userData);
    return response.data;
};

export const loginUser = async (userData) => {
    const response = await API.post("/login", userData);
    return response.data;
};
