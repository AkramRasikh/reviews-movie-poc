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
    if (req.body.currentLike === 'like') {
      console.log('#1: ');
      await addLikeToReview(reviewReq);
    } else if (req.body.currentLike === 'dislike') {
      console.log('#2');
      await addDislikeToReview(reviewReq);
    } else if (req.body.prevLike === 'dislike') {
      console.log('#3');
      await removeDislikeFromReview(reviewReq);
    } else {
      console.log('#4');
      await removeLikeFromReview(reviewReq);
    }
    res.status(200).send('review sent');
  } catch (error) {
    console.log('fail');
    res.status(400).send('failed to send review');
  }
});

const port =
  process.env.NODE_ENV === 'test' ? process.env.HOST_TEST : process.env.HOST;

let server = app.listen(port);

console.log('running on port ', port);

module.exports = {
  server,
};
