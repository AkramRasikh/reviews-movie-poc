const { createTables } = require('./create-table');

createTables()
  .then(() => console.log('table generated'))
  .catch((err) => console.log('err: ', err));
