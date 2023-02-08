import React, { useEffect, useState } from 'react';
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
import { Link, useNavigate } from 'react-router-dom';

import { useDispatch, useSelector } from 'react-redux';
import { logoutUser } from '../redux/actions/userActions';
import { getCategories } from '../redux/actions/categoriesActions';

const HeaderComponent = () => {
  return <>{CollapsibleExample()}</>;
};

function CollapsibleExample() {
  const dispatch = useDispatch();

  useEffect(() => {
    dispatch(getCategories());
  }, []);

  const { userInfo } = useSelector((state) => state.user);
  const itemsCount = useSelector((state) => state.cart.itemsCount);
  const { categories } = useSelector((state) => state.category);

  const navigate = useNavigate();

  const [searchCategoryToggle, setSearchCategoryToggle] =
    useState('All Categories');
  const [searchQuery, setSearchQuery] = useState('');

  const submitHandler = (e) => {
    if (e.keyCode && e.keyCode !== 13) return;
    e.preventDefault();
    if (searchQuery.trim()) {
      //Category is selected
      if (searchCategoryToggle === 'All Categories') {
        navigate(`/product-list/search/${searchQuery}`);
      } else {
        navigate(
          `/product-list/category/${searchCategoryToggle.replaceAll(
            '/',
            ','
          )}/search/${searchQuery}`
        );
      }
    } else if (searchCategoryToggle !== 'All Categories') {
      //Search query is empty but a category selected
      navigate(
        `/product-list/category/${searchCategoryToggle.replaceAll('/', ',')}`
      );
    } else {
      navigate('/product-list');
    }
  };

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
              <DropdownButton
                id='dropdown-basic-button'
                title={searchCategoryToggle}
              >
                <Dropdown.Item
                  onClick={() => setSearchCategoryToggle('All Categories')}
                >
                  All Categories
                </Dropdown.Item>

                {categories.map((category, id) => (
                  <Dropdown.Item
                    key={id}
                    onClick={() => setSearchCategoryToggle(category.name)}
                  >
                    {category.name}
                  </Dropdown.Item>
                ))}
              </DropdownButton>
              <Form.Control
                onKeyUp={submitHandler}
                onChange={(e) => setSearchQuery(e.target.value)}
                type='text'
                placeholder='Search...'
              />
              <Button onClick={submitHandler} variant='warning'>
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

export default HeaderComponent;
