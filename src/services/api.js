import axios from "axios";

const API = axios.create({
    baseURL: "http://localhost:8080", // Spring Boot 서버 주소
});

export const fetchUsers = async () => {
    const response = await API.get("/users"); // 백엔드 엔드포인트 호출
    return response.data;
};
