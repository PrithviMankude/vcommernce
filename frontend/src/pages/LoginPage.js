import LoginPageComponent from './component/LoginPageComponent';
import { loginUser } from '../redux/actions/userActions';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';

const LoginPage = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { isLoading, showAlert, showAlertText } = useSelector(
    (state) => state.user
  );

  const LoginPageApiRequest = async (email, password, doNotLogout) => {
    const result = await dispatch(loginUser(email, password, doNotLogout));

    //To DO:  move this to component? Or let be here to remove clutter
    const { success, userLoggedIn } = result;
    success && !userLoggedIn.isAdmin
      ? (window.location.href =
          '/user') /*navigate('/user', { replace: true }) */
      : (window.location.href =
          '/admin/orders'); /*navigate('/admin/orders', { replace: true });*/
  };

  return (
    <LoginPageComponent
      LoginPageApiRequest={LoginPageApiRequest}
      isLoading={isLoading}
      showAlert={showAlert}
      showAlertText={showAlertText}
    />
  );
};

export default LoginPage;
