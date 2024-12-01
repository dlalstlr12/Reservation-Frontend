import React, { useState, useEffect } from "react";
import { Container, Row, Col, Card, Button, Modal, Form, Alert } from "react-bootstrap";
import { FaStream, FaCrown, FaRegClock } from "react-icons/fa";
import axios from "axios";
import "../styles/OttList.css";

const OttList = () => {
    const [otts, setOtts] = useState([]);
    const [message, setMessage] = useState("");
    const [selectedOtt, setSelectedOtt] = useState(null);
    const [selectedPlan, setSelectedPlan] = useState(null);
    const [subscriptionPeriod, setSubscriptionPeriod] = useState(1);
    const [showSubscribeModal, setShowSubscribeModal] = useState(false);

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
            setMessage("OTT 목록을 가져오는데 실패했습니다.");
        }
    };

    const handleSubscribe = (ott) => {
        setSelectedOtt(ott);
        setSelectedPlan(null);
        setShowSubscribeModal(true);
    };

    const handleConfirmSubscription = async () => {
        if (!selectedPlan) {
            setMessage("요금제를 선택해주세요.");
            return;
        }

        try {
            await axios.post(
                "http://localhost:8080/api/subscriptions",
                {
                    ottId: selectedOtt.id,
                    pricingPlanId: selectedPlan.id,
                    period: subscriptionPeriod,
                },
                { withCredentials: true }
            );
            setMessage("구독이 완료되었습니다!");
            setShowSubscribeModal(false);
            setSelectedOtt(null);
            setSelectedPlan(null);
        } catch (error) {
            setMessage(error.response?.data?.message || "구독 신청에 실패했습니다.");
        }
    };

    return (
        <div className="ott-list-container">
            <Container className="py-5">
                <div className="section-header text-center mb-5">
                    <h2 className="section-title">OTT 서비스 목록</h2>
                    <p className="section-subtitle">다양한 OTT 서비스를 구독하고 즐겨보세요</p>
                </div>

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

                <Row className="g-4">
                    {otts.map((ott) => (
                        <Col key={ott.id} md={6} lg={4}>
                            <Card className="ott-card h-100">
                                <Card.Body>
                                    <div className="ott-icon mb-3">
                                        <FaStream />
                                    </div>
                                    <h3 className="ott-title mb-3">{ott.name}</h3>
                                    <p className="ott-description">{ott.description}</p>
                                    <div className="pricing-preview mb-3">
                                        {ott.pricingPlans.length > 0 && (
                                            <p className="mb-0">
                                                <small>최저 </small>
                                                <span className="price">
                                                    {Math.min(
                                                        ...ott.pricingPlans.map((plan) => plan.price)
                                                    ).toLocaleString()}
                                                    원
                                                </span>
                                                <small> 부터</small>
                                            </p>
                                        )}
                                    </div>
                                    <div className="d-grid">
                                        <Button className="subscribe-btn" onClick={() => handleSubscribe(ott)}>
                                            구독하기
                                        </Button>
                                    </div>
                                </Card.Body>
                            </Card>
                        </Col>
                    ))}
                </Row>

                <Modal
                    show={showSubscribeModal}
                    onHide={() => setShowSubscribeModal(false)}
                    centered
                    className="subscription-modal"
                >
                    <Modal.Header closeButton>
                        <Modal.Title>
                            <FaCrown className="modal-icon me-2" />
                            {selectedOtt?.name} 구독
                        </Modal.Title>
                    </Modal.Header>
                    <Modal.Body>
                        <Form>
                            <Form.Group className="mb-4">
                                <Form.Label className="fw-bold">
                                    <FaStream className="me-2" />
                                    요금제 선택
                                </Form.Label>
                                <div className="plan-options">
                                    {selectedOtt?.pricingPlans.map((plan) => (
                                        <Card
                                            key={plan.id}
                                            className={`plan-card mb-2 ${
                                                selectedPlan?.id === plan.id ? "selected" : ""
                                            }`}
                                            onClick={() => setSelectedPlan(plan)}
                                        >
                                            <Card.Body>
                                                <div className="d-flex justify-content-between align-items-center">
                                                    <div>
                                                        <h6 className="mb-1">{plan.planName}</h6>
                                                        <p className="mb-0 text-muted">
                                                            {plan.price.toLocaleString()}원/월
                                                        </p>
                                                    </div>
                                                    <Form.Check
                                                        type="radio"
                                                        checked={selectedPlan?.id === plan.id}
                                                        onChange={() => {}}
                                                    />
                                                </div>
                                            </Card.Body>
                                        </Card>
                                    ))}
                                </div>
                            </Form.Group>

                            <Form.Group className="mb-4">
                                <Form.Label className="fw-bold">
                                    <FaRegClock className="me-2" />
                                    구독 기간
                                </Form.Label>
                                <Form.Select
                                    value={subscriptionPeriod}
                                    onChange={(e) => setSubscriptionPeriod(Number(e.target.value))}
                                    className="period-select"
                                >
                                    <option value={1}>1개월</option>
                                    <option value={3}>3개월</option>
                                    <option value={6}>6개월</option>
                                    <option value={12}>12개월</option>
                                </Form.Select>
                            </Form.Group>

                            {selectedPlan && (
                                <div className="total-price">
                                    <h5 className="mb-0">
                                        총 결제 금액: {(selectedPlan.price * subscriptionPeriod).toLocaleString()}원
                                    </h5>
                                </div>
                            )}
                        </Form>
                    </Modal.Body>
                    <Modal.Footer>
                        <Button variant="outline-secondary" onClick={() => setShowSubscribeModal(false)}>
                            취소
                        </Button>
                        <Button className="subscribe-btn" onClick={handleConfirmSubscription} disabled={!selectedPlan}>
                            구독하기
                        </Button>
                    </Modal.Footer>
                </Modal>
            </Container>
        </div>
    );
};

export default OttList;
