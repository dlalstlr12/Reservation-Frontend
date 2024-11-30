import React, { useState, useEffect } from "react";
import { getAllOtts } from "../services/adminApi";
import { createSubscription } from "../services/userApi";

const OttListPage = () => {
    const [otts, setOtts] = useState([]);
    const [selectedPlanId, setSelectedPlanId] = useState("");
    const [duration, setDuration] = useState("");
    const [message, setMessage] = useState("");

    // OTT 목록 가져오기
    const fetchOtts = async () => {
        try {
            const data = await getAllOtts();
            setOtts(data);
        } catch (error) {
            setMessage("Failed to fetch OTTs.");
        }
    };

    useEffect(() => {
        fetchOtts();
    }, []);

    // 구독 생성
    const handleSubscribe = async (planId) => {
        try {
            await createSubscription({ pricingPlanId: planId, duration });
            setMessage("Subscription created successfully!");
        } catch (error) {
            setMessage("Failed to create subscription.");
        }
    };

    return (
        <div>
            <h2>OTT List</h2>
            {otts.map((ott) => (
                <div key={ott.id}>
                    <h3>{ott.name}</h3>
                    <p>{ott.description}</p>
                    <ul>
                        {ott.pricingPlans.map((plan) => (
                            <li key={plan.id}>
                                {plan.planName} - {plan.price}₩/month
                                <button onClick={() => handleSubscribe(plan.id)}>Subscribe</button>
                            </li>
                        ))}
                    </ul>
                </div>
            ))}
            <p>{message}</p>
        </div>
    );
};

export default OttListPage;
