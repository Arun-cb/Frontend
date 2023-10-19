import React, { useEffect, useState } from "react";
import { Toast, ToastContainer } from "react-bootstrap";

export default function FnToastMessageComp({ message, duration,Header }) {
    const [showToast, setShowToast] = useState([])

    setTimeout(() => {
        setShowToast(false)
    }, duration)

    return (
        <ToastContainer
            className="position-static"
        >
            <Toast
                onClose={() => setShowToast(false)}
                show={showToast}
                delay={duration}
                autohide
                style={{ position: 'fixed', right: '7px', bottom: '7px' }}
            >
                <Toast.Header closeButton={false}>
                    <strong>{Header}</strong>
                </Toast.Header>
                <Toast.Body>
                    {message}
                </Toast.Body>
            </Toast>
        </ToastContainer>
    )
}