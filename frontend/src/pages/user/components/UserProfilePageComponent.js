import {
  Container,
  Row,
  Col,
  Form,
  Button,
  Alert,
  Spinner,
} from 'react-bootstrap';
import { useState } from 'react';
import { useSelector } from 'react-redux';

const UserProfilePageComponent = ({
  updateUserProfileApiRequest,
  isLoading,
  showAlert,
  showALertText,
  profile,
  userInfo,
}) => {
  const [validated, setValidated] = useState(false);

  const onChange = () => {
    const password = document.querySelector('input[name=password]');
    const confirm = document.querySelector('input[name=confirmPassword]');
    if (confirm.value === password.value) {
      confirm.setCustomValidity('');
    } else {
      confirm.setCustomValidity('Passwords do not match');
    }
  };

  const handleSubmit = (event) => {
    event.preventDefault();
    event.stopPropagation();

    const form = event.currentTarget.elements;

    const name = form.name.value;
    const lastName = form.lastName.value;
    const phoneNumber = form.phoneNumber.value;
    const address = form.address.value;
    const country = form.country.value;
    const zipCode = form.zipCode.value;
    const city = form.city.value;
    const state = form.state.value;
    const password = form.password.value;

    if (
      event.currentTarget.checkValidity() === true &&
      form.password.value === form.confirmPassword.value
    ) {
      updateUserProfileApiRequest(
        name,
        lastName,
        phoneNumber,
        address,
        country,
        zipCode,
        city,
        state,
        password
      )
        .then((data) => {})
        .catch((err) => console.log(err));
    }

    setValidated(true);
  };
  return (
    <Container>
      <Row className='mt-5 justify-content-md-center'>
        <Col md={6}>
          <h1>Change your profile</h1>
          <Form noValidate validated={validated} onSubmit={handleSubmit}>
            <Form.Group className='mb-3' controlId='validationCustom01'>
              <Form.Label>Your name </Form.Label>
              <Form.Control
                required
                type='text'
                defaultValue={
                  userInfo.name ? userInfo.name : 'Update your name'
                }
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
                defaultValue={
                  userInfo.lastName ? userInfo.lastName : 'Add lastName'
                }
                name='lastName'
              />
              <Form.Control.Feedback type='invalid'>
                Please enter your last name
              </Form.Control.Feedback>
            </Form.Group>
            <Form.Group className='mb-3' controlId='formBasicEmail'>
              <Form.Label>Email address</Form.Label>
              <Form.Control
                disabled
                value='john@doe.com   if you want to change email, remove account and create new one with new email address'
              />
            </Form.Group>
            <Form.Group className='mb-3' controlId='formBasicPhone'>
              <Form.Label>Phone number</Form.Label>
              <Form.Control
                type='text'
                placeholder='Enter your phone number'
                defaultValue={profile.phoneNumber ? profile.phoneNumber : ''}
                name='phoneNumber'
              />
            </Form.Group>
            <Form.Group className='mb-3' controlId='formBasicAddress'>
              <Form.Label>Address</Form.Label>
              <Form.Control
                type='text'
                placeholder='Enter your street name and house number'
                defaultValue={profile.address ? profile.address : ''}
                name='address'
              />
            </Form.Group>
            <Form.Group className='mb-3' controlId='formBasicCountry'>
              <Form.Label>Country</Form.Label>
              <Form.Control
                type='text'
                placeholder='Enter your country'
                defaultValue={profile.country ? profile.country : ''}
                name='country'
              />
            </Form.Group>
            <Form.Group className='mb-3' controlId='formBasicZip'>
              <Form.Label>Zip Code</Form.Label>
              <Form.Control
                type='text'
                placeholder='Enter your Zip code'
                defaultValue={profile.zipCode ? profile.zipCode : ''}
                name='zipCode'
              />
            </Form.Group>
            <Form.Group className='mb-3' controlId='formBasicCity'>
              <Form.Label>City</Form.Label>
              <Form.Control
                type='text'
                placeholder='Enter your city'
                defaultValue={profile.city ? profile.city : ''}
                name='city'
              />
            </Form.Group>
            <Form.Group className='mb-3' controlId='formBasicState'>
              <Form.Label>State</Form.Label>
              <Form.Control
                type='text'
                placeholder='Enter your state'
                defaultValue={profile.state ? profile.state : ''}
                name='state'
              />
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
              />
              <Form.Control.Feedback type='invalid'>
                Both passwords should match
              </Form.Control.Feedback>
            </Form.Group>

            <Button variant='primary' type='submit'>
              {isLoading && (
                <Spinner
                  as='span'
                  animation='border'
                  size='sm'
                  role='status'
                  aria-hidden='true'
                />
              )}
              Update
            </Button>
            {showAlert && (
              <Alert show={true} variant='danger'>
                {showALertText && showALertText}
              </Alert>
            )}
            {showAlert && (
              <Alert show={true} variant='info'>
                {showALertText && showALertText}
              </Alert>
            )}
          </Form>
        </Col>
      </Row>
    </Container>
  );
};

export default UserProfilePageComponent;
