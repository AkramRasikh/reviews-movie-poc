const { DocumentClient } = require("aws-sdk/clients/dynamodb");

const config = {
  convertEmptyValues: true,
  endpoint: "localhost:8000",
  sslEnabled: false,
  region: "local-env"
};

const mockDdb = new DocumentClient(config);

module.exports = {
  mockDdb
}