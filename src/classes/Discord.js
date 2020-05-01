const { Webhook, MessageBuilder } = require('discord-webhook-node');

const hook = new Webhook(global.config.webhook_url);
hook.setUsername('Shopify monitor')

let Discord = {};

Discord.notifyProduct = async ({title, sellerUrl, image, url, variants}) => {
    var availablesVariants = variants.filter(x => x.available);
    if(availablesVariants.length == 0)
        return;

    var sizesDescription = []
    sizesDescription.push("")
    var count = 0

    availablesVariants.forEach(x => {
        var toAdd = `${x.title} [[ATC](https://${sellerUrl}/cart/add.js?id=${x.id})]\n`
        if(sizesDescription[count].length + toAdd.length > 1024){
            sizesDescription.push(toAdd);
            count++;
        }
        else{
            sizesDescription[count] += toAdd;
        }
    })

    const embed = new MessageBuilder().setTitle(title).setAuthor(sellerUrl, image, url).setURL(url);

    sizesDescription.forEach(x => {
        embed.addField('Sizes', x, true)
    })

    embed.addField('Price', variants[0].price, true).addField('Links', `[[Cart](https://${sellerUrl}/cart)]`, true).setThumbnail(image); 

    hook.send(embed);
}

Discord.info = async (title) => {
    hook.info(title);
}

module.exports = Discord;