const { Webhook, MessageBuilder } = require('discord-webhook-node');

const hook = new Webhook(global.config.webhook_url);

let Discord = {};

Discord.product = async (title, url, author, imageUrl, variants) => {
    if(variants.length == 0)
        return;

    const embed = new MessageBuilder().setTitle(title).setAuthor(author, imageUrl, url).setURL(url)
    .addField('Sizes', variants.map(x => x.title).join('\n'), true).addField('Price', variants[0].price, true).setImage(imageUrl); 

    hook.info(embed);
}

Discord.message = async (title) => {
    hook.send(title);
}

module.exports = Discord;