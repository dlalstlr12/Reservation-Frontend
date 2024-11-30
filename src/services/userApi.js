import axios from "axios";

const API = axios.create({
    baseURL: "http://localhost:8080/api/users",
    withCredentials: true,
});

export const registerUser = async (userData) => {
    const response = await API.post("/register", userData);
    return response.data;
};

export const loginUser = async (userData) => {
    const response = await API.post("/login", userData);
    return response.data;
};
// 구독 생성
export const createSubscription = async (data) => {
    const response = await API.post("", data);
    return response.data;
};

// 회원의 구독 목록 가져오기
export const getUserSubscriptions = async (userId) => {
    const response = await API.get(`/${userId}`);
    return response.data;
};
