import { GET_CATEGORIES, SAVE_ATTR } from '../constants';

const initialState = {
  categories: [],
};

const categoryReducer = (state = initialState, action) => {
  const { type, payload } = action;
  switch (type) {
    case GET_CATEGORIES:
      return {
        ...state,
        categories: payload,
      };
    case SAVE_ATTR:
      return {
        ...state,
        categories: payload,
      };

    default:
      return state;
  }
};

export { categoryReducer };
