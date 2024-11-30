import React, { useState, useEffect } from "react";
import { createOtt, createPricingPlan, getAllOtts } from "../services/adminApi";
import axios from "axios";
import { Container, Row, Col, Form, Button, Card, Alert } from "react-bootstrap";

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
                    "Content-Type": "application/json;charset=UTF-8",
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
        <Container className="py-5">
            <h2 className="text-center mb-4">관리자 페이지</h2>

            {/* OTT 생성 폼 */}
            <Card className="mb-4">
                <Card.Header as="h3">OTT 서비스 생성</Card.Header>
                <Card.Body>
                    <Form>
                        <Row>
                            <Col md={6}>
                                <Form.Group className="mb-3">
                                    <Form.Label>OTT 이름</Form.Label>
                                    <Form.Control
                                        type="text"
                                        placeholder="OTT 이름을 입력하세요"
                                        value={ottName}
                                        onChange={(e) => setOttName(e.target.value)}
                                    />
                                </Form.Group>
                            </Col>
                            <Col md={6}>
                                <Form.Group className="mb-3">
                                    <Form.Label>설명</Form.Label>
                                    <Form.Control
                                        type="text"
                                        placeholder="설명을 입력하세요"
                                        value={description}
                                        onChange={(e) => setDescription(e.target.value)}
                                    />
                                </Form.Group>
                            </Col>
                        </Row>
                        <Button variant="primary" onClick={handleCreateOtt}>
                            OTT 생성
                        </Button>
                    </Form>
                </Card.Body>
            </Card>

            {/* 가격제 추가 폼 */}
            <Card className="mb-4">
                <Card.Header as="h3">가격제 추가</Card.Header>
                <Card.Body>
                    <Form>
                        <Row>
                            <Col md={4}>
                                <Form.Group className="mb-3">
                                    <Form.Label>OTT 선택</Form.Label>
                                    <Form.Select
                                        value={selectedOttId}
                                        onChange={(e) => setSelectedOttId(e.target.value)}
                                    >
                                        <option value="">OTT를 선택하세요</option>
                                        {otts.map((ott) => (
                                            <option key={ott.id} value={ott.id}>
                                                {ott.name}
                                            </option>
                                        ))}
                                    </Form.Select>
                                </Form.Group>
                            </Col>
                            <Col md={4}>
                                <Form.Group className="mb-3">
                                    <Form.Label>요금제 이름</Form.Label>
                                    <Form.Control
                                        type="text"
                                        placeholder="요금제 이름"
                                        value={planData.planName}
                                        onChange={(e) => setPlanData({ ...planData, planName: e.target.value })}
                                    />
                                </Form.Group>
                            </Col>
                            <Col md={4}>
                                <Form.Group className="mb-3">
                                    <Form.Label>가격</Form.Label>
                                    <Form.Control
                                        type="number"
                                        placeholder="가격"
                                        value={planData.price}
                                        onChange={(e) => setPlanData({ ...planData, price: e.target.value })}
                                    />
                                </Form.Group>
                            </Col>
                        </Row>
                        <Button variant="primary" onClick={handleCreatePlan}>
                            가격제 추가
                        </Button>
                    </Form>
                </Card.Body>
            </Card>

            {/* OTT 목록 */}
            <Card>
                <Card.Header as="h3">OTT 서비스 목록</Card.Header>
                <Card.Body>
                    {otts && otts.length > 0 ? (
                        <Row>
                            {otts.map((ott) => (
                                <Col md={6} lg={4} key={ott.id} className="mb-4">
                                    <Card>
                                        <Card.Body>
                                            <Card.Title>{ott.name}</Card.Title>
                                            <Card.Text>{ott.description}</Card.Text>
                                            {ott.pricingPlans && ott.pricingPlans.length > 0 && (
                                                <div>
                                                    <h6 className="mt-3">가격제:</h6>
                                                    <ul className="list-unstyled">
                                                        {ott.pricingPlans.map((plan) => (
                                                            <li key={plan.id} className="mb-2">
                                                                {plan.planName}: {plan.price.toLocaleString()}원
                                                            </li>
                                                        ))}
                                                    </ul>
                                                </div>
                                            )}
                                        </Card.Body>
                                    </Card>
                                </Col>
                            ))}
                        </Row>
                    ) : (
                        <Alert variant="info">등록된 OTT가 없습니다.</Alert>
                    )}
                </Card.Body>
            </Card>

            {/* 메시지 표시 */}
            {message && (
                <Alert variant="info" className="mt-3" onClose={() => setMessage("")} dismissible>
                    {message}
                </Alert>
            )}
        </Container>
    );
};

export default AdminPage;
