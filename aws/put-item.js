// const uuid = require('uuid');
// const { dynamoClient } = require('./dynamo');

// const params = {
//   Item: {
//     paymentId: {
//       S: uuid.v1(),
//     },
//     amount: {
//       S: (Math.floor(Math.random() * 100) + 1).toString(),
//     },
//   },
//   ReturnConsumedCapacity: 'TOTAL',
//   TableName: 'payments',
// };

// dynamoClient.putItem(params, function (err, data) {
//   if (err) console.log('err', err, err.stack);
//   else console.log('success!', data); // successful response
// });
