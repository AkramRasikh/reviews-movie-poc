const { dynamoDB } = require('./dynamo');

const createTableParams = {
  TableName: `reviews`,
  KeySchema: [{ AttributeName: 'reviewId', KeyType: 'HASH' }],
  AttributeDefinitions: [{ AttributeName: 'reviewId', AttributeType: 'S' }],
  ProvisionedThroughput: { ReadCapacityUnits: 1, WriteCapacityUnits: 1 },
};

// const ExclusiveStartTableName = 'reviews';

const createTables = async () => {
  try {
    await dynamoDB.createTable(createTableParams).promise();
  } catch (error) {
    console.log('err creating table');
  }
};

module.exports = {
  // getDynamoTables,
  createTables,
};
