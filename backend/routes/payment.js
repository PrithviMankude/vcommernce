const express = require('express');
const app = express();
const router = express.Router();
const ObjectId = require('mongodb').ObjectId;
const env = require('dotenv').config();

const { v4: uuidv4 } = require('uuid');
//usage - uuidv4()

// This is your test secret API key.
// const stripe = require('stripe')(
//   'sk_test_51MT81bSGEGmZ7nVzgD39m1z6vdAO4ytpkPHFkSqYg1YoDBJ8naWFqs45Qf2URuqR8XLYIzcb9cjFfFneOWJpDYS000TF6yBdRc'
// );

const stripe = require('stripe')(process.env.STRIPE_SECRET_KEY);

//const YOUR_DOMAIN = `http://localhost:${process.env.PORT}`;
const YOUR_DOMAIN = 'http://localhost:5000';

//SHould be /api/payment

//CheckOut way
router.post('/stripeCheckout', async (req, res) => {
  app.use(express.json());
  const { cartSubtotal } = req.body;

  const id = ObjectId();
  console.log('In stripe checkout', id);

  const product = await stripe.products.create({ name: 'VCommerce' });

  const price = await stripe.prices.create({
    product: product.id,
    unit_amount: cartSubtotal * 100,
    currency: 'inr',
  });

  const session = await stripe.checkout.sessions.create({
    line_items: [
      {
        price: price.id,
        quantity: 1,
      },
    ],
    mode: 'payment',
    success_url: `${YOUR_DOMAIN}?success=true`,
    cancel_url: `${YOUR_DOMAIN}?canceled=true`,
  });

  res.status(200).json({ msg: 'success', id: session.id, url: session.url });
});

router.post('/stripe', async (req, res) => {
  try {
    console.log('In stripe direct billing route');
    console.log(req.body);
    const { cartSubtotal } = req.body;
    console.log(cartSubtotal);
    const idempontencyKey = uuidv4();

    //Create Customer
    const customer = await stripe.customers.create({});
    if (customer) {
      console.log('Customer created, now setting hte payment');
    }

    const paymentMethods = await stripe.paymentMethods.list({
      customer: 'cus_NDt7GiITKcP7va',
      type: 'card',
    });
    console.log('Out of payment method');

    console.log(paymentMethods);

    //Now Intent
    console.log('Now setting the intent');
    console.log(/********************************/);

    const res = stripe.paymentMethods.map((x) => console.log(x));

    const paymentIntent = await stripe.paymentIntents.create({
      amount: cartSubtotal * 100,
      currency: 'inr',
      customer: 'cus_NDt7GiITKcP7va',
      payment_method: '{{PAYMENT_METHOD_ID}}',
      //payment_method_types: ['card'],
    });

    console.log(Ok);
    res.status(200).json(Ok);
  } catch (err) {
    throw new Error(err.response);
  }
});

/*

router.post('/stripeTry', async (req, res) => {


  try




  console.log('In stripe direct billing route');
  console.log(req.body);
  const { cartSubtotal } = req.body;
  console.log(cartSubtotal);
  const idempontencyKey = uuidv4();

  const customer = await stripe.customers.create()
  if(customer){
    console.log('Customer created, now setting hte payment')

  }

  const paymentStatus = await stripe.paymentMethods.list({
        customer: custId,
        type: 'card',
      })

  console.log(paymentStatus)

  console.log('Now setting the intent')

  const paymentIntent = await stripe.paymentIntents.create({
        amount: cartSubtotal * 100,
        currency: 'inr',
        customer: custId,
        payment_method_types: ['card'],
       
      });

      console.log('Exiting the intent..');

    })

*/

/*

  return stripe.customers
    .create()
    .then((customer) => {
      console.log('Customers created,');
      const custId = ObjectId();

      console.log('Now seting payment type to card');
      const paymentMethods = stripe.paymentMethods.list({
        customer: custId,
        type: 'card',
      })
      */

/*
      console.log('Now INTENT');

      const paymentIntent = stripe.paymentIntents.create({
        amount: cartSubtotal * 100,
        currency: 'usd',
        customer: custId,
        payment_method_types: ['card'],
        //payment_method: payment_method_types: ['card'] ,
      });

      console.log('Exiting the intent..');
      
    })
    .then((result) => {
      console.log('charge OK');
      console.log(result);
      res.status(200).json(result);
    })
    .catch((err) => console.log(err));
});

*/

//Direct Ordering

module.exports = router;
