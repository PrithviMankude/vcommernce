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
import axios from 'axios';

const registerUser = (name, lastName, email, password) => async (dispatch) => {
  try {
    console.log('In actions', name, lastName, email, password);
    dispatch({ type: REGISTER_USER_BEGIN });

    const config = {
      headers: {
        'Content-type': 'application/json',
      },
    };

    const { data } = await axios.post(
      '/api/users/register',
      {
        name,
        lastName,
        email,
        password,
      },
      config
    );

    console.log('User registered..', data);

    sessionStorage.setItem('userInfo', JSON.stringify(data.userCreated));
    dispatch({ type: REGISTER_USER_SUCCESS, payload: data.userCreated });

    return data;
  } catch (err) {
    let errMsg = '';
    if (err.response.status === 500) {
      errMsg = 'Internal Server Error';
    } else {
      errMsg = err.response.data;
    }

    console.log(errMsg);

    dispatch({ type: REGISTER_USER_FAIL, payload: errMsg });
  }
};

const loginUser = (email, password, doNotLogout) => async (dispatch) => {
  try {
    dispatch({ type: LOGIN_USER_BEGIN });

    const config = {
      headers: {
        'Content-type': 'application/json',
      },
    };
    const { data } = await axios.post(
      '/api/users/login',
      {
        email,
        password,
        doNotLogout,
      },
      config
    );

    //Persist the data
    if (data.userLoggedIn.doNotLogout) {
      localStorage.setItem('userInfo', JSON.stringify(data.userLoggedIn));
    } else {
      sessionStorage.setItem('userInfo', JSON.stringify(data.userLoggedIn));
    }

    dispatch({ type: LOGIN_USER_SUCCESS, payload: data });

    return data;
  } catch (err) {
    let errMsg = '';
    if (err.response.status === 500) {
      errMsg = 'Internal Server Error';
    } else {
      errMsg = err.response.data;
    }

    dispatch({ type: LOGIN_USER_FAIL, payload: errMsg });
  }
};

const logoutUser = () => async (dispatch) => {
  try {
    dispatch({ type: LOGOUT_USER_BEGIN });

    await axios.get('/api/logout');

    localStorage.removeItem('userInfo');
    sessionStorage.removeItem('userInfo');
    //later
    localStorage.removeItem('cart');

    document.location.href = '/login';

    dispatch({ type: LOGOUT_USER_SUCCESS });
  } catch (err) {
    dispatch({ type: LOGOUT_USER_FAIL, payload: err.response.data });
  }
};

const updateUserProfile =
  ({
    name,
    lastName,
    phoneNumber,
    address,
    country,
    zipCode,
    city,
    state,
    password,
  }) =>
  async (dispatch) => {
    try {
      dispatch({ type: UPDATE_USER_BEGIN });
      const { data } = await axios.put('/api/users/profile', {
        name,
        lastName,
        phoneNumber,
        address,
        country,
        zipCode,
        city,
        state,
        password,
      });
      sessionStorage.setItem('userInfo', JSON.stringify(data.userUpdated));
      dispatch({ type: UPDATE_USER_SUCCESS, payload: data.userUpdated });

      return data;
    } catch (err) {
      let errMsg = '';
      if (err.response.status === 500) {
        errMsg = 'Internal Server Error';
      } else {
        errMsg = err.response.data;
      }
      console.log(errMsg);
      dispatch({ type: LOGIN_USER_FAIL, payload: errMsg });
    }

    return true;
  };

const getUserProfile = (userId) => async (dispatch) => {
  try {
    dispatch({ type: GET_USER_PROFILE_BEGIN });
    const { data } = await axios.get(`/api/users/profile/${userId}`);

    sessionStorage.setItem('userProfile', JSON.stringify(data));
    dispatch({ type: GET_USER_PROFILE_SUCCESS, payload: data });

    return data;
  } catch (err) {
    let errMsg = '';
    if (err.response.status === 500) {
      errMsg = 'Internal Server Error';
    } else {
      errMsg = err.response.data;
    }

    dispatch({ type: LOGIN_USER_FAIL, payload: errMsg });
  }
};

//await axios.get(`/api/users/profile/${userInfo._id}`);

export {
  loginUser,
  logoutUser,
  registerUser,
  updateUserProfile,
  getUserProfile,
};
