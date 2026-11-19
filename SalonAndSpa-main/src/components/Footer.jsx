import React from 'react';
import { Container, Row, Col } from 'react-bootstrap';
import { FaFacebookF, FaTwitter, FaInstagram, FaCut } from 'react-icons/fa';
import { Link } from 'react-router-dom';

const Footer = () => {
    return (
        <footer className="bg-black text-white pt-5 pb-3 mt-auto">
            <Container>
                <Row className="gy-4">
                    <Col md={4} className="mb-4">
                        <div className="d-flex align-items-center fw-bold fs-4 mb-3">
                            <FaCut className="me-2 text-warning" /> Salon<span className="text-warning">Studio</span>
                        </div>
                        <p className="text-white">
                            Experience the best hair and beauty services with our professional stylists. Book your appointment today and transform your look.
                        </p>
                        <div className="d-flex gap-3 mt-4">
                            <a href="#" className="text-white fs-5 hover-warning"><FaFacebookF /></a>
                            <a href="#" className="text-white fs-5 hover-warning"><FaTwitter /></a>
                            <a href="#" className="text-white fs-5 hover-warning"><FaInstagram /></a>
                        </div>
                    </Col>

                    <Col md={2} className="mb-4">
                        <h5 className="mb-3 text-warning">Quick Links</h5>
                        <ul className="list-unstyled">
                            <li className="mb-2"><Link to="/" className="text-decoration-none text-white hover-warning">Home</Link></li>
                            <li className="mb-2"><Link to="/booking" className="text-decoration-none text-white hover-warning">Book Now</Link></li>
                            <li className="mb-2"><Link to="/login" className="text-decoration-none text-white hover-warning">Login</Link></li>
                            <li className="mb-2"><Link to="/register" className="text-decoration-none text-white hover-warning">Register</Link></li>
                        </ul>
                    </Col>

                    <Col md={3} className="mb-4">
                        <h5 className="mb-3 text-warning">Services</h5>
                        <ul className="list-unstyled">
                            <li className="mb-2"><a href="#" className="text-decoration-none text-white hover-warning">Hair Styling</a></li>
                            <li className="mb-2"><a href="#" className="text-decoration-none text-white hover-warning">Makeup</a></li>
                            <li className="mb-2"><a href="#" className="text-decoration-none text-white hover-warning">Spa & Massage</a></li>
                            <li className="mb-2"><a href="#" className="text-decoration-none text-white hover-warning">Nail Art</a></li>
                        </ul>
                    </Col>

                    <Col md={3} className="mb-4">
                        <h5 className="mb-3 text-warning">Contact Us</h5>
                        <ul className="list-unstyled text-white">
                            <li className="mb-2">123 Fashion Street, NY 10001</li>
                            <li className="mb-2">Phone: +1 234 567 8900</li>
                            <li className="mb-2">Email: info@salonstudio.com</li>
                        </ul>
                    </Col>
                </Row>

                <hr className="border-secondary mt-4 mb-3" />

                <Row>
                    <Col className="text-center text-white">
                        <p className="mb-0">&copy; {new Date().getFullYear()} SalonStudio. All rights reserved.</p>
                    </Col>
                </Row>
            </Container>
        </footer>
    );
};

export default Footer;
