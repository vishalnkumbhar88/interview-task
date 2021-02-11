/**
 * This method adds records to the database
 */
const Question = require('../models/Question');
module.exports = {
    run: () => new Promise((resolve) => {
        (async () => {
            Question.create([
                {
                  question:'what is node js',
                    answer: 'nodejs is open source,cross platform javascript runtime V8 engine',
                    user_id:'60240afd5fe36a2a7849c484',
                },
                {
                    question:'when node js develop?',
                    answer: 'In Year 2009 ',
                    user_id:'60240afd5fe36a2a7849c484',
                },
                {
                    question:'which method is used in mongodb for count documents',
                    answer: 'db.collection.count()',
                    user_id:'60240afd5fe36a2a7849c484',
                },

            ]).then(() => {
                console.log('Question seeder completed');
                resolve(true);
            }).catch((err1) => {
                console.log('Question seeder error 1', err1);
            });
        })();
    })
};
