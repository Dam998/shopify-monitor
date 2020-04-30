class Product {
    constructor(id, sellerUrl, lastUpdate = "", handle = "", title = "", url = "", image = "", variants = []) {
        this.id = id;
        this.sellerUrl = sellerUrl;
        this.lastUpdate = lastUpdate;
        this.handle = handle;
        this.title = title;
        this.url = url;
        this.image = image;
        this.variants = variants;
    }

    updateInformation = (shopifyInfo) => {
        this.lastUpdate = shopifyInfo.updated_at;
        this.handle = shopifyInfo.handle;
        this.image = shopifyInfo.images.length > 0 ? shopifyInfo.images[0].src : "";

        this.title = shopifyInfo.title;
        this.url = `https://${this.sellerUrl}/products/${this.handle}`;

        this.variants = [];
        shopifyInfo.variants.forEach(x => {
            this.variants = [...this.variants, {
                id: x.id,
                title: x.title,
                price: x.price,
                available: x.available
            }]
        });
    }

    needToNotifyUpdate = (product) => {
        var needToNotifyUpdate = this.id != product.id
                                || this.sellerUrl != product.sellerUrl
                                || this.handle != product.handle
                                || this.url != product.url
                                || this.image != product.image
                                || this.title != product.title
                                || this.variants.length != product.variants.length;
        if(needToNotifyUpdate){
            return true;
        }

        for (let i = 0; i < this.variants.length; i++) {
            var oldV = this.variants[i]
            var newV = product.variants[i]

            if(oldV.id != newV.id
                || oldV.title != newV.title
                || oldV.price != newV.price
                || oldV.available != newV.available){
                    needToNotifyUpdate = true;
                    break;
                }                
        }
        
        return needToNotifyUpdate;
    }
}

module.exports = Product;