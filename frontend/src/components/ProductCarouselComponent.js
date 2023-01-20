import React from 'react';
import Carousel from 'react-bootstrap/Carousel';
import { LinkContainer } from 'react-router-bootstrap';

const ProductCarouselComponent = () => {
  return <>{UncontrolledExample()}</>;
};

function UncontrolledExample() {
  const cursorP = {
    cursor: 'pointer',
  };
  return (
    <Carousel>
      <Carousel.Item>
        <img
          crossOrigin='anonymous'
          className='d-block w-100'
          style={{ height: '300px', objectFit: 'cover' }}
          src='/images/carousel/carousel-1.png'
          alt='First slide'
        />
        <Carousel.Caption>
          <LinkContainer style={cursorP} to='product-details'>
            <h3>Best Sellers in Laptops</h3>
          </LinkContainer>
          <p>Dell Inspiron 15.6 inch...</p>
        </Carousel.Caption>
      </Carousel.Item>
      <Carousel.Item>
        <img
          className='d-block w-100'
          style={{ height: '300px', objectFit: 'cover' }}
          src='/images/carousel/carousel-2.png'
          alt='Second slide'
        />

        <Carousel.Caption>
          <LinkContainer style={cursorP} to='product-details'>
            <h3>Best Sellers in Boks</h3>
          </LinkContainer>
          <p>This is the best selling books for this year.</p>
        </Carousel.Caption>
      </Carousel.Item>
      <Carousel.Item>
        <img
          className='d-block w-100'
          style={{ height: '300px', objectFit: 'cover' }}
          src='/images/carousel/carousel-3.png'
          alt='Third slide'
        />

        <Carousel.Caption>
          <LinkContainer style={cursorP} to='product-details'>
            <h3>Best Sellers in Camera</h3>
          </LinkContainer>
          <p>This is the best selling in Cameras for this year</p>
        </Carousel.Caption>
      </Carousel.Item>
    </Carousel>
  );
}

//export default UncontrolledExample;

export default ProductCarouselComponent;
