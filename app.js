require('dotenv').config();
const express = require('express');
const app = express();
const bodyParser = require('body-parser');
const { getReviews, addLikeToReview } = require('./reviews-aws-methods');

app.use(bodyParser.json());

app.get('/', async function (_, res) {
  console.log('hitting reviews GET');
  try {
    const { Items: allReviews } = await getReviews();
    res.status(200).send(allReviews);
  } catch (error) {
    res.status(400).send('err');
  }
});

app.post('/add-review', async function (req, res) {
  // assume validation
  const amountReq = req.body;
  // reviewId = film
  // dislikes = push to array
  // likes = push to array
  console.log('amountReq: ', amountReq);
  try {
    await addLikeToReview(amountReq);
    res.status(200).send('review sent');
  } catch (error) {
    console.log('fail');
    res.status(400).send('failed to send review');
  }
});

const port =
  process.env.NODE_ENV === 'test' ? process.env.HOST_TEST : process.env.HOST;
app.listen(port);

console.log('running on port ', port);

module.exports = {
  app,
};
