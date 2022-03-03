require('dotenv').config();
const express = require('express');
const app = express();
const bodyParser = require('body-parser');
const {
  getReviews,
  addLikeToReview,
  addDislikeToReview,
  removeLikeFromReview,
  removeDislikeFromReview,
  likeToReview,
} = require('./reviews-aws-methods');

app.use(bodyParser.json());

app.get('/', async function (_, res) {
  console.log('hitting GET');
  try {
    const { Items: allReviews } = await getReviews();
    console.log('allReviews: ', allReviews);
    res.status(200).send(allReviews);
  } catch (error) {
    res.status(400).send('err');
  }
});

app.post('/add-review', async function (req, res) {
  const reviewReq = req.body;
  try {
    await likeToReview(reviewReq);
    res.status(200).send('review sent');
  } catch (error) {
    console.log('fail');
    res.status(400).send('failed to send review');
  }
});

const port =
  process.env.NODE_ENV === 'test' ? process.env.HOST_TEST : process.env.HOST;

const server = app.listen(port);

console.log('running on port ', port);

module.exports = {
  server,
};
