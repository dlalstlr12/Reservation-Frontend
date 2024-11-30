import React, { useState, useEffect } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

const Main = () => {
    const [subscriptions, setSubscriptions] = useState([]);
    const [message, setMessage] = useState("");
    const [totalAmount, setTotalAmount] = useState(0);
    const navigate = useNavigate();

    useEffect(() => {
        fetchActiveSubscriptions();
    }, []);

    // 총 구독 금액 계산
    useEffect(() => {
        const total = subscriptions.reduce((sum, sub) => sum + sub.price, 0);
        setTotalAmount(total);
    }, [subscriptions]);

    const fetchActiveSubscriptions = async () => {
        try {
            const response = await axios.get("http://localhost:8080/api/subscriptions/user/active", {
                withCredentials: true,
            });
            setSubscriptions(response.data);
        } catch (error) {
            console.error("구독 목록 가져오기 실패:", error);
            if (error.response?.status === 401) {
                setMessage("로그인이 필요합니다.");
                navigate("/login");
            } else {
                setMessage("구독 목록을 가져오는데 실패했습니다.");
            }
        }
    };

    const handleCancelSubscription = async (subscriptionId) => {
        try {
            await axios.post(
                `http://localhost:8080/api/subscriptions/${subscriptionId}/cancel`,
                {},
                { withCredentials: true }
            );

            setMessage("구독이 성공적으로 취소되었습니다.");
            // 구독 목록 새로고침
            fetchActiveSubscriptions();
        } catch (error) {
            console.error("구독 취소 실패:", error);
            setMessage("구독 취소에 실패했습니다.");
        }
    };

    return (
        <div className="container mt-4">
            <h2>내 구독 서비스</h2>

            {/* 총 구독 금액 표시 */}
            <div className="alert alert-info mb-4">
                <h4>총 구독 금액: {totalAmount.toLocaleString()}원 / 월</h4>
            </div>

            {message && (
                <div className="alert alert-info" role="alert">
                    {message}
                </div>
            )}

            {subscriptions.length === 0 ? (
                <p>현재 구독 중인 서비스가 없습니다.</p>
            ) : (
                <div className="row">
                    {subscriptions.map((subscription) => (
                        <div key={subscription.id} className="col-md-4 mb-4">
                            <div className="card">
                                <div className="card-body">
                                    <h5 className="card-title">{subscription.ottName}</h5>
                                    <p className="card-text">
                                        요금제: {subscription.planName}
                                        <br />
                                        가격: {subscription.price.toLocaleString()}원<br />
                                        구독 기간: {subscription.duration}개월
                                        <br />
                                        구독 시작: {new Date(subscription.startDate).toLocaleDateString()}
                                        <br />
                                        구독 만료: {new Date(subscription.endDate).toLocaleDateString()}
                                        <br />
                                        상태: {subscription.active ? "구독중" : "만료됨"}
                                    </p>
                                    {subscription.active && (
                                        <button
                                            className="btn btn-danger"
                                            onClick={() => {
                                                if (window.confirm("정말로 구독을 취소하시겠습니까?")) {
                                                    handleCancelSubscription(subscription.id);
                                                }
                                            }}
                                        >
                                            구독 취소
                                        </button>
                                    )}
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
};

export default Main;
