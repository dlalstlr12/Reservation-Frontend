import React, { useState, useEffect } from "react";
import { getUserSubscriptions } from "../services/userApi";

const MainPage = () => {
    const [subscriptions, setSubscriptions] = useState([]);
    const [message, setMessage] = useState("");
    const userId = 11; // 현재 로그인한 사용자 ID (Mock)

    const fetchSubscriptions = async () => {
        try {
            const data = await getUserSubscriptions(userId);
            setSubscriptions(data);
        } catch (error) {
            setMessage("Failed to fetch subscriptions.");
        }
    };

    useEffect(() => {
        fetchSubscriptions();
    }, []);

    const totalCost = subscriptions.reduce((sum, sub) => sum + sub.pricingPlan.price * sub.duration, 0);

    return (
        <div>
            <h2>Your Subscriptions</h2>
            <ul>
                {subscriptions.map((sub) => (
                    <li key={sub.id}>
                        {sub.pricingPlan.ott.name} - {sub.pricingPlan.planName} -{sub.duration} months (
                        {sub.pricingPlan.price * sub.duration}₩)
                    </li>
                ))}
            </ul>
            <h3>Total Cost: {totalCost}₩</h3>
            <p>{message}</p>
        </div>
    );
};

export default MainPage;
