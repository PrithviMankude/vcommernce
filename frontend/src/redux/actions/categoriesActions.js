import {
  GET_CATEGORIES,
  SAVE_ATTR,
  INSERT_CATEGORY,
  DELETE_CATEGORY,
} from '../constants';
import axios from 'axios';

const getCategories = () => async (dispatch) => {
  try {
    const { data } = await axios.get('/api/categories');
    dispatch({ type: GET_CATEGORIES, payload: data });
  } catch (err) {
    throw new Error(err.response.data);
  }
};

const saveAttributesToCategory =
  (key, val, categoryChoosen) => async (dispatch, getState) => {
    try {
      const { data } = await axios.post('/api/categories/attr', {
        key,
        val,
        categoryChoosen,
      });
      if (data.categoriesUpdated) {
        dispatch({ type: SAVE_ATTR, payload: [...data.categoriesUpdated] });
      }
    } catch (err) {
      throw new Error(err.response.data);
    }
  };

const newCategory = (category) => async (dispatch, getState) => {
  const cat = getState().category.categories;

  const { data } = await axios.post('/api/categories', { category });
  console.log(data.categoryCreated);
  if (data.categoryCreated) {
    dispatch({
      type: INSERT_CATEGORY,
      payload: [...cat, data.categoryCreated],
    });
  }
};

const deleteCategory = (category) => async (dispatch, getState) => {
  const cat = getState().category.categories;
  const categories = cat.filter((item) => item.name !== category);
  const { data } = await axios.delete(
    '/api/categories/' + encodeURIComponent(category)
  );
  if (data.categoryDeleted) {
    dispatch({
      type: DELETE_CATEGORY,
      payload: [...categories],
    });
  }
};
export { getCategories, saveAttributesToCategory, newCategory, deleteCategory };
