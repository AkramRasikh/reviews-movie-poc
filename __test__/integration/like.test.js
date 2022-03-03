const request = require('supertest');
const { server: integrationServer } = require('../../app');
const { createTables } = require('../../aws/create-table');
const { executeDeleteTables } = require('../../aws/delete-table');
const { dynamoDB } = require('../../aws/dynamo');

beforeAll(async () => {
  await createTables();
  // review isn't init(ed)
  // await createReview({
  //   reviewId: '1',
  //   likes: [{ S: 'user1' }],
  //   dislikes: [],
  // });
});

afterAll(async () => {
  integrationServer.close();
  await executeDeleteTables();
});

const likeBody = {
  reviewId: '1',
  userId: 'user1',
  currentLike: 'like',
};

test('should remove a like from reviews and add to dislikes', async () => {
  await request(integrationServer)
    .post('/add-review')
    .send(likeBody)
    .expect(200);
  const params = {
    TableName: 'reviews',
    Key: {
      reviewId: {
        S: likeBody.reviewId,
      },
    },
  };
  const { Item: items } = await dynamoDB.getItem(params).promise();
  console.log('items (test): ', items);
  expect(items.dislikes.L.length).toBe(0);
  expect(items.likes.L.length).toBe(1);
});
