const request = require('supertest');
const { app: integrationServer } = require('../../app');
const { executeDeleteTables } = require('../../aws/delete-table');

beforeAll(() => {
  console.log('before all');
});

afterAll(async () => {
  console.log('after all');
  await executeDeleteTables(); // avoid jest open handle error
});

test('Integration. responds with reviews', async () => {
  await request(integrationServer)
    .get('/')
    .expect(200)
    .expect([
      { reviewId: 1, likes: ['user1', 'user2'], dislikes: ['user3', 'user4'] },
    ]);
});
