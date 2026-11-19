import React, { useState, useEffect } from 'react';
import { Container, Row, Col, Card, Button, Form, Badge, Modal, Spinner, Alert } from 'react-bootstrap';
import { motion, AnimatePresence } from 'framer-motion';
import { FaCheckCircle, FaCalendarAlt, FaMapMarkerAlt, FaCut, FaUserTie, FaCreditCard } from 'react-icons/fa';
import ServiceCard from '../components/ServiceCard';
import StylistCard from '../components/StylistCard';
import { useNavigate } from 'react-router-dom';
import api from '../api';

const Booking = () => {
    const [step, setStep] = useState(1);
    const [bookingData, setBookingData] = useState({
        branch: null,
        service: null,
        stylist: null,
        date: '',
        time: '',
        generatedId: ''
    });

    const navigate = useNavigate();

    const nextStep = () => window.scrollTo(0, 0) || setStep(prev => prev + 1);
    const prevStep = () => window.scrollTo(0, 0) || setStep(prev => prev - 1);

    const [services, setServices] = useState([]);
    const [stylists, setStylists] = useState([]);
    const [branches, setBranches] = useState([]);
    const [isLoadingData, setIsLoadingData] = useState(true);
    const [bookingLoading, setBookingLoading] = useState(false);

    useEffect(() => {
        const fetchInitialData = async () => {
            try {
                const [servicesRes, stylistsRes, branchesRes] = await Promise.all([
                    api.get('/services'),
                    api.get('/users/stylists'),
                    api.get('/branches')
                ]);
                
                // Fallback mock data if DB is empty
                const dbServices = servicesRes.data;
                const dbStylists = stylistsRes.data;
                const dbBranches = branchesRes.data;
                
                setServices(dbServices.length > 0 ? dbServices.map(s => ({...s, id: s._id, title: s.name})) : [
                    { id: '655a6d5c64ea2b1a1c1d1001', title: 'Men\'s Haircut', description: 'Classic and modern styles.', price: 35, duration: 45, image: '/mens-haircut.png' },
                    { id: '655a6d5c64ea2b1a1c1d1002', title: 'Women\'s Styling', description: 'Complete styling & coloring.', price: 85, duration: 90, image: '/womens-styling.png' },
                ]);

                setStylists(dbStylists.length > 0 ? dbStylists.map(s => ({...s, id: s._id, rating: 5.0, experience: 5, image: `https://ui-avatars.com/api/?name=${s.name.replace(' ', '+')}&background=1a1a1a&color=d4af37&size=400`})) : [
                    { id: '655a6d5c64ea2b1a1c1d1003', name: 'Elena Rodriguez', experience: 8, rating: 4.9, image: 'https://ui-avatars.com/api/?name=Elena+Rodriguez&background=1a1a1a&color=d4af37&size=400', specialties: ['Coloring', 'Extensions'] },
                    { id: '655a6d5c64ea2b1a1c1d1004', name: 'Marcus Johnson', experience: 12, rating: 5.0, image: 'https://ui-avatars.com/api/?name=Marcus+Johnson&background=1a1a1a&color=d4af37&size=400', specialties: ['Men\'s Cuts', 'Fades'] },
                ]);

                setBranches(dbBranches.length > 0 ? dbBranches.map(b => ({...b, id: b._id, address: b.location, rating: b.rating || 5.0})) : [
                    { id: 1, name: 'Downtown Studio', address: '123 Fashion Ave, NY', rating: 4.8 },
                    { id: 2, name: 'Uptown Elegance', address: '456 Luxury St, NY', rating: 4.9 },
                    { id: 3, name: 'Westside Cuts', address: '789 Trendy Blvd, NY', rating: 4.7 },
                ]);
            } catch (err) {
                console.error("Error fetching data", err);
            } finally {
                setIsLoadingData(false);
            }
        };
        fetchInitialData();
    }, []);

    // Mock Data for timeslots
    const timeSlots = ['09:00 AM', '10:00 AM', '11:00 AM', '01:00 PM', '02:00 PM', '04:00 PM'];

    const [showPortfolioModal, setShowPortfolioModal] = useState(false);
    const [selectedPortfolioStylist, setSelectedPortfolioStylist] = useState(null);

    const handleViewPortfolio = (stylist, e) => {
        e.stopPropagation();
        setSelectedPortfolioStylist(stylist);
        setShowPortfolioModal(true);
    };

    const handleConfirmStylist = () => {
        handleSelect('stylist', selectedPortfolioStylist.id);
        setShowPortfolioModal(false);
        nextStep();
    };

    const handleSelect = (key, value) => {
        setBookingData({ ...bookingData, [key]: value });
    };

    const handlePayment = async () => {
        setBookingLoading(true);
        try {
            const selectedService = services.find(s => s.id === bookingData.service);
            
            const payload = {
                stylistId: bookingData.stylist,
                serviceId: bookingData.service,
                date: bookingData.date,
                time: bookingData.time,
                totalPrice: selectedService?.price || 0
            };

            const token = localStorage.getItem('token');
            if(!token) {
                 alert("Please login to book an appointment");
                 navigate('/login?role=customer');
                 return;
            }

            const response = await api.post('/bookings', payload);
            
            setBookingData({ ...bookingData, generatedId: response.data._id || response.data.id });
            setStep(6);
        } catch (err) {
            console.error("Booking error:", err);
            alert("Failed to create booking. Please try again.");
        } finally {
            setBookingLoading(false);
        }
    };

    const getStepIcon = (s) => {
        switch (s) {
            case 1: return <FaMapMarkerAlt />;
            case 2: return <FaCut />;
            case 3: return <FaUserTie />;
            case 4: return <FaCalendarAlt />;
            case 5: return <FaCreditCard />;
            default: return <FaCheckCircle />;
        }
    };

    const renderStepIndicator = () => (
        <div className="d-flex align-items-start justify-content-between mb-5 d-none d-md-flex w-100 px-3">
            {[1, 2, 3, 4, 5].map((s) => (
                <React.Fragment key={s}>
                    <div className="d-flex flex-column align-items-center" style={{ width: '80px' }}>
                        <div
                            className={`rounded-circle d-flex align-items-center justify-content-center fw-bold transition-all shadow-sm flex-shrink-0
              ${s < step ? 'bg-primary text-white' : s === step ? 'bg-warning text-dark border border-2 border-primary' : 'bg-white text-muted border'}`}
                            style={{ width: '40px', height: '40px', fontSize: '1.2rem', zIndex: 1 }}
                        >
                            {s < step ? <FaCheckCircle /> : getStepIcon(s)}
                        </div>
                        <span className={`small mt-2 fw-semibold text-center ${s === step ? 'text-primary' : 'text-muted'}`}>
                            {s === 1 ? 'Location' : s === 2 ? 'Service' : s === 3 ? 'Stylist' : s === 4 ? 'Time' : 'Payment'}
                        </span>
                    </div>
                    {s !== 5 && (
                        <div className="flex-grow-1 align-self-start" style={{ paddingTop: '18px' }}>
                            <div 
                                className="w-100 rounded" 
                                style={{ 
                                    height: '4px', 
                                    backgroundColor: s < step ? 'var(--primary)' : '#e9ecef',
                                    transition: 'background-color 0.4s ease'
                                }} 
                            />
                        </div>
                    )}
                </React.Fragment>
            ))}
        </div>
    );

    return (
        <div className="booking-page bg-light min-vh-100 py-5">
            <Container className="pt-5 mt-4 px-4 px-md-5" style={{ maxWidth: '1100px' }}>
                <div className="text-center mb-5">
                    <h1 className="fw-bold display-5">Book Your <span className="text-primary">Appointment</span></h1>
                    <p className="text-muted fs-5">Follow the simple steps to reserve your slot.</p>
                </div>

                {step <= 5 && renderStepIndicator()}

                <AnimatePresence mode="wait">
                    {/* STEP 1: Branch Selection */}
                            {step === 1 && (
                                <motion.div
                                    key="step1"
                                    initial={{ opacity: 0, x: 50 }}
                                    animate={{ opacity: 1, x: 0 }}
                                    exit={{ opacity: 0, x: -50 }}
                                    transition={{ duration: 0.3 }}
                                >
                            <h3 className="mb-4 text-center">1. Select Branch</h3>
                            <Row className="g-4">
                                        {branches.map(branch => (
                                            <Col md={4} key={branch.id}>
                                                <Card
                                                    className={`h-100 cursor-pointer transition-all border-0 shadow-sm ${bookingData.branch === branch.id ? 'ring-primary' : ''}`}
                                                    style={{ outline: bookingData.branch === branch.id ? '3px solid var(--primary)' : 'none', cursor: 'pointer' }}
                                                    onClick={() => handleSelect('branch', branch.id)}
                                                >
                                                    <Card.Body className="text-center p-4">
                                                        <FaMapMarkerAlt className="fs-1 text-primary mb-3" />
                                                        <Card.Title className="fw-bold">{branch.name}</Card.Title>
                                                        <Card.Text className="text-muted">{branch.address}</Card.Text>
                                                        <Badge bg="warning" text="dark" className="fs-6">★ {branch.rating}</Badge>
                                                    </Card.Body>
                                                </Card>
                                            </Col>
                                        ))}
                                    </Row>
                                    <div className="text-end mt-4">
                                        <Button
                                            className="btn-primary-custom px-5"
                                            onClick={nextStep}
                                            disabled={!bookingData.branch}
                                        >
                                            Next Step
                                        </Button>
                                    </div>
                                </motion.div>
                            )}

                            {/* STEP 2: Service Selection */}
                            {step === 2 && (
                                <motion.div
                                    key="step2"
                                    initial={{ opacity: 0, x: 50 }}
                                    animate={{ opacity: 1, x: 0 }}
                                    exit={{ opacity: 0, x: -50 }}
                                    transition={{ duration: 0.3 }}
                                >
                            <h3 className="mb-4 text-center">2. Select Service</h3>
                            <Row className="g-4">
                                        {services.map(service => (
                                            <Col md={6} key={service.id}>
                                                <div
                                                    onClick={() => handleSelect('service', service.id)}
                                                    style={{ outline: bookingData.service === service.id ? '3px solid var(--primary)' : 'none', borderRadius: '16px', cursor: 'pointer' }}
                                                >
                                                    <ServiceCard
                                                        {...service}
                                                        onBook={(e) => { e.stopPropagation(); handleSelect('service', service.id); }}
                                                    />
                                                </div>
                                            </Col>
                                        ))}
                                    </Row>
                                    <div className="d-flex justify-content-between mt-4">
                                        <Button variant="outline-secondary" className="px-4 fw-bold" onClick={prevStep}>Back</Button>
                                        <Button
                                            className="btn-primary-custom px-5"
                                            onClick={nextStep}
                                            disabled={!bookingData.service}
                                        >
                                            Next Step
                                        </Button>
                                    </div>
                                </motion.div>
                            )}

                            {/* STEP 3: Stylist Selection */}
                            {step === 3 && (
                                <motion.div
                                    key="step3"
                                    initial={{ opacity: 0, x: 50 }}
                                    animate={{ opacity: 1, x: 0 }}
                                    exit={{ opacity: 0, x: -50 }}
                                    transition={{ duration: 0.3 }}
                                >
                            <h3 className="mb-4 text-center">3. Select Stylist</h3>
                            <Row className="g-4 justify-content-center">
                                        {stylists.map(stylist => (
                                            <Col md={5} key={stylist.id}>
                                                <div
                                                    onClick={() => handleSelect('stylist', stylist.id)}
                                                    style={{ outline: bookingData.stylist === stylist.id ? '3px solid var(--primary)' : 'none', borderRadius: '16px', cursor: 'pointer' }}
                                                >
                                                    <StylistCard
                                                        {...stylist}
                                                        onSelect={(e) => { e.stopPropagation(); handleSelect('stylist', stylist.id); }}
                                                        onViewPortfolio={(e) => handleViewPortfolio(stylist, e)}
                                                    />
                                                </div>
                                            </Col>
                                        ))}
                                    </Row>
                                    <div className="d-flex justify-content-between mt-4">
                                        <Button variant="outline-secondary" className="px-4 fw-bold" onClick={prevStep}>Back</Button>
                                        <Button
                                            className="btn-primary-custom px-5"
                                            onClick={nextStep}
                                            disabled={!bookingData.stylist}
                                        >
                                            Next Step
                                        </Button>
                                    </div>
                                </motion.div>
                            )}

                            {/* STEP 4: Date & Time */}
                            {step === 4 && (
                                <motion.div
                                    key="step4"
                                    initial={{ opacity: 0, x: 50 }}
                                    animate={{ opacity: 1, x: 0 }}
                                    exit={{ opacity: 0, x: -50 }}
                                    transition={{ duration: 0.3 }}
                                >
                            <h3 className="mb-4 text-center">4. Select Date & Time</h3>
                            <Card className="border-0 shadow-sm p-4 rounded-4 bg-white">
                                        <Row className="g-5">
                                            <Col md={6}>
                                                <h5 className="fw-bold mb-3 d-flex align-items-center"><FaCalendarAlt className="text-primary me-2" /> Choose Date</h5>
                                                <Form.Control
                                                    type="date"
                                                    min={new Date().toISOString().split('T')[0]}
                                                    value={bookingData.date}
                                                    onChange={(e) => handleSelect('date', e.target.value)}
                                                    className="form-control-lg border-secondary bg-light"
                                                />
                                            </Col>
                                            <Col md={6}>
                                                <h5 className="fw-bold mb-3 d-flex align-items-center"><FaCut className="text-primary me-2" /> Available Slots</h5>
                                                <Row className="g-2">
                                                    {timeSlots.map(time => (
                                                        <Col xs={6} key={time}>
                                                            <Button
                                                                variant={bookingData.time === time ? 'primary' : 'outline-secondary'}
                                                                className={`w-100 fw-bold ${bookingData.time === time ? 'text-white' : ''}`}
                                                                onClick={() => handleSelect('time', time)}
                                                                disabled={!bookingData.date}
                                                            >
                                                                {time}
                                                            </Button>
                                                        </Col>
                                                    ))}
                                                </Row>
                                                {!bookingData.date && <p className="text-muted small mt-2">Please select a date first.</p>}
                                            </Col>
                                        </Row>
                                    </Card>
                                    <div className="d-flex justify-content-between mt-4">
                                        <Button variant="outline-secondary" className="px-4 fw-bold" onClick={prevStep}>Back</Button>
                                        <Button
                                            className="btn-primary-custom px-5"
                                            onClick={nextStep}
                                            disabled={!bookingData.date || !bookingData.time}
                                        >
                                            Next Step
                                        </Button>
                                    </div>
                                </motion.div>
                            )}

                            {/* STEP 5: Payment Summary */}
                            {step === 5 && (
                                <motion.div
                                    key="step5"
                                    initial={{ opacity: 0, x: 50 }}
                                    animate={{ opacity: 1, x: 0 }}
                                    exit={{ opacity: 0, x: -50 }}
                                    transition={{ duration: 0.3 }}
                                >
                            <h3 className="mb-4 text-center">5. Booking Summary & Payment</h3>
                            <Card className="border-0 shadow-sm rounded-4 bg-white overflow-hidden">
                                        <Row className="g-0">
                                            <Col md={6} className="bg-dark text-white p-5 d-flex flex-column justify-content-center">
                                                <h4 className="fw-bold text-warning mb-4">Summary</h4>
                                                <div className="mb-3">
                                                    <p className="text-white-50 mb-1 small">Service</p>
                                                    <p className="fs-5 fw-bold">{services.find(s => s.id === bookingData.service)?.title}</p>
                                                </div>
                                                <div className="mb-3">
                                                    <p className="text-white-50 mb-1 small">Stylist</p>
                                                    <p className="fs-5 fw-bold">{stylists.find(s => s.id === bookingData.stylist)?.name}</p>
                                                </div>
                                                <div className="mb-3">
                                                    <p className="text-white-50 mb-1 small">Date & Time</p>
                                                    <p className="fs-5 fw-bold">{bookingData.date} at {bookingData.time}</p>
                                                </div>
                                                <hr className="border-secondary" />
                                                <div className="d-flex justify-content-between align-items-center mt-3">
                                                    <span className="fs-5">Total Amount</span>
                                                    <span className="fs-3 fw-bold text-warning">₹{services.find(s => s.id === bookingData.service)?.price}</span>
                                                </div>
                                            </Col>
                                            <Col md={6} className="p-5 bg-white">
                                                <h4 className="fw-bold mb-4">Mock Payment Gateway</h4>
                                                
                                                <Alert variant="info" className="rounded-3 border-0 bg-opacity-10 py-3">
                                                    <small className="d-flex align-items-center mb-0">
                                                        <FaCreditCard className="me-2 fs-5" /> 
                                                        <div><strong>Test Mode:</strong> No real charges will be made. Feel free to use the dummy card details provided below.</div>
                                                    </small>
                                                </Alert>

                                                <Form>
                                                    <Form.Group className="mb-3">
                                                        <Form.Label className="small text-muted fw-bold">Card Number</Form.Label>
                                                        <Form.Control type="text" defaultValue="4242 4242 4242 4242" className="bg-light border-0 py-2 fw-semibold text-muted" readOnly />
                                                    </Form.Group>
                                                    <Row>
                                                        <Col xs={6}>
                                                            <Form.Group className="mb-3">
                                                                <Form.Label className="small text-muted fw-bold">Expiry Date</Form.Label>
                                                                <Form.Control type="text" defaultValue="12/30" className="bg-light border-0 py-2 fw-semibold text-muted" readOnly />
                                                            </Form.Group>
                                                        </Col>
                                                        <Col xs={6}>
                                                            <Form.Group className="mb-4">
                                                                <Form.Label className="small text-muted fw-bold">CVV</Form.Label>
                                                                <Form.Control type="text" defaultValue="123" className="bg-light border-0 py-2 fw-semibold text-muted" readOnly />
                                                            </Form.Group>
                                                        </Col>
                                                    </Row>
                                                    <Button
                                                        className="btn-primary-custom w-100 py-3 fs-5 fw-bold mt-2"
                                                        onClick={handlePayment}
                                                        disabled={bookingLoading}
                                                    >
                                                        {bookingLoading ? <Spinner animation="border" size="sm" /> : 'Simulate Payment & Confirm'}
                                                    </Button>
                                                    <p className="text-center text-muted small mt-3 mb-0"><FaCheckCircle className="text-success me-1" /> Mock 256-bit SSL encryption</p>
                                                </Form>
                                            </Col>
                                        </Row>
                                    </Card>
                                    <div className="mt-4">
                                        <Button variant="outline-secondary" className="px-4 fw-bold" onClick={prevStep}>Back to Details</Button>
                                    </div>
                                </motion.div>
                            )}

                            {/* SUCCESS STATE */}
                            {step === 6 && (
                                <motion.div
                                    key="step6"
                                    initial={{ opacity: 0, scale: 0.8 }}
                                    animate={{ opacity: 1, scale: 1 }}
                                    transition={{ duration: 0.5 }}
                                    className="text-center py-5"
                                >
                                    <motion.div
                                        initial={{ scale: 0 }}
                                        animate={{ scale: 1 }}
                                        transition={{ type: 'spring', stiffness: 200, delay: 0.2 }}
                                    >
                                        <FaCheckCircle className="text-success" style={{ fontSize: '100px' }} />
                                    </motion.div>
                                    <h1 className="fw-bold mt-4 mb-3">Booking Confirmed!</h1>
                                    <p className="lead text-muted mb-4">Thank you! Your appointment has been successfully booked.</p>
                                    <Card className="d-inline-block text-start p-4 shadow-sm border-0 bg-white rounded-4 mb-4">
                                        <p className="mb-2"><strong>Booking ID:</strong> #SLN-{bookingData.generatedId}</p>
                                        <p className="mb-2"><strong>Date:</strong> {bookingData.date}</p>
                                        <p className="mb-0"><strong>Time:</strong> {bookingData.time}</p>
                                    </Card>
                                    <div>
                                        <Button onClick={() => navigate('/dashboard/customer')} className="btn-primary-custom px-5 py-2 fw-bold">
                                            Go to Dashboard
                                        </Button>
                                    </div>
                                </motion.div>
                            )}
                        </AnimatePresence>
            </Container>

            <Modal show={showPortfolioModal} onHide={() => setShowPortfolioModal(false)} size="lg" centered>
                {selectedPortfolioStylist && (
                    <>
                        <Modal.Header closeButton className="border-0 pb-0">
                            <Modal.Title className="fw-bold h3">{selectedPortfolioStylist.name}'s Portfolio</Modal.Title>
                        </Modal.Header>
                        <Modal.Body className="pt-2">
                            <div className="d-flex align-items-center mb-4">
                                <Badge bg="warning" className="text-dark me-2">★ {selectedPortfolioStylist.rating}</Badge>
                                <span className="text-muted small fw-bold">{selectedPortfolioStylist.experience} Years Experience</span>
                            </div>
                            <Row className="g-3 mb-4">
                                {['/mens-haircut.png', '/womens-styling.png', '/beard-trim.png', '/spa-facial.png'].map((img, idx) => (
                                    <Col xs={6} md={3} key={idx}>
                                        <div className="ratio ratio-1x1 rounded-3 overflow-hidden border shadow-sm cursor-pointer">
                                            <img src={img} alt="Portfolio Work" className="w-100 h-100 transition-all hover-scale" style={{ objectFit: 'cover' }} />
                                        </div>
                                    </Col>
                                ))}
                            </Row>
                        </Modal.Body>
                        <Modal.Footer className="border-0 pt-0">
                            <Button variant="outline-secondary" onClick={() => setShowPortfolioModal(false)}>Cancel</Button>
                            <Button className="btn-primary-custom px-4" onClick={handleConfirmStylist}>Select Stylist & Continue</Button>
                        </Modal.Footer>
                    </>
                )}
            </Modal>
        </div>
    );
};

export default Booking;
