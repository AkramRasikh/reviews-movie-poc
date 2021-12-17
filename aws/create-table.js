const { dynamoDB } = require('./dynamo');

const params = {
  TableName: `reviews`,
  KeySchema: [{ AttributeName: 'reviewId', KeyType: 'HASH' }],
  AttributeDefinitions: [{ AttributeName: 'reviewId', AttributeType: 'S' }],
  ProvisionedThroughput: { ReadCapacityUnits: 1, WriteCapacityUnits: 1 },
};

console.log('creating tables');

dynamoDB.createTable(params, console.log);
