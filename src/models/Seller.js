const mongoose = require('mongoose');

const sellerSchema = new mongoose.Schema({
    url: String,
    keywords: [],
    products: [{}],
});

const Seller = mongoose.model('Seller', sellerSchema);
module.exports = Seller;