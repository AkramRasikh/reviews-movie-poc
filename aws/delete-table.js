const { dynamoDB } = require('./dynamo');

const params = {
  TableName: 'reviews',
};

const executeDeleteTables = async () => {
  try {
    const doesExist = await dynamoDB.describeTable(params).promise();
    // console.log('doesExist: ', doesExist);
    if (doesExist) {
      await dynamoDB.deleteTable(params).promise();
    }
  } catch (error) {
    console.error('Unable to delete table: ', error);
  }
};

module.exports = {
  executeDeleteTables,
};
