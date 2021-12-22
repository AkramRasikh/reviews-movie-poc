const { dynamoDB } = require('./dynamo');

const params = {
  TableName: 'reviews',
};

const executeDeleteTables = async () => {
  try {
    await dynamoDB.deleteTable(params).promise();
  } catch (error) {
    console.error('Unable to delete table: ', error);
  }
};

module.exports = {
  executeDeleteTables,
};