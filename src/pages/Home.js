import React from "react";
import { Container } from "react-bootstrap";

const Home = () => {
    return (
        <Container className="mt-4">
            <div className="text-center">
                <h1 className="mb-4">OTT 구독 서비스</h1>
                <p className="lead">다양한 OTT 서비스를 한 곳에서 편리하게 관리하세요.</p>
                <hr className="my-4" />
                <p>Netflix, Disney+, Watcha 등 다양한 OTT 서비스를 구독하고 관리할 수 있습니다.</p>
            </div>
        </Container>
    );
};

export default Home;
