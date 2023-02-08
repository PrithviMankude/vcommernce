import { useSelector } from 'react-redux';
import axios from 'axios';
import HomePageComponent from './component/HomePageComponent';

const getBestsellers = async () => {
  const { data } = await axios.get('/api/products/bestsellers');
  return data;
};

const HomePage = () => {
  const { categories } = useSelector((state) => state.category);
  return (
    <HomePageComponent
      categories={categories}
      getBestsellers={getBestsellers}
    />
  );
};

export default HomePage;
