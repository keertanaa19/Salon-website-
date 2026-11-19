import React from 'react';
import { Container, Row, Col, Button } from 'react-bootstrap';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import ServiceCard from '../components/ServiceCard';
import StylistCard from '../components/StylistCard';

const Home = () => {
    // Mock Data
    const services = [
        { id: 1, title: 'Men\'s Haircut', description: 'Classic and modern styles tailored for you.', price: 350, duration: '45 Min', image: '/mens-haircut.png' },
        { id: 2, title: 'Women\'s Styling', description: 'Complete hair styling, cutting and coloring.', price: 1000, duration: '90 Min', image: '/womens-styling.png' },
        { id: 3, title: 'Beard Trimming', description: 'Professional beard grooming and styling.', price: 850, duration: '30 Min', image: '/beard-trim.png' },
        { id: 4, title: 'Spa & Facial', description: 'Relaxing spa treatments and revitalizing facials.', price: 2000, duration: '120 Min', image: '/spa-facial.png' }
    ];

    const stylists = [
        { id: 1, name: 'Elena Rodriguez', experience: 8, rating: 4.9, image: 'https://ui-avatars.com/api/?name=Elena+Rodriguez&background=1a1a1a&color=d4af37&size=400', specialties: ['Coloring', 'Extensions'] },
        { id: 2, name: 'Marcus Johnson', experience: 12, rating: 5.0, image: 'https://ui-avatars.com/api/?name=Marcus+Johnson&background=1a1a1a&color=d4af37&size=400', specialties: ['Men\'s Cuts', 'Fades'] },
        { id: 3, name: 'Sophia Chen', experience: 5, rating: 4.8, image: 'https://ui-avatars.com/api/?name=Sophia+Chen&background=1a1a1a&color=d4af37&size=400', specialties: ['Bridal', 'Makeup'] }
    ];

    const reviews = [
        { id: 1, name: 'Sarah T.', text: 'Absolutely amazing experience. Elena transformed my hair completely!', rating: 5 },
        { id: 2, name: 'David M.', text: 'Best fade in the city. Marcus pays great attention to detail.', rating: 5 },
        { id: 3, name: 'Jessica K.', text: 'Very relaxing spa day. Highly recommend their facial treatments.', rating: 4 }
    ];

    return (
        <div className="home-page pb-5">
            {/* Hero Section */}
            <section className="hero-section position-relative vh-100 d-flex align-items-center overflow-hidden">
                {/* Animated Background */}
                <motion.div
                    className="position-absolute top-0 start-0 w-100 h-100"
                    style={{
                        backgroundImage: 'url("/hero-bg.png")',
                        backgroundSize: 'cover',
                        backgroundPosition: 'center',
                    }}
                    animate={{ scale: [1, 1.1, 1] }}
                    transition={{ duration: 25, ease: "linear", repeat: Infinity }}
                />

                {/* Dark overlay */}
                <div className="position-absolute top-0 start-0 w-100 h-100 bg-black" style={{ opacity: 0.6, zIndex: 1 }}></div>

                <Container className="position-relative text-white mt-5" style={{ zIndex: 2 }}>
                    <Row>
                        <Col lg={8}>
                            <motion.div
                                initial={{ opacity: 0, x: -50 }}
                                animate={{ opacity: 1, x: 0 }}
                                transition={{ duration: 0.8 }}
                            >
                                <h1 className="display-2 fw-bold mb-4 text-white">Elevate Your<br /><span className="text-warning">Style & Beauty</span></h1>
                                <p className="lead mb-5 opacity-75 fs-4" style={{ maxWidth: '600px' }}>
                                    Experience luxury grooming and self-care in a modern, relaxing environment tailored just for you.
                                </p>
                                <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }} className="d-inline-block">
                                    <Link to="/login" className="btn btn-warning btn-lg px-5 py-3 fw-bold rounded-pill text-dark text-decoration-none shadow-lg">
                                        Book Appointment
                                    </Link>
                                </motion.div>
                                <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }} className="d-inline-block ms-3">
                                    <a href="#services" className="btn btn-outline-light btn-lg px-5 py-3 fw-bold rounded-pill text-decoration-none transition-all">
                                        Our Services
                                    </a>
                                </motion.div>
                            </motion.div>
                        </Col>
                    </Row>
                </Container>
            </section>

            {/* Services Section */}
            <section id="services" className="py-5 mt-5">
                <Container>
                    <div className="text-center mb-5">
                        <motion.h2
                            initial={{ opacity: 0, y: 20 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true }}
                            className="display-5 fw-bold mb-3"
                        >
                            Premium <span className="text-primary">Services</span>
                        </motion.h2>
                        <p className="text-muted fs-5">Tailored treatments to bring out your best look</p>
                    </div>

                    <Row className="g-4">
                        {services.map((service, index) => (
                            <Col lg={3} md={6} key={service.id}>
                                <motion.div
                                    initial={{ opacity: 0, y: 30 }}
                                    whileInView={{ opacity: 1, y: 0 }}
                                    viewport={{ once: true }}
                                    transition={{ delay: index * 0.1 }}
                                    className="h-100"
                                >
                                    <ServiceCard {...service} />
                                </motion.div>
                            </Col>
                        ))}
                    </Row>

                    <div className="text-center mt-5">
                        <Link to="/booking" className="btn btn-outline-primary px-4 py-2 rounded-pill fw-bold">
                            View All Services
                        </Link>
                    </div>
                </Container>
            </section>

            {/* Stylists Section */}
            <section className="py-5 bg-black text-white mt-5">
                <Container className="py-4">
                    <div className="text-center mb-5">
                        <motion.h2
                            initial={{ opacity: 0, y: 20 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true }}
                            className="display-5 fw-bold mb-3 text-white"
                        >
                            Meet Our <span className="text-warning">Stylists</span>
                        </motion.h2>
                        <p className="text-white-50 fs-5">Experts dedicated to perfecting your style</p>
                    </div>

                    <Row className="g-4 justify-content-center">
                        {stylists.map((stylist, index) => (
                            <Col lg={4} md={6} key={stylist.id}>
                                <motion.div
                                    initial={{ opacity: 0, scale: 0.9 }}
                                    whileInView={{ opacity: 1, scale: 1 }}
                                    viewport={{ once: true }}
                                    transition={{ delay: index * 0.2 }}
                                    className="h-100"
                                >
                                    <StylistCard {...stylist} />
                                </motion.div>
                            </Col>
                        ))}
                    </Row>
                </Container>
            </section>

            {/* Reviews Section */}
            <section className="py-5 mt-5 mb-5">
                <Container>
                    <div className="text-center mb-5">
                        <h2 className="display-5 fw-bold mb-3">Happy <span className="text-primary">Clients</span></h2>
                        <p className="text-muted fs-5">Don't just take our word for it</p>
                    </div>

                    <Row className="g-4">
                        {reviews.map((review, index) => (
                            <Col md={4} key={review.id}>
                                <motion.div
                                    initial={{ opacity: 0, y: 20 }}
                                    whileInView={{ opacity: 1, y: 0 }}
                                    viewport={{ once: true }}
                                    transition={{ delay: index * 0.15 }}
                                    className="p-4 rounded-4 bg-white shadow-sm border border-light h-100 position-relative"
                                >
                                    <div className="text-warning mb-3 fs-5">
                                        {'★'.repeat(review.rating)}{'☆'.repeat(5 - review.rating)}
                                    </div>
                                    <p className="fst-italic text-muted mb-4">"{review.text}"</p>
                                    <div className="fw-bold mt-auto border-top pt-3 text-dark">- {review.name}</div>
                                </motion.div>
                            </Col>
                        ))}
                    </Row>
                </Container>
            </section>
        </div>
    );
};

export default Home;
