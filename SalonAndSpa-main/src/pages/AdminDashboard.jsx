import React, { useState } from 'react';
import { Container, Row, Col, Card, Nav, Button, Table, Badge, Modal, Form } from 'react-bootstrap';
import { FaChartLine, FaCut, FaUsers, FaCalendarCheck, FaSignOutAlt, FaCog, FaCheckCircle } from 'react-icons/fa';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import {
    Chart as ChartJS,
    CategoryScale,
    LinearScale,
    PointElement,
    LineElement,
    BarElement,
    Title,
    Tooltip,
    Legend,
} from 'chart.js';
import { Line, Bar } from 'react-chartjs-2';

ChartJS.register(
    CategoryScale,
    LinearScale,
    PointElement,
    LineElement,
    BarElement,
    Title,
    Tooltip,
    Legend
);

const AdminDashboard = () => {
    const [activeTab, setActiveTab] = useState('dashboard');
    const navigate = useNavigate();

    const handleLogout = () => {
        navigate('/login');
    };

    // Mock Chart Data
    const lineChartData = {
        labels: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul'],
        datasets: [
            {
                label: 'Revenue (₹)',
                data: [4200, 5100, 4800, 6200, 5800, 8100, 7500],
                borderColor: '#9b51e0',
                backgroundColor: 'rgba(155, 81, 224, 0.1)',
                borderWidth: 3,
                tension: 0.4,
                fill: true,
            },
        ],
    };

    const handleDownloadReport = () => {
        let csvContent = "data:text/csv;charset=utf-8,";
        csvContent += "SALONSTUDIO BRANCH OVERVIEW REPORT\n\n";
        csvContent += "Category,Value\n";
        csvContent += "Total Revenue,41700\n";
        csvContent += "Total Appointments,452\n";
        csvContent += "Active Stylists,12\n";
        csvContent += "Average Rating,4.8\n\n";

        csvContent += "MONTHLY REVENUE TREND\n";
        csvContent += "Month,Revenue\n";
        csvContent += "Jan,4200\n";
        csvContent += "Feb,5100\n";
        csvContent += "Mar,4800\n";
        csvContent += "Apr,6200\n";
        csvContent += "May,5800\n";
        csvContent += "Jun,8100\n";
        csvContent += "Jul,7500\n";

        const encodedUri = encodeURI(csvContent);
        const link = document.createElement("a");
        link.setAttribute("href", encodedUri);
        link.setAttribute("download", "Branch_Overview_Report.csv");
        document.body.appendChild(link); // Required for FF
        link.click();
        document.body.removeChild(link);
    };

    const lineChartOptions = {
        responsive: true,
        plugins: {
            legend: { position: 'top' },
            title: { display: false, text: 'Monthly Revenue' },
        },
        scales: {
            y: { beginAtZero: true },
        },
    };

    const [services, setServices] = useState([
        { id: 1, name: 'Men\'s Haircut', price: '₹500', duration: '45m', status: 'Active' },
        { id: 2, name: 'Women\'s Styling', price: '₹1000', duration: '1h 30m', status: 'Active' },
        { id: 3, name: 'Beard Trimming', price: '₹300', duration: '30m', status: 'Active' },
    ]);

    const [stylistsList, setStylistsList] = useState([
        { id: 1, name: 'Elena Rodriguez', email: 'elena@salonstudio.com', phone: '+1 234-567-8901', role: 'Senior Stylist', status: 'Active' },
        { id: 2, name: 'Marcus Johnson', email: 'marcus@salonstudio.com', phone: '+1 234-567-8902', role: 'Barber', status: 'Active' },
        { id: 3, name: 'Sophia Chen', email: 'sophia@salonstudio.com', phone: '+1 234-567-8903', role: 'Colorist', status: 'Active' },
    ]);

    // Modal States
    const [showServiceModal, setShowServiceModal] = useState(false);
    const [newService, setNewService] = useState({ name: '', price: '', duration: '' });

    const [showStylistModal, setShowStylistModal] = useState(false);
    const [newStylist, setNewStylist] = useState({ name: '', email: '', phone: '', role: '' });
    const [invitationLink, setInvitationLink] = useState(null);

    // Handlers
    const handleAddService = (e) => {
        e.preventDefault();
        const id = services.length ? Math.max(...services.map(s => s.id)) + 1 : 1;
        setServices([...services, { id, ...newService, price: `₹${newService.price}`, status: 'Active' }]);
        setNewService({ name: '', price: '', duration: '' });
        setShowServiceModal(false);
    };

    const handleAddStylist = (e) => {
        e.preventDefault();
        const id = stylistsList.length ? Math.max(...stylistsList.map(s => s.id)) + 1 : 1;
        setStylistsList([...stylistsList, { id, ...newStylist, status: 'Active' }]);

        // Generate mock invitation link instead of closing immediately
        const token = Math.random().toString(36).substring(2, 10);
        setInvitationLink(`${window.location.origin}/register?role=stylist&token=${token}&email=${encodeURIComponent(newStylist.email)}`);
    };

    const handleCloseStylistModal = () => {
        setShowStylistModal(false);
        setTimeout(() => {
            setNewStylist({ name: '', email: '', phone: '', role: '' });
            setInvitationLink(null);
        }, 300);
    };

    const bookingsList = [
        { id: 101, client: 'Sarah T.', service: 'Women\'s Styling', stylist: 'Elena', date: 'Oct 25, 2023', time: '10:00 AM', status: 'Completed', amount: '₹85' },
        { id: 102, client: 'David M.', service: 'Men\'s Haircut', stylist: 'Marcus', date: 'Oct 25, 2023', time: '11:30 AM', status: 'Completed', amount: '₹35' },
        { id: 103, client: 'Jessica K.', service: 'Spa & Facial', stylist: 'Sophia', date: 'Oct 26, 2023', time: '02:00 PM', status: 'Upcoming', amount: '₹120' },
        { id: 104, client: 'Michael B.', service: 'Beard Trimming', stylist: 'Marcus', date: 'Oct 26, 2023', time: '04:15 PM', status: 'Upcoming', amount: '₹25' },
    ];

    return (
        <div className="dashboard-page bg-light min-vh-100 pb-5" style={{ paddingTop: '80px' }}>
            <Container fluid className="px-4 mt-4">
                <Row>
                    {/* Sidebar */}
                    <Col lg={2} className="mb-4">
                        <Card className="border-0 shadow-sm rounded-4 h-100 bg-black text-white">
                            <Card.Body className="p-4 d-flex flex-column">
                                <div className="text-center mb-5 mt-2">
                                    <div className="bg-primary text-white rounded-circle d-flex align-items-center justify-content-center mx-auto mb-3" style={{ width: '60px', height: '60px', fontSize: '1.5rem' }}>
                                        <FaCog />
                                    </div>
                                    <h5 className="fw-bold mb-1">Admin Panel</h5>
                                    <p className="text-white-50 small">Manager Access</p>
                                </div>

                                <Nav className="flex-column nav-pills gap-2 mb-auto w-100 custom-admin-nav">
                                    <Nav.Link
                                        className={`d-flex align-items-center py-2 px-3 rounded-2 fw-bold transition-all ${activeTab === 'dashboard' ? 'bg-primary text-white' : 'text-white-50'}`}
                                        onClick={() => setActiveTab('dashboard')}
                                        style={{ cursor: 'pointer' }}
                                    >
                                        <FaChartLine className="me-3" /> Dashboard
                                    </Nav.Link>
                                    <Nav.Link
                                        className={`d-flex align-items-center py-2 px-3 rounded-2 fw-bold transition-all ${activeTab === 'services' ? 'bg-primary text-white' : 'text-white-50'}`}
                                        onClick={() => setActiveTab('services')}
                                        style={{ cursor: 'pointer' }}
                                    >
                                        <FaCut className="me-3" /> Services
                                    </Nav.Link>
                                    <Nav.Link
                                        className={`d-flex align-items-center py-2 px-3 rounded-2 fw-bold transition-all ${activeTab === 'stylists' ? 'bg-primary text-white' : 'text-white-50'}`}
                                        onClick={() => setActiveTab('stylists')}
                                        style={{ cursor: 'pointer' }}
                                    >
                                        <FaUsers className="me-3" /> Stylists
                                    </Nav.Link>
                                    <Nav.Link
                                        className={`d-flex align-items-center py-2 px-3 rounded-2 fw-bold transition-all ${activeTab === 'bookings' ? 'bg-primary text-white' : 'text-white-50'}`}
                                        onClick={() => setActiveTab('bookings')}
                                        style={{ cursor: 'pointer' }}
                                    >
                                        <FaCalendarCheck className="me-3" /> Bookings
                                    </Nav.Link>
                                </Nav>

                                <Button variant="outline-light" className="w-100 fw-bold mt-5 py-2 d-flex align-items-center justify-content-center border-secondary" onClick={handleLogout}>
                                    <FaSignOutAlt className="me-2" /> Logout
                                </Button>
                            </Card.Body>
                        </Card>
                    </Col>

                    {/* Main Content */}
                    <Col lg={10}>
                        <motion.div
                            key={activeTab}
                            initial={{ opacity: 0, x: 20 }}
                            animate={{ opacity: 1, x: 0 }}
                            transition={{ duration: 0.4 }}
                        >
                            {activeTab === 'dashboard' && (
                                <>
                                    <div className="d-flex justify-content-between align-items-center mb-4">
                                        <h3 className="fw-bold">Overview</h3>
                                        <div>
                                            <Button variant="outline-secondary" className="bg-white me-2 shadow-sm fw-bold border-secondary" onClick={handleDownloadReport}>
                                                <i className="fa fa-download me-2"></i>Download Report
                                            </Button>
                                            <Button className="btn-primary-custom">Manage Branch</Button>
                                        </div>
                                    </div>

                                    <Row className="g-4 mb-4">
                                        <Col md={3}>
                                            <Card className="border-0 shadow-sm rounded-4 h-100 p-2">
                                                <Card.Body>
                                                    <p className="text-muted fw-bold mb-1 small text-uppercase">Total Revenue</p>
                                                    <h2 className="fw-bold m-0 text-dark">₹41,700</h2>
                                                    <div className="text-success small fw-bold mt-2">↑ 12% from last month</div>
                                                </Card.Body>
                                            </Card>
                                        </Col>
                                        <Col md={3}>
                                            <Card className="border-0 shadow-sm rounded-4 h-100 p-2">
                                                <Card.Body>
                                                    <p className="text-muted fw-bold mb-1 small text-uppercase">Appointments</p>
                                                    <h2 className="fw-bold m-0 text-dark">452</h2>
                                                    <div className="text-success small fw-bold mt-2">↑ 5% from last month</div>
                                                </Card.Body>
                                            </Card>
                                        </Col>
                                        <Col md={3}>
                                            <Card className="border-0 shadow-sm rounded-4 h-100 p-2">
                                                <Card.Body>
                                                    <p className="text-muted fw-bold mb-1 small text-uppercase">Active Stylists</p>
                                                    <h2 className="fw-bold m-0 text-dark">12</h2>
                                                    <div className="text-secondary small fw-bold mt-2">No change</div>
                                                </Card.Body>
                                            </Card>
                                        </Col>
                                        <Col md={3}>
                                            <Card className="border-0 shadow-sm rounded-4 h-100 p-2">
                                                <Card.Body>
                                                    <p className="text-muted fw-bold mb-1 small text-uppercase">Avg Rating</p>
                                                    <h2 className="fw-bold m-0 text-warning">4.8 <span className="fs-6 text-muted">/ 5</span></h2>
                                                    <div className="text-success small fw-bold mt-2">↑ 0.1 from last month</div>
                                                </Card.Body>
                                            </Card>
                                        </Col>
                                    </Row>

                                    <Card className="border-0 shadow-sm rounded-4 mb-4">
                                        <Card.Body className="p-4">
                                            <h5 className="fw-bold border-bottom pb-3 mb-4">Revenue Trend (Current Year)</h5>
                                            <div style={{ height: '350px' }}>
                                                <Line options={lineChartOptions} data={lineChartData} />
                                            </div>
                                        </Card.Body>
                                    </Card>
                                </>
                            )}

                            {activeTab === 'services' && (
                                <Card className="border-0 shadow-sm rounded-4 p-4">
                                    <div className="d-flex justify-content-between align-items-center mb-4">
                                        <h4 className="fw-bold m-0">Manage Services</h4>
                                        <Button className="btn-primary-custom" onClick={() => setShowServiceModal(true)}>+ Add Service</Button>
                                    </div>
                                    <Table hover className="align-middle">
                                        <thead className="table-light">
                                            <tr>
                                                <th>ID</th>
                                                <th>Name</th>
                                                <th>Price</th>
                                                <th>Duration</th>
                                                <th>Status</th>
                                                <th>Action</th>
                                            </tr>
                                        </thead>
                                        <tbody>
                                            {services.map(s => (
                                                <tr key={s.id}>
                                                    <td className="text-muted">#{s.id}</td>
                                                    <td className="fw-bold">{s.name}</td>
                                                    <td className="text-primary fw-bold">{s.price}</td>
                                                    <td>{s.duration}</td>
                                                    <td><Badge bg="success">{s.status}</Badge></td>
                                                    <td>
                                                        <Button variant="light" size="sm" className="border shadow-sm me-2">Edit</Button>
                                                        <Button variant="outline-danger" size="sm">Delete</Button>
                                                    </td>
                                                </tr>
                                            ))}
                                        </tbody>
                                    </Table>
                                </Card>
                            )}

                            {activeTab === 'stylists' && (
                                <Card className="border-0 shadow-sm rounded-4 p-4">
                                    <div className="d-flex justify-content-between align-items-center mb-4">
                                        <h4 className="fw-bold m-0">Manage Stylists</h4>
                                        <Button className="btn-primary-custom" onClick={() => setShowStylistModal(true)}>+ Add Stylist</Button>
                                    </div>
                                    <Table hover className="align-middle">
                                        <thead className="table-light">
                                            <tr>
                                                <th>ID</th>
                                                <th>Name</th>
                                                <th>Contact</th>
                                                <th>Role</th>
                                                <th>Status</th>
                                                <th>Action</th>
                                            </tr>
                                        </thead>
                                        <tbody>
                                            {stylistsList.map(s => (
                                                <tr key={s.id}>
                                                    <td className="text-muted">#{s.id}</td>
                                                    <td className="fw-bold">{s.name}</td>
                                                    <td>
                                                        <div className="small">{s.email}</div>
                                                        <div className="small text-muted">{s.phone}</div>
                                                    </td>
                                                    <td>{s.role}</td>
                                                    <td><Badge bg={s.status === 'Active' ? 'success' : 'secondary'}>{s.status}</Badge></td>
                                                    <td>
                                                        <Button variant="light" size="sm" className="border shadow-sm me-2">Edit</Button>
                                                        <Button variant="outline-danger" size="sm">Remove</Button>
                                                    </td>
                                                </tr>
                                            ))}
                                        </tbody>
                                    </Table>
                                </Card>
                            )}

                            {activeTab === 'bookings' && (
                                <Card className="border-0 shadow-sm rounded-4 p-4">
                                    <div className="d-flex justify-content-between align-items-center mb-4">
                                        <h4 className="fw-bold m-0">All Bookings</h4>
                                        <div className="d-flex gap-2">
                                            <input type="date" className="form-control" />
                                            <Button variant="outline-secondary">Filter</Button>
                                        </div>
                                    </div>
                                    <Table hover className="align-middle">
                                        <thead className="table-light">
                                            <tr>
                                                <th>ID</th>
                                                <th>Client</th>
                                                <th>Service & Stylist</th>
                                                <th>Date & Time</th>
                                                <th>Amount</th>
                                                <th>Status</th>
                                                <th>Action</th>
                                            </tr>
                                        </thead>
                                        <tbody>
                                            {bookingsList.map(b => (
                                                <tr key={b.id}>
                                                    <td className="text-muted">#{b.id}</td>
                                                    <td className="fw-bold">{b.client}</td>
                                                    <td>
                                                        <div>{b.service}</div>
                                                        <div className="small text-muted">with {b.stylist}</div>
                                                    </td>
                                                    <td>
                                                        <div>{b.date}</div>
                                                        <div className="small text-primary fw-bold">{b.time}</div>
                                                    </td>
                                                    <td className="fw-bold">{b.amount}</td>
                                                    <td>
                                                        <Badge bg={b.status === 'Completed' ? 'success' : 'warning'} className="text-dark">{b.status}</Badge>
                                                    </td>
                                                    <td>
                                                        <Button variant="light" size="sm" className="border shadow-sm">View</Button>
                                                    </td>
                                                </tr>
                                            ))}
                                        </tbody>
                                    </Table>
                                </Card>
                            )}

                        </motion.div>
                    </Col>
                </Row>
            </Container>

            {/* Add Service Modal */}
            <Modal show={showServiceModal} onHide={() => setShowServiceModal(false)} centered>
                <Modal.Header closeButton>
                    <Modal.Title className="fw-bold">Add New Service</Modal.Title>
                </Modal.Header>
                <Form onSubmit={handleAddService}>
                    <Modal.Body>
                        <Form.Group className="mb-3">
                            <Form.Label>Service Name</Form.Label>
                            <Form.Control type="text" required value={newService.name} onChange={(e) => setNewService({ ...newService, name: e.target.value })} />
                        </Form.Group>
                        <Row>
                            <Col md={6}>
                                <Form.Group className="mb-3">
                                    <Form.Label>Price (₹)</Form.Label>
                                    <Form.Control type="number" required value={newService.price} onChange={(e) => setNewService({ ...newService, price: e.target.value })} />
                                </Form.Group>
                            </Col>
                            <Col md={6}>
                                <Form.Group className="mb-3">
                                    <Form.Label>Duration (e.g. 45m)</Form.Label>
                                    <Form.Control type="text" required value={newService.duration} onChange={(e) => setNewService({ ...newService, duration: e.target.value })} />
                                </Form.Group>
                            </Col>
                        </Row>
                    </Modal.Body>
                    <Modal.Footer>
                        <Button variant="outline-secondary" onClick={() => setShowServiceModal(false)}>Cancel</Button>
                        <Button type="submit" className="btn-primary-custom">Save Service</Button>
                    </Modal.Footer>
                </Form>
            </Modal>

            {/* Add Stylist Modal */}
            <Modal show={showStylistModal} onHide={handleCloseStylistModal} centered>
                <Modal.Header closeButton>
                    <Modal.Title className="fw-bold">{invitationLink ? 'Invitation Sent!' : 'Add New Stylist'}</Modal.Title>
                </Modal.Header>
                {invitationLink ? (
                    <Modal.Body className="text-center py-5">
                        <div className="mb-4">
                            <FaCheckCircle className="text-success" style={{ fontSize: '64px' }} />
                        </div>
                        <h4 className="fw-bold mb-3">Invitation Sent Successfully!</h4>
                        <p className="text-muted mb-4">An invitation has been sent to <strong>{newStylist.email}</strong> to join the portal.</p>

                        <Button className="btn-primary-custom px-5" onClick={handleCloseStylistModal}>
                            Done
                        </Button>
                    </Modal.Body>
                ) : (
                    <Form onSubmit={handleAddStylist}>
                        <Modal.Body>
                            <Form.Group className="mb-3">
                                <Form.Label>Full Name</Form.Label>
                                <Form.Control type="text" required value={newStylist.name} onChange={(e) => setNewStylist({ ...newStylist, name: e.target.value })} />
                            </Form.Group>
                            <Row>
                                <Col md={6}>
                                    <Form.Group className="mb-3">
                                        <Form.Label>Email</Form.Label>
                                        <Form.Control type="email" required value={newStylist.email} onChange={(e) => setNewStylist({ ...newStylist, email: e.target.value })} />
                                    </Form.Group>
                                </Col>
                                <Col md={6}>
                                    <Form.Group className="mb-3">
                                        <Form.Label>Phone</Form.Label>
                                        <Form.Control type="text" required value={newStylist.phone} onChange={(e) => setNewStylist({ ...newStylist, phone: e.target.value })} />
                                    </Form.Group>
                                </Col>
                            </Row>
                            <Form.Group className="mb-3">
                                <Form.Label>Role</Form.Label>
                                <Form.Select required value={newStylist.role} onChange={(e) => setNewStylist({ ...newStylist, role: e.target.value })}>
                                    <option value="">Select Role</option>
                                    <option value="Senior Stylist">Senior Stylist</option>
                                    <option value="Barber">Barber</option>
                                    <option value="Colorist">Colorist</option>
                                    <option value="Junior Stylist">Junior Stylist</option>
                                </Form.Select>
                            </Form.Group>
                        </Modal.Body>
                        <Modal.Footer>
                            <Button variant="outline-secondary" onClick={handleCloseStylistModal}>Cancel</Button>
                            <Button type="submit" className="btn-primary-custom">Save Stylist & Send Invite</Button>
                        </Modal.Footer>
                    </Form>
                )}
            </Modal>
        </div>
    );
};

export default AdminDashboard;
