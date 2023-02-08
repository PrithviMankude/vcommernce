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
import { useParams, useLocation, useNavigate } from 'react-router-dom';

const ProductListPageComponent = ({ getProducts, categories }) => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);
  const [attrFilter, setAttrFilter] = useState([]); //collect category attr from db and show on page
  const [attrsFromFilter, setAttrsFromFilter] = useState([]); //collect user filters for category attr
  const [showResetFiltersButtons, setShowResetFiltersButtons] = useState(false);

  const [filters, setFilters] = useState({}); //collect all filters
  const [price, setPrice] = useState(500);
  const [ratingsFromFilter, setRatingsFromFilter] = useState({});
  const [categoriesFromFilter, setCategoriesFromFilter] = useState({});
  const [sortOption, setSortOption] = useState('');
  const [paginationLinksNumber, setPaginationLinksNumber] = useState(null);
  const [pageNum, setPageNum] = useState(null);

  const { categoryName } = useParams() || '';
  const { pageNumParam } = useParams() || '1';
  const { searchQuery } = useParams() || '';

  const location = useLocation(); //To read the path to show the category panel only on /product-list page
  const navigate = useNavigate();

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

  //To show attributes for selected categories once the user selects a category
  useEffect(() => {
    if (Object.entries(categoriesFromFilter).length > 0) {
      //reset and build anew to flush out the old attr values which may be from other category
      setAttrFilter([]);
      var cat = [];
      var count;
      //Object entries = category and isChecked bool
      Object.entries(categoriesFromFilter).forEach(([category, checked]) => {
        if (checked) {
          var name = category.split('/')[0];
          cat.push(name);
          count = cat.filter((x) => x === name).length;
          if (count === 1) {
            var index = categories.findIndex((item) => item.name === name);
            setAttrFilter((attrs) => [...attrs, ...categories[index].attrs]);
          }
        }
      });
    }
  }, [categoriesFromFilter, categories]);

  useEffect(() => {
    getProducts(categoryName, pageNumParam, searchQuery, filters, sortOption)
      .then((products) => {
        setProducts(products.products);
        setPaginationLinksNumber(products.paginationLinksNumber);
        setPageNum(products.pageNum);
        setLoading(false);
      })
      .catch((err) => {
        console.log(err);
        setError(true);
      });
  }, [categoryName, pageNumParam, searchQuery, filters, sortOption]);

  const handleFilters = () => {
    navigate(location.pathname.replace(/\/[0-9]+$/, '')); //just to remove the page num on clicking filter
    setShowResetFiltersButtons(true);
    setFilters({
      price: price,
      category: categoriesFromFilter,
      rating: ratingsFromFilter,
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
              {<SortOptionsComponent setSortOption={setSortOption} />}
            </ListGroup.Item>
            <ListGroup.Item>
              {' '}
              FILTER: <br />
              {<PriceFilterComponent price={price} setPrice={setPrice} />}
            </ListGroup.Item>
            <ListGroup.Item>
              {
                <RatingFilterComponent
                  setRatingsFromFilter={setRatingsFromFilter}
                />
              }
            </ListGroup.Item>
            {!location.pathname.match(/\/category/) && (
              <ListGroup.Item>
                {
                  <CategoryFilterComponent
                    setCategoriesFromFilter={setCategoriesFromFilter}
                  />
                }
              </ListGroup.Item>
            )}

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
          {paginationLinksNumber > 1 ? (
            <PaginationComponent
              categoryName={categoryName}
              searchQuery={searchQuery}
              paginationLinksNumber={paginationLinksNumber}
              pageNum={pageNum}
            />
          ) : null}
        </Col>
      </Row>
    </Container>
  );
};

export default ProductListPageComponent;
