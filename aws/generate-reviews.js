const uuid = require('uuid');
const { dynamoDB } = require('./dynamo');

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

let reviewsArr = [];

const params = {
  RequestItems: {
    reviews: reviewsArr,
  },
};

for (let i = 0; i < 2; i++) {
  const reviewItem = generateReviews();
  reviewsArr.push(reviewItem);
}

const generateDynamodbReviews = async () => {
  try {
    await dynamoDB.batchWriteItem(params).promise();
  } catch (error) {
    console.log('error generating reviews: ', error);
  }
};

module.exports = { generateReviews, generateDynamodbReviews };
