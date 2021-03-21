import { onMessage, onQuery, sendMsgTo, sendPhoto } from '../Bot';
import { addCarsLink, deleteManyCarLink, deleteOneCarLinkById, getCarsLinksByChatId, getCarsLinksById } from '../models/UserLinks';
import { addInitialUserState, updateStateStep, getUserState } from '../models/UserState';
import { carsLinksUpdate } from '../web-parcer/autoParsing';
import { checkPageLimit, parseLinksFromPages } from '../web-parcer/parser';
import Commands from './Commands';



class App {
    constructor(bot) {
        require('../web-parcer/autoParsing') // temp

        onMessage(this.newMsg);
        onQuery(this.newQuery)

        this._commanads = new Commands();
    };
    newMsg = async msg => {
        // console.log(msg)

        // getCarsLinksByChatId(msg.chat.id).then(e => console.log(e))
        // this._bot.sendPhoto(msg.chat.id, img.info, fileOptions)
        // https://stackoverflow.com/questions/35991698/telegram-bot-receive-photo-url/36166942
        const isCommand = msg.entities && msg.entities.some(el => el.type === 'bot_command');
 
        if (isCommand) {
            this._commanads.sendMsg(msg);
            // interupt
            return;
        }
        
        const state = await getUserState(msg.chat.id);

        // set initial state
        if (!state) await addInitialUserState(msg.chat.id);
        // set initial state



        // if state '' and link sended 
        if (state && !state.name && msg.text.includes('https://turbo.az/autos') && (msg.text.search(/utf8=/g) === 23 || msg.text.search(/q%5B/g) === 23)) {
            // check car limits
            const carlinks = await getCarsLinksByChatId(msg.chat.id);

            if (carlinks.length > 4) {
                sendMsgTo(msg.chat.id)('Maximum size of list is 5 remove one or connect with Administrations for unlock limits');
                return
            }   

            // check limit
            try {
                await checkPageLimit(msg.text, 10);
                
            } catch (error) {
                await sendPhoto(msg.chat.id, 'https://www.linkpicture.com/q/333Снимок.png')
                await sendMsgTo(msg.chat.id)('The pages in link more than 10, please send links up to 10 pages');
                
                await updateStateStep(msg.chat.id, '', 0, null);
                return;
            }

            // 

            await updateStateStep(msg.chat.id, 'sendedLink', 0, msg.text);

            sendMsgTo(msg.chat.id)('Enter the name of model cars');

            return;
        } else if (state && !state.name) {
            sendMsgTo(msg.chat.id)('Send correct link from turbo.az with filter cars for subscribing')
        }
        // 


        
        if (state && state.name === 'sendedLink') {
            // msg.text -> name of link 
            // state.data -> link
            const link = state.data;
            const name =  msg.text;

            if (name.length > 10) return sendMsgTo(msg.chat.id)('Name more than 10 symbols, write less')


            await sendMsgTo(msg.chat.id)(`Please wait`);
            // check cars in link
            const parsedLinks = await parseLinksFromPages(link, 10); 

            await addCarsLink(msg.chat.id, link, name, parsedLinks);



            await updateStateStep(msg.chat.id, '', 0, null);
    
            await sendMsgTo(msg.chat.id)(`link "${name}" subscribed! For see your cars list use /myCars command or paste another link for subscribing`);

            return 
        }

    }

    newQuery = async query => {
        const queryData = query.data && JSON.parse(query.data) || {};
        const { action, data } = queryData;

        if (action === 'remove') {
            deleteOneCarLinkById(data).then(res => {

                if (res.deletedCount) {
                   sendMsgTo(query.message.chat.id)(`Cars link removed! write /myCars for update list`)
                } else {
                    sendMsgTo(query.message.chat.id)(`This cars link cannot found in list`)
                }

            })
        }

        if (action === 'send') {
            getCarsLinksById(data).then(res => {
                sendMsgTo(query.message.chat.id)(res.carsLink);
            })
        }

        if (action === 'updateAll') {
            sendMsgTo(query.message.chat.id)(`Wait, update in process..`);

            const userLinks = await getCarsLinksByChatId(query.message.chat.id)

            await carsLinksUpdate(userLinks);

            sendMsgTo(query.message.chat.id)(`Update is done`);
        }
    }

};

export default App;
// module.exports = App;