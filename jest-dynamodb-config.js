module.exports = {
  tables: [
    {
      TableName: `reviews`,
      KeySchema: [
        { AttributeName: 'reviewId', KeyType: 'HASH' },
        { AttributeName: 'amount', KeyType: 'RANGE' },
      ],
      AttributeDefinitions: [{ AttributeName: 'reviewId', AttributeType: 'S' }],
      ProvisionedThroughput: { ReadCapacityUnits: 1, WriteCapacityUnits: 1 },
    },
  ],
};
