const { dynamoClient, TABLE_NAME } = require('./aws/dynamo');

const getReviews = async () => {
  const params = {
    TableName: TABLE_NAME,
  };
  const reviews = await dynamoClient.scan(pxarams).promise();
  return reviews;
};

const addReview = async (review) => {
  const params = {
    TableName: TABLE_NAME,
    // Item: {
    //   reviewId:
    // },
  };
  return await dynamoClient.put(params).promise();
};

const addLikeToReview = async (review) => {
  // const params = {
  //   TableName: TABLE_NAME,
  //   UpdateExpression:
  //   Item: {
  //     reviewId: review.reviewId,
  //     likes: [review.userId],
  //   },
  // };
  // return await dynamoClient.updateItem(params).promise();
};

module.exports = {
  getReviews,
  addReview,
  addLikeToReview,
};
