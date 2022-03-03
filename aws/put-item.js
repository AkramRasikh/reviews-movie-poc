const { dynamoDB } = require('./dynamo');

const createReview = async ({ reviewId, dislikes, likes }) => {
  const params = {
    Item: {
      reviewId: {
        S: reviewId,
      },
      dislikes: {
        L: dislikes,
      },
      likes: {
        L: likes,
      },
    },
    ReturnConsumedCapacity: 'TOTAL',
    TableName: 'reviews',
  };

  console.log('pppparams: ', params);

  try {
    await dynamoDB.putItem(params).promise();
  } catch (error) {
    console.log('err adding Item to dynamoDB: ', error);
  }
};

module.exports = {
  createReview,
};
