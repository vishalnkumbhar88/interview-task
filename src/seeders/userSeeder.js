/**
 * This method adds records to the database
 */
const User = require('../models/User');
const Constant = require('../services/Constants');
const bcrypt = require('bcrypt');
module.exports = {
  run: () => new Promise((resolve) => {
    (async () => {
      User.create([
        {
          first_name : 'Vishal',
          last_name : 'k',
          email:'vishal@gmail.com',
          password :await bcrypt.hash('Vishal@123',10),
          status : Constant.ACTIVE
        },

      ]).then(() => {
        console.log('User seeder completed');
        resolve(true);
      }).catch((err1) => {
        console.log('User seeder error 1', err1);
      });
    })();
  })
};
