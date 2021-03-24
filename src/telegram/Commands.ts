import { sendMsgTo, sendPhoto } from "../Bot";
import { getUserLinksByChatId } from "../models/UserLinks";
import { updateStateStep } from "../models/UserState";
import { UserLinksInterface } from "../types";
import { getInlineKeyboard, getReplyKeyboard, KeysType } from "./keyboards";


class Commands {
    sendMsg = msg => {
        const sendMsg = sendMsgTo(msg.chat.id)

        switch (msg.text) {
            case '/start':
                const keyboard = getReplyKeyboard([['/info']]);
                return sendMsg('Hi this bot subscribes to the car links and notify you if new Car uploded or selled in Turbo.az, type /info for how get this link', keyboard);
            case '/myCars':
                return getUserLinksByChatId(msg.chat.id).then(userLinks => {
                    if (userLinks.length) {
                        let newMsg = ''
                        const keys: Array<Array<KeysType>> = userLinks.map((el: UserLinksInterface, i: number): Array<KeysType> => {
                            return [
                                {
                                    text: (i + 1) + ') send link ' ,
                                    callback_data: JSON.stringify({
                                        action: 'send',
                                        data: el._id
                                    })
                                },
                                {
                                    text: 'rename',
                                    callback_data: JSON.stringify({
                                        action: 'rename',
                                        data: el._id
                                    })
                                },
                                {
                                    text: 'delete',
                                    callback_data: JSON.stringify({
                                        action: 'remove',
                                        data: el._id,
                                    })
                                }
                            ]
                        }) 

                        keys.push(
                            [
                                {
                                    text: 'Check all changes',
                                    callback_data: JSON.stringify({
                                        action: 'updateAll',
                                        data: '',
                                    })
                                }
                            ]
                        )

                        const keyboard = getInlineKeyboard(keys)

                       
                        userLinks.forEach((el: UserLinksInterface, i: number) => {
                            newMsg += `${i + 1}) Name: ${el.name}\n\tLast update time: ${new Date(el.updateParsedTime).toLocaleString()}\n\tNumber of subscribed cars: ${el.parsedLinks.length}\n`
                        });

                        sendMsg(newMsg, keyboard);
                    } else {
                        sendMsg('There is no cars yet :(');
                    }

                });
            case '/info':
                sendMsg('Filtrate your cars and send link, be carefull link must be up to 10 pages')
                return sendPhoto(msg.chat.id, 'https://linkpicture.com/q/info.jpg');     
            case '/cancel':
                updateStateStep(msg.chat.id, '', null);
                sendMsg('actions canceled!');
                return updateStateStep(msg.chat.id, '', null);   
            default:
                return sendMsg('Unknown command');
        }
    }

    // addUserLinkDb = (msg) => this._db.addUserLink(msg.chat.id, msg.text).then(e => this._bot.sendMsgTo(msg.chat.id, 'link subscribed! For see your cars list use /myCars command'))

};

export default Commands;
// module.exports = Commands;