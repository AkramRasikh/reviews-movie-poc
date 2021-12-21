module.exports = {
  tables: [
    {
      TableName: `reviews`,
      KeySchema: [{ AttributeName: 'reviewId', KeyType: 'HASH' }],
      AttributeDefinitions: [{ AttributeName: 'reviewId', AttributeType: 'S' }],
      ProvisionedThroughput: { ReadCapacityUnits: 1, WriteCapacityUnits: 1 },
    },
  ],
};
