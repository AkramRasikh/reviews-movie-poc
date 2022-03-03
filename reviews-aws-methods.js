// const docClient = new AWS.DynamoDB.DocumentClient();
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
  const res = await dynamoDB.getItem(params).promise();
  if (res?.Item) {
    const likeItemsIndex = res.Item[typeOfLike].L.findIndex(
      (e) => e.S === userId
    );
    return likeItemsIndex;
  }
  return false;
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

const constructRemoveLikeParams = (reviewId, prevLike, index) => {
  const params = {
    TableName: 'reviews',
    Key: {
      reviewId: reviewId,
    },
    UpdateExpression: `remove ${prevLike}s[${index}]`,
    ReturnValues: 'UPDATED_NEW',
  };
  return params;
};

const constructInitParam = (reviewId, userId, typeOfLike) => {
  const params = {
    Item: {
      reviewId: {
        S: reviewId,
      },
      dislikes: { L: typeOfLike === 'dislike' ? [{ S: userId }] : [] },
      likes: { L: typeOfLike === 'like' ? [{ S: userId }] : [] },
    },
    ReturnConsumedCapacity: 'TOTAL',
    TableName: 'reviews',
  };
  return params;
};

const handleLike = async ({ currentLike, prevLike, reviewId, userId }) => {
  const likeIndex = await getLikeById(reviewId, `${prevLike}s`, userId);

  if (!likeIndex) {
    const initParams = constructInitParam(reviewId, userId, currentLike);
    return await dynamoDB.putItem(initParams).promise();
  }
  const removeLikeStatement = ` remove ${prevLike}s[${likeIndex}]`;
  const params = constructLikeParams(
    reviewId,
    userId,
    removeLikeStatement,
    `${currentLike}`
  );
  return await dynamoClient.update(params).promise();
};

const handleRemoveLike = async ({ reviewId, prevLike, userId }) => {
  const index = await getLikeById(reviewId, `${prevLike}s`, userId);
  const params = constructRemoveLikeParams(reviewId, prevLike, index);
  return await dynamoClient.update(params).promise();
};

const likeToReview = async (reviewReq) => {
  if (reviewReq.currentLike) {
    await handleLike(reviewReq);
  } else {
    await handleRemoveLike(reviewReq);
  }
};

module.exports = {
  getReviews,
  addReview,
  likeToReview,
};
