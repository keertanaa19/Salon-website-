import React, { useState, useEffect } from 'react';
import { Container, Row, Col, Card, Nav, Button, Table, Badge, Spinner } from 'react-bootstrap';
import { FaUser, FaCalendarCheck, FaHistory, FaSignOutAlt, FaDownload, FaStar, FaRegStar } from 'react-icons/fa';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import api from '../api';

const CustomerDashboard = () => {
    const [activeTab, setActiveTab] = useState('bookings');
    const [ratingHover, setRatingHover] = useState(0);
    const [user, setUser] = useState(null);
    const [loadingBookings, setLoadingBookings] = useState(true);
    const navigate = useNavigate();

    const handleLogout = () => {
        localStorage.removeItem('token');
        localStorage.removeItem('user');
        navigate('/login');
    };

    const defaultBookings = [
        { id: '1024', service: 'Men\'s Haircut', stylist: 'Marcus Johnson', date: '2023-11-20', time: '10:00 AM', status: 'Upcoming', price: '₹35' },
        { id: '0982', service: 'Beard Trimming', stylist: 'Marcus Johnson', date: '2023-10-15', time: '02:00 PM', status: 'Completed', price: '₹25' },
        { id: '0854', service: 'Spa & Facial', stylist: 'Sophia Chen', date: '2023-08-05', time: '11:00 AM', status: 'Completed', price: '₹120' },
    ];

    const [bookings, setBookings] = useState([]);
    const [reviewForm, setReviewForm] = useState({ bookingId: '', rating: 5, comment: '' });
    const [customerReviews, setCustomerReviews] = useState([
        { id: '1', service: 'Spa & Facial', stylist: 'Sophia Chen', date: 'Oct 15, 2023', rating: 5, text: 'Excellent service! Sophia really knew exactly how to layer my hair to add volume. The salon itself was also impeccably clean!' }
    ]);

    useEffect(() => {
        const u = JSON.parse(localStorage.getItem('user'));
        if (u) setUser(u);

        const fetchBookings = async () => {
            try {
                const res = await api.get('/bookings/my-bookings');
                const apiBookings = res.data.map(b => ({
                    id: b._id.substring(b._id.length - 4),
                    service: b.service?.name || 'Custom Service',
                    stylist: b.stylist?.name || 'Stylist',
                    date: b.date,
                    time: b.time,
                    status: b.status.charAt(0).toUpperCase() + b.status.slice(1),
                    price: `₹${b.totalPrice || b.service?.price || 0}`
                }));
                setBookings(apiBookings.length > 0 ? apiBookings : defaultBookings);
            } catch (err) {
                console.error("Failed to fetch bookings", err);
                setBookings(defaultBookings);
            } finally {
                setLoadingBookings(false);
            }
        };

        fetchBookings();
        
        const storedReviews = JSON.parse(localStorage.getItem('salonReviews') || '[]');
        if (storedReviews.length > 0) {
            setCustomerReviews([...storedReviews, ...customerReviews]);
        }
    }, []);

    const handleSubmitReview = (e) => {
        e.preventDefault();
        const selectedBooking = bookings.find(b => b.id === reviewForm.bookingId);
        if (!selectedBooking) return;
        
        const newReview = {
            id: Date.now().toString(),
            service: selectedBooking.service,
            stylist: selectedBooking.stylist,
            date: new Date().toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' }),
            rating: reviewForm.rating,
            text: reviewForm.comment
        };

        const updatedReviews = [newReview, ...customerReviews];
        setCustomerReviews(updatedReviews);
        localStorage.setItem('salonReviews', JSON.stringify([newReview, ...(JSON.parse(localStorage.getItem('salonReviews') || '[]'))]));
        
        alert("Review Submitted Successfully!");
        setReviewForm({ bookingId: '', rating: 5, comment: '' });
        setActiveTab('bookings');
    };

    const handleDownloadInvoice = (booking) => {
        const invoiceHtml = `
            <!DOCTYPE html>
            <html>
                <head>
                    <title>Invoice #${booking.id}</title>
                    <style>
                        body { font-family: 'Helvetica Neue', Arial, sans-serif; padding: 40px; color: #333; line-height: 1.6; }
                        .header { border-bottom: 2px solid #333; padding-bottom: 20px; margin-bottom: 40px; display: flex; justify-content: space-between; align-items: flex-end; }
                        .salon-name { font-size: 32px; font-weight: bold; color: #1a1a1a; letter-spacing: -1px; margin: 0; }
                        .invoice-title { font-size: 28px; color: #666; font-weight: 300; margin: 0; }
                        .details { display: grid; grid-template-columns: 1fr 1fr; margin-bottom: 50px; font-size: 15px; }
                        .details p { margin: 5px 0; color: #555; }
                        .details strong { color: #1a1a1a; min-width: 100px; display: inline-block; }
                        .table { width: 100%; border-collapse: collapse; margin-bottom: 30px; }
                        .table th, .table td { padding: 15px; text-align: left; border-bottom: 1px solid #ddd; }
                        .table th { background-color: #f8f9fa; font-weight: 600; font-size: 14px; text-transform: uppercase; letter-spacing: 1px; }
                        .table td { font-size: 16px; }
                        .total-row { display: flex; justify-content: flex-end; font-size: 22px; font-weight: bold; margin-top: 20px; color: #1a1a1a; border-top: 2px solid #333; padding-top: 20px; }
                        .footer { margin-top: 80px; text-align: center; color: #888; font-size: 13px; padding-top: 20px; border-top: 1px solid #eee; }
                    </style>
                </head>
                <body>
                    <div class="header">
                        <div>
                            <h1 class="salon-name">SalonStudio</h1>
                            <div style="color: #666; font-size: 14px; margin-top: 4px;">Luxury Hair & Spa</div>
                        </div>
                        <h2 class="invoice-title">INVOICE</h2>
                    </div>
                    
                    <div class="details">
                        <div>
                            <p><strong>Billed To:</strong> John Doe</p>
                            <p><strong>Date:</strong> ${booking.date}</p>
                            <p><strong>Time:</strong> ${booking.time}</p>
                        </div>
                        <div style="text-align: right;">
                            <p><strong>Invoice No:</strong> #SLN-${booking.id}</p>
                            <p><strong>Status:</strong> <span style="background: #e6f4ea; color: #1e8e3e; padding: 4px 10px; border-radius: 4px; font-size: 12px; font-weight: bold;">PAID SECURELY</span></p>
                            <p><strong>Stylist:</strong> ${booking.stylist}</p>
                        </div>
                    </div>

                    <table class="table">
                        <thead>
                            <tr>
                                <th>Item Description</th>
                                <th style="text-align: right;">Amount</th>
                            </tr>
                        </thead>
                        <tbody>
                            <tr>
                                <td>
                                    <strong style="display: block; color: #1a1a1a;">${booking.service} Appointment</strong>
                                    <span style="font-size: 13px; color: #666;">Professional Salon Services</span>
                                </td>
                                <td style="text-align: right; font-weight: 500;">${booking.price}</td>
                            </tr>
                        </tbody>
                    </table>

                    <div class="total-row">
                        <span>Total Paid: </span><span style="margin-left: 20px;">${booking.price}</span>
                    </div>

                    <div class="footer">
                        <p style="font-weight: bold; color: #333; margin-bottom: 5px;">Thank you for choosing SalonStudio!</p>
                        <p style="margin: 0;">We look forward to serving you again. If you have any questions about this invoice,</p>
                        <p style="margin: 0;">please contact support@salonstudio.com</p>
                    </div>

                    <script>
                        window.onload = function() {
                            setTimeout(function() {
                                window.print();
                                setTimeout(function() { window.close(); }, 500);
                            }, 500);
                        };
                    </script>
                </body>
            </html>
        `;

        const printWindow = window.open('', '_blank');
        printWindow.document.write(invoiceHtml);
        printWindow.document.close();
    };

    return (
        <div className="dashboard-page bg-light min-vh-100 pb-5" style={{ paddingTop: '80px' }}>
            <Container className="mt-4">
                <Row>
                    {/* Sidebar */}
                    <Col lg={3} className="mb-4">
                        <Card className="border-0 shadow-sm rounded-4 h-100">
                            <Card.Body className="p-4 d-flex flex-column text-center text-lg-start">
                                <div className="text-center mb-4">
                                    <div className="bg-primary text-white rounded-circle d-flex align-items-center justify-content-center mx-auto mb-3 shadow" style={{ width: '80px', height: '80px', fontSize: '2rem' }}>
                                        <FaUser />
                                    </div>
                                    <h5 className="fw-bold mb-1">{user?.name || 'John Doe'}</h5>
                                    <p className="text-muted small">Customer</p>
                                </div>

                                <Nav className="flex-column nav-pills gap-2 mb-auto w-100">
                                    <Nav.Link
                                        className={`d-flex align-items-center py-3 px-3 rounded-3 fw-bold transition-all ${activeTab === 'bookings' ? 'bg-primary text-white shadow-sm' : 'text-dark bg-white hover-light'}`}
                                        onClick={() => setActiveTab('bookings')}
                                        style={{ cursor: 'pointer' }}
                                    >
                                        <FaCalendarCheck className="me-3" /> My Bookings
                                    </Nav.Link>
                                    <Nav.Link
                                        className={`d-flex align-items-center py-3 px-3 rounded-3 fw-bold transition-all ${activeTab === 'history' ? 'bg-primary text-white shadow-sm' : 'text-dark bg-white hover-light'}`}
                                        onClick={() => setActiveTab('history')}
                                        style={{ cursor: 'pointer' }}
                                    >
                                        <FaHistory className="me-3" /> History & Invoices
                                    </Nav.Link>
                                    <Nav.Link
                                        className={`d-flex align-items-center py-3 px-3 rounded-3 fw-bold transition-all ${activeTab === 'reviews' ? 'bg-primary text-white shadow-sm' : 'text-dark bg-white hover-light'}`}
                                        onClick={() => setActiveTab('reviews')}
                                        style={{ cursor: 'pointer' }}
                                    >
                                        <FaStar className="me-3" /> Rate & Review Services
                                    </Nav.Link>
                                    <Nav.Link
                                        className={`d-flex align-items-center py-3 px-3 rounded-3 fw-bold transition-all ${activeTab === 'profile' ? 'bg-primary text-white shadow-sm' : 'text-dark bg-white hover-light'}`}
                                        onClick={() => setActiveTab('profile')}
                                        style={{ cursor: 'pointer' }}
                                    >
                                        <FaUser className="me-3" /> Profile Settings
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
                        <AnimatePresence mode="wait">
                            <motion.div
                                key={activeTab}
                                initial={{ opacity: 0, x: 30 }}
                                animate={{ opacity: 1, x: 0 }}
                                exit={{ opacity: 0, x: -30 }}
                                transition={{ duration: 0.3, ease: "easeOut" }}
                            >
                                <Card className="border-0 shadow-sm rounded-4 mb-4">
                                <Card.Body className="p-4 p-md-5">
                                    <div className="d-flex flex-column flex-md-row justify-content-between align-items-center mb-4">
                                        <h3 className="fw-bold m-0">{activeTab === 'bookings' ? 'Upcoming Bookings' : activeTab === 'history' ? 'Booking History' : activeTab === 'reviews' ? 'My Reviews & Feedback' : 'Profile Settings'}</h3>
                                        {activeTab === 'bookings' && (
                                            <Button className="btn-primary-custom mt-3 mt-md-0" onClick={() => navigate('/booking')}>
                                                + New Appointment
                                            </Button>
                                        )}
                                    </div>

                                    {activeTab === 'bookings' && (
                                        <div className="table-responsive">
                                            {loadingBookings ? (
                                                <div className="text-center py-5"><Spinner animation="border" variant="primary" /></div>
                                            ) : (
                                                <Table hover className="align-middle">
                                                    <thead className="table-light">
                                                        <tr>
                                                            <th>Service</th>
                                                            <th>Stylist</th>
                                                            <th>Date & Time</th>
                                                            <th>Status</th>
                                                            <th>Action</th>
                                                        </tr>
                                                    </thead>
                                                    <tbody>
                                                        {bookings.filter(b => b.status === 'Upcoming' || b.status === 'Pending').map((b, i) => (
                                                            <tr key={i}>
                                                                <td className="fw-bold">{b.service}</td>
                                                                <td>{b.stylist}</td>
                                                                <td>{b.date} <br /><small className="text-muted">{b.time}</small></td>
                                                                <td><Badge bg="warning" text="dark">{b.status}</Badge></td>
                                                                <td><Button variant="outline-danger" size="sm" className="fw-bold">Cancel</Button></td>
                                                            </tr>
                                                        ))}
                                                        {bookings.filter(b => b.status === 'Upcoming' || b.status === 'Pending').length === 0 && (
                                                            <tr><td colSpan="5" className="text-center py-4 text-muted">No upcoming bookings found.</td></tr>
                                                        )}
                                                    </tbody>
                                                </Table>
                                            )}
                                        </div>
                                    )}

                                    {activeTab === 'history' && (
                                        <div className="table-responsive">
                                            <Table hover className="align-middle">
                                                <thead className="table-light">
                                                    <tr>
                                                        <th>Invoice ID</th>
                                                        <th>Service</th>
                                                        <th>Date</th>
                                                        <th>Amount</th>
                                                        <th>Status</th>
                                                        <th>Invoice</th>
                                                    </tr>
                                                </thead>
                                                <tbody>
                                                    {bookings.map((b, i) => (
                                                        <tr key={i}>
                                                            <td className="fw-bold text-primary">#{b.id}</td>
                                                            <td>{b.service}</td>
                                                            <td>{b.date}</td>
                                                            <td className="fw-bold">{b.price}</td>
                                                            <td><Badge bg={b.status === 'Completed' ? 'success' : 'warning'} className={b.status === 'Upcoming' ? 'text-dark' : ''}>{b.status === 'Upcoming' ? 'Paid' : 'Completed'}</Badge></td>
                                                            <td><Button variant="light" size="sm" className="border shadow-sm fw-bold hover-primary" onClick={() => handleDownloadInvoice(b)}><FaDownload className="text-primary me-1" /> PDF</Button></td>
                                                        </tr>
                                                    ))}
                                                </tbody>
                                            </Table>
                                        </div>
                                    )}

                                    {activeTab === 'profile' && (
                                        <Row className="g-4">
                                            <Col md={6}>
                                                <div className="mb-3">
                                                    <label className="form-label text-muted small fw-bold">Full Name</label>
                                                    <input type="text" className="form-control bg-light" defaultValue={user?.name || "John Doe"} />
                                                </div>
                                                <div className="mb-3">
                                                    <label className="form-label text-muted small fw-bold">Email</label>
                                                    <input type="email" className="form-control bg-light" defaultValue={user?.email || "john.doe@example.com"} />
                                                </div>
                                                <Button className="btn-primary-custom px-4 mt-3">Save Changes</Button>
                                            </Col>
                                        </Row>
                                    )}

                                    {activeTab === 'reviews' && (
                                        <div>
                                            <p className="text-muted mb-4">We'd love to hear about your experience with our salon! Your feedback helps us improve.</p>
                                            
                                            <Card className="border shadow-sm rounded-4 p-4 mb-4 bg-light">
                                                <h5 className="fw-bold mb-3 d-flex align-items-center"><FaStar className="text-warning me-2" /> Write a Review</h5>
                                                <form onSubmit={handleSubmitReview}>
                                                    <div className="mb-3">
                                                        <label className="form-label text-muted small fw-bold">Select Appointment to Review</label>
                                                        <select className="form-select bg-white" required value={reviewForm.bookingId} onChange={(e) => setReviewForm({...reviewForm, bookingId: e.target.value})}>
                                                            <option value="">Choose a past appointment</option>
                                                            {bookings.filter(b => b.status === 'Completed').map((b, i) => (
                                                                <option key={i} value={b.id}>{b.date} - {b.service} with {b.stylist}</option>
                                                            ))}
                                                        </select>
                                                    </div>
                                                    
                                                    <div className="mb-3">
                                                        <label className="form-label text-muted small fw-bold">Rating</label>
                                                        <div className="d-flex text-warning fs-3 mb-2" style={{ cursor: 'pointer' }}>
                                                            {[1, 2, 3, 4, 5].map(star => (
                                                                <div 
                                                                    key={star} 
                                                                    onClick={() => setReviewForm({...reviewForm, rating: star})}
                                                                    onMouseEnter={() => setRatingHover(star)}
                                                                    onMouseLeave={() => setRatingHover(0)}
                                                                    className="me-2 transition-all hover-scale"
                                                                >
                                                                    {star <= (ratingHover || reviewForm.rating) ? <FaStar /> : <FaRegStar />}
                                                                </div>
                                                            ))}
                                                        </div>
                                                        <small className="text-muted">Click to select rating</small>
                                                    </div>

                                                    <div className="mb-4">
                                                        <label className="form-label text-muted small fw-bold">Your Feedback</label>
                                                        <textarea className="form-control bg-white" rows="4" placeholder="How was your haircut? Was the stylist professional?" required value={reviewForm.comment} onChange={(e) => setReviewForm({...reviewForm, comment: e.target.value})}></textarea>
                                                    </div>

                                                    <Button type="submit" className="btn-primary-custom px-5 py-2 fw-bold w-100 w-md-auto">
                                                        Submit Review
                                                    </Button>
                                                </form>
                                            </Card>

                                            <h5 className="fw-bold mt-5 mb-3">Your Past Reviews</h5>
                                            {customerReviews.length === 0 ? (
                                                <p className="text-muted">You haven't submitted any reviews yet.</p>
                                            ) : (
                                                customerReviews.map((r, i) => (
                                                    <Card key={i} className="border-0 shadow-sm rounded-4 mb-3">
                                                        <Card.Body>
                                                            <div className="d-flex justify-content-between">
                                                                <div>
                                                                    <h6 className="fw-bold mb-1">{r.service}</h6>
                                                                    <p className="small text-muted mb-2">{r.date} • {r.stylist}</p>
                                                                </div>
                                                                <div className="text-warning">
                                                                    {'★'.repeat(r.rating)}{'☆'.repeat(5 - r.rating)}
                                                                </div>
                                                            </div>
                                                            <p className="mb-0 text-dark fst-italic">"{r.text}"</p>
                                                        </Card.Body>
                                                    </Card>
                                                ))
                                            )}
                                        </div>
                                    )}
                                </Card.Body>
                            </Card>

                            {/* Status widgets for dashboard view */}
                            {activeTab === 'bookings' && (
                                <Row className="g-4">
                                    <Col md={6}>
                                        <Card className="border-0 shadow-sm bg-primary text-white rounded-4 h-100">
                                            <Card.Body className="p-4 d-flex align-items-center justify-content-between">
                                                <div>
                                                    <p className="mb-1 fw-semibold opacity-75">Total Bookings</p>
                                                    <h2 className="display-4 fw-bold mb-0">12</h2>
                                                </div>
                                                <FaHistory className="opacity-25" style={{ fontSize: '4rem' }} />
                                            </Card.Body>
                                        </Card>
                                    </Col>
                                    <Col md={6}>
                                        <Card className="border-0 shadow-sm bg-warning text-dark rounded-4 h-100">
                                            <Card.Body className="p-4 d-flex align-items-center justify-content-between">
                                                <div>
                                                    <p className="mb-1 fw-semibold opacity-75">Reward Points</p>
                                                    <h2 className="display-4 fw-bold mb-0">450</h2>
                                                </div>
                                                <FaUser className="opacity-25" style={{ fontSize: '4rem' }} />
                                            </Card.Body>
                                        </Card>
                                    </Col>
                                </Row>
                            )}
                        </motion.div>
                        </AnimatePresence>
                    </Col>
                </Row>
            </Container>
        </div>
    );
};

export default CustomerDashboard;
