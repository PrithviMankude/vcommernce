import { Container, Row, Col, Alert, ListGroup, Button } from 'react-bootstrap';
import { LinkContainer } from 'react-router-bootstrap';
import CartItemComponent from '../../components/CartItemComponent';

const CartPageComponent = ({ dispatchToCart, cartItems, cartSubtotal }) => {
  const changeCount = (productID, count) => {
    dispatchToCart({ productID, count });
  };

  return (
    <Container fluid>
      <Row className='mt-4'>
        <Col md={8}>
          <h1>Shopping Cart</h1>
          {cartItems.length === 0 ? (
            <Alert variant='info'>Your cart is empty</Alert>
          ) : (
            <ListGroup variant='flush'>
              {cartItems.map((item, idx) => (
                <CartItemComponent
                  key={idx}
                  item={item}
                  changeCount={changeCount}
                />
              ))}
            </ListGroup>
          )}
        </Col>
        <Col md={4}>
          <ListGroup>
            <ListGroup.Item>
              <h3>
                Subtotal ({cartItems.length}{' '}
                {cartItems.length === 1 ? 'Product' : 'Products'})
              </h3>
            </ListGroup.Item>
            <ListGroup.Item>
              Price: <span className='fw-bold'>&#8377;{cartSubtotal}</span>
            </ListGroup.Item>
            <ListGroup.Item>
              <LinkContainer to='/user/order-details'>
                <Button type='button' disabled={cartItems.length === 0}>
                  Proceed To Checkout
                </Button>
              </LinkContainer>
            </ListGroup.Item>
          </ListGroup>
        </Col>
      </Row>
    </Container>
  );
};

export default CartPageComponent;
