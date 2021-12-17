const AWS = require('aws-sdk');
const docClient = new AWS.DynamoDB.DocumentClient();
const { dynamoClient, dynamoDB, TABLE_NAME } = require('./aws/dynamo');

const getReviews = async () => {
  const params = {
    TableName: TABLE_NAME,
  };
  const reviews = await dynamoClient.scan(params).promise();
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
  return items[typeOfLike].L.findIndex((e) => e.S === userId);
};

const addLikeToReview = async (reviewObj) => {
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
  return await dynamoClient.update(params).promise();
};

const addDislikeToReview = async (reviewObj) => {
  // check if liked
  const params = {
    TableName: 'reviews',
    Key: {
      reviewId: reviewObj.reviewId,
    },
    UpdateExpression: 'set #dislikeTings = list_append(#dislikeTings, :vals)',
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
  const dislikeContent = await getLikeById(reviewObj.reviewId, 'likes');
  const likeIndex = likeContent.Item.dislikes.L.findIndex(
    (e) => e.S === reviewObj.userId
  );
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
  const likeContent = await getLikeById(reviewObj.reviewId, 'dislikes');
  const likeIndex = likeContent.Item.lislikes.L.findIndex(
    (e) => e.S === reviewObj.userId
  );

  const params = {
    TableName: 'reviews',
    Key: {
      reviewId: reviewObj.reviewId,
    },
    UpdateExpression: `remove dislikes[${likeIndex}]`,
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

// const addLikeToReview = async (reviewObj) => {
//   console.log('addLikeToReview called: ', reviewObj);
//   const params = {
//     TableName: 'reviews',
//     Key: {
//       reviewId: reviewObj.reviewId,
//     },
//     UpdateExpression: 'ADD #likes :likeId',
//     ExpressionAttributeNames: {
//       '#likes': 'likes',
//     },
//     ExpressionAttributeValues: {
//       ':likeId': docClient.createSet(reviewObj.userId),
//     },
//     ReturnValues: 'UPDATED_NEW',
//   };
//   return await dynamoClient.update(params).promise();
// };

// const addDislikeToReview = async (reviewObj) => {
//   const params = {
//     TableName: 'reviews',
//     Key: {
//       reviewId: reviewObj.reviewId,
//     },
//     UpdateExpression: `SET #c list_append(#c, :dislikeId)`,
//     ExpressionAttributeNames: {
//       '#c': 'dislikes',
//     },
//     ExpressionAttributeValues: {
//       ':vals': ['user2'],
//     },
//     ReturnValues: 'UPDATED_NEW',
//   };
//   return await docClient.update(params).promise();
// };
