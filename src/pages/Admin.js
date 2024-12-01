import React, { useState, useEffect } from "react";
import { Container, Row, Col, Card, Button, Form, Alert, Modal, Table } from "react-bootstrap";
import { FaPlus, FaEdit, FaTrash, FaStream, FaCrown, FaWonSign } from "react-icons/fa";
import axios from "axios";
import "../styles/Admin.css";

const Admin = () => {
    const [otts, setOtts] = useState([]);
    const [message, setMessage] = useState("");
    const [showOttModal, setShowOttModal] = useState(false);
    const [showPlanModal, setShowPlanModal] = useState(false);
    const [selectedOtt, setSelectedOtt] = useState(null);
    const [ottForm, setOttForm] = useState({ name: "", description: "" });
    const [planForm, setPlanForm] = useState({ planName: "", price: "" });
    const [isEditing, setIsEditing] = useState(false);

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

    const handleSubmitOtt = async (e) => {
        e.preventDefault();
        try {
            if (isEditing && selectedOtt) {
                await axios.put(
                    `http://localhost:8080/api/admin/ott/${selectedOtt.id}`,
                    {
                        name: ottForm.name,
                        description: ottForm.description,
                    },
                    { withCredentials: true }
                );
                setMessage("OTT 서비스가 성공적으로 수정되었습니다.");
            } else {
                await axios.post(
                    "http://localhost:8080/api/admin/ott",
                    {
                        name: ottForm.name,
                        description: ottForm.description,
                    },
                    { withCredentials: true }
                );
                setMessage("새로운 OTT 서비스가 추가되었습니다.");
            }

            // 모달 닫고 폼 초기화
            setShowOttModal(false);
            setOttForm({ name: "", description: "" });
            setIsEditing(false);
            setSelectedOtt(null);

            // 목록 새로고침
            fetchOtts();
        } catch (error) {
            setMessage(error.response?.data?.message || "OTT 서비스 처리 중 오류가 발생했습니다.");
        }
    };

    const handleSubmitPlan = async (e) => {
        e.preventDefault();
        try {
            await axios.post(`http://localhost:8080/api/admin/ott/${selectedOtt.id}/pricing-plan`, planForm, {
                withCredentials: true,
            });
            setMessage("요금제가 추가되었습니다.");
            setShowPlanModal(false);
            fetchOtts();
        } catch (error) {
            setMessage("요금제 추가 실패: " + error.message);
        }
    };

    const handleDeleteOtt = async (ottId) => {
        try {
            await axios.delete(`http://localhost:8080/api/admin/ott/${ottId}`, {
                withCredentials: true,
            });
            setMessage("OTT 서비스가 삭제되었습니다.");
            fetchOtts();
        } catch (error) {
            setMessage("삭제 실패: " + error.message);
        }
    };

    const handleDeletePlan = async (ottId, planId) => {
        try {
            await axios.delete(`http://localhost:8080/api/admin/ott/${ottId}/pricing-plan/${planId}`, {
                withCredentials: true,
            });
            setMessage("요금제가 삭제되었습니다.");
            fetchOtts();
        } catch (error) {
            setMessage("요금제 삭제 실패: " + error.message);
        }
    };
    const handleEditOtt = (ott) => {
        setIsEditing(true);
        setSelectedOtt(ott);
        setOttForm({
            name: ott.name,
            description: ott.description,
        });
        setShowOttModal(true);
    };
    return (
        <div className="admin-container">
            <Container className="py-5">
                <div className="admin-header">
                    <h2 className="admin-title">OTT 서비스 관리</h2>
                    <Button
                        className="add-ott-btn"
                        onClick={() => {
                            setIsEditing(false);
                            setOttForm({ name: "", description: "" });
                            setShowOttModal(true);
                        }}
                    >
                        <FaPlus className="me-2" /> 새 OTT 서비스 추가
                    </Button>
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
                            <Card className="admin-card">
                                <Card.Body>
                                    <div className="ott-icon mb-3">
                                        <FaStream />
                                    </div>
                                    <h3 className="ott-name">{ott.name}</h3>
                                    <p className="ott-description">{ott.description}</p>

                                    <div className="plans-section">
                                        <h5 className="plans-title">
                                            <FaCrown className="me-2" />
                                            요금제 목록
                                        </h5>
                                        <div className="plans-table-container">
                                            <Table hover size="sm" className="plans-table">
                                                <thead>
                                                    <tr>
                                                        <th>요금제명</th>
                                                        <th>가격</th>
                                                        <th>관리</th>
                                                    </tr>
                                                </thead>
                                                <tbody>
                                                    {ott.pricingPlans.map((plan) => (
                                                        <tr key={plan.id}>
                                                            <td>{plan.planName}</td>
                                                            <td>
                                                                <FaWonSign className="me-1" />
                                                                {plan.price.toLocaleString()}
                                                            </td>
                                                            <td>
                                                                <Button
                                                                    variant="danger"
                                                                    size="sm"
                                                                    className="delete-plan-btn"
                                                                    onClick={() => handleDeletePlan(ott.id, plan.id)}
                                                                >
                                                                    <FaTrash />
                                                                </Button>
                                                            </td>
                                                        </tr>
                                                    ))}
                                                </tbody>
                                            </Table>
                                        </div>
                                    </div>

                                    <div className="admin-actions">
                                        <Button
                                            className="action-btn add-plan-btn"
                                            onClick={() => {
                                                setSelectedOtt(ott);
                                                setPlanForm({ planName: "", price: "" });
                                                setShowPlanModal(true);
                                            }}
                                        >
                                            <FaPlus className="me-2" /> 요금제 추가
                                        </Button>
                                        <Button className="action-btn edit-btn" onClick={() => handleEditOtt(ott)}>
                                            <FaEdit className="me-2" /> 수정
                                        </Button>
                                        <Button
                                            className="action-btn delete-btn"
                                            onClick={() => {
                                                if (window.confirm("정말로 삭제하시겠습니까?")) {
                                                    handleDeleteOtt(ott.id);
                                                }
                                            }}
                                        >
                                            <FaTrash className="me-2" /> 삭제
                                        </Button>
                                    </div>
                                </Card.Body>
                            </Card>
                        </Col>
                    ))}
                </Row>

                {/* OTT Modal */}
                <Modal
                    show={showOttModal}
                    onHide={() => {
                        setShowOttModal(false);
                        setOttForm({ name: "", description: "" });
                        setIsEditing(false);
                        setSelectedOtt(null);
                    }}
                    centered
                    className="admin-modal"
                >
                    <Modal.Header closeButton>
                        <Modal.Title>
                            <FaStream className="me-2" />
                            {isEditing ? "OTT 서비스 수정" : "새 OTT 서비스 추가"}
                        </Modal.Title>
                    </Modal.Header>
                    <Modal.Body>
                        <Form onSubmit={handleSubmitOtt}>
                            <Form.Group className="mb-3">
                                <Form.Label>서비스명</Form.Label>
                                <Form.Control
                                    type="text"
                                    name="name"
                                    value={ottForm.name}
                                    onChange={(e) => setOttForm({ ...ottForm, name: e.target.value })}
                                    required
                                    placeholder="OTT 서비스 이름을 입력하세요"
                                />
                            </Form.Group>
                            <Form.Group className="mb-3">
                                <Form.Label>설명</Form.Label>
                                <Form.Control
                                    as="textarea"
                                    rows={3}
                                    name="description"
                                    value={ottForm.description}
                                    onChange={(e) => setOttForm({ ...ottForm, description: e.target.value })}
                                    required
                                    placeholder="OTT 서비스에 대한 설명을 입력하세요"
                                />
                            </Form.Group>
                            <div className="d-grid gap-2">
                                <Button
                                    type="submit"
                                    className={`submit-btn ${isEditing ? "btn-success" : "btn-primary"}`}
                                >
                                    {isEditing ? "수정하기" : "추가하기"}
                                </Button>
                            </div>
                        </Form>
                    </Modal.Body>
                </Modal>

                {/* Plan Modal */}
                <Modal show={showPlanModal} onHide={() => setShowPlanModal(false)} centered className="admin-modal">
                    <Modal.Header closeButton>
                        <Modal.Title>
                            <FaCrown className="me-2" />새 요금제 추가
                        </Modal.Title>
                    </Modal.Header>
                    <Modal.Body>
                        <Form onSubmit={handleSubmitPlan}>
                            <Form.Group className="mb-3">
                                <Form.Label>요금제명</Form.Label>
                                <Form.Control
                                    type="text"
                                    name="planName"
                                    value={planForm.planName}
                                    onChange={(e) => setPlanForm({ ...planForm, planName: e.target.value })}
                                    required
                                />
                            </Form.Group>
                            <Form.Group className="mb-3">
                                <Form.Label>가격</Form.Label>
                                <Form.Control
                                    type="number"
                                    name="price"
                                    value={planForm.price}
                                    onChange={(e) => setPlanForm({ ...planForm, price: e.target.value })}
                                    required
                                />
                            </Form.Group>
                            <div className="d-grid gap-2">
                                <Button type="submit" className="submit-btn">
                                    추가하기
                                </Button>
                            </div>
                        </Form>
                    </Modal.Body>
                </Modal>
            </Container>
        </div>
    );
};

export default Admin;
