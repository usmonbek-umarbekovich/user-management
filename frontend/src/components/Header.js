import { Link } from 'react-router-dom';
import { useUserInfo } from '../contexts/userInfoContext';
import Container from 'react-bootstrap/Container';
import Navbar from 'react-bootstrap/Navbar';
import Nav from 'react-bootstrap/Nav';
import Button from 'react-bootstrap/Button';
import { FaSignInAlt, FaSignOutAlt, FaUser } from 'react-icons/fa';

function Header() {
  const { user, logoutUser } = useUserInfo();

  return (
    <header style={{ marginTop: '78px' }}>
      <Navbar
        collapseOnSelect
        fixed="top"
        bg="dark"
        variant="dark"
        expand="sm"
        className="py-3">
        <Container>
          <Navbar.Brand as={Link} to="/" className="me-auto fs-4">
            User Management
          </Navbar.Brand>
          <Navbar.Toggle aria-controls="navbar" />
          <Navbar.Collapse id="navbar">
            <Nav as="ul" className="ms-auto">
              {user ? (
                <Nav.Item as="li">
                  <Nav.Link
                    eventKey="logout"
                    as={Button}
                    variant="danger"
                    className="text-light px-3"
                    onClick={logoutUser}>
                    <FaSignOutAlt /> Logout
                  </Nav.Link>
                </Nav.Item>
              ) : (
                <>
                  <Nav.Item as="li" className="me-2">
                    <Nav.Link eventKey="login" as={Link} to="/login">
                      <FaSignInAlt /> Login
                    </Nav.Link>
                  </Nav.Item>
                  <Nav.Item as="li">
                    <Nav.Link eventKey="signup" as={Link} to="/register">
                      <FaUser /> Sign Up
                    </Nav.Link>
                  </Nav.Item>
                </>
              )}
            </Nav>
          </Navbar.Collapse>
        </Container>
      </Navbar>
    </header>
  );
}
export default Header;
