import { useSelector } from 'react-redux';

import HomePageComponent from './component/HomePageComponent';
const HomePage = () => {
  const { categories } = useSelector((state) => state.category);
  return <HomePageComponent categories={categories} />;
};

export default HomePage;
