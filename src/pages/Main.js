import React, { useState, useEffect } from "react";
import { Container, Row, Col, Card, Button, Alert } from "react-bootstrap";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import "../styles/Main.css";

const Main = () => {
    const [subscriptions, setSubscriptions] = useState([]);
    const [message, setMessage] = useState("");
    const [totalAmount, setTotalAmount] = useState(0);
    const navigate = useNavigate();

    useEffect(() => {
        fetchActiveSubscriptions();
    }, []);

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
            fetchActiveSubscriptions();
        } catch (error) {
            console.error("구독 취소 실패:", error);
            setMessage("구독 취소에 실패했습니다.");
        }
    };

    return (
        <div className="main-container">
            <Container className="py-5">
                <h2 className="text-center mb-4">내 구독 서비스</h2>

                <Card className="total-amount-card mb-4">
                    <Card.Body>
                        <h4 className="text-center mb-0">총 구독 금액: {totalAmount.toLocaleString()}원 / 월</h4>
                    </Card.Body>
                </Card>

                {message && (
                    <Alert
                        variant={message.includes("실패") ? "danger" : "success"}
                        onClose={() => setMessage("")}
                        dismissible
                        className="mb-4"
                    >
                        {message}
                    </Alert>
                )}

                {subscriptions.length === 0 ? (
                    <Card className="empty-state-card text-center p-5">
                        <Card.Body>
                            <p className="mb-4">현재 구독 중인 서비스가 없습니다.</p>
                            <Button variant="primary" onClick={() => navigate("/ott-list")} className="subscribe-btn">
                                OTT 서비스 둘러보기
                            </Button>
                        </Card.Body>
                    </Card>
                ) : (
                    <Row className="g-4">
                        {subscriptions.map((subscription) => (
                            <Col key={subscription.id} md={6} lg={4}>
                                <Card className="subscription-card h-100">
                                    <Card.Body>
                                        <h5 className="subscription-title mb-3">{subscription.ottName}</h5>
                                        <div className="subscription-details">
                                            <p>요금제: {subscription.planName}</p>
                                            <p>가격: {subscription.price.toLocaleString()}원</p>
                                            <p>구독 기간: {subscription.duration}개월</p>
                                            <p>구독 시작: {new Date(subscription.startDate).toLocaleDateString()}</p>
                                            <p>구독 만료: {new Date(subscription.endDate).toLocaleDateString()}</p>
                                            <p className="status">상태: {subscription.active ? "구독중" : "만료됨"}</p>
                                        </div>
                                        {subscription.active && (
                                            <div className="d-grid mt-3">
                                                <Button
                                                    variant="danger"
                                                    onClick={() => {
                                                        if (window.confirm("정말로 구독을 취소하시겠습니까?")) {
                                                            handleCancelSubscription(subscription.id);
                                                        }
                                                    }}
                                                >
                                                    구독 취소
                                                </Button>
                                            </div>
                                        )}
                                    </Card.Body>
                                </Card>
                            </Col>
                        ))}
                    </Row>
                )}
            </Container>
        </div>
    );
};

export default Main;
