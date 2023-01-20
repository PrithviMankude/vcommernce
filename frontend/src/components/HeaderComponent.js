import React from 'react';
import {
  Nav,
  Navbar,
  NavDropdown,
  Container,
  Form,
  Dropdown,
  DropdownButton,
  Button,
  InputGroup,
} from 'react-bootstrap';
import Badge from 'react-bootstrap/Badge';

import { LinkContainer } from 'react-router-bootstrap';
import { Link } from 'react-router-dom';

import { useDispatch, useSelector } from 'react-redux';
import { logoutUser } from '../redux/actions/userActions';

const HeaderComponent = () => {
  return <>{CollapsibleExample()}</>;
};

function CollapsibleExample() {
  const dispatch = useDispatch();
  const { userInfo } = useSelector((state) => state.user);
  const itemsCount = useSelector((state) => state.cart.itemsCount);

  return (
    <Navbar collapseOnSelect expand='lg' bg='dark' variant='dark'>
      <Container>
        <LinkContainer to='/'>
          <Navbar.Brand href='/'>Amazing Online Shop</Navbar.Brand>
        </LinkContainer>
        <Navbar.Toggle aria-controls='responsive-navbar-nav' />
        <Navbar.Collapse id='responsive-navbar-nav'>
          <Nav className='me-auto'>
            <InputGroup>
              {BasicButtonExample()}
              <Form.Control type='text' placeholder='Search...' />
              <Button variant='warning'>
                <i className='bi bi-search'></i>
              </Button>
            </InputGroup>
          </Nav>

          <Nav>
            {userInfo.isAdmin ? (
              <LinkContainer to='/admin/orders'>
                <Nav.Link>
                  Admin
                  <span
                    className='position-absolute top-1 stat-10 translate-middle
                  p-2 bg-danger border border-light rounded-circle'
                  ></span>
                </Nav.Link>
              </LinkContainer>
            ) : userInfo.name && !userInfo.isAdmin ? (
              <NavDropdown
                title={
                  <>
                    {userInfo.name} {'  '} {userInfo.lastName}
                  </>
                }
                id='collasible-nav-dropdown'
              >
                <NavDropdown.Item
                  as={Link}
                  eventKey='/user/my-orders'
                  to='/user/my-orders'
                >
                  My Orders
                </NavDropdown.Item>
                <NavDropdown.Item as={Link} eventKey='/user' to='/user'>
                  My Profile
                </NavDropdown.Item>
                <NavDropdown.Item onClick={() => dispatch(logoutUser())}>
                  Logout
                </NavDropdown.Item>
              </NavDropdown>
            ) : (
              <>
                <LinkContainer to='/login'>
                  <Nav.Link>Login</Nav.Link>
                </LinkContainer>
                <LinkContainer to='/register'>
                  <Nav.Link>Register</Nav.Link>
                </LinkContainer>
              </>
            )}

            <LinkContainer to='/cart'>
              <Nav.Link>
                <Badge pill bg='danger'>
                  {itemsCount === 0 ? '' : itemsCount}
                </Badge>
                <i className='bi bi-cart-dash'></i>
                <span className='ms-1'>CART</span>
              </Nav.Link>
            </LinkContainer>
          </Nav>
        </Navbar.Collapse>
      </Container>
    </Navbar>
  );
}

function BasicButtonExample() {
  return (
    <DropdownButton id='dropdown-basic-button' title='All'>
      <Dropdown.Item>Electronics</Dropdown.Item>
      <Dropdown.Item>Mobiles</Dropdown.Item>
      <Dropdown.Item>Books</Dropdown.Item>
      <Dropdown.Item>Toys</Dropdown.Item>
      <Dropdown.Item>Fashion</Dropdown.Item>
      <Dropdown.Item>Grocery</Dropdown.Item>
      <Dropdown.Item>Health</Dropdown.Item>
    </DropdownButton>
  );
}

//export default BasicButtonExample;

export default HeaderComponent;
