const mongoose = require('mongoose');

const sellerSchema = new mongoose.Schema({
	url: String,
    products: [{}],
});

const Seller = mongoose.model('Seller', sellerSchema);
module.exports = Seller;