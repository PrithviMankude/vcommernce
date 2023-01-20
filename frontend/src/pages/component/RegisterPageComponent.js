import { Container, Row, Col, Form, Button, Alert } from 'react-bootstrap';
import { useState } from 'react';
import { Link } from 'react-router-dom';
import Spinner from 'react-bootstrap/Spinner';
const RegisterPageComponent = ({
  registerPageApiRequest,
  isLoading,
  showAlert,
  showAlertText,
}) => {
  const [validated, setValidated] = useState(false);
  const [passwordMatch, setPasswordMatch] = useState(true);

  const onChange = () => {
    const password = document.querySelector('input[name=password]');
    const confirmPassword = document.querySelector(
      'input[name=confirmPassword]'
    );
    if (confirmPassword.value === password.value) {
      setPasswordMatch(true);
    } else {
      setPasswordMatch(false);
    }
  };

  const handleSubmit = (event) => {
    event.preventDefault();
    event.stopPropagation();

    const form = event.currentTarget.elements;
    const name = form.name.value;
    const lastName = form.lastName.value;
    const email = form.email.value;
    const password = form.password.value;

    if (
      event.currentTarget.checkValidity() === true &&
      name &&
      lastName &&
      email &&
      password &&
      form.password.value === form.confirmPassword.value
    ) {
      registerPageApiRequest(name, lastName, email, password)
        .then(() => {})
        .catch((err) => console.log(err.response.data));
    }

    setValidated(true);
  };
  return (
    <Container>
      <Row className='mt-5 justify-content-md-center'>
        <Col md={6}>
          <h1>Register</h1>
          <Form noValidate validated={validated} onSubmit={handleSubmit}>
            <Form.Group className='mb-3' controlId='validationCustom01'>
              <Form.Label>Your name</Form.Label>
              <Form.Control
                required
                type='text'
                placeholder='Enter your name'
                name='name'
              />
              <Form.Control.Feedback type='invalid'>
                Please enter a name
              </Form.Control.Feedback>
            </Form.Group>
            <Form.Group className='mb-3' controlId='formBasicLastName'>
              <Form.Label>Your last name</Form.Label>
              <Form.Control
                required
                type='text'
                placeholder='Enter your last name'
                name='lastName'
              />
              <Form.Control.Feedback type='invalid'>
                Please enter your last name
              </Form.Control.Feedback>
            </Form.Group>
            <Form.Group className='mb-3' controlId='formBasicEmail'>
              <Form.Label>Email address</Form.Label>
              <Form.Control
                name='email'
                required
                type='email'
                placeholder='Enter email'
              />
              <Form.Control.Feedback type='invalid'>
                Please anter a valid email address
              </Form.Control.Feedback>
            </Form.Group>
            <Form.Group className='mb-3' controlId='formBasicPassword'>
              <Form.Label>Password</Form.Label>
              <Form.Control
                name='password'
                required
                type='password'
                placeholder='Password'
                minLength={6}
                onChange={onChange}
                isInvalid={!passwordMatch}
              />
              <Form.Control.Feedback type='invalid'>
                Please enter a valid password
              </Form.Control.Feedback>
              <Form.Text className='text-muted'>
                Password should have at least 6 characters
              </Form.Text>
            </Form.Group>
            <Form.Group className='mb-3' controlId='formBasicPasswordRepeat'>
              <Form.Label>Repeat Password</Form.Label>
              <Form.Control
                name='confirmPassword'
                required
                type='password'
                placeholder='Repeat Password'
                minLength={6}
                onChange={onChange}
                isInvalid={!passwordMatch}
              />
              <Form.Control.Feedback type='invalid'>
                Both passwords should match
              </Form.Control.Feedback>
            </Form.Group>

            <Row className='pb-2'>
              <Col>
                Do you have an account already?
                <Link to={'/login'}> Login </Link>
              </Col>
            </Row>

            <Button type='submit'>
              {isLoading && (
                <Spinner
                  as='span'
                  animation='border'
                  size='sm'
                  role='status'
                  aria-hidden='true'
                />
              )}
              Submit
            </Button>
            {showAlert && showAlertText.error && (
              <Alert show={true} variant='danger'>
                {showAlertText.error}
              </Alert>
            )}
            {showAlert && showAlertText.success && (
              <Alert show={true} variant='info'>
                {showAlertText.success}
              </Alert>
            )}
          </Form>
        </Col>
      </Row>
    </Container>
  );
};

export default RegisterPageComponent;
