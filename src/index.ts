require('dotenv').config()

import ConnectClient from './models/MongoClient';

import { initBot } from './Bot';
import { initUserLinks } from './models/UserLinks';

import App from './telegram/App';
// const BotApi = require('./Bot');
// const MongoDb = require('./MongoDb');
// const App = require('./telegram/App');
import { initUserState } from './models/UserState';
 
const init = () => {
    // const bot = new BotApi();
    const connectClient = new ConnectClient();

    connectClient.then(client => {

        initUserLinks(client);
        initUserState(client);
        initBot(process.env.TELEGRAM_TOKEN);


        console.log('Mongo is ready');
        new App();
    });
}

init();

