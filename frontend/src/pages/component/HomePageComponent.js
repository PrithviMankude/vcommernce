import React from 'react';
import ProductCarouselComponent from '../../components/ProductCarouselComponent';
import CategoryCardComponent from '../../components/CategoryCardComponent';
import { Row, Container } from 'react-bootstrap';
import { useState, useEffect } from 'react';

const HomePageComponent = ({ categories }) => {
  const [mainCategories, setMainCategories] = useState([]);

  useEffect(() => {
    setMainCategories((cat) =>
      categories.filter((item) => !item.name.includes('/'))
    );
  }, [categories]);

  return (
    <>
      <ProductCarouselComponent />

      <Container>
        <Row xs={1} md={2} className='g-4 mt-5'>
          {mainCategories.map((category, idx) => {
            return (
              <CategoryCardComponent key={idx} category={category} idx={idx} />
            );
          })}
        </Row>
      </Container>
    </>
  );
};

export default HomePageComponent;
