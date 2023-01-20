import {
  LOGIN_USER_BEGIN,
  LOGIN_USER_SUCCESS,
  LOGIN_USER_FAIL,
  LOGOUT_USER_BEGIN,
  LOGOUT_USER_SUCCESS,
  LOGOUT_USER_FAIL,
  REGISTER_USER_BEGIN,
  REGISTER_USER_SUCCESS,
  REGISTER_USER_FAIL,
  UPDATE_USER_BEGIN,
  UPDATE_USER_SUCCESS,
  UPDATE_USER_FAIL,
  GET_USER_PROFILE_BEGIN,
  GET_USER_PROFILE_SUCCESS,
  GET_USER_PROFILE_FAIL,
} from '../constants';

const userInfoInLocalStorage = localStorage.getItem('userInfo')
  ? JSON.parse(localStorage.getItem('userInfo'))
  : sessionStorage.getItem('userInfo')
  ? JSON.parse(sessionStorage.getItem('userInfo'))
  : {};

const userProfileInSessionStorage = sessionStorage.getItem('userProfile')
  ? JSON.parse(sessionStorage.getItem('userProfile'))
  : {};

const initialState = {
  isLoading: false,
  userInfo: userInfoInLocalStorage,
  userProfile: userProfileInSessionStorage,
  showAlert: false,
  showAlertText: '',
};

const userReducer = (state = initialState, action) => {
  const { type, payload } = action;
  switch (type) {
    case LOGIN_USER_BEGIN:
    case LOGOUT_USER_BEGIN:
    case REGISTER_USER_BEGIN:
    case UPDATE_USER_BEGIN:
    case GET_USER_PROFILE_BEGIN:
      return {
        ...state,
        isLoading: true,
      };
    case LOGIN_USER_SUCCESS:
    case REGISTER_USER_SUCCESS:
    case UPDATE_USER_SUCCESS:
      return {
        ...state,
        isLoading: false,
        userInfo: payload,
      };
    case LOGIN_USER_FAIL:
    case REGISTER_USER_FAIL:
    case UPDATE_USER_FAIL:
    case GET_USER_PROFILE_FAIL:
      return {
        ...state,
        isLoading: false,
        showAlert: true,
        showAlertText: payload,
      };
    case LOGOUT_USER_SUCCESS:
      return {};
    /*case UPDATE_USER_SUCCESS:
      return {
        ...state,
        isLoading: false,
        userInfo: payload,
      };*/
    case GET_USER_PROFILE_SUCCESS:
      return {
        ...state,
        isLoading: false,
        userProfile: payload,
      };

    default:
      return state;
  }
};

export { userReducer };
