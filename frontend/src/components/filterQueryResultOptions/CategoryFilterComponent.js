import { Form } from 'react-bootstrap';
import { useSelector } from 'react-redux';
import { useRef, useState } from 'react';

const CategoryFilterComponent = ({ setCategoriesFromFilter }) => {
  const { categories } = useSelector((state) => state.category);
  const [selectedCategories, setSelectedCategories] = useState([]);
  const myRefs = useRef([]);

  const selectCategory = (e, category, idx) => {
    setCategoriesFromFilter((items) => {
      return { ...items, [category.name]: e.target.checked };
    });

    //get main categories
    var selectedMainCategory = category.name.split('/')[0];
    //useRef to collect and persist all the categories in an array to e manipulated later
    var allCategories = myRefs.current.map((_, id) => {
      return { name: categories[id].name, idx: id };
    });

    //filter out the IDs of the main categories into an array
    var indexesOfMainCategory = allCategories.reduce((acc, item) => {
      var cat = item.name.split('/')[0];
      if (selectedMainCategory === cat) {
        acc.push(item.idx);
      }
      return acc;
    }, []);

    //Disable the non selected category
    if (e.target.checked) {
      //Needed so that later if uncheckd a selected one that should be reflected properly
      setSelectedCategories((old) => [...old, 'cat']);
      myRefs.current.map((_, idx) => {
        if (!indexesOfMainCategory.includes(idx))
          myRefs.current[idx].disabled = true;
        return '';
      });
    } else {
      //Now if all categories are unchecked after checking then it should be active/original state
      setSelectedCategories((old) => {
        var a = [...old];
        a.pop();
        if (a.length === 0) {
          window.location.href = '/product-list';
        }
        return a;
      });

      myRefs.current.map((_, idx2) => {
        if (allCategories.length === 1) {
          if (idx2 !== idx) myRefs.current[idx2].disabled = false;
        } else if (selectedCategories.length === 1)
          myRefs.current[idx2].disabled = false;
        return '';
      });
    }
  };

  return (
    <>
      <span className='fw-bold'>Category</span>
      <Form>
        {categories.map((category, idx) => (
          <div key={idx}>
            <Form.Check type='checkbox' id={`check-api2-${idx}`}>
              <Form.Check.Input
                ref={(el) => (myRefs.current[idx] = el)}
                type='checkbox'
                isValid
                onChange={(e) => selectCategory(e, category, idx)}
              />
              <Form.Check.Label style={{ cursor: 'pointer' }}>
                {category.name}
              </Form.Check.Label>
            </Form.Check>
          </div>
        ))}
      </Form>
    </>
  );
};

export default CategoryFilterComponent;
