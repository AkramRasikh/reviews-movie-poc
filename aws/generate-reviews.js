const uuid = require('uuid');

const generateReviews = () => ({
  PutRequest: {
    Item: {
      reviewId: {
        S: uuid.v1(),
      },
      likes: {
        L: [{ S: uuid.v1() }],
      },
      dislikes: {
        L: [{ S: uuid.v1() }],
      },
    },
  },
});

module.exports = { generateReviews };
