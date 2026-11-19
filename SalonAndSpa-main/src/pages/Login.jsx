import React, { useState, useEffect } from 'react';
import { Container, Row, Col, Form, Button, Alert } from 'react-bootstrap';
import { motion } from 'framer-motion';
import { Link, useSearchParams, useNavigate } from 'react-router-dom';
import api from '../api';

const Login = () => {
    const [searchParams] = useSearchParams();
    const initialRole = searchParams.get('role') || 'customer';

    const [role, setRole] = useState(initialRole);
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState(null);
    const [loading, setLoading] = useState(false);
    const navigate = useNavigate();
    
    // Check if user just registered
    useEffect(() => {
        if (searchParams.get('registered') === 'true') {
            setError(null);
        }
    }, [searchParams]);

    const handleLogin = async (e) => {
        e.preventDefault();
        setError(null);
        setLoading(true);

        try {
            const response = await api.post('/auth/login', { email, password, role });
            
            // Save token and user info
            localStorage.setItem('token', response.data.token);
            localStorage.setItem('user', JSON.stringify(response.data));
            
            // Redirect based on role
            if (response.data.role === 'customer') {
                navigate('/booking');
            } else {
                navigate(`/dashboard/${response.data.role}`);
            }
        } catch (err) {
            setError(err.response?.data?.message || 'Invalid credentials');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="login-page d-flex align-items-center justify-content-center min-vh-100 position-relative" style={{
            backgroundImage: 'url("/hero-bg.png")',
            backgroundSize: 'cover',
            backgroundPosition: 'center',
        }}>
            {/* Blur Overlay */}
            <div className="position-absolute top-0 start-0 w-100 h-100 bg-black" style={{ opacity: 0.5, backdropFilter: 'blur(8px)' }}></div>

            <Container className="position-relative z-index-1">
                <Row className="justify-content-center pt-5">
                    <Col md={6} lg={5}>
                        <motion.div
                            initial={{ opacity: 0, y: 30 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.6 }}
                            className="glass-card-dark p-5"
                        >
                            <div className="text-center mb-4">
                                <h2 className="fw-bold mb-2">Welcome Back</h2>
                                <p className="text-white-50">Log in to your {role} account</p>
                                {searchParams.get('registered') === 'true' && (
                                    <Alert variant="success" className="mt-3">Registration successful! Please login.</Alert>
                                )}
                            </div>

                            <Form onSubmit={handleLogin}>
                                {error && <Alert variant="danger">{error}</Alert>}
                                <Form.Group className="mb-4">
                                    <Form.Label className="text-white small fw-bold">Select Role</Form.Label>
                                    <Form.Select
                                        value={role}
                                        onChange={(e) => setRole(e.target.value)}
                                        className="bg-transparent text-white border-secondary shadow-none custom-select"
                                    >
                                        <option value="customer" className="text-dark">Customer</option>
                                        <option value="stylist" className="text-dark">Stylist/Staff</option>
                                        <option value="admin" className="text-dark">Manager/Admin</option>
                                        <option value="owner" className="text-dark">Owner</option>
                                    </Form.Select>
                                </Form.Group>

                                <Form.Floating className="mb-3">
                                    <Form.Control
                                        id="emailInput"
                                        type="email"
                                        placeholder="name@example.com"
                                        value={email}
                                        onChange={(e) => setEmail(e.target.value)}
                                        className="bg-transparent text-white border-secondary shadow-none"
                                        required
                                    />
                                    <label htmlFor="emailInput" className="text-white-50">Email / UserID</label>
                                </Form.Floating>

                                <Form.Floating className="mb-4">
                                    <Form.Control
                                        id="passwordInput"
                                        type="password"
                                        placeholder="Password"
                                        value={password}
                                        onChange={(e) => setPassword(e.target.value)}
                                        className="bg-transparent text-white border-secondary shadow-none"
                                        required
                                    />
                                    <label htmlFor="passwordInput" className="text-white-50">Password</label>
                                </Form.Floating>

                                <div className="d-flex justify-content-between mb-4">
                                    <Form.Check
                                        type="checkbox"
                                        id="rememberMe"
                                        className="text-white-50"
                                    >
                                        <Form.Check.Input type="checkbox" className="custom-checkbox" />
                                        <Form.Check.Label>Remember me</Form.Check.Label>
                                    </Form.Check>
                                    <a href="#" className="text-warning text-decoration-none small">Forgot password?</a>
                                </div>

                                <motion.div whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}>
                                    <Button type="submit" className="btn-primary-custom w-100 py-3 fw-bold fs-5" disabled={loading}>
                                        {loading ? 'Logging in...' : 'Login Now'}
                                    </Button>
                                </motion.div>

                                <div className="text-center mt-4">
                                    <p className="text-white-50 mb-0">Don't have an account? <Link to="/register" className="text-warning text-decoration-none fw-bold">Register</Link></p>
                                </div>
                            </Form>
                        </motion.div>
                    </Col>
                </Row>
            </Container>
        </div>
    );
};

export default Login;
