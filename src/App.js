import React from "react";
import { BrowserRouter as Router } from "react-router-dom";
import AppRoutes from "./AppRoutes"; // 새로운 컴포넌트
import "bootstrap/dist/css/bootstrap.min.css";
import axios from "axios";
axios.defaults.headers.post["Content-Type"] = "application/json;charset=UTF-8";
axios.defaults.headers.put["Content-Type"] = "application/json;charset=UTF-8";
function App() {
    return (
        <Router>
            <AppRoutes />
        </Router>
    );
}

export default App;
