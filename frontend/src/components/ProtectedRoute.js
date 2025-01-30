// components/ProtectedRoute.js
import React, { useState, useEffect } from 'react';
import { Navigate } from 'react-router-dom';
import Modal from './Modal';

const ProtectedRoute = ({ userRole, requiredRole, children }) => {
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [redirect, setRedirect] = useState(false);

    useEffect(() => {
        if (userRole !== requiredRole) {
            setIsModalOpen(true);
            const timer = setTimeout(() => {
                setIsModalOpen(false);
                setRedirect(true);
            }, 3000); // Display the modal for 3 seconds
            return () => clearTimeout(timer);
        }
    }, [userRole, requiredRole]);

    if (redirect) {
        return <Navigate to="/search-course" />;
    }

    if (isModalOpen) {
        return (
            <Modal
                isOpen={isModalOpen}
                onClose={() => {
                    setIsModalOpen(false);
                    setRedirect(true);
                }}
                title="Acesso negado"
                message="Você não tem critérios de Administrador para acessar essa página."
            />
        );
    }

    return children;
};

export default ProtectedRoute;
