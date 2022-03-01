const request = require('supertest');
const { server: mockApp } = require('../../app');
// const { mockDdb } = require('../../dynamo-mock');
const reviewMethods = require('../../reviews-aws-methods');
jest.mock('../../reviews-aws-methods');

beforeEach(() => {
  jest.clearAllMocks();
});

afterAll(() => {
  mockApp.close();
});

const likeBody = {
  reviewId: '1',
  userId: 'user1',
  prevLike: 'dislike',
  currentLike: 'like',
};

const dislikeBody = {
  reviewId: '1',
  userId: 'user1',
  prevLike: 'like',
  currentLike: 'dislike',
};

const removelikeBody = {
  reviewId: '1',
  userId: 'user1',
  prevLike: 'like',
  currentLike: '',
};

const removeDislikeBody = {
  reviewId: '1',
  userId: 'user1',
  prevLike: 'dislike',
  currentLike: '',
};

test('responds with reviews', async () => {
  reviewMethods.getReviews.mockImplementation(() => ({
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

describe('like btn functionality', () => {
  test('adds like and removes dislike', async () => {
    await request(mockApp).post('/add-review').send(likeBody).expect(200);
    expect(reviewMethods.addLikeToReview).toBeCalled();
  });

  test('adds dislike and removes like', async () => {
    await request(mockApp).post('/add-review').send(dislikeBody).expect(200);
    expect(reviewMethods.addDislikeToReview).toBeCalled();
  });
  test('adds nothing and removes dislikelike', async () => {
    await request(mockApp).post('/add-review').send(removelikeBody).expect(200);
    expect(reviewMethods.removeLikeFromReview).toBeCalled();
  });
  test('adds nothing and removes like', async () => {
    await request(mockApp)
      .post('/add-review')
      .send(removeDislikeBody)
      .expect(200);
    expect(reviewMethods.removeDislikeFromReview).toBeCalled();
  });
});
