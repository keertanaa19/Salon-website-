import React from 'react';
import { Container, Row, Col, Card, Nav, Button, Table, Badge, Modal, Form } from 'react-bootstrap';
import { FaChartPie, FaCity, FaStar, FaSignOutAlt, FaCrown, FaCheckCircle, FaUserShield } from 'react-icons/fa';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import {
    Chart as ChartJS,
    CategoryScale,
    LinearScale,
    BarElement,
    ArcElement,
    Title,
    Tooltip,
    Legend,
} from 'chart.js';
import { Bar, Doughnut } from 'react-chartjs-2';

ChartJS.register(
    CategoryScale,
    LinearScale,
    BarElement,
    ArcElement,
    Title,
    Tooltip,
    Legend
);

const OwnerDashboard = () => {
    const navigate = useNavigate();

    const [activeTab, setActiveTab] = React.useState('metrics');

    const handleLogout = () => {
        navigate('/login');
    };

    const [branchesList, setBranchesList] = React.useState([]);

    const fetchBranches = async () => {
        try {
            const res = await fetch('http://localhost:5000/api/branches');
            if (res.ok) {
                const data = await res.json();
                const formatted = data.map((b, idx) => ({
                    id: b._id,
                    displayId: idx + 1,
                    name: b.name,
                    location: b.location,
                    Manager: b.managerName || 'Pending',
                    revenue: '₹0',
                    status: b.status
                }));
                setBranchesList(formatted);
            }
        } catch (error) {
            console.error('Error fetching branches:', error);
        }
    };

    React.useEffect(() => {
        if (activeTab === 'branches') {
            fetchBranches();
        }
    }, [activeTab]);
    const [showBranchModal, setShowBranchModal] = React.useState(false);
    const [newBranch, setNewBranch] = React.useState({ name: '', location: '', Manager: '', managerEmail: '' });
    const [invitationLink, setInvitationLink] = React.useState(null);

    const handleAddBranch = async (e) => {
        e.preventDefault();
        try {
            const token = localStorage.getItem('token');
            const res = await fetch('http://localhost:5000/api/branches', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    Authorization: `Bearer ${token}`
                },
                body: JSON.stringify(newBranch)
            });

            if (res.ok) {
                // Automatically send the management invitation link
                await fetch('http://localhost:5000/api/invitations/send', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` },
                    body: JSON.stringify({
                        email: newBranch.managerEmail,
                        branchName: newBranch.name,
                        branchLocation: newBranch.location
                    })
                });

                await fetchBranches();
                setInvitationLink(true);
            } else {
                alert('Failed to save branch');
            }
        } catch (error) {
            console.error('Error adding branch:', error);
        }
    };

    const handleCloseBranchModal = () => {
        setShowBranchModal(false);
        setTimeout(() => {
            setNewBranch({ name: '', location: '', Manager: '', managerEmail: '' });
            setInvitationLink(null);
        }, 300);
    };

    const reviewsList = [
        { id: 1, customer: 'Alice Brown', branch: 'Downtown Studio', rating: 5, date: 'Oct 24, 2023', text: 'Absolutely love the service! Marcus was amazing.', status: 'Published' },
        { id: 2, customer: 'David Smith', branch: 'Uptown Elegance', rating: 4, date: 'Oct 22, 2023', text: 'Great haircut, but I had to wait 15 minutes past my time.', status: 'Published' },
        { id: 3, customer: 'Emma Wilson', branch: 'Westside Cuts', rating: 5, date: 'Oct 20, 2023', text: 'The spa facial was incredibly relaxing. Will return!', status: 'Published' },
        { id: 4, customer: 'John Doe', branch: 'Downtown Studio', rating: 2, date: 'Oct 18, 2023', text: 'Not satisfied with the beard trim. It was rushed.', status: 'Flagged' },
    ];

    const [adminsList, setAdminsList] = React.useState([]);

    const fetchAdmins = async () => {
        try {
            const token = localStorage.getItem('token');
            const headers = token ? { Authorization: `Bearer ${token}` } : {};
            
            const [adminsRes, invitesRes] = await Promise.all([
                fetch('http://localhost:5000/api/users/admins', { headers }),
                fetch('http://localhost:5000/api/invitations/pending', { headers })
            ]);

            const adminsData = await adminsRes.json();
            const invitesData = await invitesRes.json();

            const formattedAdmins = (adminsData.length ? adminsData : []).map((admin, idx) => ({
                id: `A${idx+1}`,
                realId: admin._id,
                name: admin.name,
                email: admin.email,
                phone: admin.phone || 'N/A',
                branch: admin.branchName || 'N/A',
                status: 'Active'
            }));

            const formattedInvites = (invitesData.length ? invitesData : []).map((invite, idx) => ({
                id: `P${idx+1}`,
                realId: invite._id,
                name: '(Pending Setup)',
                email: invite.email,
                phone: '-',
                branch: invite.branchName,
                status: 'Pending'
            }));

            setAdminsList([...formattedAdmins, ...formattedInvites]);
        } catch (error) {
            console.error('Error fetching admins:', error);
        }
    };

    React.useEffect(() => {
        if (activeTab === 'admins') {
            fetchAdmins();
        }
    }, [activeTab]);
    const [showAdminModal, setShowAdminModal] = React.useState(false);
    const [newAdmin, setNewAdmin] = React.useState({ name: '', email: '', phone: '', branch: '' });
    const [adminInvitationSent, setAdminInvitationSent] = React.useState(false);

    const handleAddAdmin = async (e) => {
        e.preventDefault();
        
        try {
            const token = localStorage.getItem('token');
            const res = await fetch('http://localhost:5000/api/invitations/send', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    Authorization: `Bearer ${token}`
                },
                body: JSON.stringify({
                    email: newAdmin.email,
                    branchName: newAdmin.branch,
                    branchLocation: 'Location TBD'
                })
            });

            const data = await res.json();

            if (res.ok) {
                await fetchAdmins();
                setAdminInvitationSent(true);
            } else {
                alert(data.message || 'Failed to send invitation');
            }
        } catch (error) {
            console.error('Error sending invitation:', error);
            alert('Server error while sending invitation');
        }
    };

    const handleRevokeAdmin = async (realId, status) => {
        if (!window.confirm(`Are you sure you want to revoke this ${status === 'Active' ? 'Admin' : 'Invitation'}?`)) return;

        try {
            const token = localStorage.getItem('token');
            const headers = token ? { Authorization: `Bearer ${token}` } : {};
            
            const endpoint = status === 'Active' 
                ? `http://localhost:5000/api/users/admins/${realId}`
                : `http://localhost:5000/api/invitations/${realId}`;

            const res = await fetch(endpoint, {
                method: 'DELETE',
                headers
            });

            if (res.ok) {
                fetchAdmins(); // Refresh the list
            } else {
                const data = await res.json();
                alert(data.message || 'Failed to revoke');
            }
        } catch (error) {
            console.error('Error revoking:', error);
            alert('Server error while revoking');
        }
    };

    const handleCloseAdminModal = () => {
        setShowAdminModal(false);
        setTimeout(() => {
            setNewAdmin({ name: '', email: '', phone: '', branch: '' });
            setAdminInvitationSent(false);
        }, 300);
    };

    const handleExportReport = () => {
        let csvContent = "data:text/csv;charset=utf-8,";
        csvContent += "SALONSTUDIO GLOBAL METRICS REPORT\n\n";
        csvContent += "Category,Value\n";
        csvContent += "Total Global Revenue,105000\n";
        csvContent += "Total Branches,3\n";
        csvContent += "Total Clients,3240\n\n";
        
        csvContent += "BRANCH REVENUE BREAKDOWN\n";
        csvContent += "Branch Name,Monthly Revenue\n";
        csvContent += "Downtown Studio,45000\n";
        csvContent += "Uptown Elegance,32000\n";
        csvContent += "Westside Cuts,28000\n\n";

        csvContent += "SERVICE POPULARITY\n";
        csvContent += "Service Name,Percentage\n";
        csvContent += "Hair Services,65%\n";
        csvContent += "Spa & Massage,25%\n";
        csvContent += "Nail Art,10%\n";

        const encodedUri = encodeURI(csvContent);
        const link = document.createElement("a");
        link.setAttribute("href", encodedUri);
        link.setAttribute("download", "SalonStudio_GlobalReport.csv");
        document.body.appendChild(link); // Required for FF
        link.click();
        document.body.removeChild(link);
    };

    const branchData = {
        labels: ['Downtown', 'Uptown', 'Westside'],
        datasets: [
            {
                label: 'Monthly Revenue (₹)',
                data: [45000, 32000, 28000],
                backgroundColor: ['rgba(155, 81, 224, 0.8)', 'rgba(212, 175, 55, 0.8)', 'rgba(31, 31, 31, 0.8)'],
                borderWidth: 0,
                borderRadius: 8,
            },
        ],
    };

    const doughnutData = {
        labels: ['Hair Services', 'Spa & Massage', 'Nail Art'],
        datasets: [
            {
                data: [65, 25, 10],
                backgroundColor: ['#121212', '#9b51e0', '#d4af37'],
                borderWidth: 0,
            },
        ],
    };

    return (
        <div className="dashboard-page bg-light min-vh-100 pb-5" style={{ paddingTop: '80px' }}>
            <Container fluid className="px-4 mt-4">
                <Row>
                    {/* Sidebar */}
                    <Col lg={2} className="mb-4">
                        <Card className="border-0 shadow-sm rounded-4 h-100 text-bg-warning">
                            <Card.Body className="p-4 d-flex flex-column text-dark">
                                <div className="text-center mb-5 mt-2">
                                    <div className="bg-dark text-warning rounded-circle d-flex align-items-center justify-content-center mx-auto mb-3 shadow" style={{ width: '60px', height: '60px', fontSize: '1.5rem' }}>
                                        <FaCrown />
                                    </div>
                                    <h5 className="fw-bold mb-1">Super Admin</h5>
                                    <p className="small lh-sm text-dark opacity-75 fw-semibold">Global Owner Access</p>
                                </div>

                                <Nav className="flex-column nav-pills gap-2 mb-auto w-100">
                                    <Nav.Link 
                                        className={`d-flex align-items-center py-2 px-3 rounded-2 fw-bold transition-all ${activeTab === 'metrics' ? 'text-dark bg-white shadow-sm' : 'text-dark opacity-75 hover-white'}`}
                                        onClick={() => setActiveTab('metrics')}
                                        style={{ cursor: 'pointer' }}
                                    >
                                        <FaChartPie className="me-3" /> Global Metrics
                                    </Nav.Link>
                                    <Nav.Link 
                                        className={`d-flex align-items-center py-2 px-3 rounded-2 fw-bold transition-all ${activeTab === 'branches' ? 'text-dark bg-white shadow-sm' : 'text-dark opacity-75 hover-white'}`}
                                        onClick={() => setActiveTab('branches')}
                                        style={{ cursor: 'pointer' }}
                                    >
                                        <FaCity className="me-3" /> Branches
                                    </Nav.Link>
                                    <Nav.Link 
                                        className={`d-flex align-items-center py-2 px-3 rounded-2 fw-bold transition-all ${activeTab === 'admins' ? 'text-dark bg-white shadow-sm' : 'text-dark opacity-75 hover-white'}`}
                                        onClick={() => setActiveTab('admins')}
                                        style={{ cursor: 'pointer' }}
                                    >
                                        <FaUserShield className="me-3" /> Manage Admins
                                    </Nav.Link>
                                    <Nav.Link 
                                        className={`d-flex align-items-center py-2 px-3 rounded-2 fw-bold transition-all ${activeTab === 'reviews' ? 'text-dark bg-white shadow-sm' : 'text-dark opacity-75 hover-white'}`}
                                        onClick={() => setActiveTab('reviews')}
                                        style={{ cursor: 'pointer' }}
                                    >
                                        <FaStar className="me-3" /> Global Reviews
                                    </Nav.Link>
                                </Nav>

                                <Button variant="dark" className="w-100 fw-bold mt-5 py-2 d-flex align-items-center justify-content-center shadow" onClick={handleLogout}>
                                    <FaSignOutAlt className="me-2" /> Logout
                                </Button>
                            </Card.Body>
                        </Card>
                    </Col>

                    {/* Main Content */}
                    <Col lg={10}>
                        <motion.div
                            key={activeTab}
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.5 }}
                        >
                            <div className="d-flex justify-content-between align-items-center mb-4">
                                <h3 className="fw-bold display-6 m-0">
                                    {activeTab === 'metrics' && <>Global <span className="text-primary">Performance</span></>}
                                    {activeTab === 'branches' && <>Manage <span className="text-primary">Branches</span></>}
                                    {activeTab === 'admins' && <>Manage <span className="text-primary">Admins</span></>}
                                    {activeTab === 'reviews' && <>Global <span className="text-primary">Reviews</span></>}
                                </h3>
                                {activeTab === 'metrics' && <Button className="btn-secondary-custom shadow-sm fw-bold" onClick={handleExportReport}><i className="fa fa-download me-2"></i>Export Master Report</Button>}
                            </div>

                            {activeTab === 'metrics' && (
                                <>
                                    <Row className="g-4 mb-4">
                                        <Col md={4}>
                                            <Card className="border-0 shadow-sm rounded-4 h-100 p-3 bg-black text-white">
                                                <Card.Body className="d-flex align-items-center justify-content-between">
                                                    <div>
                                                        <p className="text-white-50 fw-bold mb-1 small text-uppercase">Total Global Revenue</p>
                                                        <h2 className="fw-bold m-0 text-warning">₹105,000</h2>
                                                    </div>
                                                    <FaChartPie className="text-white-50 fs-1" />
                                                </Card.Body>
                                            </Card>
                                        </Col>
                                        <Col md={4}>
                                            <Card className="border-0 shadow-sm rounded-4 h-100 p-3 bg-primary text-white">
                                                <Card.Body className="d-flex align-items-center justify-content-between">
                                                    <div>
                                                        <p className="text-white-50 fw-bold mb-1 small text-uppercase">Total Branches</p>
                                                        <h2 className="fw-bold m-0">3</h2>
                                                    </div>
                                                    <FaCity className="text-white-50 fs-1" />
                                                </Card.Body>
                                            </Card>
                                        </Col>
                                        <Col md={4}>
                                            <Card className="border-0 shadow-sm rounded-4 h-100 p-3 bg-white">
                                                <Card.Body className="d-flex align-items-center justify-content-between">
                                                    <div>
                                                        <p className="text-muted fw-bold mb-1 small text-uppercase">Total Clients</p>
                                                        <h2 className="fw-bold m-0 text-dark">3,240</h2>
                                                    </div>
                                                    <FaStar className="text-warning fs-1" />
                                                </Card.Body>
                                            </Card>
                                        </Col>
                                    </Row>

                                    <Row className="g-4">
                                        <Col md={8}>
                                            <Card className="border-0 shadow-sm rounded-4 h-100">
                                                <Card.Body className="p-4">
                                                    <h5 className="fw-bold pb-2 mb-4">Revenue by Branch</h5>
                                                    <div style={{ height: '350px' }}>
                                                        <Bar
                                                            options={{ responsive: true, maintainAspectRatio: false }}
                                                            data={branchData}
                                                        />
                                                    </div>
                                                </Card.Body>
                                            </Card>
                                        </Col>
                                        <Col md={4}>
                                            <Card className="border-0 shadow-sm rounded-4 h-100">
                                                <Card.Body className="p-4 d-flex flex-column">
                                                    <h5 className="fw-bold pb-2 mb-4">Service Popularity</h5>
                                                    <div className="flex-grow-1 d-flex align-items-center justify-content-center" style={{ minHeight: '300px' }}>
                                                        <div style={{ width: '80%', height: '80%' }}>
                                                            <Doughnut options={{ plugins: { legend: { position: 'bottom' } } }} data={doughnutData} />
                                                        </div>
                                                    </div>
                                                </Card.Body>
                                            </Card>
                                        </Col>
                                    </Row>
                                </>
                            )}
                            
                            {activeTab === 'branches' && (
                                <Card className="border-0 shadow-sm rounded-4 p-4">
                                    <div className="d-flex justify-content-between align-items-center mb-4">
                                        <h4 className="fw-bold m-0"><FaCity className="text-primary me-2" />Branch Management</h4>
                                        <Button className="btn-primary-custom" onClick={() => setShowBranchModal(true)}>+ Add New Branch</Button>
                                    </div>
                                    <Table hover className="align-middle">
                                        <thead className="table-light">
                                            <tr>
                                                <th>ID</th>
                                                <th>Branch Name</th>
                                                <th>Location</th>
                                                <th>Manager</th>
                                                <th>Monthly Rev</th>
                                                <th>Status</th>
                                                <th>Action</th>
                                            </tr>
                                        </thead>
                                        <tbody>
                                            {branchesList.map(b => (
                                                <tr key={b.id}>
                                                    <td className="text-muted">#{b.id}</td>
                                                    <td className="fw-bold">{b.name}</td>
                                                    <td className="text-muted small">{b.location}</td>
                                                    <td>{b.Manager}</td>
                                                    <td className="text-success fw-bold">{b.revenue}</td>
                                                    <td><Badge bg={b.status === 'Active' ? 'success' : 'secondary'}>{b.status}</Badge></td>
                                                    <td>
                                                        <Button variant="light" size="sm" className="border shadow-sm me-2">Manage</Button>
                                                    </td>
                                                </tr>
                                            ))}
                                        </tbody>
                                    </Table>
                                </Card>
                            )}

                            {activeTab === 'admins' && (
                                <Card className="border-0 shadow-sm rounded-4 p-4">
                                    <div className="d-flex justify-content-between align-items-center mb-4">
                                        <h4 className="fw-bold m-0"><FaUserShield className="text-warning me-2" />Manage Admins</h4>
                                        <Button className="btn-primary-custom" onClick={() => setShowAdminModal(true)}>+ Add Admin</Button>
                                    </div>
                                    <Table hover className="align-middle">
                                        <thead className="table-light">
                                            <tr>
                                                <th>ID</th>
                                                <th>Admin Details</th>
                                                <th>Assigned Branch</th>
                                                <th>Status</th>
                                                <th>Action</th>
                                            </tr>
                                        </thead>
                                        <tbody>
                                            {adminsList.map(admin => (
                                                <tr key={admin.id}>
                                                    <td className="text-muted">#{admin.id}</td>
                                                    <td>
                                                        <div className="fw-bold">{admin.name}</div>
                                                        <div className="small text-muted">{admin.email} • {admin.phone}</div>
                                                    </td>
                                                    <td className="fw-semibold text-primary">{admin.branch}</td>
                                                    <td><Badge bg={admin.status === 'Active' ? 'success' : 'secondary'}>{admin.status}</Badge></td>
                                                    <td>
                                                        <Button variant="light" size="sm" className="border shadow-sm me-2">Edit</Button>
                                                        <Button variant="outline-danger" size="sm" onClick={() => handleRevokeAdmin(admin.realId, admin.status)}>Revoke</Button>
                                                    </td>
                                                </tr>
                                            ))}
                                        </tbody>
                                    </Table>
                                </Card>
                            )}

                            {activeTab === 'reviews' && (
                                <Card className="border-0 shadow-sm rounded-4 p-4">
                                    <div className="d-flex justify-content-between align-items-center mb-4">
                                        <h4 className="fw-bold m-0"><FaStar className="text-warning me-2" />Customer Reviews</h4>
                                        <div className="d-flex gap-2">
                                            <Form.Select size="sm" className="shadow-sm border-secondary fw-bold" style={{ minWidth: '150px' }}>
                                                <option>All Branches</option>
                                                <option>Downtown Studio</option>
                                                <option>Uptown Elegance</option>
                                                <option>Westside Cuts</option>
                                            </Form.Select>
                                            <Form.Select size="sm" className="shadow-sm border-secondary fw-bold" style={{ minWidth: '120px' }}>
                                                <option>All Ratings</option>
                                                <option>5 Stars</option>
                                                <option>4 Stars</option>
                                                <option>3 Stars & Below</option>
                                            </Form.Select>
                                        </div>
                                    </div>
                                    <div className="d-flex flex-column gap-3">
                                        {reviewsList.map(review => (
                                            <Card key={review.id} className="border border-light shadow-sm rounded-3">
                                                <Card.Body className="p-4">
                                                    <div className="d-flex justify-content-between align-items-start mb-2">
                                                        <div>
                                                            <h6 className="fw-bold mb-0 fs-5">{review.customer}</h6>
                                                            <small className="text-muted fw-semibold">{review.branch} • {review.date}</small>
                                                        </div>
                                                        <div className="text-warning fs-5">
                                                            {'★'.repeat(review.rating)}<span className="text-muted opacity-25">{'★'.repeat(5 - review.rating)}</span>
                                                        </div>
                                                    </div>
                                                    <p className="mb-4 text-dark fst-italic">"{review.text}"</p>
                                                    <div className="d-flex justify-content-between align-items-center border-top pt-3">
                                                        <Badge bg={review.status === 'Published' ? 'success' : 'danger'} className="px-3 py-2">{review.status}</Badge>
                                                        <Button variant="outline-primary" size="sm" className="fw-bold px-4">Reply</Button>
                                                    </div>
                                                </Card.Body>
                                            </Card>
                                        ))}
                                    </div>
                                </Card>
                            )}
                        </motion.div>
                    </Col>
                </Row>
            </Container>

            <Modal show={showBranchModal} onHide={handleCloseBranchModal} centered>
                <Modal.Header closeButton>
                    <Modal.Title className="fw-bold">{invitationLink ? 'Branch Created!' : 'Add New Branch'}</Modal.Title>
                </Modal.Header>
                {invitationLink ? (
                    <Modal.Body className="text-center py-5">
                        <div className="mb-4">
                            <FaCheckCircle className="text-success" style={{ fontSize: '64px' }} />
                        </div>
                        <h4 className="fw-bold mb-3">Branch Created Successfully!</h4>
                        <p className="text-muted mb-4">An invitation link has been sent to <strong>{newBranch.managerEmail}</strong> to join as this branch's Admin Manager.</p>
                        
                        <Button className="btn-primary-custom px-5" onClick={handleCloseBranchModal}>
                            Done
                        </Button>
                    </Modal.Body>
                ) : (
                    <Form onSubmit={handleAddBranch}>
                        <Modal.Body>
                            <Form.Group className="mb-3">
                                <Form.Label>Branch Name</Form.Label>
                                <Form.Control type="text" required value={newBranch.name} onChange={(e) => setNewBranch({...newBranch, name: e.target.value})} placeholder="e.g. Eastside Salon" />
                            </Form.Group>
                            <Form.Group className="mb-3">
                                <Form.Label>Complete Address</Form.Label>
                                <Form.Control type="text" required value={newBranch.location} onChange={(e) => setNewBranch({...newBranch, location: e.target.value})} placeholder="123 Main St, City" />
                            </Form.Group>
                            <Row>
                                <Col md={6}>
                                    <Form.Group className="mb-3">
                                        <Form.Label>Assigned Manager Name</Form.Label>
                                        <Form.Control type="text" required value={newBranch.Manager} onChange={(e) => setNewBranch({...newBranch, Manager: e.target.value})} placeholder="Manager Name" />
                                    </Form.Group>
                                </Col>
                                <Col md={6}>
                                    <Form.Group className="mb-3">
                                        <Form.Label>Manager Email</Form.Label>
                                        <Form.Control type="email" required value={newBranch.managerEmail} onChange={(e) => setNewBranch({...newBranch, managerEmail: e.target.value})} placeholder="manager@salon.com" />
                                    </Form.Group>
                                </Col>
                            </Row>
                        </Modal.Body>
                        <Modal.Footer>
                            <Button variant="outline-secondary" onClick={handleCloseBranchModal}>Cancel</Button>
                            <Button type="submit" className="btn-primary-custom">Create Branch & Send Invite</Button>
                        </Modal.Footer>
                    </Form>
                )}
            </Modal>

            <Modal show={showAdminModal} onHide={handleCloseAdminModal} centered>
                <Modal.Header closeButton>
                    <Modal.Title className="fw-bold">{adminInvitationSent ? 'Invitation Sent!' : 'Send Admin Invitation'}</Modal.Title>
                </Modal.Header>
                {adminInvitationSent ? (
                    <Modal.Body className="text-center py-5">
                        <div className="mb-4">
                            <FaCheckCircle className="text-success" style={{ fontSize: '64px' }} />
                        </div>
                        <h4 className="fw-bold mb-3">Invitation Sent Successfully!</h4>
                        <p className="text-muted mb-4">An invitation link has been successfully emailed to <strong>{newAdmin.email}</strong> to join and manage <strong>{newAdmin.branch}</strong>.</p>
                        
                        <Button className="btn-primary-custom px-5" onClick={handleCloseAdminModal}>
                            Done
                        </Button>
                    </Modal.Body>
                ) : (
                    <Form onSubmit={handleAddAdmin}>
                        <Modal.Body>
                            <Form.Group className="mb-3">
                                <Form.Label>Admin Full Name</Form.Label>
                                <Form.Control type="text" required value={newAdmin.name} onChange={(e) => setNewAdmin({...newAdmin, name: e.target.value})} placeholder="e.g. John Doe" />
                            </Form.Group>
                            <Row>
                                <Col md={6}>
                                    <Form.Group className="mb-3">
                                        <Form.Label>Email Address</Form.Label>
                                        <Form.Control type="email" required value={newAdmin.email} onChange={(e) => setNewAdmin({...newAdmin, email: e.target.value})} placeholder="admin@salon.com" />
                                    </Form.Group>
                                </Col>
                                <Col md={6}>
                                    <Form.Group className="mb-3">
                                        <Form.Label>Phone Number</Form.Label>
                                        <Form.Control type="text" required value={newAdmin.phone} onChange={(e) => setNewAdmin({...newAdmin, phone: e.target.value})} placeholder="+1 234 567 8900" />
                                    </Form.Group>
                                </Col>
                            </Row>
                            <Form.Group className="mb-3">
                                <Form.Label>Assign to Branch</Form.Label>
                                <Form.Select required value={newAdmin.branch} onChange={(e) => setNewAdmin({...newAdmin, branch: e.target.value})}>
                                    <option value="">Select a Branch</option>
                                    {branchesList.map(b => (
                                        <option key={b.id} value={b.name}>{b.name}</option>
                                    ))}
                                    <option value="New Location (Pending)">New Location (Pending)</option>
                                </Form.Select>
                            </Form.Group>
                        </Modal.Body>
                        <Modal.Footer>
                            <Button variant="outline-secondary" onClick={handleCloseAdminModal}>Cancel</Button>
                            <Button type="submit" className="btn-primary-custom">Send Invitation</Button>
                        </Modal.Footer>
                    </Form>
                )}
            </Modal>
        </div>
    );
};

export default OwnerDashboard;
