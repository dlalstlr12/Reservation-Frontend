import React, { useState, useEffect } from "react";
import { createOtt, createPricingPlan, getAllOtts } from "../services/adminApi";
import axios from "axios";

const AdminPage = () => {
    const [ottName, setOttName] = useState("");
    const [description, setDescription] = useState("");
    const [planData, setPlanData] = useState({ planName: "", price: "" });
    const [selectedOttId, setSelectedOttId] = useState("");
    const [otts, setOtts] = useState([]);
    const [message, setMessage] = useState("");

    // OTT 목록 가져오기
    const fetchOtts = async () => {
        try {
            const response = await axios.get("http://localhost:8080/api/admin/ott", {
                withCredentials: true,
                headers: {
                    Accept: "application/json",
                    "Content-Type": "application/json",
                },
            });

            // response.data가 이미 배열 형태일 것입니다
            if (Array.isArray(response.data)) {
                setOtts(response.data);
            } else {
                console.error("예상치 못한 데이터 형식:", response.data);
                setOtts([]);
            }
        } catch (error) {
            console.error("OTT 목록 가져오기 실패:", error);
            setMessage("OTT 목록을 가져오는데 실패했습니다.");
            setOtts([]);
        }
    };
    useEffect(() => {
        fetchOtts();
    }, []);

    // OTT 생성
    const handleCreateOtt = async () => {
        try {
            await createOtt({ name: ottName, description });
            setMessage("OTT created successfully!");
            fetchOtts(); // 목록 갱신
        } catch (error) {
            setMessage("Failed to create OTT.");
        }
    };

    // 가격제 추가
    const handleCreatePlan = async () => {
        try {
            const response = await axios.post(
                `http://localhost:8080/api/admin/ott/${selectedOttId}/pricing-plan`,
                {
                    planName: planData.planName,
                    price: parseInt(planData.price),
                },
                {
                    withCredentials: true,
                }
            );
            console.log("가격제 추가 응답:", response.data);
            setMessage("가격제가 성공적으로 추가되었습니다!");
            fetchOtts(); // 목록 갱신
        } catch (error) {
            console.error("가격제 추가 실패:", error);
            setMessage("가격제 추가에 실패했습니다.");
        }
    };

    return (
        <div>
            <h2>Admin Page</h2>
            <div>
                <h3>Create OTT</h3>
                <input
                    type="text"
                    placeholder="OTT Name"
                    value={ottName}
                    onChange={(e) => setOttName(e.target.value)}
                />
                <input
                    type="text"
                    placeholder="Description"
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                />
                <button onClick={handleCreateOtt}>Create OTT</button>
            </div>

            <div>
                <h3>Add Pricing Plan</h3>
                <select value={selectedOttId} onChange={(e) => setSelectedOttId(e.target.value)}>
                    <option value="">Select OTT</option>
                    {otts &&
                        otts.map((ott) => (
                            <option key={ott.id} value={ott.id}>
                                {ott.name}
                            </option>
                        ))}
                </select>
                <input
                    type="text"
                    placeholder="Plan Name"
                    value={planData.planName}
                    onChange={(e) => setPlanData({ ...planData, planName: e.target.value })}
                />
                <input
                    type="number"
                    placeholder="Price"
                    value={planData.price}
                    onChange={(e) => setPlanData({ ...planData, price: e.target.value })}
                />
                <button onClick={handleCreatePlan}>Add Plan</button>
            </div>

            {/* OTT 목록 표시 */}
            <div>
                <h3>OTT 목록</h3>
                {otts && otts.length > 0 ? (
                    <div>
                        {otts.map((ott) => (
                            <div
                                key={ott.id}
                                style={{
                                    border: "1px solid #ddd",
                                    margin: "10px 0",
                                    padding: "10px",
                                    borderRadius: "5px",
                                }}
                            >
                                <h4>{ott.name}</h4>
                                <p>{ott.description}</p>
                                {ott.pricingPlans && ott.pricingPlans.length > 0 && (
                                    <div>
                                        <h5>가격제:</h5>
                                        <ul>
                                            {ott.pricingPlans.map((plan) => (
                                                <li key={plan.id}>
                                                    {plan.planName}: {plan.price}원
                                                </li>
                                            ))}
                                        </ul>
                                    </div>
                                )}
                            </div>
                        ))}
                    </div>
                ) : (
                    <p>등록된 OTT가 없습니다.</p>
                )}
            </div>

            {/* 메시지 표시 */}
            {message && (
                <div
                    style={{
                        margin: "20px 0",
                        padding: "10px",
                        backgroundColor: "#f0f0f0",
                        borderRadius: "5px",
                    }}
                >
                    {message}
                </div>
            )}
        </div>
    );
};

export default AdminPage;
