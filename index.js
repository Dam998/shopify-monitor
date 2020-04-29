
global.config = require('./config')

const mongoose = require('mongoose');

const Task = require('./src/classes/Task.js');
const Seller = require('./src/models/Seller');

mongoose.connect(global.config.mongodb_uri, { useNewUrlParser: true, useUnifiedTopology: true });

Seller.deleteMany({}, (err) => {
    if (!err) {

        Seller.insertMany(global.config.sites, (err) => {

            if(!err){
                Seller.find({}, (err, tasksQuery) => {
                    for (let i = 0; i < tasksQuery.length; i++) {
                        new Task(tasksQuery[i]).start();
                    }
                });
            }

        })
    }
});