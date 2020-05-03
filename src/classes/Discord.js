const { Webhook, MessageBuilder } = require('discord-webhook-node');

const Log = require('./Log')

if(global.config.webhook_url === ''){
    Log.Error('Discord webhook url cannot be empty, insert it in the config.json file')
    process.exit()
}

const hook = new Webhook(global.config.webhook_url);

const botSettings = global.config.discord_message_settings;
if(botSettings.botName && botSettings.botName != ""){
    hook.setUsername(botSettings.botName)
}

if(botSettings.botImage && botSettings.botImage != ""){
    hook.setAvatar(botSettings.botImage)
}

let Discord = {};

Discord.notifyProduct = async ({title, sellerUrl, image, url, variants, status}) => {
    const embed = new MessageBuilder().setTitle(title).setAuthor(sellerUrl, image, url).setURL(url);

    var availablesVariants = variants.filter(x => x.available);
    if(availablesVariants.length > 0){
        var sizesDescription = []
        sizesDescription.push("")
        var count = 0
    
        availablesVariants.forEach(x => {
            var toAdd = `${x.title} [[ATC](https://${sellerUrl}/cart/add?id=${x.id})]\n`
            if(sizesDescription[count].length + toAdd.length > 1024){
                sizesDescription.push(toAdd);
                count++;
            }
            else{
                sizesDescription[count] += toAdd;
            }
        })

        sizesDescription.forEach(x => {
            embed.addField('**Sizes**', x, true)
        })
    }

    embed.addField('**Price**', variants[0].price, true)

    if(status.length > 0){
        embed.addField('**Status**', status.join('\n'), true)
    }    

    embed.addField('**Links**', `[[Cart](https://${sellerUrl}/cart)]`, true).setThumbnail(image); 

    if(botSettings.footerDescription && botSettings.footerDescription != "" || botSettings.footerImage && botSettings.footerImage != ""){
        embed.setFooter(botSettings.footerDescription, botSettings.footerImage)        
    }    

    if(botSettings.timeOfNotification){
        embed.setTimestamp()
    }

    hook.send(embed);
}

Discord.info = async (title) => {
    hook.info(title);
}

module.exports = Discord;