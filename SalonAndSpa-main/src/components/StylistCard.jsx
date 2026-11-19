import React from 'react';
import { Card, Badge, Button } from 'react-bootstrap';
import { motion } from 'framer-motion';
import { FaStar } from 'react-icons/fa';

const StylistCard = ({ name, experience, rating, image, specialties, onSelect, onViewPortfolio }) => {
    return (
        <motion.div
            whileHover={{ y: -10 }}
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.4 }}
            className="h-100"
        >
            <Card className="glass-card shadow border-0 text-center h-100 pt-4">
                <div className="mx-auto rounded-circle overflow-hidden shadow-sm mb-3" style={{ width: '120px', height: '120px', border: '4px solid var(--white)' }}>
                    <img src={image} alt={name} className="w-100 h-100" style={{ objectFit: 'cover' }} />
                </div>
                <Card.Body className="d-flex flex-column">
                    <Card.Title className="fw-bold fs-5 mb-1">{name}</Card.Title>
                    <div className="mb-2 text-warning d-flex justify-content-center align-items-center">
                        <FaStar className="me-1" />
                        <span className="text-dark fw-bold">{rating}</span>
                    </div>
                    <Card.Text className="text-muted small mb-3">
                        {experience} Years Experience
                    </Card.Text>
                    <div className="mb-4">
                        {specialties?.map((spec, index) => (
                            <Badge bg="light" text="dark" className="me-1 mb-1 border border-secondary" key={index}>
                                {spec}
                            </Badge>
                        ))}
                    </div>
                    <div className="mt-auto d-flex flex-column gap-2">
                        {onViewPortfolio && (
                            <Button variant="outline-primary" className="w-100 fw-bold shadow-sm" onClick={onViewPortfolio}>
                                View Portfolio
                            </Button>
                        )}
                        {onSelect && (
                            <Button className="btn-secondary-custom w-100" onClick={onSelect}>
                                Select Stylist
                            </Button>
                        )}
                    </div>
                </Card.Body>
            </Card>
        </motion.div>
    );
};

export default StylistCard;
