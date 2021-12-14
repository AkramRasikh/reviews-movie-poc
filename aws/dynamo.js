const AWS = require('aws-sdk');

AWS.config.update({
  region: 'local',
  accessKeyId: 'x',
  secretAccessKey: 'x',
  endpoint: 'http://localhost:8000',
});

const dynamoClient = new AWS.DynamoDB.DocumentClient();
const dynamoDB = new AWS.DynamoDB();

const TABLE_NAME = 'reviews';

module.exports = {
  dynamoClient,
  dynamoDB,
  TABLE_NAME,
};
