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

// const getDynamoTables = async () => {
//   try {
//     const { TableNames } = await dynamoDB
//       .listTables({ ExclusiveStartTableName })
//       .promise();
//     if (TableNames.length === 0) {
//       await createTables();
//     }
//   } catch (error) {
//     console.log('error listing/creating tables: ', error);
//   }
// };

module.exports = {
  // getDynamoTables,
  createTables,
};
