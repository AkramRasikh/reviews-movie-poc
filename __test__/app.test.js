// const request = require('supertest');
// const { app: mockApp } = require('../app');
// const paymentMethods = require('../payment-aws-methods');
// jest.mock('../payment-aws-methods');
// jest.mock('uuid', () => ({ v1: () => 'hjhj87878' }));

// beforeEach(() => {
//   jest.clearAllMocks();
// });

// it('responds with payments', async () => {
//   paymentMethods.getPayments.mockImplementation(() => ({
//     Items: [{ paymentId: 1, amount: 1000 }],
//   }));
//   await request(mockApp)
//     .get('/')
//     .expect(200)
//     .expect([{ paymentId: 1, amount: 1000 }]);
// });

// it('add payment responds with 200', async () => {
//   const amount = 1234;
//   await request(mockApp).post('/').send({ amount }).expect(200);
//   expect(paymentMethods.addPayment).toHaveBeenCalledWith(amount);
// });

// it('add payment responds with 422 when no body passed', async () => {
//   await request(mockApp).post('/').expect(422);
//   expect(paymentMethods.addPayment).not.toHaveBeenCalled();
// });
