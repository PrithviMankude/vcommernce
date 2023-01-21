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
import { useState, useEffect } from 'react';

const UserCartDetailsPageComponent = ({
  cartItems,
  itemsCount,
  cartSubtotal,
  addToCartHandler,
  removeFromCartHandler,
  userInfo,
  getUser,
  createOrder,
}) => {
  const [paymentMethod, setPaymentMethod] = useState('pp');
  const [buttonDisabled, setButtonDisabled] = useState(false);
  const [userAddress, setUserAddress] = useState({});
  const [missingAddress, setMissingAddress] = useState('');

  useEffect(() => {
    getUser()
      .then((data) => {
        if (
          !data.address ||
          !data.city ||
          !data.country ||
          !data.zipCode ||
          !data.state ||
          !data.phoneNumber
        ) {
          setButtonDisabled(true);
          setMissingAddress(
            'Products cannot be delivered. In order to fulfil the order Please update your profile with correct address, city etc '
          );
        } else {
          setUserAddress({
            address: data.address,
            city: data.city,
            country: data.county,
            zipCode: data.zipCode,
            state: data.state,
            phoneNumber: data.phoneNumber,
          });
          setMissingAddress(false);
        }
      })
      .catch((err) =>
        console.log(
          'User Profile fields missing, cant deliver the order.Pl update your profile',
          err.response.data
        )
      );
  }, [userInfo._id]);

  const orderHandler = () => {
    const orderData = {
      orderTotal: {
        itemsCount: itemsCount,
        cartSubtotal: cartSubtotal,
      },
      cartItems: cartItems.map((item) => {
        return {
          productID: item.productID,
          name: item.name,
          price: item.price,
          image: { path: item.image ? item.image.path ?? null : null },
          quantity: item.quantity,
          count: item.count,
        };
      }),
      paymentMethod: paymentMethod,
    };

    createOrder(orderData);
  };

  const choosePayment = (e) => {
    setPaymentMethod(e.target.value);
  };

  return (
    <Container fluid>
      <Row className='mt-4'>
        <h1>User Cart Details</h1>
        <Col md={8}>
          <br />
          <Row>
            <Col md={6}>
              <h2>Shipping</h2>
              <b>Name </b>: {userInfo.name} {userInfo.lastName} <br />
              <b>Address</b>: {userAddress.address} {userAddress.city}{' '}
              {userAddress.state} {userAddress.country} {userAddress.zipCode}
              <br />
              <b>Phone</b>: {userAddress.phoneNumber}
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
                {
                  <Alert className='mt-3' variant='danger'>
                    Not Delivered{missingAddress}
                  </Alert>
                }
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
                <Button
                  size='lg'
                  variant='danger'
                  type='button'
                  disabled={buttonDisabled}
                  onClick={orderHandler}
                >
                  Place Order
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
