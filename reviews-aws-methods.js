// const docClient = new AWS.DynamoDB.DocumentClient();
const { dynamoClient, dynamoDB, TABLE_NAME } = require('./aws/dynamo');

const getReviews = async () => {
  const params = {
    TableName: TABLE_NAME,
  };
  console.log('hitting getReviews');
  const reviews = await dynamoClient.scan(params).promise();
  console.log('reviews: ', reviews);
  return reviews;
};

const addReview = async (review) => {
  const params = {
    TableName: TABLE_NAME,
  };
  return await dynamoClient.put(params).promise();
};

// #util
const getLikeById = async (reviewId, typeOfLike, userId) => {
  const params = {
    TableName: 'reviews',
    Key: {
      reviewId: {
        S: reviewId,
      },
    },
    AttributesToGet: [typeOfLike],
  };
  const { Item: items } = await dynamoDB.getItem(params).promise();
  const likeItemsIndex = items[typeOfLike].L.findIndex((e) => e.S === userId);
  return likeItemsIndex;
};

const addLikeToReview = async (reviewObj) => {
  console.log('function init addLikeToReview: ', reviewObj);
  let removeDislikeStatement;
  if (reviewObj.prevLike === 'dislike') {
    const dislikeIndex = await getLikeById(
      reviewObj.reviewId,
      'dislikes',
      reviewObj.userId
    );
    removeDislikeStatement = ` remove dislikes[${dislikeIndex}]`;
  }
  const params = {
    TableName: 'reviews',
    Key: {
      reviewId: reviewObj.reviewId,
    },
    UpdateExpression:
      `set #likeTings = list_append(#likeTings, :vals)` +
      removeDislikeStatement,
    ExpressionAttributeNames: {
      '#likeTings': 'likes',
    },
    ExpressionAttributeValues: {
      ':vals': [reviewObj.userId],
    },
    ReturnValues: 'UPDATED_NEW',
  };
  console.log('about to update via addLikeToReview');
  return await dynamoClient.update(params).promise();
};

const addDislikeToReview = async (reviewObj) => {
  // check if liked
  let removeLikeStatement;
  if (reviewObj.prevLike === 'like') {
    const likeIndex = await getLikeById(
      reviewObj.reviewId,
      'likes',
      reviewObj.userId
    );
    removeLikeStatement = ` remove likes[${likeIndex}]`;
  }

  const params = {
    TableName: 'reviews',
    Key: {
      reviewId: reviewObj.reviewId,
    },
    UpdateExpression:
      'set #dislikeTings = list_append(#dislikeTings, :vals)' +
      removeLikeStatement,
    ExpressionAttributeNames: {
      '#dislikeTings': 'dislikes',
    },
    ExpressionAttributeValues: {
      ':vals': [reviewObj.userId],
    },
    ReturnValues: 'UPDATED_NEW',
  };
  return await dynamoClient.update(params).promise();
};

const removeLikeFromReview = async (reviewObj) => {
  const likeIndex = await getLikeById(
    reviewObj.reviewId,
    'likes',
    reviewObj.userId
  );
  console.log('likeIndex: ', likeIndex);
  const params = {
    TableName: 'reviews',
    Key: {
      reviewId: reviewObj.reviewId,
    },
    UpdateExpression: `remove likes[${likeIndex}]`,
    ReturnValues: 'UPDATED_NEW',
  };
  return await dynamoClient.update(params).promise();
};

const removeDislikeFromReview = async (reviewObj) => {
  const dislikeIndex = await getLikeById(
    reviewObj.reviewId,
    'dislikes',
    reviewObj.userId
  );
  const params = {
    TableName: 'reviews',
    Key: {
      reviewId: reviewObj.reviewId,
    },
    UpdateExpression: `remove dislikes[${dislikeIndex}]`,
    ReturnValues: 'UPDATED_NEW',
  };
  return await dynamoClient.update(params).promise();
};

module.exports = {
  getReviews,
  addReview,
  addLikeToReview,
  addDislikeToReview,
  removeLikeFromReview,
  removeDislikeFromReview,
};
