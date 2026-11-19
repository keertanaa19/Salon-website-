import React, { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Container, Nav, Navbar as BootstrapNavbar, NavDropdown } from 'react-bootstrap';
import { FaCut } from 'react-icons/fa';

const Navbar = () => {
    const [scrolled, setScrolled] = useState(false);
    const location = useLocation();

    useEffect(() => {
        const handleScroll = () => {
            if (window.scrollY > 50) {
                setScrolled(true);
            } else {
                setScrolled(false);
            }
        };

        window.addEventListener('scroll', handleScroll);
        return () => window.removeEventListener('scroll', handleScroll);
    }, []);

    const isHomePage = location.pathname === '/';

    // Choose navbar style based on route and scroll
    const navClass = `fixed-top transition-all ${scrolled || !isHomePage ? 'bg-black shadow-sm' : 'bg-transparent'
        }`;

    return (
        <BootstrapNavbar
            expand="lg"
            className={navClass}
            variant="dark"
            style={{ padding: scrolled ? '10px 0' : '20px 0', transition: 'all 0.3s ease-in-out' }}
        >
            <Container>
                <BootstrapNavbar.Brand as={Link} to="/" className="d-flex align-items-center fw-bold text-white fs-4">
                    <FaCut className="me-2 text-warning" /> Salon<span className="text-warning">Studio</span>
                </BootstrapNavbar.Brand>
                <BootstrapNavbar.Toggle aria-controls="basic-navbar-nav" />
                <BootstrapNavbar.Collapse id="basic-navbar-nav">
                    <Nav className="ms-auto align-items-center">
                        <Nav.Link as={Link} to="/" className="text-white mx-2">Home</Nav.Link>
                        <Nav.Link as={Link} to="/booking" className="text-white mx-2">Services</Nav.Link>

                        <NavDropdown title={<span className="text-white">Login</span>} id="basic-nav-dropdown" className="mx-2" menuVariant="dark">
                            <NavDropdown.Item as={Link} to="/login?role=customer">Customer Login</NavDropdown.Item>
                            <NavDropdown.Divider />
                            <NavDropdown.Item as={Link} to="/login?role=stylist">Stylist/Staff Login</NavDropdown.Item>
                            <NavDropdown.Item as={Link} to="/login?role=admin">Admin Login</NavDropdown.Item>
                            <NavDropdown.Item as={Link} to="/login?role=owner">Owner Login</NavDropdown.Item>
                        </NavDropdown>

                        <Nav.Link as={Link} to="/register" className="text-white mx-2">Register</Nav.Link>

                        <Link to="/booking" className="btn btn-secondary-custom ms-lg-3 mt-3 mt-lg-0">
                            Book Now
                        </Link>
                    </Nav>
                </BootstrapNavbar.Collapse>
            </Container>
        </BootstrapNavbar>
    );
};

export default Navbar;
