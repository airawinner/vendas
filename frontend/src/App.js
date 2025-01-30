import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Route, Routes, Navigate } from 'react-router-dom';
import Login from './components/Login';
import ForgotPassword from './components/ForgotPassword';
import SearchCourse from './components/SearchCourse';
import AddCourse from './components/AddCourse';
import RemoveCourse from './components/RemoveCourse';
import ViewPurchaseDetails from './components/ViewPurchaseDetails';
import SignUp from './components/SignUp';

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
                {/* Sempre carregará primeiro a página de login */}
                <Route path="/" element={<Login setUserRole={setUserRole} setUserData={setUserData} />} />
                <Route path="/cadastro" element={<SignUp setUserRole={setUserRole} setUserData={setUserData}/>} />
                <Route path="/esqueceu-senha" element={<ForgotPassword />} />

                {/* Se logado, acessa as páginas protegidas */}
                {userRole ? (
                    <>
                        <Route path="/search-course" element={<SearchCourse />} />
                        <Route path="/view-purchase-details" element={<ViewPurchaseDetails />} />
                        {userRole === 'admin' && (
                            <>
                                <Route path="/add-course" element={<AddCourse userData={userData} />} />
                                <Route path="/remove-course" element={<RemoveCourse userData={userData} />} />
                            </>
                        )}
                        {/* Se tentar acessar /login já logado, redireciona para a busca de cursos */}
                        <Route path="/login" element={<Navigate to="/search-course" />} />
                    </>
                ) : (
                    <>
                        {/* Se tentar acessar qualquer outra rota sem login, redireciona para o login */}
                        <Route path="*" element={<Navigate to="/" />} />
                    </>
                )}
            </Routes>
        </Router>
    );
}

export default App;
