import UserOrderDetailsPageComponent from './components/UserOrderDetailsPageComponent';
import { useSelector } from 'react-redux';
import axios from 'axios';
import { loadScript } from '@paypal/paypal-js';
import StripeCheckout from 'react-stripe-checkout';

const UserOrderDetailsPage = () => {
  const userInfo = useSelector((state) => state.user.userInfo);

  const cartItems = useSelector((state) => state.cart.cartItems);
  const itemsCount = useSelector((state) => state.cart.itemsCount);
  const cartSubtotal = useSelector((state) => state.cart.cartSubtotal);

  const getOrder = async (orderId) => {
    try {
      const { data } = await axios.get('/api/orders/user/' + orderId);
      return data;
    } catch (err) {
      throw new Error(err.response.data);
    }
  };

  const getUser = async () => {
    try {
      const { data } = await axios.get('/api/users/profile/' + userInfo._id);

      return data;
    } catch (err) {
      throw new Error(err.response.data);
    }
  };
  const loadPaypalScript = (cartSubtotal, cartItems) => {
    console.log('Paypal..');
    loadScript({
      'client-id':
        'AXVFBO9l-fG5xmDsKKVDPxqJQJzDaHICLhrPYOOTmJucGe4u_ncy9RgjQ4S1C51s16Ak0uAc8p_TBCAv',
    })
      .then((paypal) => {
        paypal
          .Buttons(buttons(cartSubtotal, cartItems))
          .render('#paypal-container-element');
      })
      .catch((err) =>
        console.log(
          'Failed to load the paypal SDK JS script',
          err.response.data
        )
      );
  };

  const buttons = (cartSubtotal, cartItems) => {
    return {
      createOrder: function (data, actions) {
        return actions.order.create({
          purchase_units: [
            {
              amount: {
                value: cartSubtotal,
                breakdown: {
                  item_total: {
                    currency_code: 'USD',
                    value: cartSubtotal,
                  },
                },
              },
              items: cartItems.map((product) => {
                return {
                  name: product.name,
                  unit_amount: {
                    currency_code: 'USD',
                    value: product.price,
                  },
                  quantity: product.quantity,
                };
              }),
            },
          ],
        });
      },
      onCancel: onCancelHandler,
      onApprove: onApproveHandler,
      onError: onErrorHandler,
    };
  };

  const onCancelHandler = function () {
    console.log('In onCancelHandler');
  };

  const onApproveHandler = function () {
    console.log('In onApproveHandler');
  };

  const onErrorHandler = function () {
    console.log('In onErrorHandler');
  };

  //Stripe Paymant: Checkout working

  const updateOrder = async (orderId) => {
    const { data } = await axios.put('/api/orders/paid/' + orderId);
    if (data) {
      console.log('Updated the order to the backend');
    }
    return data;
  };

  const stripeCheckOut = async (
    cartSubtotal,
    cartItems,
    id,
    updateStateAfterOrder
  ) => {
    try {
      const { data } = await axios.post('/api/payments/stripeCheckout', {
        cartSubtotal,
      });
      window.open(data.url);
      console.log('In Front end:, OrderId', data, id);
      console.log('orderId', id);
      if (data.msg === 'success') {
        //Update the order completed details details in db
        console.log('order paid successfully, now updating the backend');
        const data = await updateOrder(id);
        console.log('Paid At:', data.isPaid);
        if (data.isPaid) {
          console.log('Updating the order states now...');
          updateStateAfterOrder(data.paidAt);
        }
      }
    } catch (err) {
      throw new Error(err.response.data);
    }
  };

  /************/

  //Stripe-checkout
  /*
  const handleToken = async (token) => {
    try {
      console.log('Entering the handleToken, calling backend');
      const { data } = await axios.post('/api/payments/stripeCheckout', {
        cartSubtotal,
      });
      console.log(data);
      window.alert('Transaction successful');
    } catch (err) {
      window.alert('Transaction Failed');
      throw new Error(err.response.data);
    }
  };

  const stripeCheckOut = async (cartSubtotal, cartItems) => {
    {
      console.log('Entered here');
    }
    {
      
    <StripeCheckout
      stripeKey='pk_test_51MT81bSGEGmZ7nVzxefy6dqXnHSIwe4y8cR6tCJOtkDTcJHFgSYKb4RKKnieLP1Yf3m4z5KHfEMk0EZqh4KgY8Ts00z5pYXAUr'
      token={handleToken}
      amount={cartSubtotal}
    />;
  
    }
  };

  */

  return (
    <UserOrderDetailsPageComponent
      userInfo={userInfo}
      getUser={getUser}
      getOrder={getOrder}
      loadPaypalScript={loadPaypalScript}
      stripeCheckOut={stripeCheckOut}
    />
  );
};

export default UserOrderDetailsPage;
