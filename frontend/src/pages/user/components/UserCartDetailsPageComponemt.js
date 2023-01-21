import {
  Container,
  Row,
  Col,
  Form,
  Alert,
  ListGroup,
  Button,
} from 'react-bootstrap';
import CartItemComponent from '../../../components/CartItemComponent';
import { useState } from 'react';

const UserCartDetailsPageComponent = ({
  cartItems,
  itemsCount,
  cartSubtotal,
  addToCartHandler,
  removeFromCartHandler,
}) => {
  const [paymentMethod, setPaymentMethod] = useState('pp');

  const choosePayment = (e) => {
    setPaymentMethod(e.target.value);
  };

  console.log('In User cart Details:', cartItems);
  return (
    <Container fluid>
      <Row className='mt-4'>
        <h1>User Cart Details</h1>
        <Col md={8}>
          <br />
          <Row>
            <Col md={6}>
              <h2>Shipping</h2>
              <b>Name</b>: John Doe <br />
              <b>Address</b>: 8739 Mayflower St. Los Angeles, CA 90063 <br />
              <b>Phone</b>: 888 777 666
            </Col>
            <Col md={6}>
              <h2>Payment method</h2>
              <Form.Select onChange={choosePayment}>
                <option value='pp'>PayPal</option>
                <option value='cod'>
                  Cash On Delivery (delivery may be delayed)
                </option>
              </Form.Select>
            </Col>
            <Row>
              <Col>
                <Alert className='mt-3' variant='danger'>
                  Not delivered. In order to make order, fill out your profile
                  with correct address, city etc.
                </Alert>
              </Col>
              <Col>
                <Alert className='mt-3' variant='success'>
                  Not paid yet
                </Alert>
              </Col>
            </Row>
          </Row>
          <br />
          <h2>Order items</h2>
          <ListGroup variant='flush'>
            {cartItems.map((item, idx) => (
              <CartItemComponent
                item={item}
                key={idx}
                addToCartHandler={addToCartHandler}
                removeFromCartHandler={removeFromCartHandler}
              />
            ))}
          </ListGroup>
        </Col>
        <Col md={4}>
          <ListGroup>
            <ListGroup.Item>
              <h3>Order summary</h3>
            </ListGroup.Item>
            <ListGroup.Item>
              Items price (after tax):{' '}
              <span className='fw-bold'>&#8377;{cartSubtotal}</span>
            </ListGroup.Item>
            <ListGroup.Item>
              Shipping: <span className='fw-bold'>included</span>
            </ListGroup.Item>
            <ListGroup.Item>
              Tax: <span className='fw-bold'>included</span>
            </ListGroup.Item>
            <ListGroup.Item className='text-danger'>
              Total price:{' '}
              <span className='fw-bold'>&#8377;{cartSubtotal}</span>
            </ListGroup.Item>
            <ListGroup.Item>
              <div className='d-grid gap-2'>
                <Button size='lg' variant='danger' type='button'>
                  Pay for the order
                </Button>
              </div>
            </ListGroup.Item>
          </ListGroup>
        </Col>
      </Row>
    </Container>
  );
};

export default UserCartDetailsPageComponent;
