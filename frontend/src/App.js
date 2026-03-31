import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import './styles/App.css';
import Home from './pages/home';
import ViewGoals from "./pages/ViewGoals";
import Header from './components/Header';
import LoginPage from './pages/LoginPage';
import RegisterPage from './pages/RegisterPage';
import { AuthProvider, useAuth } from './context/AuthContext';

function ProtectedRoute({ children }) {
    const { isAuthenticated, loading } = useAuth();

    if (loading) {
        return null;
    }

    if (!isAuthenticated) {
        return <Navigate to="/login" replace />;
    }

    return children;
}

function App() {
    // npm start to run in frontend folder

    return (
        <>
            <BrowserRouter>
                <AuthProvider>
                    <Header />
                    <Routes>
                        <Route path="/login" element={<LoginPage />} />
                        <Route path="/register" element={<RegisterPage />} />
                        <Route path="/" element={
                            <ProtectedRoute><Home /></ProtectedRoute>
                        } />
                        <Route path="/home" element={
                            <ProtectedRoute><Home /></ProtectedRoute>
                        } />
                        <Route path="/view_goals" element={
                            <ProtectedRoute><ViewGoals /></ProtectedRoute>
                        } />
                    </Routes>
                </AuthProvider>
            </BrowserRouter>
        </>
    )
}

export default App;
