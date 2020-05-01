const { Webhook, MessageBuilder } = require('discord-webhook-node');

const hook = new Webhook(global.config.webhook_url);
hook.setUsername('Shopify monitor')

let Discord = {};

Discord.notifyProduct = async ({title, sellerUrl, image, url, variants}) => {
    var availablesVariants = variants.filter(x => x.available);
    if(availablesVariants.length == 0)
        return;
        
    var sizesDescription = ""
    var truncate = false;
    var sizesDescription2 = ""
    availablesVariants.forEach(variant => {
        var toAdd = `${variant.title} [[ATC](https://${sellerUrl}/cart/add.js?id=${variant.id})]\n`
        if(truncate || sizesDescription.length + toAdd.length > 1024) {
            truncate = true;
            sizesDescription2 += toAdd;
        }
        else {
            sizesDescription += toAdd;
        }
    });

    const embed = new MessageBuilder().setTitle(title).setAuthor(sellerUrl, image, url).setURL(url)
    .addField('Sizes', sizesDescription, true)
    
    if(truncate){
        embed.addField('Sizes', sizesDescription2, true)
    }

    embed.addField('Price', variants[0].price, true)
    .addField('Links', `[[Cart](https://${sellerUrl}/cart)]`, true).setThumbnail(image); 

    hook.send(embed);
}

Discord.info = async (title) => {
    hook.info(title);
}

module.exports = Discord;