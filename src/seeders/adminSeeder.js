/**
 * This method adds records to the database
 */
const bcrypt = require('bcrypt');
const Admin = require('../models/Admin');

module.exports = {
  run: () => new Promise((resolve) => {
    (async () => {
      // empty the table
      bcrypt.hash('admin@123', 10, (err, adminPassword) => {
        if (err) {
          console.log('Admin seeder error', err);
          resolve(true);
        }
        Admin.create({
          first_name: 'Admin',
          last_name: 'Admin',
          email: 'admin@first.com',
          password: adminPassword,
          mobile: 0,
          type: 'admin',
          status: 'active'
        }).then(() => {
          console.log('Admin seeder completed');
          resolve(true);
        }).catch((err1) => {
          console.log('Admin seeder error 1', err1);
        });
      });
    })();
  })
};
