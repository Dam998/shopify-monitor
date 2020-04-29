const axios = require('axios');

const Discord = require('./Discord')

const Seller = require('../models/Seller')

class Task {
    constructor(taskSettings) {
        this.url = taskSettings.url;
        this.firstRun = true;
        this.sellerId = taskSettings._id;
    }

    start = async () => {
        this.task = setInterval(async () => {

            try {
                const response = await axios.get(`https://${this.url}/products.json`, {
                    responseType: 'json',
                })

                var products = response.data.products;

                if (this.firstRun) {
                    var newProducts = []

                    for (let i = 0; i < products.length; i++) {
                        newProducts.push({
                            url: `https://${this.url}/products/${products[i].handle}`,
                            lastUpdate: products[i].updated_at,
                            id: products[i].id
                        })
                    }

                    await Seller.updateOne({ "_id": this.sellerId }, {
                        products: newProducts
                    });

                    this.firstRun = false;
                    
                    console.log(`Connection done with ${this.url}`)
                }
                else {
                    Seller.findById(this.sellerId, async (err, sellerQuery) => {
                        if (err) {
                            console.log('Seller not found')
                        }

                        if (products.length === 0) {
                            return;
                        }

                        var oldProducts = sellerQuery.products;
                        var newProducts = []
                        await products.forEach(async product => {
                            var found = oldProducts.find(x => x.id === product.id);
                            if (found && found.lastUpdate === product.updated_at) {
                                return;
                            }

                            var prUrl = `https://${this.url}/products/${product.handle}`;

                            Discord.product(product.title, prUrl, this.url, product.images.length > 0 ? product.images[0].src : "", product.variants.filter(x => x.available))

                            if (found) {
                                await Seller.updateOne({ _id: this.sellerId, "products.id": product.id }, { $set: { "products.$.lastUpdate": product.updated_at } });
                            }
                            else {
                                var newPr = {
                                    url: prUrl,
                                    lastUpdate: product.updated_at,
                                    id: product.id
                                }
                                newProducts = [...newProducts, newPr]
                            }
                        });

                        if (newProducts.length > 0) {
                            await Seller.updateOne({ _id: this.sellerId }, { $push: { "products": { $each: [...newProducts], $position: 0 } } })
                        }
                    })
                }
            }
            catch (err) {
                console.log(err)
            }

        }, global.config.requestTiming)
    }
}

module.exports = Task;