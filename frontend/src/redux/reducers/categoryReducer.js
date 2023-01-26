import { GET_CATEGORIES } from '../constants';

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

    default:
      return state;
  }
};

export { categoryReducer };
