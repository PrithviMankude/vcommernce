import { Row, Col, Image, ListGroup, Form, Button } from 'react-bootstrap';
import { useSelector, useDispatch } from 'react-redux';
import { addToCart, removeFromCart } from '../redux/actions/cartActions';

const CartItemComponent = ({
  item,
  orderCreated = false,
  changeCount = false,
  dispatchCartRemoveHandler,
}) => {
  /*WIll call dispatch here as multiple pages will be accessing this, se we need a central place to handle
  adding to cart and remove, so implementing here.*/
  const dispatch = useDispatch();
  const addToCartHandler = (productID, count) => {
    dispatch(addToCart(productID, count));
  };

  const removeFromCartHandler = async (productID, quantity, price) => {
    if (window.confirm('Are you sure to remove the product ? ')) {
      dispatch(removeFromCart(productID, quantity, price));
    }
  };

  return (
    <>
      <ListGroup.Item>
        <Row>
          <Col md={2}>
            <Image
              crossOrigin='anonymous'
              src={item.image ? item.image.path ?? null : null}
              fluid
            />
          </Col>
          <Col md={2}>{item.name}</Col>
          <Col md={2}>
            <b>&#8377; {item.price}</b>
          </Col>
          <Col md={3}>
            <Form.Select
              /* Use this if app breaks, this will impact selection of select and delete from userCart Page
               */
              /*
              onChange={
                changeCount
                  ? (e) => changeCount(item.productID, e.target.value)
                  : undefined
              } */
              onChange={(e) => addToCartHandler(item.productID, e.target.value)}
              disabled={orderCreated}
              value={item.quantity}
            >
              {[...Array(item.count).keys()].map((x) => (
                <option key={x + 1} value={x + 1}>
                  {x + 1}
                </option>
              ))}
            </Form.Select>
          </Col>
          <Col md={3}>
            <Button
              disabled={orderCreated}
              type='button'
              variant='secondary'
              onClick={() =>
                removeFromCartHandler(item.productID, item.quantity, item.price)
              }
              /* Use this if app breaks, this was original, this will impact selection of select and delete from userCart Page
               */
              /*onClick={() => {
                dispatchCartRemoveHandler(
                  item.productID,
                  item.quantity,
                  item.price
                );
              }}*/
            >
              <i className='bi bi-trash'></i>
            </Button>
          </Col>
        </Row>
      </ListGroup.Item>
      <br />
    </>
  );
};

export default CartItemComponent;
