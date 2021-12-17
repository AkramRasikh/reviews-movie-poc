const request = require('supertest');
const { app: mockApp } = require('../app');
const reviewMethods = require('../reviews-aws-methods');
jest.mock('../reviews-aws-methods');

beforeEach(() => {
  jest.clearAllMocks();
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

it('responds with reviews', async () => {
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
  it('adds like and removes dislike', async () => {
    await request(mockApp).post('/add-review').send(likeBody).expect(200);
    expect(reviewMethods.addLikeToReview).toBeCalled();
  });

  it('adds dislike and removes like', async () => {
    await request(mockApp).post('/add-review').send(dislikeBody).expect(200);
    expect(reviewMethods.addDislikeToReview).toBeCalled();
  });
  it('adds nothing and removes dislikelike', async () => {
    await request(mockApp).post('/add-review').send(removelikeBody).expect(200);
    expect(reviewMethods.removeLikeFromReview).toBeCalled();
  });
  it('adds nothing and removes like', async () => {
    await request(mockApp)
      .post('/add-review')
      .send(removeDislikeBody)
      .expect(200);
    expect(reviewMethods.removeDislikeFromReview).toBeCalled();
  });
});
