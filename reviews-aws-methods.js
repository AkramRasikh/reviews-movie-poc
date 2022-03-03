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

const constructLikeParams = (reviewId, userId, statement, typeOfLike) => {
  const params = {
    TableName: 'reviews',
    Key: {
      reviewId: reviewId,
    },
    UpdateExpression:
      `set #${typeOfLike}sAttrName = list_append(#${typeOfLike}sAttrName, :vals)` +
      statement,
    ExpressionAttributeNames: {
      [`#${typeOfLike}sAttrName`]: `${typeOfLike}s`,
    },
    ExpressionAttributeValues: {
      ':vals': [userId],
    },
    ReturnValues: 'UPDATED_NEW',
  };

  return params;
};

const addLikeToReview = async (reviewObj) => {
  console.log('function init addLikeToReview: ', reviewObj);
  let removeStatement;
  if (reviewObj.prevLike === 'dislike') {
    const dislikeIndex = await getLikeById(
      reviewObj.reviewId,
      'dislikes',
      reviewObj.userId
    );
    removeStatement = ` remove dislikes[${dislikeIndex}]`;
  }
  const params = constructLikeParams(
    reviewObj.reviewId,
    reviewObj.userId,
    removeStatement,
    'like'
  );

  return await dynamoClient.update(params).promise();
};

const addDislikeToReview = async (reviewObj) => {
  let removeLikeStatement;
  if (reviewObj.prevLike === 'like') {
    const likeIndex = await getLikeById(
      reviewObj.reviewId,
      'likes',
      reviewObj.userId
    );
    removeLikeStatement = ` remove likes[${likeIndex}]`;
  }
  const params = constructLikeParams(
    reviewObj.reviewId,
    reviewObj.userId,
    removeLikeStatement,
    'dislike'
  );
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

const likeToReview = async (reviewReq) => {
  if (reviewReq.currentLike === 'like') {
    console.log('#1: ');
    await addLikeToReview(reviewReq);
  } else if (reviewReq.currentLike === 'dislike') {
    console.log('#2');
    await addDislikeToReview(reviewReq);
  } else if (reviewReq.prevLike === 'dislike') {
    console.log('#3');
    await removeDislikeFromReview(reviewReq);
  } else {
    console.log('#4');
    await removeLikeFromReview(reviewReq);
  }
};

module.exports = {
  getReviews,
  addReview,
  addLikeToReview,
  addDislikeToReview,
  removeLikeFromReview,
  removeDislikeFromReview,
  likeToReview,
};
