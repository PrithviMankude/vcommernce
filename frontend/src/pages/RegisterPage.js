import RegisterPageComponent from './component/RegisterPageComponent';
import { registerUser } from '../redux/actions/userActions';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';

const RegisterPage = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { isLoading, showAlert, showAlertText } = useSelector(
    (state) => state.user
  );

  const registerPageApiRequest = async (name, lastName, email, password) => {
    const result = await dispatch(
      registerUser(name, lastName, email, password)
    );
    console.log(result);
    const { success, userCreated } = result;
    success && navigate('/user', { replace: true });
  };

  return (
    <RegisterPageComponent
      registerPageApiRequest={registerPageApiRequest}
      isLoading={isLoading}
      showAlert={showAlert}
      showAlertText={showAlertText}
    />
  );
};

export default RegisterPage;
