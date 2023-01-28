import {
  Row,
  Col,
  Container,
  Form,
  Button,
  CloseButton,
  Table,
  Alert,
} from 'react-bootstrap';
import { Link, Navigate, useNavigate } from 'react-router-dom';
import { useState, useRef } from 'react';

const CreateProductPageComponent = ({
  createProductApiRequest,
  uploadImagesApiRequest,
  uploadImagesCloudinaryApiRequest,
  categories,
  reduxDispatch,
  newCategory,
  deleteCategory,
  saveAttributeToCatDoc,
}) => {
  const [validated, setValidated] = useState(false);
  const [attributesTable, setAttributesTable] = useState([]);
  const [images, setImages] = useState(false);
  const [isCreating, setIsCreating] = useState(false);
  const [createProductResponseState, setCreateProductResponseState] = useState({
    message: '',
    error: '',
  });
  const [categoryChoosen, setCategoryChoosen] = useState('Choose category');
  const [attributesFromDb, setAttributesFromDb] = useState([]); // for select lists

  const [newAttrKey, setNewAttrKey] = useState(false);
  const [newAttrValue, setNewAttrValue] = useState(false);

  const navigate = useNavigate();
  //TO show attributes
  const attrVal = useRef(null);
  const attrKey = useRef(null);
  //To save attribute and clear out after saving
  const createNewAttrKey = useRef(null);
  const createNewAttrVal = useRef(null);

  const handleSubmit = (event) => {
    event.preventDefault();
    event.stopPropagation();

    const form = event.currentTarget.elements;

    const formInputs = {
      name: form.name.value,
      description: form.description.value,
      price: form.price.value,
      count: form.count.value,
      category: form.category.value,
      attributesTable: attributesTable,
    };

    if (event.currentTarget.checkValidity() === true) {
      createProductApiRequest(formInputs)
        .then((data) => {
          if (images) {
            //Temp as in dev env we would stil like to store in local, this is only for test
            if (process.env.NODE_ENV === 'production') {
              uploadImagesApiRequest(images, data.productId)
                .then((res) => {})
                .catch((err) => setIsCreating(err.response.data));
            } else {
              uploadImagesCloudinaryApiRequest(images, data.productId);
            }
          }
          return data;
        })
        .then((data) => {
          setIsCreating('Product is being created...');

          setTimeout(() => {
            setIsCreating('');
            if (data.message === 'Product Created') {
              navigate('/admin/products');
            }
          }, 2000);
        })
        .catch((err) => {
          setCreateProductResponseState({ error: err.response.data });
        });
    }

    setValidated(true);
  };

  const uploadHandler = (images) => {
    setImages(images);
  };

  const newCategoryHandler = (e) => {
    if (e.keyCode && e.keyCode === 13 && e.target.value) {
      reduxDispatch(newCategory(e.target.value));
      //for some reason its not updating so using a timeout
      setTimeout(() => {
        let element = document.getElementById('cats');
        element.value = e.target.value;
        setCategoryChoosen(e.target.value);
        e.target.value = '';
      }, 300);
    }
  };

  const deleteCategoryHandler = () => {
    let element = document.getElementById('cats');
    reduxDispatch(deleteCategory(element.value));
    setCategoryChoosen('Choose category');
  };

  const deleteAttribute = (key) => {
    setAttributesTable((table) => table.filter((item) => item.key !== key));
  };

  const changeCategory = (e) => {
    const highLevelCategory = e.target.value.split('/')[0];
    const highLevelCategoryAllData = categories.find(
      (cat) => cat.name === highLevelCategory
    );
    if (highLevelCategoryAllData && highLevelCategoryAllData.attrs) {
      setAttributesFromDb(highLevelCategoryAllData.attrs);
    } else {
      setAttributesFromDb([]);
    }
    setCategoryChoosen(e.target.value);
  };

  //To show the attribute values on selection of att key
  const setValuesForAttrFromDbSelectForm = (e) => {
    if (e.target.value !== 'Choose attribute') {
      var selectedAttr = attributesFromDb.find(
        (item) => item.key === e.target.value
      );
      let valuesForAttrKeys = attrVal.current;
      if (selectedAttr && selectedAttr.value.length > 0) {
        while (valuesForAttrKeys.options.length) {
          valuesForAttrKeys.remove(0);
        }
        valuesForAttrKeys.options.add(new Option('Choose attribute value'));
        selectedAttr.value.map((item) => {
          valuesForAttrKeys.add(new Option(item));
          return '';
        });
      }
    }
  };

  //To set the attr values selected in the table
  const setAttributesTableWrapper = (key, val) => {
    setAttributesTable((attr) => {
      if (attr.length !== 0) {
        var keyExistsInOldTable = false;
        let modifiedTable = attr.map((item) => {
          if (item.key === key) {
            keyExistsInOldTable = true;
            item.value = val;
            return item;
          } else {
            return item;
          }
        });
        if (keyExistsInOldTable) return [...modifiedTable];
        else return [...modifiedTable, { key: key, value: val }];
      } else {
        return [{ key: key, value: val }];
      }
    });
  };

  const attributeValueSelected = (e) => {
    if (e.target.value !== 'Choose attribute value') {
      setAttributesTableWrapper(attrKey.current.value, e.target.value);
    }
  };

  const newAttrKeyHandler = (e) => {
    e.preventDefault();
    setNewAttrKey(e.target.value);
    addNewAttributeManually(e);
  };

  const newAttrValueHandler = (e) => {
    e.preventDefault();
    setNewAttrValue(e.target.value);
    addNewAttributeManually(e);
  };

  const checkKeyDown = (e) => {
    if (e.code === 'Enter') e.preventDefault();
  };

  const addNewAttributeManually = (e) => {
    if (e.keyCode && e.keyCode === 13) {
      if (newAttrKey && newAttrValue) {
        reduxDispatch(
          saveAttributeToCatDoc(newAttrKey, newAttrValue, categoryChoosen)
        );
        setAttributesTableWrapper(newAttrKey, newAttrValue, setAttributesTable);
        e.target.value = '';
        createNewAttrKey.current.value = '';
        createNewAttrVal.current.value = '';
        setNewAttrKey(false);
        setNewAttrValue(false);
      }
    }
  };

  return (
    <Container>
      <Row className='justify-content-md-center mt-5'>
        <Col md={1}>
          <Link to='/admin/products' className='btn btn-info my-3'>
            Go Back
          </Link>
        </Col>
        <Col md={6}>
          <h1>Create a new product</h1>
          <Form
            noValidate
            validated={validated}
            onKeyDown={(e) => checkKeyDown(e)}
            onSubmit={handleSubmit}
          >
            <Form.Group className='mb-3' controlId='formBasicName'>
              <Form.Label>Name</Form.Label>
              <Form.Control name='name' required type='text' />
            </Form.Group>

            <Form.Group
              className='mb-3'
              controlId='exampleForm.ControlTextarea1'
            >
              <Form.Label>Description</Form.Label>
              <Form.Control
                name='description'
                required
                as='textarea'
                rows={3}
              />
            </Form.Group>
            <Form.Group className='mb-3' controlId='formBasicCount'>
              <Form.Label>Count in stock</Form.Label>
              <Form.Control name='count' required type='number' />
            </Form.Group>
            <Form.Group className='mb-3' controlId='formBasicPrice'>
              <Form.Label>Price</Form.Label>
              <Form.Control name='price' required type='text' />
            </Form.Group>
            <Form.Group className='mb-3' controlId='formBasicCategory'>
              <Form.Label>
                Category
                <CloseButton onClick={deleteCategoryHandler} />(
                <small>remove selected</small>)
              </Form.Label>
              <Form.Select
                required
                id='cats'
                name='category'
                aria-label='Default select example'
                onChange={(e) => changeCategory(e)}
              >
                <option value='Choose category'>Choose category</option>
                {categories.map((category, idx) => (
                  <option key={idx} value={category.name}>
                    {category.name}
                  </option>
                ))}
              </Form.Select>
            </Form.Group>

            <Form.Group className='mb-3' controlId='formBasicNewCategory'>
              <Form.Label>
                Or create a new category (e.g. Computers/Laptops/Intel){' '}
              </Form.Label>
              <Form.Control
                onKeyUp={newCategoryHandler}
                name='newCategory'
                type='text'
              />
            </Form.Group>

            {attributesFromDb.length > 0 && (
              <Row className='mt-5'>
                <Col md={6}>
                  <Form.Group className='mb-3' controlId='formBasicAttributes'>
                    <Form.Label>Choose atrribute and set value</Form.Label>
                    <Form.Select
                      name='atrrKey'
                      aria-label='Default select example'
                      ref={attrKey}
                      onChange={(e) => setValuesForAttrFromDbSelectForm(e)}
                    >
                      <option>Choose attribute</option>

                      {attributesFromDb.map((item, idx) => (
                        <option key={idx} value={item.key}>
                          {item.key}
                        </option>
                      ))}
                    </Form.Select>
                  </Form.Group>
                </Col>
                <Col md={6}>
                  <Form.Group
                    className='mb-3'
                    controlId='formBasicAttributeValue'
                  >
                    <Form.Label>Attribute value</Form.Label>
                    <Form.Select
                      name='atrrVal'
                      aria-label='Default select example'
                      ref={attrVal}
                      onChange={(e) => attributeValueSelected(e)}
                    >
                      <option>Choose attribute value</option>
                    </Form.Select>
                  </Form.Group>
                </Col>
              </Row>
            )}

            <Row>
              {attributesTable.length > 0 && (
                <Table hover>
                  <thead>
                    <tr>
                      <th>Attribute</th>
                      <th>Value</th>
                      <th>Delete</th>
                    </tr>
                  </thead>
                  <tbody>
                    {attributesTable.map((item, idx) => (
                      <tr key={idx}>
                        <td>{item.key}</td>
                        <td>{item.value}</td>
                        <td>
                          <CloseButton
                            onClick={() => deleteAttribute(item.key)}
                          />
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </Table>
              )}
            </Row>

            <Row>
              <Col md={6}>
                <Form.Group className='mb-3' controlId='formBasicNewAttribute'>
                  <Form.Label>Create new attribute</Form.Label>
                  <Form.Control
                    ref={createNewAttrKey}
                    disabled={['', 'Choose category'].includes(categoryChoosen)}
                    placeholder='first choose or create category'
                    name='newAttrValue'
                    type='text'
                    onKeyUp={newAttrKeyHandler}
                  />
                </Form.Group>
              </Col>
              <Col md={6}>
                <Form.Group
                  className='mb-3'
                  controlId='formBasicNewAttributeValue'
                >
                  <Form.Label>Attribute value</Form.Label>
                  <Form.Control
                    ref={createNewAttrVal}
                    disabled={['', 'Choose category'].includes(categoryChoosen)}
                    placeholder='first choose or create category'
                    required={newAttrKey}
                    name='newAttrValue'
                    type='text'
                    onKeyUp={newAttrValueHandler}
                  />
                </Form.Group>
              </Col>
            </Row>

            <Alert show={newAttrKey && newAttrValue} variant='primary'>
              After typing attribute key and value press enter on one of the
              field
            </Alert>

            <Form.Group controlId='formFileMultiple' className='mb-3 mt-3'>
              <Form.Label>Images</Form.Label>

              <Form.Control
                required
                type='file'
                multiple
                onChange={(e) => {
                  uploadHandler(e.target.files);
                }}
              />
              {isCreating}
            </Form.Group>
            <Button variant='primary' type='submit'>
              Create
            </Button>
            {createProductResponseState.error ?? ''}
          </Form>
        </Col>
      </Row>
    </Container>
  );
};

export default CreateProductPageComponent;
