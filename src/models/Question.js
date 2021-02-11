const Mongoose = require('mongoose');

const schema = new Mongoose.Schema({
    question: {
        type: String
    },
    user_id: {
        type: Mongoose.Types.ObjectId,
        ref: 'User'
    },
    answer: {
        type: String
    },
}, {
    timestamps: true
});

module.exports = Mongoose.model('Question', schema);
