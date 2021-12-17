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
  const reviewReq = req.body;
  // reviewId = film
  // dislikes = push to array
  // likes = push to array
  try {
    if (req.body.currentLike === 'like') {
      await addLikeToReview(reviewReq);
    } else if (req.body.currentLike === 'dislike') {
      await addDislikeToReview(reviewReq);
    } else if (req.body.prevLike === 'dislike') {
      await removeDislikeFromReview(reviewReq);
    } else {
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
app.listen(port);

console.log('running on port ', port);

module.exports = {
  app,
};
