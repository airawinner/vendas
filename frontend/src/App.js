// App.js
import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Route, Routes, Navigate } from 'react-router-dom';
import Login from './components/Login';
import SearchCourse from './components/SearchCourse';
import AddCourse from './components/AddCourse';
import RemoveCourse from './components/RemoveCourse';
import ViewPurchaseDetails from './components/ViewPurchaseDetails';
import SignUp from './components/SignUp';
import ProtectedRoute from './components/ProtectedRoute';

function App() {
    const [userRole, setUserRole] = useState(localStorage.getItem('userRole') || null);
    const [userData, setUserData] = useState(JSON.parse(localStorage.getItem('userData')) || null);

    useEffect(() => {
        if (userRole) {
            localStorage.setItem('userRole', userRole);
            localStorage.setItem('userData', JSON.stringify(userData));
        }
    }, [userRole, userData]);

    const handleLogout = () => {
        setUserRole(null);
        setUserData(null);
        localStorage.removeItem('userRole');
        localStorage.removeItem('userData');
    };

    return (
        <Router>
            <Routes>
                <Route path="/" element={<Login setUserRole={setUserRole} setUserData={setUserData} />} />
                <Route path="/cadastro" element={<SignUp setUserRole={setUserRole} setUserData={setUserData} />} />
            

                {userRole ? (
                    <>
                        <Route path="/search-course" element={<SearchCourse />} />
                        <Route path="/view-purchase-details" element={<ViewPurchaseDetails />} />
                        <Route
                            path="/add-course"
                            element={
                                <ProtectedRoute userRole={userRole} requiredRole="admin">
                                    <AddCourse userData={userData} />
                                </ProtectedRoute>
                            }
                        />
                        <Route
                            path="/remove-course"
                            element={
                                <ProtectedRoute userRole={userRole} requiredRole="admin">
                                    <RemoveCourse userData={userData} />
                                </ProtectedRoute>
                            }
                        />
                        <Route path="/login" element={<Navigate to="/search-course" />} />
                    </>
                ) : (
                    <Route path="*" element={<Navigate to="/" />} />
                )}
            </Routes>
        </Router>
    );
}

export default App;
