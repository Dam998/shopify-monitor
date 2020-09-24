# Shopify monitor

## Information
This is a very simple and powerful shopify monitor script\
Because is always uptodate, extremely lightweight and efficient, this shopify monitor is better than a lot of paid monitor, COVID-19 brings also good things

### Notification example

This is an example of discord notification that monitor will send to you

![image](https://github.com/Dam998/shopify-monitor/blob/master/discord%20example.png)

**ATC** and **Cart** are very usefull links\
If you click the ATC link the site'll add automatically the corresponding product in your cart, then you can click the Cart link to jump istantly to the cart with the product already inside

These links are very useful for speeding up the purchase of products


Follow the few steps below to set the environment and start the monitor

### Before we start: requirements

#### Git

If you didn't install git before, do it, now! --> [git](https://git-scm.com/downloads)

#### Npm & Node js

If you don't have installed npm or node js go to this page: [node js](https://nodejs.org/it/download/) download and install node js

#### Mongo DB

You can install mongo db following this guide: [mongo db](https://docs.mongodb.com/manual/administration/install-community/)

If you need some help to install it you can see this video https://www.youtube.com/watch?v=FwMwO8pXfq0&t=552s

#### NOTE: I've git version 2.26.2, node js version 12.16.3, mongodb version 4.2.6. If you have any problems with the monitor, try to update your setup with my versions

### Prepare the environment

Open your cmd and run

```node
git clone https://github.com/Dam998/shopify-monitor.git
```

Before edit the config.json please read the **Configuration settings** below because, if you mistake to edit it, the monitor could not start or not work propertly

Then go inside the project folder and run:

```node
npm install
```

### Start the monitor

To start the monitor run this:

```node
npm start
```

That's all, the shopify monitor has been started, if it finds a product it will notify you on discord

When the monitor starts it sends a discord message, if you don't receive a discord message from the monitor it means there is a problem with the webhook url

## Configuration settings
Open the config.json file and be careful to follow the rules below for proper operation

  - **mongodb_uri**: don't modify this url, it's not necessary, leave it like you found it.
  - **webhook_url**: this field is an array of string, here you have to add your discord webhook url, monitor'll notify you at this url. because is a array you can add more than 1 webhhok url
  - **discord_message_settings**: this field rappresent an object that permit you to customize discord message:
      - **botImage:** this rappresent the image of the bot, insert here an absolute URL to change it
      - **botName:** this rappresent the name of the bot
      - **footerDescription:** here you can insert a footer description
      - **footerImage:** here you can insert an absolute URL to add an image to the footer. NB: footer image will not display if description is empty
      - **timeOfNotification:** this is a boolean value (true or false), if true you'll see the time of notification in the message's footer
  - **requestTiming**: this field means after how many milliseconds the monitor sniff the sites to find new products, I reccomand to leave this at least at 30000 because if you don't use proxies easy that site could ban you (I'll implement proxies in v.2) however I have implemented an algoritm to unban the monitor if ban occurred but you lose some time.
  - **keywords**: this field are an array of array, here you can specify keywords to filter products to notify, this field work over all sites specified in the config.json file.\
  **How to use it?** This is an example of array in array\
  **[["Adidas"],["New Balance"],["Nike","Jordan"]]**\
  If I write this I mean that I'll monitor all adidas products, all new balance products and all nike jordan products in the sites, because nike and jordan are in AND and not in OR. So, for example, if I want notify only if the monitor find Adidas Yeezy 350 or Adidas Yeezy 380 I'll write:\
  **[["Adidas","Yeezy","350"],["Adidas","Yeezy","380"]]**\
  Maybe this is not easy to understand to all, if you have any dubts, please, open an issue, I'll explain it better with more examples.\
  **NB: If you don't want use keywords don't specify the field keywords**\
  **TIPS:** 
    - If you want search nike jordan please not write like this [["Nike Jordan"]] but write this [["Nike"],["Jordan"]] because you have a lot of more possibility to not mistake and skip an important notification
    - The keywords are not keysensitive so there is no difference beetween Nike or nike
     
  
  - **sites**: this field is an array of objects, in each object you can specify 2 fields: 
      - **url:** this rappresent the site's url
      - **keywords:** here you can insert an array of array to filter products for the specified site before. The rules for the keywords are the same explained.

  - **proxiesList:** this field is an array of proxies, **only ipv4 are supported**. Please don't use free proxies found online because they are (always) shit, don't spent time to search them, a good proxy cost only some cents. Insert proxies in this format: ["http://{username}:{password}@{host}:{port}", "http://{username}:{password}@{host}:{port}"]\
  **TIP:** If normally you setted the requestTiming field to 30000 with only 2 proxies you can set it to 10000 (10 seconds) because 1 ip used is from your pc/server and 2 from proxies

## TODO List

| **Done** | **News** | **Version** |
| -------- | -------- | ----------- |
| ✅ | First basic version of the monitor with notification on discord | **version 1** |
| ✅ | Implement an algorithm  to improve the search for new or modified products and avoid spam | **version 1.1** |
| ✅ | Add usefull links to the discord's notifications (like atc and cart links) | **version 1.2** |
| ✅ | Manage if a site bans you | **version 1.3** |
| ✅ | Create a very useful log management for the notification of important informations | **version 1.3.1** |
| ✅ | Keywords to filter products | **version 1.4** |
| ✅ | Possibility to customize discord messages | **version 1.4.1** |
| ✅ | Possibility to add more webhook url in the same script | **version 1.4.2** |
| ✅ | Possibility to use proxies | **version 1.5** |
| ✅ | possibility to monitor hundreds of more products simultaneously with only 1 script run | **version 1.5.1** |
| | more ... | **version ...** |


#### Send me a message if you have ideas or problem, I am here

## License
This project is licensed under the MIT License - see the [LICENSE](https://github.com/Dam998/shopify-monitor/blob/master/LICENSE) file for details
