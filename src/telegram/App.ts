import { editMsg, onMessage, onQuery, sendMsgTo, sendPhoto } from '../Bot';
import { addUserLink, deleteManyUsersLinks, deleteOneUserLinkById, getUserLinksByChatId, getUserLinksById, updateParsedLinks, updateUserLinksName } from '../models/UserLinks';
import { addInitialUserState, updateStateStep, getUserState } from '../models/UserState';
import { userLinksUpdate } from '../web-parser/autoParsing'; // must be loaded lazy
import { checkPageLimit, parseLinksFromPages } from '../web-parser/parser';
import Commands from './Commands';
import AnimateText from './AnimateText';
import { mergeArray } from '../web-parser/utils';
import { getReplyKeyboard } from './keyboards';

// middleWares - next()
class App {
    readonly _commanads: any
    constructor() {
        require('../web-parser/autoParsing') // temp

        onMessage(this.newMsg);
        onQuery(this.newQuery)
        
        this._commanads = new Commands();
    };
    newMsg = async (msg: any) => { 
        // getUserLinksByChatId(msg.chat.id).then(e => console.log(e))
        // this._bot.sendPhoto(msg.chat.id, img.info, fileOptions)
        // https://stackoverflow.com/questions/35991698/telegram-bot-receive-photo-url/36166942
        const isCommand = msg.entities && msg.entities.some(el => el.type === 'bot_command');
 
        if (isCommand) {
            this._commanads.sendMsg(msg);
            // interupt
            await updateStateStep(msg.chat.id, '', null);
            return;
        }
        
        const state = await getUserState(msg.chat.id);

        // set initial state
        if (!state) await addInitialUserState(msg.chat.id);
        // set initial state



        // if state '' and link sended 
        if (state && !state.name && msg.text.includes('https://turbo.az/autos') && (msg.text.search(/utf8=/g) === 23 || msg.text.search(/q%5B/g) === 23 || msg.text.search(/q%5B/g) === 30)) {
            // check car limits
            const carlinks = await getUserLinksByChatId(msg.chat.id);

            if (carlinks.length > 10) {
                sendMsgTo(msg.chat.id)('Maximum size of list is 10 remove one or connect with Administrations for unlock limits');
                return
            }   

            // check limit
            try {
                await checkPageLimit(msg.text, 10);
                
            } catch (error) {
                await sendPhoto(msg.chat.id, 'https://www.linkpicture.com/q/333Снимок.png')
                await sendMsgTo(msg.chat.id)('The pages in link more than 10, please send links up to 10 pages');
                
                await updateStateStep(msg.chat.id, '', null);
                return;
            }

            // 
            const keyboard = getReplyKeyboard([['/cancel']]);

            await updateStateStep(msg.chat.id, 'sendedLink', msg.text);

            sendMsgTo(msg.chat.id)('Enter the name of model cars', keyboard);

            return;
        } else if (state && !state.name) {
            const keyboard = getReplyKeyboard([['/info']]);

            sendMsgTo(msg.chat.id)('Send correct link from turbo.az with filter cars for subscribing, type /info for how', keyboard)
        }
        // 

        
        if (state && state.name === 'sendedLink') {
            // msg.text -> name of link 
            // state.data -> link
            const link = state.data;
            const name =  msg.text;

            if (name.length > 30) return sendMsgTo(msg.chat.id)('Name more than 30 symbols, write less')


            const { message_id } = await sendMsgTo(msg.chat.id)(`Please wait`);
            // check cars in link
            const animation = new AnimateText({
                frameMs: 500,
                animationCallback: text => editMsg(msg.chat.id, message_id, 'Please wait' + text ),
                animation: ['.', '.', '.']
            })
 
            animation.startLinearAnimate();

            const parsedLinks = await parseLinksFromPages(link, 10); 

            await addUserLink(msg.chat.id, link, name, parsedLinks);

            await updateStateStep(msg.chat.id, '', null);

            animation.stopAnimate()

            const keyboard = getReplyKeyboard([['/myCars']]);
            
            await sendMsgTo(msg.chat.id)(`link "${name}" subscribed! For see your cars list use /myCars command or paste another link for subscribing`, keyboard);

            return 
        }

        if (state && state.name === 'renameUserLinks') {
            const name = msg.text;
            if (name.length > 30) return sendMsgTo(msg.chat.id)('Name more than 30 symbols, write less');

            await updateUserLinksName(state.data, name);

            await updateStateStep(msg.chat.id, '', null);

            sendMsgTo(msg.chat.id)('Renamed successfully! write /myCars for update list');
        }
    }
    
    newQuery = async (query: any) => {
        const queryData = query.data && JSON.parse(query.data) || {};
        const { action, data } = queryData;

        if (action === 'remove') {
            deleteOneUserLinkById(data).then(res => {

                if (res.deletedCount) {
                   sendMsgTo(query.message.chat.id)(`Cars link removed! write /myCars for update list`)
                } else {
                    sendMsgTo(query.message.chat.id)(`This cars link cannot found in list`)
                }

            })
        }

        if (action === 'send') {
            getUserLinksById(data).then(res => {
                sendMsgTo(query.message.chat.id)(res.carsLink);
            })
        }

        if (action === 'rename') {
            const keyboard = getReplyKeyboard([['/cancel']]);

            await sendMsgTo(query.message.chat.id)('write new name', keyboard);
            await updateStateStep(query.message.chat.id, 'renameUserLinks', data); // data -> _id
        }

        if (action === 'updateAll') {
            const { message_id } = await sendMsgTo(query.message.chat.id)(`Wait, update in process`);
            
            const animation = new AnimateText({
                frameMs: 500,
                animationCallback: text => editMsg(query.message.chat.id, message_id, 'Wait, update in process ' + text ),
                animation: ['/', '-', '\\', '|']
            })
 
            animation.startFrameAnimate();

            const allUserLinks = await getUserLinksByChatId(query.message.chat.id)

            await userLinksUpdate(allUserLinks, async (compareResult, index) => {
                const userLinks = allUserLinks[index];
                let msg = ''

                if (compareResult.added.length) {
                    msg += '\nThis car(s) has been added:\n'
                    compareResult.added.forEach(el => {
                        msg += `\nhttps://turbo.az/autos/${el}\n`
                    })
                    msg += `*${'-'.repeat(66)}*`
                }
            
                if (compareResult.removed.length) {
                    msg += '\nThis car(s) has been removed:\n'
                    compareResult.removed.forEach(el => {
                        msg += `\nhttps://turbo.az/autos/${el}\n`
                    })
                    msg += `*${'-'.repeat(66)}*`
                }
                
                const updatedLinks = mergeArray(userLinks.parsedLinks, compareResult)

                await updateParsedLinks(userLinks._id, updatedLinks)

                // let valueOfMessages = msg.length / 4000 
                if (msg.length > 4000) {
                    msg = msg.substring(0, 3800) + '....' 
                }

                await sendMsgTo(userLinks.chatId)(`From ${userLinks.name}:\n${msg}` + (!msg ? ' No changes': ''))
            });

            animation.stopAnimate();

            sendMsgTo(query.message.chat.id)(`Update is done`);
        }
    }

};

export default App;
// module.exports = App;