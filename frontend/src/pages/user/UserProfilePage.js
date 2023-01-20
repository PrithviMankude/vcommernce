import UserProfilePageComponent from './components/UserProfilePageComponent';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import {
  updateUserProfile,
  getUserProfile,
} from '../../redux/actions/userActions';
import { useState, useEffect } from 'react';

const UserProfilePage = () => {
  const dispatch = useDispatch();
  const { isLoading, showAlert, showAlertText, userInfo, userProfile } =
    useSelector((state) => state.user);

  //const [profile, setProfile] = useState();

  useEffect(() => {
    fetchUser();
  }, []);

  const fetchUser = async () => {
    try {
      const result = await dispatch(getUserProfile(userInfo._id));
      /*
      if (result) {
        setProfile(result);
      } */
    } catch (err) {
      console.log(err.response.data);
    }
  };

  const updateUserProfileApiRequest = async (
    name,
    lastName,
    phoneNumber,
    address,
    country,
    zipCode,
    city,
    state,
    password
  ) => {
    const result = await dispatch(
      updateUserProfile({
        name,
        lastName,
        phoneNumber,
        address,
        country,
        zipCode,
        city,
        state,
        password,
      })
    );

    //Delete if no further actions
    if (result) {
      const { success, userUpdated } = result;
    }
    //To do: update here next action, if any
  };

  return (
    <UserProfilePageComponent
      updateUserProfileApiRequest={updateUserProfileApiRequest}
      isLoading={isLoading}
      showAlert={showAlert}
      showAlertText={showAlertText}
      profile={userProfile}
      userInfo={userInfo}
    />
  );
};

export default UserProfilePage;
