const { dynamoDB } = require('./dynamo');
const { generateReviews } = require('./generate-reviews');

let reviewsArr = [];

for (let i = 0; i < 2; i++) {
  const reviewItem = generateReviews();
  reviewsArr.push(reviewItem);
}

var params = {
  RequestItems: {
    reviews: reviewsArr,
  },
};

console.log('dynamoDB: ', dynamoDB);
dynamoDB.batchWriteItem(params, function (err, data) {
  if (err) console.log(err, err.stack);
  // an error occurred
  else console.log(data); // successful response
  /*
   data = {
   }
   */
});
