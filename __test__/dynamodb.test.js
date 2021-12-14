// const { mockDdb } = require("../dynamo-mock");

// it("should insert payment into table", async () => {
//   await mockDdb
//     .put({ TableName: "payments", Item: { paymentId: "1", amount: "1000" } })
//     .promise();

//   const { Item } = await mockDdb
//     .get({ TableName: "payments", Key: { paymentId: "1", amount: '1000' } })
//     .promise();

//   expect(Item).toEqual({
//     paymentId: "1",
//     amount: "1000"
//   });
// });
