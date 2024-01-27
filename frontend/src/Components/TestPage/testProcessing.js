import React, { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import axios from "axios";
import { Spinner } from "react-bootstrap";
import { motion } from "framer-motion";

const TestProcessing = () => {
    const navigate = useNavigate();
    const { testId, candidateId } = useParams();
    const [isLoading, setIsLoading] = useState(true);
    const [dots, setDots] = useState("");



    useEffect(() => {
        const interval = setInterval(() => {
            setDots((prevDots) => (prevDots.length >= 3 ? "" : prevDots + "."));
        }, 500);
        // Simulate a 2-second delay
        setTimeout(() => {
            clearInterval(interval);
        }, 2000);

        return () => {
            clearInterval(interval);
        };
    }, []);

    useEffect(() => {
        const verifyCandidate = async () => {
            try {
                localStorage.setItem('test_id', testId);
                localStorage.setItem('candidate_id', candidateId);
                const response = await axios.post(
                    `http://localhost:5000/api/verifyCandidate`,
                    { testId, candidateId }
                );
                const token = response.data.token;
                localStorage.setItem("token", token);
                navigate("/instructions");
            } catch (error) {
                console.log("Error verifying candidate:", error);
                setIsLoading(false);
                navigate("/invalid-link");
            }
        };

        verifyCandidate();
    }, [testId, candidateId, navigate]);

    return (
        <div className="d-flex align-items-center justify-content-center vh-100">
            {isLoading ? (
                <h2>Processing the test link{dots}</h2>
            ) : null}
        </div>
    );
};

export default TestProcessing;
