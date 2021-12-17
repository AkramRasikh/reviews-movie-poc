module.exports = {
  tables: [
    {
      TableName: `reviews`,
      KeySchema: [{ AttributeName: 'reviewId', KeyType: 'HASH' }],
      AttributeDefinitions: [
        { AttributeName: 'reviewId', AttributeType: 'S' },
        { AttributeName: 'likes', AttributeType: 'L' },
        { AttributeName: 'dislikes', AttributeType: 'L' },
      ],
      ProvisionedThroughput: { ReadCapacityUnits: 1, WriteCapacityUnits: 1 },
    },
  ],
};
