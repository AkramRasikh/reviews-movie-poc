const request = require('supertest');
const { server: integrationServer } = require('../../app');
const { createTables } = require('../../aws/create-table');
const { executeDeleteTables } = require('../../aws/delete-table');
const { generateDynamodbReviews } = require('../../aws/generate-reviews');

beforeAll(async () => {
  console.log('beforeAll');
  await createTables();
  await generateDynamodbReviews();
});

afterAll(async () => {
  console.log('afterAll');
  integrationServer.close();
  await executeDeleteTables();
});

test('should return reviews', async () => {
  const response = await request(integrationServer).get('/').expect(200);
  expect(response.body.length).toBe(2);
  expect(response.body[0].reviewId).toBeDefined();
  expect(response.body[0].likes).toBeDefined();
  expect(response.body[0].dislikes).toBeDefined();
});
