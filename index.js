
global.config = require('./config')

const mongoose = require('mongoose');

const Task = require('./src/classes/Task.js');
const Seller = require('./src/models/Seller');

const Discord = require('./src/classes/Discord')

mongoose.connect(global.config.mongodb_uri, { useNewUrlParser: true, useUnifiedTopology: true });

try {
    Seller.deleteMany({}, (err) => {
        if (!err) {
    
            Seller.insertMany(global.config.sites, (err) => {
    
                if(!err){
                    Seller.find({}, (err, tasksQuery) => {
                        for (let i = 0; i < tasksQuery.length; i++) {
                            setTimeout(() => {
                                new Task(tasksQuery[i]).start();
                            }, 4000 * i)                            
                        }
    
                        Discord.info('Monitor successfully started, relax and stay tuned\n\nFor help open an issue on github: https://github.com/Dam998/shopify-monitor');
                    });
                }
    
            })
        }
    });
}
catch(err) {
    console.log(err)
}