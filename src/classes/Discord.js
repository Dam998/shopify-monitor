const { Webhook, MessageBuilder } = require('discord-webhook-node');

const hook = new Webhook(global.config.webhook_url);

let Discord = {};

Discord.notifyProduct = async ({title, sellerUrl, image, url, variants}) => {
    if(variants.length == 0)
        return;

    const embed = new MessageBuilder().setTitle(title).setAuthor(sellerUrl, image, url).setURL(url)
    .addField('Sizes', variants.map(x => x.title).join('\n'), true).addField('Price', variants[0].price, true).setImage(image); 

    hook.send(embed);
}

Discord.info = async (title) => {
    hook.info(title);
}

module.exports = Discord;