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
  const res = await dynamoDB.getItem(params).promise();
  if (res?.Item) {
    const likeItemsIndex = res.Item[typeOfLike]?.L?.findIndex(
      (e) => e.S === userId
    );
    return likeItemsIndex;
  }
  console.log('just here (res)::?: ');
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
  const setProperty = (likeProperty) => {
    if (typeOfLike === likeProperty) {
      return [{ S: userId }];
    }
    return [];
  };

  const params = {
    Item: {
      reviewId: {
        S: reviewId,
      },
      dislikes: { L: setProperty('dislike') },
      likes: { L: setProperty('like') },
    },
    ReturnConsumedCapacity: 'TOTAL',
    TableName: 'reviews',
  };
  console.log('params: ,', params);

  return params;
};

const handleLike = async (reviewObj) => {
  const { currentLike, prevLike, reviewId, userId } = reviewObj;
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

const handleRemoveLike = async (reviewObj) => {
  const index = await getLikeById(
    reviewObj.reviewId,
    `${reviewObj.prevLike}s`,
    reviewObj.userId
  );
  const params = constructRemoveLikeParams(
    reviewObj.reviewId,
    reviewObj.prevLike,
    index
  );
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
