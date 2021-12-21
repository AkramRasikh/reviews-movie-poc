const { dynamoDB } = require('./aws/dynamo');
const { createTables } = require('./aws/create-table');
const { generateReviews } = require('./aws/generate-reviews');

let reviewsArr = [];

for (let i = 0; i < 2; i++) {
  const reviewItem = generateReviews();
  reviewsArr.push(reviewItem);
}

const params = {
  RequestItems: {
    reviews: reviewsArr,
  },
};

const generateDynamodbReviews = async () => {
  try {
    await dynamoDB.batchWriteItem(params).promise();
  } catch (error) {
    console.log('error generating reviews: ', err);
  }
};

createTables()
  .then(() => generateDynamodbReviews())
  .catch((err) => console.log('err setting up: ', err));
