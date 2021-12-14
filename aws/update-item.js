const AWS = require('aws-sdk');
const docClient = new AWS.DynamoDB.DocumentClient();
const { dynamoClient } = require('./dynamo');

const addLikeToReview = async (likeId) => {
  const params = {
    TableName: 'reviews',
    Key: {
      reviewId: '5e52abd5-5cf2-11ec-a6e4-616b1397fff8',
    },
    UpdateExpression: 'ADD #likes :likeId',
    ExpressionAttributeNames: {
      '#likes': 'likes',
    },
    ExpressionAttributeValues: {
      ':likeId': docClient.createSet([likeId]),
    },
    ReturnValues: 'UPDATED_NEW',
  };
  return await dynamoClient.update(params).promise();
};

(async () => {
  await addLikeToReview('2');
})().catch((err) => {
  console.error(err);
});
