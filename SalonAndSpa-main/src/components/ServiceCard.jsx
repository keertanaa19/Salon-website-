import React from 'react';
import { Card, Button } from 'react-bootstrap';
import { motion } from 'framer-motion';

const ServiceCard = ({ title, description, price, duration, image, onBook }) => {
    return (
        <motion.div
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3 }}
            className="h-100"
        >
            <Card className="glass-card h-100 border-0 overflow-hidden shadow-sm">
                {image && (
                    <div className="overflow-hidden" style={{ height: '200px' }}>
                        <Card.Img variant="top" src={image} style={{ objectFit: 'cover', height: '100%' }} />
                    </div>
                )}
                <Card.Body className="d-flex flex-column">
                    <Card.Title className="fw-bold fs-4 mb-2">{title}</Card.Title>
                    <Card.Text className="text-muted flex-grow-1">
                        {description}
                    </Card.Text>
                    <div className="d-flex justify-content-between align-items-center mt-3 mb-3">
                        <span className="fw-bold fs-5 text-primary">₹{price}</span>
                        <span className="text-secondary fw-semibold"><i className="bi bi-clock"></i> {duration}</span>
                    </div>
                    <Button className="btn-primary-custom w-100 mt-auto" onClick={onBook}>
                        Book Now
                    </Button>
                </Card.Body>
            </Card>
        </motion.div>
    );
};

export default ServiceCard;
