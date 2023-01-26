import { GET_CATEGORIES } from '../constants';
import axios from 'axios';

const getCategories = () => async (dispatch) => {
  try {
    const { data } = await axios.get('/api/categories');
    dispatch({ type: GET_CATEGORIES, payload: data });
  } catch (err) {
    throw new Error(err.response.data);
  }
};

export { getCategories };
