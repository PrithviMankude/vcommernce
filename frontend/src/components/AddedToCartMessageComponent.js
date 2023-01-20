import { Alert, Button } from 'react-bootstrap';
import { useNavigate } from 'react-router-dom';
import { Link } from 'react-router-dom';
import { useState } from 'react';

const AddedToCartMessageComponent = ({
  showCartMessage,
  setShowCartMessage,
}) => {
  const navigate = useNavigate();
  const goBack = () => {
    navigate(-1);
  };

  return (
    <Alert
      show={showCartMessage}
      variant='success'
      onClose={() => setShowCartMessage(false)}
      dismissible
    >
      <Alert.Heading>The product was added to your CART</Alert.Heading>
      <p>
        <Button variant='success' onClick={goBack}>
          Go Back
        </Button>
        {'  '}
        <Link to='/cart'>
          <Button variant='danger'>Go to Cart</Button>
        </Link>
      </p>
    </Alert>
  );
};

export default AddedToCartMessageComponent;
