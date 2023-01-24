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
import { useState, useEffect, useRef } from 'react';
import { useParams } from 'react-router-dom';

const UserOrderDetailsPageComponent = ({
  userInfo,
  getUser,
  getOrder,
  loadPaypalScript,
  stripeCheckOut,
}) => {
  //This step is for order which is placed, so user can only view it and not edit
  const [userAddress, setUserAddress] = useState({});
  const [paymentMethod, setPaymentMethod] = useState('');
  const [isPaid, setIsPaid] = useState(false);
  const [orderButtonMessage, setOrderButtonMessage] = useState('');
  const [cartItems, setCartItems] = useState([]);
  const [cartSubtotal, setCartSubtotal] = useState(0);
  const [isDelivered, setIsDelivered] = useState(false);
  const [buttonDisabled, setButtonDisabled] = useState(false);
  const [showPayByCardButton, setShowPayByCardButton] = useState(false);

  const { id } = useParams();
  const paypalContainer = useRef();
  console.log('Fetching the Id', id);

  useEffect(() => {
    getUser()
      .then((data) => {
        setUserAddress({
          address: data.address,
          city: data.city,
          country: data.county,
          zipCode: data.zipCode,
          state: data.state,
          phoneNumber: data.phoneNumber,
        });
      })
      .catch((err) => console.log(err.response.data));
  }, []);

  useEffect(() => {
    getOrder(id)
      .then((data) => {
        setPaymentMethod(data.paymentMethod);
        setCartItems(data.cartItems);
        setCartSubtotal(data.orderTotal.cartSubtotal);
        data.isDelivered
          ? setIsDelivered(data.deliveredAt)
          : setIsDelivered(false);
        data.isPaid ? setIsPaid(data.paidAt) : setIsPaid(false);
        if (data.isPaid) {
          setOrderButtonMessage('Yor order is finished');
          setButtonDisabled(true);
        } else {
          if (data.paymentMethod === 'pp') {
            setOrderButtonMessage('Pay for your order');
          } else if (data.paymentMethod === 'cod') {
            setButtonDisabled(true);
            setOrderButtonMessage(
              'Please wait for your order to be delivered and pay on delivery'
            );
          }
        }
      })

      .catch((err) => console.log(err));
  }, []);

  //Preparing for order if customer chooses Online payment
  const orderHandler = () => {
    console.log('Order handler called');
    setButtonDisabled(true);
    if (paymentMethod === 'pp') {
      setOrderButtonMessage(
        'Please continue to pay by clicking the below buttons'
      );
      if (!isPaid) {
        //loadPaypalScript(cartSubtotal, cartItems);
        //stripeCheckOut(cartSubtotal, cartItems);
        setShowPayByCardButton(true);
      }
    } else {
      setOrderButtonMessage(
        'Your order was placed successfully and will be processed. Thank You'
      );
    }
  };

  const updateStateAfterOrder = (paidAt) => {
    setOrderButtonMessage('Thank you for your payment');
    setIsPaid(paidAt);
    setButtonDisabled(true);
    setShowPayByCardButton(false);
  };

  return (
    <Container fluid>
      <Row className='mt-4'>
        <h1>Order Details</h1>
        <Col md={8}>
          <br />
          <Row>
            <Col md={6}>
              <h2>Shipping</h2>
              <b>Name</b>: {userInfo.name} {userInfo.lastName} <br />
              <b>Address</b>: {userAddress.address} {userAddress.city}{' '}
              {userAddress.state} {userAddress.country} {userAddress.zipCode}{' '}
              <br />
              <b>Phone</b>: {userAddress.phoneNumber}
            </Col>
            <Col md={6}>
              <h2>Payment method</h2>
              <Form.Select
                disabled={true}
                value={paymentMethod}
                onChange={(e) => setPaymentMethod(e.target.value)}
              >
                <option value='pp'>PayPal</option>
                <option value='cod'>
                  Cash On Delivery (delivery may be delayed)
                </option>
              </Form.Select>
            </Col>
            <Row>
              <Col>
                <Alert
                  className='mt-3'
                  variant={isDelivered ? 'success' : 'danger'}
                >
                  {isDelivered ? (
                    <>Delivered at {isDelivered}</>
                  ) : (
                    <>Not Delivered</>
                  )}
                </Alert>
              </Col>
              <Col>
                <Alert className='mt-3' variant={isPaid ? 'success' : 'danger'}>
                  {isPaid ? <>Paid on {isPaid}</> : <>Not Paid Yet</>}
                </Alert>
              </Col>
            </Row>
          </Row>
          <br />
          <h2>Order items</h2>
          <ListGroup variant='flush'>
            {cartItems.map((item, idx) => (
              <CartItemComponent item={item} key={idx} orderCreated={true} />
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
              <span className='fw-bold'>&#8377; {cartSubtotal} </span>
            </ListGroup.Item>
            <ListGroup.Item>
              Shipping: <span className='fw-bold'>included</span>
            </ListGroup.Item>
            <ListGroup.Item>
              Tax: <span className='fw-bold'>included</span>
            </ListGroup.Item>
            <ListGroup.Item className='text-danger'>
              Total price:{' '}
              <span className='fw-bold'>&#8377; {cartSubtotal} </span>
            </ListGroup.Item>
            <ListGroup.Item>
              <div className='d-grid gap-2'>
                <Button
                  size='lg'
                  variant='danger'
                  type='button'
                  onClick={orderHandler}
                  disabled={buttonDisabled}
                >
                  {orderButtonMessage}
                </Button>
                {showPayByCardButton && (
                  <Button
                    variant='primary'
                    className='mt-3'
                    size='lg'
                    onClick={() => {
                      console.log('OrderId is:', id);
                      stripeCheckOut(
                        cartSubtotal,
                        cartItems,
                        id,
                        updateStateAfterOrder
                      );
                    }}
                  >
                    Pay By Card{' '}
                  </Button>
                )}
              </div>
              <div style={{ position: 'relative', zIndex: 1 }}>
                <div
                  ref={paypalContainer}
                  id='paypal-container-element'
                  className='mt-3'
                ></div>
              </div>
            </ListGroup.Item>
          </ListGroup>
        </Col>
      </Row>
    </Container>
  );
};

export default UserOrderDetailsPageComponent;
