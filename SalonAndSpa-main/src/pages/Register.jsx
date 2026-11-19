import React, { useState, useEffect } from 'react';
import { Container, Row, Col, Form, Button, Alert } from 'react-bootstrap';
import { motion, AnimatePresence } from 'framer-motion';
import { Link, useNavigate, useSearchParams } from 'react-router-dom';
import api from '../api';

const Register = () => {
    const [role, setRole] = useState('customer');
    const [formData, setFormData] = useState({
        name: '', email: '', password: '', branchName: '', branchLocation: ''
    });
    const [error, setError] = useState(null);
    const [loading, setLoading] = useState(false);
    const navigate = useNavigate();
    const [searchParams] = useSearchParams();
    const inviteToken = searchParams.get('inviteToken');
    const [isInvitedAdmin, setIsInvitedAdmin] = useState(false);

    useEffect(() => {
        if (inviteToken) {
            setRole('admin');
            setIsInvitedAdmin(true);
            setLoading(true);
            api.get(`/invitations/verify/${inviteToken}`)
                .then(res => {
                    setFormData(prev => ({
                        ...prev,
                        adminEmail: res.data.email,
                        branchName: res.data.branchName,
                        branchLocation: res.data.branchName // Server only returns name right now, but fine
                    }));
                    setLoading(false);
                })
                .catch(err => {
                    setError('Invalid or expired invitation link.');
                    setLoading(false);
                    setIsInvitedAdmin(false);
                });
        }
    }, [inviteToken]);

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.id]: e.target.value });
    };

    const handleRegister = async (e) => {
        e.preventDefault();
        setError(null);
        setLoading(true);

        try {
            if (isInvitedAdmin && role === 'admin') {
                const response = await api.post('/invitations/accept', {
                    token: inviteToken,
                    name: formData.adminName,
                    password: formData.adminPassword
                });
                if (response.data) {
                    navigate(`/login?role=admin&registered=true`);
                }
                return;
            }

            const payload = {
                name: role === 'customer' ? formData.userName : formData.adminName,
                email: role === 'customer' ? formData.userEmail : formData.adminEmail,
                password: role === 'customer' ? formData.userPassword : formData.adminPassword,
                role: role,
                ...(role !== 'customer' && {
                    branchName: formData.branchName,
                    branchLocation: formData.branchLocation
                })
            };

            const response = await api.post('/auth/register', payload);
            
            // Optionally auto-login or redirect
            if (response.data) {
                navigate(`/login?role=${role}&registered=true`);
            }
        } catch (err) {
            setError(err.response?.data?.message || 'Failed to register. Please try again.');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="register-page d-flex align-items-center justify-content-center min-vh-100 position-relative" style={{
            backgroundImage: 'url("/hero-bg.png")',
            backgroundSize: 'cover',
            backgroundPosition: 'center',
        }}>
            {/* Blur Overlay */}
            <div className="position-absolute top-0 start-0 w-100 h-100 bg-black" style={{ opacity: 0.6, backdropFilter: 'blur(5px)' }}></div>

            <Container className="position-relative z-index-1 py-5">
                <Row className="justify-content-center pt-5">
                    <Col md={8} lg={6}>
                        <motion.div
                            initial={{ opacity: 0, scale: 0.95 }}
                            animate={{ opacity: 1, scale: 1 }}
                            transition={{ duration: 0.5 }}
                            className="glass-card p-4 p-md-5"
                        >
                            <div className="text-center mb-4">
                                <h2 className="fw-bold mb-2 text-dark">Join SalonStudio</h2>
                                <p className="text-muted">Create an account to start booking or managing your salon.</p>
                            </div>

                            {/* Role Selection Tabs */}
                            <div className="d-flex mb-4 bg-light rounded-pill p-1 shadow-sm">
                                <Button
                                    variant={role === 'customer' ? 'dark' : 'transparent'}
                                    className={`flex-fill rounded-pill border-0 ${role !== 'customer' && 'text-muted'}`}
                                    onClick={() => setRole('customer')}
                                    disabled={isInvitedAdmin}
                                >
                                    Customer
                                </Button>
                                <Button
                                    variant={role === 'admin' ? 'dark' : 'transparent'}
                                    className={`flex-fill rounded-pill border-0 ${role !== 'admin' && 'text-muted'}`}
                                    onClick={() => setRole('admin')}
                                    disabled={isInvitedAdmin}
                                >
                                    {isInvitedAdmin ? 'Invited Admin Setup' : 'Admin / Manager'}
                                </Button>
                            </div>

                            <Form onSubmit={handleRegister}>
                                {error && <Alert variant="danger">{error}</Alert>}
                                <AnimatePresence mode="wait">
                                    {role === 'customer' ? (
                                        <motion.div
                                            key="customer-form"
                                            initial={{ opacity: 0, x: -20 }}
                                            animate={{ opacity: 1, x: 0 }}
                                            exit={{ opacity: 0, x: 20 }}
                                            transition={{ duration: 0.3 }}
                                        >
                                            <Form.Floating className="mb-3 text-dark">
                                                <Form.Control id="userName" type="text" placeholder="John Doe" required className="border-secondary" value={formData.userName || ''} onChange={handleChange} />
                                                <label htmlFor="userName">Full Name</label>
                                            </Form.Floating>
                                            <Form.Floating className="mb-3 text-dark">
                                                <Form.Control id="userEmail" type="email" placeholder="name@example.com" required className="border-secondary" value={formData.userEmail || ''} onChange={handleChange} />
                                                <label htmlFor="userEmail">Email Address</label>
                                            </Form.Floating>
                                            <Form.Floating className="mb-4 text-dark">
                                                <Form.Control id="userPassword" type="password" placeholder="Password" required className="border-secondary" value={formData.userPassword || ''} onChange={handleChange} />
                                                <label htmlFor="userPassword">Password</label>
                                            </Form.Floating>
                                        </motion.div>
                                    ) : (
                                        <motion.div
                                            key="admin-form"
                                            initial={{ opacity: 0, x: 20 }}
                                            animate={{ opacity: 1, x: 0 }}
                                            exit={{ opacity: 0, x: -20 }}
                                            transition={{ duration: 0.3 }}
                                        >
                                            <Row className="g-3 mb-3">
                                                <Col md={6}>
                                                    <Form.Floating className="text-dark">
                                                        <Form.Control id="branchName" type="text" placeholder="Branch Name" required className="border-secondary" value={formData.branchName || ''} onChange={handleChange} disabled={isInvitedAdmin} />
                                                        <label htmlFor="branchName">Branch Name</label>
                                                    </Form.Floating>
                                                </Col>
                                                <Col md={6}>
                                                    <Form.Floating className="text-dark">
                                                        <Form.Control id="branchLocation" type="text" placeholder="City" required className="border-secondary" value={formData.branchLocation || ''} onChange={handleChange} disabled={isInvitedAdmin} />
                                                        <label htmlFor="branchLocation">Location</label>
                                                    </Form.Floating>
                                                </Col>
                                            </Row>
                                            <Form.Floating className="mb-3 text-dark">
                                                <Form.Control id="adminName" type="text" placeholder="Full Name" required className="border-secondary" value={formData.adminName || ''} onChange={handleChange} />
                                                <label htmlFor="adminName">Manager Name</label>
                                            </Form.Floating>
                                            <Form.Floating className="mb-3 text-dark">
                                                <Form.Control id="adminEmail" type="email" placeholder="name@example.com" required className="border-secondary" value={formData.adminEmail || ''} onChange={handleChange} disabled={isInvitedAdmin} />
                                                <label htmlFor="adminEmail">Manager Email</label>
                                            </Form.Floating>
                                            <Form.Floating className="mb-4 text-dark">
                                                <Form.Control id="adminPassword" type="password" placeholder="Password" required className="border-secondary" value={formData.adminPassword || ''} onChange={handleChange} />
                                                <label htmlFor="adminPassword">Create Password</label>
                                            </Form.Floating>
                                        </motion.div>
                                    )}
                                </AnimatePresence>

                                <motion.div whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}>
                                    <Button type="submit" className="btn-primary-custom w-100 py-3 fw-bold fs-5" disabled={loading}>
                                        {loading ? 'Creating Account...' : 'Register Account'}
                                    </Button>
                                </motion.div>

                                <div className="text-center mt-4">
                                    <p className="text-muted mb-0">Already have an account? <Link to="/login" className="text-primary text-decoration-none fw-bold">Login</Link></p>
                                </div>
                            </Form>
                        </motion.div>
                    </Col>
                </Row>
            </Container>
        </div>
    );
};

export default Register;
