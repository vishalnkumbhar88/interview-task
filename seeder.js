/**
 * @description This page is created for seed data
 */
require('./src/Config/enviroment');
require('./server');
require('./src/Config/database');
const seeder = require('./src/seeders/seeder');

const promises = [];
seeder.forEach((seed) => {
  // eslint-disable-next-line global-require,import/no-dynamic-require
  promises.push(require(`./src/seeders/${seed}Seeder.js`)
    .run());
});
Promise.all(promises)
  .then(() => {
    console.log('All seeders completed');
  }, (err) => {
    console.error('Seeder error', err);
  });
