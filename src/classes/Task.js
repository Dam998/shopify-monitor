const axios = require('axios');

const Discord = require('./Discord')

const Seller = require('../models/Seller')

const Product = require('./Product')

const Log = require('./Log')

class Task {
    constructor(taskSettings) {
        this.sellerUrl = taskSettings.url;
        this.firstRun = true;
        this.sellerId = taskSettings._id;
        this.banCount = 0.5;
        this.keywords = taskSettings.keywords.concat(global.config.keywords);
    }

    start = async () => {
        this.task = setInterval(async () => {

            try {
                const response = await axios.get(`https://${this.sellerUrl}/products.json`, {
                    responseType: 'json',
                })

                this.banCount = 0.5;

                var products = response.data.products;

                if (this.firstRun) {
                    var newProducts = []

                    if (this.keywords.length > 0) {
                        products = this.productsToCheck(products)
                    }

                    products.forEach(x => {
                        var product = new Product(x.id, this.sellerUrl);
                        product.updateInformation(x);

                        newProducts = [...newProducts, product];
                    });

                    await Seller.updateOne({ _id: this.sellerId }, {
                        products: newProducts
                    });

                    this.firstRun = false;

                    Log.Info(`Connection done with ${this.sellerUrl}`);
                }
                else {
                    Seller.findById(this.sellerId, async (err, sellerQuery) => {
                        if (err) {
                            Log.Warning('Seller not found');
                        }
                        else if (products.length === 0) {
                            Log.Warning(`No products found in ${this.sellerUrl}`);
                        }
                        else {

                            var oldProducts = sellerQuery.products;
                            var newProducts = []

                            if (this.keywords.length > 0) {
                                products = this.productsToCheck(products)
                            }

                            await products.forEach(async product => {
                                var found = oldProducts.find(x => x.id === product.id);

                                if (found) {
                                    if (found.lastUpdate === product.updated_at) {
                                        return;
                                    }

                                    var oldPr = new Product(found.id, found.sellerUrl, found.lastUpdate, found.handle, found.title, found.url, found.image, found.variants);
                                    var newPr = new Product(product.id, this.sellerUrl)
                                    newPr.updateInformation(product);

                                    if (oldPr.needToNotifyUpdate(newPr)) {
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
                if (err.response && (err.response.status === 430 || err.response.status === 429)) {
                    this.banCount += 0.5;
                    Log.Warning(`Ban occurred [${this.sellerUrl}] - Retry after ${60 * this.banCount} seconds`)
                    clearInterval(this.task);
                    setTimeout(() => {
                        this.start()
                    }, 60000 * this.banCount)
                }
                else if (err.response && err.response.status === 403) {
                    Log.Error(`${this.sellerUrl} has an high level of protection from monitors, please notify Dam998 by opening an issue on github [https://github.com/Dam998/shopify-monitor]`);
                    clearInterval(this.task)
                }
                else if (err.code === 'ETIMEDOUT') {
                    Log.Error(`Timeout occurred, a node js script cannot manage a lot of requests in the same time (I raccomand max 10 sites for script's istance, to stay more safe), please start more that 1 monitor with splitted sites or contact Dam998 for help [https://github.com/Dam998/shopify-monitor]`);
                    clearInterval(this.task)
                }
                else {
                    console.log(err)
                }
            }

        }, global.config.requestTiming)
    }

    productsToCheck = (products) => {
        return products.filter(product => {
            for (var keys of this.keywords) {
                var check = true;
                for (var key of keys) {
                    if (product.title.toLowerCase().indexOf(key.toLowerCase()) === -1
                        && !product.tags.some(tag => tag.toLowerCase().indexOf(key.toLowerCase()) > -1)) {
                        check = false;
                        break;
                    }
                }

                if (check) {
                    return true;
                }
            }
            return false;
        })
    }
}

module.exports = Task;