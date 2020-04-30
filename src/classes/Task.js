const axios = require('axios');

const Discord = require('./Discord')

const Seller = require('../models/Seller')

const Product = require('./Product')

class Task {
    constructor(taskSettings) {
        this.sellerUrl = taskSettings.url;
        this.firstRun = true;
        this.sellerId = taskSettings._id;
    }

    start = async () => {
        this.task = setInterval(async () => {

            try {
                const response = await axios.get(`https://${this.sellerUrl}/products.json`, {
                    responseType: 'json',
                })

                var products = response.data.products;

                if (this.firstRun) {
                    var newProducts = []

                    products.forEach(x => {
                        var product = new Product(x.id, this.sellerUrl);
                        product.updateInformation(x);

                        newProducts = [...newProducts, product];
                    });

                    await Seller.updateOne({ "_id": this.sellerId }, {
                        products: newProducts
                    });

                    this.firstRun = false;

                    console.log(`Connection done with ${this.sellerUrl}`)
                }
                else {
                    Seller.findById(this.sellerId, async (err, sellerQuery) => {
                        if (err) {
                            console.log('Seller not found')
                        }
                        else if (products.length === 0) {
                            console.log(`No products found in ${this.sellerUrl}`)
                        }
                        else {

                            var oldProducts = sellerQuery.products;
                            var newProducts = []
                            await products.forEach(async product => {
                                var found = oldProducts.find(x => x.id === product.id);

                                if(found){
                                    if(found.lastUpdate === product.updated_at){
                                        return;
                                    }

                                    var oldPr = new Product(found.id, found.sellerUrl, found.lastUpdate, found.handle, found.title, found.url, found.image, found.variants);
                                    var newPr = new Product(product.id, this.sellerUrl)
                                    newPr.updateInformation(product);

                                    if(oldPr.needToNotifyUpdate(newPr))
                                    {
                                        await Seller.updateOne({ _id: this.sellerId, "products.id": newPr.id }, { $set: { "products.$": newPr } });
                                        Discord.notifyProduct(newPr);
                                    }
                                    else {
                                        await Seller.updateOne({ _id: this.sellerId, "products.id": product.id }, { $set: { "products.$.lastUpdate": product.updated_at } });
                                    }
                                }
                                else {
                                    var newPr = new Product(product.id, this.sellerUrl)
                                    newPr.updateInformation(product)
                                    newProducts = [...newProducts, newPr]
                                    Discord.notifyProduct(newPr)
                                }                                
                            });

                            if (newProducts.length > 0) {
                                await Seller.updateOne({ _id: this.sellerId }, { $push: { "products": { $each: [...newProducts], $position: 0 } } })
                            }
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