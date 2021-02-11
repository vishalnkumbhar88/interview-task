const Mongoose = require('mongoose');

const schema = new Mongoose.Schema({
  first_name: {
    type: String,
    maxLength: 60,
    required: true
  },
  last_name: {
    type: String,
    maxLength: 60,
    required: true
  },
  email: {
    type: String,
    maxLength: 120,
    required: true
  },
  password: {
    type: String,
    required: true
  },

  status: {
    type: 'string',
    isIn: ['active', 'inactive', 'unverified'],
    defaultsTo: 'unverified'
  },
}, {
  timestamps: true
});

module.exports = Mongoose.model('User', schema);
