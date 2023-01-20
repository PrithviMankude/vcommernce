import { Container, Row, Col, Form, Button, Alert } from 'react-bootstrap';
import { useState } from 'react';
import { Link } from 'react-router-dom';
import Spinner from 'react-bootstrap/Spinner';

const LoginPageComponent = ({
  LoginPageApiRequest,
  isLoading,
  showAlert,
  showAlertText,
}) => {
  const [validated, setValidated] = useState(false);
  const [formData, setformData] = useState({
    email: '',
    password: '',
    doNotLogout: false,
  });

  const handleSubmit = (event) => {
    event.preventDefault();
    event.stopPropagation();

    const form = event.currentTarget.elements;

    const email = form.email.value;
    const password = form.password.value;
    const doNotLogout = form.doNotLogout.checked;

    /*
    console.log('**********Other way to fetch form data******');
    const formData = new FormData(event.target),
      formDataObj = Object.fromEntries(formData.entries());
    console.log(formDataObj);
*/
    if (event.currentTarget.checkValidity() === true && email && password) {
      LoginPageApiRequest(email, password, doNotLogout)
        .then(() => {})
        .catch((err) => console.log(err));
    }

    setValidated(true);
  };
  return (
    <Container>
      <Row className='mt-5 justify-content-md-center'>
        <Col md={6}>
          <h1>Login</h1>
          <Form noValidate validated={validated} onSubmit={handleSubmit}>
            <Form.Group className='mb-3' controlId='formBasicEmail'>
              <Form.Label>Email address</Form.Label>
              <Form.Control
                name='email'
                required
                type='email'
                placeholder='Enter email'
              />
            </Form.Group>
            <Form.Group className='mb-3' controlId='formBasicPassword'>
              <Form.Label>Password</Form.Label>
              <Form.Control
                name='password'
                required
                type='password'
                placeholder='Password'
              />
            </Form.Group>
            <Form.Group className='mb-3' controlId='formBasicCheckbox'>
              <Form.Check
                name='doNotLogout'
                type='checkbox'
                label='Do not logout'
              />
            </Form.Group>

            <Row className='pb-2'>
              <Col>
                Don't you have an account?
                <Link to={'/register'}> Register </Link>
              </Col>
            </Row>

            <Button variant='danger' type='submit'>
              {isLoading && (
                <Spinner
                  as='span'
                  animation='border'
                  size='sm'
                  role='status'
                  aria-hidden='true'
                />
              )}
              Login
            </Button>
            {showAlert && (
              <Alert show={true} variant='danger'>
                {showAlertText && showAlertText}
              </Alert>
            )}
          </Form>
        </Col>
      </Row>
    </Container>
  );
};

export default LoginPageComponent;
