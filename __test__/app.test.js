const request = require('supertest');
const { app: mockApp } = require('../app');
const paymentMethods = require('../reviews-aws-methods');
jest.mock('../reviews-aws-methods');
jest.mock('uuid', () => ({ v1: () => 'hjhj87878' }));

beforeEach(() => {
  jest.clearAllMocks();
});

it('responds with reviewss', async () => {
  paymentMethods.getReviews.mockImplementation(() => ({
    Items: [
      { reviewId: 1, likes: ['user1', 'user2'], dislikes: ['user3', 'user4'] },
    ],
  }));
  await request(mockApp)
    .get('/')
    .expect(200)
    .expect([
      { reviewId: 1, likes: ['user1', 'user2'], dislikes: ['user3', 'user4'] },
    ]);
});

xit('add payment responds with 200', async () => {
  const amount = 1234;
  await request(mockApp).post('/').send({ amount }).expect(200);
  expect(paymentMethods.addPayment).toHaveBeenCalledWith(amount);
});
