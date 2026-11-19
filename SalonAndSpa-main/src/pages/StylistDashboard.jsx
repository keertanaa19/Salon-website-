import React, { useState, useEffect } from 'react';
import { Container, Row, Col, Card, Nav, Button, Table, Badge, Form, Spinner } from 'react-bootstrap';
import { FaUserTie, FaCalendarDay, FaImages, FaSignOutAlt, FaCheckCircle, FaStar, FaTimes } from 'react-icons/fa';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import api from '../api';

const StylistDashboard = () => {
    const [activeTab, setActiveTab] = useState('schedule');
    const [user, setUser] = useState(null);
    const [schedule, setSchedule] = useState([]);
    const [loading, setLoading] = useState(true);
    const navigate = useNavigate();

    const handleLogout = () => {
        localStorage.removeItem('token');
        localStorage.removeItem('user');
        navigate('/login');
    };

    const fetchBookings = async () => {
        try {
            const res = await api.get('/bookings/stylist-bookings');
            const formatted = res.data.map(b => ({
                id: b._id,
                customer: b.customer?.name || 'Walk-in',
                service: b.service?.name || 'Service',
                time: `${b.date} ${b.time}`,
                status: b.status.charAt(0).toUpperCase() + b.status.slice(1)
            }));
            setSchedule(formatted);
        } catch (error) {
            console.error("Failed to fetch schedule", error);
            // Fallback mock
            setSchedule([
                { id: 1, customer: 'Alice Brown', service: 'Women\'s Styling', time: '09:00 AM', status: 'Pending' },
                { id: 2, customer: 'David Smith', service: 'Men\'s Haircut', time: '11:00 AM', status: 'Confirmed' },
            ]);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        const u = JSON.parse(localStorage.getItem('user'));
        if (u) setUser(u);
        fetchBookings();
    }, []);

    const updateBookingStatus = async (id, status) => {
        try {
            await api.put(`/bookings/${id}/status`, { status: status.toLowerCase() });
            fetchBookings(); // refresh
        } catch (error) {
            console.error("Failed to update status", error);
        }
    };

    return (
        <div className="dashboard-page bg-light min-vh-100 pb-5" style={{ paddingTop: '80px' }}>
            <Container className="mt-4">
                <Row>
                    {/* Sidebar */}
                    <Col lg={3} className="mb-4">
                        <Card className="border-0 shadow-sm rounded-4 h-100 bg-white">
                            <Card.Body className="p-4 d-flex flex-column text-center text-lg-start">
                                <div className="text-center mb-4">
                                    <div className="overflow-hidden rounded-circle mx-auto mb-3 shadow-sm border border-3 border-warning" style={{ width: '100px', height: '100px' }}>
                                        <img src={`https://ui-avatars.com/api/?name=${user?.name ? user.name.replace(' ', '+') : 'Stylist'}&background=1a1a1a&color=d4af37&size=200`} alt="Stylist" className="w-100 h-100" style={{ objectFit: 'cover' }} />
                                    </div>
                                    <h5 className="fw-bold mb-1">{user?.name || 'Stylist Name'}</h5>
                                    <div className="d-flex justify-content-center align-items-center text-warning small mb-1">
                                        <FaStar className="me-1" />
                                        <span className="text-dark fw-bold">5.0</span>
                                        <span className="text-muted ms-1">(124 Reviews)</span>
                                    </div>
                                    <p className="text-muted small">Senior Stylist</p>
                                </div>

                                <Nav className="flex-column nav-pills gap-2 mb-auto w-100">
                                    <Nav.Link
                                        className={`d-flex align-items-center py-3 px-3 rounded-3 fw-bold transition-all ${activeTab === 'schedule' ? 'bg-primary text-white shadow-sm' : 'text-dark hover-light'}`}
                                        onClick={() => setActiveTab('schedule')}
                                        style={{ cursor: 'pointer' }}
                                    >
                                        <FaCalendarDay className="me-3" /> My Schedule
                                    </Nav.Link>
                                    <Nav.Link
                                        className={`d-flex align-items-center py-3 px-3 rounded-3 fw-bold transition-all ${activeTab === 'portfolio' ? 'bg-primary text-white shadow-sm' : 'text-dark hover-light'}`}
                                        onClick={() => setActiveTab('portfolio')}
                                        style={{ cursor: 'pointer' }}
                                    >
                                        <FaImages className="me-3" /> Portfolio & Work
                                    </Nav.Link>
                                    <Nav.Link
                                        className={`d-flex align-items-center py-3 px-3 rounded-3 fw-bold transition-all ${activeTab === 'profile' ? 'bg-primary text-white shadow-sm' : 'text-dark hover-light'}`}
                                        onClick={() => setActiveTab('profile')}
                                        style={{ cursor: 'pointer' }}
                                    >
                                        <FaUserTie className="me-3" /> Profile Settings
                                    </Nav.Link>
                                </Nav>

                                <Button variant="outline-danger" className="w-100 fw-bold mt-4 d-flex align-items-center justify-content-center py-2" onClick={handleLogout}>
                                    <FaSignOutAlt className="me-2" /> Logout
                                </Button>
                            </Card.Body>
                        </Card>
                    </Col>

                    {/* Main Content */}
                    <Col lg={9}>
                        <motion.div
                            key={activeTab}
                            initial={{ opacity: 0, scale: 0.98 }}
                            animate={{ opacity: 1, scale: 1 }}
                            transition={{ duration: 0.3 }}
                        >
                            <Card className="border-0 shadow-sm rounded-4 mb-4">
                                <Card.Body className="p-4 p-md-5">
                                    <h3 className="fw-bold mb-4">{activeTab === 'schedule' ? 'Today\'s Appointments' : activeTab === 'portfolio' ? 'My Portfolio' : 'Profile settings'}</h3>

                                    {activeTab === 'schedule' && (
                                        <div className="table-responsive">
                                            {loading ? (
                                                <div className="text-center py-5"><Spinner animation="border" variant="primary" /></div>
                                            ) : (
                                                <Table hover className="align-middle">
                                                    <thead className="table-light">
                                                        <tr>
                                                            <th>Time</th>
                                                            <th>Customer</th>
                                                            <th>Service</th>
                                                            <th>Status</th>
                                                            <th>Action</th>
                                                        </tr>
                                                    </thead>
                                                    <tbody>
                                                        {schedule.map(s => (
                                                            <tr key={s.id}>
                                                                <td className="fw-bold text-primary">{s.time}</td>
                                                                <td className="fw-bold">{s.customer}</td>
                                                                <td>{s.service}</td>
                                                                <td>
                                                                    <Badge
                                                                        bg={s.status === 'Completed' ? 'success' : s.status === 'Confirmed' ? 'primary' : 'warning'}
                                                                        text={s.status === 'Pending' ? 'dark' : 'white'}
                                                                    >
                                                                        {s.status}
                                                                    </Badge>
                                                                </td>
                                                                <td>
                                                                    {s.status !== 'Completed' && (
                                                                        <Button variant="outline-success" size="sm" className="fw-bold d-flex align-items-center" onClick={() => updateBookingStatus(s.id, 'completed')}>
                                                                            <FaCheckCircle className="me-1" /> Mark Done
                                                                        </Button>
                                                                    )}
                                                                </td>
                                                            </tr>
                                                        ))}
                                                        {schedule.length === 0 && (
                                                            <tr><td colSpan="5" className="text-center py-4 text-muted">No appointments scheduled.</td></tr>
                                                        )}
                                                    </tbody>
                                                </Table>
                                            )}
                                        </div>
                                    )}

                                    {activeTab === 'portfolio' && (
                                        <div>
                                            <div className="d-flex justify-content-between align-items-center mb-4">
                                                <p className="text-muted m-0">Showcase your best work to attract more clients.</p>
                                                <Button className="btn-primary-custom">+ Upload Image</Button>
                                            </div>
                                            <Row className="g-3">
                                                {['/mens-haircut.png', '/womens-styling.png', '/beard-trim.png', '/spa-facial.png'].map((img, idx) => (
                                                    <Col md={4} key={idx}>
                                                        <div className="position-relative overflow-hidden rounded-3 shadow-sm ratio ratio-1x1 border">
                                                            <img src={img} alt="Portfolio work" className="w-100 h-100" style={{ objectFit: 'cover' }} />
                                                            <div 
                                                                className="position-absolute d-flex align-items-center justify-content-center text-dark rounded-circle shadow-sm"
                                                                style={{ 
                                                                    top: '8px', 
                                                                    right: '8px', 
                                                                    width: '28px', 
                                                                    height: '28px', 
                                                                    cursor: 'pointer',
                                                                    backgroundColor: 'rgba(255, 255, 255, 0.9)',
                                                                    transition: 'all 0.2s ease',
                                                                    backdropFilter: 'blur(4px)'
                                                                }}
                                                                onMouseEnter={(e) => {
                                                                    e.currentTarget.style.backgroundColor = '#dc3545';
                                                                    e.currentTarget.style.color = 'white';
                                                                }}
                                                                onMouseLeave={(e) => {
                                                                    e.currentTarget.style.backgroundColor = 'rgba(255, 255, 255, 0.9)';
                                                                    e.currentTarget.style.color = '#212529';
                                                                }}
                                                                title="Remove Image"
                                                            >
                                                                <FaTimes size={12} />
                                                            </div>
                                                        </div>
                                                    </Col>
                                                ))}
                                            </Row>
                                        </div>
                                    )}

                                    {activeTab === 'profile' && (
                                        <Form>
                                            <Row className="g-4 mb-3">
                                                <Col md={6}>
                                                    <Form.Group>
                                                        <Form.Label className="small fw-bold text-muted">Full Name</Form.Label>
                                                        <Form.Control type="text" defaultValue={user?.name || "Marcus Johnson"} className="bg-light" />
                                                    </Form.Group>
                                                </Col>
                                                <Col md={6}>
                                                    <Form.Group>
                                                        <Form.Label className="small fw-bold text-muted">Experience (Years)</Form.Label>
                                                        <Form.Control type="number" defaultValue="12" className="bg-light" />
                                                    </Form.Group>
                                                </Col>
                                                <Col md={12}>
                                                    <Form.Group>
                                                        <Form.Label className="small fw-bold text-muted">Specialties (comma separated)</Form.Label>
                                                        <Form.Control type="text" defaultValue="Men's Cuts, Fades, Styling" className="bg-light" />
                                                    </Form.Group>
                                                </Col>
                                                <Col md={12}>
                                                    <Form.Group>
                                                        <Form.Label className="small fw-bold text-muted">Bio</Form.Label>
                                                        <Form.Control as="textarea" rows={3} defaultValue="Expert barber with over a decade of experience in modern and classic men's styling." className="bg-light" />
                                                    </Form.Group>
                                                </Col>
                                            </Row>
                                            <Button className="btn-primary-custom px-5 mt-2">Save Profile</Button>
                                        </Form>
                                    )}
                                </Card.Body>
                            </Card>

                            {activeTab === 'schedule' && (
                                <Row className="g-4">
                                    <Col md={6}>
                                        <Card className="border-0 shadow-sm bg-dark text-white rounded-4 h-100">
                                            <Card.Body className="p-4 d-flex align-items-center justify-content-between">
                                                <div>
                                                    <p className="mb-1 fw-semibold opacity-75">Today's Earnings</p>
                                                    <h2 className="display-5 fw-bold mb-0 text-warning">₹150</h2>
                                                </div>
                                            </Card.Body>
                                        </Card>
                                    </Col>
                                    <Col md={6}>
                                        <Card className="border-0 shadow-sm bg-primary text-white rounded-4 h-100">
                                            <Card.Body className="p-4 d-flex align-items-center justify-content-between">
                                                <div>
                                                    <p className="mb-1 fw-semibold opacity-75">Pending Appointments</p>
                                                    <h2 className="display-5 fw-bold mb-0">1</h2>
                                                </div>
                                            </Card.Body>
                                        </Card>
                                    </Col>
                                </Row>
                            )}
                        </motion.div>
                    </Col>
                </Row>
            </Container>
        </div>
    );
};

export default StylistDashboard;
