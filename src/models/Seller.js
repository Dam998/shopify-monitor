const mongoose = require('mongoose');

const sellerSchema = new mongoose.Schema({
	url: String,
	lastIdItemAdded: Number,
	dateAdded: Date,
    storeHash: String,
    products: [{}],
});

const Seller = mongoose.model('Seller', sellerSchema);
module.exports = Seller;