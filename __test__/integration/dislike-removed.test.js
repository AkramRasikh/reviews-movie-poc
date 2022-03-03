const request = require('supertest');
const { server: integrationServer } = require('../../app');
const { createTables } = require('../../aws/create-table');
const { executeDeleteTables } = require('../../aws/delete-table');
const { dynamoDB } = require('../../aws/dynamo');
const { createReview } = require('../../aws/put-item');

beforeAll(async () => {
  await createTables();
  await createReview({
    reviewId: '1',
    dislikes: [{ S: 'user1' }],
    likes: [],
  });
});

afterAll(async () => {
  integrationServer.close();
  await executeDeleteTables();
});

const dislikeRemovedBody = {
  reviewId: '1',
  userId: 'user1',
  prevLike: 'dislike',
  currentLike: '',
};

test('should remove a like from reviews and add to dislikes', async () => {
  await request(integrationServer)
    .post('/add-review')
    .send(dislikeRemovedBody)
    .expect(200);
  const params = {
    TableName: 'reviews',
    Key: {
      reviewId: {
        S: dislikeRemovedBody.reviewId,
      },
    },
  };
  const { Item: items } = await dynamoDB.getItem(params).promise();
  expect(items.dislikes.L.length).toBe(0);
  expect(items.likes.L.length).toBe(0);
});