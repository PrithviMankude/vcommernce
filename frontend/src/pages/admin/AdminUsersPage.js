import UsersPageComponent from './components/UsersPageComponent';
import axios from 'axios';

const fetchUsers = async (/*abortCtrl*/) => {
  try {
    const { data } = await axios.get(
      '/api/users' /* {
      signal: abortCtrl.signal,
    } */
    );
    return data;
  } catch (err) {}
};

const deleteUser = async (userId) => {
  try {
    const { data } = await axios.delete(`/api/users/${userId}`);
    return data;
  } catch (err) {}
};

const AdminUsersPage = () => {
  return <UsersPageComponent fetchUsers={fetchUsers} deleteUser={deleteUser} />;
};

export default AdminUsersPage;
