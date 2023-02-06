import React from 'react';
import { Container, Row, Col, ListGroup, Button } from 'react-bootstrap';
import ProductForListComponent from '../../components/ProductForListComponent.js';
import PaginationComponent from '../../components/PaginationComponent.js';
import SortOptionsComponent from '../../components/SortOptionsComponent';
import PriceFilterComponent from '../../components/filterQueryResultOptions/PriceFilterComponent';
import RatingFilterComponent from '../../components/filterQueryResultOptions/RatingFilterComponent';
import CategoryFilterComponent from '../../components/filterQueryResultOptions/CategoryFilterComponent';
import AttributesFilterComponent from '../../components/filterQueryResultOptions/AttributesFilterComponent';
import { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';

const ProductListPageComponent = ({ getProducts, categories }) => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);
  const [attrFilter, setAttrFilter] = useState([]);
  const [attrsFromFilter, setAttrsFromFilter] = useState([]);
  const [showResetFiltersButtons, setShowResetFiltersButtons] = useState(false);

  const [filters, setFilters] = useState({});
  const [price, setPrice] = useState(500);
  const { categoryName } = useParams() || '';

  useEffect(() => {
    if (categoryName) {
      let categoryAllData = categories.find(
        (item) => item.name === categoryName.replaceAll(',', '/')
      );
      if (categoryAllData) {
        let mainCategory = categoryAllData.name.split('/')[0];
        let index = categories.findIndex((item) => item.name === mainCategory);

        setAttrFilter(categories[index].attrs);
      }
    } else {
      setAttrFilter([]);
    }
  }, [categoryName, categories]);

  useEffect(() => {
    getProducts()
      .then((products) => {
        setProducts(products.products);
        setLoading(false);
      })
      .catch((err) => {
        console.log(err);
        setError(true);
      });
  }, [filters]);

  const handleFilters = () => {
    setShowResetFiltersButtons(true);
    setFilters({
      price: price,
      attrs: attrsFromFilter,
    });
  };

  const resetFilters = () => {
    setShowResetFiltersButtons(false);
    setFilters({});
  };

  return (
    <Container fluid>
      <Row>
        <Col md={3}>
          <ListGroup varient='flush'>
            <ListGroup.Item className='mb-3 mt-3'>
              {<SortOptionsComponent />}
            </ListGroup.Item>
            <ListGroup.Item>
              {' '}
              FILTER: <br />
              {<PriceFilterComponent price={price} setPrice={setPrice} />}
            </ListGroup.Item>
            <ListGroup.Item>{<RatingFilterComponent />}</ListGroup.Item>
            <ListGroup.Item>{<CategoryFilterComponent />}</ListGroup.Item>
            <ListGroup.Item>
              {
                <AttributesFilterComponent
                  attrsFilter={attrFilter}
                  setAttrsFromFilter={setAttrsFromFilter}
                />
              }
            </ListGroup.Item>
            <ListGroup.Item>
              <Button variant='primary' onClick={handleFilters}>
                Filter
              </Button>
              {showResetFiltersButtons && (
                <Button variant='danger' onClick={resetFilters}>
                  Reset Filters
                </Button>
              )}
            </ListGroup.Item>
          </ListGroup>
        </Col>
        <Col md={9}>
          {loading ? (
            <h1>Loading products...</h1>
          ) : error ? (
            <h1>Error while fetching products..Try again later</h1>
          ) : (
            products.map((product) => (
              <ProductForListComponent
                key={product._id}
                images={product.images}
                name={product.name}
                description={product.description}
                price={product.price}
                rating={product.rating}
                reviewsNumber={product.reviewsNumber}
                productId={product._id}
              />
            ))
          )}

          <PaginationComponent />
        </Col>
      </Row>
    </Container>
  );
};

export default ProductListPageComponent;
