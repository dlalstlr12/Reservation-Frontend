import axios from "axios";

const ADMIN_API = axios.create({
    baseURL: "http://localhost:8080/api/admin/ott",
    withCredentials: true, // JWT 쿠키 전송
});

// OTT 생성
export const createOtt = async (data) => {
    const response = await ADMIN_API.post("", data);
    return response.data;
};

// 가격제 추가
export const createPricingPlan = async (ottId, planData) => {
    const response = await ADMIN_API.post(`/${ottId}/plans`, planData);
    return response.data;
};

// OTT 목록 가져오기
export const getAllOtts = async () => {
    const response = await ADMIN_API.get("/");
    return response.data;
};
