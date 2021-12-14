const uuid = require('uuid');

const generateReviews = () => ({
  PutRequest: {
    Item: {
      reviewId: {
        S: uuid.v1(),
      },
      likes: {
        SS: [uuid.v1()],
      },
      dislikes: {
        SS: [uuid.v1()],
      },
    },
  },
});

module.exports = { generateReviews };
