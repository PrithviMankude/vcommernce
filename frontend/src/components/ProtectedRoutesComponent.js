import { useState, useEffect } from 'react';
import { Outlet, Navigate } from 'react-router-dom';
import UserChatComponent from './user/UserChatComponent';
import axios from 'axios';
import { LoginPage } from '../pages';

const ProtectedRoutesComponent = ({ admin }) => {
  const [isAuth, setIsAuth] = useState();
  useEffect(() => {
    /*
    async function fetchData() {
      
      try {
        const { data } = await axios.get('/api/get-token');
        console.log(data);        
        if (data.token) {          
          setIsAuth(data.data.token);
          console.log(isAuth);
        }        
        return isAuth;
      } catch (err) {
        console.log(err.response.data);
      }
    }

    fetchData();
    */
    //res.data.token
    axios.get('/api/get-token').then(function (data) {
      if (data.data.token) {
        setIsAuth(data.data.token);
      }
      return isAuth;
    });
  }, [isAuth]);

  if (isAuth === undefined) return <LoginPage />;

  return isAuth && admin && isAuth !== 'admin' ? (
    <Navigate to='/login' />
  ) : isAuth && admin ? (
    <Outlet />
  ) : isAuth && !admin ? (
    <>
      <UserChatComponent />
      <Outlet />
    </>
  ) : (
    <Navigate to='/login' />
  );
};

export default ProtectedRoutesComponent;
