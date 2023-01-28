import axios from 'axios';
import { useParams } from 'react-router-dom';
import EditUserPageComponent from './components/EditUserPageComponent';

const fetchUser = async (userId) => {
  try {
    const { data } = await axios.get(`/api/users/${userId}`);
    return data;
  } catch (err) {
    throw new Error(err.response.data);
  }
};

const updateUserRequest = async (userId, name, lastName, email, isAdmin) => {
  try {
    const { data } = await axios.put(`/api/users/${userId}`, {
      name,
      lastName,
      email,
      isAdmin,
    });
    console.log(data);
    return data;
  } catch (err) {
    throw new Error(err.response.data);
  }
};

const AdminEditUserPage = () => {
  return (
    <EditUserPageComponent
      updateUserRequest={updateUserRequest}
      fetchUser={fetchUser}
    />
  );
};

export default AdminEditUserPage;
