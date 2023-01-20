import { LOGIN_USER_BEGIN } from '../constants';

const deleteThis = (state = { value: 101 }, action) => {
  const { type, payload } = action;
  switch (type) {
    case LOGIN_USER_BEGIN:
    /*return {
        ...state,
        isLoading: true,
      }; */

    default:
      return state;
  }
};

export { deleteThis };
