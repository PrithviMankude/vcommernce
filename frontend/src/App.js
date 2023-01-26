import React from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import {
  ProtectedRoutesComponent,
  HeaderComponent,
  FooterComponent,
  UserChatComponent,
  RoutesWithUserChatComponent,
} from './components';
import {
  CartPage,
  HomePage,
  LoginPage,
  ProductDetailsPage,
  ProductListPage,
  RegisterPage,
  UserCartDetailsPage,
  UserOrderDetailsPage,
  UserProfilePage,
  UserOrdersPage,
  AdminAnalyticsPage,
  AdminChatsPage,
  AdminCreateProductPage,
  AdminEditProductPage,
  AdminEditUserPage,
  AdminOrderDetailsPage,
  AdminOrdersPage,
  AdminProductsPage,
  AdminUsersPage,
} from './pages';
import ScrollToTop from './utils/ScrollToTop';

function App() {
  return (
    <BrowserRouter>
      <ScrollToTop />
      <HeaderComponent />
      <Routes>
        <Route element={<RoutesWithUserChatComponent />}>
          <Route path='/' element={<HomePage />} />
          <Route path='/product-list' element={<ProductListPage />} />
          <Route path='/product-details/:id' element={<ProductDetailsPage />} />
          <Route path='/cart' element={<CartPage />} />
          <Route path='/login' element={<LoginPage />} />
          <Route path='/register' element={<RegisterPage />} />
          <Route path='*' element={'Page does not exist, 404 error'} />
        </Route>
        {/*User - Protected Page */}
        <Route element={<ProtectedRoutesComponent admin={false} />}>
          <Route path='/user' element={<UserProfilePage />} />
          <Route path='/user/my-orders' element={<UserOrdersPage />} />
          <Route path='/user/cart-details' element={<UserCartDetailsPage />} />
          <Route
            path='/user/order-details/:id'
            element={<UserOrderDetailsPage />}
          />
        </Route>

        {/* Admin Protected Routes */}
        <Route element={<ProtectedRoutesComponent admin={true} />}>
          <Route path='/admin/users' element={<AdminUsersPage />} />
          <Route path='/admin/edit-user' element={<AdminEditUserPage />} />
          <Route path='/admin/products/' element={<AdminProductsPage />} />
          <Route
            path='/admin/create-new-product'
            element={<AdminCreateProductPage />}
          />
          <Route
            path='/admin/edit-product/:id'
            element={<AdminEditProductPage />}
          />
          <Route path='/admin/orders' element={<AdminOrdersPage />} />
          <Route
            path='/admin/order-details/:id'
            element={<AdminOrderDetailsPage />}
          />
          <Route path='/admin/chats' element={<AdminChatsPage />} />
          <Route path='/admin/analytics' element={<AdminAnalyticsPage />} />
        </Route>
      </Routes>
      {/*<FooterComponent /> */}
    </BrowserRouter>
  );
}

export default App;
