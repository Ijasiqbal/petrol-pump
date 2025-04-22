import Container from 'react-bootstrap/Container';
import Nav from 'react-bootstrap/Nav';
import Navbar from 'react-bootstrap/Navbar';
import './Navbar.css';
import { UseReadingcontext } from '../../Readingcontext';
import {  useLocation } from 'react-router-dom';

function BasicExample() {
  const {api} = UseReadingcontext()

  const location = useLocation();

  const isHomePage = location.pathname.startsWith('/home');
  return (
    <Navbar expand="lg" className="bg-danger navbar-dark p-3">
      <Container>
        <Navbar.Brand href="home" className='fw-bold costom'>Nifi Fuels</Navbar.Brand>
        <Navbar.Toggle  aria-controls="basic-navbar-nav" />
        <Navbar.Collapse id="basic-navbar-nav">
          <Nav className="ml-auto" id='navcomponent'>
          <a href={api+"/admin/"} className="nav-link" target="_blank" rel="noopener noreferrer">Admin</a>
            {isHomePage ? (
              <Nav.Link href="#logout" onClick={
                () => {
                  localStorage.removeItem('auth_token');
                  window.location.reload();
                }
              
              }>Logout</Nav.Link>
            ) : (
              <div></div>
            )}
          </Nav>
        </Navbar.Collapse>
      </Container>
    </Navbar>
  );
}

export default BasicExample;