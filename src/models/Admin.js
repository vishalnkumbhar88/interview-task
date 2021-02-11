const Mongoose = require('mongoose');

const schema = new Mongoose.Schema({
  first_name: {
    type: String,
    maxLength: 60,
    required: true
  },
  last_name: {
    maxLength: 60,
    type: String
  },
  email: {
    type: String,
    maxLength: 60,
    required: true
  },
  password: {
    type: String,
    required: true
  },
  mobile: {
    type: Number,
    maxLength: 13
  },
  verification_link: {
    type: String,
    defaultsTo: ''
  },
  type: {
    type: String,
    isIn: ['admin', 'sub_admin'],
    defaultsTo: 'sub_admin'
  },
  password_reset_token_expire_at: {
    type: Number,
    description: 'A JS timestamp (epoch ms) representing the moment at which this user most recently interacted with the backend while logged in (or 0 if they have not interacted with the backend at all yet).',
    example: 1502844074211
  },
  status: {
    type: 'string',
    isIn: ['active', 'inactive', 'deleted'],
    defaultsTo: 'active'
  }

}, {
  timestamps: true

});

module.exports = Mongoose.model('Admin', schema);
