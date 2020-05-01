const { Webhook, MessageBuilder } = require('discord-webhook-node');

const hook = new Webhook(global.config.webhook_url);
hook.setUsername('Shopify monitor')

let Discord = {};

Discord.notifyProduct = async ({title, sellerUrl, image, url, variants}) => {
    var availablesVariants = variants.filter(x => x.available);
    if(availablesVariants.length == 0)
        return;

    const embed = new MessageBuilder().setTitle(title).setAuthor(sellerUrl, image, url).setURL(url)
    .addField('Sizes', availablesVariants.map(x => {
        var title = x.title;
        if(title.indexOf(',') > -1){
            title = title.split(',')[0]
        }
        else if(title.indexOf(':') > -1){
            title = title.split(':')[0]
        }
        return `${title} [[ATC](https://${sellerUrl}/cart/add.js?id=${x.id})]`
    }).join('\n'), true).addField('Price', variants[0].price, true)
    .addField('Links', `[[Cart](https://${sellerUrl}/cart)]`).setThumbnail(image); 

    hook.send(embed);
}

Discord.info = async (title) => {
    hook.info(title);
}

module.exports = Discord;