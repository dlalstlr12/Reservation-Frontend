import React, { useState, useEffect } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

const OttList = () => {
    const [otts, setOtts] = useState([]);
    const [message, setMessage] = useState("");
    const [selectedOtt, setSelectedOtt] = useState(null);
    const [selectedPlan, setSelectedPlan] = useState(null);
    const [subscriptionPeriod, setSubscriptionPeriod] = useState(1); // 기본 1개월
    const [showSubscribeModal, setShowSubscribeModal] = useState(false);
    const navigate = useNavigate();

    useEffect(() => {
        fetchOtts();
    }, []);

    const fetchOtts = async () => {
        try {
            const response = await axios.get("http://localhost:8080/api/admin/ott", {
                withCredentials: true,
            });
            setOtts(response.data);
        } catch (error) {
            console.error("OTT 목록 가져오기 실패:", error);
            setMessage("OTT 목록을 가져오는데 실패했습니다.");
        }
    };

    const handleSubscribe = (ott) => {
        setSelectedOtt(ott);
        setShowSubscribeModal(true);
    };
    const handleConfirmSubscription = async () => {
        if (!selectedPlan) {
            setMessage("요금제를 선택해주세요.");
            return;
        }

        try {
            const subscriptionData = {
                ottId: selectedOtt.id,
                pricingPlanId: selectedPlan.id,
                period: subscriptionPeriod,
            };

            const response = await axios.post("http://localhost:8080/api/subscriptions", subscriptionData, {
                withCredentials: true,
                headers: {
                    "Content-Type": "application/json",
                },
            });

            setMessage("구독이 완료되었습니다!");
            setShowSubscribeModal(false);
            setSelectedPlan(null);
            setSubscriptionPeriod(1);
        } catch (error) {
            console.error("구독 신청 실패:", error);
            if (error.response?.status === 401) {
                setMessage("로그인이 필요한 서비스입니다.");
                navigate("/login");
            } else {
                setMessage(error.response?.data?.message || "구독 신청에 실패했습니다.");
            }
        }
    };

    return (
        <div className="container mt-4">
            <h2>OTT 서비스 목록</h2>

            {message && (
                <div className="alert alert-info" role="alert">
                    {typeof message === "string" ? message : "오류가 발생했습니다."}
                </div>
            )}

            <div className="row">
                {otts.map((ott) => (
                    <div key={ott.id} className="col-md-4 mb-4">
                        <div className="card">
                            <div className="card-body">
                                <h5 className="card-title">{ott.name}</h5>
                                <p className="card-text">{ott.description}</p>
                                <div className="mt-3">
                                    <h6>요금제:</h6>
                                    <ul className="list-unstyled">
                                        {ott.pricingPlans.map((plan) => (
                                            <li key={plan.id}>
                                                {plan.planName}: {plan.price}원
                                            </li>
                                        ))}
                                    </ul>
                                </div>
                                <button className="btn btn-primary" onClick={() => handleSubscribe(ott)}>
                                    구독하기
                                </button>
                            </div>
                        </div>
                    </div>
                ))}
            </div>

            {/* 구독 모달 */}
            {showSubscribeModal && (
                <div className="modal" style={{ display: "block", backgroundColor: "rgba(0,0,0,0.5)" }}>
                    <div className="modal-dialog">
                        <div className="modal-content">
                            <div className="modal-header">
                                <h5 className="modal-title">{selectedOtt.name} 구독</h5>
                                <button type="button" className="close" onClick={() => setShowSubscribeModal(false)}>
                                    <span>&times;</span>
                                </button>
                            </div>
                            <div className="modal-body">
                                {/* 요금제 선택 */}
                                <div className="form-group mb-3">
                                    <label>요금제 선택</label>
                                    <div>
                                        {selectedOtt.pricingPlans.map((plan) => (
                                            <div key={plan.id} className="form-check">
                                                <input
                                                    type="radio"
                                                    className="form-check-input"
                                                    name="pricingPlan"
                                                    id={`plan-${plan.id}`}
                                                    checked={selectedPlan?.id === plan.id}
                                                    onChange={() => setSelectedPlan(plan)}
                                                />
                                                <label className="form-check-label" htmlFor={`plan-${plan.id}`}>
                                                    {plan.planName}: {plan.price.toLocaleString()}원
                                                </label>
                                            </div>
                                        ))}
                                    </div>
                                </div>

                                {/* 구독 기간 선택 */}
                                <div className="form-group">
                                    <label>구독 기간 (월)</label>
                                    <select
                                        className="form-control"
                                        value={subscriptionPeriod}
                                        onChange={(e) => setSubscriptionPeriod(Number(e.target.value))}
                                    >
                                        <option value={1}>1개월</option>
                                        <option value={3}>3개월</option>
                                        <option value={6}>6개월</option>
                                        <option value={12}>12개월</option>
                                    </select>
                                </div>

                                {/* 총 결제 금액 표시 */}
                                {selectedPlan && (
                                    <p className="mt-3">
                                        총 결제 금액: {(selectedPlan.price * subscriptionPeriod).toLocaleString()}원
                                    </p>
                                )}
                            </div>
                            <div className="modal-footer">
                                <button
                                    type="button"
                                    className="btn btn-secondary"
                                    onClick={() => setShowSubscribeModal(false)}
                                >
                                    취소
                                </button>
                                <button
                                    type="button"
                                    className="btn btn-primary"
                                    onClick={handleConfirmSubscription}
                                    disabled={!selectedPlan}
                                >
                                    구독하기
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default OttList;
