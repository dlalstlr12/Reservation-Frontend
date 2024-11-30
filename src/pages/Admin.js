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
            const data = await axios.get("http://localhost:8080/api/admin/ott", {
                withCredentials: true, // 쿠키 전송 허용
            });
            setOtts(data.data);
        } catch (error) {
            setMessage("Failed to fetch OTTs.");
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
            await createPricingPlan(selectedOttId, planData);
            setMessage("Pricing plan added successfully!");
            fetchOtts(); // 목록 갱신
        } catch (error) {
            setMessage("Failed to add pricing plan.");
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
                    {otts.map((ott) => (
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
            <div>
                <h3>ott 목록</h3>
                <p>
                    {otts.map((ott) => (
                        <option key={ott.id} value={ott.id}>
                            {ott.name}
                        </option>
                    ))}
                </p>
            </div>
        </div>
    );
};

export default AdminPage;
