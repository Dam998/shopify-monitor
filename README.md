# Shopify monitor

## Information
This is a very simple and powerful shopify monitor script

Follow the few steps below to set the environment and start the monitor

### Before we start: requirements

#### Git

If you didn't install git before, do it, now! --> [git](https://git-scm.com/downloads)

#### Npm & Node js

If you don't have installed npm or node js go to this page: [node js](https://nodejs.org/it/download/) download and install node js

#### Mongo DB

You can install mongo db following this guide: [mongo db](https://docs.mongodb.com/manual/administration/install-community/)
If you need some help to install it you can see this video https://www.youtube.com/watch?v=FwMwO8pXfq0&t=552s

### Prepare the environment

Open your cmd and run

```node
git clone git@github.com:Dam998/shopify-monitor.git
```

Open the config.json file: add shopify sites and set your discord webhook url (if you want you can also edit the request timing, I recommend to don't do it, it's not necessary, if you decrease that time you can be banned from the site)

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

## TODO List

| **Done** | **News** | **Version** |
| -------- | -------- | ----------- |
| ✅ | First basic version of the monitor with notification on discord | **version 1** |
| ✅ | Implement an algorithm  to improve the search for new or modified products and avoid spam | **version 1.1** |
| 🚧 | Notify and manage if a site bans you | **version 1.2** |
| | Keywords to filter products | **version 1.3** |
| | Possibility to filter products by type (like footwear etc) | **version 1.4** |
| | Possibility to use proxies | **version 2** |
| | more ... | **version ...** |


#### Send me a message if you have ideas or problem, I am here
