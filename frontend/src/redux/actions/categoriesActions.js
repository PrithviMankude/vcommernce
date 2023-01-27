import { GET_CATEGORIES, SAVE_ATTR } from '../constants';
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

export { getCategories, saveAttributesToCategory };
